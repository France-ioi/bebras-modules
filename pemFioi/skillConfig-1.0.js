// Configure default language
if(!window.stringsLanguage) {
    window.stringsLanguage = 'fr';
}

requirejs.config({
  "paths": {
    "jquery": modulesPath+"/ext/jquery/2.1/jquery.min",
    "platform-pr": modulesPath+"/integrationAPI.01/official/platform-pr",
    "installation": modulesPath+"/integrationAPI.01/installationAPI.01/pemFioi/installation",
    "miniPlatform": modulesPath+"/integrationAPI.01/official/miniPlatform",
    "jschannel": modulesPath+"/ext/jschannel/jschannel",
    "pem-api": taskPlatformPath+"/pem-api",
    "fioi-skill-tools": modulesPath+"/pemFioi/fioi-skill-tools"
  },
  "shim": {
    "jquery": {"exports": "$"},
    "platform-pr": {"deps": ["jquery", "jschannel"]},
    "miniPlatform": {"deps": ["platform-pr"]},
    "installation": {"deps": ["platform-pr"]},
    "fioi-skill-tools": {"deps": ["jquery"]}
  }
});
require([
  'jquery',
  'jschannel', 'platform-pr', 'miniPlatform',
  "fioi-skill-tools"
]);
