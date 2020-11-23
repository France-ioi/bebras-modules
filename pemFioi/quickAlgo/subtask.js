/*
    subtask:
        Logic for quickAlgo tasks, implements the Bebras task API.
*/

var initBlocklySubTask = function(subTask, language) {
   // Blockly tasks need to always have the level-specific behavior from
   // beaver-task-2.0
   subTask.assumeLevels = true;

   if (window.forcedLevel != null) {
      for (var level in subTask.data) {
         if (window.forcedLevel != level) {
            subTask.data[level] = undefined;
         }
      }
      subTask.load = function(views, callback) {
         subTask.loadLevel(window.forcedLevel);
         callback();
      };
   } else if (subTask.data["medium"] == undefined) {
      subTask.load = function(views, callback) {
         subTask.loadLevel("easy");
         callback();
      };
   }

   if (language == undefined) {
      language = "fr";
   }

   subTask.loadLevel = function(curLevel) {
      var levelGridInfos = extractLevelSpecific(subTask.gridInfos, curLevel);
      subTask.levelGridInfos = levelGridInfos;

      // Convert legacy options
      if(!levelGridInfos.hideControls) { levelGridInfos.hideControls = {}; }
      levelGridInfos.hideControls.saveOrLoad = levelGridInfos.hideControls.saveOrLoad || !!levelGridInfos.hideSaveOrLoad;
      levelGridInfos.hideControls.loadBestAnswer = levelGridInfos.hideControls.loadBestAnswer || !!levelGridInfos.hideLoadBestAnswers;

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
      window.modulesLanguage = subTask.blocklyHelper.language;

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

      this.context = quickAlgoLibraries.getContext(this.display, levelGridInfos, curLevel);
      this.context.raphaelFactory = this.raphaelFactory;
      this.context.delayFactory = this.delayFactory;
      this.context.blocklyHelper = this.blocklyHelper;

      if (this.display) {
         window.quickAlgoInterface.loadInterface(this.context, curLevel);
         window.quickAlgoInterface.setOptions({
            hasExample: levelGridInfos.example && levelGridInfos.example[subTask.blocklyHelper.language],
            conceptViewer: levelGridInfos.conceptViewer,
            conceptViewerLang: this.blocklyHelper.language,
            hasTestThumbnails: levelGridInfos.hasTestThumbnails,
            hideControls: levelGridInfos.hideControls,
            introMaxHeight: levelGridInfos.introMaxHeight,
            canEditSubject: !!levelGridInfos.canEditSubject
         });
         window.quickAlgoInterface.bindBlocklyHelper(this.blocklyHelper);
      }

      this.blocklyHelper.loadContext(this.context);

      //this.answer = task.getDefaultAnswerObject();
      displayHelper.hideValidateButton = true;
      displayHelper.timeoutMinutes = 30;

      var curIncludeBlocks = extractLevelSpecific(this.context.infos.includeBlocks, curLevel);

      // Load concepts into conceptViewer; must be done before loading
      // Blockly/Scratch, as scratch-mode will modify includeBlocks
      if(this.display && levelGridInfos.conceptViewer) {
         var allConcepts = this.context.getConceptList();
         allConcepts = allConcepts.concat(getConceptViewerBaseConcepts());

         var concepts = window.getConceptsFromBlocks(curIncludeBlocks, allConcepts, this.context);
         if(levelGridInfos.conceptViewer.length) {
            concepts = concepts.concat(levelGridInfos.conceptViewer);
         } else {
            concepts.push('base');
         }
         concepts = window.conceptsFill(concepts, allConcepts);
         window.conceptViewer.loadConcepts(concepts);
         window.conceptViewer.contextTitle = this.context.title;
      }

      this.blocklyHelper.setIncludeBlocks(curIncludeBlocks);

      var blocklyOptions = {
         readOnly: !!subTask.taskParams.readOnly,
         defaultCode: subTask.defaultCode,
         maxListSize: this.context.infos.maxListSize,
         startingExample: this.context.infos.startingExample
      };

      // Handle zoom options
      var maxInstructions = this.context.infos.maxInstructions ? this.context.infos.maxInstructions : Infinity;
      var zoomOptions = {
         controls: false,
         scale: maxInstructions > 20 ? 1 : 1.1
      };
      if(this.context.infos && this.context.infos.zoom) {
         zoomOptions.controls = !!this.context.infos.zoom.controls;
         zoomOptions.scale = (typeof this.context.infos.zoom.scale != 'undefined') ? this.context.infos.zoom.scale : zoomOptions.scale;
      }
      blocklyOptions.zoom = zoomOptions;

      // Handle scroll
//      blocklyOptions.scrollbars = maxInstructions > 10;
      blocklyOptions.scrollbars = true;
      if(typeof this.context.infos.scrollbars != 'undefined') {
         blocklyOptions.scrollbars = this.context.infos.scrollbars;
      }

      this.blocklyHelper.load(stringsLanguage, this.display, this.data[curLevel].length, blocklyOptions);

      if(this.display) {
         window.quickAlgoInterface.initTestSelector(this.nbTestCases);
         window.quickAlgoInterface.onResize();
      }

      subTask.changeTest(0);

      // Log the loaded level after a second
      if(window.levelLogActivityTimeout) { clearTimeout(window.levelLogActivityTimeout); }
      window.levelLogActivityTimeout = setTimeout(function() {
         subTask.logActivity('loadLevel;' + curLevel);
         window.levelLogActivityTimeout = null;
      }, 1000);
   };

   subTask.updateScale = function() {
      setTimeout(function() {
         try {
            subTask.context.updateScale();
            subTask.blocklyHelper.updateSize();
         } catch(e) {}
      }, 0);
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
      if(this.display) {
         window.quickAlgoInterface.unloadLevel();
      }
      this.context.unload();
      this.blocklyHelper.unloadLevel();
      if(window.conceptViewer) {
         window.conceptViewer.unload();
      }
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
      //      var prefix = "Test " + (subTask.iTestCase + 1) + "/" + subTask.nbTestCases + " : ";
      subTask.iTestCase = iTestCase;
      subTask.context.iTestCase = iTestCase;
      subTask.context.nbTestCases = subTask.nbTestCases;
      subTask.context.messagePrefixFailure = '';
      subTask.context.messagePrefixSuccess = '';
      subTask.context.linkBack = false;
      subTask.context.reset(subTask.data[subTask.level][iTestCase]);
   };

   subTask.logActivity = function(details) {
      var logOption = subTask.taskParams && subTask.taskParams.options && subTask.taskParams.options.log;
      if(!logOption) { return; }

      if(!details) {
         // Sends a validate("log") to the platform if the log GET parameter is set
         // Performance note : we don't call getAnswerObject, as it's already
         // called every second by buttonsAndMessages.
         if(JSON.stringify(subTask.answer) != subTask.lastLoggedAnswer) {
            platform.validate("log");
            subTask.lastLoggedAnswer = JSON.stringify(subTask.answer);
         }
         return;
      }

      // We can only log extended activity if the platform gave us a
      // logActivity function
      if(!window.logActivity) { return; }
      window.logActivity(details);
   };

   subTask.initRun = function(callback) {
      var initialTestCase = subTask.iTestCase;
      initBlocklyRunner(subTask.context, function(message, success) {
         if(typeof success == 'undefined') {
            success = subTask.context.success;
         }
         function handleResults(results) {
            subTask.context.display = true;
            if(callback) {
               callback(message, success);
            } else if(results.successRate >= 1) {
               // All tests passed, request validate from the platform
               platform.validate("done");
            }
            if(results.successRate < 1) {
               // Display the execution message as it won't be shown through
               // validate
               window.quickAlgoInterface.displayResults(
                   {iTestCase: initialTestCase, message: message, successRate: success ? 1 : 0},
                   results
               );
            }
         }
         // Log the attempt
         subTask.logActivity();
         // Launch an evaluation after the execution

         if (!subTask.context.doNotStartGrade ) {
            subTask.context.display = false;
            subTask.getGrade(handleResults, true, subTask.iTestCase);
         } else {
            if (!subTask.context.success)
               window.quickAlgoInterface.displayError(message);
         }
      });
      initContextForLevel(initialTestCase);
   };

   subTask.run = function(callback) {
      subTask.initRun(callback);
      subTask.blocklyHelper.run(subTask.context);
   };

   subTask.submit = function() {
      this.stop();
      this.context.display = false;
      this.getAnswerObject(); // to fill this.answer;

      $('#displayHelper_graderMessage').html('<div style="margin: .2em 0; color: red; font-weight: bold;">' + languageStrings.gradingInProgress + '</div>');

      this.getGrade(function(result) {
         $('#displayHelper_graderMessage').html("");
         subTask.context.display = true;
         initBlocklyRunner(subTask.context, function(message, success) {
            window.quickAlgoInterface.displayError('<span class="testError">'+message+'</span>');
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
      if ((this.context.runner === undefined) || !this.context.runner.isRunning()) {
         this.initRun();
      }
      subTask.blocklyHelper.step(subTask.context);
   };

   subTask.stop = function() {
      this.clearAnalysis();

      if(this.context.runner) {
         this.context.runner.stop();
      }

      // Reset everything through changeTest
      subTask.changeTest(0);
   };

   /**
    * Clears the analysis container.
    */
   subTask.clearAnalysis = function() {
      if (this.blocklyHelper.clearSkulptAnalysis) {
         this.blocklyHelper.clearSkulptAnalysis();
      }
   };

   subTask.reloadStateObject = function(stateObj) {
      this.state = stateObj;
//      this.level = state.level;

//      initContextForLevel(this.level);

//      this.context.runner.stop();
   };

   subTask.loadExample = function(exampleObj) {
      subTask.blocklyHelper.loadExample(exampleObj ? exampleObj : subTask.levelGridInfos.example);
   };

   subTask.getDefaultStateObject = function() {
      return { level: "easy" };
   };

   subTask.getStateObject = function() {
      this.state.level = this.level;
      return this.state;
   };

   subTask.changeSpeed = function(speed) {
      this.context.changeDelay(speed);
      if ((this.context.runner === undefined) || !this.context.runner.isRunning()) {
         this.run();
      } else if (this.context.runner.stepMode) {
         this.context.runner.run();
      }
   };

   // used in new playback controls with speed slider
   subTask.setStepDelay = function(delay) {
      this.context.changeDelay(delay);
   };

   // used in new playback controls with speed slider
   subTask.pause = function() {
      if(this.context.runner) {
         this.context.runner.stepMode = true;
      }
   };

   // used in new playback controls with speed slider
   subTask.play = function() {
      this.clearAnalysis();

      if ((this.context.runner === undefined) || !this.context.runner.isRunning()) {
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
      if(typeof answerObj == "undefined") {
         this.answer = this.getDefaultAnswerObject();
      } else {
         this.answer = answerObj;
      }
      this.blocklyHelper.programs = this.answer;
      if (this.answer != undefined) {
         this.blocklyHelper.loadPrograms();
      }
      window.quickAlgoInterface.updateBestAnswerStatus();
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
         if(window.quickAlgoInterface) {
            window.quickAlgoInterface.displayError(null);
            if(subTask.context.display) {
               window.quickAlgoInterface.updateTestSelector(newTest);
            }
         }
      }
   };

   subTask.changeTestTo = function(iTest) {
      var delta = iTest - subTask.iTestCase;
      if(delta != 0) {
         subTask.changeTest(delta);
      }
   };

   subTask.getGrade = function(callback, display, mainTestCase) {
      // mainTest : set to indicate the first iTestCase to test (typically,
      // current iTestCase) before others; test will then stop if the
      if(subTask.context.infos && subTask.context.infos.hideValidate) {
         // There's no validation
         callback({
            message: '',
            successRate: 1,
            iTestCase: 0
         });
         return;
      }

      // XXX :: Related to platform-pr.js#L67 : why does it start two
      // evaluations at the same time? This can cause serious issues with the
      // Python runner, and on some contexts such as quick-pi
      if(window.subTaskValidating && window.subTaskValidationAttempts < 5) {
         setTimeout(function() { subTask.getGrade(callback, display, mainTestCase); }, 1000);
         window.subTaskValidationAttempts += 1;
         console.log("Queueing validation... (attempt " + window.subTaskValidationAttempts + ")");
         return;
      }
      window.subTaskValidationAttempts = 0;
      window.subTaskValidating = true;

      var oldDelay = subTask.context.infos.actionDelay;
      subTask.context.changeDelay(0);
      var codes = subTask.blocklyHelper.getAllCodes(subTask.answer);

      var checkError = '';
      var checkDisplay = function(err) { checkError = err; }
      if(!subTask.blocklyHelper.checkCodes(codes, checkDisplay)) {
         var results = {
            message: checkError,
            successRate: 0,
            iTestCase: 0
         };
         subTask.context.changeDelay(oldDelay);
         window.subTaskValidating = false;
         callback(results);
         return;
      }

      var oldTestCase = subTask.iTestCase;

      /*      var levelResultsCache = window.taskResultsCache[this.level];

            if(levelResultsCache[code]) {
               // We already have a cached result for that
               window.quickAlgoInterface.updateTestScores(levelResultsCache[code].fullResults);
               subTask.context.changeDelay(oldDelay);
               callback(levelResultsCache[code].results);
               return;
            }*/

      function startEval() {
         // Start evaluation on iTestCase
         initContextForLevel(subTask.iTestCase);
         subTask.testCaseResults[subTask.iTestCase] = {evaluating: true};
         if(display) {
            window.quickAlgoInterface.updateTestScores(subTask.testCaseResults);
         }
         var codes = subTask.blocklyHelper.getAllCodes(subTask.answer);
         subTask.context.runner.runCodes(codes);
      }

      function postEval() {
         // Behavior after an eval
         if(typeof mainTestCase == 'undefined') {
            // Normal behavior : evaluate all tests
            subTask.iTestCase++;
            if (subTask.iTestCase < subTask.nbTestCases) {
               startEval();
               return;
            }
         } else if(subTask.testCaseResults[subTask.iTestCase].successRate >= 1) {
            // A mainTestCase is defined, evaluate mainTestCase first then the
            // others until a test fails
            if(subTask.iTestCase == mainTestCase && subTask.iTestCase != 0) {
               subTask.iTestCase = 0;
               startEval();
               return;
            }
            subTask.iTestCase++;
            if(subTask.iTestCase == mainTestCase) { subTask.iTestCase++ }; // Already done
            if (subTask.iTestCase < subTask.nbTestCases) {
               startEval();
               return;
            }
         }

         // All evaluations done, tally results
         subTask.iTestCase = oldTestCase;
         if(typeof mainTestCase == 'undefined') {
            var iWorstTestCase = 0;
            var worstRate = 1;
         } else {
            // Priority to the mainTestCase if worst test case
            var iWorstTestCase = mainTestCase;
            var worstRate = subTask.testCaseResults[mainTestCase].successRate;
            // Change back to the mainTestCase
         }
         var nbSuccess = 0;
         for (var iCase = 0; iCase < subTask.nbTestCases; iCase++) {
            var sr = subTask.testCaseResults[iCase] ? subTask.testCaseResults[iCase].successRate : 0;
            if(sr >= 1) {
               nbSuccess++;
            }
            if(sr < worstRate) {
               worstRate = sr;
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
         subTask.context.changeDelay(oldDelay);
         window.subTaskValidating = false;
         callback(results);
         window.quickAlgoInterface.updateBestAnswerStatus();
      }

      initBlocklyRunner(subTask.context, function(message, success) {
         // Record grade from this evaluation into testCaseResults
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
         postEval();
      });

      subTask.iTestCase = typeof mainTestCase != 'undefined' ? mainTestCase : 0;
      subTask.testCaseResults = [];
      for(var i=0; i < subTask.iTestCase; i++) {
         // Fill testCaseResults up to the first iTestCase
         subTask.testCaseResults.push(null);
      }
      subTask.context.linkBack = true;
      subTask.context.messagePrefixSuccess = window.languageStrings.allTests;

      startEval();
   };
}
