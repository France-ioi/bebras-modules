'use strict';

/* 
 * This file is to be included by beaver contest tasks, it defines a basic
 * implementation of the main functions of the task object, as well as a grader.
 *
 * Task can overwrite these definitions.
 *
 */

var task = {};

task.showViews = function(views, callback) {
   if (views.forum || views.hint || views.editor) {
      //console.error("this task does not have forum, hint nor editor specific view, showing task view instead.");
      views.task = true;
   }
   $.each(['task', 'solution'], function(i, view) {
      if (view in views) $('#'+view).show(); else $('#'+view).hide();
   });
   if (typeof task.hackShowViews === 'function') {task.hackShowViews(views);}
   MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
   callback();
};

task.getViews = function(callback) {
    // all beaver tasks have the same views
    var views = {
        task: {},
        solution: {},
        "hint" : {requires: "task"},
        "forum" : {requires: "task"},
        "editor" : {requires: "task"}
    };
    callback(views);
};

task.updateToken = function(token, callback) {
   //console.warning("sorry, token system not available for this task");
   callback();
};

task.getHeight = function(callback) {
   callback(parseInt($("body").outerHeight(true)));
};

task.unload = function(callback) {
   if (typeof Tracker !== 'undefined') {
      Tracker.endTrackInputs();
   }
   callback();
};

task.getState = function(callback) {
   var res = {};
   task.getAnswer(function(displayedAnswer) {
      res.displayedAnswer = displayedAnswer;
   });
   callback(JSON.stringify(res));
};

task.getMetaData = function(callback) {
      if (typeof json !== 'undefined') {
      callback(json);
   } else {
      callback({nbHints:0});
   }
}

task.reloadAnswer = function(strAnswer, callback) {
   if (strAnswer == "") {
      task.reloadAnswerObject(task.getDefaultAnswerObject());
   } else {
      task.reloadAnswerObject(JSON.parse(strAnswer));
   }
   callback();
};

task.reloadState = function(state, callback) {
   var stateObject = JSON.parse(state);
   if (typeof stateObject.displayedAnswer !== 'undefined') {
      task.reloadAnswer(stateObject.displayedAnswer, callback);
   } else {
      callback();
   }
}

task.getAnswer = function(callback) {
   var answerObj = task.getAnswerObject();
   callback(JSON.stringify(answerObj));
};

var grader = grader ? grader : {
   acceptedAnswers : null,
   getAcceptedAnswers: function() {
      if (grader.acceptedAnswers) {
         return grader.acceptedAnswers;
      }
      if (json && json.acceptedAnswers) {
         return json.acceptedAnswers;
      }
      if (typeof getTaskResources === 'function') {
         var json = getTaskResources();
         if (json && json.acceptedAnswers) {
            return json.acceptedAnswers;
         }
      }
   },
   gradeTask: function (answer, answerToken, callback) {
      var acceptedAnswers = grader.getAcceptedAnswers();
      var taskParams = platform.getTaskParams();
      var score = taskParams.noScore;
      if (acceptedAnswers && acceptedAnswers[0]) {
         if ($.inArray("" + answer, acceptedAnswers) > -1) {
            score = taskParams.maxScore;
         } else {
            score = taskParams.minScore;
         }
      }
      callback(score, "");
   }
};
