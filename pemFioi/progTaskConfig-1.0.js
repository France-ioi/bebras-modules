// Configure default language
if(!window.stringsLanguage) {
    window.stringsLanguage = 'fr';
}

requirejs.config({
  "paths": {
    "ace": modulesPath+"/ext/ace/ace",
    "angular": modulesPath+"/ext/angular/angular.min",
    "angular-ui-bootstrap-tpls": modulesPath+"/ext/angular-ui-bootstrap/ui-bootstrap-tpls-1.3.1.min",
    "angular-ui-ace": modulesPath+"/ext/angular-ui-ace/ui-ace",
    "angular-sanitize": modulesPath+"/ext/angular-sanitize/angular-sanitize.min",
    "fioi-editor2": modulesPath+"/ext/fioi-editor2/fioi-editor2.min",
    "jquery": modulesPath+"/ext/jquery/2.1/jquery.min",
    "lodash": modulesPath+"/ext/lodash/lodash.min",
    "platform-pr": modulesPath+"/integrationAPI.01/official/platform-pr",
    "installation": modulesPath+"/integrationAPI.01/installationAPI.01/pemFioi/installation",
    "miniPlatform": modulesPath+"/integrationAPI.01/official/miniPlatform",
    "models": taskPlatformPath+"/shared/models",
    "modelsManager": modulesPath+"/pemFioi/modelsManager-1.0",
    "get-locale": taskPlatformPath+"/get-locale",
    "jschannel": modulesPath+"/ext/jschannel/jschannel",
    "fioi-task-tools": modulesPath+"/pemFioi/fioi-task-tools",
    "installationToModel": modulesPath+"/pemFioi/installationToModel-1.0",
    "taskController": taskPlatformPath+"/taskController",
    "pem-api": taskPlatformPath+"/pem-api",
    "animation": taskPlatformPath+"/animation",
    "fioi-video-player": modulesPath+"/pemFioi/videoPlayer-1.0",
    "limitsDirective": taskPlatformPath+"/limits/directive",
    "hintsDirective": taskPlatformPath+"/hints/directive",
    "selectLang": taskPlatformPath+"/selectLang",
    "showdown": modulesPath+"/ext/showdown/showdown.min",
    "showdownConvert": modulesPath+"/pemFioi/showdownConvert",
    "showSource": taskPlatformPath+"/showSource",
    "showSample": taskPlatformPath+"/samples/directive",
    "webvtt": modulesPath+"/ext/webvtt/parser",

    "i18next": modulesPath+"/ext/i18next/i18next.min",
    "i18next-xhr-backend": modulesPath+"/ext/i18next/i18nextXHRBackend.min",
    "ng-i18next": modulesPath+"/ext/i18next/ng-i18next.min"
  },
  "shim": {
    "jquery": {"exports": "$"},
    "lodash": {"exports": "_"},
    "installationToModel": {"exports": "insertResourcesInModel", "deps": ["modelsManager", "models"]},
    "models": {"exports": "models"},
    "angular": {"exports": "angular"},
    "angular-ui-bootstrap-tpls": {"deps": ["angular"]},
    "angular-ui-ace": {"deps": ["angular", "ace"]},
    "platform-pr": {"deps": ["jquery", "jschannel"]},
    "angular-sanitize": {"deps": ["angular"]},
    "ng-i18next": {"deps": ["angular-sanitize", "i18next", "i18next-xhr-backend"]},
    "taskController": {"deps": ["angular-ui-ace", 'ng-i18next', 'lodash', "get-locale"]},
    "pem-api": {"deps": ["taskController", "platform-pr","angular-ui-ace", 'lodash']},
    "limitsDirective": {"deps": ["taskController", "angular-ui-ace", 'lodash']},
    "hintsDirective": {"deps": ["taskController", "angular-ui-ace", 'lodash']},
    "selectLang": {"deps": ["taskController"]},
    "showdownConvert": {"deps": ["showdown"]},
    "showSource": {"deps": ["taskController", "angular-ui-ace", 'lodash']},
    "showSample": {"deps": ["taskController", "angular-ui-ace", 'lodash']},
    "miniPlatform": {"deps": ["platform-pr"]},
    "installation": {"deps": ["platform-pr"]},
    "fioi-task-tools": {"deps": ["platform-pr", "models", 'installationToModel', 'showSample', "modelsManager", 'jquery', 'installation', 'taskController','limitsDirective', 'pem-api', 'hintsDirective', 'showSource']},
    "fioi-video-player": {"deps": ['animation', 'taskController', 'webvtt']}
  }
});
require([
  'angular', 'angular-ui-bootstrap-tpls', 'angular-ui-ace', 'selectLang',
  'fioi-editor2', 'jquery', 'lodash',
  'jschannel', 'platform-pr',
  'miniPlatform', 'fioi-task-tools',
  'fioi-video-player',
  'showdown', 'showdownConvert'
]);
