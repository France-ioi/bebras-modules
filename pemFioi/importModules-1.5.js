(function () {

   var importedModules = {};

   var deferModulesForLanguage = [];

   var importableModules = function () {
      // Wait to have modulesPath defined before executing the function
      return {
         'jquery-1.7.1': {src: modulesPath+"/ext/jquery/1.7/jquery.min.js", id: "http://code.jquery.com/jquery-1.7.1.min.js"},
         'jquery-ui-1.10.3': {src: modulesPath+"/ext/jquery-ui/1.10/jquery-ui-1.10.3.custom.min.js", id: "https://code.jquery.com/ui/1.10.3/jquery-ui.min.js"},
         'jquery-ui.touch-punch': {src: modulesPath+"/ext/jquery-ui/jquery.ui.touch-punch.min.js", id: "jquery.ui.touch-punch.min.js"},
         'jquery-ui.touch-punch.fixed': {src: modulesPath+"/ext/jquery-ui/jquery.ui.touch-punch.fixed.js", id: "jquery.ui.touch-punch.fixed.js"},
         'JSON-js': {src: modulesPath+"/ext/json/json2.min.js", id: "https://github.com/douglascrockford/JSON-js"},
         'raphael-2.2.1': {src: modulesPath+"/ext/raphael/2.2.1/raphael.min.js", id: "http://cdnjs.cloudflare.com/ajax/libs/raphael/2.2.1/raphael.min.js"},
         'raphael-2.2.1b': {src: modulesPath+"/ext/raphael/2.2.1b/raphael.min.js", id: "raphael-2.2.1b"},
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
         'static-task': {src: modulesPath+"/pemFioi/static-task.js"},
         'acorn': {src: modulesPath+"/ext/js-interpreter/acorn.js", id: "acorn"},
         'acorn-walk': {src: modulesPath+"/ext/acorn/walk.js", id: "acorn-walk"},
         'interpreter': {src: modulesPath+"/ext/js-interpreter/interpreter.js", id: "interpreter"},
         'ace': {src: modulesPath+"/ext/ace/ace.js", id: "ace"},
         'ace_python': {src: modulesPath+"/ext/ace/mode-python.js", id: "ace_python"},
         'ace_language_tools': {src: modulesPath+"/ext/ace/ext-language_tools.js", id: "ace_language_tools"},
         'save-svg-as-png': {src: modulesPath+"/ext/save-svg-as-png/saveSvgAsPng.js", id: "save-svg-as-png"},
         'fonts-loader-1.0': {src: modulesPath+"/pemFioi/fontsLoader-1.0.js", id: "fonts-loader"},
         'grid-1.0': {src: modulesPath+"/pemFioi/grid-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/grid-1.0.js"},
         'drag_lib-2.0': {src: modulesPath+"/pemFioi/drag_lib-2.0.js", id: "http://www.france-ioi.org/modules/pemFioi/drag_lib-2.0.js"},
         'simulation-2.0': {src: modulesPath+"/pemFioi/simulation-2.0.js", id: "http://www.france-ioi.org/modules/pemFioi/simulation-2.0.js"},
         'raphaelButton-1.0': {src: modulesPath+"/pemFioi/raphaelButton-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/raphaelButton-1.0.js"},
         'graph-1.0': {src: modulesPath+"/pemFioi/graph-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/graph-1.0.js"},
         'randomGenerator-1.0': {src: modulesPath+"/pemFioi/randomGenerator-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/randomGenerator-1.0.js"},
         'shape-paths': {src: modulesPath+"/pemFioi/shape-paths.js", id: "shape-paths"},
         'shape-paths-1.1': {src: modulesPath+"/pemFioi/shape-paths-1.1.js", id: "shape-paths-1.1"},
         'zen3d': { src: modulesPath + "/ext/zen3d/zen3d.min.js", id: "zen3d" },
         'canvas2svg': { src: modulesPath + "/ext/canvas2svg/canvas2svg.js", id: "canvas2svg" },
         'visual-graph-1.0': {src: modulesPath+"/pemFioi/visual-graph-1.0.js", id: "http://www.france-ioi.org/modules/pemFioi/visual-graph-1.0.js"},
         'visual-graph-1.1': {src: modulesPath+"/pemFioi/visual-graph-1.1.js", id: "http://www.france-ioi.org/modules/pemFioi/visual-graph-1.1.js"},
         'visual-graph-1.2': {src: modulesPath+"/pemFioi/visual-graph-1.2.js", id: "http://www.france-ioi.org/modules/pemFioi/visual-graph-1.2.js"},
         'graph-mouse-1.1': {src: modulesPath+"/pemFioi/graph-mouse-1.1.js", id: "http://www.france-ioi.org/modules/pemFioi/graph-mouse-1.1.js"},
         'graph-mouse-1.2': {src: modulesPath+"/pemFioi/graph-mouse-1.2.js", id: "http://www.france-ioi.org/modules/pemFioi/graph-mouse-1.2.js"},

         'showdown': {src: modulesPath+"/ext/showdown/showdown.min.js", id: "showdown"},
         'showdownConvert': {src: modulesPath+"/pemFioi/showdownConvert.js", id: "showdownConvert"},
         'mathjax': {src: modulesPath+"/ext/mathjax/MathJax.js?config=TeX-MML-AM_CHTML", id: "mathjax"},
         'post_processor': {src: modulesPath+"/pemFioi/post_processor.js", id: "post_processor"},

         'prismjs': {src: modulesPath+"/ext/prismjs/prism.js", id: "prismjs"},
         'prismjs-css': {type: "stylesheet", src: modulesPath+"/ext/prismjs/prism.css", id: "prismjs-css"},

         'taskStyles-0.1': {type: "stylesheet", src: modulesPath+"/pemFioi/taskStyles-0.1.css", id: "http://www.france-ioi.org/modules/pemFioi/taskStyles-0.1.css"},
         'taskStyles-mobileFirst': {type: "stylesheet", src: modulesPath+"/pemFioi/taskStyles-mobileFirst.css", id: "http://www.france-ioi.org/modules/pemFioi/taskStyles-mobileFirst.css"},

         'conceptDisplay-1.0': {src: modulesPath+"/pemFioi/conceptDisplay-1.0.js", id: "concept_display"},
         'conceptViewer-1.0': {src: modulesPath+"/pemFioi/conceptViewer-1.0-mobileFirst.js", id: "concept_viewer"},
         'conceptViewer_css-1.0': {type: "stylesheet", src: modulesPath+"/pemFioi/conceptViewer-1.0-mobileFirst.css", id: "concept_viewer_css"},
         'conceptViewer-2.0': {src: modulesPath+"/pemFioi/conceptViewer-2.0.js", id: "concept_viewer_2"},
         'conceptViewer_css-2.0': {type: "stylesheet", src: modulesPath+"/pemFioi/conceptViewer-2.0.css", id: "concept_viewer_2_css"},

         'blockly': {src: modulesPath+"/ext/blockly/blockly_compressed.js", id: "blockly"},
         'blockly_blocks': {src: modulesPath+"/ext/blockly/blocks_compressed.js", id: "blockly_blocks"},
         'blockly_javascript': {src: modulesPath+"/ext/blockly/javascript_compressed.js", id: "blockly_javascript"},
         'blockly_python': {src: modulesPath+"/ext/blockly/python_compressed.js", id: "blockly_python"},
         'blockly_fr': {src: modulesPath+"/ext/blockly/fr.js", id: "blockly_fr"},
         'blockly_en': {src: modulesPath+"/ext/blockly/en.js", id: "blockly_en"},
         'blockly_de': {src: modulesPath+"/ext/blockly/de.js", id: "blockly_de"},
         'blockly_es': {src: modulesPath+"/ext/blockly/es.js", id: "blockly_es"},
         'blockly_it': {src: modulesPath+"/ext/blockly/it.js", id: "blockly_it"},
         'blockly_sl': {src: modulesPath+"/ext/blockly/sl.js", id: "blockly_sl"},
         'blockly_fioi': {src: modulesPath+"/ext/blockly-fioi/fioi-blockly.min.js", id: "blockly_fioi"},

         'blockly-robot-0.9': {src: modulesPath+"/pemFioi/blocklyRobot_lib-0.9.1.js", id: "blocklyRobot_lib"},
         'blockly-robot-1.0': {src: modulesPath+"/pemFioi/blocklyRobot_lib-1.0.0.js", id: "blocklyRobot_lib"},
         'blockly-robot-1.1': {src: modulesPath+"/pemFioi/blocklyRobot_lib-1.1.js", id: "blocklyRobot_lib"},
         'blockly-robot-dev': {src: modulesPath+"/pemFioi/blocklyRobot_lib-1.0.1-dev.js", id: "blocklyRobot_lib"},
         'blockly-printer': {src: modulesPath+"/pemFioi/blocklyPrinter_lib.js", id: "blocklyPrinter_lib"},
         'blockly-printer-2.1': {src: modulesPath+"/pemFioi/blocklyPrinter_lib-2.1.js", id: "blocklyPrinter_lib"},
         'blockly-turtle': {src: modulesPath+"/pemFioi/blocklyTurtle_lib.js", id: "blocklyTurtle_lib"},
         'jwinf_css': {type: "stylesheet", src: modulesPath+"/pemFioi/jwinf.css", id: "jwinf_css"}, // for BWINF

         'quickAlgo_utils': {src: modulesPath+"/pemFioi/quickAlgo/utils.js", id: "quickAlgo_utils"},
         'quickAlgo_i18n': {src: modulesPath+"/pemFioi/quickAlgo/i18n.js", id: "quickAlgo_i18n"},
         'quickAlgo_interface': {src: modulesPath+"/pemFioi/quickAlgo/interface-mobileFirst.js", id: "quickAlgo_interface"},
         'quickAlgo_blockly_blocks': {src: modulesPath+"/pemFioi/quickAlgo/blockly_blocks.js", id: "quickAlgo_blockly_blocks"},
         'quickAlgo_blockly_interface': {src: modulesPath+"/pemFioi/quickAlgo/blockly_interface.js", id: "quickAlgo_blockly_interface"},
         'quickAlgo_blockly_runner': {src: modulesPath+"/pemFioi/quickAlgo/blockly_runner.js", id: "quickAlgo_blockly_runner"},
         'quickAlgo_python_interface': {src: modulesPath+"/pemFioi/quickAlgo/python_interface.js", id: "quickAlgo_python_interface"},
         'quickAlgo_python_runner': {src: modulesPath+"/pemFioi/quickAlgo/python_runner_1.5.js", id: "quickAlgo_python_runner"},
         'quickAlgo_subtask': {src: modulesPath+"/pemFioi/quickAlgo/subtask.js", id: "quickAlgo_subtask"},
         'quickAlgo_context': {src: modulesPath+"/pemFioi/quickAlgo/context.js", id: "quickAlgo_context"},
         //'quickAlgo_css': {type: "stylesheet", src: modulesPath+"/pemFioi/quickAlgo/quickAlgo.css", id: "quickAlgo_css"},
         'quickAlgo_css': {type: "stylesheet", src: modulesPath+"/pemFioi/quickAlgo/quickAlgo-mobileFirst.css", id: "quickAlgo_css"},

         'createAlgoreaInstructions': {src: modulesPath+"/pemFioi/createAlgoreaInstructions.js", id: "createAlgoreaInstructions"},
         'createAlgoreaInstructions-1.0': {src: modulesPath+"/pemFioi/createAlgoreaInstructions-1.0.js", id: "createAlgoreaInstructions"},
         'algoreaInstructionsStrings': {src: modulesPath+"/pemFioi/algoreaInstructionsStrings.js", id: "algoreaInstructionsStrings"},

         'scratch': {src: modulesPath+"/ext/scratch/blockly_compressed_vertical.js", id: "scratch"},
         'scratch_blocks_common': {src: modulesPath+"/ext/scratch/blocks_compressed.js", id: "scratch_blocks_common"},
         'scratch_blocks': {src: modulesPath+"/ext/scratch/blocks_compressed_vertical.js", id: "scratch_blocks"},
         'scratch_fixes': {src: modulesPath+"/ext/scratch/fixes.js", id: "scratch_fixes"},
         'scratch_procedures': {src: modulesPath+"/ext/scratch/procedures.js", id: "scratch_procedures"},

         'react': {src: modulesPath+"/ext/react/react.production.16.13.1.min.js", id: "react"},
         'react_dom': {src: modulesPath+"/ext/react/react-dom.production.16.13.1.min.js", id: "react_dom"},

         'immutable': {src: modulesPath+"/ext/immutable/immutable-3.8.2.min.js", id: "immutable"},

         'python_count': {src: modulesPath+"/pemFioi/pythonCount-1.0.js", id: "python_count"},
         'skulpt_quickAlgo': {src: modulesPath+"ext/skulpt/skulpt.quickAlgo_1.5.min.js", id: "skulpt_quickAlgo"},
         'skulpt_stdlib': {src: modulesPath+"ext/skulpt/skulpt-stdlib.js", id: "skulpt_stdlib"},
         'skulpt_debugger': {src: modulesPath+"ext/skulpt/debugger_1.5.js", id: "skulpt_debugger"},

         'codecast_analysis': {src: modulesPath+"ext/codecast/analysis.js", id: "codecast_analysis"},
         'codecast_python_stack_view_container': {src: modulesPath+"ext/codecast/components/PythonStackViewContainer.js", id: "codecast_python_stack_view_container"},
         'codecast_python_function_header': {src: modulesPath+"ext/codecast/components/PythonFunctionHeader.js", id: "codecast_python_function_header"},
         'codecast_python_function_locals': {src: modulesPath+"ext/codecast/components/PythonFunctionLocals.js", id: "codecast_python_function_locals"},
         'codecast_python_function_view': {src: modulesPath+"ext/codecast/components/PythonFunctionView.js", id: "codecast_python_function_view"},
         'codecast_python_stack_view': {src: modulesPath+"ext/codecast/components/PythonStackView.js", id: "codecast_python_stack_view"},
         'codecast_python_variable': {src: modulesPath+"ext/codecast/components/PythonVariable.js", id: "codecast_python_variable"},
         'codecast_python_variable_value': {src: modulesPath+"ext/codecast/components/PythonVariableValue.js", id: "codecast_python_variable_value"},
         'codecast_css': {type: "stylesheet", src: modulesPath+"/ext/codecast/codecast.css", id: "codecast_css"},

         'codecast7.0_css': {type: "stylesheet", src: modulesPath+"/ext/codecast/7.0/index.css", id: "codecast7.0_css"},
         'codecast7.0_js': {src: modulesPath+"/ext/codecast/7.0/index.js", id: "codecast7.0_js"},
         'codecast7.0_loader': {src: modulesPath+"/ext/codecast/7.0/codecast-loader.js", id: "codecast7.0_loader"},
         'codecast7.1_css': {type: "stylesheet", src: modulesPath+"/ext/codecast/7.1/index.css", id: "codecast7.1_css"},
         'codecast7.1_js': {src: modulesPath+"/ext/codecast/7.1/index.js", id: "codecast7.1_js"},
         'codecast7.1_loader': {src: modulesPath+"/ext/codecast/7.1/codecast-loader.js", id: "codecast7.1_loader"},
         'codecast7.2_css': {type: "stylesheet", src: modulesPath+"/ext/codecast/7.2/index.css", id: "codecast7.2_css"},
         'codecast7.2_js': {src: modulesPath+"/ext/codecast/7.2/index.js", id: "codecast7.2_js"},
         'codecast7.2_loader': {src: modulesPath+"/ext/codecast/7.2/codecast-loader.js", id: "codecast7.2_loader"},
         'codecast7.3_css': {type: "stylesheet", src: modulesPath+"/ext/codecast/7.3/index.css", id: "codecast7.3_css"},
         'codecast7.3_js': {src: modulesPath+"/ext/codecast/7.3/index.js", id: "codecast7.3_js"},
         'codecast7.3_loader': {src: modulesPath+"/ext/codecast/7.3/codecast-loader.js", id: "codecast7.3_loader"},
         'codecast7.4_css': {type: "stylesheet", src: modulesPath+"/ext/codecast/7.4/index.css", id: "codecast7.4_css"},
         'codecast7.4_js': {src: modulesPath+"/ext/codecast/7.4/index.js", id: "codecast7.4_js"},
         'codecast7.4_loader': {src: modulesPath+"/ext/codecast/7.4/codecast-loader.js", id: "codecast7.4_loader"},
         'codecast7.5_css': {type: "stylesheet", src: modulesPath+"/ext/codecast/7.5/index.css", id: "codecast7.5_css"},
         'codecast7.5_js': {src: modulesPath+"/ext/codecast/7.5/index.js", id: "codecast7.5_js"},
         'codecast7.5_loader': {src: modulesPath+"/ext/codecast/7.5/codecast-loader.js", id: "codecast7.5_loader"},

         'blockly_database': {src: modulesPath+"/pemFioi/database/blockly_database.js", id: "blockly_database"},
         'database': {src: modulesPath+"/pemFioi/database/database.js", id: "database"},
         'database_css': {type: "stylesheet", src: modulesPath+"/pemFioi/database/styles.css", id: "database_css"},

         'files_repository': {src: modulesPath+"/pemFioi/shared/files_repository.js", id: "files_repository"},
         'blocks_helper': {src: modulesPath+"/pemFioi/shared/blocks_helper.js", id: "blocks_helper"},
         'numeric_keypad': { src: modulesPath + "/pemFioi/shared/numeric_keypad/keypad.js", id: "numeric_keypad" },
         'numeric_keypad_css': { type: "stylesheet", src: modulesPath + "/pemFioi/shared/numeric_keypad/keypad.css", id: "numeric_keypad_css" },

         // Quiz task
         'quiz_styles': {type: "stylesheet", src: modulesPath+"/pemFioi/quiz/quizStyles-0.1.css", id: "quiz_styles"},
         'quiz': {src: modulesPath+"/pemFioi/quiz/quiz.js", id: "quiz"},
         'quiz_task': {src: modulesPath+"/pemFioi/quiz/task.js", id: "quiz_task"},
         'quiz_grader': {src: modulesPath+"/pemFioi/quiz/grader.js", id: "quiz_grader"},
         'quiz_questions_choice': {src: modulesPath+"/pemFioi/quiz/questions/choice.js", id: "quiz_questions_choice"},
         'quiz_questions_fill_gaps': {src: modulesPath+"/pemFioi/quiz/questions/fill_gaps.js", id: "quiz_questions_fill_gaps"},
         'quiz_questions_input': {src: modulesPath+"/pemFioi/quiz/questions/input.js", id: "quiz_questions_input"},

         // Quiz task v2
         'quiz2_styles': {type: "stylesheet", src: modulesPath+"/pemFioi/quiz2/quizStyles-0.1.css", id: "quiz_styles"},
         'quiz2': {src: modulesPath+"/pemFioi/quiz2/quiz.js", id: "quiz"},
         'quiz2_task': {src: modulesPath+"/pemFioi/quiz2/task.js", id: "quiz_task"},
         'quiz2_grader': {src: modulesPath+"/pemFioi/quiz2/grader.js", id: "quiz_grader"},
         'quiz2_questions_choice': {src: modulesPath+"/pemFioi/quiz2/questions/choice.js", id: "quiz_questions_choice"},
         'quiz2_questions_fill_gaps': {src: modulesPath+"/pemFioi/quiz2/questions/fill_gaps.js", id: "quiz_questions_fill_gaps"},
         'quiz2_questions_input': {src: modulesPath+"/pemFioi/quiz2/questions/input.js", id: "quiz_questions_input"},

         // Video task
         'taskVideo': {src: modulesPath+"/pemFioi/taskVideo/taskVideo.js", id: "taskVideo"},
         'taskVideoPlayer': {src: modulesPath+"/pemFioi/taskVideo/player.js", id: "taskVideoPlayer"},
         'taskVideo_css': {type: "stylesheet", src: modulesPath+"/pemFioi/taskVideo/player.css", id: "taskVideo_css"},

         // Bundles
         'bebras-base': {src: modulesPath+"bundles/bebras-base.js", id: "bundle-bebras-base"},
         'bebras-interface': {src: modulesPath+"bundles/bebras-interface.js", id: "bundle-bebras-interface"},
         'js-interpreter': {src: modulesPath+"bundles/js-interpreter.js", id: "bundle-js-interpreter"},
         'blockly-base': {src: modulesPath+"bundles/blockly-base.js", id: "bundle-blockly-base"},
         'scratch-base': {src: modulesPath+"bundles/scratch-base.js", id: "bundle-scratch-base"},
         'quickAlgo-all-blockly': {src: modulesPath+"bundles/quickAlgo-all-blockly.js", id: "bundle-quickAlgo-all-blockly"},
         'quickAlgo-all-python-1.5': {src: modulesPath+"bundles/quickAlgo-all-python-1.5.js", id: "bundle-quickAlgo-all-python"},
         'python-analysis': {src: modulesPath+"bundles/python-analysis.js", id: "bundle-python-analysis"},

         'blockly-quickpi': { src: modulesPath + "/pemFioi/quickpi/blocklyQuickPi_lib.js", id: "blocklyQuickPi_lib" },
         'quickpi-board': { src: modulesPath + "/pemFioi/quickpi/quickpi_board.js", id: "quickpi_board" },
         'quickpi-connection': { src: modulesPath + "/ext/quickpi/quickpi.js", id: "quickpi_connection" },
         'quickpi-screen': { src: modulesPath + "/pemFioi/quickpi/blocklyQuickPi_screen.js", id: "quickpi-screen" },
         'quickpi-store': { src: modulesPath + "/pemFioi/quickpi/blocklyQuickPi_store.js", id: "quickpi-store" },
         'quickpi-outputgenerator': { src: modulesPath + "/pemFioi/quickpi/blocklyQuickPi_outputGenerator.js", id: "quickpi-outputgenerator" },
      };
   };

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
            'fonts-loader-1.0',
            'numeric_keypad',
            'numeric_keypad_css',
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
            'fonts-loader-1.0',
            'numeric_keypad',
            'numeric_keypad_css',
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
            'fonts-loader-1.0',
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
         {name: 'python-analysis', languages: ['python'], included: ['react', 'react_dom', 'immutable', 'codecast_analysis', 'codecast_python_stack_view_container', 'codecast_python_function_header', 'codecast_python_function_locals', 'codecast_python_function_view', 'codecast_python_stack_view', 'codecast_python_variable', 'codecast_python_variable_value', 'codecast_css']},
         {name: 'codecast-7.0', included: ['codecast7.0_css', 'codecast7.0_js', 'codecast7.0_loader'] },
         {name: 'codecast-7.1', included: ['codecast7.1_css', 'codecast7.1_js', 'codecast7.1_loader']},
         {name: 'codecast-7.2', included: ['codecast7.2_css', 'codecast7.2_js', 'codecast7.2_loader']},
         {name: 'codecast-7.3', included: ['codecast7.3_css', 'codecast7.3_js', 'codecast7.3_loader']},
         {name: 'codecast-7.4', included: ['codecast7.4_css', 'codecast7.4_js', 'codecast7.4_loader']},
         {name: 'codecast-7.5', included: ['codecast7.5_css', 'codecast7.5_js', 'codecast7.5_loader']}
// TODO :: bundles with mobileFirst interface
//      {name: 'quickAlgo-all-blockly', included: ['quickAlgo_utils', 'quickAlgo_i18n', 'quickAlgo_interface', 'quickAlgo_blockly_blocks','quickAlgo_blockly_interface', 'quickAlgo_blockly_runner', 'quickAlgo_subtask', 'quickAlgo_context']},
//      {name: 'quickAlgo-all-python', included: ['python_count', 'ace', 'ace_python', 'skulpt_quickAlgo', 'skulpt_stdlib', 'skulpt_debugger', 'quickAlgo_utils', 'quickAlgo_i18n', 'quickAlgo_interface', 'quickAlgo_python_interface', 'quickAlgo_python_runner', 'quickAlgo_subtask', 'quickAlgo_context']}
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


   function bundlesToModules(modulesList) {
      // Check modulesList for bundles, replace them with their modules

      if(typeof bundledModules == 'function') {
         bundledModules = bundledModules();
      }

      var bundlesByName = {};
      for(var iBundle in bundledModules) {
         var curBundle = bundledModules[iBundle];
         bundlesByName[curBundle.name] = curBundle;
      }

      var newList = [];
      var includedModules = {};
      function addModule(module) {
         if(includedModules[module]) { return; }
         newList.push(module);
         includedModules[module] = true;
      }
      for(var iModule in modulesList) {
         var curModule = modulesList[iModule];
         var bundle = bundlesByName[curModule];

         if(bundle) {
            if (bundle.languages) {
               /**
                * If languages is specified, defer the load when importLanguageModules is called
                * and load those modules only if the language matches.
                */
               for (var languageIdx in bundle.languages) {
                  var language = bundle.languages[languageIdx];
                  for (var iModule in bundle.included) {
                     if (!(language in deferModulesForLanguage)) {
                        deferModulesForLanguage[language] = [];
                     }

                     deferModulesForLanguage[language].push(bundle.included[iModule]);
                  }
               }
            } else {
               for (var iModule in bundle.included) {
                  addModule(bundle.included[iModule]);
               }
            }
         } else {
            addModule(curModule);
         }
      }
      return newList;
   }

   function modulesToBundles(modulesList) {
      // Check modulesList for modules that can be replaced with bundles

      if (typeof bundledModules === 'function') {
         bundledModules = bundledModules();
      }
      if (typeof importableModules === 'function') {
         importableModules = importableModules();
      }

      var bundlesByName = {};
      for(var iBundle in bundledModules) {
         var curBundle = bundledModules[iBundle];
         bundlesByName[curBundle.name] = curBundle;
      }

      /**
       * Checks if the modules requested matches any bundle content.
       * If so, replace those modules with the bundle.
       */

      for (var iBundle in bundledModules) {
         var bundle = bundledModules[iBundle];

         var includedModules = bundle.included;
         var newModulesList = modulesList.slice();
         var bundleNameAddedInList = false;
         var allModulesInBundleIncluded = true;
         for (var iModule in includedModules) {
            var moduleName = includedModules[iModule];

            // Ignore CSS as it cannot be bundled in the bundled javascript.
            if (importableModules[moduleName].type === 'stylesheet') {
               continue;
            }

            var idx = newModulesList.indexOf(moduleName);
            if (idx === -1) {
               allModulesInBundleIncluded = false;
               break;
            }
            if (!bundleNameAddedInList) {
               // Include the name of the bundle to include instead.
               newModulesList.splice(idx, 1, bundle.name);

               bundleNameAddedInList = true;
            } else {
               newModulesList.splice(idx, 1);
            }
         }

         if (allModulesInBundleIncluded) {
            modulesList = newModulesList;
         }
      }

      for (var iModule in modulesList) {
         var moduleName = modulesList[iModule];
         var bundle = bundlesByName[moduleName];

         if (bundle) {
            /**
             * If languages is specified, defer the load when importLanguageModules is called
             * and load those modules only if the language matches.
             */
            if (bundle.languages) {
               for (var languageIdx in bundle.languages) {
                  var language = bundle.languages[languageIdx];
                  if (!(language in deferModulesForLanguage)) {
                     deferModulesForLanguage[language] = [];
                  }

                  deferModulesForLanguage[language].push(bundle.name);
               }

               modulesList.splice(modulesList.indexOf(bundle.name), 1);
            }
         }
      }

      return modulesList;
   }

   /**
    * Gets the HTML to load a module.
    *
    * @param {string} name   The name.
    * @param {Object} module The module.
    */
   function getModuleLoadHtml(name, module) {
      var modClass = module.class ? module.class : 'module';
      var modSrc = module.src;
      if (QueryString.v) {
         // Add v= parameters to the URLs
         modSrc += (modSrc.indexOf('?') > -1 ? '&' : '?') + 'v=' + QueryString.v;
      }

      var modId = module.id ? module.id : name;
      if (module.type === 'stylesheet') {
         return '<link class="'+modClass+'" rel="stylesheet" type="text/css" href="'+modSrc+'" id="'+modId+'">';
      } else {
         return '<script class="'+modClass+'" type="text/javascript" src="'+modSrc+'" id="'+modId+'"></script>';
      }
   }

   function importModules(modulesList) {
      if(typeof importableModules == 'function') {
         importableModules = importableModules();
      }
      if(typeof bundledModules == 'function') {
         bundledModules = bundledModules();
      }

      var bundlesByName = {};
      for(var iBundle in bundledModules) {
         var curBundle = bundledModules[iBundle];
         bundlesByName[curBundle.name] = curBundle;
      }

      // If useBundles is True, we'll try to use bundles instead of the
      // corresponding modules. Otherwise, we do the opposite and translate
      // bundles into a list of modules.
      if(window.useBundles) {
         modulesList = modulesToBundles(modulesList);
      } else {
         modulesList = bundlesToModules(modulesList);
      }

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

            modulesStr += getModuleLoadHtml(moduleName, curModule);

            /**
             * If this is a bundle and if there are any CSS modules inside,
             * load them separately as they cannot be in the bundle JS file.
             */
            var bundle = bundlesByName[moduleName];
            if (bundle) {
               var includedModules = bundle.included;
               for (var iModule in includedModules) {
                  var moduleName = includedModules[iModule];
                  var curModule = importableModules[moduleName];

                  if (curModule.type === 'stylesheet') {
                     modulesStr += getModuleLoadHtml(moduleName, curModule);
                  }
               }
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
      window.modulesLanguage = lang;

      if(typeof languageScripts == 'function') {
         languageScripts = languageScripts();
      };

      if(!languageScripts[lang]) {
         console.error("Language "+lang+" unknown, couldn't load scripts.");
      }

      importModules(languageScripts[lang]);

      // Import the deferred modules for the selected language.
      if (lang in deferModulesForLanguage) {
         importModules(deferModulesForLanguage[lang]);
      }

      if(!window.preprocessingFunctions) { window.preprocessingFunctions = []; }
      var fct = function () { conditionalLanguageElements(lang); };
      window.preprocessingFunctions.push(fct);
      window.addEventListener('DOMContentLoaded', fct);
   }


// make sure mobile devices don't scale things
   function addMetaViewport() {
      var metaViewport = document.createElement('meta');
      metaViewport.name = "viewport";
      metaViewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
      document.getElementsByTagName('head')[0].appendChild(metaViewport);
   }

   addMetaViewport();
   window.importModules = importModules;
   window.conditionalLanguageElements = conditionalLanguageElements;
   window.importLanguageModules = importLanguageModules;

})();
