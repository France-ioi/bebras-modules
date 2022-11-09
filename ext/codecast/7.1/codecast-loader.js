$(document).ready(function() {
  if (window.taskData) {
    var taskInstructionsHtml = $('#taskIntro').html();

    var hints = $('#taskHints > div').toArray().map(elm => {
      return {
        content: elm.innerHTML.trim()
      };
    });

    var additionalOptions = window.taskData.codecastParameters ? window.taskData.codecastParameters : {};
    if (window.codecastPreload) {
      additionalOptions.preload = true;
    }

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
      // audioWorkerUrl: modulesPath + "ext/codecast/7.0/index.worker.worker.js",
      baseUrl: "https://codecast.france-ioi.org/v7",
      authProviders: ["algorea", "guest"],
      task: window.taskData,
      taskInstructions: taskInstructionsHtml,
      taskHints: hints,
    }, additionalOptions, window.codecastPreload ? window.codecastPreload : {});

    Codecast.start(codecastParameters);
  }
});
