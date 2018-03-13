function initOpenAnswer(selector, btnLabel, savedMsg) {
  // Get the right path to the images for buttonsAndMessages
  if(typeof window.contestsRoot == 'undefined') {
    window.contestsRoot = window.modulesPath;
  }
  if(typeof window.contestsFolder == 'undefined') {
    window.contestFolder = 'img';
  }

  task.load = function (views, callback) {
    var area = $(selector);
    area.html('' +
      '<div><textarea class="openAnswerArea" cols="80" rows="10">' +
      '</textarea></div>' +
      '<div><button class="openAnswerBtn">' +
      btnLabel +
      '</button></div>');

    area.find('.openAnswerBtn').click(function () {
      platform.validate('stay', function () {});
    });

    $('body').append('<div id="displayHelperAnswering" style="display: none;"></div>');

    callback();
  };

  // TODO :: test this fix on getHeight on other beaver tasks
  task.getHeight = function(callback) {
    // Minimum 600px height for the popup
    callback(Math.max(600, parseInt($("html").outerHeight(true))));
  };

  task.getAnswerObject = function () {
    return $(selector).find('.openAnswerArea').val();
  };

  task.reloadAnswer = function(strAnswer, callback) {
     try {
        strAnswer = JSON.parse(strAnswer);
     } catch(e) {}
     $(selector).find('.openAnswerArea').val(strAnswer);
     callback();
  };

  task.gradeAnswer = function (answer, answerToken, success, error) {
    platform.getTaskParams(null, null, function (taskParams) {
      success(taskParams.maxScore, savedMsg);
    });
  };
};
