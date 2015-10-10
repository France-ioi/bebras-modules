'use strict';

/* 
 * Same domain task proxy implementation for Bebras task API - v1.0 - 08/2014
 *
 * This file implements a "TaskProxyManager" object in the global scope so that
 * platforms using this file can just call 
 * "myTask = TaskProxyManager.getTaskProxy(task_id)" to get the task object
 * associated to a task loaded in an iframe. Then they can just call 
 * "myTask.myFunction()", with function of the API, the task object will take
 * care of message sending and receiving with the actual task.
 * 'task_id' here refers to the "id" attribute of the iframe in which a task is
 * loaded.
 *
 * It depends on jQuery.
 *
 * Currently, if you do not use the callback system, you have to make sure
 * iframe is ready before calling functions returning a result. 
 * You can call task.iframe_loaded to know if it is or not.
 * This limitation doesn't apply if you use the callback system.
 *
 */

var TaskProxyManager = {
   tasks: {},
   platforms: {},
   getTaskProxy: function(idFrame, callback, force) {
      if (!force && TaskProxyManager.tasks[idFrame]) {
         callback(TaskProxyManager.tasks[idFrame]);
      } else {
         if (force) {
            TaskProxyManager.deleteTaskProxy(idFrame);
         }
         $('#'+idFrame).each(function() {
            var curTask = new Task($(this));
            TaskProxyManager.tasks[idFrame] = curTask;
         });
         callback(TaskProxyManager.tasks[idFrame]);
      }
   },
   setPlatform: function(task, platform) {
      TaskProxyManager.platforms[task.Id] = platform;
      TaskProxyManager.tasks[task.Id].setPlatform(platform);
   },
   deleteTaskProxy: function(idFrame) {
      delete(TaskProxyManager.tasks[idFrame]);
      delete(TaskProxyManager.platforms[idFrame]);
   },
   getUrl: function(taskUrl, sToken, sPlatform, prefix) {
      return taskUrl+'?sToken='+encodeURIComponent(sToken)+'&sPlatform='+encodeURIComponent(sPlatform);
   }
};

TaskProxyManager.getGraderProxy = TaskProxyManager.getTaskProxy;

var taskCaller = function(task, request, content) {
   // TODO: handle case where iframe_loaded is false and caller expects a result...
   if (!task.iframe_loaded) {
      setTimeout(function() {
         taskCaller(task, request, content);
      }, 250);
   } else {
      if (task.distantTask && typeof task.distantTask[request] === 'function') {
         if (typeof content === 'string' || (typeof content === 'object' && Object.prototype.toString.call(content) !== '[object Array]')) {
            content = [content];
         }
         var functionsToTrigger = {load: true, unload:true, reloadAnswer:true, showViews: true, reloadState: true};
         if (functionsToTrigger[request]) {
            var askedCallback = content[content.length - 1];
            if (typeof askedCallback === 'function') {
               var newCallback = function() {
                  task.distantPlatform.trigger(request, content);
                  askedCallback();
               };
               content[content.length -1] = newCallback;
            }
         }
         var res = task.distantTask[request].apply(task.distantTask, content);
         return res;
      }// else {
      //   console.error("Task "+task.Id+" doesn't implement "+request);
      //}
   }
};

/*
 * Task object, created from an iframe DOM element
 */
function Task(iframe) {
   this.iframe = iframe;
   this.iframe_loaded = false;
   this.distantTask = null;
   this.Id = iframe.attr('id');
   this.elementsLoaded = false;
   this.platform = null;
   this.setPlatform = function(platform) {
      this.platform = platform;
      if (this.iframe_loaded) {
         this.distantPlatform.setPlatform(platform);
      }
   };
   var that = this;
   // checking if task is already available
   if (that.iframe[0].contentWindow.task) {
      that.iframe_loaded = true;
      that.distantTask = that.iframe[0].contentWindow.task;
      that.distantPlatform = that.iframe[0].contentWindow.platform;
      if (that.platform) {
         that.distantPlatform.setPlatform(that.platform);
      }
   } else {
      this.iframe.load(function() {
         that.iframe_loaded = true;
         that.distantTask = that.iframe[0].contentWindow.task;
         that.distantPlatform = that.iframe[0].contentWindow.platform;
         if (that.platform) {
            that.distantPlatform.setPlatform(that.platform);
         }
      });
   }
}

Task.prototype.getSourceId = function() {
   return this.Id;
};

Task.prototype.getTargetUrl = function() {
   return this.iframe.attr('src');
};

Task.prototype.getTarget = function() {
   return this.iframe[0].contentWindow;
};

Task.prototype.getDomain = function() {
   var url = this.getTargetUrl();
   return url.substr(0, url.indexOf('/', 7));
};

/**
 * Task API functions
 */
Task.prototype.load = function(views, success, error) {
    return taskCaller(this, 'load', [views, success, error]);
};
Task.prototype.unload = function(success, error) {
    return taskCaller(this, 'unload', [success, error]);
};
Task.prototype.getHeight = function(success, error) {
    return taskCaller(this, 'getHeight', [success, error]);
};
Task.prototype.updateToken = function(token, success, error) {
    return taskCaller(this, 'updateToken', [token, success, error]);
};
Task.prototype.getAnswer = function(success, error) {
    return taskCaller(this, 'getAnswer', [success, error]);
};
Task.prototype.reloadAnswer = function(answer, success, error) {
    return taskCaller(this, 'reloadAnswer', [answer, success, error]);
};
Task.prototype.getState = function(success, error) {
    return taskCaller(this, 'getState', [success, error]);
};
Task.prototype.reloadState = function(state, success, error) {
    return taskCaller(this, 'reloadState', [state, success, error]);
};
Task.prototype.getViews = function(success, error) {
    return taskCaller(this, 'getViews', [success, error]);
};
Task.prototype.getMetaData = function(success, error) {
    return taskCaller(this, 'getMetaData', [success, error]);
};
Task.prototype.showViews = function(views, success, error) {
    return taskCaller(this, 'showViews', [views, success, error]);
};
Task.prototype.gradeAnswer = function(answer, answerToken, success, error) {
    return taskCaller(this, 'gradeAnswer', [answer, answerToken, success, error]);
};
Task.prototype.getResources = function(success, error) {
    return taskCaller(this, 'gradeResources', [success, error]);
};
// for grader.gradeTask
Task.prototype.gradeTask = function(answer, answerToken, success, error) {
    return taskCaller(this, 'gradeTask', [answer, answerToken, success, error]);
};

/*
 * Platform object definition, created from a Task object (see below)
 */

function Platform(task) {
   this.task = task;
}
Platform.prototype.getTask = function() {
   return this.task;
};

/* 
 * Simple prototypes for platform API functions, to be overriden by your
 * platform's specific functions (for each platform object)
 */

Platform.prototype.validate = function(mode) {};
Platform.prototype.showView = function(views) {};
Platform.prototype.askHint = function(platformToken) {};
Platform.prototype.updateHeight = function(height) {this.task.iframe.height(parseInt(height)+40);};
Platform.prototype.getTaskParams = function(key, defaultValue) {
   var res = {minScore: -3, maxScore: 10, randomSeed: 0, noScore: 0, readOnly: false};
   if (typeof key !== 'undefined') {
      if (key !== 'options' && key in res) {
         return this.taskParams[key];
      } else {
         return (typeof defaultValue !== 'undefined') ? defaultValue : null; 
      }
   }
   return res;
};

Platform.prototype.openUrl = function(url) {
   // TODO
};
