/*
    python_interface:
        Python mode interface and running logic.
*/

function LogicController(nbTestCases, maxInstructions) {
  /**
   * Class properties
   */
  this._nbTestCases = nbTestCases;
  this._maxInstructions = maxInstructions || null;
  this.language = 'python';
  this._textFile = null;
  this._extended = false;
  this.programs = [{
    blockly: null,
    blocklyJS: null,
    javascript: null
  }];
  this._aceEditor = null;
  this._workspace = null;
  this._prevWidth = 0;
  this._startingBlock = true;
  this._visible = true;
  this._strings = window.languageStrings;
  this._options = {};
  this._readOnly = false;
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

  this.loadExample = function (example) {
    if(!example.python) { return; }
    this._aceEditor.setValue('' + example.python + '\n\n' + this._aceEditor.getValue());
    var Range = ace.require('ace/range').Range;
    this._aceEditor.selection.setRange(new Range(0, 0, example.python.split(/\r\n|\r|\n/).length, 0));
  };

  this.switchLanguage = function (e) {
    this.language = e.value;
  };

  this.load = function (language, display, nbTestCases, options) {
    this._nbTestCases = nbTestCases;
    this._options = options;
    this._loadBasicEditor();

    if(this._aceEditor && ! this._aceEditor.getValue()) {
      if(options.defaultCode !== undefined)
         this._aceEditor.setValue(options.defaultCode);
      else
         this._aceEditor.setValue(this.getDefaultContent());
    }
  };

  this.unload = function () {
    this.stop();
    this._unbindEditorEvents();
  };

  this.unloadLevel = this.unload;

  this.getCodeFromXml = function (code, lang) {
    // TODO :: rename
    return code;
  };

  this.getFullCode = function (code) {
    // TODO :: simplify
    return code;
  }

  this.getCode = function(language) {

    if (language == "python")
      return this._aceEditor.getValue();
    return "";
  }

  this.checkCode = function(code, display) {
    // Check a code before validation; display is a function which will get
    // error messages
    var forbidden = pythonForbidden(code, this.includeBlocks);
    if(!display) {
       display = function() {};
    }

    if(forbidden) {
      display("Le mot-clé "+forbidden+" est interdit ici !");
      return false;
    }
    if(maxInstructions && pythonCount(code) > maxInstructions) {
      display("Vous utilisez trop d'éléments Python !");
      return false;
    }
    var limited = this.findLimited(code);
    if(limited) {
      display('Vous utilisez trop souvent un mot-clé à utilisation limitée : "'+limited+'".');
    }
    if(pythonCount(code) <= 0) {
      display("Vous ne pouvez pas valider un programme vide !");
      return false;
    }
    var availableModules = this.getAvailableModules();
    for(var i=0; i < availableModules.length; i++) {
      var match = new RegExp('from\\s+' + availableModules[i] + '\\s+import\\s+\\*');
      match = match.exec(code);
      if(match === null) {
        display("Vous devez mettre la ligne <code>from " + availableModules[i] + " import *</code> dans votre programme.");
        return false;
      }
    }
    return true;
  }

  this.getDefaultContent = function () {
    var availableModules = this.getAvailableModules();
    var content = '';
    for(var i=0; i < availableModules.length; i++) {
      content += 'from ' + availableModules[i] + ' import *\n';
    }
    return content;
  };

  /**
   * Code running specific operations
   */
  this.stopAndTryAgain = function () {
    this.stop();
    window.setTimeout(this.run.bind(this), 100);
  };

  this.getLanguage = function () {
    return this.language;
  };

  this.prepareRun = function () {
    if (!this._mainContext) { return; }

    var nbRunning = this._mainContext.runner.nbRunning();
    if (nbRunning > 0) {
      this.stopAndTryAgain();
      return undefined;
    }

    // Get code
    this.savePrograms();
    var codes = [];
    codes.push(this.programs[0].blockly);
    var code = codes[0];

    // Abort if code is not valid
    if(!this.checkCode(code, function(err) {
      if(window.quickAlgoInterface) {
        window.quickAlgoInterface.displayError(err);
        window.quickAlgoInterface.setPlayPause(false);
      } else {
        $('#errors').html(err);
      }
    })) {
       return;
    }

    // Initialize runner
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

            if(window.quickAlgoInterface) {
              window.quickAlgoInterface.displayError(that._strings.invalidContent);
            } else {
              $("#errors").html(that._strings.invalidContent);
            }
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

      if(window.quickAlgoInterface) {
        window.quickAlgoInterface.displayError(this._strings.unknownFileType);
      } else {
        $("#errors").html(this._strings.unknownFileType);
      }
    }
  };
  this.saveProgram = function () {
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
    $("#saveUrl").html("<a id='downloadAnchor' href='" + this.textFile + "' download='robot_python_program.txt'>" + this._strings.download + "</a>");
    var downloadAnchor = document.getElementById('downloadAnchor');
    downloadAnchor.click();
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
  this._loadEditorWorkSpace = function () {
    return "<div id='blocklyContainer'>" + // TODO :: change ID here and in CSS
           "<div id='python-workspace' class='language_python' style='width: 100%; height: 100%'></div>" +
           "</div>";
  };
  this._loadBasicEditor = function () {
    if (this._mainContext.display) {
      $('#languageInterface').html(
        this._loadEditorWorkSpace()
      );
      if(window.quickAlgoResponsive) {
        $('#blocklyLibContent').prepend('<div class="pythonIntroSimple"></div>');
        $('#editorBar').prependTo('#languageInterface');
      }
      this._loadAceEditor();
      this._bindEditorEvents();
      this.updateTaskIntro();
    }
  };
  this.onResize = function() {
    // On resize function to be called by the interface
    this._aceEditor.resize();
  };
  this._loadAceEditor = function () {
    this._aceEditor = ace.edit('python-workspace');
    this._aceEditor.setOption('readOnly', !!this._options.readOnly);
    this._aceEditor.$blockScrolling = Infinity;
    this._aceEditor.getSession().setMode("ace/mode/python");
    this._aceEditor.setFontSize(16);
  };

  this.findLimited = function(code) {
    if(this._mainContext.infos.limitedUses) {
      return pythonFindLimited(code, this._mainContext.infos.limitedUses, this._mainContext.strings.code);
    } else {
      return false;
    }
  };

  this.getCapacityInfo = function() {
    // Handle capacity display
    var code = this._aceEditor.getValue();

    var forbidden = pythonForbidden(code, this.includeBlocks);
    if(forbidden) {
      return {text: "Mot-clé interdit utilisé : "+forbidden, invalid: true, type: 'forbidden'};
    }
    var text = '';
    var remaining = 1;
    if(maxInstructions) {
      remaining = maxInstructions - pythonCount(code);
      var optLimitElements = {
        maxBlocks: maxInstructions,
        remainingBlocks: Math.abs(remaining)
      };
      var strLimitElements = remaining < 0 ? this._strings.limitElementsOver : this._strings.limitElements;
      text = strLimitElements.format(optLimitElements);
    }
    if(remaining < 0) {
      return {text: text, invalid: true, type: 'capacity'};
    }
    var limited = this.findLimited(code);
    if(limited) {
      return {text: 'Vous utilisez trop souvent un mot-clé à utilisation limitée : "'+limited+'".', invalid: true, type: 'limited'};
    } else if(remaining == 0) {
      return {text: text, warning: true, type: 'capacity'};
    }
    return {text: text, type: 'capacity'};
  };

  this._removeDropDownDiv = function() {
    $('.blocklyDropDownDiv').remove();
  }

  this._bindEditorEvents = function () {
    $('body').on('click', this._removeDropDownDiv);
    var that = this;
    var onEditorChange = function () {
      if(!that._aceEditor) { return; }

      if(that._mainContext.runner && that._mainContext.runner._editorMarker) {
        that._aceEditor.session.removeMarker(that._mainContext.runner._editorMarker);
        that._mainContext.runner._editorMarker = null;
      }

      if(window.quickAlgoInterface) {
        window.quickAlgoInterface.displayCapacity(that.getCapacityInfo());
      } else {
        $('#capacity').html(that.getCapacityInfo().text);
      }

      // Interrupt any ongoing execution
      if(that._mainContext.runner) {
         that._mainContext.runner.stop();
         that._mainContext.reset();
      }

      if(window.quickAlgoInterface) {
        window.quickAlgoInterface.displayError(null);
      } else {
        $("#errors").html('');
      }

      // Close reportValue popups
      $('.blocklyDropDownDiv').remove();
    }
    this._aceEditor.getSession().on('change', debounce(onEditorChange, 500, false))
  };

  this._unbindEditorEvents = function () {
    $('body').off('click', this._removeDropDownDiv);
  }

  this.getAvailableModules = function () {
    if(this.includeBlocks && this.includeBlocks.generatedBlocks) {
      var availableModules = [];
      for (var generatorName in this.includeBlocks.generatedBlocks) {
        if(this.includeBlocks.generatedBlocks[generatorName].length) {
          availableModules.push(generatorName);
        }
      }
      return availableModules;
    } else {
      return [];
    }
  };

  this.updateTaskIntro = function () {
    if(!this._mainContext.display) { return; }
    if($('.pythonIntro').length == 0) {
      quickAlgoInterface.appendTaskIntro('<hr class="pythonIntroElement long" />'
        + '<div class="pythonIntro pythonIntroElement long">'
        + '  <div class="pythonIntroSimple"></div>'
        + '  <div class="pythonIntroFull"></div>'
        + '  <div class="pythonIntroBtn"></div>'
        + '</div>');
    }

    $('.pythonIntro').off('click', 'code');
    if(this._mainContext.infos.noPythonHelp) {
       $('.pythonIntroElement').css('display', 'none');
       return;
    }
    $('.pythonIntroElement').css('display', '');

    var fullHtml = '';
    var simpleHtml = '';

    var availableModules = this.getAvailableModules();
    if(availableModules.length) {
      fullHtml += '<p>Votre programme doit commencer par ';
      fullHtml += (availableModules.length > 1) ? 'les lignes' : 'la ligne';
      fullHtml += ' :</p>'
                 +  '<p><code>'
                 +  'from ' + availableModules[0] + ' import *';
      for(var i=1; i < availableModules.length; i++) {
        fullHtml += '\nfrom ' + availableModules[i] + ' import *';
      }
      fullHtml += '</code></p>'
                 +  '<p>Les fonctions disponibles pour contrôler le robot sont :</p>'
                 +  '<ul>';
      simpleHtml += 'Fonctions disponibles : ';

      var availableConsts = [];

      // Generate list of functions available
      var simpleElements = [];
      for (var generatorName in this.includeBlocks.generatedBlocks) {
        var blockList = this.includeBlocks.generatedBlocks[generatorName];
        for (var iBlock=0; iBlock < blockList.length; iBlock++) {
          var blockDesc = '', funcProto = '';
          if (this._mainContext.docGenerator) {
            blockDesc = this._mainContext.docGenerator.blockDescription(blockList[iBlock]);
          } else {
            var blockName = blockList[iBlock];
            blockDesc = this._mainContext.strings.description[blockName];
            if (!blockDesc) {
              funcProto = (this._mainContext.strings.code[blockName] || blockName) + '()';
              blockDesc = '<code>' + funcProto + '</code>';
            } else if (blockDesc.indexOf('</code>') < 0) {
              var funcProtoEnd = blockDesc.indexOf(')') + 1;
              funcProto = blockDesc.substring(0, funcProtoEnd);
              blockDesc = '<code>' + funcProto + '</code>' + blockDesc.substring(funcProtoEnd);
            }
          }
          funcProto = funcProto || blockDesc.substring(blockDesc.indexOf('<code>') + 6, blockDesc.indexOf('</code>'));
          fullHtml += '<li>' + blockDesc + '</li>';
          simpleElements.push(funcProto);
        }

        // Handle constants as well
        if(this._mainContext.customConstants && this._mainContext.customConstants[generatorName]) {
          var constList = this._mainContext.customConstants[generatorName];
          for(var iConst=0; iConst < constList.length; iConst++) {
            var name = constList[iConst].name;
            if(this._mainContext.strings.constant && this._mainContext.strings.constant[name]) {
              name = this._mainContext.strings.constant[name];
            }
            availableConsts.push(name);
          }
        }
      }
      simpleHtml += '<code>' + simpleElements.join('</code>, <code>') + '</code>.';
      fullHtml += '</ul>';
    }

    if(availableConsts.length) {
      fullHtml += '<p>Les constantes disponibles sont : <code>' + availableConsts.join('</code>, <code>') + '</code>.</p>';
      simpleHtml += '<br />Constantes disponibles : <code>' + availableConsts.join('</code>, <code>') + '</code>.';
    }

    var pflInfos = pythonForbiddenLists(this.includeBlocks);

    function processForbiddenList(origList, allowed) {
      var list = origList.slice();

      var hiddenWords = ['__getitem__', '__setitem__', 'elif'];
      for(var i = 0; i < hiddenWords.length; i++) {
        var word = hiddenWords[i];
        var wIdx = list.indexOf(word);
        if(wIdx > -1) {
          list.splice(wIdx, 1);
        }
      }

      var bracketsWords = { list_brackets: 'crochets [ ]+[]', dict_brackets: 'accolades { }+{}', var_assign: 'variables+x =' };
      for(var bracketsCode in bracketsWords) {
        var bracketsIdx = list.indexOf(bracketsCode);
        if(bracketsIdx >= 0) {
          list[bracketsIdx] = bracketsWords[bracketsCode];
        }
      }

      var word = allowed ? 'autorisé' : 'interdit';
      var cls = allowed ? '' : ' class="pflForbidden"';
      if(list.length == 1) {
        fullHtml += '<p>Le mot-clé suivant est ' + word + ' : <code'+cls+'>' + list[0] + '</code>.</p>';
      } else if(list.length > 0) {
        fullHtml += '<p>Les mots-clés suivants sont ' + word + 's : <code'+cls+'>' + list.join('</code>, <code'+cls+'>') + '</code>.</p>';
      }
      return list;
    }
    var pflAllowed = processForbiddenList(pflInfos.allowed, true);
    processForbiddenList(pflInfos.forbidden, false);
    if(pflAllowed.length) {
      simpleHtml += '<br />Mots-clés autorisés : <code>' + pflAllowed.join('</code>, <code>') + '</code>.';
    }

    if(pflInfos.allowed.indexOf('var_assign') > -1) {
      fullHtml += '<p>Les variables sont autorisées.</p>';
    } else {
      fullHtml += '<p>Les variables sont interdites.</p>';
    }

    fullHtml += '<p>Vous êtes autorisé(e) à lire de la documentation sur Python et à utiliser un moteur de recherche pendant le concours.</p>';

    $('.pythonIntroSimple').html(simpleHtml);
    $('.pythonIntroFull').html(fullHtml);

    // Display the full details in the responsive version
    this.collapseTaskIntro(!window.quickAlgoResponsive);
    if(window.quickAlgoResponsive) {
        $('.pythonIntroBtn').hide();
    }

    $('.pythonIntroSimple code, .pythonIntroFull code').each(function() {
      var elem = $(this);
      var txt = elem.text();
      var pIdx = txt.indexOf('+');
      if(pIdx > -1) {
        var newTxt = txt.substring(0, pIdx);
        var code = txt.substring(pIdx+1);
      } else {
        var newTxt = txt;
        var code = txt;
      }
      elem.attr('data-code', code);
      elem.text(newTxt);
    });

    var controller = this;
    $('.pythonIntroSimple code, .pythonIntroFull code').not('.pflForbidden').on('click', function() {
      quickAlgoInterface.toggleLongIntro(false);
      if(controller._aceEditor) {
        controller._aceEditor.insert(this.getAttribute('data-code'));
        controller._aceEditor.focus();
      }
    });
  };

  this.collapseTaskIntro = function(collapse) {
    var that = this;
    var div = $('.pythonIntroBtn').html('');
    if(collapse) {
      $('<a>Plus de détails</a>').appendTo(div).on('click', function() { that.collapseTaskIntro(false); });
      $('.pythonIntro .pythonIntroFull').hide();
      $('.pythonIntro .pythonIntroSimple').show();
    } else {
      $('<a>Moins de détails</a>').appendTo(div).on('click', function() { that.collapseTaskIntro(true); });
      $('.pythonIntro .pythonIntroFull').show();
      $('.pythonIntro .pythonIntroSimple').hide();
    }
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
  this.resetDisplay = function () {
    if(this._mainContext.runner) {
      console.log('ok');
      this._mainContext.runner.removeEditorMarker();
    }
  };
  this.reload = function () {};
  this.setReadOnly = function(newState) {
    // setReadOnly called by quickAlgoInterface

    // TODO :: should we actually set the readOnly flag?
    return;

    if(!!newState == this._readOnly) { return; }
    this._readOnly = !!newState;

    // options.readOnly has priority
    if(this._options.readOnly) { return; }

    this._aceEditor.setOption('readOnly', this._readOnly);
  };
}

function getBlocklyHelper(maxBlocks, nbTestCases) {
  return new LogicController(nbTestCases, maxBlocks);
}
