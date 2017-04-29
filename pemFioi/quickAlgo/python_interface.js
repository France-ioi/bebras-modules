/*
    python_interface:
        Python mode interface and running logic.
*/

function LogicController(nbTestCases, maxInstructions) {

  /**
   * Class properties
   */
  this._nbTestCases = nbTestCases;
  this._maxInstructions = maxInstructions || undefined;
  this._language = 'python';
  this._textFile = null;
  this._extended = false;
  this.programs = [{
    blockly: null,
    blocklyJS: null,
    javascript: null,
  }];
  this._aceEditor = null;
  this._workspace = null;
  this._prevWidth = 0;
  this._startingBlock = true;
  this._visible = true;
  this._strings = window.languageStrings;
  this.includeBlocks = null;

  this.loadContext = function (mainContext) {
    this._mainContext = mainContext;
  }

  this.savePrograms = function () {
    if(this._aceEditor) {
      this.programs[0].blockly = this._aceEditor.getValue();
    }
  };

  this.loadPrograms = function () {
    if(this._aceEditor) {
      this._aceEditor.setValue(''+this.programs[0].blockly);
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
      this._aceEditor.setValue(this.getDefaultContent());
    }
  };

  this.unload = function () {
    this.stop();
  };

  this.getCodeFromXml = function (code, lang) {
    // TODO :: rename
    return code;
  };

  this.getFullCode = function (code) {
    // TODO :: simplify
    return code;
  }

  this.getDefaultContent = function () {
    return "from robot import *\n";
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

    this.savePrograms();

    var codes = [];
    codes.push(this.programs[0].blockly);

    var code = codes[0];
    var forbidden = pythonForbidden(code, this.includeBlocks);
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
            that.programs[0][that.player].blockly = code;
          } catch (e) {
            $("#errors").html(that.strings.invalidContent);
          }
          that.languages[that.player] = "blockly";
        } else {
          that.programs[0][that.player].javascript = code;
          that.languages[that.player] = "javascript";
        }
        that.loadPrograms();
      };

      reader.readAsText(file);
    } else {
      $("#errors").html(this.strings.unknownFileType);
    }
  };
  this._downloadProgram = function () {
    this.savePrograms();
    var code = this.programs[0].blockly;
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
    this.includeBlocks = blocks;
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
  this._loadInstructionsTooltip = function () {
    return "<div id='capacity' class='clearBoth' ></div>";
  };
  this._loadEditorWorkSpace = function () {
    return "<div id='blocklyContainer'>" + // TODO :: change ID here and in CSS
           "<div id='python-workspace' class='language_python' style='width: 100%; height: 100%'></div>" +
           "</div>";
  };
  this._loadBasicEditor = function () {
    if (this._mainContext.display) {
      $('#languageInterface').html(
        this._loadInstructionsTooltip() +
        this._loadEditorWorkSpace()
      );
      this._loadAceEditor();
      this._bindEditorEvents();
    }
  };
  this._loadAceEditor = function () {
    this._aceEditor = ace.edit('python-workspace');
    this._aceEditor.$blockScrolling = Infinity;
    this._aceEditor.getSession().setMode("ace/mode/python");
    this._aceEditor.setFontSize(16);
  };
  this._bindEditorEvents = function () {
    $('body').on('click', function () { $('.blocklyDropDownDiv').remove(); });
    var that = this;
    var onEditorChange = function () {
      if(!maxInstructions || !that._aceEditor) { return; }

      if(that._mainContext.runner && that._mainContext.runner._editorMarker) {
        that._aceEditor.session.removeMarker(that._mainContext.runner._editorMarker);
        that._mainContext.runner._editorMarker = null;
      }

      var code = that._aceEditor.getValue();

      var forbidden = pythonForbidden(code, that.includeBlocks);
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

      // Interrupt any ongoing execution
      if(that._mainContext.runner) {
         that._mainContext.runner.stop();
         that._mainContext.reset();
      }

      // Close reportValue popups
      $('.blocklyDropDownDiv').remove();
    }
    this._aceEditor.getSession().on('change', debounce(onEditorChange, 500, false))
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

    if(this.includeBlocks && this.includeBlocks.generatedBlocks) {
      pythonHtml += '<p>Votre programme doit commencer par la ligne :</p>'
                  +  '<p><code>from robot import *</code></p>'
                  +  '<p>Les fonctions disponibles pour contrôler le robot sont :</p>'
                  +  '<ul>';

      for (var generatorName in this.includeBlocks.generatedBlocks) {
        var blockList = this.includeBlocks.generatedBlocks[generatorName];
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

    var pflInfos = pythonForbiddenLists(this.includeBlocks);

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
    // Currently unused
    if (!this.extended) {
      this.extended = true;
      $('#editorContainer').css("width", "800px");
      $("#extendButton").val("<<");
    } else {
      this.extended = false;
      $('#editorContainer').css("width", "500px");
      $("#extendButton").val(">>");
    }
    this.updateSize();
  };
  this.updateSize = function () {
    var panelWidth = 500;
    panelWidth = $('#editorContainer').width() - 30;
    if (panelWidth != this._prevWidth) {
      $("#taskIntro").css("width", panelWidth);
      $("#grid").css("left", panelWidth + 20 + "px");
    }
    this._prevWidth = panelWidth;
  };
}

function getBlocklyHelper(maxBlocks, nbTestCases) {
  return new LogicController(nbTestCases, maxBlocks);
}
