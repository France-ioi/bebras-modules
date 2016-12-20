/*!
 * @author John Ropas
 * @since 19/12/2016
 */
var languageStrings = {
  fr: {
    categories: {
      actions: "Actions",
      sensors: "Capteurs",
      debug: "Débuggage",
      colour: "Couleurs",
      dicts: "Dictionnaires",
      inputs: "Entrées",
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
    buttons: {
      next: 'Next',
      previous: 'Previous'
    }
  },
  en: {
    categories: {
      actions: "Actions",
      sensors: "Sensors",
      debug: "Debug",
      colour: "Colors",
      dicts: "Dictionnaries",
      inputs: "Inputs",
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
    pythonLanguage: "Python",
    importFromBlockly: "Generate from blockly",
    saveOrLoadProgram: "Save or reload your code:",
    avoidReloadingOtherTask: "Warning: do not reload code for another task!",
    reloadProgram: "Reload:",
    saveProgram: "Save",
    limitBlocks: "{remainingBlocks} blocks remaining out of {maxBlocks} available.",
    buttons: {
      next: 'Suivant',
      previous: 'Précédent'
    }
  },
  de: {
    categories: {
      actions: "Aktionen",
      sensors: "Sensoren",
      debug: "Debug",
      colour: "Farben",
      dicts: "Diktionär",
      inputs: "Eingaben",
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
    limitBlocks: "Noch {remainingBlocks} von {maxBlocks} Blöcken verfügbar."
  }
};

var CONSTANTS = {
  HELPER_TYPES: {
    BLOCKLY: 'blockly',
    JAVASCRIPT: 'javascript',
    PYTHON: 'python'
  },
  SETTINGS: {
    DEFAULT_HELPER_TYPE: 'blockly'
  },
  HTML: {
    EDITOR: '#editor'
  },
  LOCALIZATION: {
    FR: 'fr',
    EN: 'en',
    DE: 'de'
  }
};

function EditorFactory(nbTestCases, maxInstructions, type) {

  this.localization = CONSTANTS.LOCALIZATION.EN;

  this.setLocalization = function (localization) {
    this.localization = localization;
  };

  this.strings = languageStrings[CONSTANTS.LOCALIZATION.EN];

  this.nbTestCases = nbTestCases || 0;

  this.maxInstructions = maxInstructions || undefined;

  this.type = type || CONSTANTS.SETTINGS.DEFAULT_HELPER_TYPE;


  this.changeLanguage = function (e) {

  };

  this._loadXML = function () {
    return "<xml id='toolbox' style='display: none'></xml>";
  };

  this._loadLanguageSelector = function () {
    return "<div id='lang'>" +
      " <p>" + this.strings.selectLanguage +
      "   <select id='selectLanguage' onchange='task.displayedSubTask.blocklyHelper.changeLanguage()'>" +
      "     <option value='blockly'>" + this.strings.blocklyLanguage + "</option>" +
      "     <option value='javascript'>" + this.strings.javascriptLanguage + "</option>" +
      "     <option value='python'>" + this.strings.pythonLanguage + "</option>" +
      "   </select>" +
      "   <input type='button' class='language_javascript' value='" + this.strings.importFromBlockly + "'" +
      "   onclick='task.displayedSubTask.blocklyHelper.importFromBlockly()' />" +
      " </p>" +
      "</div>";
  };

  this._loadInstructionsTooltip = function () {

    var strMaxBlocks = "";

    if (this.maxInstructions) {
      strMaxBlocks = this.strings.limitBlocks.format({
        maxBlocks: this.maxInstructions,
        remainingBlocks: "<span class='max-instructions'>XXX</span>"
      });
    }

    return "<div class='clearBoth' >" + strMaxBlocks + "</div>";
  };

  this._loadEditorWorkSpace = function () {
    return "<div id='editorContainer'>" +
      " <div id='blockly-workspace' class='language_blockly'></div>" +
      " <textarea id='javascript-workspace' class='language_javascript'></textarea>" +
      " <textarea id='python-workspace' class='language_python'></textarea>" +
      "</div>";
  };

  this._loadEditorTools = function () {
    return "<div id='saveOrLoad'>" +
      " <p><b>" + this.strings.saveOrLoadProgram + "</b></p>" +
      " <p>" + this.strings.avoidReloadingOtherTask + "</p>" +
      " <p>" + this.strings.reloadProgram +
      "   <input type='file' id='input' onchange='task.displayedSubTask.blocklyHelper.handleFiles(this.files);resetFormElement($(\"#input\"))'>" +
      " </p>" +
      " <p>" +
      "   <input type='button' value='" + this.strings.saveProgram + "' onclick='task.displayedSubTask.blocklyHelper.saveProgram()' />" +
      "   <span id='saveUrl'></span>" +
      " </p>" +
      "</div>";
  };

  this._loadGridButtons = function () {

    var gridButtonsBefore = "";

    if (this.nbTestCases > 1) {
      gridButtonsBefore +=
        "<div>" +
        "  <input type='button' value='" + this.strings.buttons.previous + "' onclick='task.displayedSubTask.changeTest(-1)'/>" +
        "  <span id='testCaseName'>Test 1</span>" +
        "  <input type='button' value='" + this.strings.buttons.next + "' onclick='task.displayedSubTask.changeTest(1)'/>" +
        "</div>";
    }

    $("#gridButtonsBefore").html(gridButtonsBefore);

    var gridButtonsAfter = this.strings.speed +
      "<select id='selectSpeed' onchange='task.displayedSubTask.changeSpeed()'>" +
      "  <option value='200'>" + this.strings.slowSpeed + "</option>" +
      "  <option value='50'>" + this.strings.mediumSpeed + "</option>" +
      "  <option value='5'>" + this.strings.fastSpeed + "</option>" +
      "  <option value='0'>" + this.strings.ludicrousSpeed + "</option>" +
      "</select>&nbsp;&nbsp;" +
      "<input type='button' value='" + this.strings.stopProgram + "' onclick='task.displayedSubTask.stop()'/><br/><br/>";
    if (nbTestCases > 1) {
      gridButtonsAfter += "<input type='button' value='" + this.strings.runProgram + "' onclick='task.displayedSubTask.run()'/>&nbsp;&nbsp;";
    }
    gridButtonsAfter +=
      "<input type='button' value='" + this.strings.submitProgram + "' onclick='task.displayedSubTask.submit()' />" +
      "<br/>" +
      "<div id='errors'></div>";
    $("#gridButtonsAfter").html(gridButtonsAfter);
  };

  this.loadEditor = function () {
    $(CONSTANTS.HTML.EDITOR).html(
      this._loadXML() +
      this._loadLanguageSelector() +
      this._loadInstructionsTooltip() +
      this._loadEditorWorkSpace() +
      this._loadEditorTools()
    );

    this._loadGridButtons();
  }

}


