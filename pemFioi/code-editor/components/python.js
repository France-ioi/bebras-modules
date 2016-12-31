/*!
 * @author John Ropas
 * @since 29/12/2016
 */

function PythonInterpreter(context, msgCallback) {
  this.context = context;
  this.messageCallback = msgCallback;
  this._code = '';
  this._editor_filename = "<stdin>";
  this.context.runner = this;
  this._maxIterations = 1000;
  this._resetCallstackOnNextStep = false;
  this._paused = false;
  this._isRunning = false;
  this._steps = 0;
  this._timeouts = [];
  var that = this;

  this._skulptifyHandler = function (name, objectName, iCategory, iBlock) {
    var handler = '\tvar susp = new Sk.misceval.Suspension();';
    handler += "\n\tvar result = Sk.builtin.none.none$;";
    handler += "\n\tsusp.resume = function() { return result; };";
    handler += "\n\tsusp.data = {type: 'Sk.promise', promise: new Promise(function(resolve) {";
    handler += "\n\ttry {";
    handler += '\n\t\ttask.displayedSubTask.context.customBlocks["' + objectName + '"][' + iCategory + '].blocks[' + iBlock + '].handler(resolve);';
    handler += "\n\t} catch (e) {";
    handler += "\n\t\ttask.displayedSubTask.context.runner._onStepError(e)}";
    handler += '\n\t}).then(function (value) {\nresult = value;\nreturn value;\n })};';
    handler += '\n\treturn susp;';
    return '\nmod.' + name + ' = new Sk.builtin.func(function () {\n' + handler + '\n});\n';
  };

  this._injectFunctions = function () {
    var final = "var $builtinmodule = function (name) {\n\nvar mod = {};\nmod.__package__ = Sk.builtin.none.none$;\n";
    for (var objectName in this.context.customBlocks) {
      for (var iCategory in this.context.customBlocks[objectName]) {
        for (var iBlock in this.context.customBlocks[objectName][iCategory].blocks) {
          var blockInfo = this.context.customBlocks[objectName][iCategory].blocks[iBlock];
          var code = this.context.strings.code[blockInfo.name];
          if (typeof(code) == "undefined") {
            code = blockInfo.name;
          }
          final += this._skulptifyHandler(code, objectName, iCategory, iBlock);
        }
      }
    }

    final += "\nreturn mod;\n};";
    Sk.builtinFiles["files"]["src/lib/robot.js"] = final;
  };

  this.waitDelay = function (callback, value, delay) {
    this._paused = true;
    if (delay > 0) {
      var _noDelay = this.noDelay.bind(this, callback, value);
      var timeoutId = window.setTimeout(_noDelay, delay);
      this._timeouts.push(timeoutId);
    } else {
      this.noDelay(callback, value);
    }
  };

  this.noDelay = function (callback, value) {
    var primitive = this._createPrimitive(value);
    if (primitive !== Sk.builtin.none.none$) {
      this._resetCallstackOnNextStep = true;
    }
    this._paused = false;
    callback(primitive);
    var timeoutId = window.setTimeout(this._continue.bind(this), 10);
    this._timeouts.push(timeoutId);
  };

  this._createPrimitive = function (data) {
    if (data === undefined) {
      return Sk.builtin.none.none$;  // Reuse the same object.
    }
    var type = typeof data;
    var result;
    if (type === 'number') {
      result = new Sk.builtin.int(data);
    } else if (type === 'string') {
      result = new Sk.builtin.str(data);
    } else if (type === 'boolean') {
      result = new Sk.builtin.bool(data);
    }
    return result;
  };

  this._onOutput = function (_output) {
    that.print(_output);
  };

  this._onDebugOut = function (text) {
    // console.log('DEBUG: ', text);
  };

  this._configure = function () {
    Sk.configure({
      output: this._onOutput,
      debugout: this._onDebugOut,
      read: this._builtinRead.bind(this),
      yieldLimit: null,
      execLimit: null,
      debugging: true,
      breakpoints: this._debugger.check_breakpoints.bind(this._debugger)
    });
    Sk.pre = "edoutput";
    Sk.pre = "codeoutput";
    this.context.callCallback = this.noDelay.bind(this);
  };

  this.print = function (message, className) {
    if (message === 'Program execution complete') {
      this._onFinished();
    }
    if (message) {
      console.log('PRINT: ', message, className || '');
    }
  };

  this._onFinished = function () {
    this._resetInterpreterState();
    try {
      this.context.infos.checkEndCondition(this.context, true);
    } catch (e) {
      this._onStepError(e);
    }
  };

  this._builtinRead = function (x) {
    this._injectFunctions();
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
      throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
  };

  this.get_source_line = function (lineno) {
    return this._code.split('\n')[lineno];
  };

  this._continue = function () {
    if (this._steps < this._maxIterations && !this._paused && this._isRunning) {
      this.step();
    }
  };

  this.runCodes = function (codes) {
    this._debugger = new Sk.Debugger(this._editor_filename, this);
    this._configure();
    this._code = codes[0];
    this._setBreakpoint(1, false);
    try {
      var susp_handlers = {};
      susp_handlers["*"] = this._debugger.suspension_handler.bind(this);
      var promise = this._debugger.asyncToPromise(this._asyncCallback.bind(this), susp_handlers, this._debugger);
      promise.then(this._debugger.success.bind(this._debugger), this._debugger.error.bind(this._debugger));
    } catch (e) {
      this._onOutput(e.toString() + "\n");
      console.log('exception');
    }

    this._resetInterpreterState();
    this._isRunning = true;
    var timeoutId = window.setTimeout(this._continue.bind(this), 100);
    this._timeouts.push(timeoutId);
  };

  this.nbRunning = function () {
    return this._isRunning ? 1 : 0;
  };

  this.stop = function () {
    for (var i = 0; i < this._timeouts.length; i += 1) {
      window.clearTimeout(this._timeouts[i]);
    }
    this._resetInterpreterState();
    this.context.reset();
  };

  this._resetInterpreterState = function () {
    this._steps = 0;
    this._isRunning = false;
    this._resetCallstackOnNextStep = false;
    this._paused = false;
  };

  this._resetCallstack = function () {
    if (this._resetCallstackOnNextStep) {
      this._resetCallstackOnNextStep = false;
      this._debugger.suspension_stack = [this._debugger.suspension_stack[0]];
    }
  };

  this.step = function () {
    this._resetCallstack();
    this._debugger.enable_step_mode();
    this._debugger.resume.call(this._debugger);
    this._steps += 1;
  };

  this._onStepSuccess = function (){
    this._continue();
  };

  this._onStepError = function (message) {
    this.stop();
    this.context.success = false;
    this.messageCallback(this.context.messagePrefixFailure + message);
  };

  this._setBreakpoint = function (bp, isTemporary) {
    this._debugger.add_breakpoint(this._editor_filename + ".py", bp, "0", isTemporary);
  };

  this._asyncCallback = function () {
    return Sk.importMainWithBody(this._editor_filename, true, this._code, true);
  }
}

CodeEditor.Interpreters.PythonInterpreter = PythonInterpreter;
