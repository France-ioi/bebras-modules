
//-----------------------------------------------------------------
// GENERIC WRAPPER


// Note: taking initTaskFor as argument
function levelWrapperInitTask(initTaskFor) 
{
   'use strict';
   var usingState = false;

   var loadedLevel = null; // level loaded in the internal object
   var displayedLevel = null; // level that the user sees in the tab, null if there has never been a call to taskFor.loadLevel with display = true
   var levels; // array of the names of available levels
   var stateFor = null; // an array giving for each level, an object describing the state for this level
   var answerFor = null;  // an array giving for each level, an object describing the answer for this level

   var taskFor = {}; // task object used for the main display
   var graders = {};  // array of task objects used for grading (indexed by level and by seed)

   // Initialization of the main task object
   initTaskFor(taskFor);

   // Performs the switch, but without changing the display
   var switchLevelTo = function(level) {
      // console.log("switchLevelTo to " + level);

      if (level == null) { 
         alert("ERROR: calling switchLevelTo on a null level");
      }

      // No need to do anything if the level is already the one loaded
      if (level === loadedLevel) {
         return; 
      }

      // Perform the level switch, and recall which level is loaded
      taskFor.loadLevel(level, false);
      loadedLevel = level;
   };

   var unloadDisplayedLevel = function() {
      if (displayedLevel != null) {
         if (taskFor.unloadLevel != null) {
            taskFor.unloadLevel(displayedLevel);
         }
      }
   };

   task.load = function(views, callback) {
      // console.log("load");
      if (taskFor.getStateObject != null) {
         usingState = true;
      }
      // NOTE: call to getLevels is assumed to return non empty array
      levels = taskFor.getLevels(); 
      stateFor = task.getDefaultStateObject().stateFor;
      answerFor = task.getDefaultAnswerObject();
      // NOTE: call to load should not assume level, answer or state to have been provided
      taskFor.load(views, function() {
         displayHelper.setupLevels();  
        callback();
      });
   };

   task.getDefaultStateObject = function() {
      // console.log("getDefaultStateObject");
      var stateForDefault = {};
      for (var iLevel in levels) {
         var sLevel = levels[iLevel];
         switchLevelTo(sLevel);
           // call below is assumed to not depend on the current state of the task
         if (usingState) {
            stateForDefault[sLevel] = taskFor.getDefaultStateObject(); 
         } else {
            stateForDefault[sLevel] = null;
         }
      }
      var stateObj = { level: levels[0], stateFor: stateForDefault };
      if (displayedLevel != null) {
         switchLevelTo(displayedLevel);
      }
      return stateObj;
   };

   task.getStateObject = function() {
      if (displayedLevel != null) {
         if (usingState) {
            taskFor[displayedLevel] = taskFor.getStateObject();
         }
      }
      return { level: displayedLevel, stateFor: stateFor };
   };

   var switchDisplayedLevelTo = function(level, display) {
      // Should not be called with a null level

      // console.log("switchDisplayedLevelTo from "  + displayedLevel + " to " + level);

      var changingDisplayedLevel = (level != displayedLevel);

      // Load level settings (does nothing if already loaded)
      switchLevelTo(level);

      // Change displayed level if needed
      if (changingDisplayedLevel) {
         // Unload displayed level if changing
         unloadDisplayedLevel();       
         // Reload state and answer if changing
         taskFor.reloadAnswerObject(answerFor[level]); 
         if (usingState) {
            taskFor.reloadStateObject(stateFor[level]);
         }
      }
      
      if (display) {
         // If changing level, rebuild the graphics for this level, 
         // and compute the display to the answer/state that have been loaded
         if (changingDisplayedLevel) {
            taskFor.loadLevel(level, true); 
            taskFor.updateDisplay();
         }
      }
      displayedLevel = level;
   };

   task.reloadStateObject = function(stateObj, display) {
      // console.log("reloadStateObject");

      // Note: the implementation could be optimized in case the level does
      // not change, but since this function is currently called only
      // to change the level, there is no reason to optimize.
      stateFor = stateObj.stateFor;
      switchDisplayedLevelTo(stateObj.level, display);
   };

   task.reloadAnswerObject = function(answerObj) {
      // console.log("reloadAnswerObject");
      answerFor = answerObj;

      if (displayedLevel != null) {
         // Need to reset the state in case a level is displayed
         if (usingState) {
            var s = taskFor.getDefaultStateObject(); 
            stateFor[displayedLevel] = s;
            taskFor.reloadStateObject(s);
         } 
         taskFor.reloadAnswerObject(answerFor[displayedLevel]);
         taskFor.updateDisplay();
      }
   };

   task.getAnswerObject = function() {
      if (displayedLevel == null) {
         alert("ERROR task.getAnswerObject called when displayedLevel is null");
      }
      answerFor[displayedLevel] = taskFor.getAnswerObject();
      return answerFor;
   };

   task.getDefaultAnswerObject = function() {
      // console.log("getDefaultAnswerObject");
      var answerForDefault = {};
      for (var iLevel in levels) {
         var sLevel = levels[iLevel];
         switchLevelTo(sLevel);
           // call below is assumed to not depend on the current state of the task
         answerForDefault[sLevel] = taskFor.getDefaultAnswerObject(); 
      }
      if (displayedLevel != null) {
         switchLevelTo(displayedLevel);
      }
      return answerForDefault;
   };

   task.unload = function(callback) {
      unloadDisplayedLevel();
      if (taskFor.unload != null) {
         taskFor.unload(callback);
      } else {
         callback();
      }
   };  
   

   // Grade, creating a grader if needed
   function grade(level, seed, answerOfLevel, maxScore) {
      if (graders[level] == null) {
         graders[level] = {};
      }
      if (graders[level][seed] == null) {
         var taskGrader = {};
         initTaskFor(taskGrader);
         taskGrader.loadLevel(level, false);
         graders[level][seed] = taskGrader;
      }
      var grader = graders[level][seed];
      grader.reloadAnswerObject(answerOfLevel); 
      return grader.grade(maxScore);
   }

   // overwrite the grader built by levelWrapperInitTask
   grader.gradeTask = function(strAnswer, token, callback) {
      task.getLevelGrade(strAnswer, token, callback, null);
   };

   task.getLevelGrade = function(strAnswer, token, callback, gradedLevel) {

      platform.getTaskParams(null, null, function(taskParams) {

         if (strAnswer === '') {
            callback(taskParams.minScore, '');
            return;
         }

         //---
         // TODO: migrate this into the task.LOAD after the wrapper are merged

         // local information, queried only once
         var randomSeed = taskParams.randomSeed;
         var maxScores = displayHelper.getLevelsMaxScores();

         // compute max scores per level
         var gradingMaxScore = {
            easy: maxScores.easy,
            medium: maxScores.medium - maxScores.easy,
            hard: maxScores.hard - maxScores.medium };

         //---
         var answer = $.parseJSON(strAnswer);
         var scores = {};
         var messages = {};

         for (var iLevel in levels) {
            var sLevel = levels[iLevel];

            // Only grade the levels that are requested
            if (gradedLevel != null && gradedLevel != sLevel) {
               continue;
            }

            // TODO: ici du code spécifique aux étoiles castor qu'il faudra migrer ailleurs
            
            var grading = grade(sLevel, randomSeed, answer[sLevel], gradingMaxScore[sLevel]);

            var extraScore = grading.score;
            var score = 0;
            if (extraScore > 0) {
               if (sLevel == "easy") {
                  score = extraScore;
               } else if (sLevel == "medium") {
                  score = maxScores.easy + extraScore;
               } else if (sLevel == "hard") {
                  score = maxScores.medium + extraScore;
               } else {
                  // unsupported
               }
            }
            scores[sLevel] = score;
            messages[sLevel] = grading.message;
         }

         if (gradedLevel == null) {
            displayHelper.sendBestScore(callback, scores, messages);
         } else {
            callback(scores[gradedLevel], messages[gradedLevel]);
         }
      });
   };

   // TODO: is this useful?
   task.gradeTask = grader.gradeTask;
}

// -----------------------DEPRECATED-----------------------

/*

   grader.gradeTask = function(strAnswer, token, callback) {
      task.getLevelGrade(strAnswer, token, callback, null);
   };

   task.getLevelGrade = function(strAnswer, token, callback, gradedLevel) {
      // console.log("grader");
      // NOTE: be careful with callbacks.
      var taskParams = displayHelper.taskParams;
      var maxScores = displayHelper.getLevelsMaxScores();
      var answer = $.parseJSON(strAnswer);
      var scores = {};
      var messages = {};

      if (strAnswer === '') {
         callback(taskParams.minScore, '');
         return;
      }

      for (var iLevel in levels) {
         var sLevel = levels[iLevel];

         // Only grade the levels that are requested
         if (gradedLevel != null && gradedLevel != sLevel) {
            continue;
         }

         // NOTE: the grader does not reload the states in taskFor, only the answer,
         // so the grader should only depend on the level and the answer.
         switchLevelTo(sLevel);
         taskFor.reloadAnswerObject(answer[sLevel]);
    
         // TODO: ici du code spécifique aux étoiles castor qu'il faudra migrer ailleurs
         
         var gradingMaxScore = 0;
         if (sLevel == "easy") {
            gradingMaxScore = maxScores.easy;
         } else if (sLevel == "medium") {
            gradingMaxScore = maxScores.medium - maxScores.easy;
         } else if (sLevel == "hard") {
            gradingMaxScore = maxScores.hard - maxScores.medium;
         }
         var grading = taskFor.grade(gradingMaxScore, answer);
         var extraScore = grading.score;
         var score = 0;
         if (extraScore > 0) {
            if (sLevel == "easy") {
               score = extraScore;
            } else if (sLevel == "medium") {
               score = maxScores.easy + extraScore;
            } else if (sLevel == "hard") {
               score = maxScores.medium + extraScore;
            } else {
               // unsupported
            }
         }
         scores[sLevel] = score;
         messages[sLevel] = grading.message;
      }
      if (displayedLevel != null) {
         switchLevelTo(displayedLevel);
         taskFor.reloadAnswerObject(answerFor[displayedLevel]);
      }

      if (gradedLevel == null) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
 */


