/*!
 * @author John Ropas
 * @since 29/12/2016
 */

function PythonInterpreter(context) {
  this.context = context;
  this._output = '';
  this._callback = '';
  this._code = '';
  this._input = '';
  this._interval = 0;
  this._editor_filename = "<stdin>";
  this._debugger = new Sk.Debugger(this._editor_filename, this);
  this.context.runner = this;

  var generateElements = function () {
    var elements = '<pre id="edoutput" ></pre>';
    elements += '<pre id="codeoutput" ></pre>';
    $(CodeEditor.Utils.DOM.Elements.EDITOR).append(elements);

  };

  this.clearOnNext = false;

  generateElements();

  var that = this;

  this._skulptifyHandler = function (name, objectName, iCategory, iBlock) {
    var handler = '\tvar susp = new Sk.misceval.Suspension();';
    handler += "\n\tvar result = Sk.builtin.none.none$;";
    handler += "\n\tsusp.resume = function() { return result; };";
    handler += "\n\tsusp.data = {type: 'Sk.promise', promise: new Promise(function(resolve) {";
    handler += '\n\ttask.displayedSubTask.context.customBlocks["' + objectName + '"][' + iCategory + '].blocks[' + iBlock + '].handler(resolve);';
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
    if (delay > 0) {
      var identifier = "wait" + this.context.curRobot + "_" + Math.random();
      var _noDelay = this.noDelay.bind(this, callback, value);
      this.context.delayFactory.createTimeout(identifier, _noDelay, delay);
    } else {
      this.noDelay(callback, value);
    }
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


  this.noDelay = function (callback, value) {
    var primitive = this._createPrimitive(value);
    if (Math.random() < 0.1) {
      var identifier = "wait_" + Math.random();
      var that = this;
      this.context.delayFactory.createTimeout(identifier, function () {
        callback(primitive);
        that.clearOnNext = true;
      }, 0);
    } else {
      callback(primitive);
      this.clearOnNext = true;
    }
  };

  this.start = function () {
    this.step(false);
  };

  this._onOutput = function (_output) {
    if (_output === '\n') {
      return;
    }
    that._output += _output;
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

  this._printFullOutput = function () {
    console.log(this._output);
  };

  this.print = function (message, className) {
    if (message === 'Program execution complete'){
      window.clearInterval(this._interval);
    }
    console.log('PRINT: ', message, className || '');
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

  this.runCodes = function (codes) {
    this._configure();
    this._code = codes[0];
    this._setBreakpoint(1, false);
    try {
      var susp_handlers = {};
      susp_handlers["*"] = this._debugger.suspension_handler.bind(this);
      var promise = this._debugger.asyncToPromise(this._asyncCallback.bind(this), susp_handlers, this._debugger);
      promise.then(this._debugger.success.bind(this._debugger), this._debugger.error.bind(this._debugger));
    } catch (e) {
      this._onOutput(e.toString() + "\n")
    }

    this._interval = window.setInterval(this.step.bind(this), 100);
  };

  this.nbRunning = function () {
    return 0;
  };

  this.step = function () {
    if (this.clearOnNext) {
      this._debugger.suspension_stack = [this._debugger.suspension_stack[0]];
    }
    this._debugger.enable_step_mode();
    this._debugger.resume.call(this._debugger);
  };

  this._setBreakpoint = function (bp, isTemporary) {
    this._debugger.add_breakpoint(this._editor_filename + ".py", bp, "0", isTemporary);
  };

  this._asyncCallback = function () {
    return Sk.importMainWithBody(this._editor_filename, true, this._code, true);
  }
}

CodeEditor.Interpreters.PythonInterpreter = PythonInterpreter;
