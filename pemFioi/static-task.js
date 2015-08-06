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
   callback();
};

task.getViews = function(callback) {
    // all beaver tasks have the same views
    var views = {
        task: {},
        solution: {requires: "task"},
        hint : {requires: "task"},
        forum : {requires: "task"},
        editor : {requires: "task"}
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
   callback();
};

task.getState = function(callback) {
   callback('');
};

task.getMetaData = function(callback) {
   if (typeof json !== 'undefined') {
      callback(json);
   } else {
      callback({});
   }
}

task.reloadAnswer = function(strAnswer, callback) {
   callback();
};

task.reloadState = function(state, callback) {
   callback();
}

task.getAnswer = function(callback) {
   callback('');
};

task.load = function(views, callback) {
   callback();
}

var grader = {
   gradeTask: function (answer, answerToken, callback) {
      callback(0, "");
   }
};
