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
    includedCategories: [],
    includedBlocks: [],
    availableVariables: [],
    languageStrings: languageStrings,
    startingBlock: true,
    nbTestCases: nbTestCases,

    changePlayer: function () {
      this.loadPlayer($("#selectPlayer").val());
    },

    loadPlayer: function (player) {
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

    loadPrograms: function () {
      $("#program").val(this.programs[this.player].javascript);
      if (this.workspace != null) {
        var xml = Blockly.Xml.textToDom(this.programs[this.player].blockly);
        this.workspace.clear();
        Blockly.Xml.domToWorkspace(xml, this.workspace);
      }
    },

    changeLanguage: function () {
      this.languages[this.player] = $("#selectLanguage").val();
      this.loadPlayer(this.player);
    },

    importFromBlockly: function () {
      //var player = $("#selectPlayer").val();
      var player = 0;
      this.programs[player].javascript = this.getCode("javascript");
      $("#program").val(this.programs[player].javascript);
    },

    handleFiles: function (files) {
      var that = this;
      if (files.length < 0) {
        return;
      }
      var file = files[0];
      var textType = /text.*/;
      if (file.type.match(textType)) {
        var reader = new FileReader();

        reader.onload = function (e) {
          var code = reader.result;
          if (code[0] == "<") {
            try {
              var xml = Blockly.Xml.textToDom(code);
              that.programs[that.player].blockly = code;
            } catch (e) {
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

    saveProgram: function () {
      this.savePrograms();
      var code = this.programs[this.player][this.languages[this.player]];
      var data = new Blob([code], { type: 'text/plain' });

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

    toggleSize: function () {
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

    updateSize: function () {
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

    createGenerator: function (label, code, type, nbParams) {
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
    },

    completeBlockHandler: function (block, objectName, context) {
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
    },

    completeBlockJson: function (block, objectName, categoryName, context) {
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
    },

    completeBlockXml: function (block) {
      if (typeof block.blocklyXml == "undefined" || block.blocklyXml == "") {
        block.blocklyXml = "<block type='" + block.name + "'></block>";
      }
    },

    completeCodeGenerators: function (blockInfo, objectName) {
      if (typeof blockInfo.codeGenerators == "undefined") {
        blockInfo.codeGenerators = {};
      }

      // for closure:
      var args0 = blockInfo.blocklyJson.args0;
      var code = this.mainContext.strings.code[blockInfo.name];

      for (language in { JavaScript: null, Python: null }) {
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
    },

    applyCodeGenerators: function (block) {
      for (language in block.codeGenerators) {
        Blockly[language][block.name] = block.codeGenerators[language];
      }
    },

    createBlock: function (block) {
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
        console.err(block.name + ".blocklyInit is defined but not a function");
      }
    },

    unload: function () {
      //var ws = Blockly.getMainWorkspace('blocklyDiv');
      var ws = this.workspace;
      if (ws != null) {
        ws.dispose();
        // TODO this makes no sense - needs investigation
        if (false) {
          $(".blocklyWidgetDiv").remove();
          $(".blocklyTooltipDiv").remove();
          document.removeEventListener("keydown", Blockly.onKeyDown_); // TODO: find correct way to remove all event listeners
          delete Blockly;
        }
      }

    },

    initXML: function () {
      var categories = ["actions", "sensors", "debug"];
      for (var iCategory = 0; iCategory < categories.length; iCategory++) {
        var categoryStr = "";
        // TODO this is unsafe - change to k,v iteration
        for (var objectName in this.generators) {
          for (var iGen = 0; iGen < this.generators[objectName].length; iGen++) {
            var generator = this.generators[objectName][iGen];
            if (generator.category == categories[iCategory]) {
              categoryStr += "<block type='" + objectName + "_" + generator.labelEn + "__'></block>";
            }
          }
        }
        $("#blockly_" + categories[iCategory]).html(categoryStr);
      }
    },

    createSelection: function (id, start, end) {
      var field = document.getElementById(id);
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

    showStep: function (interpreter, id) {
      var start, end;
      if (interpreter.stateStack[0]) {
        var node = interpreter.stateStack[0].node;
        start = node.start;
        end = node.end;
      } else {
        start = 0;
        end = 0;
      }
      this.createSelection(id, start, end);
    },

    getCodeFromXml: function (xmlText, language) {
      try {
        var xml = Blockly.Xml.textToDom(xmlText)
      } catch (e) {
        alert(e);
        return;
      }
      var tmpWorkspace = new Blockly.Workspace();
      Blockly.Xml.domToWorkspace(xml, tmpWorkspace);
      return this.getCode(language, tmpWorkspace);
    },

    getCode: function (language, codeWorkspace) {
      if (codeWorkspace == undefined) {
        codeWorkspace = this.workspace;
      }
      var blocks = codeWorkspace.getTopBlocks(true);
      var languageObj = null;
      if (language == "javascript") {
        languageObj = Blockly.JavaScript;
      }
      if (language == "python") {
        languageObj = Blockly.Python;
      }
      languageObj.init(codeWorkspace);

      var code = [];
      var comments = [];
      for (var b = 0; b < blocks.length; b++) {
        var block = blocks[b];
        var blockCode = languageObj.blockToCode(block);
        if (["procedures_defnoreturn", "procedures_defreturn"].indexOf(block.type) > -1) {
          // For function blocks, the code is stored in languageObj.definitions_
        } else {
          if (block.type == "robot_start" || !this.startingBlock) {
            comments.push(blockCode);
          }
        }
      }

      // TODO this is unsafe once again - change to k,v iterations
      for (var def in languageObj.definitions_) {
        code.push(languageObj.definitions_[def]);
      }

      code = code.join("\n");
      code += comments.join("\n");
      return code;
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

    createGeneratorsAndBlocks: function () {
      var customGenerators = this.mainContext.customBlocks;
      for (var objectName in customGenerators) {
        for (var iCategory in customGenerators[objectName]) {
          var category = customGenerators[objectName][iCategory];
          for (var iBlock in category.blocks) {
            var block = category.blocks[iBlock];

            /* TODO: Allow library writers to provide there own JS/Python code instead of just a handler */
            this.completeBlockHandler(block, objectName, this.mainContext);
            this.completeBlockJson(block, objectName, category.category, this.mainContext);
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
    },

    getBlocklyLibCode: function (generators) {
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

    run: function () {
      var that = this;
      var nbRunning = this.mainContext.runner.nbRunning();
      if (nbRunning > 0) {
        this.mainContext.runner.stop();
        this.mainContext.delayFactory.createTimeout("run" + Math.random(), function () {
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

    getFullCode: function (code) {
      return this.getBlocklyLibCode(this.generators) + code + "program_end()";
    }
  }
}

var initBlocklySubTask = function (subTask) {

  subTask.blocklyHelper = getBlocklyHelper(subTask.gridInfos.maxInstructions);

  subTask.answer = null;

  subTask.state = {};

  subTask.iTestCase = 0;

  if (subTask.data["medium"] == undefined) {
    subTask.load = function (views, callback) {
      subTask.loadLevel("easy");
      callback();
    };
  }

  subTask.loadLevel = function (curLevel) {
    this.level = curLevel;

    // TODO: fix bebras platform to make this unnecessary
    try {
      $('#question-iframe', window.parent.document).css('width', '100%');
    } catch (e) {
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
        setTimeout(function () {
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

  subTask.updateScale = function () {
    this.context.updateScale();
    this.blocklyHelper.updateSize();
  };

  var resetScores = function () {
  };

  var updateScores = function () {
  };

  function changeScore(robot, deltaScore) {
    scores[robot] += deltaScore;
    updateScores();
  };

  subTask.unloadLevel = function (callback) {
    this.context.unload();
    this.blocklyHelper.unload();
    callback();
  };

  subTask.unload = subTask.unloadLevel;

  subTask.reset = function () {
    this.context.reset();
  };

  subTask.program_end = function (callback) {
    this.context.program_end(callback);
  };

  var initContextForLevel = function (iTestCase) {
    subTask.iTestCase = iTestCase;
    subTask.context.reset(subTask.data[subTask.level][iTestCase]);
    subTask.context.iTestCase = iTestCase;
    subTask.context.nbTestCases = subTask.nbTestCases;
    var prefix = "Test " + (subTask.iTestCase + 1) + "/" + subTask.nbTestCases + " : ";
    subTask.context.messagePrefixFailure = prefix;
    subTask.context.messagePrefixSuccess = prefix;
    subTask.context.linkBack = false;
  };

  subTask.run = function () {
    initBlocklyRunner(subTask.context, function (message, success) {
      $("#errors").html(message);
    });
    initContextForLevel(subTask.iTestCase);
    subTask.blocklyHelper.run(subTask.context);
  };

  subTask.submit = function () {
    this.context.display = false;
    this.getAnswerObject(); // to fill this.answer;
    this.getGrade(function (result) {
      subTask.context.display = true;
      subTask.changeSpeed();
      initBlocklyRunner(subTask.context, function (message, success) {
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

  subTask.stop = function () {
    this.context.runner.stop();
  };

  subTask.reloadStateObject = function (stateObj) {
    this.state = stateObj;
//      this.level = state.level;

//      initContextForLevel(this.level);

//      this.context.runner.stop();
  };

  subTask.getDefaultStateObject = function () {
    return { level: "easy" };
  };

  subTask.getStateObject = function () {
    this.state.level = this.level;
    return this.state;
  };

  subTask.changeSpeed = function () {
    this.context.changeDelay(parseInt($("#selectSpeed").val()));
  };

  subTask.getAnswerObject = function () {
    this.blocklyHelper.savePrograms();

    this.answer = this.blocklyHelper.programs;
    return this.answer;
  };

  subTask.reloadAnswerObject = function (answerObj) {
    if (typeof answerObj === "undefined") {
      this.answer = this.getDefaultAnswerObject();
    } else {
      this.answer = answerObj;
    }
    this.blocklyHelper.programs = this.answer;
    if (this.answer != undefined) {
      this.blocklyHelper.loadPrograms();
    }
  };

  subTask.getDefaultAnswerObject = function () {
    var defaultBlockly;
    if (this.blocklyHelper.startingBlock) {
      defaultBlockly = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" deletable="false" movable="false" x="0" y="0"></block><block type="robot_start" deletable="false" movable="false" x="0" y="0"></block></xml>';
    }
    else {
      defaultBlockly = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>';
    }
    return [{ javascript: "", blockly: defaultBlockly, blocklyJS: "" }];
  };

  subTask.changeTest = function (delta) {
    var newTest = subTask.iTestCase + delta;
    if ((newTest >= 0) && (newTest < this.nbTestCases)) {
      initContextForLevel(newTest);
      $("#testCaseName").html("Test " + (newTest + 1) + "/" + this.nbTestCases);
    }
  };

  subTask.getGrade = function (callback) {
    subTask.context.changeDelay(0);
    var code = subTask.blocklyHelper.getCodeFromXml(subTask.answer[0].blockly, "javascript");
    var codes = [subTask.blocklyHelper.getFullCode(code)];
    subTask.iTestCase = 0;
    initBlocklyRunner(subTask.context, function (message, success) {
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

function initBlocklyRunner(context, messageCallback) {
  init(context, [], [], [], false, {});

  function init(context, interpreters, isRunning, toStop, stopPrograms, runner) {

    runner.waitDelay = function (callback, value, delay) {
      if (delay > 0) {
        context.delayFactory.createTimeout("wait" + context.curRobot + "_" + Math.random(), function () {
            runner.noDelay(callback, value);
          },
          delay
        );
      } else {
        runner.noDelay(callback, value);
      }
    };

    runner.noDelay = function (callback, value) {
      var primitive = undefined;
      if (value != undefined) {
        primitive = interpreters[context.curRobot].createPrimitive(value);
      }
      if (Math.random() < 0.1) {
        context.delayFactory.createTimeout("wait_" + Math.random(), function () {
          callback(primitive);
          runner.runSyncBlock();
        }, 0);
      } else {
        callback(primitive);
        runner.runSyncBlock();
      }
    };

    runner.initInterpreter = function (interpreter, scope) {
      for (objectName in context.customBlocks) {
        for (iCategory in context.customBlocks[objectName]) {
          for (iBlock in context.customBlocks[objectName][iCategory].blocks) {
            var blockInfo = context.customBlocks[objectName][iCategory].blocks[iBlock];
            var code = context.strings.code[blockInfo.name];

            if (typeof(code) == "undefined")
              code = blockInfo.name;

            interpreter.setProperty(scope, code, interpreter.createAsyncFunction(blockInfo.handler));
          }
        }
      }


      /*for (var objectName in context.generators) {
       for (var iGen = 0; iGen < context.generators[objectName].length; iGen++) {
       var generator = context.generators[objectName][iGen];
       interpreter.setProperty(scope, objectName + "_" + generator.labelEn, interpreter.createAsyncFunction(generator.fct));
       }
       }*/
      interpreter.setProperty(scope, "program_end", interpreter.createAsyncFunction(context.program_end));

      function highlightBlock(id) {
        if (context.display) {
          context.blocklyHelper.workspace.highlightBlock(id);
          highlightPause = true;
        }
      }

      // Add an API function for highlighting blocks.
      var wrapper = function (id) {
        id = id ? id.toString() : '';
        return interpreter.createPrimitive(highlightBlock(id));
      };
      interpreter.setProperty(scope, 'highlightBlock', interpreter.createNativeFunction(wrapper));
    };

    runner.stop = function () {
      for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
        if (isRunning[iInterpreter]) {
          toStop[iInterpreter] = true;
        }
      }
      context.reset();
    };

    runner.runSyncBlock = function () {
      var maxIter = 20000;
      /*      if (turn > 90) {
       task.program_end(function() {
       that.stop();
       });
       return;
       }*/
      try {
        for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
          context.curRobot = iInterpreter;
          if (context.infos.checkEndEveryTurn) {
            context.infos.checkEndCondition(context, false);
          }
          var interpreter = interpreters[iInterpreter];
          while (context.curSteps[iInterpreter] < maxIter) {
            if (!interpreter.step() || toStop[iInterpreter]) {
              isRunning[iInterpreter] = false;
              ;
              break;
            }
            if (interpreter.paused_) {
              break;
            }
            context.curSteps[iInterpreter]++;
          }
          if (context.curSteps[iInterpreter] >= maxIter) {
            isRunning[iInterpreter] = false;
            ;
            throw context.blocklyHelper.strings.tooManyIterations;
          }
        }
      } catch (e) {
        for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
          isRunning[iInterpreter] = false;
        }

        var message = e.toString();
        if ((context.nbTestCases != undefined) && (context.nbTestCases > 1)) {
          if (context.success) {
            message = context.messagePrefixSuccess + message;
          } else {
            message = context.messagePrefixFailure + message;
          }
        }
        if (context.success) {
          message = "<span style='color:green;font-weight:bold'>" + message + "</span>";
          if (context.linkBack) {
            //message += "<br/><span onclick='window.parent.backToList()' style='font-weight:bold;cursor:pointer;text-decoration:underline;color:blue'>Retour à la liste des questions</span>";
          }
        }
        messageCallback(message);
      }
    };

    runner.runCodes = function (codes) {
      //this.mainContext.delayFactory.stopAll(); pb: it would top existing graders
      interpreters = [];
      context.programEnded = [];
      context.curSteps = [];
      context.reset();
      for (var iInterpreter = 0; iInterpreter < codes.length; iInterpreter++) {
        context.curSteps[iInterpreter] = 0;
        context.programEnded[iInterpreter] = false;
        interpreters.push(new Interpreter(codes[iInterpreter], runner.initInterpreter));
        isRunning[iInterpreter] = true;
        toStop[iInterpreter] = false;
      }
      runner.runSyncBlock();
    };

    runner.nbRunning = function () {
      var nbRunning = 0;
      for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
        if (isRunning[iInterpreter]) {
          nbRunning++;
        }
      }
      return nbRunning;
    };

    context.runner = runner;

    context.callCallback = runner.noDelay;

    context.programEnded = [];
  }
}

function removeBlockly() {
  $(".blocklyWidgetDiv").remove();
  $(".blocklyTooltipDiv").remove();
  document.removeEventListener("keydown"); //, Blockly.onKeyDown_); // TODO: find correct way to remove all event listeners
  delete Blockly;
}
