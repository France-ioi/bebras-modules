$(document).ready(function() {
  if (window.taskData) {
    var taskInstructionsHtml = $('#taskIntro').html();
    var additionalOptions = window.taskData.codecastParameters ? window.taskData.codecastParameters : {};

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
      audioWorkerUrl: modulesPath + "ext/codecast/7.0/index.worker.worker.js",
      baseUrl: "https://codecast.france-ioi.org/v7/",
      task: window.taskData,
      taskInstructions: taskInstructionsHtml,
    }, additionalOptions);

    Codecast.start(codecastParameters);
  }
});
