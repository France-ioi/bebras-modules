function initOpenAnswer(selector, btnLabel, savedMsg) {
  task.load = function (views, callback) {
    var area = $(selector);
    area.html('' +
      '<div><textarea class="openAnswerArea" cols="80" rows="10">' +
      '</textarea></div>' +
      '<div><button class="openAnswerBtn">' +
      btnLabel +
      '</button></div>');

    area.find('.openAnswerBtn').click(function () {
      platform.validate('next', function () {});
    });

    $('body').append('<div id="displayHelperAnswering" style="display: none;"></div>');

    callback();
  };

  task.getAnswerObject = function () {
    return $(selector).find('.openAnswerArea').val();
  };

  task.reloadAnswer = function(strAnswer, callback) {
     $(selector).find('.openAnswerArea').val(strAnswer);
     callback();
  };

  task.gradeAnswer = function (answer, answerToken, success, error) {
    platform.getTaskParams(null, null, function (taskParams) {
      success(taskParams.maxScore, savedMsg);
    });
  };
};
