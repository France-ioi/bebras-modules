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

  /** @type {React.Component|null} */
  this.analysisComponent = null;

  this.loadContext = function (mainContext) {
    this._mainContext = mainContext;
  }

  this.savePrograms = function () {
    if(this._aceEditor) {
      this.programs[0].blockly = this._aceEditor.getValue();
    }
  };

  this.loadPrograms = function () {
    if(this._aceEditor && this.programs[0].blockly) {
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
    if (this.skulptAnalysisEnabled() && !this.skulptAnalysisShouldByEnabled()) {
      console.log('Module "python-analysis" is loaded but not used.');
    }

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
    if(limited && limited.type == 'uses') {
      display('Vous utilisez trop souvent un mot-clé à utilisation limitée : "'+limited.name+'".');
      return false;
    } else if(limited && limited.type == 'assign') {
      display('Vous n\'avez pas le droit de réassigner un mot-clé à utilisation limitée : "'+limited.name+'".');
      return false;
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

    // Check for functions used as values
    var re = /def\W+([^(]+)\(/g;
    var foundFuncs = this._mainContext && this._mainContext.runner ? this._mainContext.runner.getDefinedFunctions() : [];
    var match;
    while(match = re.exec(code)) {
       foundFuncs.push(match[1]);
    }
    for(var j=0; j<foundFuncs.length; j++) {
       var re = new RegExp('\\W' + foundFuncs[j] + '([^A-Za-z0-9_( ]| +[^ (]|$)');
       if(re.exec(code)) {
          display("Vous utilisez la fonction '" + foundFuncs[j] + "' sans les parenthèses. Ajoutez les parenthèses pour appeler la fonction.");
          return false;
       }
    }
    return true;
  }

  this.checkCodes = function(codes, display) {
    // Check multiple codes before validation
    for(var i = 0; i < codes.length; i++) {
      if(!this.checkCode(codes[i], display)) {
        return false;
      }
    }
    return true;
  }

  this.getAllCodes = function(answer) {
    // TODO :: multi-node version
    return [answer[0].blockly];
  }

  this.getDefaultContent = function () {
    if(this._options.startingExample && this._options.startingExample.python) {
      return this._options.startingExample.python;
    }
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
    if(type == 'run') {
      window.setTimeout(this.run.bind(this), 100);
    } else if(type == 'step') {
      window.setTimeout(this.step.bind(this), 100);
    }
  };

  this.getLanguage = function () {
    return this.language;
  };

  this.prepareRun = function (type) {
    if (!this._mainContext) { return false; }

    var nbRunning = this._mainContext.runner.nbRunning();
    if (nbRunning > 0) {
      this.stopAndTryAgain(type);
      return false;
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
       return false;
    }

    // Initialize runner
    this._mainContext.runner.initCodes(codes);

    if (this.skulptAnalysisEnabled()) {
      this.loadSkulptAnalysis();
    }

    return true;
  };

  this.run = function () {
    if(!this.prepareRun('run')) {
      return;
    }
    this._mainContext.runner.run();
  };

  this.step = function () {
    var self = this;

    if(!this._mainContext.runner._isRunning) {
      // No run in progress, start a new one
      if(!this.prepareRun('step')) {
        return;
      }
    }

    this._mainContext.runner.runStep(function() {
      // After the step is complete.
      if (self.skulptAnalysisEnabled() && self.analysisComponent) {
        // Compute and update the internal analysis.
        var skulptSuspensions = self._mainContext.runner._debugger.suspension_stack;
        var oldAnalysis = self.analysisComponent.props.analysis;

        self.analysisComponent.props.analysis = analyseSkulptState(skulptSuspensions, oldAnalysis);

        self.analysisComponent.forceUpdate();
      }
    });
  };

  this.stop = function () {
    if(this._mainContext.runner) {
      this._mainContext.runner.stop();
    }
  }

  /**
   *  IO specific operations
   */
  this.handleFiles = function (files) {
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
          // XXX :: what is this code about? Is it actually used? Blockly isn't
          // even loaded
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
        } else {
          that.programs[0].blockly = code;
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
    return "<div id='python-analysis'></div>" +
        "<div id='blocklyContainer'>" + // TODO :: change ID here and in CSS
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

  /**
   * Load the skulp analysis block in React.
   */
  this.loadSkulptAnalysis = function() {
    var self = this;
    var domContainer = document.querySelector('#python-analysis');

    ReactDOM.render(React.createElement(PythonStackViewContainer, {
      ref: function(componentReference) {
        if (componentReference) {
          self.analysisComponent = componentReference;

          /**
           * Move the analysis container with the mouse.
           */
          document.addEventListener('mouseup', function () {
            self.analysisComponent.mouseUpHandler();
          });
          document.addEventListener('mousemove', function (event) {
            self.analysisComponent.mouseMoveHandler(event.clientX, event.clientY);
          });
        }
      },
      analysis: null,
      show: true
    }), domContainer);
  };

  /**
   * Whether skulpt analysis should be enabled given the current task.
   *
   * @return {boolean}
   */
  this.skulptAnalysisShouldByEnabled = function() {
    var variablesEnabled = true;
    var taskInfos = this._mainContext.infos;
    var forbidden = pythonForbiddenLists(taskInfos.includeBlocks).forbidden;
    if (forbidden.indexOf('var_assign') !== -1) {
      variablesEnabled = false;
    }

    return variablesEnabled;
  };

  /**
   * Whether skulpt analysis is enabled.
   *
   * @return {boolean}
   */
  this.skulptAnalysisEnabled = function() {
    return (this.language === 'python' && typeof analyseSkulptState === 'function');
  };

  /**
   * Clears the skulpt analysis window.
   */
  this.clearSkulptAnalysis = function() {
    if (this.skulptAnalysisEnabled() && this.analysisComponent) {
      this.analysisComponent.props.analysis = null;
      this.analysisComponent.forceUpdate();
    }
  };

  /**
   * Shows the skulpt analysis window.
   */
  this.showSkulptAnalysis = function() {
    if (this.skulptAnalysisEnabled() && this.analysisComponent) {
      this.analysisComponent.props.show = true;
      this.analysisComponent.forceUpdate();
    }
  };

  /**
   * Hides the skulpt analysis window.
   */
  this.hideSkulptAnalysis = function() {
    if (this.skulptAnalysisEnabled() && this.analysisComponent) {
      this.analysisComponent.props.show = false;
      this.analysisComponent.forceUpdate();
    }
  };

  this.onResize = function() {
    // On resize function to be called by the interface
    this._aceEditor.resize();
  };
  this._loadAceEditor = function () {
    this._aceEditor = ace.edit('python-workspace');

    var langTools = ace.require("ace/ext/language_tools");
    var completer = {
      getCompletions : function(editor, session, pos, prefix, callback) {
        callback(null, [{name: "readTemperature", value: "readTemperature(thermometer)", score: 1, meta: "retourne la température ambiante"},
          {
            caption: "setLedState(led, state)",
            snippet: "setLedState(${1:led}, ${2:state})",
            type: "snippet",
            docHTML: "<b>setledState(led, state)</b><hr></hr>Modifie l'état de la LED : <br/>True pour l'allumer, False pour l'éteindre"
          }]);
      }/*,
      getDocTooltip: function(item) {
        if (item.type == "snippet" && !item.docHTML) {
          item.docHTML = [
            "<b>", lang.escapeHTML(item.caption), "</b>", "<hr></hr>",
            lang.escapeHTML(item.snippet)
          ].join("");
        }
      }*/

    }
    // we need to do that in order to remove a lot of noisy keywords which are pure python and not relevant for the student
    langTools.setCompleters([completer]);

/*
    var snippetManager = ace.require("ace/snippets").snippetManager;
    var config = ace.require("ace/config");

    ace.config.loadModule("ace/snippets/python", function(m) {
      if (m) {
        m.snippetText += "#Change state of led\nsnippet setLedState\n\tsetLedState(${1:led}, ${2:state})"
        m.snippets = snippetManager.parseSnippetFile(m.snippetText);

        snippetManager.register(m.snippets, m.scope);
      }
    });*/

    this._aceEditor.setOptions({
      readOnly: !!this._options.readOnly,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true
    });
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
    if(limited && limited.type == 'uses') {
      return {text: 'Vous utilisez trop souvent un mot-clé à utilisation limitée : "'+limited.name+'".', invalid: true, type: 'limited'};
    } else if(limited && limited.type == 'assign') {
      return {text: 'Vous n\'avez pas le droit de réassigner un mot-clé à utilisation limitée : "'+limited.name+'".', invalid: true, type: 'limited'};
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
        that.clearSkulptAnalysis();

        that._aceEditor.session.removeMarker(that._mainContext.runner._editorMarker);
        that._mainContext.runner._editorMarker = null;
      }

      if(window.quickAlgoInterface) {
        window.quickAlgoInterface.displayCapacity(that.getCapacityInfo());
      } else {
        $('#capacity').html(that.getCapacityInfo().text);
      }

      // Interrupt any ongoing execution
      if(that._mainContext.runner && that._mainContext.runner.isRunning()) {
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
      fullHtml += '<p>' + (availableModules.length > 1) ? 
                  window.languageStrings.startingLine :
                  window.languageStrings.startingLines;
      fullHtml += ' :</p>'
                 +  '<p><code>'
                 +  'from ' + availableModules[0] + ' import *';
      for(var i=1; i < availableModules.length; i++) {
        fullHtml += '\nfrom ' + availableModules[i] + ' import *';
      }
      fullHtml += '</code></p>'
                 +  '<p>' + window.languageStrings.availableFunctionsVerbose + '</p>'
                 +  '<ul>';
      simpleHtml += window.languageStrings.availableFunctions;

      var availableConsts = [];

      // Display a list for the simpleHtml version
      function displaySimpleList(elemList) {
        var html = '';
        if(window.quickAlgoResponsive && elemList.length > 0) {
          // Dropdown mode
          html  = '<div class="pythonIntroSelect">';
          html += '<select>';
          for(var i=0 ; i < elemList.length; i++) {
            var elem = elemList[i];
            html += '<option' + (elem.desc ? ' data-desc="' + elem.desc.replace('"', '&quot;') + '"' : '') + '>';
            html += (typeof elem == 'string' ? elem : elem.func);
            html += '</option>';
          }
          html += '</select>';
          html += '<div class="pythonIntroSelectBtn pythonIntroSelectBtnCopy"><span class="fas fa-clone"></span></div>';
          html += '<div class="pythonIntroSelectBtn pythonIntroSelectBtnHelp"><span class="fas fa-question"></span></div>';
          html += '<span class="pythonIntroSelectDesc"></span>';
          html += '</div>';
        } else {
          // Normal mode
          for(var i=0 ; i < elemList.length; i++) {
            var elem = elemList[i];
            if(i > 0) { html += ', '; }
            html += '<code>' + (typeof elem == 'string' ? elem : elem.func) + '</code>';
          }
        }
        return html;
      };

      // Generate list of functions available
      var simpleElements = [];
      for (var generatorName in this.includeBlocks.generatedBlocks) {
        var blockList = this.includeBlocks.generatedBlocks[generatorName];
        for (var iBlock=0; iBlock < blockList.length; iBlock++) {
          var blockDesc = '', funcProto = '', blockHelp = '';
          if (this._mainContext.docGenerator) {
            blockDesc = this._mainContext.docGenerator.blockDescription(blockList[iBlock]);
            funcProto = blockDesc.substring(blockDesc.indexOf('<code>') + 6, blockDesc.indexOf('</code>'));
            blockHelp = blockDesc.substring(blockDesc.indexOf('</code>') + 7);
          } else {
            var blockName = blockList[iBlock];
            blockDesc = this._mainContext.strings.description[blockName];
            if (!blockDesc) {
              funcProto = (this._mainContext.strings.code[blockName] || blockName) + '()';
              blockDesc = '<code>' + funcProto + '</code>';
            } else if (blockDesc.indexOf('</code>') < 0) {
              var funcProtoEnd = blockDesc.indexOf(')') + 1;
              if(funcProtoEnd > 0) {
                funcProto = blockDesc.substring(0, funcProtoEnd);
                blockHelp = blockDesc.substring(funcProtoEnd);
                blockDesc = '<code>' + funcProto + '</code>' + blockHelp;
              } else {
                console.error("Description for block '" + blockName + "' needs to be of the format 'function() : description', auto-generated one used instead could be wrong.");
                funcProto = blockName + '()';
                blockDesc = '<code>' + funcProto + '</code> : ' + blockHelp;
              }
            }
          }
          fullHtml += '<li>' + blockDesc + '</li>';
          simpleElements.push({func: funcProto, desc: blockHelp});
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
      simpleHtml += displaySimpleList(simpleElements);
      fullHtml += '</ul>';
    }

    if(availableConsts.length) {
      fullHtml += '<p>Les constantes disponibles sont : <code>' + availableConsts.join('</code>, <code>') + '</code>.</p>';
      simpleHtml += '<br />Constantes disponibles : ' + displaySimpleList(availableConsts);
    }

    var pflInfos = pythonForbiddenLists(this.includeBlocks);

    function processForbiddenList(origList, allowed) {
      var list = origList.slice();

      var hiddenWords = ['__getitem__', '__setitem__'];
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

      var word = allowed ? window.languageStrings.keywordAllowed : window.languageStrings.keywordForbidden;
      var words = allowed ? window.languageStrings.keywordsAllowed : window.languageStrings.keywordsForbidden;
      var cls = allowed ? '' : ' class="pflForbidden"';
      if(list.length == 1) {
        fullHtml += '<p>' + word + ' <code'+cls+'>' + list[0] + '</code>.</p>';
      } else if(list.length > 0) {
        fullHtml += '<p>' + words + ' <code'+cls+'>' + list.join('</code>, <code'+cls+'>') + '</code>.</p>';
      }
      return list;
    }
    var pflAllowed = processForbiddenList(pflInfos.allowed, true);
    processForbiddenList(pflInfos.forbidden, false);
    if(pflAllowed.length) {
      simpleHtml += '<br />' + this._strings.autorizedKeyWords + displaySimpleList(pflAllowed);
    }

    if(pflInfos.allowed.indexOf('var_assign') > -1) {
      fullHtml += '<p>' + window.languageStrings.variablesAllowed + '</p>';
    } else {
      fullHtml += '<p>' + window.languageStrings.variablesForbidden + '</p>';
    }

    fullHtml += '<p>' + window.languageStrings.readDocumentation + '</p>';

    $('.pythonIntroSimple').html(simpleHtml);
    $('.pythonIntroFull').html(fullHtml);

    // Display the full details in the responsive version
    this.collapseTaskIntro(!window.quickAlgoResponsive);
    if(window.quickAlgoResponsive) {
        $('.pythonIntroBtn').hide();
    }

    function updateIntroSelect(elem) {
       elem = $(elem);
       var code = elem.find('option:selected').text();
       var funcName = code.split('(')[0];
       var conceptId = null;
       if(window.conceptViewer) {
          conceptId = window.conceptViewer.hasPythonConcept(funcName);
       }
       if(conceptId) {
          elem.parent().find('.pythonIntroSelectBtnHelp').attr('data-concept', conceptId).show();
       } else {
          elem.parent().find('.pythonIntroSelectBtnHelp').hide();
       }

       var desc = elem.find('option:selected').attr('data-desc');
       elem.parent().find('.pythonIntroSelectDesc').html(desc || "");
    }

    $('.pythonIntroSelect select').each(function(idx, elem) { updateIntroSelect(elem); });

    $('.pythonIntroSimple code, .pythonIntroSimple option, .pythonIntroFull code').each(function() {
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
    $('.pythonIntroSelectBtn.pythonIntroSelectBtnCopy').on('click', function() {
      var code = $(this).parent().find('option:selected').attr('data-code');
      if(controller._aceEditor) {
        controller._aceEditor.insert(code);
        controller._aceEditor.focus();
      }
    });
    $('.pythonIntroSelectBtn.pythonIntroSelectBtnHelp').on('click', function() {
      window.conceptViewer.showConcept($(this).attr('data-concept'));
    });
    $('.pythonIntroSelect select').on('change', function() {
      updateIntroSelect(this);
    });
  };

  this.collapseTaskIntro = function(collapse) {
    var that = this;
    var div = $('.pythonIntroBtn').html('');
    if(collapse) {
      $('<a>' + window.languageStrings.showDetails + '</a>').appendTo(div).on('click', function() { that.collapseTaskIntro(false); });
      $('.pythonIntro .pythonIntroFull').hide();
      $('.pythonIntro .pythonIntroSimple').show();
    } else {
      $('<a>' + window.languageStrings.hideDetails + '</a>').appendTo(div).on('click', function() { that.collapseTaskIntro(true); });
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

    if ($("#editorContainer").length > 0) {
      panelWidth = $('#editorContainer').width() - 30;
      if (panelWidth != this._prevWidth) {
          $("#taskIntro").css("width", panelWidth);
          $("#grid").css("left", panelWidth + 20 + "px");
      }
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

  this.canPaste = function() {
    return window.pythonClipboard ? true : null;
  }
  this.canConvertBlocklyToPython = function() {
    return false;
  }
  this.copyProgram = function() {
    var code = this._aceEditor.getSelectedText();
    if(!code) { code = this._aceEditor.getValue(); }
    window.pythonClipboard = code;
  }
  this.pasteProgram = function() {
    if(!window.pythonClipboard) { return; }
    var curCode = this._aceEditor.getValue();
    this._aceEditor.setValue(curCode + '\n\n' + window.pythonClipboard);
    var Range = ace.require('ace/range').Range;
    this._aceEditor.selection.setRange(new Range(curCode.split(/\r\n|\r|\n/).length + 1, 0, this._aceEditor.getValue().split(/\r\n|\r|\n/).length, 0), true);
  }
}

function getBlocklyHelper(maxBlocks, nbTestCases) {
  return new LogicController(nbTestCases, maxBlocks);
}
