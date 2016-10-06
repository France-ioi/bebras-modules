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
        solution: {},
        hints: {requires: "task"},
        forum: {requires: "task"},
        editor: {requires: "task"},
        submission: {requires: "task"}
    };
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
      if(levels) {
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
   
   task.load = function(views, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         mainTask = createTask(true);
         mainTask.taskParams = taskParams;
         mainTaskParams = taskParams;
         task.displayedSubTask = mainTask;
         if(levels) {
            // TODO okay to assume default level is the first level, if not supplied?
            if(defaultLevel === null || defaultLevel === undefined) {
               defaultLevel = levels[0];
            }
            
            // The objects levelAnswers and levelStates are indexed by level names.
            state = {
               levelAnswers: {},
               levelStates: {},
               level: defaultLevel
            };
            mainTask.loadLevel(state.level, null, views);
            displayHelper.setupLevels(null, reloadWithCallbacks);
            callback();
         }
         else {
            // TODO what's the desired behavior when no levels?
            mainTask.load(views, callback);
         }
      });
   };
   
   task.getState = function(callback) {
      if(levels) {
         // Update state to reflect latest user interaction.
         state.levelStates[state.level] = mainTask.getStateObject();
         state.levelAnswers[state.level] = mainTask.getAnswerObject();
         callback(JSON.stringify(state));
      }
      else {
         // TODO is this the desired behavior? It is from beaver-task-1.0.
         var currentState = {};
         mainTask.getAnswer(function(displayedAnswer) {
            currentState.displayedAnswer = displayedAnswer;
            callback(JSON.stringify(currentState));
         });
      }
   };
   
   task.getStateObject = function() {
      state.levelStates[state.level] = mainTask.getStateObject();
      state.levelAnswers[state.level] = mainTask.getAnswerObject();
      return state;
   };
   
   task.reloadAnswer = function(strAnswer, callback) {
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
      if(levels) {
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
      task.reloadStateObject(JSON.parse(newStateStr), callback);
   };

   task.reloadStateObject = function(newState, callback) {
      if(levels) {
         // Recreate the task to reflect the new state.
         state = newState;
         var level = state.level;
         var levelState = state.levelStates[level];
         destroyTask(mainTask, function() {
            mainTask = createTask(true);
            mainTask.taskParams = mainTaskParams;
            task.displayedSubTask = mainTask;
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
      if(levels) {
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
      if(levels) {
         state.levelAnswers[state.level] = mainTask.getAnswerObject();
         return state.levelAnswers;
      }
      else {
         return mainTask.getAnswerObject();
      }
   };

   task.unload = function(callback) {
      var instances = [];
      if (levels) {
         for(var iLevel in gradingTasks) {
            for(var iSeed in gradingTasks[iLevel]) {
               instances.push(gradingTasks[iLevel][iSeed]);
            }
         }
      } else {
         for(var iSeed in gradingTasks) {
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

      if (Blockly != undefined) { // TEMPORARY, to replace with a global unload function provided by the task
         removeBlockly();
      }
   };

   function gradeAnswerInner(gradingTask, answer, maxScore, callback) {
      gradingTask.isGrading = true;
      if(answer === undefined || answer === null) {
         answer = gradingTask.getDefaultAnswerObject();
      }
      gradingTask.reloadAnswerObject(answer);
      gradingTask.getGrade(function(result) {
         gradingTask.isGrading = false;
         callback({
            score: Math.round(result.successRate * maxScore),
            message: result.message
         });
      });
   }
   
   function gradeAnswerByLevel(taskParams, level, seed, levelAnswer, maxScore, callback) {
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
         gradeAnswerInner(gradingTask, levelAnswer, maxScore, callback);
      }
      // Current gradingTasks[level][seed] instance is busy, so create a temporary instance,
      // to be destroyed immediately after grading.
      else if(gradingTasks[level][seed].isGrading) {
         gradingTask = createTask(false);
         gradingTask.taskParams = taskParams;
         gradingTask.isGrading = false;
         gradingTask.loadLevel(level);
         gradeAnswerInner(gradingTask, answer, maxScore, function(result) {
            destroyTask(gradingTask, function() {
               callback(result);
            });
         });
      }
      // Current gradingTasks[level][seed] instance is not busy, use it.
      else {
         gradingTasks[level][seed].taskParams = taskParams;
         gradeAnswerInner(gradingTasks[level][seed], levelAnswer, maxScore, callback);
      }
   }

   function gradeAnswerNoLevels(taskParams, seed, answer, maxScore, callback) {
      var gradingTask;

      // Grade a task instance.
      var doGrading = function() {
         gradeAnswerInner(gradingTask, answer, maxScore, callback);
      };

      // Grade a task instance and destroy it. Invoke callback after destruction.
      var doGradingAndDestroy = function() {
         gradeAnswerInner(gradingTask, answer, maxScore, function(result) {
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
            var levelAnswers = parsedAnswer;
            var scores = {};
            var messages = {};
            
            callbackLoop(levels, function(level, loopCallback) {
               if(gradedLevel !== null && gradedLevel !== undefined && level !== gradedLevel) {
                  loopCallback();
                  return;
               }
               gradeAnswerByLevel(taskParams, level, seed, levelAnswers[level], maxScores[level], function(result) {
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
            gradeAnswerNoLevels(taskParams, seed, parsedAnswer, taskParams.maxScore, function(result) {
               callback(result.score, result.message);
            });
         }
      });
   };
   
   // TODO is this the correct behavior?
   grader.gradeTask = task.gradeAnswer;
   task.gradeTask = grader.gradeTask;
}

$('document').ready(function() {
   platform.initWithTask(window.task);
});
