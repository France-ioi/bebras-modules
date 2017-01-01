var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1));
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var arrayContains = function(array, needle) {
   for (var index in array) {
      if (needle == array[index]) {
         return true;
      }
   }
   return false;
}

var highlightPause = false;

function resetFormElement(e) {
  e.wrap('<form>').closest('form').get(0).reset();
  e.unwrap();

  // Prevent form submission
  //e.stopPropagation();
  //e.preventDefault();
}

var languageStrings = {
   fr: {
      categories: {
         actions: "Actions",
         sensors: "Capteurs",
         debug: "Débuggage",
         colour: "Couleurs",
         dicts: "Dictionnaires",
         input: "Entrées",
         lists: "Listes",
         logic: "Logique",
         loops: "Boucles",
         math: "Maths",
         text: "Texte",
         variables: "Variables",
         functions: "Fonctions"
      },
      invalidContent: "Contenu invalide",
      unknownFileType: "Type de fichier non reconnu",
      download: "télécharger",
      smallestOfTwoNumbers: "Plus petit des deux nombres",
      greatestOfTwoNumbers: "Plus grand des deux nombres",
      programOfRobot: "Programme du robot",
      flagClicked: "Quand %1 cliqué",
      tooManyIterations: "Votre programme met trop de temps à se terminer !",
      submitProgram: "Valider le programme",
      runProgram: "Exécuter sur ce test",
      stopProgram: "Recommencer",
      speed: "Vitesse :",
      slowSpeed: "Lent",
      mediumSpeed: "Moyen",
      fastSpeed: "Rapide",
      ludicrousSpeed: "Très rapide",
      selectLanguage: "Langage :",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Repartir de blockly",
      saveOrLoadProgram: "Enregistrer ou recharger votre programme :",
      avoidReloadingOtherTask: "Attention : ne rechargez pas le programme d'un autre sujet !",
      reloadProgram: "Recharger :",
      saveProgram: "Enregistrer",
      limitBlocks: "{remainingBlocks} blocs restants sur {maxBlocks} autorisés.",
      limitBlocksOver: "{remainingBlocks} blocs en trop utilisés pour {maxBlocks} autorisés."
   },
   en: {
      categories: {
         actions: "Actions",
         sensors: "Sensors",
         debug: "Debug",
         colour: "Colors",
         dicts: "Dictionnaries",
         input: "Input",
         lists: "Lists",
         logic: "Logic",
         loops: "Loops",
         math: "Math",
         text: "Text",
         variables: "Variables",
         functions: "Functions"
      },
      invalidContent: "Invalid content",
      unknownFileType: "Unrecognized file type",
      download: "download",
      smallestOfTwoNumbers: "Smallest of the two numbers",
      greatestOfTwoNumbers: "Greatest of the two numbers",
      programOfRobot: "Robot's program",
      flagClicked: "When %1 clicked",
      tooManyIterations: "Too many iterations before an action!",
      submitProgram: "Validate this program",
      runProgram: "Run this program",
      stopProgram: "Stop",
      speed: "Speed:",
      slowSpeed: "Slow",
      mediumSpeed: "Medium",
      fastSpeed: "Fast",
      ludicrousSpeed: "Very fast",
      selectLanguage: "Language :",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Generate from blockly",
      saveOrLoadProgram: "Save or reload your code:",
      avoidReloadingOtherTask: "Warning: do not reload code for another task!",
      reloadProgram: "Reload:",
      saveProgram: "Save",
      limitBlocks: "{remainingBlocks} blocks remaining out of {maxBlocks} available.",
      limitBlocksOver: "{remainingBlocks} blocks over the limit of {maxBlocks} available."
   },
   de: {
      categories: {
         actions: "Aktionen",
         sensors: "Sensoren",
         debug: "Debug",
         colour: "Farben",
         dicts: "Diktionär",
         input: "Eingabe",
         lists: "Listen",
         logic: "Logik",
         loops: "Schleifen",
         math: "Mathe",
         text: "Texte",
         variables: "Variablen",
         functions: "Funktionen"
      },
      invalidContent: "Ungültiger Inhalt",
      unknownFileType: "Ungültiger Datentyp",
      download: "Herunterladen",
      smallestOfTwoNumbers: "Kleinste von zwei Zahlen",
      greatestOfTwoNumbers: "Größte von zwei Zahlen",
      programOfRobot: "Programm des Roboters",
      flagClicked: "When %1 clicked", // TODO :: translate (scratch start flag, %1 is the flag icon)
      tooManyIterations: "Zu viele Iterationen vor einer Aktion!",
      submitProgram: "Programm überprüfen lassen",
      runProgram: "Programm ausführen",
      stopProgram: "Stop",
      speed: "Ablaufgeschwindigkeit:",
      slowSpeed: "Langsam",
      mediumSpeed: "Mittel",
      fastSpeed: "Schnell",
      ludicrousSpeed: "Sehr schnell",
      selectLanguage: "Sprache:",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Generiere von Blockly-Blöcken",
      saveOrLoadProgram: "Speicher oder lade deinen Quelltext:",
      avoidReloadingOtherTask: "Warnung: Lade keinen Quelltext von einer anderen Aufgabe!",
      reloadProgram: "Laden:",
      saveProgram: "Speichern",
      limitBlocks: "Noch {remainingBlocks} von {maxBlocks} Blöcken verfügbar.",
      limitBlocksOver: "{remainingBlocks} blocks over the limit of {maxBlocks} available." // TODO :: translate
   }
}

// Blockly to Scratch translations
var blocklyToScratch = {
    singleBlocks: {
        'controls_if': 'control_if',
        'controls_if_else': 'control_if_else',
        'controls_repeat': 'control_repeat',
        'controls_repeat_ext': 'control_repeat'
    }
}


// from http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
// where they got it from the stackoverflow-code itself ("formatUnicorn")
if (!String.prototype.format) {
   String.prototype.format = function() {
      var str = this.toString();
      if (!arguments.length)
         return str;
      var args = typeof arguments[0],
          args = (("string" == args || "number" == args) ? arguments : arguments[0]);
      for (var arg in args) {
         str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
      }
      return str;
   }
}


function getBlocklyHelper(maxBlocks, nbTestCases) {
   return {
      scratchMode: (typeof Blockly.Blocks['control_if'] !== 'undefined'),
      textFile: null,
      extended: false,
      programs: [],
      languages: [],
      player: 0,
      workspace: null,
      prevWidth: 0,
      languageStrings: languageStrings,
      startingBlock: true,
      mediaUrl: (window.location.protocol == 'file:' && modulesPath) ? modulesPath+'/img/blockly/' : "http://static3.castor-informatique.fr/contestAssets/blockly/",
      loadHtml: function(nbTestCases) {
         $("#blocklyLibContent").html("<xml id='toolbox' style='display: none'></xml>" +
                                      "  <div style='height: 40px;display:none' id='lang'>" +
                                      "    <p>" + this.strings.selectLanguage +
                                      "      <select id='selectLanguage' onchange='task.displayedSubTask.blocklyHelper.changeLanguage()'>" +
                                      "        <option value='blockly'>" + this.strings.blocklyLanguage + "</option>" +
                                      "        <option value='javascript'>" + this.strings.javascriptLanguage + "</option>" +
                                      "      </select>" +
                                      "      <input type='button' class='language_javascript' value='" + this.strings.importFromBlockly +
                                        "' style='display:none' onclick='task.displayedSubTask.blocklyHelper.importFromBlockly()' />" +
                                      "    </p>" +
                                      "  </div>" +
                                      "  <div id='blocklyCapacity' style='clear:both;'></div>" +
                                      "  <div id='blocklyContainer'>" +
                                      "    <div id='blocklyDiv' class='language_blockly'></div>" +
                                      "    <textarea id='program' class='language_javascript' style='width:100%;height:100%;display:none'></textarea>" +
                                      "  </div>" +
                                      "  <div id='saveOrLoad'> "+
                                      "    <p><b>" + this.strings.saveOrLoadProgram + "</b></p>" +
                                      "    <p>" + this.strings.avoidReloadingOtherTask + "</p>" +
                                      "    <p>" + this.strings.reloadProgram + " <input type='file' id='input' " +
                                        "onchange='task.displayedSubTask.blocklyHelper.handleFiles(this.files);resetFormElement($(\"#input\"))'></p>" +
                                      "    <p><input type='button' value='" + this.strings.saveProgram +
                                        "' onclick='task.displayedSubTask.blocklyHelper.saveProgram()' /><span id='saveUrl'></span></p>" +
                                      "</div>"
         );
        
         var gridButtonsBefore = "";
         if (nbTestCases > 1) {
            gridButtonsBefore += "<div>\n" +
                                 "  <input type='button' value='Précédent' onclick='task.displayedSubTask.changeTest(-1)'/>\n" +
                                 "  <span id='testCaseName'>Test 1</span>\n" +
                                 "  <input type='button' value='Suivant' onclick='task.displayedSubTask.changeTest(1)'/>\n" +
                                 "</div>\n";
         }      
         $("#gridButtonsBefore").html(gridButtonsBefore);
         
         
         var gridButtonsAfter = this.strings.speed +
                                "<select id='selectSpeed' onchange='task.displayedSubTask.changeSpeed()'>\n" + 
                                "  <option value='200'>" + this.strings.slowSpeed + "</option>\n" + 
                                "  <option value='50'>" + this.strings.mediumSpeed + "</option>\n" +
                                "  <option value='5'>" + this.strings.fastSpeed + "</option>\n" +
                                "  <option value='0'>" + this.strings.ludicrousSpeed + "</option>\n" +
                                "</select>&nbsp;&nbsp;" +
                                "<input type='button' value='" + this.strings.stopProgram + "' onclick='task.displayedSubTask.stop()'/><br/><br/>";
         
         if (nbTestCases > 1) {
            gridButtonsAfter += "<input type='button' value='" + this.strings.runProgram + "' onclick='task.displayedSubTask.run()'/>&nbsp;&nbsp;";
         }
         gridButtonsAfter += "<button onclick='task.displayedSubTask.submit()'>"
                             + (this.scratchMode ? "<img src='" + this.mediaUrl + "icons/event_whenflagclicked.svg' height='32px' width='32px' style='vertical-align: middle;'>" : '')
                             + this.strings.submitProgram
                             + "</button><br/>"
                             + "<div id='errors'></div>";
         $("#gridButtonsAfter").html(gridButtonsAfter);
      },
      
      load: function(language, display, nbTestCases, options) {
         if(this.scratchMode) {
            this.fixScratch();
         }
         if (language == undefined) {
            language = "fr";
         }
         if (options == undefined) options = {};
         if (!options.divId) options.divId = 'blocklyDiv';
         this.strings = this.languageStrings[language];
         if (display) {
            this.loadHtml(nbTestCases);
            var xml = this.getToolboxXml();
            var wsConfig = {
               toolbox: "<xml>"+xml+"</xml>",
               sounds: false,
               media: this.mediaUrl
            };
            wsConfig.comments = true;
            wsConfig.scrollbars = true;
            wsConfig.trashcan = true;
            if (maxBlocks != undefined) {
               wsConfig.maxBlocks = maxBlocks;
            }
            if (options.readOnly) {
               wsConfig.readOnly = true;
            }
            if (this.scratchMode) {
               wsConfig.zoom = { startScale: 0.75 };
            }
            this.addExtraBlocks();
            this.workspace = Blockly.inject(options.divId, wsConfig);

            var toolboxNode = $('#toolboxXml');
            if (toolboxNode.length != 0) {
               toolboxNode.html(xml);
            }
            
            Blockly.Trashcan.prototype.MARGIN_SIDE_ = 410;
            $(".blocklyToolboxDiv").css("background-color", "rgba(168, 168, 168, 0.5)");
            var that = this;
            function onchange(event) {
               window.focus();
               Blockly.svgResize(that.workspace);

               var remaining = that.workspace.remainingCapacity();
               optLimitBlocks = {
                  maxBlocks: maxBlocks,
                  remainingBlocks: Math.abs(remaining)
                  };
               var strLimitBlocks = remaining < 0 ? that.strings.limitBlocksOver : that.strings.limitBlocks;
               $('#blocklyCapacity').css('color', remaining < 0 ? 'red' : '');
               $('#blocklyCapacity').html(strLimitBlocks.format(optLimitBlocks));
               
            }
            this.workspace.addChangeListener(onchange);
            onchange();
         } else {
            this.workspace = new Blockly.Workspace();
         }

         this.programs = [];
         for (var iPlayer = this.mainContext.nbRobots - 1; iPlayer >= 0; iPlayer--) {
            this.programs[iPlayer] = {blockly: null, blocklyJS: "", blocklyPython: "", javascript: ""};
            this.languages[iPlayer] = "blockly";
            this.setPlayer(iPlayer);
            if(!options.noRobot) {
               var xml;
               if (this.startingBlock) {
                  if(this.scratchMode) {
                     xml = '<xml><block type="robot_start" deletable="false" movable="false" x="10" y="20"></block></xml>';
                  } else {
                     xml = '<xml><block type="robot_start" deletable="false" movable="false"></block></xml>';
                  }
               }
               else {
                  xml = '<xml></xml>';
               }

               Blockly.Events.recordUndo = false;
               Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), this.workspace);
               Blockly.Events.recordUndo = true;
            }
            this.savePrograms();
         }
      },

      unload: function() {
         //var ws = Blockly.getMainWorkspace('blocklyDiv');
         var ws = this.workspace;
         if (ws != null) {
            ws.dispose();
            // TODO: this should be in a global unload function
            if (false) {
               $(".blocklyWidgetDiv").remove();
               $(".blocklyTooltipDiv").remove();
               document.removeEventListener("keydown", Blockly.onKeyDown_); // TODO: find correct way to remove all event listeners
               delete Blockly;
            }
         }
      },

      setPlayer: function(newPlayer) {
         this.player = newPlayer;
         $("#selectPlayer").val(this.player);
         $(".robot0, .robot1").hide();
         $(".robot" + this.player).show();
      },

      changePlayer: function() {
         this.loadPlayer($("#selectPlayer").val());
      },

      loadPlayer: function(player) {
         this.savePrograms();
         this.player = player;
         for (var iRobot = 0; iRobot < this.mainContext.nbRobots; iRobot++) {
            $(".robot" + iRobot).hide();
         }
         $(".robot" + this.player).show();

         $(".language_blockly, .language_javascript").hide();
         $(".language_" + this.languages[this.player]).show();
         
         var blocklyElems = $(".blocklyToolboxDiv, .blocklyWidgetDiv");
         $("#selectLanguage").val(this.languages[this.player]);
         if (this.languages[this.player] == "blockly") {
            blocklyElems.show();
         } else {
            blocklyElems.hide();
            $(".blocklyTooltipDiv").hide();
         }
         this.loadPrograms();
      },

      getCodeFromXml: function(xmlText, language) {
         try {
           var xml = Blockly.Xml.textToDom(xmlText)
         } catch (e) {
           alert(e);
           return;
         }
         var tmpWorkspace = new Blockly.Workspace();
         Blockly.Xml.domToWorkspace(xml, tmpWorkspace);
         return this.getCode(language, tmpWorkspace);
      },


      getCode: function(language, codeWorkspace) {
         if (codeWorkspace == undefined) {
            codeWorkspace = this.workspace;
         }
         blocks = codeWorkspace.getTopBlocks(true);
         var languageObj = null;
         if (language == "javascript") {
            languageObj = Blockly.JavaScript;
         }
         if (language == "python") {
            languageObj = Blockly.Python;
         }
         languageObj.init(codeWorkspace);

         var code = [];
         var comments = [];
         for (var b = 0; b < blocks.length; b++) {
            var block = blocks[b];
            var blockCode = languageObj.blockToCode(block);
            if (arrayContains(["procedures_defnoreturn", "procedures_defreturn"], block.type)) {
               // For function blocks, the code is stored in languageObj.definitions_
            } else {
               if (block.type == "robot_start" || !this.startingBlock) {
                  comments.push(blockCode);
               }
            }
         }

         for (var def in languageObj.definitions_) {
            code.push(languageObj.definitions_[def]);
         }

         var code = code.join("\n");
         code += comments.join("\n");
         return code;
      },

      savePrograms: function() {
         this.programs[this.player].javascript = $("#program").val();
         if (this.workspace != null) {
            var xml = Blockly.Xml.workspaceToDom(this.workspace);
            this.programs[this.player].blockly = Blockly.Xml.domToText(xml);
            this.programs[this.player].blocklyJS = this.getCode("javascript");
            //this.programs[this.player].blocklyPython = this.getCode("python");
         }
      },

      loadPrograms: function() {
         $("#program").val(this.programs[this.player].javascript);
         if (this.workspace != null) {
            var xml = Blockly.Xml.textToDom(this.programs[this.player].blockly);
            this.workspace.clear();
            Blockly.Xml.domToWorkspace(xml, this.workspace);
         }
      },

      changeLanguage: function() {
         this.languages[this.player] = $("#selectLanguage").val();
         this.loadPlayer(this.player);
      },

      importFromBlockly: function() {
          //var player = $("#selectPlayer").val();
          var player = 0;
          this.programs[player].javascript = this.getCode("javascript");
          $("#program").val(this.programs[player].javascript);
      },

      handleFiles: function(files) {
         var that = this;
         if (files.length < 0) {
            return;
         }
         var file = files[0];
         var textType = /text.*/;
         if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
               var code = reader.result;
               if (code[0] == "<") {
                  try {
                     var xml = Blockly.Xml.textToDom(code);
                     that.programs[that.player].blockly = code;
                  } catch(e) {
                     $("#errors").html(that.strings.invalidContent);
                  }
                  that.languages[that.player] = "blockly";
               } else {
                  that.programs[that.player].javascript = code;
                  that.languages[that.player] = "javascript";
               }
               that.loadPrograms();
               that.loadPlayer(that.player);
            }

            reader.readAsText(file);
         } else {
            $("#errors").html(this.strings.unknownFileType);
         }
      },

      saveProgram: function() {
         this.savePrograms();
         var code = this.programs[this.player][this.languages[this.player]];
         var data = new Blob([code], {type: 'text/plain'});

         // If we are replacing a previously generated file we need to
         // manually revoke the object URL to avoid memory leaks.
         if (this.textFile !== null) {
           window.URL.revokeObjectURL(this.textFile);
         }

         this.textFile = window.URL.createObjectURL(data);

         // returns a URL you can use as a href
         $("#saveUrl").html(" <a href='" + this.textFile + "' download='robot_" + this.languages[this.player] + "_program.txt'>" + this.strings.download + "</a>");
         return this.textFile;
      },

      toggleSize: function() {
         if (!this.extended) {
            this.extended = true;
            $("#blocklyContainer").css("width", "800px");
            $("#extendButton").val("<<");
         } else {
            this.extended = false;
            $("#blocklyContainer").css("width", "500px");
            $("#extendButton").val(">>");
         }
         this.updateSize();
      },

      updateSize: function() {
         var panelWidth = 500;
         if (this.languages[this.player] == "blockly") {
            panelWidth = $("#blocklyDiv").width() - 10;
         } else {
            panelWidth = $("#program").width() + 20;
         }
         if (panelWidth != this.prevWidth) {
            if (this.languages[this.player] == "blockly") {
               Blockly.Trashcan.prototype.MARGIN_SIDE_ = panelWidth - 90;
               Blockly.svgResize(this.workspace);
            }
         }
         this.prevWidth = panelWidth;
      },

      createGenerator: function(label, code, type, nbParams) {
         Blockly.JavaScript[label] = function(block) {
            var params = "";
            for (var iParam = 0; iParam < nbParams; iParam++) {
               if (iParam != 0) {
                  params += ", ";
               }
               params += Blockly.JavaScript.valueToCode(block, 'NAME_' + (iParam + 1), Blockly.JavaScript.ORDER_ATOMIC);
            }
           if (type == 0) {
              return code + "(" + params + ");\n";
           } else if (type == 1){
              return [code + "(" + params + ")", Blockly.JavaScript.ORDER_NONE];
           }
         };
         Blockly.Python[label] = function(block) {
            var params = "";
            for (var iParam = 0; iParam < nbParams; iParam++) {
               if (iParam != 0) {
                  params += ", ";
               }
               params += Blockly.Python.valueToCode(block, 'NAME_' + (iParam + 1), Blockly.Python.ORDER_ATOMIC);
            }
            if (type == 0) {
               return code + "(" + params + ")\n";
            } else if (type == 1) {
               return [code + "(" + params + ")", Blockly.Python.ORDER_NONE];
            }
         };
      },

      completeBlockHandler: function(block, objectName, context) {
         if (typeof block.handler == "undefined") {
            block.handler = context[objectName][block.name];
         }


         if (typeof block.handler == "undefined") {
            block.handler = (function(oName, bName) {
               return function() { console.error("Error: No handler given. No function context." + oName + "." + bName + "() found!" ); }
            })(objectName, block.name);
         }
      },
      completeBlockJson: function(block, objectName, categoryName, context) {
         // Needs context object solely for the language strings. Maybe change that …
         
         if (typeof block.blocklyJson == "undefined") {
            block.blocklyJson =  {};
         }

         // Set block name
         if (typeof block.blocklyJson.type == "undefined") {
            block.blocklyJson.type = block.name;
         }

         // Add connectors (top-bottom or left)
         if (typeof block.blocklyJson.output == "undefined" &&
             typeof block.blocklyJson.previousStatement == "undefined" &&
             typeof block.blocklyJson.nextStatement == "undefined" &&
             !(block.noConnectors)) {
            if (block.yieldsValue) {
               block.blocklyJson.output = null;
               if(this.scratchMode) {
                   block.blocklyJson.outputShape = Blockly.OUTPUT_SHAPE_HEXAGONAL;
                   block.blocklyJson.colour = Blockly.Colours.sensing.primary;
                   block.blocklyJson.colourSecondary = Blockly.Colours.sensing.secondary;
                   block.blocklyJson.colourTertiary = Blockly.Colours.sensing.tertiary;
               }
            }
            else {
               block.blocklyJson.previousStatement = null;
               block.blocklyJson.nextStatement = null;
               if(this.scratchMode) {
                   block.blocklyJson.colour = Blockly.Colours.motion.primary;
                   block.blocklyJson.colourSecondary = Blockly.Colours.motion.secondary;
                   block.blocklyJson.colourTertiary = Blockly.Colours.motion.tertiary;
               }
            }
         }

         // Add parameters
         if (typeof block.blocklyJson.args0 == "undefined" &&
             typeof block.params != "undefined" &&
             block.params.length > 0) {
            block.blocklyJson.args0 = [];
            for (var iParam = 0; iParam < block.params.length; iParam++) {
               var param = {
                  type: "input_value",
                  name: "PARAM_" + iParam
               }
                  
               if (block.params[iParam] != null) {
                  param.check = block.params[iParam]; // Should be a string!
               }
               block.blocklyJson.args0.push(param);
            }
         }

         // Add message string
         if (typeof block.blocklyJson.message0 == "undefined") {
            block.blocklyJson.message0 = context.strings.label[block.name];

            if (typeof block.blocklyJson.message0 == "undefined") {
               block.blocklyJson.message0 = "<translation missing: " + block.name + ">";
            }
            
            if (typeof block.blocklyJson.args0 != "undefined") {
               var iParam = 0;
               for (var iArgs0 in block.blocklyJson.args0) {
                  if (block.blocklyJson.args0[iArgs0].type == "input_value") {
                     iParam += 1;
                     block.blocklyJson.message0 += " %" + iParam;
                  }
               }
            }
         }

         // Tooltip & HelpUrl should always exist, so lets just add empty ones in case they don't exist
         if (typeof block.blocklyJson.tooltip == "undefined") { block.blocklyJson.tooltip = ""; }
         if (typeof block.blocklyJson.helpUrl == "undefined") { block.blocklyJson.helpUrl = ""; } // TODO: Or maybe not?

         // TODO: Load default colours + custom styles
         if (typeof block.blocklyJson.colour == "undefined") {
            if(this.scratchMode) {
               block.blocklyJson.colour
            } else {
               block.blocklyJson.colour = 210;
            }
         }
      }, 
      completeBlockXml: function(block) {
         if (typeof block.blocklyXml == "undefined" || block.blocklyXml == "") {
            block.blocklyXml = "<block type='" + block.name + "'></block>";
         }
      },
      completeCodeGenerators: function(blockInfo, objectName) {
         if (typeof blockInfo.codeGenerators == "undefined") {
            blockInfo.codeGenerators = {};
         }

         // for closure:
         var args0 = blockInfo.blocklyJson.args0;
         var code = this.mainContext.strings.code[blockInfo.name];
         var output = blockInfo.blocklyJson.output;
         
         for (var language in {JavaScript: null, Python: null}) {
            if (typeof blockInfo.codeGenerators[language] == "undefined") {               
               blockInfo.codeGenerators[language] = function(block) {
                  var params = "";               

                  /* There are three kinds of input: value_input, statement_input and dummy_input,
                     We should definitely consider value_input here and not consider dummy_input here.

                     I don't know how statement_input is handled best, so I'll ignore it first -- Robert
                   */
                  var iParam = 0;
                  for (var iArgs0 in args0) {
                     if (args0[iArgs0].type == "input_value") {
                        if (iParam) {
                           params += ", ";
                        }
                        params += Blockly[language].valueToCode(block, 'PARAM_' + iParam, Blockly[language].ORDER_ATOMIC);
                        iParam += 1;
                     }
                  }

                  if (typeof output == "undefined") {                     
                     return code + "(" + params + ");\n";
                  }
                  else {
                     return [code + "(" + params + ")", Blockly[language].ORDER_NONE];
                  }
                  
                  /*if (type == 0) { // TODO: Change
                     return code + "(" + params + ");\n";
                  } else if (type == 1){
                     return [code + "(" + params + ")", Blockly[language].ORDER_NONE];
                  }*/
               }
            }
         }
      },
      applyCodeGenerators: function(block) {
         for (var language in block.codeGenerators) {
            Blockly[language][block.name] = block.codeGenerators[language];
         }
      },

      createBlock: function(block) {
         if (typeof block.blocklyInit == "undefined") {
            var blocklyjson = block.blocklyJson;
            Blockly.Blocks[block.name] = {
               init: function() {
                  this.jsonInit(blocklyjson);
               }
            };
         }
         else if (typeof block.blocklyInit == "function") {
            Blockly.Blocks[block.name] = {
               init: block.blocklyInit()
            };
         }
         else {
            console.err(block.name + ".blocklyInit is defined but not a function");
         }
      },
      
      /*createBlock: function(label, code, type, nbParams) {
         Blockly.Blocks[label] = {
           init: function() {
             this.appendDummyInput()
                 .appendField(code);
             if (type == 0) {
                this.setPreviousStatement(true);
                this.setNextStatement(true);
             }
             if (type == 1) {
                this.setOutput(true);
             }
             this.setInputsInline(true);
             for (var iParam = 0; iParam < nbParams; iParam++) {
                this.appendValueInput("NAME_" + (iParam + 1)).setCheck(null);
             }
             this.setColour(210);
             this.setTooltip('');
             this.setHelpUrl('');
           }
         };
      },*/

      /* createGeneratorsAndBlocks: function(generators) { 
         for (var objectName in generators) {
            for (var iGen = 0; iGen < generators[objectName].length; iGen++) {
               var generator = generators[objectName][iGen];
               var label = objectName + "_" + generator.labelEn + "__";
               var code = generator.codeFr;
               this.createGenerator(label, objectName + "." + code, generator.type, generator.nbParams);
               this.createBlock(label, generator.labelFr, generator.type, generator.nbParams);
            }
         }
      },*/

      createGeneratorsAndBlocks: function() {
         var customGenerators = this.mainContext.customBlocks;
         for (var objectName in customGenerators) {
            for (var categoryName in customGenerators[objectName]) {
               var category =  customGenerators[objectName][categoryName];
               for (var iBlock = 0; iBlock < category.blocks.length; iBlock++) {
                  var block = category.blocks[iBlock];

                  /* TODO: Allow library writers to provide their own JS/Python code instead of just a handler */
                  this.completeBlockHandler(block, objectName, this.mainContext);
                  this.completeBlockJson(block, objectName, category.category, this.mainContext); /* category.category is category name */
                  this.completeBlockXml(block);
                  this.completeCodeGenerators(block, objectName);
                  this.applyCodeGenerators(block);
                  this.createBlock(block);
               }
               // TODO: Anything of this still needs to be done?
               //this.createGenerator(label, objectName + "." + code, generator.type, generator.nbParams);
               //this.createBlock(label, generator.labelFr, generator.type, generator.nbParams);
            }
         }
      },

      getBlocklyLibCode: function(generators) {
         var strCode = "";
         for (var objectName in generators) {
            strCode += "var " + objectName + " = {\n";
            for (var iGen = 0; iGen < generators[objectName].length; iGen++) {
               var generator = generators[objectName][iGen];

               if (generator.nbParams == 0) {
                  strCode += generator.codeFr + ": function() { ";
               } else {
                  strCode += generator.codeFr + ": function(param1) { ";
               }
               if (generator.type == 1) {
                  strCode += "return ";
               }
               if (generator.nbParams == 0) {
                  strCode += objectName + "_" + generator.labelEn + "(); }";
               } else {
                  strCode += objectName + "_" + generator.labelEn + "(param1); }";
               }
               if (iGen < generators[objectName].length - 1) {
                  strCode += ",";
               }
               strCode += "\n";
            }
            strCode += "};\n\n";
         }
         strCode += "Math['max'] = function(a, b) { if (a > b) return a; return b; };\n";
         strCode += "Math['min'] = function(a, b) { if (a > b) return b; return a; };\n";
         return strCode;
      },

      
      getDefaultColours: function() {
         return {
            categories: {
               logic: 210,
               loops: 120,
               math: 230,
               text: 160,
               lists: 260,
               colour: 20,
               variables: 330,
               functions: 290,
               _default: 65,
            },
            blocks: {},
         };
      },
      

      getStdBlocks: function() {
         return this.scratchMode ? this.getStdScratchBlocks() : this.getStdBlocklyBlocks();
      },

      getStdBlocklyBlocks: function() {
         return {
            input: {
               blocks: [
                  { 
                     name: "input_num", 
                     blocklyXml: "<block type='input_num'></block>"
                  },
                  { 
                     name: "input_char", 
                     blocklyXml: "<block type='input_char'></block>"
                  },
                  { 
                     name: "input_word", 
                     blocklyXml: "<block type='input_word'></block>"
                  },
                  { 
                     name: "input_line", 
                     blocklyXml: "<block type='input_line'></block>"
                  }
               ]
            },
            logic: {
               blocks: [
                  {
                     name: "controls_if",
                     blocklyXml: "<block type='controls_if'></block>"
                  },
                  { 
                     name: "controls_if_else",
                     blocklyXml: "<block type='controls_if'><mutation else='1'></mutation></block>"
                  },
                  { 
                     name: "logic_compare", 
                     blocklyXml: "<block type='logic_compare'></block>"
                  },
                  { 
                     name: "logic_operation", 
                     blocklyXml: "<block type='logic_operation'></block>"
                  },
                  { 
                     name: "logic_negate", 
                     blocklyXml: "<block type='logic_negate'></block>"
                  },
                  { 
                     name: "logic_boolean", 
                     blocklyXml: "<block type='logic_boolean'></block>"
                  }
               ]
            },
            loops: {
               blocks: [
                  { 
                     name: "controls_repeat", 
                     blocklyXml: "<block type='controls_repeat'>" +
                                 "</block>"
                  },
                  { 
                     name: "controls_repeat_ext", 
                     blocklyXml: "<block type='controls_repeat_ext'>" +
                                 "  <value name='TIMES'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>10</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  { 
                     name: "controls_whileUntil", 
                     blocklyXml: "<block type='controls_whileUntil'></block>"
                  },
                  { 
                     name: "controls_for", 
                     blocklyXml: "<block type='controls_for'>" +
                                 "  <value name='FROM'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>1</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "  <value name='TO'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>10</field>" +
                                 "     </shadow>" +
                                 "  </value>" +
                                 "  <value name='BY'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>1</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  { 
                     name: "controls_forEach",
                     excludedByDefault: true,
                     blocklyXml: "<block type='controls_forEach'></block>"
                  },
                  { 
                     name: "controls_flow_statements", 
                     blocklyXml: "<block type='controls_flow_statements'></block>"
                  }
               ]
            },
            math: {
               blocks: [
                  { 
                     name: "math_number", 
                     blocklyXml: "<block type='math_number' gap='32'></block>"
                  },
                  {
                     name: "math_arithmetic", 
                     blocklyXml: "<block type='math_arithmetic'></block>"
                  },
                  {
                     name: "math_number_property", 
                     blocklyXml: "<block type='math_number_property'></block>"
                  },
                  {
                     name: "math_change", 
                     blocklyXml: "<block type='math_change'></block>"
                  },
                  {
                     name: "math_round", 
                     blocklyXml: "<block type='math_round'></block>"
                  },
                  {
                     name: "math_extra_single", 
                     blocklyXml: "<block type='math_extra_single'></block>"
                  },
                  {
                     name: "math_extra_double", 
                     blocklyXml: "<block type='math_extra_double'></block>"
                  },
                  {
                     name: "math_modulo", 
                     blocklyXml: "<block type='math_modulo'></block>"
                  }
               ]
            },
            text: {
               blocks: [
                  {
                     name: "text", 
                     blocklyXml: "<block type='text'></block>"
                  },
                  {
                     name: "text_join", 
                     blocklyXml: "<block type='text_join'></block>"
                  },
                  {
                     name: "text_append", 
                     blocklyXml: "<block type='text_append'></block>"
                  },
                  {
                     name: "text_length", 
                     blocklyXml: "<block type='text_length'>" +
                                 "  <value name='VALUE'>" +
                                 "    <shadow type='text'>" +
                                 "      <field name='TEXT'>abc</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "text_isEmpty", 
                     blocklyXml: "<block type='text_isEmpty'>" +
                                 "  <value name='VALUE'>" +
                                 "    <shadow type='text'>" +
                                 "      <field name='TEXT'></field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "text_indexOf", 
                     blocklyXml: "<block type='text_indexOf'>" +
                                 "  <value name='VALUE'>" +
                                 "    <block type='variables_get'>" +
                                 "      <field name='VAR'>{textVariable}</field>" +
                                 "    </block>" +
                                 "  </value>" +
                                 "  <value name='FIND'>" +
                                 "    <shadow type='text'>" +
                                 "      <field name='TEXT'>abc</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "text_charAt", 
                     blocklyXml: "<block type='text_charAt'>" +
                                 "  <value name='VALUE'>" +
                                 "    <block type='variables_get'>" +
                                 "      <field name='VAR'>{textVariable}</field>" +
                                 "    </block>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "text_getSubstring", 
                     blocklyXml: "<block type='text_getSubstring'>" +
                                 "  <value name='STRING'>" +
                                 "    <block type='variables_get'>" +
                                 "      <field name='VAR'>{textVariable}</field>" +
                                 "    </block>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "text_changeCase", 
                     blocklyXml: "<block type='text_changeCase'>" +
                                 "  <value name='TEXT'>" +
                                 "    <shadow type='text'>" +
                                 "      <field name='TEXT'>abc</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "text_trim", 
                     blocklyXml: "<block type='text_trim'>" +
                                 "  <value name='TEXT'>" +
                                 "    <shadow type='text'>" +
                                 "      <field name='TEXT'>abc</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "text_print", 
                     blocklyXml: "<block type='text_print'>" +
                                 "  <value name='TEXT'>" +
                                 "    <shadow type='text'>" +
                                 "      <field name='TEXT'>abc</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "text_prompt_ext", 
                     blocklyXml: "<block type='text_prompt_ext'>" +
                                 "  <value name='TEXT'>" +
                                 "    <shadow type='text'>" +
                                 "      <field name='TEXT'>abc</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  }
               ]
            },
            lists: {
               blocks: [
                  {
                     name: "lists_create_with_empty", 
                     blocklyXml: "<block type='lists_create_with'>" +
                                 "  <mutation items='0'></mutation>" +
                                 "</block>"
                  },
                  {
                     name: "lists_create_with", 
                     blocklyXml: "<block type='lists_create_with'></block>"
                  },
                  {
                     name: "lists_repeat", 
                     blocklyXml: "<block type='lists_repeat'>" +
                                 "  <value name='NUM'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>5</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "lists_length", 
                     blocklyXml: "<block type='lists_length'></block>"
                  },
                  {
                     name: "lists_isEmpty", 
                     blocklyXml: "<block type='lists_isEmpty'></block>"
                  },
                  {
                     name: "lists_indexOf", 
                     blocklyXml: "<block type='lists_indexOf'>" +
                                 "  <value name='VALUE'>" +
                                 "    <block type='variables_get'>" +
                                 "      <field name='VAR'>{listVariable}</field>" +
                                 "    </block>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "lists_getIndex", 
                     blocklyXml: "<block type='lists_getIndex'>" +
                                 "  <value name='VALUE'>" +
                                 "    <block type='variables_get'>" +
                                 "      <field name='VAR'>{listVariable}</field>" +
                                 "    </block>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "lists_setIndex", 
                     blocklyXml: "<block type='lists_setIndex'>" +
                                 "  <value name='LIST'>" +
                                 "    <block type='variables_get'>" +
                                 "      <field name='VAR'>{listVariable}</field>" +
                                 "    </block>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "lists_getSublist", 
                     blocklyXml: "<block type='lists_getSublist'>" +
                                 "  <value name='LIST'>" +
                                 "    <block type='variables_get'>" +
                                 "      <field name='VAR'>{listVariable}</field>" +
                                 "    </block>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "lists_sort", 
                     blocklyXml: "<block type='lists_sort'></block>"
                  },
                  {
                     name: "lists_split", 
                     blocklyXml: "<block type='lists_split'>" +
                                 "  <value name='DELIM'>" +
                                 "    <shadow type='text'>" +
                                 "      <field name='TEXT'>,</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "lists_append", 
                     blocklyXml: "<block type='lists_append'></block>"
                  },
               ]
            },
            colour: {
               blocks: [
                  {
                     name: "colour_picker", 
                     blocklyXml: "<block type='colour_picker'></block>"
                  },
                  {
                     name: "colour_random", 
                     blocklyXml: "<block type='colour_random'></block>"
                  },
                  {
                     name: "colour_rgb", 
                     blocklyXml: "<block type='colour_rgb'>" +
                                 "  <value name='RED'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>100</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "  <value name='GREEN'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>50</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "  <value name='BLUE'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>0</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
                  {
                     name: "colour_blend", 
                     blocklyXml: "<block type='colour_blend'>" +
                                 "  <value name='COLOUR1'>" +
                                 "    <shadow type='colour_picker'>" +
                                 "      <field name='COLOUR'>#ff0000</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "  <value name='COLOUR2'>" +
                                 "    <shadow type='colour_picker'>" +
                                 "      <field name='COLOUR'>#3333ff</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "  <value name='RATIO'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>0.5</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  }
               ]
            },
            dicts: {
               blocks: [
                  { 
                     name: "dict_get_literal", 
                     blocklyXml: "<block type='dict_get_literal'></block>"
                  },
                  { 
                     name: "dict_keys", 
                     blocklyXml: "<block type='dict_keys'></block>"
                  },
                  { 
                     name: "dicts_create_with", 
                     blocklyXml: "<block type='dicts_create_with'></block>"
                  }
               ]
            },
            variables: {
               custom: "VARIABLE",
               blocks: []
            },
            functions: {
               custom: "PROCEDURE",
               blocks: []
            }
         };
      },

      getStdScratchBlocks: function() {
         // TODO :: make the list of standard scratch blocks
         return [
            {
               category: "control",
               blocks: [
                  {
                     name: "control_if",
                     blocklyXml: "<block type='control_if'></block>"
                  },
                  { 
                     name: "control_if_else",
                     blocklyXml: "<block type='control_if_else'></block>"
                  },
                  { 
                     name: "control_repeat", 
                     blocklyXml: "<block type='control_repeat'>" +
                                 "  <value name='TIMES'>" +
                                 "    <shadow type='math_number'>" +
                                 "      <field name='NUM'>10</field>" +
                                 "    </shadow>" +
                                 "  </value>" +
                                 "</block>"
                  },
               ]
            }
         ];
      },

      getBlockXmlInfo: function(generatorStruct, blockName) {
         for (var categoryName in generatorStruct) {
            var blocks = generatorStruct[categoryName].blocks;
            for (var iBlock = 0; iBlock < blocks.length; iBlock++) {
               var block = blocks[iBlock];
               if (block.name == blockName) {
                  return {
                     category: categoryName,
                     xml: block.blocklyXml,
                  };
               }
            }
         }

         console.error("Block not found: " + blockName);
         return null;
      },

      addBlocksAndCategories: function(blockNames, blocksDefinition, categoriesInfos) {
         var colours = this.getDefaultColours();
         for (var iBlock = 0; iBlock < blockNames.length; iBlock++) {
            var blockName = blockNames[iBlock];
            var blockXmlInfo = this.getBlockXmlInfo(blocksDefinition, blockName);
            var categoryName = blockXmlInfo.category;

            if (!(categoryName in categoriesInfos)) {
               categoriesInfos[categoryName] = {
                  blocksXml: [],
                  colour: colours.blocks[blockName]
               };
            }            
            categoriesInfos[categoryName].blocksXml.push(blockXmlInfo.xml);
         }
      },

      getToolboxXml: function() {
         var categoriesInfos = {};
         var colours = this.getDefaultColours();

         for (var blockType in this.includeBlocks.generatedBlocks) {
            this.addBlocksAndCategories(this.includeBlocks.generatedBlocks[blockType], this.mainContext.customBlocks[blockType], categoriesInfos);
         }

         var stdBlocks = this.getStdBlocks();

         if (this.includeBlocks.standardBlocks.includeAll) {
            this.includeBlocks.standardBlocks.wholeCategories = ["input", "logic", "loops", "math", "text", "lists", "colour", "dicts", "functions"];
         }
         var wholeCategories = this.includeBlocks.standardBlocks.wholeCategories;
         for (var iCategory = 0; iCategory < wholeCategories.length; iCategory++) {
            var categoryName = wholeCategories[iCategory];
            if (!(categoryName in categoriesInfos)) {
               categoriesInfos[categoryName] = {
                  blocksXml: [],
               };
            }
            var blocks = stdBlocks[categoryName].blocks;
            for (var iBlock = 0; iBlock < blocks.length; iBlock++) {
               categoriesInfos[categoryName].blocksXml.push(blocks[iBlock].blocklyXml);
            }
         }

         this.addBlocksAndCategories(this.includeBlocks.standardBlocks.singleBlocks, stdBlocks, categoriesInfos);


         // Handle variable blocks, which are normally automatically added with
         // the VARIABLES category but can be customized here
         if (((this.includeBlocks.variables != undefined) && (this.includeBlocks.variables.length > 0 ))||
               (this.includeBlocks.variables_get != undefined) ||
               (this.includeBlocks.variables_set != undefined)) {
            var blocksXml = [];

            // block for each availableVariable
            for (var iVar = 0; iVar < this.includeBlocks.variables.length; iVar++) {
               blocksXml.push("<block type='variables_get' editable='false'><field name='VAR'>" + this.includeBlocks.variables[iVar] + "</field></block>");
            }
            // generic modifyable block
            if (this.includeBlocks.variables_get != undefined) {
               blocksXml.push("<block type='variables_get'></block>");
            }

            // same for setting variables
            for (var iVar = 0; iVar < this.includeBlocks.variables.length; iVar++) {
               blocksXml.push("<block type='variables_set' editable='false'><field name='VAR'>" + this.includeBlocks.variables[iVar] + "</field></block>");
            }
            if (this.includeBlocks.variables_set != undefined) {
               blocksXml.push("<block type='variables_set'></block>");
            }
            categoriesInfos["variables"] = {
               blocksXml: blocksXml,
               colour: 330
            }
         }

         var xmlString = "";         
         for (var categoryName in categoriesInfos) {
            var categoryInfo = categoriesInfos[categoryName];
            if (this.includeBlocks.groupByCategory) {
               var colour = categoryInfo.colour;
               if (typeof(colour) == "undefined") {
                  colour = colours.categories[categoryName]
                  if (typeof(colour) == "undefined") {
                     colour = colours.categories._default;
                  }
               }               
               xmlString += "<category "
                        + " name='" + this.strings.categories[categoryName] + "'"
                        + " colour='" + colour + "'"
                        + (this.scratchMode ? " secondaryColour='" + colour + "'" : '')
                        + ">";
            }
            var blocks = categoryInfo.blocksXml;
            for (var iBlock = 0; iBlock < blocks.length; iBlock++) {
               xmlString += blocks[iBlock];
            }
            if (this.includeBlocks.groupByCategory) {
               xmlString += "</category>";
            }
         }
         return xmlString;
      },
      

      addExtraBlocks: function() {
         var that = this;

         Blockly.Blocks['math_extra_single'] = {
           /**
            * Block for advanced math operators with single operand.
            * @this Blockly.Block
            */
           init: function() {
             var OPERATORS =
                 [
                  [Blockly.Msg.MATH_SINGLE_OP_ABSOLUTE, 'ABS'],
                  ['-', 'NEG'],
             ];
             this.setHelpUrl(Blockly.Msg.MATH_SINGLE_HELPURL);
             this.setColour(Blockly.Blocks.math.HUE);
             this.setOutput(true, 'Number');
             this.appendValueInput('NUM')
                 .setCheck('Number')
                 .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
             // Assign 'this' to a variable for use in the tooltip closure below.
             var thisBlock = this;
             this.setTooltip(function() {
               var mode = thisBlock.getFieldValue('OP');
               var TOOLTIPS = {
                 'ABS': Blockly.Msg.MATH_SINGLE_TOOLTIP_ABS,
                 'NEG': Blockly.Msg.MATH_SINGLE_TOOLTIP_NEG
               };
               return TOOLTIPS[mode];
             });
           }
         };

         Blockly.JavaScript['math_extra_single'] = Blockly.JavaScript['math_single'];
         Blockly.Python['math_extra_single'] = Blockly.Python['math_single'];


         Blockly.Blocks['math_extra_double'] = {
           /**
            * Block for advanced math operators with double operand.
            * @this Blockly.Block
            */
           init: function() {
             var OPERATORS =
                 [
                  ['min', 'MIN'],
                  ['max', 'MAX'],
             ];
             this.setColour(Blockly.Blocks.math.HUE);
             this.setInputsInline(true);
             this.setOutput(true, 'Number');
             this.appendDummyInput('OP').appendField(new Blockly.FieldDropdown([["min", "MIN"], ["max", "MAX"], ["", ""]]), "OP");
             this.appendDummyInput().appendField(" entre ");
             this.appendValueInput('A').setCheck('Number');
             this.appendDummyInput().appendField(" et ");
             this.appendValueInput('B').setCheck('Number');
             // Assign 'this' to a variable for use in the tooltip closure below.
             var thisBlock = this;
             this.setTooltip(function() {
               var mode = thisBlock.getFieldValue('OP');
               var TOOLTIPS = {
                 'MIN': that.strings.smallestOfTwoNumbers,
                 'MAX': that.strings.greatestOfTwoNumbers
               };
               return TOOLTIPS[mode];
             });
           }
         };

         Blockly.JavaScript['math_extra_double'] = function(block) {
           // Math operators with double operand.
           var operator = block.getFieldValue('OP');
           var arg1 = Blockly.JavaScript.valueToCode(block, 'A',  Blockly.JavaScript.ORDER_NONE) || '0';
           var arg2 = Blockly.JavaScript.valueToCode(block, 'B',  Blockly.JavaScript.ORDER_NONE) || '0';
           if (operator == 'MIN') {
             var code = "Math.min(" + arg1 + ", " + arg2 + ")";
           }
           if (operator == 'MAX') {
             var code = "Math.max(" + arg1 + ", " + arg2 + ")";
           }
           return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
         };

         Blockly.Python['math_extra_double'] = function(block) {
           // Math operators with double operand.
           var operator = block.getFieldValue('OP');
           var arg1 = Blockly.Python.valueToCode(block, 'A',  Blockly.Python.ORDER_NONE) || '0';
           var arg2 = Blockly.Python.valueToCode(block, 'B',  Blockly.Python.ORDER_NONE) || '0';
           if (operator == 'MIN') {
             var code = "Math.min(" + arg1 + ", " + arg2 + ")";
           }
           if (operator == 'MAX') {
             var code = "Math.max(" + arg1 + ", " + arg2 + ")";
           }
           return [code, Blockly.Python.ORDER_FUNCTION_CALL];
         };


         if(this.scratchMode) {
            Blockly.Blocks['robot_start'] = {
              init: function() {
                this.jsonInit({
                  "id": "event_whenflagclicked",
                  "message0": that.strings.flagClicked,
                  "args0": [
                    {
                      "type": "field_image",
                      "src": Blockly.mainWorkspace.options.pathToMedia + "icons/event_whenflagclicked.svg",
                      "width": 24,
                      "height": 24,
                      "alt": "flag",
                      "flip_rtl": true
                    }
                  ],
                  "inputsInline": true,
                  "nextStatement": null,
                  "category": Blockly.Categories.event,
                  "colour": Blockly.Colours.event.primary,
                  "colourSecondary": Blockly.Colours.event.secondary,
                  "colourTertiary": Blockly.Colours.event.tertiary
                });
              }
            };

         } else {
            var old = Blockly.Blocks.controls_if.init; 
            Blockly.Blocks.controls_if.init = function() {
               old.call(this);  
               this.setMutator(undefined)
            };

            Blockly.Blocks['robot_start'] = {
              init: function() {
                this.appendDummyInput()
                    .appendField(that.strings.programOfRobot);
                this.setNextStatement(true);
                this.setColour(210);
                this.setTooltip('');
                this.deletable_ = false;
                this.editable_ = false;
                this.movable_ = false;
            //    this.setHelpUrl('http://www.example.com/');
              }
            };
         }

         Blockly.JavaScript['robot_start'] = function(block) {
           return "";
         };

         Blockly.Python['robot_start'] = function(block) {
           return "";
         };
      },

      fixScratch: function() {
         // Store the maxBlocks information somehwere, as Scratch ignores it
         Blockly.Workspace.prototype.maxBlocks = function () { return maxBlocks; };

         // Translate requested Blocks from Blockly to Scratch blocks
         // TODO :: full translation
         var newSingleBlocks = [];
         for (var iBlock = 0;  iBlock < this.includeBlocks.standardBlocks.singleBlocks.length; iBlock++) {
            var blockName = this.includeBlocks.standardBlocks.singleBlocks[iBlock];
            if(blocklyToScratch.singleBlocks[blockName]) {
                newSingleBlocks.push(blocklyToScratch.singleBlocks[blockName]);
            } else {
                newSingleBlocks.push(blockName);
            }
         }
         this.includeBlocks.standardBlocks.singleBlocks = newSingleBlocks;
      },

      run: function() {
         var that = this;
         var nbRunning = this.mainContext.runner.nbRunning();
         if (nbRunning > 0) {
            this.mainContext.runner.stop();
            this.mainContext.delayFactory.createTimeout("run" + Math.random(), function() {
               that.run()
            }, 1000);
            return;
         }
         if (this.mainContext.display) {
            Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
            Blockly.JavaScript.addReservedWords('highlightBlock');
         } else {
            Blockly.JavaScript.STATEMENT_PREFIX = '';
         }
         this.savePrograms();
         var codes = [];
         for (var iRobot = 0; iRobot < this.mainContext.nbRobots; iRobot++) {
            var language = this.languages[iRobot];
            if (language == "blockly") {
               language = "blocklyJS";
            }
            codes[iRobot] = this.getFullCode(this.programs[iRobot][language]);
         }
         that.highlightPause = false;
         if(this.scratchMode) {
            if(that.workspace.remainingCapacity() < 0) {
               $('#errors').html('Trop de blocs utilisés !');
               return;
            }
         } else {
            that.workspace.traceOn(true);
            that.workspace.highlightBlock(null);
         }
         this.mainContext.runner.runCodes(codes);
      },

      getFullCode: function(code) {
         return this.getBlocklyLibCode(this.generators) + code + "program_end()";
      }
   }
}


function initBlocklyRunner(context, messageCallback) {
   init(context, [], [], [], false, {});

   function init(context, interpreters, isRunning, toStop, stopPrograms, runner) {
      runner.waitDelay = function(callback, value, delay) {
         if (delay > 0) {
            context.delayFactory.createTimeout("wait" + context.curRobot + "_" + Math.random(), function() {
                  runner.noDelay(callback, value);
               },
               delay
            );
         } else {
            runner.noDelay(callback, value);
         }
      };

      runner.noDelay = function(callback, value) {
         var primitive = undefined;
         if (value != undefined) {
            primitive = interpreters[context.curRobot].createPrimitive(value);
         }
         if (Math.random() < 0.1) {
            context.delayFactory.createTimeout("wait_" + Math.random(), function() {
               callback(primitive);
               runner.runSyncBlock();
            }, 0);
         } else {
            callback(primitive);
            runner.runSyncBlock();
         }
      };

      runner.initInterpreter = function(interpreter, scope) {
         for (var objectName in context.customBlocks) {
            for (var iCategory in context.customBlocks[objectName]) {
               for (var iBlock in context.customBlocks[objectName][iCategory].blocks) {
                  var blockInfo = context.customBlocks[objectName][iCategory].blocks[iBlock];
                  var code = context.strings.code[blockInfo.name];

                  if (typeof(code) == "undefined")
                     code = blockInfo.name;
                  
                  interpreter.setProperty(scope, code, interpreter.createAsyncFunction(blockInfo.handler));
               }
            }            
         }
         
         
         /*for (var objectName in context.generators) {
            for (var iGen = 0; iGen < context.generators[objectName].length; iGen++) {
               var generator = context.generators[objectName][iGen];
               interpreter.setProperty(scope, objectName + "_" + generator.labelEn, interpreter.createAsyncFunction(generator.fct));
            }
         }*/
         interpreter.setProperty(scope, "program_end", interpreter.createAsyncFunction(context.program_end));

         function highlightBlock(id) {
            if (context.display && !context.blocklyHelper.scratchMode) {
               context.blocklyHelper.workspace.highlightBlock(id);
               highlightPause = true;
            }
         }

         // Add an API function for highlighting blocks.
         var wrapper = function(id) {
           id = id ? id.toString() : '';
           return interpreter.createPrimitive(highlightBlock(id));
         };
         interpreter.setProperty(scope, 'highlightBlock', interpreter.createNativeFunction(wrapper));
      };

      runner.stop = function() {
         for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
            if (isRunning[iInterpreter]) {
               toStop[iInterpreter] = true;
            }
         }
         context.reset();
      };

      runner.runSyncBlock = function() {
         var maxIter = 40000;
   /*      if (turn > 90) {
            task.program_end(function() {
               that.stop();
            });
            return;
         }*/
         try {
            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               context.curRobot = iInterpreter;
               if (context.infos.checkEndEveryTurn) {
                  context.infos.checkEndCondition(context, false);
               }
               var interpreter = interpreters[iInterpreter];
               while (context.curSteps[iInterpreter] < maxIter) {
                  if (!interpreter.step() || toStop[iInterpreter]) {
                     isRunning[iInterpreter] = false;;
                     break;
                  }
                  if (interpreter.paused_) {
                     break;
                  }
                  context.curSteps[iInterpreter]++;
               }
               if (context.curSteps[iInterpreter] >= maxIter) {
                  isRunning[iInterpreter] = false;;
                  throw context.blocklyHelper.strings.tooManyIterations;
               }
            }
         } catch (e) {
            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               isRunning[iInterpreter] = false;
            }

            var message = e.toString();
            if ((context.nbTestCases != undefined) && (context.nbTestCases > 1)) {
               if (context.success) {
                  message = context.messagePrefixSuccess + message;
               } else {
                  message = context.messagePrefixFailure + message;
               }
            }
            if (context.success) {
               message = "<span style='color:green;font-weight:bold'>" + message + "</span>"; 
               if (context.linkBack) {
                  //message += "<br/><span onclick='window.parent.backToList()' style='font-weight:bold;cursor:pointer;text-decoration:underline;color:blue'>Retour à la liste des questions</span>";
               }
            }
            messageCallback(message);
         }
      };

      runner.runCodes = function(codes) {
         //this.mainContext.delayFactory.stopAll(); pb: it would top existing graders
         interpreters = [];
         context.programEnded = [];
         context.curSteps = [];
         context.reset();
         for (var iInterpreter = 0; iInterpreter < codes.length; iInterpreter++) {
            context.curSteps[iInterpreter] = 0;
            context.programEnded[iInterpreter] = false;
            interpreters.push(new Interpreter(codes[iInterpreter], runner.initInterpreter));
            isRunning[iInterpreter] = true;
            toStop[iInterpreter] = false;
         }
         runner.runSyncBlock();
      };

      runner.nbRunning = function() {
         var nbRunning = 0;
         for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
            if (isRunning[iInterpreter]) {
               nbRunning++;
            }
         }
         return nbRunning;
      };

      context.runner = runner;
      context.callCallback = runner.noDelay;
      context.programEnded = [];
   }
}



// Merges arrays by values
// (Flat-Copy only)
function mergeIntoArray(into, other) {
   for (var iOther in other) {
      var intoContains = false;

      for (var iInto in into) {
         if (other[iOther] == into[iInto]) {
            intoContains = true;
         }
      }

      if (!intoContains) {
         into.push(other[iOther]);
      }
   }
}

// Merges objects into each other similar to $.extend, but
// merges Arrays differently (see above)
// (Deep-Copy only)
function mergeIntoObject(into, other) {
   for (var property in other) {
      if (other[property] instanceof Array) {
         if (!(into[property] instanceof Array)) {
            into[property] = [];
         }
         mergeIntoArray(into[property], other[property]);
      }
      if (other[property] instanceof Object) {
         if (!(into[property] instanceof Object)) {
            into[property] = {};
         }
         mergeIntoObject(into[property], other[property]);
      }
      into[property] = other[property];
   }
}

/*
{ shared: { field1: X }, easy: { field2: Y } } becomes { field1: X, field2: Y } if the current level is easy
{ shared: [X, Y], easy: [Z] }  becomes [X, Y, Z] if the current level is easy
{ easy: X, medium: Y, hard: Z}  becomes X if the current level is easy
*/

function testLevelSpecific() {
   var tests = [
      {
         in: { field1: "X", field2: "Y" },
         out: { field1: "X", field2: "Y" }
      },
      {
            in: { easy: "X", medium: "Y", hard: "Z"},
            out: "X"
      },
      {
          in: { shared: { field1: "X" }, easy: { field2: "Y" } },
          out: { field1: "X", field2: "Y" }
      },
      {
            in: { shared: ["X", "Y"], easy: ["Z"] },
            out: ["X", "Y", "Z"]
      }
   ];
   for (var iTest = 0; iTest < tests.length; iTest++) {
      var res = extractLevelSpecific(tests[iTest].in, "easy");
      if (JSON.stringify(res) != JSON.stringify(tests[iTest].out)) { // TODO better way to compare two objects
         console.error("Test " + iTest + " failed: returned " + JSON.stringify(res));
      }
   }
}

function extractLevelSpecific(item, level) {
   if ((typeof item != "object") || Array.isArray(item)) {
      return item;
   }
   if (item.shared === undefined) {
      if (item[level] === undefined) {
         var newItem = {};
         for (var prop in item) {
            newItem[prop] = extractLevelSpecific(item[prop], level);
         }
         return newItem;
      }
      return extractLevelSpecific(item[level], level);
   }
   if (Array.isArray(item.shared)) {
      var newItem = [];
      for (var iElem = 0; iElem < item.shared.length; iElem++) {
         newItem.push(extractLevelSpecific(item.shared[iElem], level));
      }
      if (item[level] != undefined) {
         if (!Array.isArray(item[level])) {
            console.error("Incompatible types when merging shared and " + level);
         }
         for (var iElem = 0; iElem < item[level].length; iElem++) {
            newItem.push(extractLevelSpecific(item[level][iElem], level));
         }
      }
      return newItem;
   }
   if (typeof item.shared == "object") {
      var newItem = {};
      for (var prop in item.shared) {
         newItem[prop] = extractLevelSpecific(item.shared[prop], level);
      }
      if (item[level] != undefined) {
         if (typeof item[level] != "object") {
            console.error("Incompatible types when merging shared and " + level);
         }
         for (var prop in item[level]) {
            newItem[prop] = extractLevelSpecific(item[level][prop], level);
         }
      }
      return newItem;
   }
   console.error("Invalid type for shared property");
}


var initBlocklySubTask = function(subTask) {
   if (subTask.data["medium"] == undefined) {
      subTask.load = function(views, callback) {
         subTask.loadLevel("easy");
         callback();
      };
   }


   subTask.loadLevel = function(curLevel) {
      subTask.levelGridInfos = extractLevelSpecific(subTask.gridInfos, curLevel);

      subTask.blocklyHelper = getBlocklyHelper(subTask.levelGridInfos.maxInstructions);
      subTask.answer = null;
      subTask.state = {};
      subTask.iTestCase = 0;

      this.level = curLevel;

      // TODO: fix bebras platform to make this unnecessary
      try {
         $('#question-iframe', window.parent.document).css('width', '100%');
      } catch(e) {
      }
      $('body').addClass('blockly');
      window.focus();

      this.iTestCase = 0;
      this.nbTestCases = subTask.data[curLevel].length;
      if (this.display) {
         var gridHtml = "<center>";
         gridHtml += "<div id='gridButtonsBefore'></div>";
         gridHtml += "<div id='grid'></div>";
         gridHtml += "<div id='gridButtonsAfter'></div>";
         gridHtml += "</center>";
         $("#gridContainer").html(gridHtml)
         if (subTask.levelGridInfos.hideSaveOrLoad) {
            // TODO: do without a timeout
            setTimeout(function() {
            $("#saveOrLoad").hide();
            }, 0);
         }
      }

      this.context = getContext(this.display, subTask.levelGridInfos, curLevel);
      this.context.raphaelFactory = this.raphaelFactory;
      this.context.delayFactory = this.delayFactory;
      this.context.blocklyHelper = this.blocklyHelper;

      this.blocklyHelper.mainContext = this.context;
      this.blocklyHelper.createGeneratorsAndBlocks(); 

      //this.answer = task.getDefaultAnswerObject();
      displayHelper.hideValidateButton = true;
      displayHelper.timeoutMinutes = 30;

      this.blocklyHelper.includeBlocks = extractLevelSpecific(this.context.infos.includeBlocks, curLevel);;
      
      this.blocklyHelper.load(stringsLanguage, this.display, this.data[curLevel].length);

      subTask.changeTest(0);
   };

   subTask.updateScale = function() {
      this.context.updateScale();
      this.blocklyHelper.updateSize();
   };

   var resetScores = function() {
   };

   var updateScores = function() {
   };

   function changeScore(robot, deltaScore) {
      scores[robot] += deltaScore;
      updateScores();
   };

   subTask.unloadLevel = function(callback) {
      this.context.unload();
      this.blocklyHelper.unload();
      callback();
   };

   subTask.unload = subTask.unloadLevel;

   subTask.reset = function() {
      this.context.reset();
   };

   subTask.program_end = function(callback) {
      this.context.program_end(callback);
   };

   var initContextForLevel = function(iTestCase) {
      subTask.iTestCase = iTestCase;
      subTask.context.reset(subTask.data[subTask.level][iTestCase]);
      subTask.context.iTestCase = iTestCase;
      subTask.context.nbTestCases = subTask.nbTestCases;
      var prefix = "Test " + (subTask.iTestCase + 1) + "/" + subTask.nbTestCases + " : ";
      subTask.context.messagePrefixFailure = prefix;
      subTask.context.messagePrefixSuccess = prefix;
      subTask.context.linkBack = false;
   };

   subTask.run = function() {
      initBlocklyRunner(subTask.context, function(message, success) {
         $("#errors").html(message);
      });
      initContextForLevel(subTask.iTestCase);
      subTask.blocklyHelper.run(subTask.context);
   };

   subTask.submit = function() {
      this.context.display = false;
      this.getAnswerObject(); // to fill this.answer;
      this.getGrade(function(result) {
         subTask.context.display = true;
         subTask.changeSpeed();
         initBlocklyRunner(subTask.context, function(message, success) {
            $("#errors").html(message);
            platform.validate("done");
         });
         subTask.changeTest(result.iTestCase - subTask.iTestCase);
         initContextForLevel(result.iTestCase);
         subTask.context.linkBack = true;
         subTask.context.messagePrefixSuccess = "Tous les tests : ";
         subTask.blocklyHelper.run(subTask.context);
      });
   };

   subTask.stop = function() {
      this.context.runner.stop();
   };

   subTask.reloadStateObject = function(stateObj) {
      this.state = stateObj;
//      this.level = state.level;

//      initContextForLevel(this.level);

//      this.context.runner.stop();
   };

   subTask.getDefaultStateObject = function() {
      return { level: "easy" };
   };

   subTask.getStateObject = function() {
      this.state.level = this.level;
      return this.state;
   };

   subTask.changeSpeed =  function() {
      this.context.changeDelay(parseInt($("#selectSpeed").val()));
   };

   subTask.getAnswerObject = function() {
      this.blocklyHelper.savePrograms();

      this.answer = this.blocklyHelper.programs;
      return this.answer;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      if(typeof answerObj === "undefined") {
        this.answer = this.getDefaultAnswerObject();
      } else {
        this.answer = answerObj;
      }
      this.blocklyHelper.programs = this.answer;
      if (this.answer != undefined) {
         this.blocklyHelper.loadPrograms();
      }
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultBlockly;
      if (this.blocklyHelper.startingBlock) {
         defaultBlockly = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" deletable="false" movable="false" x="0" y="0"></block><block type="robot_start" deletable="false" movable="false" x="0" y="0"></block></xml>';
      }
      else {
         defaultBlockly = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>';
      }
      return [{javascript:"", blockly: defaultBlockly, blocklyJS: ""}];
   };

   subTask.changeTest = function(delta) {
      var newTest = subTask.iTestCase + delta;
      if ((newTest >= 0) && (newTest < this.nbTestCases)) {
         initContextForLevel(newTest);
         $("#testCaseName").html("Test " + (newTest + 1) + "/" + this.nbTestCases);
      }
   };

   subTask.getGrade = function(callback) {
      subTask.context.changeDelay(0);
      var code = subTask.blocklyHelper.getCodeFromXml(subTask.answer[0].blockly, "javascript");
      var codes = [subTask.blocklyHelper.getFullCode(code)];
      subTask.iTestCase = 0;
      initBlocklyRunner(subTask.context, function(message, success) {
         subTask.testCaseResults[subTask.iTestCase] = subTask.levelGridInfos.computeGrade(subTask.context, message);
         subTask.iTestCase++;
         if (subTask.iTestCase < subTask.nbTestCases) {
            initContextForLevel(subTask.iTestCase);
            subTask.context.runner.runCodes(codes);
         } else {
            var iWorstTestCase = 0;
            var worstRate = 1;
            for (var iCase = 0; iCase < subTask.nbTestCases; iCase++) {
               if (subTask.testCaseResults[iCase].successRate < worstRate) {
                  worstRate = subTask.testCaseResults[iCase].successRate;
                  iWorstTestCase = iCase;
               }
            }
            subTask.testCaseResults[iWorstTestCase].iTestCase = iWorstTestCase;
            callback(subTask.testCaseResults[iWorstTestCase]);
         }
      });
      subTask.iTestCase = 0;
      subTask.testCaseResults = [];
      initContextForLevel(subTask.iTestCase);
      subTask.context.linkBack = true;
      subTask.context.messagePrefixSuccess = "Tous les tests : ";
      subTask.context.runner.runCodes(codes);
   };
}

// We need to be able to clean all events

if (EventTarget.prototype.addEventListenerBase == undefined) {
   EventTarget.prototype.addEventListenerBase = EventTarget.prototype.addEventListener;
   EventTarget.prototype.addEventListener = function(type, listener)
   {
       if(!this.EventList) { this.EventList = []; }
       this.addEventListenerBase.apply(this, arguments);
       if(!this.EventList[type]) { this.EventList[type] = []; }
       var list = this.EventList[type];
       for(var index = 0; index != list.length; index++)
       {
           if(list[index] === listener) { return; }
       }
       list.push(listener);
   };

   EventTarget.prototype.removeEventListenerBase = EventTarget.prototype.removeEventListener;
   EventTarget.prototype.removeEventListener = function(type, listener)
   {
       if(!this.EventList) { this.EventList = []; }
       if(listener instanceof Function) { this.removeEventListenerBase.apply(this, arguments); }
       if(!this.EventList[type]) { return; }
       var list = this.EventList[type];
       for(var index = 0; index != list.length;)
       {
           var item = list[index];
           if(!listener)
           {
               this.removeEventListenerBase(type, item);
               list.splice(index, 1); continue;
           }
           else if(item === listener)
           {
               list.splice(index, 1); break;
           }
           index++;
       }
       if(list.length == 0) { delete this.EventList[type]; }
   };
}

function removeBlockly() {
   $(".blocklyWidgetDiv").remove();
   $(".blocklyTooltipDiv").remove();
   document.removeEventListener("keydown"); //, Blockly.onKeyDown_); // TODO: find correct way to remove all event listeners
   delete Blockly;
}
