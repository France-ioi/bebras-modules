$(document).ready(function() {
  if (window.taskData) {
    Codecast.start({
      "start": "task",
      "showStepper": true,
      "showStack": true,
      "showViews": true,
      "showIO": true,
      "platform": "python",
      "task": window.taskData,
    });
  }
});
