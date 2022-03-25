(function () {

var importedModules = {};

var importableModules = function () {
   // Wait to have modulesPath defined before executing the function
   return {
      'jquery-1.7.1': {src: modulesPath+"/ext/jquery/1.7/jquery.min.js", id: "http://code.jquery.com/jquery-1.7.1.min.js"},
      'jquery-ui.touch-punch': {src: modulesPath+"/ext/jquery-ui/jquery.ui.touch-punch.min.js", id: "jquery.ui.touch-punch.min.js"},
      'jquery-ui-1.10.3': {src: modulesPath+"/ext/jquery-ui/1.10/jquery-ui-1.10.3.custom.min.js", id: "https://code.jquery.com/ui/1.10.3/jquery-ui.min.js"},
      'jquery-ui-1.10.3-styles': {type: "stylesheet", src: modulesPath+"/ext/jquery-ui/1.10/jquery-ui.css", id: "https://code.jquery.com/ui/1.10/jquery-ui.css"},      
      'JSON-js': {src: modulesPath+"/ext/json/json2.min.js", id: "https://github.com/douglascrockford/JSON-js"},
      'raphael-2.2.1': {src: modulesPath+"/ext/raphael/2.2.1/raphael.min.js", id: "http://cdnjs.cloudflare.com/ajax/libs/raphael/2.2.1/raphael.min.js"},
      'beaver-task-2.0': {src: modulesPath+"/pemFioi/beaver-task-2.0.js", id: "http://www.france-ioi.org/modules/pemFioi/beaver-task-2.0.js"},
      'jschannel': {src: modulesPath+"/ext/jschannel/jschannel.js", id: "http://www.france-ioi.org/modules/ext/jschannel/jschannel.js"},
      'raphaelFactory-1.0': {src: modulesPath+"/pemFioi/raphaelFactory-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/raphaelFactory-1.0.js"},
      'delayFactory-1.0': {src: modulesPath+"/pemFioi/delayFactory-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/delayFactory-1.0.js"},
      'simulationFactory-1.0': {src: modulesPath+"/pemFioi/simulationFactory-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/simulationFactory-1.0.js"},
      'beav-1.0': {src: modulesPath+"/pemFioi/beav-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/beav-1.0.js"},
      'raphael-2.1': {src: modulesPath+"/ext/raphael/2.1/raphael-min.js", id: "http://cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js"},
      'simulation-2.0': {src: modulesPath+"/pemFioi/simulation-2.0.js", id: "http://www.france-ioi.org/modules/pemFioi/simulation-2.0.js"},
      'raphaelButton-1.0': {src: modulesPath+"/pemFioi/raphaelButton-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/raphaelButton-1.0.js"},
      'graph-1.0': {src: modulesPath+"/pemFioi/graph-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/graph-1.0.js"},
      'visual-graph-1.0': {src: modulesPath+"/pemFioi/visual-graph-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/visual-graph-1.0.js"},
      'visual-graph-1.1': {src: modulesPath+"/pemFioi/visual-graph-1.1.js", id: "http://www.france-ioi.org/modules/pemFioi/visual-graph-1.1.js"},
      'visual-graph-1.2': {src: modulesPath+"/pemFioi/visual-graph-1.2.js", id: "http://www.france-ioi.org/modules/pemFioi/visual-graph-1.2.js"},
      'graph-mouse-1.0': {src: modulesPath+"/pemFioi/graph-mouse-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/graph-mouse-1.0.js"},
      'graph-mouse-1.1': {src: modulesPath+"/pemFioi/graph-mouse-1.1.js", id: "http://www.france-ioi.org/modules/pemFioi/graph-mouse-1.1.js"},
      'graph-mouse-1.2': {src: modulesPath+"/pemFioi/graph-mouse-1.2.js", id: "http://www.france-ioi.org/modules/pemFioi/graph-mouse-1.2.js"},
      'graph-mouse-1.3': {src: modulesPath+"/pemFioi/graph-mouse-1.3.js", id: "http://www.france-ioi.org/modules/pemFioi/graph-mouse-1.3.js"},
      'crane-1.0': {src: modulesPath+"/pemFioi/crane-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/crane-1.0.js"},
      'grid-1.0': {src: modulesPath+"/pemFioi/grid-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/grid-1.0.js"},
      'grid-1.1': {src: modulesPath+"/pemFioi/grid-1.1.js", id: "http://www.france-ioi.org/modules/pemFioi/grid-1.1.js"},
      'drag_lib-2.0': {src: modulesPath+"/pemFioi/drag_lib-2.0.js", id: "http://www.france-ioi.org/modules/pemFioi/drag_lib-2.0.js"},
      'drag_lib-2.1': {src: modulesPath+"/pemFioi/drag_lib-2.1.js", id: "http://www.france-ioi.org/modules/pemFioi/drag_lib-2.1.js"},
      'randomGenerator-1.0': {src: modulesPath+"/pemFioi/randomGenerator-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/randomGenerator-1.0.js"},
      'simpleKeyboard-1.0': {src: modulesPath+"/pemFioi/simpleKeyboard-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/simpleKeyboard-1.0.js"},
      'save-svg-as-png': {src: modulesPath+"/ext/save-svg-as-png/saveSvgAsPng.js", id: "save-svg-as-png"},
      'shape-paths': {src: modulesPath+"/pemFioi/shape-paths.js", id: "shape-paths"},
      'shape-paths-1.1': {src: modulesPath+"/pemFioi/shape-paths-1.1.js", id: "shape-paths-1.1"},
      'gauge-1.0': {src: modulesPath+"/pemFioi/gauge-1.0.js", id: "gauge-1.0"},
      'button-1.0': {src: modulesPath+"/pemFioi/button-1.0.js", id: "button-1.0"},

      'platform-pr': {classStr: "proxy module", src: modulesPath+"/integrationAPI.01/official/platform-pr.js", id: "http://www.france-ioi.org/modules/integrationAPI.01/official/platform-pr.js"},
      'buttonsAndMessages': {classStr: "stdButtonsAndMessages module", src: modulesPath+"/integrationAPI.01/installationAPI.01/pemFioi/buttonsAndMessages.js",  id: "http://www.france-ioi.org/modules/integrationAPI.01/installationAPI.01/pemFioi/buttonsAndMessages.js"},
      'buttonsAndMessages_resp': {classStr: "stdButtonsAndMessages module", src: modulesPath+"/integrationAPI.01/installationAPI.01/pemFioi/buttonsAndMessages_resp.js",  id: "http://www.france-ioi.org/modules/integrationAPI.01/installationAPI.01/pemFioi/buttonsAndMessages_resp.js"},
      'buttonsAndMessages_resp-1.0': {classStr: "stdButtonsAndMessages module", src: modulesPath+"/integrationAPI.01/installationAPI.01/pemFioi/buttonsAndMessages_resp-1.0.js",  id: "http://www.france-ioi.org/modules/integrationAPI.01/installationAPI.01/pemFioi/buttonsAndMessages_resp-1.0.js"},
      'installationAPI.01': {classStr: "remove", src: modulesPath+"/integrationAPI.01/installationAPI.01/pemFioi/installation.js"},
      'miniPlatform': {classStr: "remove", src: modulesPath+"/integrationAPI.01/official/miniPlatform_M.js"},
      'static-task': {src: modulesPath+"/pemFioi/static-task.js"},
      'fonts-loader-1.0': {src: modulesPath+"/pemFioi/fontsLoader-1.0.js", id: "fonts-loader"},

      'acorn': {src: modulesPath+"/ext/js-interpreter/acorn.js", id: "acorn"},
      'acorn-walk': {src: modulesPath+"/ext/acorn/walk.js", id: "acorn-walk"},
      'interpreter': {src: modulesPath+"/ext/js-interpreter/interpreter.js", id: "interpreter"},
      'ace': {src: modulesPath+"/ext/ace/ace.js", id: "ace"},
      'ace_python': {src: modulesPath+"/ext/ace/mode-python.js", id: "ace_python"},
      'ace_language_tools': {src: modulesPath+"/ext/ace/ext-language_tools.js", id: "ace_language_tools"},
      'processing-1.4.8': {src: modulesPath+"/ext/processing/1.4.8/processing.min.js", id: "https://raw.github.com/processing-js/processing-js/v1.4.8/processing.min.js"},

      'taskStyles-0.1': {type: "stylesheet", src: modulesPath+"/pemFioi/taskStyles-0.1_M.css", id: "http://www.france-ioi.org/modules/pemFioi/taskStyles-0.1_M.css"},
      'taskStyles-0.2': {type: "stylesheet", src: modulesPath+"/pemFioi/taskStyles-0.2_M.css", id: "http://www.france-ioi.org/modules/pemFioi/taskStyles-0.2_M.css"},
      'taskStyles-0.3': {type: "stylesheet", src: modulesPath+"/pemFioi/taskStyles-0.3.css", id: "http://www.france-ioi.org/modules/pemFioi/taskStyles-0.3.css"},
      'taskStyles-0.3_M': {type: "stylesheet", src: modulesPath+"/pemFioi/taskStyles-0.3_M.css", id: "http://www.france-ioi.org/modules/pemFioi/taskStyles-0.3_M.css"},
      'taskStyles-mobileFirst': {type: "stylesheet", src: modulesPath+"/pemFioi/taskStyles-mobileFirst.css", id: "http://www.france-ioi.org/modules/pemFioi/taskStyles-mobileFirst.css"},

      'conceptDisplay-1.0': {src: modulesPath+"/pemFioi/conceptDisplay-1.0.js", id: "concept_display"},
      'conceptViewer-1.0': {src: modulesPath+"/pemFioi/conceptViewer-1.0.js", id: "concept_viewer"},
      'conceptViewer_css-1.0': {type: "stylesheet", src: modulesPath+"/pemFioi/conceptViewer-1.0.css", id: "concept_viewer_css"},

      'blockly': {src: modulesPath+"/ext/blockly/blockly_compressed.js", id: "blockly"},
      'blockly_blocks': {src: modulesPath+"/ext/blockly/blocks_compressed.js", id: "blockly_blocks"},
      'blockly_javascript': {src: modulesPath+"/ext/blockly/javascript_compressed.js", id: "blockly_javascript"},
      'blockly_python': {src: modulesPath+"/ext/blockly/python_compressed.js", id: "blockly_python"},
      'blockly_fr': {src: modulesPath+"/ext/blockly/fr.js", id: "blockly_fr"},
      'blockly_en': {src: modulesPath+"/ext/blockly/en.js", id: "blockly_en"},
      'blockly_de': {src: modulesPath+"/ext/blockly/de.js", id: "blockly_de"},
      'blockly_es': {src: modulesPath+"/ext/blockly/es.js", id: "blockly_es"},
      'blockly_sl': {src: modulesPath+"/ext/blockly/sl.js", id: "blockly_sl"},
      'blockly_fioi': {src: modulesPath+"/ext/blockly-fioi/fioi-blockly.min.js", id: "blockly_fioi"},

      'blocklyRobot_lib': {src: modulesPath+"/pemFioi/blocklyRobot_lib-0.9.1.js", id: "blocklyRobot_lib"},
      'blockly-robot': {src: modulesPath+"/pemFioi/blocklyRobot_lib-0.9.1.js", id: "blocklyRobot_lib"}, // for BWINF legacy
      'blockly-printer': {src: modulesPath+"/pemFioi/blocklyPrinter_lib.js", id: "blocklyPrinter_lib"},
      'blockly-printer2': {src: modulesPath+"/pemFioi/blocklyPrinter_lib-2.1.js", id: "blocklyPrinter_lib"},
      'blockly-turtle': {src: modulesPath+"/pemFioi/blocklyTurtle_lib.js", id: "blocklyTurtle_lib"},
      'blockly-processing': {src: modulesPath+"/pemFioi/blocklyProcessing_lib.js", id: "blocklyProcessing_lib"},
      'blockly-template': {src: modulesPath+"/pemFioi/blocklyTemplate_lib.js", id: "blocklyTemplate_lib"},
      'jwinf_css': {type: "stylesheet", src: modulesPath+"/pemFioi/jwinf.css", id: "jwinf_css"}, // for BWINF

      'blockly-isndraw': {src: modulesPath+"/pemFioi/blocklyIsnDraw_lib.js", id: "blocklyIsnDraw_lib"},
      'blockly-maths': {src: modulesPath+"/pemFioi/blocklyMaths_lib.js", id: "blocklyMaths_lib"},
      'blockly-printer-2.0': {src: modulesPath+"/pemFioi/blocklyPrinter_lib-2.0.js", id: "blocklyPrinter_lib-2.0"},

      'quickAlgo_utils': {src: modulesPath+"/pemFioi/quickAlgo/utils.js", id: "quickAlgo_utils"},
      'quickAlgo_i18n': {src: modulesPath+"/pemFioi/quickAlgo/i18n.js", id: "quickAlgo_i18n"},
      'quickAlgo_interface': {src: modulesPath+"/pemFioi/quickAlgo/interface.js", id: "quickAlgo_interface"},
      'quickAlgo_blockly_blocks': {src: modulesPath+"/pemFioi/quickAlgo/blockly_blocks.js", id: "quickAlgo_blockly_blocks"},
      'quickAlgo_blockly_interface': {src: modulesPath+"/pemFioi/quickAlgo/blockly_interface.js", id: "quickAlgo_blockly_interface"},
      'quickAlgo_blockly_runner': {src: modulesPath+"/pemFioi/quickAlgo/blockly_runner.js", id: "quickAlgo_blockly_runner"},
      'quickAlgo_python_interface': {src: modulesPath+"/pemFioi/quickAlgo/python_interface.js", id: "quickAlgo_python_interface"},
      'quickAlgo_python_runner': {src: modulesPath+"/pemFioi/quickAlgo/python_runner.js", id: "quickAlgo_python_runner"},
      'quickAlgo_subtask': {src: modulesPath+"/pemFioi/quickAlgo/subtask.js", id: "quickAlgo_subtask"},
      'quickAlgo_context': {src: modulesPath+"/pemFioi/quickAlgo/context.js", id: "quickAlgo_context"},
      'quickAlgo_css': {type: "stylesheet", src: modulesPath+"/pemFioi/quickAlgo/quickAlgo.css", id: "quickAlgo_css"},

      'scratch': {src: modulesPath+"/ext/scratch/blockly_compressed_vertical.js", id: "scratch"},
      'scratch_blocks_common': {src: modulesPath+"/ext/scratch/blocks_compressed.js", id: "scratch_blocks_common"},
      'scratch_blocks': {src: modulesPath+"/ext/scratch/blocks_compressed_vertical.js", id: "scratch_blocks"},
      'scratch_fixes': {src: modulesPath+"/ext/scratch/fixes.js", id: "scratch_fixes"},
      'scratch_procedures': {src: modulesPath+"/ext/scratch/procedures.js", id: "scratch_procedures"},

      'python_count': {src: modulesPath+"/pemFioi/pythonCount-1.0.js", id: "python_count"},
      'skulpt_quickAlgo': {src: modulesPath+"ext/skulpt/skulpt.quickAlgo.min.js", id: "skulpt_quickAlgo"},
      'skulpt_stdlib': {src: modulesPath+"ext/skulpt/skulpt-stdlib.js", id: "skulpt_stdlib"},
      'skulpt_debugger': {src: modulesPath+"ext/skulpt/debugger.js", id: "skulpt_debugger"},

      'simple_draw': {src: modulesPath+"/pemFioi/javascool/simple_draw.js", id: "simple_draw"},
      'blockly_simple_draw': {src: modulesPath+"/pemFioi/javascool/blockly_simple_draw.js", id: "blockly_simple_draw"},

      'p5': {src: modulesPath+"/pemFioi/p5/p5.js", id: "p5"},
      'p5.sound': {src: modulesPath+"/pemFioi/p5/p5.sound.js", id: "p5.sound"},
      'player_p5': {src: modulesPath+"/pemFioi/p5/player_p5.js", id: "player_p5"},
      'blockly_p5': {src: modulesPath+"/pemFioi/p5/blockly_p5.js", id: "blockly_p5"},

      'blockly_map': {src: modulesPath+"/pemFioi/map/blockly_map.js", id: "blockly_map"},
      'map': {src: modulesPath+"/pemFioi/map/map.js", id: "map"},

      'blockly_database': {src: modulesPath+"/pemFioi/database/blockly_database.js", id: "blockly_database"},
      'database': {src: modulesPath+"/pemFioi/database/database.js", id: "database"},
      'database_css': {type: "stylesheet", src: modulesPath+"/pemFioi/database/styles.css", id: "database_css"},

      'files_repository': {src: modulesPath+"/pemFioi/shared/files_repository.js", id: "files_repository"},
      'blocks_helper': {src: modulesPath+"/pemFioi/shared/blocks_helper.js", id: "blocks_helper"},

      'taskVideo': {src: modulesPath+"/pemFioi/taskVideo/taskVideo.js", id: "taskVideo"},
      'taskVideoPlayer': {src: modulesPath+"/pemFioi/taskVideo/player.js", id: "taskVideoPlayer"},
      'taskVideo_css': {type: "stylesheet", src: modulesPath+"/pemFioi/taskVideo/player.css", id: "taskVideo_css"},

      // map2d
      'map2d': {src: modulesPath+"/pemFioi/components/map2d/map2d.js", id: "map2d"},
      'map2d_styles': {type: "stylesheet", src: modulesPath+"/pemFioi/components/map2d/styles.css", id: "map2d_styles"},
      'openstreetmap_task': {src: modulesPath+"/pemFioi/components/map2d/task.js", id: "openstreetmap_task"},

      // gaps table
      'gaps_table': {src: modulesPath+"/pemFioi/components/gaps-table/component.js", id: "gaps_table"},
      'gaps_table_styles': {type: "stylesheet", src: modulesPath+"/pemFioi/components/gaps-table/styles.css", id: "gaps_table_styles"},
      'gaps_table_task': {src: modulesPath+"/pemFioi/components/gaps-table/task.js", id: "gaps_table_task"},         

      // csv editor
      'csv_editor': {src: modulesPath+"/pemFioi/components/csv-text-editor/editor.js", id: "csv_editor"},
      'csv_editor_styles': {type: "stylesheet", src: modulesPath+"/pemFioi/components/csv-text-editor/styles.css", id: "csv_editor_styles"},
      'csv_editor_task': {src: modulesPath+"/pemFioi/components/csv-text-editor/task.js", id: "csv_editor_task"},      

      // Language theory
      'automata-1.0': {src: modulesPath+"/pemFioi/automata-1.0.js", id: "automata-1.0"},
      'lr_parser-1.0': {src: modulesPath+"/pemFioi/LR_parser-1.0.js", id: "lr_parser-1.0"},
      // 'lr_parser-1.0-css': {type: "stylesheet", src: modulesPath+"/pemFioi/LR_parser-1.0.css", id: "lr_parser-1.0-css"},
      'machines-grammar': {src: modulesPath+"/ext/machines/js/grammar.js", id: "machines-grammar"},
      'machines-lrclosuretable': {src: modulesPath+"/ext/machines/js/lrclosuretable.js", id: "machines-lrclosuretable"},
      'machines-lrtable': {src: modulesPath+"/ext/machines/js/lrtable.js", id: "machines-lrtable"},
      'machines-tools-alt': {src: modulesPath+"/ext/machines/js/tools-alt.js", id: "machines-tools-alt"},
      'machines-slritem': {src: modulesPath+"/ext/machines/js/slritem.js", id: "machines-slritem"},
      'machines-underscore': {src: modulesPath+"/ext/machines/js/underscore.js", id: "machines-underscore"},

      // Bundles
      'bebras-base': {src: modulesPath+"bundles/bebras-base.js", id: "bundle-bebras-base"},
      'bebras-interface': {src: modulesPath+"bundles/bebras-interface.js", id: "bundle-bebras-interface"},
      'js-interpreter': {src: modulesPath+"bundles/js-interpreter.js", id: "bundle-js-interpreter"},
      'blockly-base': {src: modulesPath+"bundles/blockly-base.js", id: "bundle-blockly-base"},
      'scratch-base': {src: modulesPath+"bundles/scratch-base.js", id: "bundle-scratch-base"},
      'quickAlgo-all-blockly': {src: modulesPath+"bundles/quickAlgo-all-blockly.js", id: "bundle-quickAlgo-all-blockly"},
      'quickAlgo-all-python': {src: modulesPath+"bundles/quickAlgo-all-python.js", id: "bundle-quickAlgo-all-python"}
   }
}

var languageScripts = function () {
   var strLang = window.stringsLanguage ? window.stringsLanguage : 'fr';
   return {
      blockly: [
         'acorn',
         'acorn-walk',
         'interpreter',
         'blockly',
         'blockly_blocks',
         'blockly_javascript',
         'blockly_python',
         'blockly_' + strLang,
         'blockly_fioi',
         'quickAlgo_utils',
         'quickAlgo_i18n',
         'quickAlgo_interface',
         'quickAlgo_blockly_blocks',
         'quickAlgo_blockly_interface',
         'quickAlgo_blockly_runner',
         'quickAlgo_subtask',
         'quickAlgo_context',
         'quickAlgo_css'
      ],
      scratch: [
         'acorn',
         'acorn-walk',
         'interpreter',
         'scratch',
         'scratch_blocks_common',
         'scratch_blocks',
         'blockly_javascript',
         'blockly_python',
         'blockly_' + strLang,
         'blockly_fioi',
         'scratch_fixes',
         'scratch_procedures',
         'quickAlgo_utils',
         'quickAlgo_i18n',
         'quickAlgo_interface',
         'quickAlgo_blockly_blocks',
         'quickAlgo_blockly_interface',
         'quickAlgo_blockly_runner',
         'quickAlgo_subtask',
         'quickAlgo_context',
         'quickAlgo_css'
      ],
      python: [
         'python_count',
         'ace',
         'ace_python',
         'ace_language_tools',
         'skulpt_quickAlgo',
         'skulpt_stdlib',
         'skulpt_debugger',
         'quickAlgo_utils',
         'quickAlgo_i18n',
         'quickAlgo_interface',
         'quickAlgo_python_interface',
         'quickAlgo_python_runner',
         'quickAlgo_subtask',
         'quickAlgo_context',
         'quickAlgo_css'
      ]
   }
}

var bundledModules = function () {
   // List of bundles and which modules they include
   // How to import the bundles is defined in importableModules
   return [
      {name: 'bebras-base', included: ['jquery-1.7.1', 'JSON-js', 'raphael-2.2.1', 'beaver-task-2.0', 'jschannel', 'raphaelFactory-1.0', 'delayFactory-1.0', 'simulationFactory-1.0']},
      {name: 'bebras-interface', included: ['platform-pr', 'buttonsAndMessages', 'beav-1.0', 'installationAPI.01', 'miniPlatform']},
      {name: 'js-interpreter', included: ['acorn', 'acorn-walk', 'interpreter']},
      {name: 'blockly-base', included: ['blockly', 'blockly_blocks', 'blockly_javascript', 'blockly_python']},
      {name: 'scratch-base', included: ['scratch', 'scratch_blocks_common', 'scratch_blocks', 'blockly_javascript', 'blockly_python']},
      {name: 'quickAlgo-all-blockly', included: ['quickAlgo_utils', 'quickAlgo_i18n', 'quickAlgo_interface', 'quickAlgo_blockly_blocks','quickAlgo_blockly_interface', 'quickAlgo_blockly_runner', 'quickAlgo_subtask', 'quickAlgo_context']},
      {name: 'quickAlgo-all-python', included: ['python_count', 'ace', 'ace_python', 'skulpt_quickAlgo', 'skulpt_stdlib', 'skulpt_debugger', 'quickAlgo_utils', 'quickAlgo_i18n', 'quickAlgo_interface', 'quickAlgo_python_interface', 'quickAlgo_python_runner', 'quickAlgo_subtask', 'quickAlgo_context']}
   ];
};


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


function getBundles(modulesList) {
   // Check modulesList for modules which are already bundled together

   // For now, only do it if useBundles is true
   if(!window.useBundles) { return modulesList; }

   if(typeof bundledModules == 'function') {
      bundledModules = bundledModules();
   }
   for(var iBundle in bundledModules) {
      var bundleIncludes = bundledModules[iBundle].included;
      var newModulesList = modulesList.slice();
      var isFirst = true;
      var ok = true;
      for(var iMod in bundleIncludes) {
         var idx = newModulesList.indexOf(bundleIncludes[iMod]);
         if(idx == -1) {
            ok = false;
            break;
         }
         if(isFirst) {
            // Include the name of the bundle to include instead
            newModulesList.splice(idx, 1, bundledModules[iBundle].name);
            isFirst = false;
         } else {
            newModulesList.splice(idx, 1);
         }
      }
      if(ok) {
         modulesList = newModulesList;
      }
   }
   return modulesList;
}


function importModules(modulesList) {
   if(typeof importableModules == 'function') {
      importableModules = importableModules();
   };
   modulesList = getBundles(modulesList);
   var modulesStr = '';
   for(var iMod in modulesList) {
      var moduleName = modulesList[iMod];
      var curModule = importableModules[moduleName];
      if(curModule) {
         // Avoid importing the same module twice
         if(importedModules[moduleName] === true) {
            continue;
         } else {
            importedModules[moduleName] = true;
         }

         var modClass = curModule.classStr ? curModule.classStr : 'module';
         var modSrc = curModule.src;
         if(QueryString.v) {
            // Add v= parameters to the URLs
            modSrc += (modSrc.indexOf('?') > -1 ? '&' : '?') + 'v=' + QueryString.v;
         }
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
      var elemLangs = elem.getAttribute('data-lang').split(' ');
      var elemOk = false;
      for (var i=0; i<elemLangs.length; i++) {
         if(elemLangs[i] == lang) {
            elemOk = true;
            break;
         }
      }
      if(!elemOk) {
         if(typeof elem.remove === 'function') {
            elem.remove();
         } else {
            elem.outerHTML = ''; // IE11 support
         }
      }
   }
}


function importLanguageModules(defaultLang) {
   // Default language
   var lang = QueryString.language ? QueryString.language : defaultLang;

   if(typeof languageScripts == 'function') {
      languageScripts = languageScripts();
   };

   if(!languageScripts[lang]) {
      console.error("Language "+lang+" unknown, couldn't load scripts.");
   }

   importModules(languageScripts[lang]);

   if(!window.preprocessingFunctions) { window.preprocessingFunctions = []; }
   var fct = function () { conditionalLanguageElements(lang); };
   window.preprocessingFunctions.push(fct);
   window.addEventListener('DOMContentLoaded', fct);
}

window.importModules = importModules;
window.conditionalLanguageElements = conditionalLanguageElements;
window.importLanguageModules = importLanguageModules;

})();
