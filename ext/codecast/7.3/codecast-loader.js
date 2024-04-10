$(document).ready(function() {
  if (window.taskData) {
    if (window.taskData.waitInit) {
      window.taskData.waitInit();
    }

    var taskInstructionsHtml = $('#taskIntro').html();

    var hints = $('#taskHints > div').toArray().map(elm => {
      return {
        content: elm.innerHTML.trim(),
        minScore: elm.getAttribute('data-min-score') ? Number(elm.getAttribute('data-min-score')) : undefined,
        id: elm.getAttribute('data-id') ? elm.getAttribute('data-id') : undefined,
        question: elm.hasAttribute('data-question'),
        previousHintId: elm.getAttribute('data-previous-hint-id') ? elm.getAttribute('data-previous-hint-id') : undefined,
        nextHintId: elm.getAttribute('data-next-hint-id') ? elm.getAttribute('data-next-hint-id') : undefined,
        yesHintId: elm.getAttribute('data-yes-hint-id') ? elm.getAttribute('data-yes-hint-id') : undefined,
        noHintId: elm.getAttribute('data-no-hint-id') ? elm.getAttribute('data-no-hint-id') : undefined,
        disablePrevious: elm.hasAttribute('data-disable-previous'),
        disableNext: elm.hasAttribute('data-disable-next'),
        immediate: elm.hasAttribute('data-immediate'),
        levels: elm.hasAttribute('data-levels') ? elm.getAttribute('data-levels').split() : undefined,
      };
    });

    var additionalOptions = window.taskData.codecastParameters ? window.taskData.codecastParameters : {};
    if (window.codecastPreload) {
      additionalOptions.preload = true;
    }
    if (!additionalOptions.language && window.stringsLanguage) {
      additionalOptions.language = window.stringsLanguage;
    }

    // Merge metadata into task data
    if (window.PEMTaskMetaData && window.taskData) {
      if (window.PEMTaskMetaData.supportedLanguages) {
        window.taskData.supportedLanguages = window.PEMTaskMetaData.supportedLanguages.join(',');
      }
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
      canDownload: true,
      controls: {},
      audioWorkerUrl: window.modulesPath + "ext/codecast/7.3/index.worker.worker.js",
      baseUrl: "https://codecast.france-ioi.org/v7",
      authProviders: ["algorea", "guest"],
      task: window.taskData,
      taskInstructions: taskInstructionsHtml,
      taskHints: hints,
      taskSuccessMessage: $('#taskSuccessMessage').length ? $('#taskSuccessMessage').html() : null,
    }, additionalOptions, window.codecastPreload ? window.codecastPreload : {});

    Codecast.start(codecastParameters);
  }
});
