$(document).ready(function() {
  if (window.taskData) {
    var taskInstructionsHtml = $('#taskIntro').html();
    var additionnalOptions = window.taskData.codecastParameters ? window.taskData.codecastParameters : {};

    var codecastParameters = $.extend(true, {
      start: 'task',
      showStepper: true,
      showStack: true,
      showViews: true,
      showIO: true,
      showDocumentation: true,
      showFullScreen: true,
      showMenu: true,
      canRecord: false,
      platform: 'python',
      canChangePlatform: true,
      canChangeLanguage: true,
      controls: {},
      task: window.taskData,
      taskInstructions: taskInstructionsHtml,
    }, additionnalOptions);

    Codecast.start(codecastParameters);
  }
});
