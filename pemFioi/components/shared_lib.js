/*!
 * @author John Ropas
 * @since 17/12/2016
 */




function resetFormElement(e) {
  e.wrap('<form>').closest('form').get(0).reset();
  e.unwrap();
  // Prevent form submission
  //e.stopPropagation();
  //e.preventDefault();
}

function getSharedHelper(maxBlocks, nbTestCases) {

  return {

    textFile: null,

    extended: false,

    programs: [],

    languages: [],

    player: 0,

    workspace: null,

    prevWidth: 0,

    groupByCategory: true,

    includedAll: true,

    includedCategories : [],

    includedBlocks: [],

    availableVariables: [],

    languageStrings: languageStrings,

    startingBlock: true,

    nbTestCases: nbTestCases,

    loadHtml: function(nbTestCases) {

    },

    unload: function() {
      // TODO: this should unload all shared components, specific components have their own unload method
    },

    setPlayer: function(newPlayer) {
      this.player = newPlayer;
      $("#selectPlayer").val(this.player);
      $(".robot0, .robot1").hide();
      $(".robot" + this.player).show();
    },

    changePlayer: function() {
      this.loadPlayer($("#selectPlayer").val());
    },

    loadPlayer: function(player) {
      this.savePrograms();
      this.player = player;
      for (var iRobot = 0; iRobot < this.mainContext.nbRobots; iRobot++) {
        $(".robot" + iRobot).hide();
      }
      $(".robot" + this.player).show();

      $(".language_blockly, .language_javascript").hide();
      $(".language_" + this.languages[this.player]).show();

      var blocklyElems = $(".blocklyToolboxDiv, .blocklyWidgetDiv");
      $("#selectLanguage").val(this.languages[this.player]);
      if (this.languages[this.player] == "blockly") {
        blocklyElems.show();
      } else {
        blocklyElems.hide();
        $(".blocklyTooltipDiv").hide();
      }
      this.loadPrograms();
    },

    savePrograms: function() {
      this.programs[this.player].javascript = $("#program").val();
      if (this.workspace != null) {
        var xml = Blockly.Xml.workspaceToDom(this.workspace);
        this.programs[this.player].blockly = Blockly.Xml.domToText(xml);
        this.programs[this.player].blocklyJS = this.getCode("javascript");
        this.programs[this.player].blocklyPython = this.getCode("python");
      }
    },

    loadPrograms: function() {
      $("#program").val(this.programs[this.player].javascript);
      if (this.workspace != null) {
        var xml = Blockly.Xml.textToDom(this.programs[this.player].blockly);
        this.workspace.clear();
        Blockly.Xml.domToWorkspace(xml, this.workspace);
      }
    },

    changeLanguage: function() {
      this.languages[this.player] = $("#selectLanguage").val();
      this.loadPlayer(this.player);
    },

    importFromBlockly: function() {
      //var player = $("#selectPlayer").val();
      var player = 0;
      this.programs[player].javascript = this.getCode("javascript");
      $("#program").val(this.programs[player].javascript);
    },

    handleFiles: function(files) {
      var that = this;
      if (files.length < 0) {
        return;
      }
      var file = files[0];
      var textType = /text.*/;
      if (file.type.match(textType)) {
        var reader = new FileReader();

        reader.onload = function(e) {
          var code = reader.result;
          if (code[0] == "<") {
            try {
              var xml = Blockly.Xml.textToDom(code);
              that.programs[that.player].blockly = code;
            } catch(e) {
              $("#errors").html(that.strings.invalidContent);
            }
            that.languages[that.player] = "blockly";
          } else {
            that.programs[that.player].javascript = code;
            that.languages[that.player] = "javascript";
          }
          that.loadPrograms();
          that.loadPlayer(that.player);
        }

        reader.readAsText(file);
      } else {
        $("#errors").html(this.strings.unknownFileType);
      }
    },

    saveProgram: function() {
      this.savePrograms();
      var code = this.programs[this.player][this.languages[this.player]];
      var data = new Blob([code], {type: 'text/plain'});

      // If we are replacing a previously generated file we need to
      // manually revoke the object URL to avoid memory leaks.
      if (this.textFile !== null) {
        window.URL.revokeObjectURL(this.textFile);
      }

      this.textFile = window.URL.createObjectURL(data);

      // returns a URL you can use as a href
      $("#saveUrl").html(" <a href='" + this.textFile + "' download='robot_" + this.languages[this.player] + "_program.txt'>" + this.strings.download + "</a>");
      return this.textFile;
    },

    toggleSize: function() {
      if (!this.extended) {
        this.extended = true;
        $("#blocklyContainer").css("width", "800px");
        $("#extendButton").val("<<");
      } else {
        this.extended = false;
        $("#blocklyContainer").css("width", "500px");
        $("#extendButton").val(">>");
      }
      this.updateSize();
    },

    updateSize: function() {
      var panelWidth = 500;
      if (this.languages[this.player] == "blockly") {
        panelWidth = $("#blocklyDiv").width() - 10;
      } else {
        panelWidth = $("#program").width() + 20;
      }
      if (panelWidth != this.prevWidth) {
        $("#taskIntro").css("width", panelWidth);
        $("#grid").css("left", panelWidth + 20 + "px");
        if (this.languages[this.player] == "blockly") {
          Blockly.Trashcan.prototype.MARGIN_SIDE_ = panelWidth - 90;
          Blockly.svgResize(this.workspace);
        }
      }
      this.prevWidth = panelWidth;
    },

    createGenerator: function(label, code, type, nbParams) {
      Blockly.JavaScript[label] = function(block) {
        var params = "";
        for (var iParam = 0; iParam < nbParams; iParam++) {
          if (iParam != 0) {
            params += ", ";
          }
          params += Blockly.JavaScript.valueToCode(block, 'NAME_' + (iParam + 1), Blockly.JavaScript.ORDER_ATOMIC);
        }
        if (type == 0) {
          return code + "(" + params + ");\n";
        } else if (type == 1){
          return [code + "(" + params + ")", Blockly.JavaScript.ORDER_NONE];
        }
      };
      Blockly.Python[label] = function(block) {
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
    },

    completeBlockHandler: function(block, objectName, context) {
      if (typeof block.handler == "undefined") {
        block.handler = context[objectName][block.name];
      }


      if (typeof block.handler == "undefined") {
        block.handler = (function(oName, bName) {
          return function() { console.error("Error: No handler given. No function context." + oName + "." + bName + "() found!" ); }
        })(objectName, block.name);
      }
    },

    completeBlockJson: function(block, objectName, categoryName, context) {
      // Needs context object solely for the language strings. Maybe change that …

      if (typeof block.blocklyJson == "undefined") {
        block.blocklyJson =  {};
      }

      // Set block name
      if (typeof block.blocklyJson.type == "undefined") {
        block.blocklyJson.type = block.name;
      }

      // Add connectors (top-bottom or left)
      if (typeof block.blocklyJson.output == "undefined" &&
        typeof block.blocklyJson.previousStatement == "undefined" &&
        typeof block.blocklyJson.nextStatement == "undefined" &&
        !(block.noConnectors)) {
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
      if (typeof block.blocklyJson.tooltip == "undefined") { block.blocklyJson.tooltip = ""; }
      if (typeof block.blocklyJson.helpUrl == "undefined") { block.blocklyJson.helpUrl = ""; } // TODO: Or maybe not?


      if (typeof block.blocklyJson.colour == "undefined") { block.blocklyJson.colour = 65; } // TODO: Load default colours + custom styles
    },

    completeBlockXml: function(block) {
      if (typeof block.blocklyXml == "undefined" || block.blocklyXml == "") {
        block.blocklyXml = "<block type='" + block.name + "'></block>";
      }
    },

    completeCodeGenerators: function(blockInfo, objectName) {
      if (typeof blockInfo.codeGenerators == "undefined") {
        blockInfo.codeGenerators = {};
      }

      // for closure:
      var args0 = blockInfo.blocklyJson.args0;
      var code = this.mainContext.strings.code[blockInfo.name];

      for (language in {JavaScript: null, Python: null}) {
        if (typeof blockInfo.codeGenerators[language] == "undefined") {
          blockInfo.codeGenerators[language] = function(block) {
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
    },

    applyCodeGenerators: function(block) {
      for (language in block.codeGenerators) {
        Blockly[language][block.name] = block.codeGenerators[language];
      }
    },

    createBlock: function(block) {
      if (typeof block.blocklyInit == "undefined") {
        var blocklyjson = block.blocklyJson;
        Blockly.Blocks[block.name] = {
          init: function() {
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
        console.err(block.name + ".blocklyInit is defined but not a function");
      }
    },

    /*createBlock: function(label, code, type, nbParams) {
     Blockly.Blocks[label] = {
     init: function() {
     this.appendDummyInput()
     .appendField(code);
     if (type == 0) {
     this.setPreviousStatement(true);
     this.setNextStatement(true);
     }
     if (type == 1) {
     this.setOutput(true);
     }
     this.setInputsInline(true);
     for (var iParam = 0; iParam < nbParams; iParam++) {
     this.appendValueInput("NAME_" + (iParam + 1)).setCheck(null);
     }
     this.setColour(210);
     this.setTooltip('');
     this.setHelpUrl('');
     }
     };
     },*/

    /* createGeneratorsAndBlocks: function(generators) {
     for (var objectName in generators) {
     for (var iGen = 0; iGen < generators[objectName].length; iGen++) {
     var generator = generators[objectName][iGen];
     var label = objectName + "_" + generator.labelEn + "__";
     var code = generator.codeFr;
     this.createGenerator(label, objectName + "." + code, generator.type, generator.nbParams);
     this.createBlock(label, generator.labelFr, generator.type, generator.nbParams);
     }
     }
     },*/

    createGeneratorsAndBlocks: function() {
      var customGenerators = this.mainContext.customBlocks;
      for (var objectName in customGenerators) {
        for (var iCategory in customGenerators[objectName]) {
          var category =  customGenerators[objectName][iCategory];
          for (var iBlock in category.blocks) {
            var block = category.blocks[iBlock];

            /* TODO: Allow library writers to provide there own JS/Python code instead of just a handler */
            this.completeBlockHandler(block, objectName, this.mainContext);
            this.completeBlockJson(block, objectName, category.category, this.mainContext); /* category.category is category name */
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
    },

    getBlocklyLibCode: function(generators) {
      var strCode = "";
      for (var objectName in generators) {
        strCode += "var " + objectName + " = {\n";
        for (var iGen = 0; iGen < generators[objectName].length; iGen++) {
          var generator = generators[objectName][iGen];

          if (generator.nbParams == 0) {
            strCode += generator.codeFr + ": function() { ";
          } else {
            strCode += generator.codeFr + ": function(param1) { ";
          }
          if (generator.type == 1) {
            strCode += "return ";
          }
          if (generator.nbParams == 0) {
            strCode += objectName + "_" + generator.labelEn + "(); }";
          } else {
            strCode += objectName + "_" + generator.labelEn + "(param1); }";
          }
          if (iGen < generators[objectName].length - 1) {
            strCode += ",";
          }
          strCode += "\n";
        }
        strCode += "};\n\n";
      }
      strCode += "Math['max'] = function(a, b) { if (a > b) return a; return b; };\n";
      strCode += "Math['min'] = function(a, b) { if (a > b) return b; return a; };\n";
      return strCode;
    },

    getDefaultColours: function() {
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
          _default: 65,
        },
        blocks: {},
      };
    },

    getStdBlocks: function() {
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
    },

    getBlockXmlInfo: function(generatorStruct, blockName) {
      for (iCategory in generatorStruct) {
        for (iBlock in generatorStruct[iCategory].blocks) {
          if (generatorStruct[iCategory].blocks[iBlock].name == blockName) {
            return {
              category: generatorStruct[iCategory].category,
              xml: generatorStruct[iCategory].blocks[iBlock].blocklyXml,
            };
          }
        }
      }

      console.error("Block not found: " + blockName);
      return null;
    },

    appendAllBlockXmlInfoForCategory: function(generatorStruct, categoryName, appendTo) {
      for (category in generatorStruct) {
        if (generatorStruct[category].category == categoryName) {
          for (block in generatorStruct[category].blocks) {
            appendTo.push(generatorStruct[category].blocks[block].blocklyXml);
          }
        }
      }
    },

    getToolboxXml: function() {
      var categories = {};
      var categoriesXml = {};
      var colours = this.getDefaultColours();

      for (var blockType in this.includeBlocks.generatedBlocks) {
        for (var iBlock in this.includeBlocks.generatedBlocks[blockType]) {
          var blockName = this.includeBlocks.generatedBlocks[blockType][iBlock];
          var blockXmlInfo = this.getBlockXmlInfo(this.mainContext.customBlocks[blockType], blockName);
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

      if (this.includeBlocks.standardBlocks.includeAll) {
        this.includeBlocks.standardBlocks.wholeCategories = ["input", "logic", "loops", "math", "text", "lists", "colour", "dicts", "variables", "functions"];
      }
      for (var iCategory in this.includeBlocks.standardBlocks.wholeCategories) {
        var categoryName = this.includeBlocks.standardBlocks.wholeCategories[iCategory];
        if (!(categoryName in categories)) {
          categories[categoryName] = [];

          var colour = colours.categories[categoryName]

          if (typeof(colour) == "undefined") {
            colour = colours.categories._default;
          }

          categoriesXml[categoryName] = "<category name='" + categoryName + "' colour='" + colour + "'>";
        }
        this.appendAllBlockXmlInfoForCategory(stdBlocks, categoryName, categories[categoryName]);
      }
      for (var iBlock in this.includeBlocks.standardBlocks.singleBlocks) {
        var blockName = this.includeBlocks.standardBlocks.singleBlocks[iBlock];
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

      if (this.includeBlocks.groupByCategory) {
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
    },

    getToolboxXml2: function() {
      var blocksByCategory = {
      }
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
          if (this.includedAll || ($.inArray(category.category, this.includedCategories) != -1)) {
            isIncluded = true;
          }
        }
        catXml += ">";
        for (var iBlock = 0; iBlock < category.blocks.length; iBlock++) {
          var block = category.blocks[iBlock];
          if (this.includedAll ||
            ($.inArray(category.category, this.includedCategories) != -1) ||
            ($.inArray(block.name, this.includedBlocks) != -1)) {
            if (!block.excludedByDefault || ($.inArray(block.name, this.includedBlocks) != -1)) {
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
        ($.inArray('variables_get', this.includedBlocks) != -1) ||
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
    },

    addExtraBlocks: function() {
      var that = this;
      Blockly.Blocks['math_extra_single'] = {
        /**
         * Block for advanced math operators with single operand.
         * @this Blockly.Block
         */
        init: function() {
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
          this.setTooltip(function() {
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
        init: function() {
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
          this.setTooltip(function() {
            var mode = thisBlock.getFieldValue('OP');
            var TOOLTIPS = {
              'MIN': that.strings.smallestOfTwoNumbers,
              'MAX': that.strings.greatestOfTwoNumbers
            };
            return TOOLTIPS[mode];
          });
        }
      };

      Blockly.JavaScript['math_extra_double'] = function(block) {
        // Math operators with double operand.
        var operator = block.getFieldValue('OP');
        var arg1 = Blockly.JavaScript.valueToCode(block, 'A',  Blockly.JavaScript.ORDER_NONE) || '0';
        var arg2 = Blockly.JavaScript.valueToCode(block, 'B',  Blockly.JavaScript.ORDER_NONE) || '0';
        if (operator == 'MIN') {
          var code = "Math.min(" + arg1 + ", " + arg2 + ")";
        }
        if (operator == 'MAX') {
          var code = "Math.max(" + arg1 + ", " + arg2 + ")";
        }
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
      };

      Blockly.Python['math_extra_double'] = function(block) {
        // Math operators with double operand.
        var operator = block.getFieldValue('OP');
        var arg1 = Blockly.Python.valueToCode(block, 'A',  Blockly.Python.ORDER_NONE) || '0';
        var arg2 = Blockly.Python.valueToCode(block, 'B',  Blockly.Python.ORDER_NONE) || '0';
        if (operator == 'MIN') {
          var code = "Math.min(" + arg1 + ", " + arg2 + ")";
        }
        if (operator == 'MAX') {
          var code = "Math.max(" + arg1 + ", " + arg2 + ")";
        }
        return [code, Blockly.Python.ORDER_FUNCTION_CALL];
      };


      var old = Blockly.Blocks.controls_if.init;
      Blockly.Blocks.controls_if.init = function() {
        old.call(this);
        this.setMutator(undefined)
      };


      Blockly.Blocks['robot_start'] = {
        init: function() {
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

      Blockly.JavaScript['robot_start'] = function(block) {
        return "";
      };

      Blockly.Python['robot_start'] = function(block) {
        return "";
      };
    },

    run: function() {
      var that = this;
      var nbRunning = this.mainContext.runner.nbRunning();
      if (nbRunning > 0) {
        this.mainContext.runner.stop();
        this.mainContext.delayFactory.createTimeout("run" + Math.random(), function() {
          that.run()
        }, 1000);
        return;
      }
      if (this.mainContext.display) {
        Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
        Blockly.JavaScript.addReservedWords('highlightBlock');
      } else {
        Blockly.JavaScript.STATEMENT_PREFIX = '';
      }
      this.savePrograms();
      var codes = [];
      for (var iRobot = 0; iRobot < this.mainContext.nbRobots; iRobot++) {
        var language = this.languages[iRobot];
        if (language == "blockly") {
          language = "blocklyJS";
        }
        codes[iRobot] = this.getFullCode(this.programs[iRobot][language]);
      }
      that.highlightPause = false;
      that.workspace.traceOn(true);
      that.workspace.highlightBlock(null);
      this.mainContext.runner.runCodes(codes);
    },

    getFullCode: function(code) {
      return this.getBlocklyLibCode(this.generators) + code + "program_end()";
    }
  }
}

var initBlocklySubTask = function(subTask) {

  subTask.blocklyHelper = getBlocklyHelper(subTask.gridInfos.maxInstructions);

  subTask.answer = null;

  subTask.state = {};

  subTask.iTestCase = 0;

  if (subTask.data["medium"] == undefined) {
    subTask.load = function(views, callback) {
      subTask.loadLevel("easy");
      callback();
    };
  }

  subTask.loadLevel = function(curLevel) {
    this.level = curLevel;

    // TODO: fix bebras platform to make this unnecessary
    try {
      $('#question-iframe', window.parent.document).css('width', '100%');
    } catch(e) {
    }
    $('body').css('width', '100%').css('max-width', '1200px').css('margin', 'auto');
    window.focus();

    this.iTestCase = 0;
    this.nbTestCases = subTask.data[curLevel].length;
    if (this.display) {
      var gridHtml = "<center>";
      gridHtml += "<div id='gridButtonsBefore'></div>";
      gridHtml += "<div id='grid' style='width:400px;height:200px;padding:10px'></div>";
      gridHtml += "<div id='gridButtonsAfter'></div>";
      gridHtml += "</center>";
      $("#gridContainer").html(gridHtml)
      if (this.gridInfos.hideSaveOrLoad) {
        // TODO: do without a timeout
        setTimeout(function() {
          $("#saveOrLoad").hide();
        }, 0);
      }
    }

    var props = ["includedAll", "groupByCategory", "includedCategories", "includedBlocks", "availableVariables"];
    for (var iProp = 0; iProp < props.length; iProp++) {
      var prop = props[iProp];
      if (subTask.gridInfos[prop] != undefined) {
        var taskProp = subTask.gridInfos[prop];
        if ((typeof taskProp == "object") && (taskProp["easy"] != undefined)) {
          taskProp = taskProp[curLevel];
        }
        subTask.blocklyHelper[prop] = taskProp;
      }
    }

    this.context = getContext(this.display, this.gridInfos, curLevel);
    this.context.raphaelFactory = this.raphaelFactory;
    this.context.delayFactory = this.delayFactory;
    this.context.blocklyHelper = this.blocklyHelper;

    this.blocklyHelper.mainContext = this.context;
    this.blocklyHelper.createGeneratorsAndBlocks();

    //this.answer = task.getDefaultAnswerObject();
    displayHelper.hideValidateButton = true;
    displayHelper.timeoutMinutes = 30;

    this.blocklyHelper.includeBlocks = this.context.infos.includeBlocks;
    // TODO: Merge-in level dependent block information

    this.blocklyHelper.load(stringsLanguage, this.display, this.data[curLevel].length);

    subTask.changeTest(0);
  };

  subTask.updateScale = function() {
    this.context.updateScale();
    this.blocklyHelper.updateSize();
  };

  var resetScores = function() {
  };

  var updateScores = function() {
  };

  function changeScore(robot, deltaScore) {
    scores[robot] += deltaScore;
    updateScores();
  };

  subTask.unloadLevel = function(callback) {
    this.context.unload();
    this.blocklyHelper.unload();
    callback();
  };

  subTask.unload = subTask.unloadLevel;

  subTask.reset = function() {
    this.context.reset();
  };

  subTask.program_end = function(callback) {
    this.context.program_end(callback);
  };

  var initContextForLevel = function(iTestCase) {
    subTask.iTestCase = iTestCase;
    subTask.context.reset(subTask.data[subTask.level][iTestCase]);
    subTask.context.iTestCase = iTestCase;
    subTask.context.nbTestCases = subTask.nbTestCases;
    var prefix = "Test " + (subTask.iTestCase + 1) + "/" + subTask.nbTestCases + " : ";
    subTask.context.messagePrefixFailure = prefix;
    subTask.context.messagePrefixSuccess = prefix;
    subTask.context.linkBack = false;
  };

  subTask.run = function() {
    initBlocklyRunner(subTask.context, function(message, success) {
      $("#errors").html(message);
    });
    initContextForLevel(subTask.iTestCase);
    subTask.blocklyHelper.run(subTask.context);
  };

  subTask.submit = function() {
    this.context.display = false;
    this.getAnswerObject(); // to fill this.answer;
    this.getGrade(function(result) {
      subTask.context.display = true;
      subTask.changeSpeed();
      initBlocklyRunner(subTask.context, function(message, success) {
        $("#errors").html(message);
        platform.validate("done");
      });
      subTask.changeTest(result.iTestCase - subTask.iTestCase);
      initContextForLevel(result.iTestCase);
      subTask.context.linkBack = true;
      subTask.context.messagePrefixSuccess = "Tous les tests : ";
      subTask.blocklyHelper.run(subTask.context);
    });
  };

  subTask.stop = function() {
    this.context.runner.stop();
  };

  subTask.reloadStateObject = function(stateObj) {
    this.state = stateObj;
//      this.level = state.level;

//      initContextForLevel(this.level);

//      this.context.runner.stop();
  };

  subTask.getDefaultStateObject = function() {
    return { level: "easy" };
  };

  subTask.getStateObject = function() {
    this.state.level = this.level;
    return this.state;
  };

  subTask.changeSpeed =  function() {
    this.context.changeDelay(parseInt($("#selectSpeed").val()));
  };

  subTask.getAnswerObject = function() {
    this.blocklyHelper.savePrograms();

    this.answer = this.blocklyHelper.programs;
    return this.answer;
  };

  subTask.reloadAnswerObject = function(answerObj) {
    if(typeof answerObj === "undefined") {
      this.answer = this.getDefaultAnswerObject();
    } else {
      this.answer = answerObj;
    }
    this.blocklyHelper.programs = this.answer;
    if (this.answer != undefined) {
      this.blocklyHelper.loadPrograms();
    }
  };

  subTask.getDefaultAnswerObject = function() {
    var defaultBlockly;
    if (this.blocklyHelper.startingBlock) {
      defaultBlockly = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" deletable="false" movable="false" x="0" y="0"></block><block type="robot_start" deletable="false" movable="false" x="0" y="0"></block></xml>';
    }
    else {
      defaultBlockly = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>';
    }
    return [{javascript:"", blockly: defaultBlockly, blocklyJS: ""}];
  };

  subTask.changeTest = function(delta) {
    var newTest = subTask.iTestCase + delta;
    if ((newTest >= 0) && (newTest < this.nbTestCases)) {
      initContextForLevel(newTest);
      $("#testCaseName").html("Test " + (newTest + 1) + "/" + this.nbTestCases);
    }
  };

  subTask.getGrade = function(callback) {
    subTask.context.changeDelay(0);
    var code = subTask.blocklyHelper.getCodeFromXml(subTask.answer[0].blockly, "javascript");
    var codes = [subTask.blocklyHelper.getFullCode(code)];
    subTask.iTestCase = 0;
    initBlocklyRunner(subTask.context, function(message, success) {
      subTask.testCaseResults[subTask.iTestCase] = subTask.gridInfos.computeGrade(subTask.context, message);
      subTask.iTestCase++;
      if (subTask.iTestCase < subTask.nbTestCases) {
        initContextForLevel(subTask.iTestCase);
        subTask.context.runner.runCodes(codes);
      } else {
        var iWorstTestCase = 0;
        var worstRate = 1;
        for (var iCase = 0; iCase < subTask.nbTestCases; iCase++) {
          if (subTask.testCaseResults[iCase].successRate < worstRate) {
            worstRate = subTask.testCaseResults[iCase].successRate;
            iWorstTestCase = iCase;
          }
        }
        subTask.testCaseResults[iWorstTestCase].iTestCase = iWorstTestCase;
        callback(subTask.testCaseResults[iWorstTestCase]);
      }
    });
    subTask.iTestCase = 0;
    subTask.testCaseResults = [];
    initContextForLevel(subTask.iTestCase);
    subTask.context.linkBack = true;
    subTask.context.messagePrefixSuccess = "Tous les tests : ";
    subTask.context.runner.runCodes(codes);
  };
}


