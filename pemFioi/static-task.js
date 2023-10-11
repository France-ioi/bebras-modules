/*
 * This file is to be included by beaver contest tasks, it defines a basic
 * implementation of the main functions of the task object, as well as a grader.
 *
 * Task can overwrite these definitions.
 *
 * Behavior can be configured through window.staticTaskOptions, an object which
 * can contain :
 * - autoValidate: validate after X ms, default is 5000 ms if autoValidate is
 * true but not a number
 * - addReturnButton: add a return button at the bottom of the page, set to a
 * string to customize the button text
 */


var task = {};

task.showViews = function (views, success, error) {
   success();
};

task.getViews = function (success, error) {
   // all beaver tasks have the same views
   var views = {
      task: {},
      solution: { requires: "task" },
      hint: { requires: "task" },
      forum: { requires: "task" },
      editor: { requires: "task" }
   };
   success(views);
};

task.updateToken = function (token, success, error) {
   //console.warning("sorry, token system not available for this task");
   success();
};

task.getHeight = function (success, error) {
   // Note : if the html/body is taking all available height, making an
   // infinite loop with the platform of height increase, try changing your
   // doctype to <!doctype html>
   var d = document;
   var h = Math.max(d.body.offsetHeight, d.documentElement.offsetHeight) + 2;
   success(h);

   // Disable scroll if we are in a properly-sized iframe
   if(window.top !== window.self && (h - window.innerHeight) < 10) {
      document.body.style.overflowX = 'hidden';
   } else {
      document.body.style.overflowX = '';
   }
};

task.unload = function (success, error) {
   success();
};

task.getState = function (success, error) {
   success('');
};

task.getMetaData = function (success, error) {
   if (typeof json !== 'undefined') {
      if (json) {
         json.disablePlatformProgress = true;
         json.usesTokens = false;
      }
      success(json);
   } else {
      success({ nbHints: 0 });
   }
};

window.staticTaskReloadedAnswer = '';

task.reloadAnswer = function (strAnswer, success, error) {
   window.staticTaskReloadedAnswer = strAnswer;
   success();
};

task.reloadState = function (state, success, error) {
   success();
};

window.staticTaskAnswer = '';

task.getAnswer = function (success, error) {
   success(window.staticTaskAnswer);
};

task.reloadAnswerObject = function (answerObj) { }
task.getAnswerObject = function () { }
task.getDefaultAnswerObject = function () { }


task.load = function (views, success, error) {
   success();
};

task.gradeAnswer = function (answer, answerToken, success, error) {
   if (!window.staticTaskOptions || !window.staticTaskOptions.autoValidate) {
      success(0, '');
      return;
   }

   // Auto-validate
   addTaskParamsCb(function (taskParams) {
      success(taskParams.maxScore || 40, '');
   });
}

task.getResources = function(success, error) {
   // Shouldn't be called unless installation.js is loaded
   error();
}

var grader = {
   gradeTask: task.gradeAnswer
};

function staticTaskPreprocess() {
   document.body.classList.add('static-task');
   if(!document.getElementById('task')) {
      document.body.id = 'task';
   }
};

if (!window.preprocessingFunctions) {
   window.preprocessingFunctions = [];
}
window.preprocessingFunctions.push(staticTaskPreprocess);

window.taskGetResourcesPost = function (res, callback) {
   res.task[0].content = document.body.innerHTML;
   callback(res);
}

window.platformOpenUrl = function (target) {
   if (!window.platform) { return; }
   window.platform.openUrl(target, function () { });
}

window.platformScrollTo = function (target) {
   if (!window.platform) { return; }
   var offset = 0;
   if (typeof target == 'number') {
      offset = target;
   } else {
      if (!target.offset) {
         target = document.querySelector(target);
      }
      var rect = target.getBoundingClientRect();
      offset = rect.top + window.pageYOffset - 60; // Scroll a bit above so the target is visible
   }
   window.platform.updateDisplay({ scrollTop: offset });
}

var taskParamsCbs = [];
function addTaskParamsCb(cb) {
   if(task.taskParams !== null) {
      cb(task.taskParams);
   } else {
      taskParamsCbs.push(cb);
   }
}

document.addEventListener('DOMContentLoaded', function() {
   if (window.platform) {
      platform.initWithTask(task);
   }

   staticTaskPreprocess();

   // Copy of displayHelper.useFullWidth
   try {
      var questionIframe = window.parent.document.getElementById('question-iframe');
      if (questionIframe) {
         questionIframe.style.width = '100%';
      }
   } catch (e) {
   }
   document.body.style.width = '';

   // Handle staticTaskOptions
   var sto = window.staticTaskOptions || {};

   // Get taskParams
   if (sto.autoValidate || sto.checkHideTitle) {
      function execTaskParamsCbs (taskParams) {
         for (var i = 0; i < taskParamsCbs.length; i++) {
            taskParamsCbs[i](taskParams);
         }
      }
      task.taskParams = null;
      try {
         platform.getTaskParams(null, null, function (taskParams) {
            task.taskParams = taskParams;
            execTaskParamsCbs(task.taskParams);
         }, function () {
            task.taskParams = {};
            execTaskParamsCbs(task.taskParams);
         });
      } catch (e) {
         task.taskParams = {};
         execTaskParamsCbs(task.taskParams);
      }
   }

   if (sto.autoValidate) {
      // Auto-validate with a score after 5s
      setTimeout(function () {
         if (window.staticTaskReloadedAnswer == 'page_read') { return; } // already validated
         window.staticTaskAnswer = "page_read";
         try {
            platform.validate("done");
         } catch (e) { }
      }, typeof sto.autoValidate == 'number' ? sto.autoValidate : 5000);
   }
   if (sto.addReturnButton && !document.querySelector('div.return-button')) {
      // Add a return button
      var btnHtml = '<button onclick="platform.validate(\'top\');">';
      btnHtml += typeof sto.addReturnButton == 'string' ? sto.addReturnButton : 'Revenir à la liste des questions';
      btnHtml += '</button>';
      var div = document.createElement('div');
      div.innerHTML = btnHtml;
      div.classList.add('return-button');
      document.body.appendChild(div);
   }
   if(sto.checkHideTitle) {
      addTaskParamsCb(function (taskParams) {
         if (taskParams.hideTitle) {
            document.querySelector('h1').style.display = 'none';
         }
      });
   }
});


window.addEventListener('load', function() {
   // Lazy load images
   setTimeout(function () {
      var lazyElements = document.querySelectorAll('[lazysrc]');
      for(var i = 0; i < lazyElements.length; i++) {
         const lazyElement = lazyElements[i];
         lazyElement.src = lazyElement.getAttribute('lazysrc');
         lazyElement.removeAttribute('lazysrc');
      }
   }, 10);
});

