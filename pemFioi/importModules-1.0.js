var importableModules = function () {
   // Wait to have modulesPath defined before executing the function
   return {
      'jquery-1.7.1': {src: modulesPath+"/ext/jquery/1.7/jquery.min.js", id: "http://code.jquery.com/jquery-1.7.1.min.js"},
      'JSON-js': {src: modulesPath+"/ext/json/json2.min.js", id: "https://github.com/douglascrockford/JSON-js"},
      'raphael-2.2.1': {src: modulesPath+"/ext/raphael/2.2.1/raphael.min.js", id: "http://cdnjs.cloudflare.com/ajax/libs/raphael/2.2.1/raphael.min.js"},
      'beaver-task-2.0': {src: modulesPath+"/pemFioi/beaver-task-2.0.js", id: "http://www.france-ioi.org/modules/pemFioi/beaver-task-2.0.js"},
      'jschannel': {src: modulesPath+"/ext/jschannel/jschannel.js", id: "http://www.france-ioi.org/modules/ext/jschannel/jschannel.js"},
      'raphaelFactory-1.0': {src: modulesPath+"/pemFioi/raphaelFactory-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/raphaelFactory-1.0.js"},
      'delayFactory-1.0': {src: modulesPath+"/pemFioi/delayFactory-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/delayFactory-1.0.js"},
      'simulationFactory-1.0': {src: modulesPath+"/pemFioi/simulationFactory-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/simulationFactory-1.0.js"},
      'platform-pr': {class: "proxy module", src: modulesPath+"/integrationAPI.01/official/platform-pr.js", id: "http://www.france-ioi.org/modules/integrationAPI.01/official/platform-pr.js"},
      'buttonsAndMessages': {class: "stdButtonsAndMessages module", src: modulesPath+"/integrationAPI.01/installationAPI.01/pemFioi/buttonsAndMessages.js",  id: "http://www.france-ioi.org/modules/integrationAPI.01/installationAPI.01/pemFioi/buttonsAndMessages.js"},
      'beav-1.0': {src: modulesPath+"/pemFioi/beav-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/beav-1.0.js"},
      'installationAPI.01': {class: "remove", src: modulesPath+"/integrationAPI.01/installationAPI.01/pemFioi/installation.js"},
      'miniPlatform': {class: "remove", src: modulesPath+"/integrationAPI.01/official/miniPlatform.js"},
      'acorn': {src: modulesPath+"/ext/js-interpreter/acorn.js", id: "acorn"},
      'interpreter': {src: modulesPath+"/ext/js-interpreter/interpreter.js", id: "interpreter"},

      'taskStyles-0.1': {type: "stylesheet", src: modulesPath+"/pemFioi/taskStyles-0.1.css", id: "http://www.france-ioi.org/modules/pemFioi/taskStyles-0.1.css"},

      'blockly': {src: modulesPath+"/ext/blockly/blockly_compressed.js", id: "blockly"},
      'blockly_blocks': {src: modulesPath+"/ext/blockly/blocks_compressed.js", id: "blockly_blocks"},
      'blockly_javascript': {src: modulesPath+"/ext/blockly/javascript_compressed.js", id: "blockly_javascript"},
      'blockly_python': {src: modulesPath+"/ext/blockly/python_compressed.js", id: "blockly_python"},
      'blockly_fr': {src: modulesPath+"/ext/blockly/fr.js", id: "blockly_fr"},
      'blockly_en': {src: modulesPath+"/ext/blockly/en.js", id: "blockly_en"},
      'blockly_de': {src: modulesPath+"/ext/blockly/de.js", id: "blockly_de"},
      'blockly_lib': {src: modulesPath+"/pemFioi/blockly_lib-0.9.js", id: "blockly_lib"},
      'blockly_lib_css': {type: "stylesheet", src: modulesPath+"/pemFioi/blockly_lib.css", id: "blockly_lib_css"},
      'blocklyRobot_lib': {src: modulesPath+"/pemFioi/blocklyRobot_lib-0.9.js", id: "blocklyRobot_lib"},

      'scratch': {src: modulesPath+"/ext/scratch/blockly_compressed_vertical.js", id: "scratch"},
      'scratch_blocks_common': {src: modulesPath+"/ext/scratch/blocks_compressed.js", id: "scratch_blocks_common"},
      'scratch_blocks': {src: modulesPath+"/ext/scratch/blocks_compressed_vertical.js", id: "scratch_blocks"},
      'scratch_fixes': {src: modulesPath+"/ext/scratch/fixes.js", id: "scratch_fixes"},

      'python_index': {src: modulesPath+"pemFioi/code-editor/index.js", id: "python_index"},
      'python_constants': {src: modulesPath+"pemFioi/code-editor/components/constants.js", id: "python_constants"},
      'python_dom_utils': {src: modulesPath+"pemFioi/code-editor/utilities/DOM-utils.js", id: "python_dom_utils"},
      'python_localization_utils': {src: modulesPath+"pemFioi/code-editor/utilities/localization-utils.js", id: "python_localization_utils"},
      'python_shared_utils': {src: modulesPath+"pemFioi/code-editor/utilities/shared-utils.js", id: "python_shared_utils"},
      'python_logic': {src: modulesPath+"pemFioi/code-editor/controllers/logic.js", id: "python_logic"},
      'python_css': {type: "stylesheet", src: modulesPath+"pemFioi/code-editor/stylesheets/ui.css", id: "python_css"},
      'python_subtask': {src: modulesPath+"pemFioi/code-editor/controllers/subtask.js", id: "python_subtask"},
      'python_python': {src: modulesPath+"pemFioi/code-editor/components/python.js", id: "python_python"}
   }
}

var languageScripts = {
   blockly: [
      'blockly',
      'blockly_blocks',
      'blockly_javascript',
      'blockly_python',
      'blockly_' + window.stringsLanguage,
      'blockly_lib',
      'blockly_lib_css',
      'blocklyRobot_lib'
   ],
   scratch: [
      'scratch',
      'scratch_blocks_common',
      'scratch_blocks',
      'blockly_javascript',
      'blockly_python',
      'scratch_fixes',
      'blockly_' + window.stringsLanguage,
      'blockly_lib',
      'blockly_lib_css',
      'blocklyRobot_lib'
   ],
   python: [
      'python_index',
      'python_constants',
      'python_dom_utils',
      'python_localization_utils',
      'python_shared_utils',
      'python_logic',
      'python_css',
      'python_subtask',
      'python_python',
      'blocklyRobot_lib'
   ]
}


// from http://stackoverflow.com/questions/979975/
var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return query_string;
}();


function importModules(modulesList) {
   if(typeof importableModules == 'function') { importableModules = importableModules(); };
   var modulesStr = '';
   for(var iMod in modulesList) {
      var moduleName = modulesList[iMod];
      var curModule = importableModules[moduleName];
      if(curModule) {
         var modClass = curModule.class ? curModule.class : 'module';
         var modSrc = curModule.src;
         var modId = curModule.id ? curModule.id : moduleName;
         if(curModule.type == 'stylesheet') {
            modulesStr += '<link class="'+modClass+'" rel="stylesheet" type="text/css" href="'+modSrc+'" id="'+modId+'">';
         } else {
            modulesStr += '<script class="'+modClass+'" type="text/javascript" src="'+modSrc+'" id="'+modId+'"></script>';
         }
      } else {
         console.error("Module '"+moduleName+"' unknown.");
      }
   }
   document.write(modulesStr);
}


function conditionalLanguageElements(lang) {
   var elemList = document.querySelectorAll('[data-lang]');

   for(var iElem=0; iElem< elemList.length; iElem++) {
      elem = elemList[iElem];
      if(elem.getAttribute('data-lang') != lang) {
         elem.remove();
      }
   }
}


function importLanguageModules(defaultLang) {
   // Default language
   var lang = QueryString.language ? QueryString.language : defaultLang;

   if(!languageScripts[lang]) {
      console.error("Language "+lang+" unknown, couldn't load scripts.");
   }

   importModules(languageScripts[lang]);

   window.addEventListener('load', function () { conditionalLanguageElements(lang); });
}
