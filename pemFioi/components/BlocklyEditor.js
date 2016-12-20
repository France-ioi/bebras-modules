/*!
 * @author John Ropas
 * @since 17/12/2016
 */

// We need to be able to clean all events
if (EventTarget.prototype.addEventListenerBase == undefined) {
  EventTarget.prototype.addEventListenerBase = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener) {
    if (!this.EventList) {
      this.EventList = [];
    }
    this.addEventListenerBase.apply(this, arguments);
    if (!this.EventList[type]) {
      this.EventList[type] = [];
    }
    var list = this.EventList[type];
    for (var index = 0; index != list.length; index++) {
      if (list[index] === listener) {
        return;
      }
    }
    list.push(listener);
  };

  EventTarget.prototype.removeEventListenerBase = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.removeEventListener = function (type, listener) {
    if (!this.EventList) {
      this.EventList = [];
    }
    if (listener instanceof Function) {
      this.removeEventListenerBase.apply(this, arguments);
    }
    if (!this.EventList[type]) {
      return;
    }
    var list = this.EventList[type];
    for (var index = 0; index != list.length;) {
      var item = list[index];
      if (!listener) {
        this.removeEventListenerBase(type, item);
        list.splice(index, 1);
        continue;
      }
      else if (item === listener) {
        list.splice(index, 1);
        break;
      }
      index++;
    }
    if (list.length == 0) {
      delete this.EventList[type];
    }
  };
}

var highlightPause = false;

function BlocklyEditor(includeBlocks, mainContext) {

  this._includedAll = true;
  this._includedCategories = [];

  this._availableVariables = [];
  this._includeBlocks = includeBlocks;
  this.setIncludeBlocks = function (ibs) {
    this._includedBlocks = ibs;
  };

  this._includedBlocks = [];
  this.setIncludedBlocks = function (ibs) {
    this._includedBlocks = ibs;
  };

  this._groupByCategory = true;

  this._mainContext = mainContext;

  this.getToolboxXml2 = function () {
    var blocksByCategory = {}
    for (var objectName in this.generators) {
      for (var iGen = 0; iGen < this.generators[objectName].length; iGen++) {
        var generator = this.generators[objectName][iGen];
        if (blocksByCategory[generator.category] == undefined) {
          blocksByCategory[generator.category] = [];
        }
        blocksByCategory[generator.category].push(objectName + "_" + generator.labelEn + "__");
      }
    }
    xml = "";
    for (var category in blocksByCategory) {
      if (this.groupByCategory) {
        xml += "<category name='" + this.strings[category] + "' colour='210'>";
      }
      var blocks = blocksByCategory[category];
      for (var iBlock = 0; iBlock < blocks.length; iBlock++) {
        xml += "<block type='" + blocks[iBlock] + "'></block>";
      }
      if (this.groupByCategory) {
        xml += "</category>";
      }
    }
    var stdBlocks = this.getStdBlocks();
    for (var iCategory = 0; iCategory < stdBlocks.length; iCategory++) {
      var category = stdBlocks[iCategory];
      var catXml = "";
      if (this.groupByCategory) {
        catXml = "<category name='" + category.name + "' colour='" + category.colour + "'";
      }
      var isIncluded = false;
      if (category.custom != undefined) {
        catXml += " custom='" + category.custom + "'";
        if (this._includedAll || ($.inArray(category.category, this._includedCategories) != -1)) {
          isIncluded = true;
        }
      }
      catXml += ">";
      for (var iBlock = 0; iBlock < category.blocks.length; iBlock++) {
        var block = category.blocks[iBlock];
        if (this._includedAll ||
          ($.inArray(category.category, this._includedCategories) != -1) ||
          ($.inArray(block.name, this._includedBlocks) != -1)) {
          if (!block.excludedByDefault || ($.inArray(block.name, this._includedBlocks) != -1)) {
            catXml += block.xml;
            isIncluded = true;
          }
        }
      }
      if (this.groupByCategory) {
        catXml += "</category>";
      }
      if (isIncluded) {
        xml += catXml;
      }
    }

    // Handle variable blocks, which are normally automatically added with
    // the VARIABLES category but can be customized here
    if (this.availableVariables.length > 0 ||
      ($.inArray('variables_get', this._includedBlocks) != -1) ||
      ($.inArray('variables_set', this.includedBlocks) != -1)) {
      if (this.groupByCategory) {
        xml += "<category name='" + this.strings.variables + "' colour='330'>";
      }

      // block for each availableVariable
      for (var iVar = 0; iVar < this.availableVariables.length; iVar++) {
        xml += "<block type='variables_get' editable='false'><field name='VAR'>" + this.availableVariables[iVar] + "</field></block>";
      }
      // generic modifyable block
      if ($.inArray('variables_get', this.includedBlocks) != -1) {
        xml += "<block type='variables_get'></block>"
      }

      // same for setting variables
      for (var iVar = 0; iVar < this.availableVariables.length; iVar++) {
        xml += "<block type='variables_set' editable='false'><field name='VAR'>" + this.availableVariables[iVar] + "</field></block>";
      }
      if ($.inArray('variables_set', this.includedBlocks) != -1) {
        xml += "<block type='variables_set'></block>"
      }

      if (this.groupByCategory) {
        xml += "</category>";
      }
    }
    return xml;
  };

  this.getToolboxXml = function () {
    var categories = {};
    var categoriesXml = {};
    var colours = this.getDefaultColours();

    for (var blockType in this._includeBlocks.generatedBlocks) {
      for (var iBlock in this._includeBlocks.generatedBlocks[blockType]) {
        var blockName = this._includeBlocks.generatedBlocks[blockType][iBlock];
        var blockXmlInfo = this.getBlockXmlInfo(this._mainContext.customBlocks[blockType], blockName);
        if (blockXmlInfo == null) {
          console.error("Custom Block not found: " + blockName);
          continue;
        }

        if (!(blockXmlInfo.category in categories)) {
          categories[blockXmlInfo.category] = [];

          var colour = colours.blocks[blockName];
          if (typeof(colour) == "undefined") {
            colour = colours.categories[blockXmlInfo.category]
          }
          if (typeof(colour) == "undefined") {
            colour = colours.categories._default;
          }

          categoriesXml[blockXmlInfo.category] = "<category name='" + blockXmlInfo.category + "' colour='" + colour + "'>";
        }

        categories[blockXmlInfo.category].push(blockXmlInfo.xml);
      }
    }

    var stdBlocks = this.getStdBlocks();

    if (this._includeBlocks.standardBlocks.includeAll) {
      this._includeBlocks.standardBlocks.wholeCategories = ["input", "logic", "loops", "math", "text", "lists", "colour", "dicts", "variables", "functions"];
    }
    for (var iCategory in this._includeBlocks.standardBlocks.wholeCategories) {
      var categoryName = this._includeBlocks.standardBlocks.wholeCategories[iCategory];
      if (!(categoryName in categories)) {
        categories[categoryName] = [];

        var colour = colours.categories[categoryName];

        if (typeof(colour) == "undefined") {
          colour = colours.categories._default;
        }

        categoriesXml[categoryName] = "<category name='" + categoryName + "' colour='" + colour + "'>";
      }
      this.appendAllBlockXmlInfoForCategory(stdBlocks, categoryName, categories[categoryName]);
    }
    for (var iBlock in this._includeBlocks.standardBlocks.singleBlocks) {
      var blockName = this._includeBlocks.standardBlocks.singleBlocks[iBlock];
      var blockXmlInfo = this.getBlockXmlInfo(stdBlocks, blockName);
      if (blockXmlInfo == null) {
        console.error("Std Block not found: " + blockName);
        continue;
      }

      if (!(blockXmlInfo.category in categories)) {
        categories[blockXmlInfo.category] = [];

        var colour = colours.blocks[blockName];
        if (typeof(colour) == "undefined") {
          colour = colours.categories[blockXmlInfo.category]
        }
        if (typeof(colour) == "undefined") {
          colour = colours.categories._default;
        }

        categoriesXml[blockXmlInfo.category] = "<category name='" + blockXmlInfo.category + "' colour='" + colour + "'>";
      }

      categories[blockXmlInfo.category].push(blockXmlInfo.xml);
    }

    //console.log(this.mainContext.customBlocks);
    /*console.log(stdBlocks);*/

    xmlString = "";

    if (this._includeBlocks.groupByCategory) {
      for (cat in categories) {
        xmlString += categoriesXml[cat];
        for (block in categories[cat]) {
          xmlString += categories[cat][block];
        }
        xmlString += "</category>";
      }
    }
    else {
      for (cat in categories) {
        for (block in categories[cat]) {
          xmlString += categories[cat][block];
        }
      }
    }

    return xmlString;
  };

  this.getDefaultColours = function () {
    return {
      categories: {
        logic: 210,
        loops: 120,
        math: 230,
        text: 160,
        lists: 260,
        colour: 20,
        variables: 330,
        functions: 290,
        _default: 65
      },
      blocks: {}
    };
  };

  this.getStdBlocks = function () {
    return [
      {
        category: "input",
        blocks: [
          {
            name: "input_num",
            blocklyXml: "<block type='input_num'></block>"
          },
          {
            name: "input_char",
            blocklyXml: "<block type='input_char'></block>"
          },
          {
            name: "input_word",
            blocklyXml: "<block type='input_word'></block>"
          },
          {
            name: "input_line",
            blocklyXml: "<block type='input_line'></block>"
          }
        ]
      },
      {
        category: "logic",
        blocks: [
          {
            name: "controls_if",
            blocklyXml: "<block type='controls_if'></block>"
          },
          {
            name: "controls_if_else",
            blocklyXml: "<block type='controls_if'><mutation else='1'></mutation></block>"
          },
          {
            name: "logic_compare",
            blocklyXml: "<block type='logic_compare'></block>"
          },
          {
            name: "logic_operation",
            blocklyXml: "<block type='logic_operation'></block>"
          },
          {
            name: "logic_negate",
            blocklyXml: "<block type='logic_negate'></block>"
          },
          {
            name: "logic_boolean",
            blocklyXml: "<block type='logic_boolean'></block>"
          }
        ]
      },
      {
        category: "loops",
        blocks: [
          {
            name: "controls_repeat",
            blocklyXml: "<block type='controls_repeat'></block>"
          },
          {
            name: "controls_repeat_ext",
            blocklyXml: "<block type='controls_repeat_ext'>" +
            "  <value name='TIMES'>" +
            "    <shadow type='math_number'>" +
            "      <field name='NUM'>10</field>" +
            "    </shadow>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "controls_whileUntil",
            blocklyXml: "<block type='controls_whileUntil'></block>"
          },
          {
            name: "controls_for",
            blocklyXml: "<block type='controls_for'>" +
            "  <value name='FROM'>" +
            "    <shadow type='math_number'>" +
            "      <field name='NUM'>1</field>" +
            "    </shadow>" +
            "  </value>" +
            "  <value name='TO'>" +
            "    <shadow type='math_number'>" +
            "      <field name='NUM'>10</field>" +
            "     </shadow>" +
            "  </value>" +
            "  <value name='BY'>" +
            "    <shadow type='math_number'>" +
            "      <field name='NUM'>1</field>" +
            "    </shadow>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "controls_forEach",
            excludedByDefault: true,
            blocklyXml: "<block type='controls_forEach'></block>"
          },
          {
            name: "controls_flow_statements",
            blocklyXml: "<block type='controls_flow_statements'></block>"
          }
        ]
      },
      {
        category: "math",
        blocks: [
          {
            name: "math_number",
            blocklyXml: "<block type='math_number' gap='32'></block>"
          },
          {
            name: "math_arithmetic",
            blocklyXml: "<block type='math_arithmetic'></block>"
          },
          {
            name: "math_number_property",
            blocklyXml: "<block type='math_number_property'></block>"
          },
          {
            name: "math_change",
            blocklyXml: "<block type='math_change'></block>"
          },
          {
            name: "math_round",
            blocklyXml: "<block type='math_round'></block>"
          },
          {
            name: "math_extra_single",
            blocklyXml: "<block type='math_extra_single'></block>"
          },
          {
            name: "math_extra_double",
            blocklyXml: "<block type='math_extra_double'></block>"
          },
          {
            name: "math_modulo",
            blocklyXml: "<block type='math_modulo'></block>"
          }
        ]
      },
      {
        category: "text",
        blocks: [
          {
            name: "text",
            blocklyXml: "<block type='text'></block>"
          },
          {
            name: "text_join",
            blocklyXml: "<block type='text_join'></block>"
          },
          {
            name: "text_append",
            blocklyXml: "<block type='text_append'></block>"
          },
          {
            name: "text_length",
            blocklyXml: "<block type='text_length'>" +
            "  <value name='VALUE'>" +
            "    <shadow type='text'>" +
            "      <field name='TEXT'>abc</field>" +
            "    </shadow>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "text_isEmpty",
            blocklyXml: "<block type='text_isEmpty'>" +
            "  <value name='VALUE'>" +
            "    <shadow type='text'>" +
            "      <field name='TEXT'></field>" +
            "    </shadow>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "text_indexOf",
            blocklyXml: "<block type='text_indexOf'>" +
            "  <value name='VALUE'>" +
            "    <block type='variables_get'>" +
            "      <field name='VAR'>{textVariable}</field>" +
            "    </block>" +
            "  </value>" +
            "  <value name='FIND'>" +
            "    <shadow type='text'>" +
            "      <field name='TEXT'>abc</field>" +
            "    </shadow>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "text_charAt",
            blocklyXml: "<block type='text_charAt'>" +
            "  <value name='VALUE'>" +
            "    <block type='variables_get'>" +
            "      <field name='VAR'>{textVariable}</field>" +
            "    </block>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "text_getSubstring",
            blocklyXml: "<block type='text_getSubstring'>" +
            "  <value name='STRING'>" +
            "    <block type='variables_get'>" +
            "      <field name='VAR'>{textVariable}</field>" +
            "    </block>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "text_changeCase",
            blocklyXml: "<block type='text_changeCase'>" +
            "  <value name='TEXT'>" +
            "    <shadow type='text'>" +
            "      <field name='TEXT'>abc</field>" +
            "    </shadow>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "text_trim",
            blocklyXml: "<block type='text_trim'>" +
            "  <value name='TEXT'>" +
            "    <shadow type='text'>" +
            "      <field name='TEXT'>abc</field>" +
            "    </shadow>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "text_print",
            blocklyXml: "<block type='text_print'>" +
            "  <value name='TEXT'>" +
            "    <shadow type='text'>" +
            "      <field name='TEXT'>abc</field>" +
            "    </shadow>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "text_prompt_ext",
            blocklyXml: "<block type='text_prompt_ext'>" +
            "  <value name='TEXT'>" +
            "    <shadow type='text'>" +
            "      <field name='TEXT'>abc</field>" +
            "    </shadow>" +
            "  </value>" +
            "</block>"
          }
        ]
      },
      {
        category: "lists",
        blocks: [
          {
            name: "lists_create_with_empty",
            blocklyXml: "<block type='lists_create_with'>" +
            "  <mutation items='0'></mutation>" +
            "</block>"
          },
          {
            name: "lists_create_with",
            blocklyXml: "<block type='lists_create_with'></block>"
          },
          {
            name: "lists_repeat",
            blocklyXml: "<block type='lists_repeat'>" +
            "  <value name='NUM'>" +
            "    <shadow type='math_number'>" +
            "      <field name='NUM'>5</field>" +
            "    </shadow>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "lists_length",
            blocklyXml: "<block type='lists_length'></block>"
          },
          {
            name: "lists_isEmpty",
            blocklyXml: "<block type='lists_isEmpty'></block>"
          },
          {
            name: "lists_indexOf",
            blocklyXml: "<block type='lists_indexOf'>" +
            "  <value name='VALUE'>" +
            "    <block type='variables_get'>" +
            "      <field name='VAR'>{listVariable}</field>" +
            "    </block>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "lists_getIndex",
            blocklyXml: "<block type='lists_getIndex'>" +
            "  <value name='VALUE'>" +
            "    <block type='variables_get'>" +
            "      <field name='VAR'>{listVariable}</field>" +
            "    </block>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "lists_setIndex",
            blocklyXml: "<block type='lists_setIndex'>" +
            "  <value name='LIST'>" +
            "    <block type='variables_get'>" +
            "      <field name='VAR'>{listVariable}</field>" +
            "    </block>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "lists_getSublist",
            blocklyXml: "<block type='lists_getSublist'>" +
            "  <value name='LIST'>" +
            "    <block type='variables_get'>" +
            "      <field name='VAR'>{listVariable}</field>" +
            "    </block>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "lists_sort",
            blocklyXml: "<block type='lists_sort'></block>"
          },
          {
            name: "lists_split",
            blocklyXml: "<block type='lists_split'>" +
            "  <value name='DELIM'>" +
            "    <shadow type='text'>" +
            "      <field name='TEXT'>,</field>" +
            "    </shadow>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "lists_append",
            blocklyXml: "<block type='lists_append'></block>"
          },
        ]
      },
      {
        category: "colour",
        blocks: [
          {
            name: "colour_picker",
            blocklyXml: "<block type='colour_picker'></block>"
          },
          {
            name: "colour_random",
            blocklyXml: "<block type='colour_random'></block>"
          },
          {
            name: "colour_rgb",
            blocklyXml: "<block type='colour_rgb'>" +
            "  <value name='RED'>" +
            "    <shadow type='math_number'>" +
            "      <field name='NUM'>100</field>" +
            "    </shadow>" +
            "  </value>" +
            "  <value name='GREEN'>" +
            "    <shadow type='math_number'>" +
            "      <field name='NUM'>50</field>" +
            "    </shadow>" +
            "  </value>" +
            "  <value name='BLUE'>" +
            "    <shadow type='math_number'>" +
            "      <field name='NUM'>0</field>" +
            "    </shadow>" +
            "  </value>" +
            "</block>"
          },
          {
            name: "colour_blend",
            blocklyXml: "<block type='colour_blend'>" +
            "  <value name='COLOUR1'>" +
            "    <shadow type='colour_picker'>" +
            "      <field name='COLOUR'>#ff0000</field>" +
            "    </shadow>" +
            "  </value>" +
            "  <value name='COLOUR2'>" +
            "    <shadow type='colour_picker'>" +
            "      <field name='COLOUR'>#3333ff</field>" +
            "    </shadow>" +
            "  </value>" +
            "  <value name='RATIO'>" +
            "    <shadow type='math_number'>" +
            "      <field name='NUM'>0.5</field>" +
            "    </shadow>" +
            "  </value>" +
            "</block>"
          }
        ]
      },
      {
        category: "dicts",
        blocks: [
          {
            name: "dict_get_literal",
            blocklyXml: "<block type='dict_get_literal'></block>"
          },
          {
            name: "dict_keys",
            blocklyXml: "<block type='dict_keys'></block>"
          },
          {
            name: "dicts_create_with",
            blocklyXml: "<block type='dicts_create_with'></block>"
          }
        ]
      },
      {
        category: "variables",
        custom: "VARIABLE",
        blocks: []
      },
      {
        category: "functions",
        custom: "PROCEDURE",
        blocks: []
      }
    ];
  };

  this.getBlockXmlInfo =  function (generatorStruct, blockName) {
    for (iCategory in generatorStruct) {
      for (iBlock in generatorStruct[iCategory].blocks) {
        if (generatorStruct[iCategory].blocks[iBlock].name == blockName) {
          return {
            category: generatorStruct[iCategory].category,
            xml: generatorStruct[iCategory].blocks[iBlock].blocklyXml
          };
        }
      }
    }
    console.error("Block not found: " + blockName);
    return null;
  };

  this.addExtraBlocks = function () {

    var that = this;

    Blockly.Blocks['math_extra_single'] = {
      /**
       * Block for advanced math operators with single operand.
       * @this Blockly.Block
       */
      init: function () {
        var OPERATORS =
          [
            [Blockly.Msg.MATH_SINGLE_OP_ABSOLUTE, 'ABS'],
            ['-', 'NEG'],
          ];
        this.setHelpUrl(Blockly.Msg.MATH_SINGLE_HELPURL);
        this.setColour(Blockly.Blocks.math.HUE);
        this.setOutput(true, 'Number');
        this.appendValueInput('NUM')
          .setCheck('Number')
          .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function () {
          var mode = thisBlock.getFieldValue('OP');
          var TOOLTIPS = {
            'ABS': Blockly.Msg.MATH_SINGLE_TOOLTIP_ABS,
            'NEG': Blockly.Msg.MATH_SINGLE_TOOLTIP_NEG
          };
          return TOOLTIPS[mode];
        });
      }
    };

    Blockly.JavaScript['math_extra_single'] = Blockly.JavaScript['math_single'];

    Blockly.Python['math_extra_single'] = Blockly.Python['math_single'];

    Blockly.Blocks['math_extra_double'] = {
      /**
       * Block for advanced math operators with double operand.
       * @this Blockly.Block
       */
      init: function () {
        var OPERATORS =
          [
            ['min', 'MIN'],
            ['max', 'MAX'],
          ];
        this.setColour(Blockly.Blocks.math.HUE);
        this.setInputsInline(true);
        this.setOutput(true, 'Number');
        this.appendDummyInput('OP').appendField(new Blockly.FieldDropdown([["min", "MIN"], ["max", "MAX"], ["", ""]]), "OP");
        this.appendDummyInput().appendField(" entre ");
        this.appendValueInput('A').setCheck('Number');
        this.appendDummyInput().appendField(" et ");
        this.appendValueInput('B').setCheck('Number');
        // Assign 'this' to a variable for use in the tooltip closure below.
        var thisBlock = this;
        this.setTooltip(function () {
          var mode = thisBlock.getFieldValue('OP');
          var TOOLTIPS = {
            'MIN': that.strings.smallestOfTwoNumbers,
            'MAX': that.strings.greatestOfTwoNumbers
          };
          return TOOLTIPS[mode];
        });
      }
    };

    Blockly.JavaScript['math_extra_double'] = function (block) {
      // Math operators with double operand.
      var operator = block.getFieldValue('OP');
      var arg1 = Blockly.JavaScript.valueToCode(block, 'A', Blockly.JavaScript.ORDER_NONE) || '0';
      var arg2 = Blockly.JavaScript.valueToCode(block, 'B', Blockly.JavaScript.ORDER_NONE) || '0';
      if (operator == 'MIN') {
        var code = "Math.min(" + arg1 + ", " + arg2 + ")";
      }
      if (operator == 'MAX') {
        var code = "Math.max(" + arg1 + ", " + arg2 + ")";
      }
      return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
    };

    Blockly.Python['math_extra_double'] = function (block) {
      // Math operators with double operand.
      var operator = block.getFieldValue('OP');
      var arg1 = Blockly.Python.valueToCode(block, 'A', Blockly.Python.ORDER_NONE) || '0';
      var arg2 = Blockly.Python.valueToCode(block, 'B', Blockly.Python.ORDER_NONE) || '0';
      if (operator == 'MIN') {
        var code = "Math.min(" + arg1 + ", " + arg2 + ")";
      }
      if (operator == 'MAX') {
        var code = "Math.max(" + arg1 + ", " + arg2 + ")";
      }
      return [code, Blockly.Python.ORDER_FUNCTION_CALL];
    };

    var old = Blockly.Blocks.controls_if.init;

    Blockly.Blocks.controls_if.init = function () {
      old.call(this);
      this.setMutator(undefined)
    };

    Blockly.Blocks['robot_start'] = {
      init: function () {
        this.appendDummyInput()
          .appendField(that.strings.programOfRobot);
        this.setNextStatement(true);
        this.setColour(210);
        this.setTooltip('');
        this.deletable_ = false;
        this.editable_ = false;
        this.movable_ = false;
        //    this.setHelpUrl('http://www.example.com/');
      }
    };

    Blockly.JavaScript['robot_start'] = function (block) {
      return "";
    };

    Blockly.Python['robot_start'] = function (block) {
      return "";
    };
  };

  this.appendAllBlockXmlInfoForCategory =  function (generatorStruct, categoryName, appendTo) {
    for (category in generatorStruct) {
      if (generatorStruct[category].category == categoryName) {
        for (block in generatorStruct[category].blocks) {
          appendTo.push(generatorStruct[category].blocks[block].blocklyXml);
        }
      }
    }
  };
}


