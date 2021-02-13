(function () {

'use strict';

function getUrlParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.href);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function isCrossDomain() {
   function isInIframe() {
      try {
         return window.self !== window.top;
      } catch (e) {
         return false;
      }
   }
   function isSameDomain() {
      var res = false;
      function doNothing(document){}
      try{
          res = !! parent.document;
      } catch(e){
          res = false;
      }
      return res;
   }
   return isInIframe() && !isSameDomain();
}

var platform;

if (!isCrossDomain()) {

   /* Implementation of a platform proxy for the task iframe. This object is always
    * available, but is effective only when setPlatform is called with a true
    * platform object.
    */

   platform = {
      registered_objects: [],
      parent_platform: null,
      initFailed: false,
      setPlatform: function(platformArg) {
         platform.parent_platform = platformArg;
      },
      trigger: function(event, content) {
         for (var i = 0; i < platform.registered_objects.length; i++) {
            var object = platform.registered_objects[i];
            if (typeof (object[event]) != "undefined") {
               object[event].apply(object, content);
            }
         }
      },
      subscribe: function(object) {
         this.registered_objects.push(object);
      },
      unsubscribe: function(object) {
         var index = this.registered_objects.indexOf(object);
         if (index != -1) {
            this.registered_objects.splice(index, 1);
         }
      },
      validate: function(mode, success, error) {
         // TODO: this case is a bit blur...
         var res = platform.parent_platform.validate(mode, success, error);
         this.trigger('validate', [mode]);
         return res;
      },
      showView: function(views, success, error) {
         return platform.parent_platform.showView(views, success, error);
      },
      askHint: function(platformToken, success, error) {
         return platform.parent_platform.askHint(platformToken, success, error);
      },
      updateHeight: function(height, success, error) {
         return platform.parent_platform.updateDisplay({height: height}, success, error);
      },
      updateDisplay: function(data, success, error) {
         return platform.parent_platform.updateDisplay(data, success, error);
      },
      getTaskParams: function(key, defaultValue, success, error) {
         return platform.parent_platform.getTaskParams(key, defaultValue, success, error);
      },
      openUrl: function(url, success, error) {
         return platform.parent_platform.openUrl(url, success, error);
      },
      log: function(data, success, error) {
         return platform.parent_platform.log(data, success, error);
      },
      initCallback: function(callback) {
         this.initCallbackFun = callback;
         if (platform.initDone) {
            callback();
         }
      },
      initWithTask: function(task) {
         platform.task = task;
         window.task = task;
         platform.initDone = true;
         if (platform.initCallbackFun) {
            platform.initCallbackFun();
         }
      }
   };

} else {

   // cross-domain version, depends on jschannel
   platform = {};
   var callAndTrigger = function(fun, triggerName, error, args) {
      return function() {
         try {
            platform.trigger(triggerName, args);
            fun(arguments);
         } catch(e) {
            error(e.toString()+'\n'+e.stack);
         }
      };
   };
   platform.ready = false;
   platform.initFailed = false;
   platform.initWithTask = function(task) {
      if (typeof Channel === 'undefined') {
         platform.initFailed = true;
         console.error('cannot init task if jschannel is not present');
         return;
      }

      var previousHeights = [];
      var getHeightFiltered = function(success, error) {
         // If the new height has already been returned just before the current
         // height, we're in a loop between two heights, possibly because of a
         // scrollbar.
         // In that case we want to keep the largest of the two heights.
         if(!task.getHeight) { error('task.getHeight not defined yet'); }
         task.getHeight(function(h) {
            if((previousHeights.length == 2) &&
               (previousHeights[0] == h) &&
               (previousHeights[1] >= h)) {
                  success(previousHeights[1]);
                  return;
            }
            previousHeights.push(h);
            previousHeights = previousHeights.slice(-2);
            success(h);
         }, error);
      }

      var gradeAnswer = function(params, success, error) {
         var newSuccess = function(score, message, scoreToken) {
            success([score, message, scoreToken]);
         };
         if (typeof task.gradeAnswer === 'function') {
            task.gradeAnswer(params[0], params[1], newSuccess, error);
         } else {
            window.grader.gradeTask(params[0], params[1], newSuccess, error);
         }
      };
      var channelId = getUrlParameterByName('channelId');
      var chan = Channel.build({window: window.parent, origin: "*", scope: channelId, onReady: function() {platform.ready = true;}});
      platform.chan = chan;
      platform.task = task;
      platform.channelId = channelId;
      chan.bind('task.load', function(trans, views) {task.load(views, callAndTrigger(trans.complete, 'load', trans.error, [views]), trans.error);trans.delayReturn(true);});
      chan.bind('task.unload', function(trans) {task.unload(callAndTrigger(trans.complete, 'unload', trans.error, null), trans.error);trans.delayReturn(true);});
      chan.bind('task.getHeight', function(trans) {getHeightFiltered(trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.getMetaData', function(trans) {task.getMetaData(trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.getViews', function(trans) {task.getViews(trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.showViews', function(trans, views) {task.showViews(views, callAndTrigger(trans.complete, 'showViews', trans.error, [views]), trans.error);trans.delayReturn(true);});
      chan.bind('task.updateToken', function(trans, token) {task.updateToken(token, trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.reloadAnswer', function(trans, answer) {task.reloadAnswer(answer, callAndTrigger(trans.complete, 'reloadAnswer', trans.error, [answer]), trans.error);trans.delayReturn(true);});
      chan.bind('task.getAnswer', function(trans) {task.getAnswer(trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.getState', function(trans) {task.getState(trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.getResources', function(trans) {task.getResources(trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.reloadState', function(trans, state) {task.reloadState(state, callAndTrigger(trans.complete, 'reloadState', trans.error, [state]), trans.error);trans.delayReturn(true);});
      chan.bind('grader.gradeTask', function(trans, params) {gradeAnswer(params, trans.complete, trans.error);trans.delayReturn(true);});
      chan.bind('task.gradeAnswer', function(trans, params) {gradeAnswer(params, trans.complete, trans.error);trans.delayReturn(true);});
   };

   platform.registered_objects = [];
   platform.trigger = function(event, content) {
      for (var i = 0; i < platform.registered_objects.length; i++) {
         var object = platform.registered_objects[i];
         if (typeof object[event] !== "undefined") {
            object[event].apply(object, content);
         }
      }
   };
   platform.subscribe = function(object) {
      platform.registered_objects.push(object);
   };
   platform.unsubscribe = function(object) {
      var index = platform.registered_objects.indexOf(object);
      if (index != -1) {
         platform.registered_objects.splice(index, 1);
      }
   };
   platform.stop = function() {
      platform.chan.destroy(); 
   };
   platform.validate = function (sMode, success, error) {
      if (!success) success = function(){}; // not mandatory, as most code doesn't use it
      if (!error) error = function() {console.error(arguments);};
      platform.chan.call({method: "platform.validate",
         params: sMode,
         error: error,
         success: callAndTrigger(success, 'validate', error, [sMode])
      });
   };
   platform.getTaskParams = function(key, defaultValue, success, error) {
      if (!success) success = function(){};
      if (!error) error = function() {console.error(arguments);};
      platform.chan.call({method: "platform.getTaskParams",
         params: [key, defaultValue],
         error: error,
         success: success
      });
   };
   platform.showView = function(views, success, error) {
      if (!success) success = function(){};
      if (!error) error = function() {console.error(arguments);};
      platform.chan.call({method: "platform.showView",
         params: views,
         error: error,
         success: success
      });
   };
   platform.askHint = function(platformToken, success, error) {
      if (!success) success = function(){};
      if (!error) error = function() {console.error(arguments);};
      platform.chan.call({method: "platform.askHint",
         params: platformToken,
         error: error,
         success: success
      });
   };
   platform.updateHeight = function(height, success, error) {
      // Legacy
      platform.updateDisplay({height: height}, success, error);
   };
   platform.updateDisplay = function(data, success, error) {
      if (!success) success = function(){};
      if (!error) error = function() {console.error(arguments);};
      platform.chan.call({method: "platform.updateDisplay",
         params: data,
         error: error,
         success: success
      });
   };
   platform.openUrl = function(url, success, error) {
      if (!success) success = function(){};
      if (!error) error = function() {console.error(arguments);};
      platform.chan.call({method: "platform.openUrl",
         params: url,
         error: error,
         success: success
      });
   };
   platform.log = function(data, success, error) {
      if (!success) success = function(){};
      if (!error) error = function() {console.error(arguments);};
      platform.chan.call({method: "platform.log",
         params: data,
         error: error,
         success: success
      });
   };
}

window.platform = platform;

}());
