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
   var h = Math.max(d.body.offsetHeight, d.documentElement.offsetHeight);
   success(h);
   //success(parseInt($("body").outerHeight(true)));
};

task.unload = function (success, error) {
   success();
};

task.getState = function (success, error) {
   success('');
};

task.getMetaData = function (success, error) {
   if (typeof json !== 'undefined') {
      success(json);
   } else {
      success({ nbHints: 0 });
   }
};

task.reloadAnswer = function (strAnswer, success, error) {
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
   try {
      platform.getTaskParams(null, null, function (taskParams) {
         try {
            success(taskParams.maxScore ? taskParams.maxScore : 40, "");
         } catch (e) {
            success(40, "");
         }
      }, function () { });
   } catch (e) {
      success(40, "");
   }
}

var grader = {
   gradeTask: task.gradeAnswer
};

function staticTaskPreprocess() {
   $('body').addClass('static-task');
   if ($('#task').length == 0) {
      $('body').attr('id', 'task');
   }
};

if (!window.preprocessingFunctions) {
   window.preprocessingFunctions = [];
}
window.preprocessingFunctions.push(staticTaskPreprocess);

window.taskGetResourcesPost = function (res, callback) {
   res.task[0].content = $('body').html();
   callback(res);
}

window.platformScrollTo = function (target) {
   var offset = 0;
   if (typeof target == 'number') {
      offset = target;
   } else {
      if (!target.offset) {
         target = $(target);
      }
      var offset = target.offset().top;
   }
   platform.updateDisplay({ scrollTop: offset });
}

if (window.$) {
   $(function () {
      if (window.platform) {
         platform.initWithTask(task);
      }

      staticTaskPreprocess();

      // Copy of displayHelper.useFullWidth
      try {
         $('#question-iframe', window.parent.document).css('width', '100%');
      } catch (e) {
      }
      $('body').css('width', '');

      var sto = window.staticTaskOptions || {};
      if (sto.autoValidate) {
         setTimeout(function () {
            window.staticTaskAnswer = "page_read";
            try {
               platform.validate("done");
            } catch (e) { }
         }, typeof sto.autoValidate == 'number' ? sto.autoValidate : 5000);
      }
      if (sto.addReturnButton && !$('div.return-button').length) {
         var btnHtml = '<div class="return-button"><button onclick="platform.validate(\'top\');">';
         btnHtml += typeof sto.addReturnButton == 'string' ? sto.addReturnButton : 'Revenir à la liste des questions';
         btnHtml += '</button></div>';
         $(btnHtml).appendTo('body');
      }
   });
} else if (window.platform) {
   platform.initWithTask(task);
} else {
   setTimeout(function () {
      window.platform.initWithTask(task);
   }, 100);
}
