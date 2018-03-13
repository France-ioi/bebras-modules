/*
 * This file is to be included by beaver contest tasks, it defines a basic
 * implementation of the main functions of the task object, as well as a grader.
 *
 * Task can overwrite these definitions.
 *
 */

var task = {};

task.showViews = function(views, success, error) {
   console.error('showViews');
   success();
};

task.getViews = function(success, error) {
    // all beaver tasks have the same views
    var views = {
        task: {},
        solution: {requires: "task"},
        hint : {requires: "task"},
        forum : {requires: "task"},
        editor : {requires: "task"}
    };
    success(views);
};

task.updateToken = function(token, success, error) {
   //console.warning("sorry, token system not available for this task");
   success();
};

task.getHeight = function(success, error) {
    var d = document;
    var h = Math.max(d.body.offsetHeight, d.documentElement.offsetHeight);
    success(h);
    //success(parseInt($("body").outerHeight(true)));
};

task.unload = function(success, error) {
   success();
};

task.getState = function(success, error) {
   success('');
};

task.getMetaData = function(success, error) {
   console.error('getMetadata');
   if (typeof json !== 'undefined') {
      success(json);
   } else {
      success({nbHints:0});
   }
};

task.reloadAnswer = function(strAnswer, success, error) {
   success();
};

task.reloadState = function(state, success, error) {
   success();
};

task.getAnswer = function(success, error) {
   success('');
};

task.reloadAnswerObject = function(answerObj) {}
task.getAnswerObject = function() {}
task.getDefaultAnswerObject = function() {}


task.load = function(views, success, error) {
  console.error('load');
   success();
};

task.gradeAnswer = function(answer, answerToken, success, error) {success(0, '');}

var grader = {
   gradeTask: task.gradeAnswer
};

if (platform) {
  platform.initWithTask(task);
}
