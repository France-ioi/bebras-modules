/*!
 * @author John Ropas
 * @since 17/12/2016
 */

// former initBlocklyRunner

function RunController(ctx, msgCallback) {

  this.context = ctx;
  this.messageCallback = msgCallback;
  this.interpreters = [];
  this.isRunning = [];
  this.toStop = [];
  this.stopPrograms = false;

  this.waitDelay = function (callback, value, delay) {
    if (delay > 0) {
      var identifier = "wait" + this.context.curRobot + "_" + Math.random();
      var _noDelay = this.noDelay.bind(this, callback, value);
      this.context.delayFactory.createTimeout(identifier, _noDelay, delay);
    } else {
      this.noDelay(callback, value);
    }
  };

  this.noDelay = function (callback, value) {
    var primitive = undefined;
    if (value != undefined) {
      primitive = this.interpreters[this.context.curRobot].createPrimitive(value);
    }
    if (Math.random() < 0.1) {
      var identifier = "wait_" + Math.random();
      var that = this;
      this.context.delayFactory.createTimeout(identifier, function () {
        callback(primitive);
        that.runSyncBlock();
      }, 0);
    } else {
      callback(primitive);
      this.runSyncBlock();
    }
  };

  this.initInterpreter = function (interpreter, scope) {
    for (var objectName in this.context.customBlocks) {
      for (var iCategory in this.context.customBlocks[objectName]) {
        for (var iBlock in this.context.customBlocks[objectName][iCategory].blocks) {
          var blockInfo = this.context.customBlocks[objectName][iCategory].blocks[iBlock];
          var code = this.context.strings.code[blockInfo.name];
          if (typeof(code) == "undefined") {
            code = blockInfo.name;
          }
          interpreter.setProperty(scope, code, interpreter.createAsyncFunction(blockInfo.handler));
        }
      }
    }

    interpreter.setProperty(scope, "program_end", interpreter.createAsyncFunction(this.context.program_end));

    var that = this;

    function highlightBlock(id) {
      if (that.context.display) {
        that.context.blocklyHelper._workspace.highlightBlock(id);
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

  this.stop = function () {
    for (var iInterpreter = 0; iInterpreter < this.interpreters.length; iInterpreter++) {
      if (this.isRunning[iInterpreter]) {
        this.toStop[iInterpreter] = true;
      }
    }
    this.context.reset();
  };

  this.runSyncBlock = function () {
    var maxIter = 20000;
    /*      if (turn > 90) {
     task.program_end(function() {
     that.stop();
     });
     return;
     }*/
    try {
      for (var iInterpreter = 0; iInterpreter < this.interpreters.length; iInterpreter += 1) {
        this.context.curRobot = iInterpreter;
        if (this.context.infos.checkEndEveryTurn) {
          this.context.infos.checkEndCondition(this.context, false);
        }
        var interpreter = this.interpreters[iInterpreter];
        while (this.context.curSteps[iInterpreter] < maxIter) {
          if (!interpreter.step() || this.toStop[iInterpreter]) {
            this.isRunning[iInterpreter] = false;
            break;
          }
          if (interpreter.paused_) {
            break;
          }
          this.context.curSteps[iInterpreter]++;
        }
        if (this.context.curSteps[iInterpreter] >= maxIter) {
          this.isRunning[iInterpreter] = false;
          throw this.context.blocklyHelper.strings.tooManyIterations;
        }
      }
    } catch (e) {
      for (var iInterpretr = 0; iInterpretr < this.interpreters.length; iInterpretr += 1) {
        this.isRunning[iInterpretr] = false;
      }

      var message = e.toString();
      if ((this.context.nbTestCases != undefined) && (this.context.nbTestCases > 1)) {
        if (this.context.success) {
          message = this.context.messagePrefixSuccess + message;
        } else {
          message = this.context.messagePrefixFailure + message;
        }
      }
      if (this.context.success) {
        message = "<span class='success'>" + message + "</span>";
        if (this.context.linkBack) {
          //message += "<br/><span onclick='window.parent.backToList()' style='font-weight:bold;cursor:pointer;text-decoration:underline;color:blue'>Retour à la liste des questions</span>";
        }
      }
      this.messageCallback(message);
    }
  };

  this.runCodes = function (codes) {
    //this.mainContext.delayFactory.stopAll(); pb: it would top existing graders
    this.interpreters = [];
    this.context.programEnded = [];
    this.context.curSteps = [];
    this.context.reset();
    for (var iInterpreter = 0; iInterpreter < codes.length; iInterpreter += 1) {
      this.context.curSteps[iInterpreter] = 0;
      this.context.programEnded[iInterpreter] = false;
      this.interpreters.push(new Interpreter(codes[iInterpreter], this.initInterpreter.bind(this)));
      this.isRunning[iInterpreter] = true;
      this.toStop[iInterpreter] = false;
    }
    this.runSyncBlock();
  };

  this.nbRunning = function () {
    var nbRunning = 0;
    for (var iInterpreter = 0; iInterpreter < this.interpreters.length; iInterpreter += 1) {
      if (this.isRunning[iInterpreter]) {
        nbRunning++;
      }
    }
    return nbRunning;
  };

  this.context.runner = this;
  this.context.callCallback = this.noDelay.bind(this);
  this.context.programEnded = [];
}

CodeEditor.Controllers.RunController = RunController;
