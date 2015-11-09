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
      callback(JSON.stringify(res));
   });
};

task.getMetaData = function(callback) {
   if (typeof json !== 'undefined') {
      callback(json);
   } else {
      callback({nbHints:0});
   }
};

task.reloadAnswer = function(strAnswer, callback) {
   if (!strAnswer) {
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
};

task.getAnswer = function(callback) {
   var answerObj = task.getAnswerObject();
   callback(JSON.stringify(answerObj));
};

var grader = grader ? grader : {
   acceptedAnswers : null,
   getAcceptedAnswers: function(callback) {
      if (grader.acceptedAnswers) {
         callback(grader.acceptedAnswers);
         return;
      }
      if (typeof json !== 'undefined' && json.acceptedAnswers) {
         callback(json.acceptedAnswers);
         return;
      }
      if (typeof getTaskResources === 'function') {
         getTaskResources(function(json) {
            if (json && json.acceptedAnswers) {
               callback(json.acceptedAnswers);
            } else {
               callback(null);
            }
         });
      } else {
         callback(null);
      }
   },
   gradeTask: function (answer, answerToken, success, error) {
      grader.getAcceptedAnswers(function(acceptedAnswers) {
         platform.getTaskParams(null, null, function (taskParams) {
            var score = taskParams.noScore;
            if (acceptedAnswers && acceptedAnswers[0]) {
               if ($.inArray("" + answer, acceptedAnswers) > -1) {
                  score = taskParams.maxScore;
               } else {
                  score = taskParams.minScore;
               }
            }
            success(score, "");
         });
      });
   }
};

task.gradeAnswer = function(answer, answerToken, success, error) {
   grader.gradeTask(answer, answerToken, success, error);
};

var DelayedExec = {
   timeouts: {},
   intervals: {},
   animations: {},
   setTimeout: function(name, callback, delay) {
      DelayedExec.clearTimeout(name);
      DelayedExec.timeouts[name] = setTimeout(function() {
         delete DelayedExec.timeouts[name];
         callback();
      }, delay);
   },
   clearTimeout: function(name) {
      if (DelayedExec.timeouts[name]) {
         clearTimeout(DelayedExec.timeouts[name]);
         delete DelayedExec.timeouts[name];
      }
   },
   setInterval: function(name, callback, period) {
      DelayedExec.clearInterval(name);
      DelayedExec.intervals[name] = setInterval(callback, period);
   },
   clearInterval: function(name) {
      if (DelayedExec.intervals[name]) {
         clearInterval(DelayedExec.intervals[name]);
         delete DelayedExec[name];
      }
   },
   animateRaphael: function(name, object, params, time) {
      DelayedExec.animations[name] = object;
      object.animate(params, time, function() {
         delete DelayedExec.animations[name];
      });
   },
   stopAnimateRaphael: function(name) {
      if (DelayedExec.animations[name]) {
         DelayedExec.animations[name].stop();
         delete DelayedExec.animations[name];
      }
   },
   stopAll: function() {
      for(var name in DelayedExec.timeouts) {
         clearTimeout(DelayedExec.timeouts[name]);
         delete DelayedExec.timeouts[name];
      }
      for(name in DelayedExec.intervals) {
         clearInterval(DelayedExec.intervals[name]);
         delete DelayedExec.intervals[name];
      }
      for(name in DelayedExec.animations) {
         DelayedExec.animations[name].stop();
         delete DelayedExec.animations[name];
      }
   }
};

$('document').ready(function() {
   platform.initWithTask(window.task);
});
