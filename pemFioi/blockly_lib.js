var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function resetFormElement(e) {
  e.wrap('<form>').closest('form').get(0).reset();
  e.unwrap();

  // Prevent form submission
  e.stopPropagation();
  e.preventDefault();
}

var blocklyHelper = {
   textFile: null,
   extended: false,
   programs: [],
   languages: [],
   player: 0,
   workspace: null,

   load: function() {
      this.workspace = Blockly.inject('blocklyDiv', {toolbox: document.getElementById('toolbox'), sounds: false, media: "http://static3.castor-informatique.fr/contestAssets/blockly/"});
      Blockly.Trashcan.prototype.MARGIN_SIDE_ = 410;
      $(".blocklyToolboxDiv").css("background-color", "rgba(168, 168, 168, 0.5)");
      blocklyHelper.addExtraBlocks();

      for (var iPlayer = this.mainContext.nbRobots - 1; iPlayer >= 0; iPlayer--) {
         this.programs[iPlayer] = {blockly: null, blocklyJS: "", blocklyPython: "", javascript: ""};
         this.languages[iPlayer] = "blockly";
         blocklyHelper.setPlayer(iPlayer);
         var xml = '<xml><block type="robot_start" deletable="false" movable="false"></block></xml>';
         Blockly.Xml.domToWorkspace(this.workspace, Blockly.Xml.textToDom(xml));
         blocklyHelper.savePrograms();
      }
   },

   initXML: function() {
      var categories = ["actions", "sensors", "debug"];
      for (var iCategory = 0; iCategory < categories.length; iCategory++) {
         var categoryStr = "";
         for (var objectName in blocklyHelper.generators) {
            for (var iGen = 0; iGen < blocklyHelper.generators[objectName].length; iGen++) {
               var generator = blocklyHelper.generators[objectName][iGen];
               if (generator.category == categories[iCategory]) {
                  categoryStr += "<block type='" + objectName + "_" + generator.labelEn + "__'></block>";
               }
            }
         }
         $("#blockly_" + categories[iCategory]).html(categoryStr);
      }
   },

   createSelection: function(id, start, end) {
      var field = document.getElementById(id)
      if (field.createTextRange) {
         var selRange = field.createTextRange();
         selRange.collapse(true);
         selRange.moveStart('character', start);
         selRange.moveEnd('character', end);
         selRange.select();
      } else if (field.setSelectionRange) {
         field.setSelectionRange(start, end);
      } else if (field.selectionStart) {
         field.selectionStart = start;
         field.selectionEnd = end;
      }
      field.focus();
   },

   showStep: function(interpreter, id) {
      if (interpreter.stateStack[0]) {
        var node = interpreter.stateStack[0].node;
        var start = node.start;
        var end = node.end;
      } else {
        var start = 0;
        var end = 0;
      }
      this.createSelection(id, start, end);
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
      
      var blocklyElems = $(".blocklyToolboxDiv, .blocklyWidgetDiv, .blocklyTooltipDiv");
      $("#selectLanguage").val(this.languages[this.player]);
      if (this.languages[this.player] == "blockly") {
         blocklyElems.show();
      } else {
         blocklyElems.hide();
         $(".blocklyTooltipDiv").hide();
      }
      this.loadPrograms();
   },


   getCode: function(language) {
      blocks = this.workspace.getTopBlocks(true);
      var languageObj = null;
      if (language == "javascript") {
         languageObj = Blockly.JavaScript;
      }
      if (language == "python") {
         languageObj = Blockly.Python;
      }
      languageObj.init(this.workspace);

      var code = [];
      var comments = [];
      for (var b = 0; b < blocks.length; b++) {
         var block = blocks[b];
         var blockCode = languageObj.blockToCode(block);
         if (["procedures_defnoreturn", "procedures_defreturn"].indexOf(block.type) > -1) {
            // For function blocks, the code is stored in languageObj.definitions_
         } else {
            if (block.type == "robot_start") {
               comments.push(blockCode);
            }
         }
      }

      for (var def in languageObj.definitions_) {
         code.push(languageObj.definitions_[def]);
      }

      var code = code.join("\n");
      code += comments.join("\n");
      return code;
   },

   savePrograms: function() {
      this.programs[this.player].javascript = $("#program").val();

      var xml = Blockly.Xml.workspaceToDom(this.workspace);
      this.programs[this.player].blockly = Blockly.Xml.domToText(xml);
      this.programs[this.player].blocklyJS = this.getCode("javascript");
      this.programs[this.player].blocklyPython = this.getCode("python");
   },

   loadPrograms: function() {
      $("#program").val(this.programs[this.player].javascript);
      var xml = Blockly.Xml.textToDom(this.programs[this.player].blockly);
      this.workspace.clear();
      Blockly.Xml.domToWorkspace(this.workspace, xml);
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
                  $("#errors").html("Contenu invalide");
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
         $("#errors").html("Type de fichier non reconnu");
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
      $("#saveUrl").html(" <a href='" + this.textFile + "' download='robot_" + this.languages[this.player] + "_program.txt'>télécharger</a>");
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
         panelWidth = $("#blocklyDiv").width();
         Blockly.Trashcan.prototype.MARGIN_SIDE_ = panelWidth - 90;
         Blockly.fireUiEvent(window, 'resize');
      } else {
         panelWidth = $("#program").width() + 20;
      }
      $("#taskIntro").css("width", panelWidth);
      $("#grid").css("left", panelWidth + 20 + "px");
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

   createBlock: function(label, code, type, nbParams) {
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
   },

   createGeneratorsAndBlocks: function(generators) {
      for (var objectName in generators) {
         for (var iGen = 0; iGen < generators[objectName].length; iGen++) {
            var generator = generators[objectName][iGen];
            var label = objectName + "_" + generator.labelEn + "__";
            var code = generator.codeFr;
            this.createGenerator(label, objectName + "." + code, generator.type, generator.nbParams);
            this.createBlock(label, generator.labelFr, generator.type, generator.nbParams);
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
   
   addExtraBlocks: function() {
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
              'MIN': "Plus petit des deux nombres",
              'MAX': "Plus grand des deux nombres"
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


      Blockly.Blocks['controls_if_else'] = {
        init: function() {
          this.appendValueInput("IF")
              .setCheck("Boolean")
              .appendField("si");
          this.appendDummyInput()
              .appendField("faire");
          this.appendStatementInput("DO");
          this.appendDummyInput()
              .appendField("sinon");
          this.appendStatementInput("ELSE");
          this.setInputsInline(false);
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour(65);
          this.setTooltip('');
      //    this.setHelpUrl('http://www.example.com/');
        }
      };

      Blockly.JavaScript['controls_if_else'] = function(block) {
        var condition = Blockly.JavaScript.valueToCode(block, 'IF',  Blockly.JavaScript.ORDER_NONE) || 'false';
        var stmtIf = Blockly.JavaScript.statementToCode(block, 'DO');
        var stmtElse = Blockly.JavaScript.statementToCode(block, 'ELSE');
        var code = "if (" + condition + ") {\n" + stmtIf + "} else {\n" + stmtElse + "}\n";
        return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
      };

      Blockly.Python['controls_if_else'] = function(block) {
        var condition = Blockly.Python.valueToCode(block, 'IF',  Blockly.Python.ORDER_NONE) || 'false';
        var stmtIf = Blockly.Python.statementToCode(block, 'DO');
        var stmtElse = Blockly.Python.statementToCode(block, 'ELSE');
        var code = "if (" + condition + "):\n" + stmtIf + "else:\n" + stmtElse + "\n";
        return code;
      };


      Blockly.Blocks['robot_start'] = {
        init: function() {
          this.appendDummyInput()
              .appendField("Programme du robot");
          this.setNextStatement(true);
          this.setColour(210);
          this.setTooltip('');
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
      var nbRunning = this.mainContext.runner.nbRunning();
      if (nbRunning > 0) {
         console.log("waiting for " + nbRunning + " programs to stop");
         this.mainContext.runner.stop();
         DelayedExec.setTimeout("run", function() {
            blocklyHelper.run()
         }, 1000);
         return;
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
      this.mainContext.runner.runCodes(codes);
   },

   getFullCode(code) {
      return this.getBlocklyLibCode(this.generators) + code + "program_end()";
   }
}

function initBlocklyRunner(context, messageCallback) {
   init(context, [], [], [], false, {});

   function init(context, interpreters, isRunning, toStop, stopPrograms, runner) {
      context.runner = runner;
      context.programEnded = [];
      runner.waitDelay = function(callback, value) {
         var primitive = undefined;
         if (value != undefined) {
            primitive = interpreters[context.curRobot].createPrimitive(value);
         }
         
         if ((context.actionDelay > 0) || (Math.random() < 0.1)) {
            DelayedExec.setTimeout("wait" + context.curRobot, function() {
               callback(primitive);
               runner.runSyncBlock();
            }, context.actionDelay);
         } else {
            callback(primitive);
            runner.runSyncBlock();
         }
      };

      runner.noDelay = function(callback, value) {
         var primitive = undefined;
         if (value != undefined) {
            primitive = interpreters[context.curRobot].createPrimitive(value);
         }
         callback(primitive);
         runner.runSyncBlock();
      };

      runner.initInterpreter = function(interpreter, scope) {
         for (var objectName in context.generators) {
            for (var iGen = 0; iGen < context.generators[objectName].length; iGen++) {
               var generator = context.generators[objectName][iGen];
               interpreter.setProperty(scope, objectName + "_" + generator.labelEn, interpreter.createAsyncFunction(generator.fct));
            }
         }
         interpreter.setProperty(scope, "program_end", interpreter.createAsyncFunction(context.program_end));
      };

      runner.stop = function() {
         for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
            if (isRunning[iInterpreter]) {
               toStop[iInterpreter] = true;
            }
         }
         context.reset();
      };

      runner.runSyncBlock = function() {
         var maxIter = 1000;
   /*      if (turn > 90) {
            task.program_end(function() {
               that.stop();
            });
            return;
         }*/
         try {
            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               context.curRobot = iInterpreter;
               var interpreter = interpreters[iInterpreter];
               var iter = 0;
               while (iter < maxIter) {
                  if (!interpreter.step() || toStop[iInterpreter]) {
                     isRunning[iInterpreter] = false;;
                     break;
                  }
                  if (interpreter.paused_) {
                     break;
                  }
                  iter++;
               }
               if (iter == maxIter) {
                  isRunning[iInterpreter] = false;;
                  throw "Trop d'itérations avant une action !";
               }
            }
         } catch (e) {
            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               isRunning[iInterpreter] = false;
            }
            messageCallback(e);
         }
      };

      runner.runCodes = function(codes) {
         interpreters = [];
         context.programEnded = [];
         context.reset();
         for (var iInterpreter = 0; iInterpreter < codes.length; iInterpreter++) {
            context.programEnded[iInterpreter] = false;
            interpreters.push(new Interpreter(codes[iInterpreter], runner.initInterpreter));
            isRunning[iInterpreter] = true;
            toStop[iInterpreter] = false;
         }
         runner.runSyncBlock();
      };

      runner.nbRunning = function() {
         var nbRunning = 0;
         for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
            if (isRunning[iInterpreter]) {
               nbRunning++;
            }
         }
         return nbRunning;
      };
   }
}