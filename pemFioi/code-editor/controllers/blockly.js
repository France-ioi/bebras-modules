/*!
 * @author John Ropas
 * @since 17/12/2016
 */

function BlocklyController(includeBlocks, mainContext, strings) {
  this._strings = strings;
  this._includeBlocks = includeBlocks;
  this._mainContext = mainContext;

  this.addBlocksAndCategories = function(blockNames, blocksDefinition, categoriesInfos) {
      var colours = this.getDefaultColours();
      for (var iBlock = 0; iBlock < blockNames.length; iBlock++) {
         var blockName = blockNames[iBlock];
         var blockXmlInfo = this.getBlockXmlInfo(blocksDefinition, blockName);
         var categoryName = blockXmlInfo.category;

         if (!(categoryName in categoriesInfos)) {
            categoriesInfos[categoryName] = {
               blocksXml: [],
               colour: colours.blocks[blockName]
            };
         }            
         categoriesInfos[categoryName].blocksXml.push(blockXmlInfo.xml);
      }
   };

   this.getToolboxXml = function () {
      var categoriesInfos = {};
      var colours = this.getDefaultColours();

      for (var blockType in this._includeBlocks.generatedBlocks) {
         this.addBlocksAndCategories(this._includeBlocks.generatedBlocks[blockType], this._mainContext.customBlocks[blockType], categoriesInfos);
      }

      var stdBlocks = this.getStdBlocks();

      if (this._includeBlocks.standardBlocks.includeAll) {
         this._includeBlocks.standardBlocks.wholeCategories = ["input", "logic", "loops", "math", "text", "lists", "colour", "dicts", "functions"];
      }
      var wholeCategories = this._includeBlocks.standardBlocks.wholeCategories;
      for (var iCategory = 0; iCategory < wholeCategories.length; iCategory++) {
         var categoryName = wholeCategories[iCategory];
         if (!(categoryName in categoriesInfos)) {
            categoriesInfos[categoryName] = {
               blocksXml: [],
            };
         }
         var blocks = stdBlocks[categoryName].blocks;
         for (var iBlock = 0; iBlock < blocks.length; iBlock++) {
            categoriesInfos[categoryName].blocksXml.push(blocks[iBlock].blocklyXml);
         }
      }

      this.addBlocksAndCategories(this._includeBlocks.standardBlocks.singleBlocks, stdBlocks, categoriesInfos);

      // Handle variable blocks, which are normally automatically added with
      // the VARIABLES category but can be customized here
      if (((this._includeBlocks.variables != undefined) && (this._includeBlocks.variables.length > 0 ))||
            (this._includeBlocks.variables_get != undefined) ||
            (this._includeBlocks.variables_set != undefined)) {
         var blocksXml = [];

         // block for each availableVariable
         for (var iVar = 0; iVar < this._includeBlocks.variables.length; iVar++) {
            blocksXml.push("<block type='variables_get' editable='false'><field name='VAR'>" + this._includeBlocks.variables[iVar] + "</field></block>");
         }
         // generic modifyable block
         if (this._includeBlocks.variables_get != undefined) {
            blocksXml.push("<block type='variables_get'></block>");
         }

         // same for setting variables
         for (var iVar = 0; iVar < this._includeBlocks.variables.length; iVar++) {
            blocksXml.push("<block type='variables_set' editable='false'><field name='VAR'>" + this._includeBlocks.variables[iVar] + "</field></block>");
         }
         if (this._includeBlocks.variables_set != undefined) {
            blocksXml.push("<block type='variables_set'></block>");
         }
         categoriesInfos["variables"] = {
            blocksXml: blocksXml,
            colour: 330
         }
      }

      var xmlString = "";         
      for (var categoryName in categoriesInfos) {
         var categoryInfo = categoriesInfos[categoryName];
         if (this._includeBlocks.groupByCategory) {
            var colour = categoryInfo.colour;
            if (typeof(colour) == "undefined") {
               colour = colours.categories[categoryName]
               if (typeof(colour) == "undefined") {
                  colour = colours.categories._default;
               }
            }               
            xmlString += "<category "
                     + " name='" + this.strings.categories[categoryName] + "'"
                     + " colour='" + colour + "'"
                     + (this.scratchMode ? " secondaryColour='" + colour + "'" : '')
                     + ">";
         }
         var blocks = categoryInfo.blocksXml;
         for (var iBlock = 0; iBlock < blocks.length; iBlock++) {
            xmlString += blocks[iBlock];
         }
         if (this._includeBlocks.groupByCategory) {
            xmlString += "</category>";
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

  this.getStdBlocks = function() {
      return this.getStdBlocklyBlocks();
  };

  this.getStdBlocklyBlocks = function () {
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
    for (var iCategory in generatorStruct) {
      for (var iBlock in generatorStruct[iCategory].blocks) {
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
            ['max', 'MAX']
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
          .appendField(that._strings.programOfRobot);
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
    for (var category in generatorStruct) {
      if (generatorStruct[category].category == categoryName) {
        for (var block in generatorStruct[category].blocks) {
          appendTo.push(generatorStruct[category].blocks[block].blocklyXml);
        }
      }
    }
  };

  this.createGenerator = function (label, code, type, nbParams) {
    Blockly.JavaScript[label] = function (block) {
      var params = "";
      for (var iParam = 0; iParam < nbParams; iParam++) {
        if (iParam != 0) {
          params += ", ";
        }
        params += Blockly.JavaScript.valueToCode(block, 'NAME_' + (iParam + 1), Blockly.JavaScript.ORDER_ATOMIC);
      }
      if (type == 0) {
        return code + "(" + params + ");\n";
      } else if (type == 1) {
        return [code + "(" + params + ")", Blockly.JavaScript.ORDER_NONE];
      }
    };
    Blockly.Python[label] = function (block) {
      var params = "";
      for (var iParam = 0; iParam < nbParams; iParam++) {
        if (iParam != 0) {
          params += ", ";
        }
        params += Blockly.Python.valueToCode(block, 'NAME_' + (iParam + 1), Blockly.Python.ORDER_ATOMIC);
      }
      if (type == 0) {
        return code + "(" + params + ")\n";
      } else if (type == 1) {
        return [code + "(" + params + ")", Blockly.Python.ORDER_NONE];
      }
    };
  };

  this.completeBlockHandler = function (block, objectName, context) {
    if (typeof block.handler == "undefined") {
      block.handler = context[objectName][block.name];
    }


    if (typeof block.handler == "undefined") {
      block.handler = (function (oName, bName) {
        return function () {
          console.error("Error: No handler given. No function context." + oName + "." + bName + "() found!");
        }
      })(objectName, block.name);
    }
  };

  this.completeBlockJson = function (block, objectName, categoryName, context) {
    // Needs context object solely for the language strings. Maybe change that …

    if (typeof block.blocklyJson == "undefined") {
      block.blocklyJson = {};
    }

    // Set block name
    if (typeof block.blocklyJson.type == "undefined") {
      block.blocklyJson.type = block.name;
    }

    // Add connectors (top-bottom or left)
    if (typeof block.blocklyJson.output == "undefined" &&
      typeof block.blocklyJson.previousStatement == "undefined" &&
      typeof block.blocklyJson.nextStatement == "undefined" && !(block.noConnectors)) {
      if (block.yieldsValue) {
        block.blocklyJson.output = null;
      }
      else {
        block.blocklyJson.previousStatement = null;
        block.blocklyJson.nextStatement = null;
      }
    }

    // Add parameters
    if (typeof block.blocklyJson.args0 == "undefined" &&
      typeof block.params != "undefined" &&
      block.params.length > 0) {
      block.blocklyJson.args0 = [];
      for (var iParam in block.params) {
        var param = {
          type: "input_value",
          name: "PARAM_" + iParam
        }

        if (block.params[iParam] != null) {
          param.check = block.params[iParam]; // Should be a string!
        }
        block.blocklyJson.args0.push(param);
      }
    }

    // Add message string
    if (typeof block.blocklyJson.message0 == "undefined") {
      block.blocklyJson.message0 = context.strings.label[block.name];

      if (typeof block.blocklyJson.message0 == "undefined") {
        block.blocklyJson.message0 = "<translation missing: " + block.name + ">";
      }

      if (typeof block.blocklyJson.args0 != "undefined") {
        var iParam = 0;
        for (var iArgs0 in block.blocklyJson.args0) {
          if (block.blocklyJson.args0[iArgs0].type == "input_value") {
            iParam += 1;
            block.blocklyJson.message0 += " %" + iParam;
          }
        }
      }
    }

    // Tooltip & HelpUrl should always exist, so lets just add empty ones in case they don't exist
    if (typeof block.blocklyJson.tooltip == "undefined") {
      block.blocklyJson.tooltip = "";
    }
    if (typeof block.blocklyJson.helpUrl == "undefined") {
      block.blocklyJson.helpUrl = "";
    } // TODO: Or maybe not?


    if (typeof block.blocklyJson.colour == "undefined") {
      block.blocklyJson.colour = 65;
    } // TODO: Load default colours + custom styles
  };

  this.completeBlockXml = function (block) {
    if (typeof block.blocklyXml == "undefined" || block.blocklyXml == "") {
      block.blocklyXml = "<block type='" + block.name + "'></block>";
    }
  };

  this.completeCodeGenerators = function (blockInfo, objectName) {
    if (typeof blockInfo.codeGenerators == "undefined") {
      blockInfo.codeGenerators = {};
    }

    // for closure:
    var args0 = blockInfo.blocklyJson.args0;
    var code = this._mainContext.strings.code[blockInfo.name];

    for (var language in { JavaScript: null, Python: null }) {
      if (typeof blockInfo.codeGenerators[language] == "undefined") {
        blockInfo.codeGenerators[language] = function (block) {
          var params = "";

          /* There are three kinds of input: value_input, statement_input and dummy_input,
           We should definitely consider value_input here and not consider dummy_input here.

           I don't know how statement_input is handled best, so I'll ignore it first -- Robert
           */
          var iParam = 0;
          for (var iArgs0 in args0) {
            if (args0[iArgs0].type == "input_value") {
              if (iParam) {
                params += ", ";
              }
              iParam += 1;
              params += Blockly[language].valueToCode(block, 'PARAM_' + (iParam + 1), Blockly[language].ORDER_ATOMIC);
            }
          }

          if (typeof(blockInfo.blocklyJson.output) == "undefined") {
            return code + "(" + params + ");\n";
          }
          else {
            return [code + "(" + params + ")", Blockly[language].ORDER_NONE];
          }

          /*if (type == 0) { // TODO: Change
           return code + "(" + params + ");\n";
           } else if (type == 1){
           return [code + "(" + params + ")", Blockly[language].ORDER_NONE];
           }*/
        }
      }
    }
  };

  this.applyCodeGenerators =  function (block) {
    for (var language in block.codeGenerators) {
      Blockly[language][block.name] = block.codeGenerators[language];
    }
  };

  this.createBlock = function (block) {
    if (typeof block.blocklyInit == "undefined") {
      var blocklyjson = block.blocklyJson;
      Blockly.Blocks[block.name] = {
        init: function () {
          this.jsonInit(blocklyjson);
        }
      };
    }
    else if (typeof block.blocklyInit == "function") {
      Blockly.Blocks[block.name] = {
        init: block.blocklyInit()
      };
    }
    else {
      console.error(block.name + ".blocklyInit is defined but not a function");
    }
  };

  this.createGeneratorsAndBlocks = function () {
    var customGenerators = this._mainContext.customBlocks;
    for (var objectName in customGenerators) {
      for (var iCategory in customGenerators[objectName]) {
        var category = customGenerators[objectName][iCategory];
        for (var iBlock in category.blocks) {
          var block = category.blocks[iBlock];

          /* TODO: Allow library writers to provide there own JS/Python code instead of just a handler */
          this.completeBlockHandler(block, objectName, this._mainContext);
          this.completeBlockJson(block, objectName, category.category, this._mainContext);
          /* category.category is category name */
          this.completeBlockXml(block);
          this.completeCodeGenerators(block, objectName);
          this.applyCodeGenerators(block);
          this.createBlock(block);
        }
        // TODO: Anything of this still needs to be done?
        //this.createGenerator(label, objectName + "." + code, generator.type, generator.nbParams);
        //this.createBlock(label, generator.labelFr, generator.type, generator.nbParams);
      }
    }
  };

  this.getCodeFromXml = function (xmlText, language) {
    try {
      var xml = Blockly.Xml.textToDom(xmlText)
    } catch (e) {
      alert(e);
      return;
    }
    var tmpWorkspace = new Blockly.Workspace();
    Blockly.Xml.domToWorkspace(xml, tmpWorkspace);
    return this.getCode(language, tmpWorkspace);
  };

}

CodeEditor.Controllers.BlocklyController = BlocklyController;
