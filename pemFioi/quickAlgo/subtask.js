/*
    subtask:
        Logic for quickAlgo tasks, implements the Bebras task API.
*/

var initBlocklySubTask = function(subTask, language) {
   // Blockly tasks need to always have the level-specific behavior from
   // beaver-task-2.0
   subTask.assumeLevels = true;

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
      if(!window.taskResultsCache) {
         window.taskResultsCache = {};
      }
      if(!window.taskResultsCache[curLevel]) {
         window.taskResultsCache[curLevel] = {};
      }

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

      this.context = getContext(this.display, subTask.levelGridInfos, curLevel);
      this.context.raphaelFactory = this.raphaelFactory;
      this.context.delayFactory = this.delayFactory;
      this.context.blocklyHelper = this.blocklyHelper;

      if (this.display) {
        window.quickAlgoInterface.loadInterface(this.context);
        window.quickAlgoInterface.setOptions({
           hideSaveOrLoad: subTask.levelGridInfos.hideSaveOrLoad,
           hasExample: subTask.levelGridInfos.example && subTask.levelGridInfos.example[subTask.blocklyHelper.language],
           conceptViewer: subTask.levelGridInfos.conceptViewer,
           conceptViewerLang: this.blocklyHelper.language
           });
      }

      this.blocklyHelper.loadContext(this.context);

      //this.answer = task.getDefaultAnswerObject();
      displayHelper.hideValidateButton = true;
      displayHelper.timeoutMinutes = 30;

      var curIncludeBlocks = extractLevelSpecific(this.context.infos.includeBlocks, curLevel);

      // Load concepts into conceptViewer; must be done before loading
      // Blockly/Scratch, as scratch-mode will modify includeBlocks
      if(this.display && subTask.levelGridInfos.conceptViewer) {
         // TODO :: testConcepts is temporary-ish
         var concepts = window.getConceptsFromBlocks(curIncludeBlocks, testConcepts);
         if(subTask.levelGridInfos.conceptViewer.length) {
            concepts = concepts.concat(subTask.levelGridInfos.conceptViewer);
         }
         concepts = window.conceptsFill(concepts, testConcepts);
         window.conceptViewer.loadConcepts(concepts);
      }

      this.blocklyHelper.setIncludeBlocks(curIncludeBlocks);

      var blocklyOptions = {
         readOnly: !!subTask.taskParams.readOnly,
         defaultCode: subTask.defaultCode
      };

      this.blocklyHelper.load(stringsLanguage, this.display, this.data[curLevel].length, blocklyOptions);

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
      window.quickAlgoInterface.resetTestScores();
      this.context.unload();
      this.blocklyHelper.unloadLevel();
      callback();
   };

   subTask.unload = function(callback) {
      var that = this;
      subTask.unloadLevel(function () {
         that.blocklyHelper.unload();
         callback();
      });
   };

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
      }, true);
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
      $('#errors').html('');
      this.context.reset();
   };

   subTask.reloadStateObject = function(stateObj) {
      this.state = stateObj;
//      this.level = state.level;

//      initContextForLevel(this.level);

//      this.context.runner.stop();
   };

   subTask.loadExample = function() {
      subTask.blocklyHelper.loadExample(subTask.levelGridInfos.example);
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
      if ((this.context.runner == undefined) || !this.context.runner.isRunning()) {
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
         if(this.context.runner) {
            this.context.runner.stop();
         }
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

   subTask.getGrade = function(callback, display) {
      subTask.context.changeDelay(0);
      var code = subTask.blocklyHelper.getCodeFromXml(subTask.answer[0].blockly, "javascript");
      code = subTask.blocklyHelper.getFullCode(code);

      var checkError = '';
      var checkDisplay = function(err) { checkError = err; }
      if(!subTask.blocklyHelper.checkCode(code, checkDisplay)) {
         var results = {
            message: checkError,
            successRate: 0,
            iTestCase: 0
         };
         callback(results);
         return;
      }

      var codes = [code]; // We only ever send one code to grade
      subTask.iTestCase = 0;

/*      var levelResultsCache = window.taskResultsCache[this.level];

      if(levelResultsCache[code]) {
         // We already have a cached result for that
         window.quickAlgoInterface.updateTestScores(levelResultsCache[code].fullResults);
         callback(levelResultsCache[code].results);
         return;
      }*/

      initBlocklyRunner(subTask.context, function(message, success) {
         var computeGrade = function(context, message) {
            var rate = 0;
            if (context.success) {
               rate = 1;
            }
            return {
               successRate: rate,
               message: message
            };
         }
         if (subTask.levelGridInfos.computeGrade != undefined) {
            computeGrade = subTask.levelGridInfos.computeGrade;
         }
         subTask.testCaseResults[subTask.iTestCase] = computeGrade(subTask.context, message)
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
            if(display) {
               window.quickAlgoInterface.updateTestScores(subTask.testCaseResults);
            }
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
            /*levelResultsCache[code] = {
               results: results,
               fullResults: subTask.testCaseResults
               };*/
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
