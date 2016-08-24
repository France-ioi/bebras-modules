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

function initWrapper(initTaskFor, levels, defaultLevel, reloadWithCallbacks) {
   // Create a taskFor instance, possibly operating on an existing object.
   function createTask(displayFlag) {
      var taskFor = {};
      taskFor.delayFactory = new DelayFactory();
      taskFor.raphaelFactory = new RaphaelFactory();
      
      // Simulation factory needs a specific corresponding delay factory.
      // TODO should it expect something else? taskFor? A list of factories?
      taskFor.simulationFactory = new SimulationFactory(taskFor.delayFactory);
      
      taskFor.display = displayFlag;
      initTaskFor(taskFor);
      return taskFor;
   }
   
   // Destroy a taskFor instance.
   function destroyTask(taskFor, callback) {
      var doUnload = function() {
         // Order is important.
         taskFor.raphaelFactory.destroyAll();
         taskFor.simulationFactory.destroyAll();
         taskFor.delayFactory.destroyAll();
         if(callback && typeof callback === "function") {
            callback();
         }
      };
      if(levels) {
         taskFor.unloadLevel(doUnload);
      }
      else {
         // TODO Can we assume non-level tasks will imeplement 'unload'?
         taskFor.unload(doUnload);
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
   
   // Main taskFor instance, for user display.
   var mainTask;
   
   // The state of the task, including current level and levelState for each level.
   var state = null;
   
   // Instances of taskFor intended for grading.
   var gradingTasks = {};
   
   task.load = function(views, callback) {
      mainTask = createTask(true);
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
      return state;
   };
   
   task.reloadAnswer = function(strAnswer, callback) {
      var newAnswer;
      if(strAnswer) {
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

         var levelState = state.levelStates[level];
         if(mainTask.getDefaultStateObject && (levelState === undefined || levelState === null)) {
            levelState = mainTask.getDefaultStateObject();
            state.levelStates[level] = levelState;
         }
         
         destroyTask(mainTask, function() {
            mainTask = createTask(true);
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
            mainTask.reloadAnswerObject(JSON.parse(newAnswers));
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
      return state.levelAnswers;
   };

   task.unload = function(callback) {
      var instances = [];
      for(var iLevel in gradingTasks) {
         for(var iSeed in gradingTasks[iLevel]) {
            instances.push(gradingTasks[iLevel][iSeed]);
         }
      }
      instances.push(mainTask);
      callbackLoop(instances, function(taskFor, loopCallback) {
         destroyTask(mainTask, loopCallback);
      }, function() {
         task.displayedSubTask = null;
         callback();
      });
   };

   function gradeAnswerByLevel(level, seed, levelAnswer, maxScore, callback) {
      // Create grading taskFor instance if it does not exist.
      if(!gradingTasks[level]) {
         gradingTasks[level] = {};
      }
      if(!gradingTasks[level][seed]) {
         var gradingTask = createTask(false);
         gradingTask.loadLevel(level);
         gradingTasks[level][seed] = gradingTask;
      }
      
      // Load answer and grade it.
      if(levelAnswer === undefined || levelAnswer === null) {
         levelAnswer = gradingTasks[level][seed].getDefaultAnswerObject();
      }
      gradingTasks[level][seed].reloadAnswerObject(levelAnswer);
      gradingTasks[level][seed].getGrade(function(grade) {
         callback({
            score: Math.round(grade.successRate * maxScore),
            message: grade.message
         });
      });
   }
   
   // TODO: case where gradeAnswer is called again before it calls its callback
   task.gradeAnswer = function(strAnswer, answerToken, callback, gradedLevel) {
      if(levels) {
         // TODO Can we fetch task params just once instead of every time?
         // If we can, then why do we need to index by seed in graders[level][seed]?
         platform.getTaskParams(null, null, function(taskParams) {
            if (strAnswer === '') {
               callback(taskParams.minScore, '');
               return;
            }
            
            var seed = taskParams.randomSeed;
            var maxScores = displayHelper.getLevelsMaxScores();
            
            // TODO generalize this according to list of levels?
            // What can we assume agbout maxScores?
            var gradingMaxScore = {
               easy: maxScores.easy,
               medium: maxScores.medium - maxScores.easy,
               hard: maxScores.hard - maxScores.medium
            };
            
            var levelAnswers = $.parseJSON(strAnswer);
            var scores = {};
            var messages = {};
            
            // Grade all levels. If gradedLevel is supplied, skip others.
            callbackLoop(levels, function(level, loopCallback) {
               if(gradedLevel !== null && gradedLevel !== undefined && level !== gradedLevel) {
                  loopCallback();
                  return;
               }
               gradeAnswerByLevel(level, seed, levelAnswers[level], maxScores[level], function(result) {
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
         });
      }
      else {
         // TODO What's the correct behavior here with no levels?   
      }
   };
   
   if(levels) {
      // TODO is this the correct behavior?
      grader.gradeTask = task.gradeAnswer;
   }
}

$('document').ready(function() {
   platform.initWithTask(window.task);
});
