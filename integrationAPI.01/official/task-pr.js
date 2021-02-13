(function () {

'use strict';

/* 
 * Same domain task proxy implementation for Bebras task API - v1.0 - 08/2014
 *
 * Depends on jQuery.
 *
 */

var functionsToTrigger = {load: true, unload:true, reloadAnswer:true, showViews: true, reloadState: true};

function taskCaller(task, request, content, error) {
   if (!error) {
      error = function() {};
   }
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
         var askedCallbackIdx = (typeof content[content.length - 2] === 'function') ? content.length - 2 : content.length - 1;
         if (typeof content[askedCallbackIdx] !== 'function') {
            error('calls to task must contain a callback');
            return;
         }
         var oldCallback = content[askedCallbackIdx];
         var timeout = window.setTimeout(function() {
            error('timeout reached for '+request);
         }, 15000);
         var newCallback = function() {
            window.clearTimeout(timeout);
            if (functionsToTrigger[request]) {
               task.distantPlatform.trigger(request, content);
            }
            oldCallback(arguments[0], arguments[1], arguments[3]);
         };
         content[askedCallbackIdx] = newCallback;
         if (typeof window.taskPrNoCatch !== 'undefined') {
            task.distantTask[request].apply(task.distantTask, content);
         } else {
            try {
               task.distantTask[request].apply(task.distantTask, content);
            } catch (e) {
               window.clearTimeout(timeout);
               error(e);
            }
         }
      } else if (task.distantTask) {
         error("Task "+task.Id+" doesn't implement "+request);
      } else {
         error('call to '+request+' on task with no distant task');
      }
   }
}

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
   };
   // checking if platform is already available
   var iframeDoc = that.iframe[0].contentDocument || that.iframe[0].contentWindow.document;
   if (iframeDoc && iframeDoc.readyState  == 'complete' && that.iframe[0].contentWindow.platform && !that.iframe[0].contentWindow.platform.parentLoadedFlag) {
      that.iframe[0].contentWindow.platform.initCallback(that.iframeLoaded);
   } else {
      if(document.addEventListener) { // ie > 8
         $(that.iframe).on("load", function() {
            that.iframe[0].contentWindow.platform.initCallback(that.iframeLoaded);
         });
      } else {
         setTimeout(function() {
            that.iframeLoaded();
         }, 100);
      }
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
    return taskCaller(this, 'load', [views, success, error], error);
};
Task.prototype.unload = function(success, error) {
    return taskCaller(this, 'unload', [success, error], error);
};
Task.prototype.getHeight = function(success, error) {
    return taskCaller(this, 'getHeight', [success, error], error);
};
Task.prototype.updateToken = function(token, success, error) {
    return taskCaller(this, 'updateToken', [token, success, error], error);
};
Task.prototype.getAnswer = function(success, error) {
    return taskCaller(this, 'getAnswer', [success, error], error);
};
Task.prototype.reloadAnswer = function(answer, success, error) {
    return taskCaller(this, 'reloadAnswer', [answer, success, error], error);
};
Task.prototype.getState = function(success, error) {
    return taskCaller(this, 'getState', [success, error], error);
};
Task.prototype.reloadState = function(state, success, error) {
    return taskCaller(this, 'reloadState', [state, success, error], error);
};
Task.prototype.getViews = function(success, error) {
    return taskCaller(this, 'getViews', [success, error], error);
};
Task.prototype.getMetaData = function(success, error) {
    return taskCaller(this, 'getMetaData', [success, error], error);
};
Task.prototype.showViews = function(views, success, error) {
    return taskCaller(this, 'showViews', [views, success, error], error);
};
// TODO: put error back in argument list, for this 2015 tasks must be changed
Task.prototype.gradeAnswer = function(answer, answerToken, success, error) {
    return taskCaller(this, 'gradeAnswer', [answer, answerToken, success], error);
};
Task.prototype.getResources = function(success, error) {
    return taskCaller(this, 'getResources', [success, error], error);
};
// for grader.gradeTask
// TODO: put error back in argument list, for this 2015 tasks must be changed
Task.prototype.gradeTask = function(answer, answerToken, success, error) {
    return taskCaller(this, 'gradeTask', [answer, answerToken, success], error);
};

window.TaskProxyManager = {
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

window.TaskProxyManager.getGraderProxy = TaskProxyManager.getTaskProxy;

}());

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
Platform.prototype.updateHeight = function(height) { this.updateDisplay({height: height}); }; // Legacy
Platform.prototype.updateDisplay = function(data) {
   if(data.height) {
      this.task.iframe.height(parseInt(height)+40);
   }
};
Platform.prototype.log = function(data) {};
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
