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

  this._savePrograms = function () {
    if(this._aceEditor) {
      this._programs.python = this._aceEditor.getValue();
    }
  };

  this._loadPrograms = function () {
    if(this._aceEditor) {
      this._aceEditor.setValue(this._programs.python);
      this._aceEditor.selection.clearSelection();
    }
  };

  this.switchLanguage = function (e) {
    this._language = e.value;
  };

  this.load = function (language, display, nbTestCases, _options) {
    this._nbTestCases = nbTestCases;
    this._loadBasicEditor();
    if(this._aceEditor && ! this._aceEditor.getValue()) {
      this._aceEditor.setValue("from robot import *\n");
    }
  };

  this.unload = function () {
    this.stop();
  };

  /**
   * Code running specific operations
   */
  this.stopAndTryAgain = function () {
    this.stop();
    window.setTimeout(this.run.bind(this), 100);
  };

  this.getLanguage = function () {
    return this._language;
  };

  this.prepareRun = function () {
    if (!this._mainContext) { return; }

    var nbRunning = this._mainContext.runner.nbRunning();
    if (nbRunning > 0) {
      this.stopAndTryAgain();
      return undefined;
    }

    this._savePrograms();

    var codes = [];
    codes.push(this._programs.python);

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

    this._mainContext.runner.initCodes(codes);
  };

  this.run = function () {
    this.prepareRun();
    this._mainContext.runner.run();
  };

  this.step = function () {
    if(!this._mainContext.runner._isRunning) {
      this.prepareRun();
    }
    this._mainContext.runner.runStep();
  }

  this.stop = function () {
    if(this._mainContext.runner) {
      this._mainContext.runner.stop();
    }
  }

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
  this.isVisible = function () {
    return this._visible;
  };

  /**
   * DOM specific operations
   */
  this._loadXML = function () {
    return "<xml id='toolbox' style='display: none'></xml>";
  };
  this._loadInstructionsTooltip = function () {
    return CodeEditor.Utils.DOM.clearFix('', 'capacity');
  };
  this._loadEditorWorkSpace = function () {
    return CodeEditor.Utils.DOM.generateWorkspace();
  };
  this._loadEditorTools = function () {
    var saveOrLoadHtml = "<div id='saveOrLoad'>" +
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
    // TODO :: disabled
    return '';
  };
  this._loadBasicEditor = function () {
    if (this._mainContext.display) {
      CodeEditor.Utils.DOM.loadBasicEditor(
        this._loadXML() +
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

    var gridButtonsAfter = "<div id='selectSpeed'>" +
      "  <div class='btn-group'>\n" +
      "    <button type='button' class='btn btn-default btn-icon' onclick='task.displayedSubTask.stop()'>" + this._strings.stopProgram + " </button>\n" +
      "    <button type='button' class='btn btn-default btn-icon' onclick='task.displayedSubTask.step()'>" + this._strings.stepProgram + " </button>\n" +
      "    <button type='button' class='btn btn-default btn-icon' onclick='task.displayedSubTask.changeSpeed(200)'>" + this._strings.slowSpeed + "</button>\n" +
      "    <button type='button' class='btn btn-default btn-icon' onclick='task.displayedSubTask.changeSpeed(50)'>" + this._strings.mediumSpeed + "</button>\n" +
      "    <button type='button' class='btn btn-default btn-icon' onclick='task.displayedSubTask.changeSpeed(5)'>" + this._strings.fastSpeed + "</button>\n" +
      "    <button type='button' class='btn btn-default btn-icon' onclick='task.displayedSubTask.changeSpeed(0)'>" + this._strings.ludicrousSpeed + "</button>\n" +
      "  </div>" +
      "</div>" +
      "<button type='button' class='btn btn-primary' onclick='task.displayedSubTask.submit()'>" + this._strings.submitProgram + "</button>" +
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

      if(that._mainContext.runner && that._mainContext.runner._editorMarker) {
        that._aceEditor.session.removeMarker(that._mainContext.runner._editorMarker);
        that._mainContext.runner._editorMarker = null;
      }

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
    }
    this._prevWidth = panelWidth;
  };
 }

CodeEditor.Controllers.LogicController = LogicController;
