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
   getTaskProxy: function(idFrame, force) {
      if (!force && TaskProxyManager.tasks[idFrame]) {
         return TaskProxyManager.tasks[idFrame];
      } else {
         $('#'+idFrame).each(function() {
            var curTask = new Task($(this));
            TaskProxyManager.tasks[idFrame] = curTask;
         });
         return TaskProxyManager.tasks[idFrame];
      }
   },
   setPlatform: function(task, platform) {
      TaskProxyManager.platforms[task.Id] = platform;
      TaskProxyManager.tasks[task.Id].setPlatform(platform);
   }
}

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
         var functionsToTrigger = {load: true, unload:true, reloadAnswer:true, showViews: true};
         if (functionsToTrigger[request] != undefined) {
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
}

/*
 * Task object, created from an iframe DOM element
 */
function Task(iframe) {
   this.iframe = iframe;
   this.iframe_loaded = false;
   this.distantTask = null;
   this.Id = iframe.attr('id')
   this.elementsLoaded = false;
   this.platform = null;
   this.setPlatform = function(platform) {
      this.platform = platform;
      if (this.iframe_loaded) {
         this.distantPlatform.setPlatform(platform);
      }
   }
   var that = this;
   // checking if task is already available
   if (that.iframe[0].contentWindow.task) {
      that.iframe_loaded = true;
      that.distantTask = that.iframe[0].contentWindow.task;
      that.distantPlatform = that.iframe[0].contentWindow.platform;
      if (that.platform != null) {
         that.distantPlatform.setPlatform(that.platform);
      }
   } else {
      this.iframe.load(function() {
         that.iframe_loaded = true;
         that.distantTask = that.iframe[0].contentWindow.task;
         that.distantPlatform = that.iframe[0].contentWindow.platform;
         if (that.platform != null) {
            that.distantPlatform.setPlatform(that.platform);
         }
      });
   }
}

Task.prototype.getSourceId = function() {
   return this.Id;
}

Task.prototype.getTargetUrl = function() {
   return this.iframe.attr('src');
}

Task.prototype.getTarget = function() {
   return this.iframe[0].contentWindow;
}

Task.prototype.getDomain = function() {
   var url = this.getTargetUrl();
   return url.substr(0, url.indexOf('/', 7));
}

/**
 * Task API functions
 */
Task.prototype.load = function(views, callback) {
    return taskCaller(this, 'load', [views, callback]);
};
Task.prototype.unload = function(callback) {
    return taskCaller(this, 'unload', [callback]);
};
Task.prototype.getHeight = function(callback) {
    return taskCaller(this, 'getHeight', [callback]);
};
Task.prototype.updateToken = function(token) {
    return taskCaller(this, 'updateToken', [token]);
};
Task.prototype.getAnswer = function(callback) {
    return taskCaller(this, 'getAnswer', [callback]);
};
Task.prototype.getAnswerHtml = function(callback) {
    return taskCaller(this, 'getAnswerHtml', [callback]);
};
Task.prototype.reloadAnswer = function(answer, callback) {
    return taskCaller(this, 'reloadAnswer', [answer, callback]);
};
Task.prototype.getHintHtml = function(numHint, callback) {
    return taskCaller(this, 'getHintHtml', [numHint, callback]);
};
Task.prototype.displayMessage = function(type, html, isOptional) {
    return taskCaller(this, 'displayMessage', [type, html, isOptional]);
};
Task.prototype.getViews = function(callback) {
    return taskCaller(this, 'getViews', [callback]);
};
Task.prototype.showViews = function(views, callback) {
    return taskCaller(this, 'showViews', [views, callback]);
};
Task.prototype.gradeTask = function(randomSeed, answer, minScore, maxScore) {
    return taskCaller(this, 'randomSeed', [randomSeed, answer, minScore, maxScore]);
};

/*
 * Platform object definition, created from a Task object (see below)
 */

function Platform(task) {
   this.task = task;
};
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
Platform.prototype.updateHeight = function(height) {};
Platform.prototype.getTaskParams = function(key, defaultValue) {
   var res = {minScore: -3, maxScore: 6, randomSeed: 0, noScore: 0};
   if (typeof key !== 'undefined') {
      if (key !== 'options' && key in res) {
         return this.taskParams[key];
      } else {
         return (typeof defaultValue !== 'undefined') ? defaultValue : null; 
      }
   }
   return res;
}

Platform.prototype.openUrl = function(url) {
   document.location.href = url.replace(this.task.getDomain(), document.location.origin);
};
