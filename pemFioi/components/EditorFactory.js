/*!
 * @author John Ropas
 * @since 19/12/2016
 */
var localizationStrings = {
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
  EDITOR_TYPE: {
    BLOCKLY: 'blockly',
    JAVASCRIPT: 'javascript',
    PYTHON: 'python'
  },
  SETTINGS: {
    DEFAULT_EDITOR_TYPE: 'blockly',
    DEFAULT_LOCALIZATION: 'fr'
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

function EditorFactory(nbTestCases, maxInstructions, type, mainContext) {
  this._nbTestCases = nbTestCases || 0;
  this._maxInstructions = maxInstructions || undefined;
  this._type = type || CONSTANTS.SETTINGS.DEFAULT_EDITOR_TYPE;
  this._textFile = null;
  this._extended = false;
  this._programs = [];
  this._languages = [];
  this._player = 0;
  this._workspace = null;
  this._prevWidth = 0;
  this._mainContext = mainContext;
  this._localizationStrings = localizationStrings;
  this._startingBlock = true;
  this._localization = CONSTANTS.SETTINGS.DEFAULT_LOCALIZATION;
  this.setLocalization = function (localization) {
    this._localization = localization;
  };
  this.getLocalization = function () {
    return this._localization;
  };
  this._strings = localizationStrings[this._localization];
  this._visible = true;
  this.isVisible = function (visibleBool) {
    this._visible = visibleBool;
  };
  this.isVisible = function () {
    return this._visible;
  };
  this._includedBlocks = [];
  this.setIncludedBlocks = function (ibs) {
    this._includedBlocks = ibs;
  };

  this._loadXML = function () {
    return "<xml id='toolbox' style='display: none'></xml>";
  };

  this._loadLanguageSelector = function () {
    return "<div id='lang'>" +
      " <p>" + this._strings.selectLanguage +
      "   <select id='selectLanguage' onchange='task.displayedSubTask.blocklyHelper.changeLanguage()'>" +
      "     <option value='blockly'>" + this._strings.blocklyLanguage + "</option>" +
      "     <option value='javascript'>" + this._strings.javascriptLanguage + "</option>" +
      "     <option value='python'>" + this._strings.pythonLanguage + "</option>" +
      "   </select>" +
      "   <input type='button' class='language_javascript' value='" + this._strings.importFromBlockly + "'" +
      "   onclick='task.displayedSubTask.blocklyHelper.importFromBlockly()' />" +
      " </p>" +
      "</div>";
  };

  this._loadInstructionsTooltip = function () {

    var strMaxBlocks = "";

    if (this.maxInstructions) {
      strMaxBlocks = this._strings.limitBlocks.format({
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
      " <p><b>" + this._strings.saveOrLoadProgram + "</b></p>" +
      " <p>" + this._strings.avoidReloadingOtherTask + "</p>" +
      " <p>" + this._strings.reloadProgram +
      "   <input type='file' id='input' onchange='task.displayedSubTask.blocklyHelper.handleFiles(this.files);resetFormElement($(\"#input\"))'>" +
      " </p>" +
      " <p>" +
      "   <input type='button' value='" + this._strings.saveProgram + "' onclick='task.displayedSubTask.blocklyHelper.saveProgram()' />" +
      "   <span id='saveUrl'></span>" +
      " </p>" +
      "</div>";
  };

  this._loadGridButtons = function () {

    var gridButtonsBefore = "";

    if (this.nbTestCases > 1) {
      gridButtonsBefore +=
        "<div>" +
        "  <input type='button' value='" + this._strings.buttons.previous + "' onclick='task.displayedSubTask.changeTest(-1)'/>" +
        "  <span id='testCaseName'>Test 1</span>" +
        "  <input type='button' value='" + this._strings.buttons.next + "' onclick='task.displayedSubTask.changeTest(1)'/>" +
        "</div>";
    }

    $("#gridButtonsBefore").html(gridButtonsBefore);

    var gridButtonsAfter = this._strings.speed +
      "<select id='selectSpeed' onchange='task.displayedSubTask.changeSpeed()'>" +
      "  <option value='200'>" + this._strings.slowSpeed + "</option>" +
      "  <option value='50'>" + this._strings.mediumSpeed + "</option>" +
      "  <option value='5'>" + this._strings.fastSpeed + "</option>" +
      "  <option value='0'>" + this._strings.ludicrousSpeed + "</option>" +
      "</select>&nbsp;&nbsp;" +
      "<input type='button' value='" + this._strings.stopProgram + "' onclick='task.displayedSubTask.stop()'/><br/><br/>";
    if (nbTestCases > 1) {
      gridButtonsAfter += "<input type='button' value='" + this._strings.runProgram + "' onclick='task.displayedSubTask.run()'/>&nbsp;&nbsp;";
    }
    gridButtonsAfter +=
      "<input type='button' value='" + this._strings.submitProgram + "' onclick='task.displayedSubTask.submit()' />" +
      "<br/>" +
      "<div id='errors'></div>";
    $("#gridButtonsAfter").html(gridButtonsAfter);
  };

  this._loadBasicEditor = function () {
    $(CONSTANTS.HTML.EDITOR).html(
      this._loadXML() +
      this._loadLanguageSelector() +
      this._loadInstructionsTooltip() +
      this._loadEditorWorkSpace() +
      this._loadEditorTools()
    );

    this._loadGridButtons();
  };

  this._loadBlocklyEditor = function (_options) {

    var blocklyEditor = new BlocklyEditor('includeBlock', this._mainContext);

    var options = _options || {};

    options.divId = options.divId || 'blocklyDiv';

    if (this._visible) {
      var xml = blocklyEditor.getToolboxXml();

      var wsConfig = {
        toolbox: "<xml>" + xml + "</xml>",
        sounds: false,
        media: "http://static3.castor-informatique.fr/contestAssets/blockly/"
      };

      if (!this._groupByCategory) {
        wsConfig.comments = true;
        wsConfig.scrollbars = true;
        wsConfig.trashcan = true;
      }
      if (this._maxInstructions != undefined) {
        wsConfig.maxBlocks = this._maxInstructions;
      }
      if (options.readOnly) {
        wsConfig.readOnly = true;
      }

      blocklyEditor.addExtraBlocks();

      this._workspace = Blockly.inject(options.divId, wsConfig);

      var toolboxNode = $('#toolboxXml');

      if (toolboxNode.length != 0) {
        toolboxNode.html(xml);
      }

      Blockly.Trashcan.prototype.MARGIN_SIDE_ = 410;

      $(".blocklyToolboxDiv").css("background-color", "rgba(168, 168, 168, 0.5)");

      var that = this;

      var onchange = function (e) {
        window.focus();
        $('.blocklyCapacity').html(that.workspace.remainingCapacity());
      };

      this._workspace.addChangeListener(onchange);

      onchange();

    } else {

      this.workspace = new Blockly.Workspace();
    }

    this._programs = [];

    for (var iPlayer = this._mainContext.nbRobots - 1; iPlayer >= 0; iPlayer-=1) {
      this._programs[iPlayer] = { blockly: null, blocklyJS: "", blocklyPython: "", javascript: "", python: "" };
      this.languages[iPlayer] = "blockly";
      this.setPlayer(iPlayer);
      if (!options.noRobot) {
        var newXml;
        if (this._startingBlock) {
          newXml = '<xml><block type="robot_start" deletable="false" movable="false"></block></xml>';
        }
        else {
          newXml = '<xml></xml>';
        }

        Blockly.Events.recordUndo = false;
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(newXml), this.workspace);
        Blockly.Events.recordUndo = true;
      }
      this.savePrograms();
    }
  };

  this.setPlayer = function (newPlayer) {
    this._player = newPlayer;
    $("#selectPlayer").val(this._player);
    $(".robot0, .robot1").hide();
    $(".robot" + this._player).show();
  };

  this.savePrograms = function () {
    this._programs[this._player].javascript = $("#program").val();
    if (this._workspace) {
      var xml = Blockly.Xml.workspaceToDom(this._workspace);
      this._programs[this._player].blockly = Blockly.Xml.domToText(xml);
      this._programs[this._player].blocklyJS = this.getCode("javascript");
      this._programs[this._player].blocklyPython = this.getCode("python");
    }
  };

  this.render = function (language, display, nbTestCases, _options) {

    this._loadBasicEditor();

    switch (this._type) {
      case CONSTANTS.EDITOR_TYPE.BLOCKLY:
        this._loadBlocklyEditor(_options);
        break;
      case CONSTANTS.EDITOR_TYPE.JAVASCRIPT:
        break;
      case CONSTANTS.EDITOR_TYPE.PYTHON:
        break;
    }
  };


}





