/*
 * This file is to be included by beaver contest tasks, it defines a basic
 * implementation of the main functions of the task object, as well as a grader.
 *
 * Task can overwrite these definitions.
 *
 */


/************************************************************************
 * Untouched parts from beaver-task-1.0.
 ************************************************************************/

var task = {};

task.showViews = function(views, callback) {
   if (views.forum || views.hint || views.editor) {
      //console.error("this task does not have forum, hint nor editor specific view, showing task view instead.");
      views.task = true;
   }
   $.each(['task', 'solution'], function(i, view) {
      if (views[view]) {
         $('#'+view).show();
      } else {
         $('#'+view).hide();
      }
   });
   if (typeof task.hackShowViews === 'function') {task.hackShowViews(views);}
   callback();
};

task.getViews = function(callback) {
    // all beaver tasks have the same views
    var views = {
        task: {},
        hints: {requires: "task"},
        forum: {requires: "task"},
        editor: {requires: "task"},
        submission: {requires: "task"}
    };

    // Only declare the solution view if there's actually one
    var solution = $('#solution').html();
    if(solution && $.trim('' + solution)) {
        views.solution = {};
    }

    callback(views);
};

task.updateToken = function(token, callback) {
   callback();
};

task.getHeight = function(callback) {
   callback(parseInt($("html").outerHeight(true)));
};

task.getMetaData = function(callback) {
   if (typeof json !== 'undefined') {
      callback(json);
   } else {
      callback({nbHints:0});
   }
};


/************************************************************************
 * Updated parts in beaver-task-2.0.
 ************************************************************************/

// TODO We update the grader below, if the task has levels. Is this line necessary?
var grader = grader ? grader : {};

function getUrlParameter(sParam) {
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

window.forcedLevel = getUrlParameter("level");
window.initialLevel = getUrlParameter("initialLevel");

function initWrapper(initSubTask, levels, defaultLevel, reloadWithCallbacks) {
   // Create a subTask instance, possibly operating on an existing object.
   function createTask(displayFlag) {
      var subTask = {};
      subTask.delayFactory = new DelayFactory();
      subTask.raphaelFactory = new RaphaelFactory();

      // Simulation factory needs a specific corresponding delay factory.
      // TODO should it expect something else? subTask? A list of factories?
      subTask.simulationFactory = new SimulationFactory(subTask.delayFactory);

      subTask.display = displayFlag;
      initSubTask(subTask);
      return subTask;
   }

   // Destroy a subTask instance.
   function destroyTask(subTask, callback) {
      var doUnload = function() {
         // Order is important.
         subTask.raphaelFactory.destroyAll();
         subTask.simulationFactory.destroyAll();
         subTask.delayFactory.destroyAll();
         if(callback && typeof callback === "function") {
            callback();
         }
      };
      if(levels || subTask.assumeLevels) {
         subTask.unloadLevel(doUnload);
      }
      else {
         // TODO Can we assume non-level tasks will imeplement 'unload'?
         subTask.unload(doUnload);
      }
   }

   // Invoke a function for each level, and wait for callback.
   // When done, invoke finalCallback (optional).
   function callbackLoop(array, itemCallback, finalCallback) {
      var index = 0;
      function innerLoop() {
         if(index >= array.length) {
            if(finalCallback) {
               finalCallback();
            }
            return;
         }
         itemCallback(array[index], function() {
            index++;
            innerLoop();
         });
      }
      innerLoop();
   }

   // Main subTask instance, for user display.
   var mainTask;
   var mainTaskParams;

   // The state of the task, including current level and levelState for each level.
   var state = null;

   // Instances of subTask intended for grading.
   var gradingTasks = {};

   // Store whether this task has loaded but reloadAnswer was not yet called.
   // Used for automatically changing to the first level that can gain points.
   var hasJustLoaded = false;

   task.load = function(views, callback) {
      hasJustLoaded = true;
      var urlOptions = {};
      try {
         var strOptions = getUrlParameter("options");
         if (strOptions && strOptions.trim()) {
            urlOptions = JSON.parse(strOptions);
         }
      } catch (exception) {
         console.error("Error when parsing options URL parameter.");
      }

      platform.getTaskParams(null, null, function(taskParams) {
         if (!taskParams.options) {
            taskParams.options = {};
         }

         taskParams.options = $.extend({}, urlOptions, taskParams.options);
         if (taskParams.options.level) {
            window.forcedLevel = taskParams.options.level;
         }
         if (taskParams.options.initialLevel) {
            window.initialLevel = taskParams.options.initialLevel;
         }
         if(window.forcedLevel) {
            window.initialLevel = window.forcedLevel;
            levels = [window.forcedLevel];
         }
         if(window.initialLevel) {
            defaultLevel = window.initialLevel;
         } else if(defaultLevel) {
            window.initialLevel = defaultLevel;
         }

         if(levels) {
            var found = {};
            for(var i = 0; i < levels.length ; i++) {
               found[levels[i]] = true;
            }
            if(!found[window.initialLevel]) {
               window.initialLevel = found['easy'] ? 'easy' : levels[0];
            }
         }

         mainTask = createTask(true);
         mainTask.taskParams = taskParams;
         mainTaskParams = taskParams;
         task.displayedSubTask = mainTask;

         if(levels || mainTask.assumeLevels) {
            // mainTask.assumeLevels is used for some quickAlgo tasks which
            // don't declare any levels at all
            if (window.forcedLevel) {
               $("." + window.forcedLevel).show(); // TODO: why is it needed here?
            }
            if(!window.initialLevel) {
               // Should happen only if mainTask.assumeLevels
               window.initialLevel = "easy";
            }
            if(defaultLevel === null || defaultLevel === undefined) {
               defaultLevel = window.initialLevel;
            }

            // The objects levelAnswers and levelStates are indexed by level names.
            state = {
               levelAnswers: {},
               levelStates: {},
               level: defaultLevel
            };
            if(window.displayHelper) {
               displayHelper.displayLevel(state.level);
            }
            mainTask.loadLevel(state.level, null, views);
            if(levels) {
               displayHelper.setupLevels(defaultLevel, reloadWithCallbacks, levels);
            }
            callback();
         }
         else {
            // TODO what's the desired behavior when no levels?
            mainTask.load(views, callback);
         }
      });
   };

   task.getState = function(callback) {
      if(levels || mainTask.assumeLevels) {
         // Update state to reflect latest user interaction.
         state.levelStates[state.level] = mainTask.getStateObject();
         state.levelAnswers[state.level] = mainTask.getAnswerObject();
         callback(JSON.stringify(state));
      }
      else {
         // TODO is this the desired behavior? It is from beaver-task-1.0.
         var currentState = {};
         var displayedAnswer = mainTask.getAnswerObject();
         currentState.displayedAnswer = displayedAnswer;
         callback(JSON.stringify(currentState));
      }
   };

   task.getStateObject = function() {
      state.levelStates[state.level] = mainTask.getStateObject();
      state.levelAnswers[state.level] = mainTask.getAnswerObject();
      return state;
   };

   task.reloadAnswer = function(strAnswer, callback) {
      if(hasJustLoaded && levels) {
         // If this is the first time we reload an answer, jump to the first
         // level that can gain points, if there are levels.
         hasJustLoaded = false;
         task.gradeAnswer(strAnswer, null, function(score, message) {
            var maxScores = displayHelper.getLevelsMaxScores();
            var level = window.initialLevel;
            for(var i=1; i < levels.length; i++) {
               if(score >= maxScores[levels[i-1]]) {
                  level = levels[i];
               }
            }
            if (window.forcedLevel != null) {
               level = window.forcedLevel;
            }
            var newAnswer = null;
            if(strAnswer && strAnswer !== '') {
               newAnswer = JSON.parse(strAnswer);
            }
            task.reloadAnswerObject(newAnswer, function() {
               displayHelper.setLevel(level);
               callback();
            });
         });
         return;
      }

      var newAnswer;
      if(strAnswer && strAnswer !== '') {
         newAnswer = JSON.parse(strAnswer);
      }
      else {
         newAnswer = null;
      }
      task.reloadAnswerObject(newAnswer, callback);
   };

   task.reloadAnswerObject = function(newAnswers, callback) {
      if(levels || mainTask.assumeLevels) {
         if (!newAnswers) {
            state.levelAnswers = {};
         }
         else {
            state.levelAnswers = newAnswers;
         }

         // Recreate the main task and load the relevant answer.
         var level = state.level;
         var levelAnswer = state.levelAnswers[level];
         if(levelAnswer === undefined || levelAnswer === null) {
            levelAnswer = mainTask.getDefaultAnswerObject();
            state.levelAnswers[level] = levelAnswer;
         }

         state.levelStates[state.level] = mainTask.getStateObject();
         var levelState = state.levelStates[level];
         if(mainTask.getDefaultStateObject && (levelState === undefined || levelState === null)) {
            levelState = mainTask.getDefaultStateObject();
            state.levelStates[level] = levelState;
         }

         destroyTask(mainTask, function() {
            mainTask = createTask(true);
            mainTask.taskParams = mainTaskParams;
            task.displayedSubTask = mainTask;
            if(window.displayHelper) {
               displayHelper.displayLevel(level);
            }
            mainTask.loadLevel(level, levelState);
            mainTask.reloadAnswerObject(levelAnswer);
            if(mainTask.resetDisplay) {
               mainTask.resetDisplay();
            }
            if(callback && typeof callback === "function") {
               callback();
            }
         });
      }
      else {
         // TODO is this the desired behavior? Taken from beaver-task-1.0.
         if (!newAnswers) {
            mainTask.reloadAnswerObject(mainTask.getDefaultAnswerObject());
         } else {
            mainTask.reloadAnswerObject(newAnswers);
         }
         if(callback && typeof callback === "function") {
            callback();
         }
      }
   };

   task.reloadState = function(newStateStr, callback) {
      if (newStateStr) {
         task.reloadStateObject(JSON.parse(newStateStr), callback);
      } else {
         task.reloadStateObject(task.getDefaultStateObject(), callback);
      }
   };

   task.reloadStateObject = function(newState, callback) {
      if(levels || mainTask.assumeLevels) {
         // Recreate the task to reflect the new state.
         state = newState;
         if(!state.levelStates) { state.levelStates = {}; }
         if(!state.levelAnswers) { state.levelAnswers = {}; }
         if(!state.level) {
            state.level = window.forcedLevel || window.initialLevel;
         }
         var level = state.level;
         var levelState = state.levelStates[level];
         destroyTask(mainTask, function() {
            mainTask = createTask(false);
            mainTask.taskParams = mainTaskParams;
            task.displayedSubTask = mainTask;
            if(window.displayHelper) {
               displayHelper.displayLevel(level);
            }
            mainTask.loadLevel(level, levelState);
            mainTask.reloadAnswerObject(state.levelAnswers[level]);
            if(callback && typeof callback === "function") {
               callback();
            }
         });
      }
      else {
         // TODO is this the desired behavior? Taken from beaver-task-1.0.
         if (typeof newState.displayedAnswer !== 'undefined') {
            mainTask.reloadAnswer(newState.displayedAnswer, callback);
         }
         else {
            if(callback && typeof callback === "function") {
               callback();
            }
         }
      }
   };

   task.getDefaultStateObject = function() {
      return {
         level: defaultLevel,
         levelStates: {},
         levelAnswers: {}
      };
   };

   task.getDefaultAnswerObject = function() {
      return {};
   };

   task.getAnswer = function(callback) {
      if(levels || mainTask.assumeLevels) {
         // Update answer to reflect latest user interaction.
         state.levelAnswers[state.level] = mainTask.getAnswerObject();
         callback(JSON.stringify(state.levelAnswers));
      }
      else {
         // TODO is this desired behavior? Taken from beaver-task-1.
         var answerObj = mainTask.getAnswerObject();
         callback(JSON.stringify(answerObj));
      }
   };

   task.getAnswerObject = function() {
      if(levels || mainTask.assumeLevels) {
         state.levelAnswers[state.level] = mainTask.getAnswerObject();
         return state.levelAnswers;
      }
      else {
         return mainTask.getAnswerObject();
      }
   };

   task.unload = function(callback) {
      var instances = [];
      var iSeed;

      if (typeof Blockly !== 'undefined') { // TEMPORARY, to replace with a global unload function provided by the task
         removeBlockly();
      }


      if (levels) {
         for(var iLevel in gradingTasks) {
            for(iSeed in gradingTasks[iLevel]) {
               instances.push(gradingTasks[iLevel][iSeed]);
            }
         }
      } else {
         for(iSeed in gradingTasks) {
            instances.push(gradingTasks[iSeed]);
         }
      }
      instances.push(mainTask);
      callbackLoop(instances, function(subTask, loopCallback) {
         destroyTask(subTask, loopCallback);
      }, function() {
         task.displayedSubTask = null;
         callback();
      });

   };

   function gradeAnswerInner(gradingTask, answer, minScore, maxScore, callback) {
      gradingTask.isGrading = true;
      if(answer === undefined || answer === null) {
         answer = gradingTask.getDefaultAnswerObject();
      }
      if (window.forcedLevel != null && answer[window.forcedLevel]) {
         answer = answer[window.forcedLevel];
      } else if(!levels && mainTask.assumeLevels && answer.easy) {
         answer = answer.easy;
      }
      gradingTask.reloadAnswerObject(answer);
      gradingTask.getGrade(function(result) {
         gradingTask.isGrading = false;
         var score = 0;
         if(result.successRate > 0) {
            score = Math.round(result.successRate * (maxScore - minScore) + minScore);
         }
         callback({
            score: score,
            message: result.message
         });
      });
   }

   function gradeAnswerByLevel(taskParams, level, seed, levelAnswer, minScore, maxScore, callback) {
      var gradingTask;

      if(!gradingTasks[level]) {
         gradingTasks[level] = {};
      }
      // Create new instance to be kept in gradingTasks array, and use it for this grading.
      if(!gradingTasks[level][seed]) {
         gradingTask = createTask(false);
         gradingTask.taskParams = taskParams;
         gradingTask.isGrading = false;
         gradingTask.loadLevel(level);
         gradingTasks[level][seed] = gradingTask;
         gradeAnswerInner(gradingTask, levelAnswer, minScore, maxScore, callback);
      }
      // Current gradingTasks[level][seed] instance is busy, so create a temporary instance,
      // to be destroyed immediately after grading.
      else if(gradingTasks[level][seed].isGrading) {
         gradingTask = createTask(false);
         gradingTask.taskParams = taskParams;
         gradingTask.isGrading = false;
         gradingTask.loadLevel(level);
         gradeAnswerInner(gradingTask, levelAnswer, minScore, maxScore, function(result) {
            destroyTask(gradingTask, function() {
               callback(result);
            });
         });
      }
      // Current gradingTasks[level][seed] instance is not busy, use it.
      else {
         gradingTasks[level][seed].taskParams = taskParams;
         gradeAnswerInner(gradingTasks[level][seed], levelAnswer, minScore, maxScore, callback);
      }
   }

   function gradeAnswerNoLevels(taskParams, seed, answer, minScore, maxScore, callback) {
      var gradingTask;

      // Grade a task instance.
      var doGrading = function() {
         gradeAnswerInner(gradingTask, answer, minScore, maxScore, callback);
      };

      // Grade a task instance and destroy it. Invoke callback after destruction.
      var doGradingAndDestroy = function() {
         gradeAnswerInner(gradingTask, answer, minScore, maxScore, function(result) {
            destroyTask(gradingTask, function() {
               callback(result);
            });
         });
      };

      // Create new instance to be kept in gradingTasks array, and use it for this grading.
      if(!gradingTasks[seed]) {
         gradingTask = createTask(false);
         gradingTask.taskParams = taskParams;
         gradingTasks[seed] = gradingTask;
         gradingTask.load(null, doGrading);
      }
      // Current gradingTasks[seed] instance is busy, so create a temporary instance,
      // to be destroyed immediately after grading.
      else if(gradingTasks[seed].isGrading) {
         gradingTask = createTask(false);
         gradingTask.taskParams = taskParams;
         gradingTask.load(null, doGradingAndDestroy);
      }
      // Current gradingTasks[seed] instance is not busy, use it.
      else {
         gradingTask = gradingTasks[seed];
         gradingTask.taskParams = taskParams;
         doGrading();
      }
   }

   task.gradeAnswer = function(strAnswer, answerToken, callback) {
      task.getLevelGrade(strAnswer, answerToken, callback, null);
   };

   // TODO: case where gradeAnswer is called again before it calls its callback
   task.getLevelGrade = function(strAnswer, answerToken, callback, gradedLevel) {
      // TODO Can we fetch task params just once instead of every time?
      // If we can, then why do we need to index by seed in graders[level][seed]?
      platform.getTaskParams(null, null, function(taskParams) {
         if (strAnswer === '') {
            callback(taskParams.minScore, '');
            return;
         }

         var seed = taskParams.randomSeed;
         var parsedAnswer = $.parseJSON(strAnswer);

         if(levels) {
            var maxScores = displayHelper.getLevelsMaxScores();
            var minScores = {};
            for(var i=0; i < levels.length; i++) {
                minScores[levels[i]] = i > 0 ? maxScores[levels[i-1]] : 0;
            }
            var levelAnswers = parsedAnswer;
            var scores = {};
            var messages = {};

            callbackLoop(levels, function(level, loopCallback) {
               if(gradedLevel !== null && gradedLevel !== undefined && level !== gradedLevel) {
                  loopCallback();
                  return;
               }
               gradeAnswerByLevel(taskParams, level, seed, levelAnswers[level], minScores[level], maxScores[level], function(result) {
                  scores[level] = result.score;
                  messages[level] = result.message;
                  loopCallback();
               });
            },
            function() {
               // TODO is this correct? Taken from Arthur's level wrapper.
               if(gradedLevel === null || gradedLevel === undefined) {
                  displayHelper.sendBestScore(callback, scores, messages);
               } else {
                  callback(scores[gradedLevel], messages[gradedLevel]);
               }
            });
         }
         else {
            gradeAnswerNoLevels(taskParams, seed, parsedAnswer, taskParams.minScore, taskParams.maxScore, function(result) {
               callback(result.score, result.message);
            });
         }
      });
   };

   // TODO is this the correct behavior?
   grader.gradeTask = task.gradeAnswer;
   task.gradeTask = grader.gradeTask;
}

/************************************************************************
 * Utilities
 ************************************************************************/

function extractLevelSpecific(item, level) {
   if ((typeof item != "object")) {
      return item;
   }
   if($.isArray(item)) {
      return $.map(item, function(val) {
         return extractLevelSpecific(val, level);
         });
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
   if ($.isArray(item.shared)) {
      var newItem = [];
      for (var iElem = 0; iElem < item.shared.length; iElem++) {
         newItem.push(extractLevelSpecific(item.shared[iElem], level));
      }
      if (item[level] != undefined) {
         if (!$.isArray(item[level])) {
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


function sendErrorLog() {
   // Send errors to the platform
   var args = Array.prototype.slice.call(arguments);
   var key = args.join(':');
   if(key == window.lastErrorLogSentKey) { return; }
   try {
      window.platform.log(["error", args]);
   } catch(e) {}
}

window.onerror = sendErrorLog;

$('document').ready(function() {
   platform.initWithTask(window.task);
});
