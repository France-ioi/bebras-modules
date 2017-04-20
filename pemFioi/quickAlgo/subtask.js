/*
    subtask:
        Logic for quickAlgo tasks, implements the Bebras task API.
*/

"use strict";

var initBlocklySubTask = function(subTask, language) {
   if (subTask.data["medium"] == undefined) {
      subTask.load = function(views, callback) {
         subTask.loadLevel("easy");
         callback();
      };
   }

   if (language == undefined) {
      language = "fr";
   }
   
   subTask.loadLevel = function(curLevel) {
      subTask.levelGridInfos = extractLevelSpecific(subTask.gridInfos, curLevel);

      subTask.blocklyHelper = getBlocklyHelper(subTask.levelGridInfos.maxInstructions);
      subTask.answer = null;
      subTask.state = {};
      subTask.iTestCase = 0;

      this.level = curLevel;

      // TODO: fix bebras platform to make this unnecessary
      try {
         $('#question-iframe', window.parent.document).css('width', '100%');
      } catch(e) {
      }
      $('body').css("width", "100%").addClass('blockly');
      window.focus();

      this.iTestCase = 0;
      this.nbTestCases = subTask.data[curLevel].length;
      if (this.display) {
         window.quickAlgoInterface.loadInterface();
         if (subTask.levelGridInfos.hideSaveOrLoad) {
            // TODO: do without a timeout
            setTimeout(function() {
            $("#saveOrLoad").hide();
            }, 0);
         }
      }

      this.context = getContext(this.display, subTask.levelGridInfos, curLevel);
      this.context.raphaelFactory = this.raphaelFactory;
      this.context.delayFactory = this.delayFactory;
      this.context.blocklyHelper = this.blocklyHelper;

      this.blocklyHelper.loadContext(this.context);

      //this.answer = task.getDefaultAnswerObject();
      displayHelper.hideValidateButton = true;
      displayHelper.timeoutMinutes = 30;

      this.blocklyHelper.includeBlocks = extractLevelSpecific(this.context.infos.includeBlocks, curLevel);;

      this.blocklyHelper.load(stringsLanguage, this.display, this.data[curLevel].length);

      if(this.display) {
         window.quickAlgoInterface.initTestSelector(this.nbTestCases);
      }
      
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
      //      var prefix = "Test " + (subTask.iTestCase + 1) + "/" + subTask.nbTestCases + " : ";
      subTask.context.messagePrefixFailure = '';
      subTask.context.messagePrefixSuccess = '';
      subTask.context.linkBack = false;
   };

   subTask.run = function() {
      initBlocklyRunner(subTask.context, function(message, success) {
         $("#errors").html('<span class="testError">'+message+'</span>');
      });
      initContextForLevel(subTask.iTestCase);
      subTask.blocklyHelper.run(subTask.context);
   };

   subTask.submit = function() {
      this.context.display = false;
      this.getAnswerObject(); // to fill this.answer;

      $('#displayHelper_graderMessage').html('<div style="margin: .2em 0; color: red; font-weight: bold;">' + languageStrings.gradingInProgress + '</div>');
      
      this.getGrade(function(result) {
         $('#displayHelper_graderMessage').html("");
         subTask.context.display = true;
         subTask.context.changeDelay(200);
         initBlocklyRunner(subTask.context, function(message, success) {
            $("#errors").html('<span class="testError">'+message+'</span>');
            platform.validate("done");
         });
         subTask.changeTest(result.iTestCase - subTask.iTestCase);
         initContextForLevel(result.iTestCase);
         subTask.context.linkBack = true;
         subTask.context.messagePrefixSuccess = window.languageStrings.allTests;
         subTask.blocklyHelper.run(subTask.context);
      });
   };

   subTask.step = function () {
      subTask.context.changeDelay(200);
      if(!subTask.context.runner || subTask.context.runner.nbRunning() <= 0) {
        initBlocklyRunner(subTask.context, function(message, success) {
           $("#errors").html('<span class="testError">'+message+'</span>');
        });
        initContextForLevel(subTask.iTestCase);
      }
      subTask.blocklyHelper.step(subTask.context);
   };

   subTask.stop = function() {
      if(this.context.runner) {
         this.context.runner.stop();
      }
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

   subTask.changeSpeed =  function(speed) {
      this.context.changeDelay(speed);
      if ((this.context.runner == undefined) || (this.context.runner.nbRunning() == 0)) {
         this.run();
      } else if (this.context.runner.stepMode) {
         this.context.runner.run();
      }
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
      var defaultBlockly = this.blocklyHelper.getDefaultContent();
      return [{javascript:"", blockly: defaultBlockly, blocklyJS: ""}];
   };

   subTask.changeTest = function(delta) {
      var newTest = subTask.iTestCase + delta;
      if ((newTest >= 0) && (newTest < this.nbTestCases)) {
         initContextForLevel(newTest);
         if(subTask.context.display) {
            window.quickAlgoInterface.updateTestSelector(newTest);
         }
      }
   };

   subTask.changeTestTo = function(iTest) {
      var delta = iTest - subTask.iTestCase;
      if(delta != 0) {
         subTask.changeTest(delta);
      }
   };

   subTask.getGrade = function(callback) {
      subTask.context.changeDelay(0);
      var code = subTask.blocklyHelper.getCodeFromXml(subTask.answer[0].blockly, "javascript");
      var codes = [subTask.blocklyHelper.getFullCode(code)];
      subTask.iTestCase = 0;
      initBlocklyRunner(subTask.context, function(message, success) {
         subTask.testCaseResults[subTask.iTestCase] = subTask.levelGridInfos.computeGrade(subTask.context, message);
         subTask.iTestCase++;
         if (subTask.iTestCase < subTask.nbTestCases) {
            initContextForLevel(subTask.iTestCase);
            subTask.context.runner.runCodes(codes);
         } else {
            var iWorstTestCase = 0;
            var worstRate = 1;
            var nbSuccess = 0;
            for (var iCase = 0; iCase < subTask.nbTestCases; iCase++) {
               if (subTask.testCaseResults[iCase].successRate >= 1) {
                  nbSuccess++;
               }
               if (subTask.testCaseResults[iCase].successRate < worstRate) {
                  worstRate = subTask.testCaseResults[iCase].successRate;
                  iWorstTestCase = iCase;
               }
            }
            subTask.testCaseResults[iWorstTestCase].iTestCase = iWorstTestCase;
            window.quickAlgoInterface.updateTestScores(subTask.testCaseResults);
            if(subTask.testCaseResults[iWorstTestCase].successRate < 1) {
               if(subTask.nbTestCases == 1) {
                  var msg = subTask.testCaseResults[iWorstTestCase].message;
               } else if(nbSuccess > 0) {
                  var msg = languageStrings.resultsPartialSuccess.format({
                     nbSuccess: nbSuccess,
                     nbTests: subTask.nbTestCases
                     });
               } else {
                  var msg = languageStrings.resultsNoSuccess;
               }
               var results = {
                  message: msg,
                  successRate: subTask.testCaseResults[iWorstTestCase].successRate,
                  iTestCase: iWorstTestCase
               };
            } else {
               var results = subTask.testCaseResults[iWorstTestCase];
            }
            callback(results);
         }
      });
      subTask.iTestCase = 0;
      subTask.testCaseResults = [];
      initContextForLevel(subTask.iTestCase);
      subTask.context.linkBack = true;
      subTask.context.messagePrefixSuccess = window.languageStrings.allTests;
      subTask.context.runner.runCodes(codes);
   };
}
