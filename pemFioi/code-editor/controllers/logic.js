/*!
 * @author John Ropas
 * @since 19/12/2016
 */

function LogicController(nbTestCases, maxInstructions, language, mainContext) {

  /**
   * Class properties
   */
  this._nbTestCases = mainContext.nbTestCases;
  this._maxInstructions = maxInstructions || undefined;
  this._language = language || CodeEditor.CONST.SETTINGS.DEFAULT_LANGUAGE;
  this._textFile = null;
  this._extended = false;
  this._programs = {
    blockly: null,
    blocklyJS: null,
    javascript: null,
    python: null
  };
  this._aceEditor = null;
  this._workspace = null;
  this._prevWidth = 0;
  this._mainContext = mainContext;
  this._startingBlock = true;
  this._visible = true;
  this._localization = CodeEditor.CONST.SETTINGS.DEFAULT_LOCALIZATION;
  this._strings = CodeEditor.Utils.Localization.Strings[this._localization];
  this._includeBlocks = null;

  this._blocklyControler = null;

  this._loadBlocklyController = function (_options) {

    this._blocklyControler = new CodeEditor.Controllers.BlocklyController(
      this._includeBlocks,
      this._mainContext,
      this._strings
    );

    this._blocklyControler.createGeneratorsAndBlocks();

    var options = _options || {};

    options.divId = options.divId || CodeEditor.Utils.DOM.Elements.BLOCKLY_WORKSPACE;

    if (this._visible) {
      var xml = this._blocklyControler.getToolboxXml();

      var wsConfig = {
        toolbox: "<xml>" + xml + "</xml>",
        sounds: false,
        media: "http://static3.castor-informatique.fr/contestAssets/blockly/"
      };


      wsConfig.comments = true;
      wsConfig.scrollbars = true;
      wsConfig.trashcan = true;

      if (this._maxInstructions != undefined) {
        wsConfig.maxBlocks = this._maxInstructions;
      }
      if (options.readOnly) {
        wsConfig.readOnly = true;
      }

      this._blocklyControler.addExtraBlocks();

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

        if(maxInstructions) {
          var remaining = that._workspace.remainingCapacity();
          var optLimitBlocks = {
             maxBlocks: maxInstructions,
             remainingBlocks: Math.abs(remaining)
             };
          var strLimitBlocks = remaining < 0 ? that._strings.limitBlocksOver : that._strings.limitBlocks;
          $('#capacity').css('color', remaining < 0 ? 'red' : '');
          $('#capacity').html(strLimitBlocks.format(optLimitBlocks));
        }
      };

      this._workspace.addChangeListener(onchange);

      onchange();

    } else {

      this._workspace = new Blockly.Workspace();
    }

    if (!options.noRobot) {
      var newXml;
      if (this._startingBlock) {
        newXml = '<xml><block type="robot_start" deletable="false" movable="false"></block></xml>';
      }
      else {
        newXml = '<xml></xml>';
      }

      Blockly.Events.recordUndo = false;
      Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(newXml), this._workspace);
      Blockly.Events.recordUndo = true;
    }
    this._savePrograms();
  };

  this._savePrograms = function () {
    this._programs.javascript = $(CodeEditor.Utils.DOM.Elements.JAVASCRIPT_WORKSPACE).val();
    if(this._aceEditor) {
      this._programs.python = this._aceEditor.getValue();
    }
    if (this._workspace) {
      var xml = Blockly.Xml.workspaceToDom(this._workspace);
      this._programs.blockly = Blockly.Xml.domToText(xml);
      this._programs.blocklyJS = this._getCodeFromBlocks(CodeEditor.CONST.LANGUAGES.JAVASCRIPT);
    }
  };

  this._loadPrograms = function () {
    $(CodeEditor.Utils.DOM.Elements.JAVASCRIPT_WORKSPACE).val(this._programs.javascript);
    if(this._aceEditor) {
      this._aceEditor.setValue(this._programs.python);
      this._aceEditor.selection.clearSelection();
    }
    if (this._workspace) {
      var xml = Blockly.Xml.textToDom(this._programs.blockly);
      this._workspace.clear();
      Blockly.Xml.domToWorkspace(xml, this._workspace);
    }
  };

  this._getCodeFromBlocks = function (language, codeWs) {

    var codeWorkspace = codeWs || this._workspace;

    var blocks = codeWorkspace.getTopBlocks(true);

    var languageObj = null;

    if (language === CodeEditor.CONST.LANGUAGES.JAVASCRIPT) {
      languageObj = Blockly.JavaScript;
    } else if (language === CodeEditor.CONST.LANGUAGES.PYTHON) {
      languageObj = Blockly.Python;
    }

    languageObj.init(codeWorkspace);

    var code = [];

    var comments = [];

    for (var b = 0; b < blocks.length; b++) {
      var block = blocks[b];
      var blockCode = languageObj.blockToCode(block);
      if (["procedures_defnoreturn", "procedures_defreturn"].indexOf(block.type) > -1) {
        // For function blocks, the code is stored in languageObj.definitions_
      } else {
        if (block.type == "robot_start" || !this._startingBlock) {
          comments.push(blockCode);
        }
      }
    }

    for (var def in languageObj.definitions_) {
      code.push(languageObj.definitions_[def]);
    }

    code = code.join("\n");
    code += comments.join("\n");

    return code;
  };

  this.switchLanguage = function (e) {
    this._language = e.value;
    CodeEditor.Utils.DOM.displayLanguageWorkspace(this._language);
  };

  this.importFromBlockly = function (e) {
    this._programs.python = '';
    this._programs.javascript = '';

    switch (this._language) {
      case CodeEditor.CONST.LANGUAGES.JAVASCRIPT:
        this._programs.javascript = this._getCodeFromBlocks(CodeEditor.CONST.LANGUAGES.JAVASCRIPT);
        $(CodeEditor.Utils.DOM.Elements.JAVASCRIPT_WORKSPACE).val(this._programs.javascript);
        break;
      case CodeEditor.CONST.LANGUAGES.PYTHON:
        this._programs.python = this._getCodeFromBlocks(CodeEditor.CONST.LANGUAGES.JAVASCRIPT);
        this._aceEditor.setValue(this._programs.python);
        break;
    }
  };

  this.load = function (language, display, nbTestCases, _options) {
    this._nbTestCases = nbTestCases;
    this._loadBasicEditor();
    CodeEditor.Utils.DOM.displayLanguageWorkspace(this._language);
    switch (this._language) {
      case CodeEditor.CONST.LANGUAGES.BLOCKLY:
        this._loadBlocklyController(_options);
        break;
      case CodeEditor.CONST.LANGUAGES.JAVASCRIPT:
        break;
      case CodeEditor.CONST.LANGUAGES.PYTHON:
        if(this._aceEditor && ! this._aceEditor.getValue()) {
          this._aceEditor.setValue("from robot import *\n");
        }
        break;
    }
  };

  this.unload = function () {
    var ws = this._workspace;
    if (ws != null) {
      ws.dispose();
      if (false) {
        $(".blocklyWidgetDiv").remove();
        $(".blocklyTooltipDiv").remove();
        document.removeEventListener("keydown", Blockly.onKeyDown_); // TODO: find correct way to remove all event listeners
        delete Blockly;
      }
    }
    this.stop();
  };

  /**
   * Code running specific operations
   */
  this.getBlocklyLibCode = function (generators) {
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
  };

  this.stopAndTryAgain = function () {
    this._mainContext.runner.stop();
    window.setTimeout(this.run.bind(this), 100);
  };

  this.getLanguage = function () {
    return this._language;
  };

  this.run = function () {
    if (this._mainContext) {
      var nbRunning = this._mainContext.runner.nbRunning();
      if (nbRunning > 0) {
        this.stopAndTryAgain();
        return undefined;
      }

      if (this._language == 'blockly') {
        if (this._mainContext.display) {
          Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
          Blockly.JavaScript.addReservedWords('highlightBlock');
        } else {
          Blockly.JavaScript.STATEMENT_PREFIX = '';
        }
      }

      this._savePrograms();

      var codes = [];

      switch (this._language) {
        case CodeEditor.CONST.LANGUAGES.BLOCKLY:
          codes.push(this.getFullCode(this._programs.blocklyJS));
          break;
        case CodeEditor.CONST.LANGUAGES.JAVASCRIPT:
          codes.push(this.getFullCode(this._programs.javascript));
          break;
        case CodeEditor.CONST.LANGUAGES.PYTHON:
          codes.push(this._programs.python);
          break;
      }

      if (this._language == 'blockly') {
        this._workspace.traceOn(true);
        this._workspace.highlightBlock(null);
      }

      if(this._language == CodeEditor.CONST.LANGUAGES.PYTHON) {
        var code = codes[0];
        var forbidden = pythonForbidden(code, this._includeBlocks);
        if(forbidden) {
          $('#errors').html("Le mot-clé "+forbidden+" est interdit ici !");
          return;
        }
        if(pythonCount(code) > maxInstructions) {
          $('#errors').html("Vous utilisez trop d'éléments Python !");
          return;
        }
        if(pythonCount(code) <= 0) {
          $('#errors').html("Vous ne pouvez pas valider un programme vide !");
          return;
        }
        var match = /from\s+robot\s+import\s+\*/.exec(code);
        if(match === null) {
          $('#errors').html("Vous devez mettre la ligne <code>from robot import *</code> dans votre programme.");
          return;
        }
      }

      this._mainContext.runner.runCodes(codes);
    }
  };

  this.stop = function () {
    if(this._mainContext.runner) {
      this._mainContext.runner.stop();
    }
  }

  this.getFullCode = function (code) {
    return this.getBlocklyLibCode(this.generators) + code + "program_end()";
  };

  /**
   *  IO specific operations
   */
  this._handleFiles = function (files) {
    var that = this;
    if (files.length < 0) {
      return;
    }
    var file = files[0];
    var textType = /text.*/;
    if (file.type.match(textType)) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var code = reader.result;
        if (code[0] == "<") {
          try {
            var xml = Blockly.Xml.textToDom(code);
            that.programs[that.player].blockly = code;
          } catch (e) {
            $("#errors").html(that.strings.invalidContent);
          }
          that.languages[that.player] = "blockly";
        } else {
          that.programs[that.player].javascript = code;
          that.languages[that.player] = "javascript";
        }
        that._loadPrograms();
      };

      reader.readAsText(file);
    } else {
      $("#errors").html(this.strings.unknownFileType);
    }
  };
  this._downloadProgram = function () {
    this._savePrograms();
    var code = this._programs[this._language];
    var data = new Blob([code], { type: 'text/plain' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (this.textFile !== null) {
      window.URL.revokeObjectURL(this.textFile);
    }

    this.textFile = window.URL.createObjectURL(data);

    // returns a URL you can use as a href
    $("#saveUrl").html("<a href='" + this.textFile + "' download='robot_" + this.languages[this.player] + "_program.txt'>" + this.strings.download + "</a>");
    return this.textFile;
  };

  /**
   * Getters & Setters
   */
  this.setLocalization = function (localization) {
    this._localization = localization;
  };
  this.getLocalization = function () {
    return this._localization;
  };
  this.getLocalizedStrings = function () {
    return this._strings;
  };
  this.setIncludeBlocks = function (blocks) {
    this._includeBlocks = blocks;
    this.updateTaskIntro();
  };
  this.setMainContext = function (mainContext) {
    this._mainContext = mainContext;
  };
  this.isVisible = function (visibleBool) {
    this._visible = visibleBool;
  };
  this.isVisible = function () {
    return this._visible;
  };

  /**
   * DOM specific operations
   */
  this._loadXML = function () {
    return "<xml id='toolbox' style='display: none'></xml>";
  };
  this._loadLanguageSelector = function () {
    return "<div id='lang'>" +
      " <p>" + this._strings.selectLanguage +
      "   <select id='selectLanguage' onchange='task.displayedSubTask.logicController.switchLanguage(this)'>" +
      "     <option value='" + CodeEditor.CONST.LANGUAGES.BLOCKLY + "'>" + this._strings.blocklyLanguage +
      "     </option>" +
      "     <option value='" + CodeEditor.CONST.LANGUAGES.JAVASCRIPT + "'>" + this._strings.javascriptLanguage +
      "     </option>" +
      "     <option value='" + CodeEditor.CONST.LANGUAGES.PYTHON + "'>" + this._strings.pythonLanguage +
      "     </option>" +
      "   </select>" +
      "   <input type='button' class='language_javascript' value='" + this._strings.importFromBlockly + "'" +
      "   onclick='task.displayedSubTask.logicController.importFromBlockly()' />" +
      " </p>" +
      "</div>";
  };
  this._loadInstructionsTooltip = function () {
    return CodeEditor.Utils.DOM.clearFix('', 'capacity');
  };
  this._loadEditorWorkSpace = function () {
    return CodeEditor.Utils.DOM.generateWorkspace();
  };
  this._loadEditorTools = function () {
    return "<div id='saveOrLoad'>" +
      " <p><b>" + this._strings.saveOrLoadProgram + "</b></p>" +
      " <p>" + this._strings.avoidReloadingOtherTask + "</p>" +
      " <p>" + this._strings.reloadProgram +
      "   <input type='file' id='input' onchange='task.displayedSubTask.blocklyHelper.handleFiles(this.files);resetFormElement($(\"#input\"))'>" +
      " </p>" +
      " <p>" +
      "   <input type='button' value='" + this._strings.saveProgram + "' onclick='task.displayedSubTask.blocklyHelper._downloadProgram()' />" +
      "   <span id='saveUrl'></span>" +
      " </p>" +
      "</div>";
  };
  this._loadBasicEditor = function () {
    if (this._mainContext.display) {
      CodeEditor.Utils.DOM.loadBasicEditor(
        this._loadXML() +
//        this._loadLanguageSelector() +
        this._loadInstructionsTooltip() +
        this._loadEditorWorkSpace() +
        this._loadEditorTools()
      );
      this._loadAceEditor();
      this._loadGridButtons();
      this._bindEditorEvents();
    }
  };
  this._loadGridButtons = function () {

    var gridButtonsBefore = "";

    if (this._nbTestCases > 1) {
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
    if (this._nbTestCases > 0) {
      gridButtonsAfter += "<input type='button' value='" + this._strings.runProgram + "' onclick='task.displayedSubTask.run()'/>&nbsp;&nbsp;";
    }
    gridButtonsAfter +=
      "<input type='button' value='" + this._strings.submitProgram + "' onclick='task.displayedSubTask.submit()' />" +
      "<br/>" +
      "<div id='errors' style='width: 400px'></div>";
    $("#gridButtonsAfter").html(gridButtonsAfter);
  };
  this._loadAceEditor = function () {
    this._aceEditor = ace.edit(CodeEditor.Utils.DOM.Elements.PYTHON_WORKSPACE_ID);
    this._aceEditor.$blockScrolling = Infinity;
    this._aceEditor.getSession().setMode("ace/mode/python");
    this._aceEditor.setFontSize(16);
  };
  this._bindEditorEvents = function () {
    var that = this;
    var updatePythonCount = function () {
      if(that._language != 'python' || !maxInstructions || !that._aceEditor) { return; }
      var code = that._aceEditor.getValue();

      var forbidden = pythonForbidden(code, that._includeBlocks);
      if(forbidden) {
        $('#capacity').css('color', 'red');
        $('#capacity').html("Mot-clé interdit utilisé : "+forbidden);
        return;
      }

      var remaining = maxInstructions - pythonCount(code);
      var optLimitElements = {
         maxBlocks: maxInstructions,
         remainingBlocks: Math.abs(remaining)
         };
      var strLimitElements = remaining < 0 ? that._strings.limitElementsOver : that._strings.limitElements;
      $('#capacity').css('color', remaining < 0 ? 'red' : '');
      $('#capacity').html(strLimitElements.format(optLimitElements));
    }
    this._aceEditor.getSession().on('change', debounce(updatePythonCount, 500, false))
  };

  this.updateTaskIntro = function () {
    var pythonDiv = $('#taskIntro .pythonIntro');
    if(pythonDiv.length == 0) {
      pythonDiv = $('<div class="pythonIntro"></div>').appendTo('#taskIntro');
    }

    if(this._mainContext.infos.noPythonHelp) {
       pythonDiv.html('');
       return;
    }

    var pythonHtml = '<hr />';

    if(this._includeBlocks && this._includeBlocks.generatedBlocks) {
      pythonHtml += '<p>Votre programme doit commencer par la ligne :</p>'
                  +  '<p><code>from robot import *</code></p>'
                  +  '<p>Les fonctions disponibles pour contrôler le robot sont :</p>'
                  +  '<ul>';

      for (var generatorName in this._includeBlocks.generatedBlocks) {
        var blockList = this._includeBlocks.generatedBlocks[generatorName];
        for (var iBlock=0; iBlock < blockList.length; iBlock++) {
          var blockName = blockList[iBlock];
          var blockDesc = this._mainContext.strings.description[blockName];
          if (!blockDesc) {
            var funcName = this._mainContext.strings.code[blockName];
            if (!funcName) {
              funcName = blockName;
            }
            blockDesc = funcName + '()';
          }
          pythonHtml += '<li><code>' + blockDesc + '</code></li>';
        }
      }
      pythonHtml += '</ul>';
    }

    var pflInfos = pythonForbiddenLists(this._includeBlocks);

    var elifIdx = pflInfos.allowed.indexOf('elif');
    if(elifIdx >= 0) {
      pflInfos.allowed.splice(elifIdx, 1);
    }
    elifIdx = pflInfos.forbidden.indexOf('elif');
    if(elifIdx >= 0) {
      pflInfos.forbidden.splice(elifIdx, 1);
    }

    var listsIdx = pflInfos.allowed.indexOf('list_brackets');
    if(listsIdx >= 0) {
      pflInfos.allowed[listsIdx] = 'crochets [ ]';
    }
    listsIdx = pflInfos.forbidden.indexOf('list_brackets');
    if(listsIdx >= 0) {
      pflInfos.forbidden[listsIdx] = 'crochets [ ]';
    }

    if(pflInfos.allowed.length == 1) {
      pythonHtml += '<p>Le mot-clé suivant est autorisé : <code>' + pflInfos.allowed[0] + '</code></p>';
    } else if (pflInfos.allowed.length > 0) {
      pythonHtml += '<p>Les mots-clés suivants sont autorisés : <code>' + pflInfos.allowed.join('</code>, <code>') + '</code></p>';
    }
    if(pflInfos.forbidden.length == 1) {
      pythonHtml += '<p>Le mot-clé suivant est interdit : <code>' + pflInfos.forbidden[0] + '</code></p>';
    } else if(pflInfos.forbidden.length > 0) {
      pythonHtml += '<p>Les mots-clés suivants sont interdits : <code>' + pflInfos.forbidden.join('</code>, <code>') + '</code></p>';
    }

    pythonHtml += '<p>Vous êtes autorisé à lire de la documentation sur python ou utiliser un moteur de recherche pendant le concours.</p>';
    pythonDiv.html(pythonHtml);
  };

  this.toggleSize = function () {
    if (!this.extended) {
      this.extended = true;
      $(CodeEditor.Utils.DOM.Elements.EDITOR_CONTAINER).css("width", "800px");
      $("#extendButton").val("<<");
    } else {
      this.extended = false;
      $(CodeEditor.Utils.DOM.Elements.EDITOR_CONTAINER).css("width", "500px");
      $("#extendButton").val(">>");
    }
    this.updateSize();
  };
  this.updateSize = function () {
    var panelWidth = 500;
    panelWidth = $(CodeEditor.Utils.DOM.Elements.EDITOR_CONTAINER_ID).width() - 30;
    if (panelWidth != this._prevWidth) {
      $("#taskIntro").css("width", panelWidth);
      $("#grid").css("left", panelWidth + 20 + "px");
      if (this._language === CodeEditor.CONST.LANGUAGES.BLOCKLY) {
        Blockly.Trashcan.prototype.MARGIN_SIDE_ = panelWidth - 90;
        Blockly.svgResize(this._workspace);
      }
    }
    this._prevWidth = panelWidth;
  };
 }

CodeEditor.Controllers.LogicController = LogicController;
