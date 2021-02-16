

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

var localLanguageStrings = {
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
         control: "Contrôles",
         operator: "Opérateurs",
         math: "Maths",
         texts: "Texte",
         variables: "Variables",
         functions: "Fonctions",
         read: "Lecture",
         print: "Écriture",
         turtle: "Tortue"
      },
      invalidContent: "Contenu invalide",
      unknownFileType: "Type de fichier non reconnu",
      download: "télécharger",
      smallestOfTwoNumbers: "Plus petit des deux nombres",
      greatestOfTwoNumbers: "Plus grand des deux nombres",
      flagClicked: "Quand %1 cliqué",
      tooManyIterations: "Votre programme met trop de temps à se terminer !",
      tooManyIterationsWithoutAction: "Votre programme s'est exécuté trop longtemps sans effectuer d'action !",
      submitProgram: "Valider le programme",
      runProgram: "Exécuter sur ce test",
      stopProgram: "|<",
      speed: "Vitesse :",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Repartir du début",
      stepProgramDesc: "Exécution pas-à-pas",
      slowSpeedDesc: "Exécuter sur ce test",
      mediumSpeedDesc: "Vitesse moyenne",
      fastSpeedDesc: "Vitesse rapide",
      ludicrousSpeedDesc: "Vitesse très rapide",
      selectLanguage: "Langage :",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Repartir de blockly",
      saveOrLoadProgram: "Enregistrer ou recharger votre programme :",
      avoidReloadingOtherTask: "Attention : ne rechargez pas le programme d'un autre sujet !",
      files: "Fichiers",
      reloadProgram: "Recharger :",
      saveProgram: "Enregistrer",
      limitBlocks: "{remainingBlocks} blocs restants sur {maxBlocks} autorisés.",
      limitBlocksOver: "{remainingBlocks} blocs en trop utilisés pour {maxBlocks} autorisés.",
      previousTestcase: "Précédent",
      nextTestcase: "Suivant",
      allTests: "Tous les tests : ",
      errorEmptyProgram: "Le programme est vide ! Connectez des blocs.",
      tooManyBlocks: "Vous utilisez trop de blocs !",
      uninitializedVar: "Variable non initialisée :",
      valueTrue: 'vrai',
      valueFalse: 'faux',
      correctAnswer: 'Réponse correcte',
      partialAnswer: 'Réponse améliorable',
      wrongAnswer: 'Réponse incorrecte',
      resultsNoSuccess: "Vous n'avez validé aucun test.",
      resultsPartialSuccess: "Vous avez validé seulement {nbSuccess} test(s) sur {nbTests}.",
      gradingInProgress: "Évaluation en cours",
      textVariable: "texte",
      listVariable: "liste"
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
         control: "Contrôles",
         operator: "Opérateurs",
         math: "Math",
         texts: "Text",
         variables: "Variables",
         functions: "Functions",
         read: "Reading",
         print: "Writing",
         turtle: "Turtle"
      },
      invalidContent: "Invalid content",
      unknownFileType: "Unrecognized file type",
      download: "download",
      smallestOfTwoNumbers: "Smallest of the two numbers",
      greatestOfTwoNumbers: "Greatest of the two numbers",
      flagClicked: "When %1 clicked",
      tooManyIterations: "Too many iterations!",
      tooManyIterationsWithoutAction: "Too many iterations without action!",
      submitProgram: "Validate this program",
      runProgram: "Run this program",
      stopProgram: "|<",
      speed: "Speed:",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Restart from the beginning",
      stepProgramDesc: "Step-by-step execution",
      slowSpeedDesc: "Execute on this test",
      mediumSpeedDesc: "Average speed",
      fastSpeedDesc: "Fast speed",
      ludicrousSpeedDesc: "Ludicrous speed",
      selectLanguage: "Language :",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Generate from blockly",
      saveOrLoadProgram: "Save or reload your code:",
      avoidReloadingOtherTask: "Warning: do not reload code for another task!",
      reloadProgram: "Reload:",
      saveProgram: "Save",
      limitBlocks: "{remainingBlocks} blocks remaining out of {maxBlocks} available.",
      limitBlocksOver: "{remainingBlocks} blocks over the limit of {maxBlocks} available.",
      previousTestcase: "Previous",
      nextTestcase: "Next",
      allTests: "All tests: ",
      errorEmptyProgram: "Le programme est vide ! Connectez des blocs.",
      tooManyBlocks: "You use too many blocks!",
      uninitializedVar: "Uninitialized variable:",
      valueTrue: 'true',
      valueFalse: 'false',
      correctAnswer: 'Correct answer',
      partialAnswer: 'Partial answer',
      wrongAnswer: 'Wrong answer',
      resultsNoSuccess: "You passed none of the tests.",
      resultsPartialSuccess: "You passed only {nbSuccess} test(s) of {nbTests}.",
      gradingInProgress: "Grading in process",
      textVariable: "text",
      listVariable: "list"
   },
   de: {
      categories: {
         actions: "Aktionen",
         sensors: "Sensoren",
         debug: "Debug",
         colour: "Farben",
         dicts: "Hash-Map",
         input: "Eingabe",
         lists: "Listen",
         logic: "Logik",
         loops: "Schleifen",
         control: "Contrôles",
         operator: "Opérateurs",
         math: "Mathe",
         texts: "Text",
         variables: "Variablen",
         functions: "Funktionen",
         read: "Einlesen",
         print: "Ausgeben",
         turtle: "Turtle"
      },
      invalidContent: "Ungültiger Inhalt",
      unknownFileType: "Ungültiger Datentyp",
      download: "Herunterladen",
      smallestOfTwoNumbers: "Kleinere von zwei Zahlen",
      greatestOfTwoNumbers: "Größere von zwei Zahlen",
      flagClicked: "Sobald %1 geklickt", // (scratch start flag, %1 is the flag icon)
      tooManyIterations: "Zu viele Anweisungen wurden ausgeführt!",
      tooManyIterationsWithoutAction: "Zu viele Anweisungen wurden ausgeführt ohne eine Aktion!",
      submitProgram: "Ausführen",
      runProgram: "Testen",
      stopProgram: "|<",
      speed: "Ablaufgeschwindigkeit:",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Von vorne anfangen", // TODO :: translate and next 5
      stepProgramDesc: "Schritt für Schritt",
      slowSpeedDesc: "Für diesen Test ausführen",
      mediumSpeedDesc: "Mittlere Geschwindigkeit",
      fastSpeedDesc: "Schnell",
      ludicrousSpeedDesc: "Sehr schnell",
      selectLanguage: "Sprache:",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Generiere von Blockly-Blöcken",
      saveOrLoadProgram: "Speicher oder lade deinen Quelltext:",
      avoidReloadingOtherTask: "Warnung: Lade keinen Quelltext von einer anderen Aufgabe!",
      files: "Dateien",
      reloadProgram: "Laden:",
      saveProgram: "Speichern",
      limitBlocks: "Noch {remainingBlocks} von {maxBlocks} Bausteinen verfügbar.",
      limitBlocksOver: "{remainingBlocks} Bausteine zusätzlich zum Limit von {maxBlocks} verbraucht.", // TODO :: stimmt das?
      previousTestcase: " < ",
      nextTestcase: " > ",
      allTests: "Alle Testfälle: ",
      errorEmptyProgram: "Das Programm enthält keine Befehle. Verbinde die Blöcke um ein Programm zu schreiben.",
      emptyProgram: "Das Programm enthält keine Befehle. Verbinde die Blöcke um ein Programm zu schreiben.", // TODO :: translate this one and next 9
      tooManyBlocks: "Du benutzt zu viele Bausteine!",
      uninitializedVar: "Nicht initialisierte Variable:",
      valueTrue: 'wahr',
      valueFalse: 'unwahr',
      correctAnswer: 'Richtige Antwort',
      partialAnswer: 'Teilweise richtige Antwort',
      wrongAnswer: 'Falsche Antwort',
      resultsNoSuccess: "Du hast keinen Testfall richtig.",
      resultsPartialSuccess: "Du hast {nbSuccess} von {nbTests} Testfällen richtig.",
      gradingInProgress: "Das Ergebnis wird ausgewertet …",
      textVariable: "Text",
      listVariable: "Liste"
   },
   sl: {
      categories: {
         actions: "Dejanja",
         sensors: "Senzorji",
         debug: "Razhroščevanje",
         colour: "Barve",
         dicts: "Slovarji",
         input: "Vnos",
         lists: "Tabele",
         logic: "Logika",
         loops: "Zanke",
         control: "Nadzor",
         operator: "Operatorji",
         math: "Matematika",
         texts: "Besedilo",
         variables: "Spremenljivke",
         functions: "Funkcije",
         read: "Branje",
         print: "Pisanje",
         turtle: "Želva"
      },
      invalidContent: "Neveljavna vsebina",
      unknownFileType: "Neznana vrsta datoteke",
      download: "prenos",
      smallestOfTwoNumbers: "Manjše od dveh števil",
      greatestOfTwoNumbers: "Večje od dveh števil",
      flagClicked: "Ko je kliknjena %1",
      tooManyIterations: "Preveč ponovitev!",
      tooManyIterationsWithoutAction: "Preveč ponovitev brez dejanja!",
      submitProgram: "Oddaj program",
      runProgram: "Poženi program",
      stopProgram: "|<",
      speed: "Hitrost:",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Začni znova",
      stepProgramDesc: "Izvajanje po korakih",
      slowSpeedDesc: "Počasi",
      mediumSpeedDesc: "Običajno hitro",
      fastSpeedDesc: "Hitro",
      ludicrousSpeedDesc: "Nesmiselno hitro",
      selectLanguage: "Jezik:",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Ustvari iz Blocklyja",
      saveOrLoadProgram: "Shrani ali znova naloži kodo:",
      avoidReloadingOtherTask: "Opozorilo: Za drugo nalogo ne naloži kode znova!",
      reloadProgram: "Znova naloži:",
      saveProgram: "Shrani",
      limitBlocks: "{remainingBlocks} kock izmed {maxBlocks} imaš še na voljo.",
      limitBlocksOver: "{remainingBlocks} kock preko meje {maxBlocks} kock, ki so na voljo.",
      previousTestcase: "Nazaj",
      nextTestcase: "Naprej",
      allTests: "Vsi testi: ",
      errorEmptyProgram: "Program je prazen! Poveži kocke.",
      tooManyBlocks: "Uporabljaš preveč kock!",
      uninitializedVar: "Spremenljivka ni določena:",
      valueTrue: 'resnično',
      valueFalse: 'neresnično',
      correctAnswer: 'Pravilni odgovor',
      partialAnswer: 'Delni odgovor',
      wrongAnswer: 'Napačen odgovor',
      resultsNoSuccess: "Noben test ni bil opravljen.",
      resultsPartialSuccess: "Opravljen(ih) {nbSuccess} test(ov) od {nbTests}.",
      gradingInProgress: "Ocenjevanje poteka",
      textVariable: "besedilo",
      listVariable: "tabela"
   },
   es: {
      categories: {
         actions: "Acciones",
         sensors: "Sensores",
         debug: "Depurar",
         colour: "Colores",
         dicts: "Diccionarios",
         input: "Entradas",
         lists: "Listas",
         logic: "Logica",
         loops: "Bucles",
         control: "Control",
         operator: "Operadores",
         math: "Matemáticas",
         texts: "Texto",
         variables: "Variables",
         functions: "Funciones",
         read: "Leyendo",
         print: "Escribiendo",
         turtle: "Tortuga"
      },
      invalidContent: "Contenido inválido",
      unknownFileType: "Tipo de archivo no reconocido",
      download: "descargar",
      smallestOfTwoNumbers: "El más pequeño de los dos números",
      greatestOfTwoNumbers: "El mas grande de los dos numeros",
      flagClicked: "Al hace clic en %1",
      tooManyIterations: "¡Demasiadas iteraciones!",
      tooManyIterationsWithoutAction: "¡Demasiadas iteraciones sin una acción!",
      submitProgram: "Validar este programa",
      runProgram: "Ejecutar este programa",
      stopProgram: "|<",
      speed: "Velocidad:",
      stepProgram: "|>",
      slowSpeed: ">",
      mediumSpeed: ">>",
      fastSpeed: ">>>",
      ludicrousSpeed: ">|",
      stopProgramDesc: "Reiniciar desde el principio",
      stepProgramDesc: "Ejecución paso a paso",
      slowSpeedDesc: "Ejecutar en esta prueba",
      mediumSpeedDesc: "Velocidad media",
      fastSpeedDesc: "Velocidad rápido",
      ludicrousSpeedDesc: "Velocidad ridícula",
      selectLanguage: "Lenguaje :",
      blocklyLanguage: "Blockly",
      javascriptLanguage: "Javascript",
      importFromBlockly: "Generar desde blockly",
      saveOrLoadProgram: "Guarda o recarga tu código:",
      avoidReloadingOtherTask: "!Advertencia: no recargue el código para otra tarea!",
      reloadProgram: "Recarga:",
      saveProgram: "Guardar",
      limitBlocks: "{remainingBlocks} bloques restantes de {maxBlocks} disponible.",
      limitBlocksOver: "{remainingBlocks} bloques por encima del limite de {maxBlocks} disponibles.",
      previousTestcase: "Previo",
      nextTestcase: "Siguiente",
      allTests: "Todas las pruebas: ",
      errorEmptyProgram: "¡El programa está vacío! Conecte algunos bloques.",
      tooManyBlocks: "¡Usaste demasiados bloques!",
      uninitializedVar: "Variable no inicializada:",
      valueTrue: 'verdadero',
      valueFalse: 'false',
      correctAnswer: 'Respuesta correcta',
      partialAnswer: 'Respuesta parcial',
      wrongAnswer: 'Respuesta incorrecta',
      resultsNoSuccess: "No aprobaste ninguna de las pruebas.",
      resultsPartialSuccess: "Aprobaste solo {nbSuccess} prueba(s) de {nbTests}.",
      gradingInProgress: "Calificación en proceso",
      textVariable: "texto",
      listVariable: "lista"
   },
};

// Blockly to Scratch translations
var blocklyToScratch = {
   singleBlocks: {
      'controls_if': ['control_if'],
      'controls_if_else': ['control_if_else'],
      'controls_repeat': ['control_repeat'],
      'controls_repeat_ext': ['control_repeat'],
      'controls_whileUntil': ['control_repeat_until'],
      'controls_untilWhile': ['control_repeat_until'],
      'logic_negate': ['operator_not'],
      'logic_boolean': [],
      'logic_compare': ['operator_equals', 'operator_gt', 'operator_lt'],
      'logic_operation': ['operator_and', 'operator_or'],
      'text_join': ['operator_join'],
      'math_arithmetic': ['operator_add', 'operator_subtract', 'operator_multiply', 'operator_divide'],
      'math_number': []
    }
};


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


function showModal(id) {
   var el = '#' + id
   $(el).show();
}
function closeModal(id) {
   var el = '#' + id;
   $(el).hide();
}

function getBlocklyHelper(maxBlocks, nbTestCases) {
   return {
      scratchMode: (typeof Blockly.Blocks['control_if'] !== 'undefined'),
      textFile: null,
      extended: false,
      programs: [],
      languages: [],
      definitions: {},
      simpleGenerators: {},
      player: 0,
      workspace: null,
      prevWidth: 0,
      trashInToolbox: false,
      languageStrings: window.LanguageStrings,
      startingBlock: true,
      mediaUrl: (window.location.protocol == 'file:' && modulesPath) ? modulesPath+'/img/blockly/' : "http://static3.castor-informatique.fr/contestAssets/blockly/",

      glowingBlock: null,

      includeBlocks: {
         groupByCategory: true,
         generatedBlocks: {},
         standardBlocks: {
            includeAll: true,
            wholeCategories: [],
            singleBlocks: []
         }
      },

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
                                      "  <div id='saveOrLoadModal' class='modalWrapper'></div>\n");

         var saveOrLoadModal = "<div class='modal'>" +
                               "    <p><b>" + this.strings.saveOrLoadProgram + "</b></p>\n" +
                               "    <button type='button' class='btn' onclick='task.displayedSubTask.blocklyHelper.saveProgram()' >" + this.strings.saveProgram +
                               "</button><span id='saveUrl'></span>\n" +
                               "    <p>" + this.strings.avoidReloadingOtherTask + "</p>\n" +
                               "    <p>" + this.strings.reloadProgram + " <input type='file' id='input' " +
                               "onchange='task.displayedSubTask.blocklyHelper.handleFiles(this.files);resetFormElement($(\"#input\"))'></p>\n" +
                               "    <button type='button' class='btn close' onclick='closeModal(`saveOrLoadModal`)' >x</button>"
                               "</div>";
         $("#saveOrLoadModal").html(saveOrLoadModal);


         // Buttons from buttonsAndMessages
         var addTaskHTML = '<div id="displayHelperAnswering" class="contentCentered" style="width: 438px; padding: 1px;">';
         var placementNames = ['graderMessage', 'validate', 'saved'];
         for (var iPlacement = 0; iPlacement < placementNames.length; iPlacement++) {
            var placement = 'displayHelper_' + placementNames[iPlacement];
            if ($('#' + placement).length === 0) {
               addTaskHTML += '<div id="' + placement + '"></div>';
            }
         }
         addTaskHTML += '</div>';
         if(!$('#displayHelper_cancel').length) {
            $('body').append($('<div class="contentCentered" style="margin-top: 15px;"><div id="displayHelper_cancel"></div></div>'));
         }

         var gridButtonsAfter = '';
         gridButtonsAfter += "<div id='testSelector' style='width: 420px;'></div>"
                           + "<button type='button' class='btn btn-primary' onclick='task.displayedSubTask.submit()'>"
                           + (this.scratchMode ? "<img src='" + this.mediaUrl + "icons/event_whenflagclicked.svg' height='32px' width='32px' style='vertical-align: middle;'>" : '')
                           + this.strings.submitProgram
                           + "</button><br/>"
                           + "<div id='errors' style='width: 400px;'></div>"
                           + addTaskHTML;
         $("#gridButtonsAfter").html(gridButtonsAfter);
      },

      load: function(language, display, nbTestCases, options) {
         if(this.scratchMode) {
            this.fixScratch();
         }

         if (options == undefined) options = {};
         if (!options.divId) options.divId = 'blocklyDiv';

         window.stringsLanguage = window.stringsLanguage || "fr";
         window.languageStrings = window.languageStrings || {};

         if (typeof window.languageStrings != "object") {
            console.error("window.languageStrings is not an object");
         }
         else { // merge translations
            $.extend(true, window.languageStrings, localLanguageStrings[window.stringsLanguage]);
         }
         this.strings = window.languageStrings;

         if (display) {
            this.loadHtml(nbTestCases);
            this.addExtraBlocks();
            this.createSimpleGeneratorsAndBlocks();
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
            if(this.trashInToolbox) {
               Blockly.Trashcan.prototype.MARGIN_SIDE_ = $('#blocklyDiv').width() - 110;
            }
            this.workspace = Blockly.inject(options.divId, wsConfig);

            var toolboxNode = $('#toolboxXml');
            if (toolboxNode.length != 0) {
               toolboxNode.html(xml);
            }

            $(".blocklyToolboxDiv").css("background-color", "rgba(168, 168, 168, 0.5)");
            var that = this;
            function onchange(event) {
               Blockly.svgResize(that.workspace);

               var remaining = that.workspace.remainingCapacity();
               var optLimitBlocks = {
                  maxBlocks: maxBlocks,
                  remainingBlocks: Math.abs(remaining)
               };
               var strLimitBlocks = remaining < 0 ? that.strings.limitBlocksOver : that.strings.limitBlocks;
               $('#blocklyCapacity').css('color', remaining < 0 ? 'red' : '');
               $('#blocklyCapacity').html(strLimitBlocks.format(optLimitBlocks));

               // TODO :: put into a resetDisplay function, find other elements to reset
               var newBlockly = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(that.workspace));
               if(that.programs[that.player] && newBlockly != that.programs[that.player].blockly) {
                  // only reset when program changed
                  if(that.scratchMode) {
                     that.glowBlock(null);
                  }

                  that.resetTestScores(nbTestCases);
               }
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
            if(this.startingBlock) {
               var xml = this.getDefaultBlocklyContent();

               Blockly.Events.recordUndo = false;
               Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), this.workspace);
               Blockly.Events.recordUndo = true;
            }
            this.savePrograms();
         }
      },

      initTestSelector: function (nbTestCases) {
         var buttons = [
            {cls: 'speedStop', label: this.strings.stopProgram, tooltip: this.strings.stopProgramDesc, onclick: 'task.displayedSubTask.stop()'},
            {cls: 'speedStep', label: this.strings.stepProgram, tooltip: this.strings.stepProgramDesc, onclick: 'task.displayedSubTask.step()'},
            {cls: 'speedSlow', label: this.strings.slowSpeed, tooltip: this.strings.slowSpeedDesc, onclick: 'task.displayedSubTask.changeSpeed(200)'},
            {cls: 'speedMedium', label: this.strings.mediumSpeed, tooltip: this.strings.mediumSpeedDesc, onclick: 'task.displayedSubTask.changeSpeed(50)'},
            {cls: 'speedFast', label: this.strings.fastSpeed, tooltip: this.strings.fastSpeedDesc, onclick: 'task.displayedSubTask.changeSpeed(5)'},
            {cls: 'speedLudicrous', label: this.strings.ludicrousSpeed, tooltip: this.strings.ludicrousSpeedDesc, onclick: 'task.displayedSubTask.changeSpeed(0)'}
         ];

         var selectSpeed = "<div class='selectSpeed'>" +
                           "  <div class='btn-group'>\n";
         for(var btnIdx = 0; btnIdx < buttons.length; btnIdx++) {
            var btn = buttons[btnIdx];
            selectSpeed += "    <button type='button' class='"+btn.cls+" btn btn-default btn-icon'>"+btn.label+" </button>\n";
         }
         selectSpeed += "  </div></div>";

         var html = '<div class="panel-group">';
         for(var iTest=0; iTest<nbTestCases; iTest++) {
            html += '<div id="testPanel'+iTest+'" class="panel panel-default">'
                 +  '  <div class="panel-heading" onclick="task.displayedSubTask.changeTestTo('+iTest+')"><h4 class="panel-title"></h4></div>'
                 +  '  <div class="panel-body">'
                  + selectSpeed
                 +  '  </div>'
                 +  '</div>';
         }
         $('#testSelector').html(html);

         var selectSpeedClickHandler = function () {
            var thisBtn = $(this);
            for(var btnIdx = 0; btnIdx < buttons.length; btnIdx++) {
               var btnInfo = buttons[btnIdx];
               if(thisBtn.hasClass(btnInfo.cls)) {
                  $('#errors').html(btnInfo.tooltip);
                  eval(btnInfo.onclick);
                  break;
               }
            }
         }
         var selectSpeedHoverHandler = function () {
            var thisBtn = $(this);
            for(var btnIdx = 0; btnIdx < buttons.length; btnIdx++) {
               var btnInfo = buttons[btnIdx];
               if(thisBtn.hasClass(btnInfo.cls)) {
                  $('#errors').html(btnInfo.tooltip);
                  break;
               }
            }
         };
         var selectSpeedHoverClear = function () {
            // Only clear #errors if the tooltip was for this button
            var thisBtn = $(this);
            for(var btnIdx = 0; btnIdx < buttons.length; btnIdx++) {
               var btnInfo = buttons[btnIdx];
               if(thisBtn.hasClass(btnInfo.cls)) {
                  if($('#errors').html() == btnInfo.tooltip) {
                     $('#errors').html('');
                  }
                  break;
               }
            }
         };

         // TODO :: better display functions for #errors
         $('.selectSpeed button').click(selectSpeedClickHandler);
         $('.selectSpeed button').hover(selectSpeedHoverHandler, selectSpeedHoverClear);


         this.updateTestSelector(0);
         this.resetTestScores(nbTestCases);
      },

      updateTestScores: function (testScores) {
         // Display test results
         for(var iTest=0; iTest<testScores.length; iTest++) {
            if(testScores[iTest].successRate >= 1) {
               var icon = '<span class="testResultIcon" style="color: green">✔</span>';
               var label = '<span class="testResult testSuccess">'+this.strings.correctAnswer+'</span>';
            } else if(testScores[iTest].successRate > 0) {
               var icon = '<span class="testResultIcon" style="color: orange">✖</span>';
               var label = '<span class="testResult testPartial">'+this.strings.partialAnswer+'</span>';
            } else {
               var icon = '<span class="testResultIcon" style="color: red">✖</span>';
               var label = '<span class="testResult testFailure">'+this.strings.wrongAnswer+'</span>';
            }
            $('#testPanel'+iTest+' .panel-title').html(icon+' Test '+(iTest+1)+' '+label);
         }
      },

      resetTestScores: function (nbTestCases) {
         // Reset test results display
         for(var iTest=0; iTest<nbTestCases; iTest++) {
            $('#testPanel'+iTest+' .panel-title').html('<span class="testResultIcon">&nbsp;</span> Test '+(iTest+1));
         }
      },

      updateTestSelector: function (newCurTest) {
         $("#testSelector .panel-body").hide();
         $("#testPanel"+newCurTest+" .panel-body").prepend($('#grid')).append($('#errors')).show();
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
               //delete Blockly;
            }
         }
      },

      getDefaultBlocklyContent: function () {
         if (this.startingBlock) {
            if(this.scratchMode) {
               return '<xml><block type="robot_start" deletable="false" movable="false" x="10" y="20"></block></xml>';
            } else {
               return '<xml><block type="robot_start" deletable="false" movable="false"></block></xml>';
            }
         }
         else {
            return '<xml></xml>';
         }
      },

      checkRobotStart: function () {
         if(!this.startingBlock || !this.workspace) { return; }
         var blocks = this.workspace.getTopBlocks(true);
         for(var b=0; b<blocks.length; b++) {
            if(blocks[b].type == 'robot_start') { return;}
         }

         var xml = Blockly.Xml.textToDom(this.getDefaultBlocklyContent())
         Blockly.Xml.domToWorkspace(xml, this.workspace);
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
         if(this.scratchMode) {
            // Make sure it has the right information from this blocklyHelper
            tmpWorkspace.maxBlocks = function () { return maxBlocks; };
         }
         Blockly.Xml.domToWorkspace(xml, tmpWorkspace);
         return this.getCode(language, tmpWorkspace);
      },


      getCode: function(language, codeWorkspace) {
         if (codeWorkspace == undefined) {
            codeWorkspace = this.workspace;
         }
         if(codeWorkspace.remainingCapacity() < 0) {
            // Safeguard: avoid generating code when we use too many blocks
            return '';
         }
         var blocks = codeWorkspace.getTopBlocks(true);
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
         this.checkRobotStart();

         this.programs[this.player].javascript = $("#program").val();
         if (this.workspace != null) {
            var xml = Blockly.Xml.workspaceToDom(this.workspace);
            this.programs[this.player].blockly = Blockly.Xml.domToText(xml);
            this.programs[this.player].blocklyJS = this.getCode("javascript");
            //this.programs[this.player].blocklyPython = this.getCode("python");
         }
      },

      loadPrograms: function() {
         if (this.workspace != null) {
            var xml = Blockly.Xml.textToDom(this.programs[this.player].blockly);
            this.workspace.clear();
            Blockly.Xml.domToWorkspace(xml, this.workspace);
         }
         $("#program").val(this.programs[this.player].javascript);
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
                     $("#errors").html('<span class="testError">'+that.strings.invalidContent+'</span>');
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
            $("#errors").html('<span class="testError">'+this.strings.unknownFileType+'</span>');
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
               if (this.trashInToolbox) {
                  Blockly.Trashcan.prototype.MARGIN_SIDE_ = panelWidth - 90;
               }
               Blockly.svgResize(this.workspace);
            }
         }
         this.prevWidth = panelWidth;
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

            // append all missing params to the message string
            if (typeof block.blocklyJson.args0 != "undefined") {
               var alreadyInserted = (block.blocklyJson.message0.match(/%/g) || []).length;
               for (var iArgs0 = alreadyInserted; iArgs0 < block.blocklyJson.args0.length; iArgs0++) {
                  if (block.blocklyJson.args0[iArgs0].type == "input_value"
                      || block.blocklyJson.args0[iArgs0].type == "field_number"
                      || block.blocklyJson.args0[iArgs0].type == "field_angle"
                      || block.blocklyJson.args0[iArgs0].type == "field_colour"
                      || block.blocklyJson.args0[iArgs0].type == "field_dropdown"
                      || block.blocklyJson.args0[iArgs0].type == "field_input") {
                     block.blocklyJson.message0 += " %" + (iArgs0 + 1);
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
               block.blocklyJson.colour = Blockly.Colours.motion.primary;
               block.blocklyJson.colourSecondary = Blockly.Colours.motion.secondary;
               block.blocklyJson.colourTertiary = Blockly.Colours.motion.tertiary;
            } else {
               var colours = this.getDefaultColours();
               block.blocklyJson.colour = 210; // default: blue
               if ("blocks" in colours &&  block.name in colours.blocks) {
                  block.blocklyJson.colour = colours.blocks[block.name];
               }
               else if ("categories" in colours) {
                  if (categoryName in colours.categories) {
                     block.blocklyJson.colour = colours.categories[categoryName];
                  }
                  else if ("_default" in colours.categories) {
                     block.blocklyJson.colour = colours.categories["_default"];
                  }
               }
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
               // Prevent the function name to be used as a variable
               Blockly[language].addReservedWords(code);
               function setCodeGeneratorForLanguage(language) {
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
                        if (args0[iArgs0].type == "field_number"
                            || args0[iArgs0].type == "field_angle"
                            || args0[iArgs0].type == "field_dropdown"
                            || args0[iArgs0].type == "field_input") {
                           if (iParam) {
                              params += ", ";
                           }
                           params += block.getFieldValue('PARAM_' + iParam);
                           iParam += 1;
                        }
                        if (args0[iArgs0].type == "field_colour") {
                           if (iParam) {
                              params += ", ";
                           }
                           params += '"' + block.getFieldValue('PARAM_' + iParam) + '"';
                           iParam += 1;
                        }
                     }

                     var callCode = code + '(' + params + ')';
                     // Add reportValue to show the value in step-by-step mode
                     var reportedCode = "reportBlockValue('" + block.id + "', " + callCode + ")";

                     if (typeof output == "undefined") {
                        return callCode + ";\n";
                     }
                     else {
                        return [reportedCode, Blockly[language].ORDER_NONE];
                     }
                  }
               };
               setCodeGeneratorForLanguage(language);
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

      createSimpleGenerator: function(label, code, type, nbParams) {
         var jsDefinitions = this.definitions['javascript'] ? this.definitions['javascript'] : [];
         var pyDefinitions = this.definitions['python'] ? this.definitions['python'] : [];

         // Prevent the function name to be used as a variable
         Blockly.JavaScript.addReservedWords(code);
         Blockly.Python.addReservedWords(code);

         Blockly.JavaScript[label] = function(block) {
            for (var iDef=0; iDef < jsDefinitions.length; iDef++) {
               var def = jsDefinitions[iDef];
               Blockly.Javascript.definitions_[def.label] = def.code;
            }
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
            for (var iDef=0; iDef < pyDefinitions.length; iDef++) {
               var def = pyDefinitions[iDef];
               Blockly.Python.definitions_[def.label] = def.code;
            }
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

      createSimpleBlock: function(label, code, type, nbParams) {
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
      },

      createSimpleGeneratorsAndBlocks: function() {
         for (var genName in this.simpleGenerators) {
            for (var iGen = 0; iGen < this.simpleGenerators[genName].length; iGen++) {
               var generator = this.simpleGenerators[genName][iGen];
               if(genName == '.') {
                 var label = generator.label + "__";
                 var code = generator.code;
               } else {
                 var label = genName + "_" + generator.label + "__";
                 var code = genName + "." + generator.code;
               }
               this.createSimpleGenerator(label, code, generator.type, generator.nbParams);
               // TODO :: merge createSimpleBlock with completeBlock*
               this.createSimpleBlock(label, generator.label, generator.type, generator.nbParams);
            }
         }
      },

      createGeneratorsAndBlocks: function() {
         var customGenerators = this.mainContext.customBlocks;
         for (var objectName in customGenerators) {
            for (var categoryName in customGenerators[objectName]) {
               var category =  customGenerators[objectName][categoryName];
               for (var iBlock = 0; iBlock < category.length; iBlock++) {
                  var block = category[iBlock];

                  /* TODO: Allow library writers to provide their own JS/Python code instead of just a handler */
                  this.completeBlockHandler(block, objectName, this.mainContext);
                  this.completeBlockJson(block, objectName, categoryName, this.mainContext); /* category.category is category name */
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
         var colours = {
            categories: {
               logic: 210,
               loops: 120,
               control: 120,
               math: 230,
               operator: 230,
               texts: 160,
               lists: 260,
               colour: 20,
               variables: 330,
               functions: 290,
               _default: 65
            },
            blocks: {}
         };

         if (typeof this.mainContext.provideBlocklyColours == "function") {
            var providedColours = this.mainContext.provideBlocklyColours();

            for (var group in providedColours) {
               if (!(group in colours)) {
                  colours[group] = {};
               }
               for (name in providedColours[group]) {
                  colours[group][name] = providedColours[group][name];
               }
            }
         }

         if (typeof provideBlocklyColours == "function") {
            var providedColours = provideBlocklyColours();

            for (var group in providedColours) {
               if (!(group in colours)) {
                  colours[group] = {};
               }
               for (name in providedColours[group]) {
                  colours[group][name] = providedColours[group][name];
               }
            }
         }

         return colours;
      },


      getStdBlocks: function() {
         return this.scratchMode ? this.getStdScratchBlocks() : this.getStdBlocklyBlocks();
      },

      getStdBlocklyBlocks: function() {
         return {
            input: [
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
            ],
            logic: [
               {
                  name: "controls_if",
                  blocklyXml: "<block type='controls_if'></block>"
               },
               {
                  name: "controls_if_else",
                  blocklyXml: "<block type='controls_if'><mutation else='1'></mutation></block>",
                  excludedByDefault: this.mainContext.showIfMutator
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
               },
               {
                  name: "logic_boolean",
                  blocklyXml: "<block type='logic_null'></block>",
                  excludedByDefault: true
               },
               {
                  name: "logic_boolean",
                  blocklyXml: "<block type='logic_ternary'></block>",
                  excludedByDefault: true
               }
            ],
            loops: [
               {
                  name: "controls_repeat",
                  blocklyXml: "<block type='controls_repeat'></block>",
                  excludedByDefault: true
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
                  name: "controls_repeat_ext_noShadow",
                  blocklyXml: "<block type='controls_repeat_ext'></block>",
                  excludedByDefault: true
               },
               {
                   name: "controls_repeat_ext_fillShadow",
                   blocklyXml: "<block type='controls_repeat_ext'>" +
                   "  <value name='TIMES'>" +
                   "    <block type='math_number'>" +
                   "      <field name='NUM'>10</field>" +
                   "    </block>" +
                   "  </value>" +
                   "</block>"
               },
               {
                  name: "controls_whileUntil",
                  blocklyXml: "<block type='controls_whileUntil'></block>"
               },
               {
                  name: "controls_untilWhile",
                  blocklyXml: "<block type='controls_whileUntil'><field name='MODE'>UNTIL</field></block>",
                  excludedByDefault: true
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
                  name: "controls_for_noShadow",
                  blocklyXml: "<block type='controls_for'></block>",
                  excludedByDefault: true
               },
               {
                   name: "controls_for_fillShadow",
                   blocklyXml: "<block type='controls_for'>" +
                   "  <value name='FROM'>" +
                   "    <block type='math_number'>" +
                   "      <field name='NUM'>1</field>" +
                   "    </block>" +
                   "  </value>" +
                   "  <value name='TO'>" +
                   "    <block type='math_number'>" +
                   "      <field name='NUM'>10</field>" +
                   "     </block>" +
                   "  </value>" +
                   "  <value name='BY'>" +
                   "    <block type='math_number'>" +
                   "      <field name='NUM'>1</field>" +
                   "    </block>" +
                   "  </value>" +
                   "</block>"
               },
               {
                  name: "controls_forEach",
                  blocklyXml: "<block type='controls_forEach'></block>",
                  excludedByDefault: true
               },
               {
                  name: "controls_flow_statements",
                  blocklyXml: "<block type='controls_flow_statements'></block>"
               }
            ],
            math: [
               {
                  name: "math_number",
                  blocklyXml: "<block type='math_number' gap='32'></block>"
               },
               {
                  name: "math_arithmetic",
                  blocklyXml: "<block type='math_arithmetic'>" +
                              "  <value name='A'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='B'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "math_arithmetic_noShadow",
                  blocklyXml: "<block type='math_arithmetic'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_single",
                  blocklyXml: "<block type='math_single'>" +
                              "  <value name='NUM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>9</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "math_single_noShadow",
                  blocklyXml: "<block type='math_single'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_extra_single",
                  blocklyXml: "<block type='math_extra_single'>" +
                              "  <value name='NUM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>9</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "math_extra_single_noShadow",
                  blocklyXml: "<block type='math_extra_single'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_extra_double",
                  blocklyXml: "<block type='math_extra_double'>" +
                              "  <value name='A'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='B'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "math_extra_double",
                  blocklyXml: "<block type='math_extra_double'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_trig",
                  blocklyXml: "<block type='math_trig'>" +
                              "  <value name='NUM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>45</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "math_trig_noShadow",
                  blocklyXml: "<block type='math_trig'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_constant",
                  blocklyXml: "<block type='math_constant'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_number_property",
                  blocklyXml: "<block type='math_number_property'>" +
                              "  <value name='NUMBER_TO_CHECK'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>0</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "math_number_property_noShadow",
                  blocklyXml: "<block type='math_number_property'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_round",
                  blocklyXml: "<block type='math_round'>" +
                              "  <value name='NUM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>3.1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "math_round_noShadow",
                  blocklyXml: "<block type='math_round'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_on_list",
                  blocklyXml: "<block type='math_on_list'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_modulo",
                  blocklyXml: "<block type='math_modulo'>" +
                              "  <value name='DIVIDEND'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>64</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='DIVISOR'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>10</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>"
               },
               {
                  name: "math_modulo_noShadow",
                  blocklyXml: "<block type='math_modulo'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_constrain",
                  blocklyXml: "<block type='math_constrain'>" +
                              "  <value name='VALUE'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>50</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='LOW'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='HIGH'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>100</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "math_constrain_noShadow",
                  blocklyXml: "<block type='math_constrain'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_random_int",
                  blocklyXml: "<block type='math_random_int'>" +
                              "  <value name='FROM'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>1</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "  <value name='TO'>" +
                              "    <shadow type='math_number'>" +
                              "      <field name='NUM'>100</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "math_random_int_noShadow",
                  blocklyXml: "<block type='math_random_int'></block>",
                  excludedByDefault: true
               },
               {
                  name: "math_random_float",
                  blocklyXml: "<block type='math_random_float'></block>",
                  excludedByDefault: true
               }
            ],
            texts: [
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
                  name: "text_length_noShadow",
                  blocklyXml: "<block type='text_length'></block>",
                  excludedByDefault: true
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
                  name: "text_isEmpty_noShadow",
                  blocklyXml: "<block type='text_isEmpty'></block>",
                  excludedByDefault: true
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
                  name: "text_indexOf_noShadow",
                  blocklyXml: "<block type='text_indexOf'></block>",
                  excludedByDefault: true
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
                  name: "text_charAt_noShado",
                  blocklyXml: "<block type='text_charAt'></block>",
                  excludedByDefault: true

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
                  name: "text_getSubstring_noShadow",
                  blocklyXml: "<block type='text_getSubstring'></block>",
                  excludedByDefault: true
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
                  name: "text_changeCase_noShadow",
                  blocklyXml: "<block type='text_changeCase'></block>",
                  excludedByDefault: true
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
                  name: "text_trim_noShadow",
                  blocklyXml: "<block type='text_trim'></block>"
               },
               {
                  name: "text_print",
                  blocklyXml: "<block type='text_print'>" +
                              "  <value name='TEXT'>" +
                              "    <shadow type='text'>" +
                              "      <field name='TEXT'>abc</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "text_print_noShadow",
                  blocklyXml: "<block type='text_print'></block>",
                  excludedByDefault: true
               },
               {
                  name: "text_prompt_ext",
                  blocklyXml: "<block type='text_prompt_ext'>" +
                              "  <value name='TEXT'>" +
                              "    <shadow type='text'>" +
                              "      <field name='TEXT'>abc</field>" +
                              "    </shadow>" +
                              "  </value>" +
                              "</block>",
                  excludedByDefault: true
               },
               {
                  name: "text_prompt_ext_noShadow",
                  blocklyXml: "<block type='text_prompt_ext'></block>",
                  excludedByDefault: true
               }
            ],
            lists: [
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
               }
            ],
            colour: [
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
                  name: "colour_rgb_noShadow",
                  blocklyXml: "<block type='colour_rgb'></block>",
                  excludedByDefault: true
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
               },
               {
                  name: "colour_blend_noShadow",
                  blocklyXml: "<block type='colour_blend'></block>",
                  excludedByDefault: true
               }
            ],
            dicts: [
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
            ],
            variables: [],
            functions: []
         };
      },

      getStdScratchBlocks: function() {
         // TODO :: make the list of standard scratch blocks
         return {
            control: [
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
               }
            ],
            operator: [
               {
                  name: "operator_not",
                  blocklyXml: "<block type='operator_not'></block>"
               }
            ]
         };
      },

      getBlockXmlInfo: function(generatorStruct, blockName) {
         for (var categoryName in generatorStruct) {
            var blocks = generatorStruct[categoryName];
            for (var iBlock = 0; iBlock < blocks.length; iBlock++) {
               var block = blocks[iBlock];
               if (block.name == blockName) {
                  return {
                     category: categoryName,
                     xml: block.blocklyXml
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

         // by the way, just change the defaul colours of the blockly blocks:
         if(!this.scratchMode) {
            var defCat = ["logic", "loops", "math", "texts", "lists", "colour"];
            for (var iCat in defCat) {
               Blockly.Blocks[defCat[iCat]].HUE = colours.categories[defCat[iCat]];
            }
         }
      },

      getToolboxXml: function() {
         var categoriesInfos = {};
         var colours = this.getDefaultColours();

         // Reset the flyoutOptions
         Blockly.Variables.flyoutOptions = {
            any: false,
            anyButton: !!this.includeBlocks.groupByCategory,
            fixed: [],
            includedBlocks: {get: true, set: true, incr: true},
            shortList: true
         };

         for (var blockType in this.includeBlocks.generatedBlocks) {
            this.addBlocksAndCategories(this.includeBlocks.generatedBlocks[blockType], this.mainContext.customBlocks[blockType], categoriesInfos);
         }

         for (var genName in this.simpleGenerators) {
            for (var iGen = 0; iGen < this.simpleGenerators[genName].length; iGen++) {
               var generator = this.simpleGenerators[genName][iGen];
               if (categoriesInfos[generator.category] == undefined) {
                  categoriesInfos[generator.category] = {
                     blocksXml: [],
                     colour: 210
                  };
               }
               var blockName = (genName == '.') ? generator.label + "__" : genName + "_" + generator.label + "__";
               categoriesInfos[generator.category].blocksXml.push("<block type='"+blockName+"'></block>");
            }
         }

         var stdBlocks = this.getStdBlocks();

         if (this.includeBlocks.standardBlocks.includeAll) {
            this.includeBlocks.standardBlocks.wholeCategories = ["input", "logic", "loops", "math", "texts", "lists", "colour", "dicts", "variables", "functions"];
         }
         var wholeCategories = this.includeBlocks.standardBlocks.wholeCategories || [];
         for (var iCategory = 0; iCategory < wholeCategories.length; iCategory++) {
            var categoryName = wholeCategories[iCategory];
            if (!(categoryName in categoriesInfos)) {
               categoriesInfos[categoryName] = {
                  blocksXml: []
               };
            }
            if (categoryName == 'variables') {
               Blockly.Variables.flyoutOptions.any = true;
               continue;
            }
            var blocks = stdBlocks[categoryName];
            if (!(blocks instanceof Array)) { // just for now, maintain backwards compatibility
               blocks = blocks.blocks;
            }

            for (var iBlock = 0; iBlock < blocks.length; iBlock++) {
               if (!(blocks[iBlock].excludedByDefault)) {
                  categoriesInfos[categoryName].blocksXml.push(blocks[iBlock].blocklyXml);
               }
            }
         }

         this.addBlocksAndCategories(this.includeBlocks.standardBlocks.singleBlocks || [], stdBlocks, categoriesInfos);

         // Handle variable blocks, which are normally automatically added with
         // the VARIABLES category but can be customized here
         if (typeof this.includeBlocks.variables !== 'undefined') {
            Blockly.Variables.flyoutOptions.fixed = (this.includeBlocks.variables.length > 0) ? this.includeBlocks.variables : [];
            if (typeof this.includeBlocks.variablesOnlyBlocks !== 'undefined') {
               Blockly.Variables.flyoutOptions.includedBlocks = {get: false, set: false, incr: false};
               for (var iBlock=0; iBlock < this.includeBlocks.variablesOnlyBlocks.length; iBlock++) {
                  Blockly.Variables.flyoutOptions.includedBlocks[this.includeBlocks.variablesOnlyBlocks[iBlock]] = true;
               }
            }

            var varAnyIdx = Blockly.Variables.flyoutOptions.fixed.indexOf('*');
            if(varAnyIdx > -1) {
               Blockly.Variables.flyoutOptions.fixed.splice(varAnyIdx, 1);
               Blockly.Variables.flyoutOptions.any = true;
            }

            var blocksXml = Blockly.Variables.flyoutCategory();
            var xmlSer = new XMLSerializer();
            for(var i=0; i<blocksXml.length; i++) {
               blocksXml[i] = xmlSer.serializeToString(blocksXml[i]);
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
                          + (categoryName == 'variables' ? ' custom="VARIABLE"' : '')
                          + (categoryName == 'functions' ? ' custom="PROCEDURE"' : '')
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

         (function (strings) {
            xmlString = xmlString.replace(/{(\w+)}/g, function(m, p1) {return strings[p1]}); // taken from blockly/demo/code
         })(this.strings);

         return xmlString;
      },


      addExtraBlocks: function() {
         var that = this;


         Blockly.Blocks['controls_untilWhile'] = Blockly.Blocks['controls_whileUntil'];
         Blockly.JavaScript['controls_untilWhile'] = Blockly.JavaScript['controls_whileUntil'];
         Blockly.Python['controls_untilWhile'] = Blockly.Python['controls_whileUntil'];

         Blockly.Blocks['math_extra_single'] = {
           /**
            * Block for advanced math operators with single operand.
            * @this Blockly.Block
            */
           init: function() {
             var OPERATORS =
                 [
                  [Blockly.Msg.MATH_SINGLE_OP_ABSOLUTE, 'ABS'],
                  ['-', 'NEG']
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
                  ['max', 'MAX']
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
            if (!(this.mainContext.showIfMutator)) {
               var old = Blockly.Blocks.controls_if.init;
               Blockly.Blocks.controls_if.init = function() {
                  old.call(this);
                  this.setMutator(undefined)
               };
            }

            Blockly.Blocks['robot_start'] = {
              init: function() {
                this.appendDummyInput()
                    .appendField(that.strings.startingBlockName);
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
               for(var b=0; b<blocklyToScratch.singleBlocks[blockName].length; b++) {
                  newSingleBlocks.push(blocklyToScratch.singleBlocks[blockName][b]);
               }
            } else {
                newSingleBlocks.push(blockName);
            }
         }
         this.includeBlocks.standardBlocks.singleBlocks = newSingleBlocks;
      },

      glowBlock: function(id) {
         // highlightBlock replacement for Scratch
         if(this.glowingBlock) {
            try {
               this.workspace.glowBlock(this.glowingBlock, false);
            } catch(e) {}
         }
         if(id) {
            this.workspace.glowBlock(id, true);
         }
         this.glowingBlock = id;
      },

      initRun: function() {
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
         var topBlocks = this.workspace.getTopBlocks(true);
         var robotStartHasChildren = false;

         if (this.startingBlock) {
            for(var b=0; b<topBlocks.length; b++) {
               var block = topBlocks[b];
               if(block.type == 'robot_start' && block.childBlocks_.length > 0) {
                  robotStartHasChildren = true;
                  break;
               } // There can be multiple robot_start blocks sometimes
            }
            if(!robotStartHasChildren) {
               $("#errors").html('<span class="testError">' + window.languageStrings.errorEmptyProgram + '</span>');
               return;
            }
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
               $("#errors").html('<span class="testError">'+this.strings.tooManyBlocks+'</span>');
               return;
            }
         } else {
            that.workspace.traceOn(true);
            that.workspace.highlightBlock(null);
         }
         this.mainContext.runner.initCodes(codes);
      },


      run: function () {
         this.initRun();
         this.mainContext.runner.run();
      },

      step: function () {
         if(this.mainContext.runner.nbRunning() <= 0) {
            this.initRun();
         }
         this.mainContext.runner.step();
      },

      getFullCode: function(code) {
         return this.getBlocklyLibCode(this.generators) + code + "program_end()";
      }
   }
}


function initBlocklyRunner(context, messageCallback, language) {
   init(context, [], [], [], false, {}, language);

   function init(context, interpreters, isRunning, toStop, stopPrograms, runner, language) {
      runner.hasActions = false;
      runner.nbActions = 0;
      runner.scratchMode = context.blocklyHelper ? context.blocklyHelper.scratchMode : false;

      runner.stepInProgress = false;
      runner.stepMode = false;
      runner.nextCallBack = null;
      runner.firstHighlight = true;

      runner.strings = languageStrings[language];

      runner.reportBlockValue = function(id, value, varName) {
         // Show a popup displaying the value of a block in step-by-step mode
         if(context.display && runner.stepMode) {
            var displayStr = value.toString();
            if(value.type == 'boolean') {
               displayStr = value.data ? runner.strings.valueTrue : runner.strings.valueFalse;
            }
            if(varName) {
               displayStr = varName.toString() + ' = ' + displayStr;
            }
            context.blocklyHelper.workspace.reportValue(id, displayStr);
         }
         return value;
      };

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
         var makeHandler = function(runner, handler) {
            // For commands belonging to the "actions" category, we count the
            // number of actions to put a limit on steps without actions
            return function () {
               runner.nbActions += 1;
               handler.apply(this, arguments);
            };
         };

         for (var objectName in context.customBlocks) {
            for (var category in context.customBlocks[objectName]) {
               for (var iBlock in context.customBlocks[objectName][category]) {
                  var blockInfo = context.customBlocks[objectName][category][iBlock];
                  var code = context.strings.code[blockInfo.name];
                  if (typeof(code) == "undefined") {
                     code = blockInfo.name;
                  }

                  if(category == 'actions') {
                     runner.hasActions = true;
                     var handler = makeHandler(runner, blockInfo.handler);
                  } else {
                     var handler = blockInfo.handler;
                  }

                  interpreter.setProperty(scope, code, interpreter.createAsyncFunction(handler));
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

         function highlightBlock(id, callback) {
            id = id ? id.toString() : '';

            if (context.display) {
               if(!runner.scratchMode) {
                  context.blocklyHelper.workspace.traceOn(true);
                  context.blocklyHelper.workspace.highlightBlock(id);
                  highlightPause = true;
               } else {
                  context.blocklyHelper.glowBlock(id);
                  highlightPause = true;
               }
            }

            // We always execute directly the first highlightBlock
            if(runner.firstHighlight || !runner.stepMode) {
               runner.firstHighlight = false;
               callback();
               runner.runSyncBlock();
            } else {
               // Interrupt here for step mode, allows to stop before each
               // instruction
               runner.nextCallback = callback;
               runner.stepInProgress = false;
            }
         }

         // Add an API function for highlighting blocks.
         interpreter.setProperty(scope, 'highlightBlock', interpreter.createAsyncFunction(highlightBlock));

         // Add an API function to report a value.
         interpreter.setProperty(scope, 'reportBlockValue', interpreter.createNativeFunction(runner.reportBlockValue));

      };

      runner.stop = function() {
         for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
            if (isRunning[iInterpreter]) {
               toStop[iInterpreter] = true;
               isRunning[iInterpreter] = false;
            }
         }

         if(runner.scratchMode) {
            Blockly.DropDownDiv.hide();
            context.blocklyHelper.glowBlock(null);
         }

         context.reset();
      };

      runner.runSyncBlock = function() {
         var maxIter = 400000;

         var maxIterWithoutAction = 500;
         if (context.infos.maxIter != undefined) {
            maxIter = context.infos.maxIter;
         }
         if (context.infos.maxIterWithoutAction != undefined) {
            maxIterWithoutAction = context.infos.maxIterWithoutAction;
         }

         if(!runner.hasActions) {
            // If there's no actions in the current task, "disable" the limit
            maxIterWithoutAction = maxIter;
         }
   /*      if (turn > 90) {
            task.program_end(function() {
               that.stop();
            });
            return;
      }*/

         runner.stepInProgress = true;
         // Handle the callback from last highlightBlock
         if(runner.nextCallback) {
            runner.nextCallback();
            runner.nextCallback = null;
         }

         try {
            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               context.curRobot = iInterpreter;
               if (context.infos.checkEndEveryTurn) {
                  context.infos.checkEndCondition(context, false);
               }
               var interpreter = interpreters[iInterpreter];
               while (context.curSteps[iInterpreter].total < maxIter && context.curSteps[iInterpreter].withoutAction < maxIterWithoutAction) {
                  if (!interpreter.step() || toStop[iInterpreter]) {
                     isRunning[iInterpreter] = false;
                     break;
                  }
                  if (interpreter.paused_) {
                     break;
                  }
                  context.curSteps[iInterpreter].total++;
                  if(context.curSteps[iInterpreter].lastNbMoves != runner.nbActions) {
                     context.curSteps[iInterpreter].lastNbMoves = runner.nbActions;
                     context.curSteps[iInterpreter].withoutAction = 0;
                  } else {
                     context.curSteps[iInterpreter].withoutAction++;
                  }
               }
               if (context.curSteps[iInterpreter].total >= maxIter) {
                  isRunning[iInterpreter] = false;
                  throw context.blocklyHelper.strings.tooManyIterations;
               } else if(context.curSteps[iInterpreter].withoutAction >= maxIterWithoutAction) {
                  isRunning[iInterpreter] = false;
                  throw context.blocklyHelper.strings.tooManyIterationsWithoutAction;
               }
            }
         } catch (e) {
            runner.stepInProgress = false;

            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               isRunning[iInterpreter] = false;
            }

            var message = e.toString();

            // Translate "Unknown identifier" message
            if(message.substring(0, 20) == "Unknown identifier: ") {
               var varName = message.substring(20);
               // Get original variable name if possible
               for(var dbIdx in Blockly.JavaScript.variableDB_.db_) {
                  if(Blockly.JavaScript.variableDB_.db_[dbIdx] == varName) {
                     varName = dbIdx.substring(0, dbIdx.length - 9);
                     break;
                  }
               }
               message = strings.uninitializedVar + ' ' + varName;
            }

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

      runner.initCodes = function(codes) {
         //this.mainContext.delayFactory.stopAll(); pb: it would top existing graders
         interpreters = [];
         runner.nbActions = 0;
         runner.stepInProgress = false;
         runner.stepMode = false;
         runner.firstHighlight = true;
         context.programEnded = [];
         context.curSteps = [];
         context.reset();
         for (var iInterpreter = 0; iInterpreter < codes.length; iInterpreter++) {
            context.curSteps[iInterpreter] = {
               total: 0,
               withoutAction: 0,
               lastNbMoves: 0
            };
            context.programEnded[iInterpreter] = false;
            interpreters.push(new Interpreter(codes[iInterpreter], runner.initInterpreter));
            isRunning[iInterpreter] = true;
            toStop[iInterpreter] = false;
         }
      };
      runner.runCodes = function(codes) {
         runner.initCodes(codes);
         runner.runSyncBlock();
      };

      runner.run = function () {
         runner.stepMode = false;
         if(!runner.stepInProgress) {
            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               interpreters[iInterpreter].paused_ = false;
            }
            runner.runSyncBlock();
         }
      };

      runner.step = function () {
         runner.stepMode = true;
         if(!runner.stepInProgress) {
            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               interpreters[iInterpreter].paused_ = false;
            }
            runner.runSyncBlock();
         }
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


var initBlocklySubTask = function(subTask, language) {
   if (subTask.data["medium"] == undefined) {
      subTask.load = function(views, callback) {
         subTask.loadLevel("easy");
         callback();
      };
   }

   if (language == undefined) {
      language = "fr";
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
      $('body').css("width", "100%").addClass('blockly');
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
      displayHelper.timeoutMinutes = subTask.gridInfos.timeoutMinutes ? subTask.gridInfos.timeoutMinutes : 30;

      this.blocklyHelper.includeBlocks = extractLevelSpecific(this.context.infos.includeBlocks, curLevel);;

      this.blocklyHelper.load(stringsLanguage, this.display, this.data[curLevel].length);

      if(this.display) {
         this.blocklyHelper.initTestSelector(this.nbTestCases);
      }

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
      //      var prefix = "Test " + (subTask.iTestCase + 1) + "/" + subTask.nbTestCases + " : ";
      subTask.context.messagePrefixFailure = '';
      subTask.context.messagePrefixSuccess = '';
      subTask.context.linkBack = false;
   };

   subTask.run = function() {
      initBlocklyRunner(subTask.context, function(message, success) {
         $("#errors").html('<span class="testError">'+message+'</span>');
      }, language);
      initContextForLevel(subTask.iTestCase);
      subTask.blocklyHelper.run(subTask.context);
   };

   subTask.submit = function() {
      this.context.display = false;
      this.getAnswerObject(); // to fill this.answer;

      $('#displayHelper_graderMessage').html('<div style="margin: .2em 0; color: red; font-weight: bold;">' + languageStrings.gradingInProgress + '</div>');

      this.getGrade(function(result) {
         $('#displayHelper_graderMessage').html("");
         subTask.context.display = true;
         subTask.context.changeDelay(200);
         initBlocklyRunner(subTask.context, function(message, success) {
            $("#errors").html('<span class="testError">'+message+'</span>');
            platform.validate("done");
         }, language);
         subTask.changeTest(result.iTestCase - subTask.iTestCase);
         initContextForLevel(result.iTestCase);
         subTask.context.linkBack = true;
         subTask.context.messagePrefixSuccess = window.languageStrings.allTests;
         subTask.blocklyHelper.run(subTask.context);
      });
   };

   subTask.step = function () {
      subTask.context.changeDelay(200);
      if(!subTask.context.runner || subTask.context.runner.nbRunning() <= 0) {
        initBlocklyRunner(subTask.context, function(message, success) {
           $("#errors").html('<span class="testError">'+message+'</span>');
        }, language);
        initContextForLevel(subTask.iTestCase);
      }
      subTask.blocklyHelper.step(subTask.context);
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

   subTask.changeSpeed =  function(speed) {
      this.context.changeDelay(speed);
      if ((this.context.runner == undefined) || (this.context.runner.nbRunning() == 0)) {
         this.run();
      } else if (this.context.runner.stepMode) {
         this.context.runner.run();
      }
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
      var defaultBlockly = this.blocklyHelper.getDefaultBlocklyContent();
      return [{javascript:"", blockly: defaultBlockly, blocklyJS: ""}];
   };

   subTask.changeTest = function(delta) {
      var newTest = subTask.iTestCase + delta;
      if ((newTest >= 0) && (newTest < this.nbTestCases)) {
         initContextForLevel(newTest);
         if(subTask.context.display) {
            subTask.blocklyHelper.updateTestSelector(newTest);
         }
      }
   };

   subTask.changeTestTo = function(iTest) {
      var delta = iTest - subTask.iTestCase;
      if(delta != 0) {
         subTask.changeTest(delta);
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
            var nbSuccess = 0;
            for (var iCase = 0; iCase < subTask.nbTestCases; iCase++) {
               if (subTask.testCaseResults[iCase].successRate >= 1) {
                  nbSuccess++;
               }
               if (subTask.testCaseResults[iCase].successRate < worstRate) {
                  worstRate = subTask.testCaseResults[iCase].successRate;
                  iWorstTestCase = iCase;
               }
            }
            subTask.testCaseResults[iWorstTestCase].iTestCase = iWorstTestCase;
            subTask.blocklyHelper.updateTestScores(subTask.testCaseResults);
            if(subTask.testCaseResults[iWorstTestCase].successRate < 1) {
               if(nbSuccess > 0) {
                  var msg = languageStrings.resultsPartialSuccess.format({
                     nbSuccess: nbSuccess,
                     nbTests: subTask.nbTestCases
                     });
               } else {
                  var msg = languageStrings.resultsNoSuccess;
               }
               var results = {
                  message: msg,
                  successRate: subTask.testCaseResults[iWorstTestCase].successRate,
                  iTestCase: iWorstTestCase
               };
            } else {
               var results = subTask.testCaseResults[iWorstTestCase];
            }
            callback(results);
         }
      }, language);
      subTask.iTestCase = 0;
      subTask.testCaseResults = [];
      initContextForLevel(subTask.iTestCase);
      subTask.context.linkBack = true;
      subTask.context.messagePrefixSuccess = window.languageStrings.allTests;
      subTask.context.runner.runCodes(codes);
   };
}

// We need to be able to clean all events

if (Node && Node.prototype.addEventListenerBase == undefined) {
   // IE11 doesn't have EventTarget
   if(typeof EventTarget === 'undefined') {
      var targetPrototype = Node.prototype;
   } else {
      var targetPrototype = EventTarget.prototype;
   }
   targetPrototype.addEventListenerBase = targetPrototype.addEventListener;
   targetPrototype.addEventListener = function(type, listener)
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

   targetPrototype.removeEventListenerBase = targetPrototype.removeEventListener;
   targetPrototype.removeEventListener = function(type, listener)
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
   // delete Blockly;
}
