/*!
 * @author John Ropas
 * @since 17/12/2016
 */

//former initBlocklySubTask

function SubTaskController(_subTask) {

   /*
   { shared: { field1: X }, easy: { field2: Y } } becomes { field1: X, field2: Y } if the current level is easy
   { shared: [X, Y], easy: [Z] }  becomes [X, Y, Z] if the current level is easy
   { easy: X, medium: Y, hard: Z}  becomes X if the current level is easy
   */

   function testLevelSpecific() {
      var tests = [
         {
            in: { field1: "X", field2: "Y" },
            out: { field1: "X", field2: "Y" }
         },
         {
               in: { easy: "X", medium: "Y", hard: "Z"},
               out: "X"
         },
         {
             in: { shared: { field1: "X" }, easy: { field2: "Y" } },
             out: { field1: "X", field2: "Y" }
         },
         {
               in: { shared: ["X", "Y"], easy: ["Z"] },
               out: ["X", "Y", "Z"]
         }
      ];
      for (var iTest = 0; iTest < tests.length; iTest++) {
         var res = extractLevelSpecific(tests[iTest].in, "easy");
         if (JSON.stringify(res) != JSON.stringify(tests[iTest].out)) { // TODO better way to compare two objects
            console.error("Test " + iTest + " failed: returned " + JSON.stringify(res));
         }
      }
   }

   function extractLevelSpecific(item, level) {
      if ((typeof item != "object") || Array.isArray(item)) {
         return item;
      }
      if (item.shared === undefined) {
         if (item[level] === undefined) {
            var newItem = {};
            for (var prop in item) {
               newItem[prop] = extractLevelSpecific(item[prop], level);
            }
            return newItem;
         }
         return extractLevelSpecific(item[level], level);
      }
      if (Array.isArray(item.shared)) {
         var newItem = [];
         for (var iElem = 0; iElem < item.shared.length; iElem++) {
            newItem.push(extractLevelSpecific(item.shared[iElem], level));
         }
         if (item[level] != undefined) {
            if (!Array.isArray(item[level])) {
               console.error("Incompatible types when merging shared and " + level);
            }
            for (var iElem = 0; iElem < item[level].length; iElem++) {
               newItem.push(extractLevelSpecific(item[level][iElem], level));
            }
         }
         return newItem;
      }
      if (typeof item.shared == "object") {
         var newItem = {};
         for (var prop in item.shared) {
            newItem[prop] = extractLevelSpecific(item.shared[prop], level);
         }
         if (item[level] != undefined) {
            if (typeof item[level] != "object") {
               console.error("Incompatible types when merging shared and " + level);
            }
            for (var prop in item[level]) {
               newItem[prop] = extractLevelSpecific(item[level][prop], level);
            }
         }
         return newItem;
      }
      console.error("Invalid type for shared property");
   }

  var subTask = _subTask;

  // former BlocklyHelper
  subTask.logicController = {};

  subTask.runController = undefined;

  subTask.pythonRunner = undefined;

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
    this.levelGridInfos = extractLevelSpecific(this.gridInfos, curLevel);
    this.level = curLevel;

    // TODO: fix bebras platform to make this unnecessary
    try {
      $('#question-iframe', window.parent.document).css('width', '100%');
    } catch (e) {
    }
    $('body').css("width", "100%").addClass('blockly');
    window.focus();

    this.iTestCase = 0;
    this.nbTestCases = subTask.data[curLevel].length;
    if (this.display) {
      var gridHtml = "<center>";
      gridHtml += "<div id='gridButtonsBefore'></div>";
      gridHtml += "<div id='grid' style='width:400px;height:200px;padding:10px'></div>";
      gridHtml += "<div id='gridButtonsAfter'></div>";
      gridHtml += "</center>";
      $("#gridContainer").html(gridHtml);
      if (this.levelGridInfos.hideSaveOrLoad) {
        // TODO: do without a timeout
        setTimeout(function () {
          $("#saveOrLoad").hide();
        }, 0);
      }
    }



    this.context = getContext(this.display, this.levelGridInfos, curLevel);
    this.context.raphaelFactory = this.raphaelFactory;
    this.context.delayFactory = this.delayFactory;

    //this.answer = task.getDefaultAnswerObject();
    displayHelper.hideValidateButton = true;
    displayHelper.timeoutMinutes = 30;

    subTask.logicController = new CodeEditor.Controllers.LogicController(
      this.nbTestCases,
      subTask.levelGridInfos.maxInstructions,
      CodeEditor.CONST.LANGUAGES.PYTHON,
      this.context
    );

    subTask.context.blocklyHelper = this.logicController;

    subTask.logicController.setIncludeBlocks(subTask.levelGridInfos.includeBlocks);
    subTask.logicController.load(stringsLanguage, this.display, this.data[curLevel].length);


    subTask.changeTest(0);
  };

  subTask.updateScale = function () {
    this.context.updateScale();
    this.logicController.updateSize();
  };

  subTask.unloadLevel = function (callback) {
    this.context.unload();
    this.logicController.unload();
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
    subTask.logicController.stop();

    if (!subTask.runController && !subTask.pythonRunner) {
      if (subTask.logicController.getLanguage() === CodeEditor.CONST.LANGUAGES.JAVASCRIPT ||
        subTask.logicController.getLanguage() === CodeEditor.CONST.LANGUAGES.BLOCKLY) {
        subTask.runController = new CodeEditor.Controllers.RunController(
          this.context,
          function (message, success) {
            $("#errors").html(message);
          });

      } else {
        subTask.pythonRunner = new CodeEditor.Interpreters.PythonInterpreter(
          this.context,
          function (message, success) {
            $("#errors").html(message);
          });
      }
    }

    initContextForLevel(subTask.iTestCase);

    subTask.logicController.run(subTask.context);
  };

  subTask.submit = function () {
    subTask.logicController.stop();

    subTask.context.display = false;
    subTask.getAnswerObject(); // to fill this.answer;
    subTask.getGrade(function (result) {
      subTask.context.display = true;
      subTask.changeSpeed(0);

      if (subTask.logicController.getLanguage() === CodeEditor.CONST.LANGUAGES.JAVASCRIPT ||
        subTask.logicController.getLanguage() === CodeEditor.CONST.LANGUAGES.BLOCKLY) {
        subTask.runController = new CodeEditor.Controllers.RunController(
          subTask.context,
          function (message, success) {
            $("#errors").html(message);
            platform.validate("done");
          });

      } else {
        subTask.pythonRunner = new CodeEditor.Interpreters.PythonInterpreter(
          subTask.context,
          function (message, success) {
            $("#errors").html(message);
            platform.validate("done");
          });
      }


      subTask.changeTest(result.iTestCase - subTask.iTestCase);
      initContextForLevel(result.iTestCase);
      subTask.context.linkBack = true;
      subTask.context.messagePrefixSuccess = "Tous les tests : ";
      subTask.logicController.run();
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
    this.logicController._savePrograms();

    this.answer = this.logicController._programs;
    return this.answer;
  };

  subTask.reloadAnswerObject = function (answerObj) {
    if (typeof answerObj === "undefined") {
      this.answer = this.getDefaultAnswerObject();
    } else {
      this.answer = answerObj;
    }

    var prog = this.answer;
    if (Array.isArray(prog)){
      prog = prog[0];
    }
    subTask.logicController._programs = prog;

    if (this.answer !== undefined && subTask.context.display) {
      subTask.logicController._loadPrograms();
    }
  };

  subTask.getDefaultAnswerObject = function () {
    var defaultBlockly;
    if (this.logicController.startingBlock) {
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

    var code = "";
    var codes = [];

    var callbackPrivate = function (message, success) {
      subTask.testCaseResults[subTask.iTestCase] = subTask.levelGridInfos.computeGrade(subTask.context, message);
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
    };


    subTask.iTestCase = 0;

    if (subTask.logicController.getLanguage() === CodeEditor.CONST.LANGUAGES.JAVASCRIPT ||
      subTask.logicController.getLanguage() === CodeEditor.CONST.LANGUAGES.BLOCKLY) {
      subTask.runController = new CodeEditor.Controllers.RunController(
        this.context, callbackPrivate);
      code = subTask.logicController._getCodeFromBlocks(CodeEditor.CONST.LANGUAGES.JAVASCRIPT);
      codes = [subTask.logicController.getFullCode(code)];

    } else {
      subTask.pythonRunner = new CodeEditor.Interpreters.PythonInterpreter(
        this.context, callbackPrivate);
      code = subTask.logicController._programs.python;
      codes = [code];
    }


    subTask.iTestCase = 0;
    subTask.testCaseResults = [];
    initContextForLevel(subTask.iTestCase);
    subTask.context.linkBack = true;
    subTask.context.messagePrefixSuccess = "Tous les tests : ";

    subTask.context.runner.runCodes(codes);
  };

  return subTask;
}

CodeEditor.Controllers.SubTask = SubTaskController;

var initBlocklySubTask = CodeEditor.Controllers.SubTask;
