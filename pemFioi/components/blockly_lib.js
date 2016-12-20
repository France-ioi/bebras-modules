/*!
 * @author John Ropas
 * @since 17/12/2016
 */

// We need to be able to clean all events
if (EventTarget.prototype.addEventListenerBase == undefined) {
  EventTarget.prototype.addEventListenerBase = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, listener) {
    if (!this.EventList) {
      this.EventList = [];
    }
    this.addEventListenerBase.apply(this, arguments);
    if (!this.EventList[type]) {
      this.EventList[type] = [];
    }
    var list = this.EventList[type];
    for (var index = 0; index != list.length; index++) {
      if (list[index] === listener) {
        return;
      }
    }
    list.push(listener);
  };

  EventTarget.prototype.removeEventListenerBase = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.removeEventListener = function (type, listener) {
    if (!this.EventList) {
      this.EventList = [];
    }
    if (listener instanceof Function) {
      this.removeEventListenerBase.apply(this, arguments);
    }
    if (!this.EventList[type]) {
      return;
    }
    var list = this.EventList[type];
    for (var index = 0; index != list.length;) {
      var item = list[index];
      if (!listener) {
        this.removeEventListenerBase(type, item);
        list.splice(index, 1);
        continue;
      }
      else if (item === listener) {
        list.splice(index, 1);
        break;
      }
      index++;
    }
    if (list.length == 0) {
      delete this.EventList[type];
    }
  };
}

var highlightPause = false;

function BlocklyHelper() {



  var load = function (language, display, nbTestCases, options) {
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
        toolbox: "<xml>" + xml + "</xml>",
        sounds: false,
        media: "http://static3.castor-informatique.fr/contestAssets/blockly/"
      };
      if (!this.groupByCategory) {
        wsConfig.comments = true;
        wsConfig.scrollbars = true;
        wsConfig.trashcan = true;
      }
      if (maxBlocks != undefined) {
        wsConfig.maxBlocks = maxBlocks;
      }
      if (options.readOnly) {
        wsConfig.readOnly = true;
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
        $('.blocklyCapacity').html(that.workspace.remainingCapacity());
      }

      this.workspace.addChangeListener(onchange);
      onchange();
    } else {
      this.workspace = new Blockly.Workspace();
    }

    this.programs = [];
    for (var iPlayer = this.mainContext.nbRobots - 1; iPlayer >= 0; iPlayer--) {
      this.programs[iPlayer] = { blockly: null, blocklyJS: "", blocklyPython: "", javascript: "" };
      this.languages[iPlayer] = "blockly";
      this.setPlayer(iPlayer);
      if (!options.noRobot) {
        var newXml;
        if (this.startingBlock) {
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

  var unload = function () {
    //var ws = Blockly.getMainWorkspace('blocklyDiv');
    var ws = this.workspace;
    if (ws != null) {
      ws.dispose();
      // TODO this makes no sense - needs investigation
      if (false) {
        $(".blocklyWidgetDiv").remove();
        $(".blocklyTooltipDiv").remove();
        document.removeEventListener("keydown", Blockly.onKeyDown_); // TODO: find correct way to remove all event listeners
        delete Blockly;
      }
    }

  };

  var initXML = function () {
    var categories = ["actions", "sensors", "debug"];
    for (var iCategory = 0; iCategory < categories.length; iCategory++) {
      var categoryStr = "";
      // TODO this is unsafe - change to k,v iteration
      for (var objectName in this.generators) {
        for (var iGen = 0; iGen < this.generators[objectName].length; iGen++) {
          var generator = this.generators[objectName][iGen];
          if (generator.category == categories[iCategory]) {
            categoryStr += "<block type='" + objectName + "_" + generator.labelEn + "__'></block>";
          }
        }
      }
      $("#blockly_" + categories[iCategory]).html(categoryStr);
    }
  };

  var createSelection = function (id, start, end) {
    var field = document.getElementById(id);
    if (field.createTextRange) {
      var selRange = field.createTextRange();
      selRange.collapse(true);
      selRange.moveStart('character', start);
      selRange.moveEnd('character', end);
      selRange.select();
    } else if (field.setSelectionRange) {
      field.setSelectionRange(start, end);
    } else if (field.selectionStart) {
      field.selectionStart = start;
      field.selectionEnd = end;
    }
    field.focus();
  };

  var showStep = function (interpreter, id) {
    var start, end;
    if (interpreter.stateStack[0]) {
      var node = interpreter.stateStack[0].node;
      start = node.start;
      end = node.end;
    } else {
      start = 0;
      end = 0;
    }
    this.createSelection(id, start, end);
  };

  var loadPlayer = function (player) {
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
  };

  var savePrograms = function () {
    this.programs[this.player].javascript = $("#program").val();
    if (this.workspace != null) {
      var xml = Blockly.Xml.workspaceToDom(this.workspace);
      this.programs[this.player].blockly = Blockly.Xml.domToText(xml);
      this.programs[this.player].blocklyJS = this.getCode("javascript");
      this.programs[this.player].blocklyPython = this.getCode("python");
    }
  };

  var loadPrograms = function () {
    $("#program").val(this.programs[this.player].javascript);
    if (this.workspace != null) {
      var xml = Blockly.Xml.textToDom(this.programs[this.player].blockly);
      this.workspace.clear();
      Blockly.Xml.domToWorkspace(xml, this.workspace);
    }
  };

  var getCodeFromXml = function (xmlText, language) {
    try {
      var xml = Blockly.Xml.textToDom(xmlText)
    } catch (e) {
      alert(e);
      return;
    }
    var tmpWorkspace = new Blockly.Workspace();
    Blockly.Xml.domToWorkspace(xml, tmpWorkspace);
    return this.getCode(language, tmpWorkspace);
  };

  var getCode = function (language, codeWorkspace) {
    if (codeWorkspace == undefined) {
      codeWorkspace = this.workspace;
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
      if (["procedures_defnoreturn", "procedures_defreturn"].indexOf(block.type) > -1) {
        // For function blocks, the code is stored in languageObj.definitions_
      } else {
        if (block.type == "robot_start" || !this.startingBlock) {
          comments.push(blockCode);
        }
      }
    }

    // TODO this is unsafe once again - change to k,v iterations
    for (var def in languageObj.definitions_) {
      code.push(languageObj.definitions_[def]);
    }

    code = code.join("\n");
    code += comments.join("\n");
    return code;
  };

  return {};
}


function initBlocklyRunner(context, messageCallback) {
  init(context, [], [], [], false, {});

  function init(context, interpreters, isRunning, toStop, stopPrograms, runner) {

    runner.waitDelay = function (callback, value, delay) {
      if (delay > 0) {
        context.delayFactory.createTimeout("wait" + context.curRobot + "_" + Math.random(), function () {
            runner.noDelay(callback, value);
          },
          delay
        );
      } else {
        runner.noDelay(callback, value);
      }
    };

    runner.noDelay = function (callback, value) {
      var primitive = undefined;
      if (value != undefined) {
        primitive = interpreters[context.curRobot].createPrimitive(value);
      }
      if (Math.random() < 0.1) {
        context.delayFactory.createTimeout("wait_" + Math.random(), function () {
          callback(primitive);
          runner.runSyncBlock();
        }, 0);
      } else {
        callback(primitive);
        runner.runSyncBlock();
      }
    };

    runner.initInterpreter = function (interpreter, scope) {
      for (objectName in context.customBlocks) {
        for (iCategory in context.customBlocks[objectName]) {
          for (iBlock in context.customBlocks[objectName][iCategory].blocks) {
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
        if (context.display) {
          context.blocklyHelper.workspace.highlightBlock(id);
          highlightPause = true;
        }
      }

      // Add an API function for highlighting blocks.
      var wrapper = function (id) {
        id = id ? id.toString() : '';
        return interpreter.createPrimitive(highlightBlock(id));
      };
      interpreter.setProperty(scope, 'highlightBlock', interpreter.createNativeFunction(wrapper));
    };

    runner.stop = function () {
      for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
        if (isRunning[iInterpreter]) {
          toStop[iInterpreter] = true;
        }
      }
      context.reset();
    };

    runner.runSyncBlock = function () {
      var maxIter = 20000;
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
              isRunning[iInterpreter] = false;
              ;
              break;
            }
            if (interpreter.paused_) {
              break;
            }
            context.curSteps[iInterpreter]++;
          }
          if (context.curSteps[iInterpreter] >= maxIter) {
            isRunning[iInterpreter] = false;
            ;
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

    runner.runCodes = function (codes) {
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

    runner.nbRunning = function () {
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

function removeBlockly() {
  $(".blocklyWidgetDiv").remove();
  $(".blocklyTooltipDiv").remove();
  document.removeEventListener("keydown"); //, Blockly.onKeyDown_); // TODO: find correct way to remove all event listeners
  delete Blockly;
}

