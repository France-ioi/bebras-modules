/* 
 * This file is to be included by old beaver contest tasks, it overloads
 * previous functions with new correct API functions, and uses displayHelper in
 * a proper way.
 *
 * Tasks should be rewritten with this code, but in the meantime, old tasks
 * can use this.
 */

var taskLoaded = false;
task.loadTask = task.load;
task.load = function(randomSeed, views, callback) {
   mode = 'task';
   if (views.solution) {
      mode = 'solution';
   }
   if (!taskLoaded) {
      task.loadTask(randomSeed, mode);
      taskLoaded = true;
   }
   callback();
}

task.showViewsTask = task.showViews;
task.showViews = function(views, callback) {
   if (typeof task.showViewsTask == 'function') {
      task.showViewsTask(views);
   }
   if (views['forum'] || views['hint'] || views['editor']) {
      console.error("this task does not have forum, hint nor editor specific view, showing task view instead.");
      views['task'] = true;
   }
   $.each(['task', 'solution'], function(i, view) {
      if (view in views) $('#'+view).show(); else $('#'+view).hide();
   });
   callback();
}

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
}

task.updateToken = function(token) {
   console.warning("sorry, token system not available on Beaver platform");
};

task.getHeight = function(callback) {
   callback(parseInt($("html").height()));
};

task.unload = function(callback) {
   callback();
};

task.getAnswerWrapper = task.getAnswer;
task.getAnswer = function(callback) {
   var answer = task.getAnswerWrapper();
   callback(answer);
}

task.reloadAnswerWrapped = task.reloadAnswer;
task.reloadAnswer = function(strAnswer, callback) {
   task.reloadAnswerWrapped(strAnswer);
   callback();
}
