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
 * It depends on jQuery and jschannel.
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
            TaskProxyManager.tasks[idFrame] = new Task($(this), function() {setTimeout(function() {
               if (idFrame in TaskProxyManager.platforms) {
                  TaskProxyManager.tasks[idFrame].setPlatform(TaskProxyManager.platforms[idFrame]);
               }
               callback(TaskProxyManager.tasks[idFrame]);
            });});
         });
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
      }, 100);
   } else {
      if (task.distantTask && typeof task.distantTask[request] === 'function') {
         if (typeof content === 'string' || (typeof content === 'object' && Object.prototype.toString.call(content) !== '[object Array]')) {
            content = [content];
         }
         var functionsToTrigger = {load: true, unload:true, reloadAnswer:true, showViews: true, reloadState: true};
         if (functionsToTrigger[request]) {
            var askedCallbackIdx = (typeof content[content.length - 2] === 'function') ? content.length - 2 : content.length - 1;
            if (typeof content[askedCallbackIdx] === 'function') {
               var oldCallback = content[askedCallbackIdx];
               var newCallback = function() {
                  task.distantPlatform.trigger(request, content);
                  oldCallback();
               };
               content[askedCallbackIdx] = newCallback;
            }
         }
         var res = task.distantTask[request].apply(task.distantTask, content);
         return res;
      } else if (task.distantTask) {
         console.error("Task "+task.Id+" doesn't implement "+request);
      }
   }
};

/*
 * Task object, created from an iframe DOM element
 */
function Task(iframe, callback) {
   this.iframe = iframe;
   this.iframe_loaded = false;
   this.distantTask = null;
   this.Id = iframe.attr('id');
   this.elementsLoaded = false;
   this.platform = null;
   var that = this;
   this.setPlatform = function(platform) {
      this.platform = platform;
      if (this.iframe_loaded) {
         this.distantPlatform.setPlatform(platform);
      }
   };
   this.iframeLoaded = function() {
      if (that.iframe_loaded) {
         return;
      }
      that.iframe_loaded = true;
      that.distantTask = that.iframe[0].contentWindow.task;
      that.distantPlatform = that.iframe[0].contentWindow.platform;
      that.iframe[0].contentWindow.platform.parentLoadedFlag = true;
      if (that.platform) {
         that.distantPlatform.setPlatform(that.platform);
      }
      callback();    
   }
   // checking if platform is already available
   var iframeDoc = that.iframe[0].contentDocument || that.iframe[0].contentWindow.document;
   if (iframeDoc && iframeDoc.readyState  == 'complete' && that.iframe[0].contentWindow.platform && !that.iframe[0].contentWindow.platform.parentLoadedFlag) {
      that.iframe[0].contentWindow.platform.initCallback(that.iframeLoaded);
   } else {
      $(that.iframe).on("load", function() {
         that.iframe[0].contentWindow.platform.initCallback(that.iframeLoaded);        
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
    return taskCaller(this, 'getResources', [success, error]);
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
Platform.prototype.getTaskParams = function(key, defaultValue, success, error) {
   var res = {minScore: -3, maxScore: 10, randomSeed: 0, noScore: 0, readOnly: false, options: {}};
   if (key) {
      if (key !== 'options' && key in res) {
         res = res[key];
      } else if (res.options && key in res.options) {
         res = res.options[key];
      } else {
         res = (typeof defaultValue !== 'undefined') ? defaultValue : null;
      }
   }
   success(res);
};

Platform.prototype.openUrl = function(url) {
   // TODO
};
