/*
    python_runner:
        Python code runner.
*/

var currentPythonContext = null;

function PythonInterpreter(context, msgCallback) {
  this.context = context;
  this.messageCallback = msgCallback;
  this._code = '';
  this._editor_filename = "<stdin>";
  this.context.runner = this;
  this._maxIterations = 4000;
  this._maxIterWithoutAction = 50;
  this._resetCallstackOnNextStep = false;
  this._paused = false;
  this._isRunning = false;
  this._stepInProgress = false;
  this.stepMode = false;
  this._steps = 0;
  this._stepsWithoutAction = 0;
  this._lastNbActions = null;
  this._hasActions = false;
  this._nbActions = 0;
  this._allowStepsWithoutDelay = 0;
  this._timeouts = [];
  this._editorMarker = null;
  this.availableModules = [];
  this._argumentsByBlock = {};
  this._definedFunctions = [];

  this.nbNodes = 0;
  this.curNode = 0;
  this.readyNodes = [];
  this.nodeStates = [];
  this.waitingOnReadyNode = false;

  var that = this;

  this._skulptifyHandler = function (name, generatorName, blockName, nbArgs, type) {
    if(!arrayContains(this._definedFunctions, name)) { this._definedFunctions.push(name); }

    var handler = '';
    handler += "\tcurrentPythonContext.runner.checkArgs('" + name + "', '" + generatorName + "', '" + blockName + "', arguments);";

    handler += "\n\tvar susp = new Sk.misceval.Suspension();";
    handler += "\n\tvar result = Sk.builtin.none.none$;";

    // If there are arguments, convert them from Skulpt format to the libs format
    handler += "\n\tvar args = Array.prototype.slice.call(arguments);";
    handler += "\n\tfor(var i=0; i<args.length; i++) { args[i] = currentPythonContext.runner.skToJs(args[i]); };";

    handler += "\n\tsusp.resume = function() { return result; };";
    handler += "\n\tsusp.data = {type: 'Sk.promise', promise: new Promise(function(resolve) {";
    handler += "\n\targs.push(resolve);";

    // Count actions
    if(type == 'actions') {
      handler += "\n\tcurrentPythonContext.runner._nbActions += 1;";
    }

    handler += "\n\ttry {";
    handler += '\n\t\tcurrentPythonContext["' + generatorName + '"]["' + blockName + '"].apply(currentPythonContext, args);';
    handler += "\n\t} catch (e) {";
    handler += "\n\t\tcurrentPythonContext.runner._onStepError(e)}";
    handler += '\n\t}).then(function (value) {\nresult = value;\nreturn value;\n })};';
    handler += '\n\treturn susp;';
    return '\nmod.' + name + ' = new Sk.builtin.func(function () {\n' + handler + '\n});\n';
  };

  this._skulptifyConst = function(name, value) {
    if(typeof value === "number") {
      var handler = 'Sk.builtin.int_(' + value + ');';
    } else if(typeof value === "boolean") {
      var handler = 'Sk.builtin.bool(' + value.toString() + ');';
    } else if(typeof value === "string") {
      var handler = 'Sk.builtin.str(' + JSON.stringify(value) + ');';
    } else {
      throw "Unable to translate value '" + value + "' into a Skulpt constant.";
    }
    return '\nmod.' + name + ' = new ' + handler + '\n';
  };

  this._injectFunctions = function () {
    // Generate Python custom libraries from all generated blocks
    this._definedFunctions = [];

    if(this.context.infos && this.context.infos.includeBlocks && this.context.infos.includeBlocks.generatedBlocks) {
      // Flatten customBlocks information for easy access
      var blocksInfos = {};
      for (var generatorName in this.context.customBlocks) {
        for (var typeName in this.context.customBlocks[generatorName]) {
          var blockList = this.context.customBlocks[generatorName][typeName];
          for (var iBlock=0; iBlock < blockList.length; iBlock++) {
            var blockInfo = blockList[iBlock];
            blocksInfos[blockInfo.name] = {
              nbArgs: 0, // handled below
              type: typeName};
            blocksInfos[blockInfo.name].nbsArgs = [];
            if(blockInfo.anyArgs) {
              // Allows to specify the function can accept any number of arguments
              blocksInfos[blockInfo.name].nbsArgs.push(Infinity);
            }
            var variants = blockInfo.variants ? blockInfo.variants : (blockInfo.params ? [blockInfo.params] : []);
            if(variants.length) {
              for(var i=0; i < variants.length; i++) {
                blocksInfos[blockInfo.name].nbsArgs.push(variants[i].length);
              }
            }
          }
        }
      }

      // Generate functions used in the task
      for (var generatorName in this.context.infos.includeBlocks.generatedBlocks) {
        var blockList = this.context.infos.includeBlocks.generatedBlocks[generatorName];
        if(!blockList.length) { continue; }
        var modContents = "var $builtinmodule = function (name) {\n\nvar mod = {};\nmod.__package__ = Sk.builtin.none.none$;\n";
        if(!this._argumentsByBlock[generatorName]) {
          this._argumentsByBlock[generatorName] = {};
        }
        for (var iBlock=0; iBlock < blockList.length; iBlock++) {
          var blockName = blockList[iBlock];
          var code = this.context.strings.code[blockName];
          if (typeof(code) == "undefined") {
            code = blockName;
          }
          var nbsArgs = blocksInfos[blockName] ? (blocksInfos[blockName].nbsArgs ? blocksInfos[blockName].nbsArgs : []) : [];
          var type = blocksInfos[blockName] ? blocksInfos[blockName].type : 'actions';

          if(type == 'actions') {
            this._hasActions = true;
          }

          this._argumentsByBlock[generatorName][blockName] = nbsArgs;
          modContents += this._skulptifyHandler(code, generatorName, blockName, nbsArgs, type);
        }

        // TODO :: allow selection of constants available in a task
//        if(this.context.infos.includeBlocks.constants && this.context.infos.includeBlocks.constants[generatorName]) {
        if(this.context.customConstants && this.context.customConstants[generatorName]) {
          var constList = this.context.customConstants[generatorName];
          for(var iConst=0; iConst < constList.length; iConst++) {
            var name = constList[iConst].name;
            if(this.context.strings.constant && this.context.strings.constant[name]) {
              name = this.context.strings.constant[name];
            }
            modContents += this._skulptifyConst(name, constList[iConst].value)
          }
        }

        modContents += "\nreturn mod;\n};";
        Sk.builtinFiles["files"]["src/lib/"+generatorName+".js"] = modContents;
        this.availableModules.push(generatorName);
      }
    }
  };

  this.checkArgs = function (name, generatorName, blockName, args) {
    // Check the number of arguments corresponds to a variant of the function
    if(!this._argumentsByBlock[generatorName] || !this._argumentsByBlock[generatorName][blockName]) {
      console.error("Couldn't find the number of arguments for " + generatorName + "/" + blockName + ".");
      return;
    }
    var nbsArgs = this._argumentsByBlock[generatorName][blockName];
    if(nbsArgs.length == 0) {
      // This function doesn't have arguments
      if(args.length > 0) {
        msg = name + "() takes no arguments (" + args.length + " given)";
        throw new Sk.builtin.TypeError(msg);
      }
    } else if(nbsArgs.indexOf(args.length) == -1 && nbsArgs.indexOf(Infinity) == -1) {
      var minArgs = nbsArgs[0];
      var maxArgs = nbsArgs[0];
      for(var i=1; i < nbsArgs.length; i++) {
        minArgs = Math.min(minArgs, nbsArgs[i]);
        maxArgs = Math.max(maxArgs, nbsArgs[i]);
      }
      if (minArgs === maxArgs) {
        msg = name + "() takes exactly " + minArgs + " arguments";
      } else if (args.length < minArgs) {
        msg = name + "() takes at least " + minArgs + " arguments";
      } else if (args.length > maxArgs){
        msg = name + "() takes at most " + maxArgs + " arguments";
      } else {
        msg = name + "() doesn't have a variant accepting this number of arguments";
      }
      msg += " (" + args.length + " given)";
      throw new Sk.builtin.TypeError(msg);
    }
  };

  this._definePythonNumber = function() {
    // Create a class which behaves as a Number, but can have extra properties
    this.pythonNumber = function(val) {
      this.val = new Number(val);
    }
    this.pythonNumber.prototype = Object.create(Number.prototype);
    function makePrototype(func) {
      return function() { return Number.prototype[func].call(this.val); }
    }
    var funcs = ['toExponential', 'toFixed', 'toLocaleString', 'toPrecision', 'toSource', 'toString', 'valueOf'];
    for(var i = 0; i < funcs.length ; i++) {
      this.pythonNumber.prototype[funcs[i]] = makePrototype(funcs[i]);
    }
  }

  this.skToJs = function(val) {
    // Convert Skulpt item to JavaScript
    // TODO :: Might be partly replaceable with Sk.ffi.remapToJs
    if(val instanceof Sk.builtin.bool) {
      return val.v ? true : false;
    } else if(val instanceof Sk.builtin.func) {
      return function() {
        var args = [];
        for(var i = 0; i < arguments.length; i++) {
          args.push(that._createPrimitive(arguments[i]));
        }
        var retp = new Promise(function(resolve, reject) {
          var p = Sk.misceval.asyncToPromise(function() { return val.tp$call(args); });
          p.then(function(val) { resolve(that.skToJs(val)); });
        });
        return retp;
      }
    } else if(val instanceof Sk.builtin.dict) {
      var dictKeys = Object.keys(val);
      var retVal = {};
      for(var i = 0; i < dictKeys.length; i++) {
        var key = dictKeys[i];
        if(key == 'size' || key == '__class__') { continue; }
        var subItems = val[key].items;
        for(var j = 0; j < subItems.length; j++) {
          var subItem = subItems[j];
          retVal[subItem.lhs.v] = this.skToJs(subItem.rhs);
        }
      }
      return retVal;
    } else {
      var retVal = val.v;
      if(val instanceof Sk.builtin.tuple || val instanceof Sk.builtin.list) {
        retVal = [];
        for(var i = 0; i < val.v.length; i++) {
          retVal[i] = this.skToJs(val.v[i]);
        }
      }
      if(val instanceof Sk.builtin.tuple) {
        retVal.isTuple = true;
      }
      if(val instanceof Sk.builtin.float_) {
        retVal = new this.pythonNumber(retVal);
        retVal.isFloat = true;
      }
      return retVal;
    }
  };

  this.getDefinedFunctions = function() {
    this._injectFunctions();
    return this._definedFunctions.slice();
  };

  this._setTimeout = function(func, time) {
    var timeoutId = null;
    var that = this;
    function wrapper() {
      var idx = that._timeouts.indexOf(timeoutId);
      if(idx > -1) { that._timeouts.splice(idx, 1); }
      func();
    }
    timeoutId = window.setTimeout(wrapper, time);
    this._timeouts.push(timeoutId);
  }

  this.waitDelay = function (callback, value, delay) {
    this._paused = true;
    if (delay > 0) {
      var _noDelay = this.noDelay.bind(this, callback, value);
      this._setTimeout(_noDelay, delay);
      // We just waited some time, allow next steps to not be delayed
      this._allowStepsWithoutDelay = Math.min(this._allowStepsWithoutDelay + Math.ceil(delay / 10), 100);
    } else {
      this.noDelay(callback, value);
    }
  };

  this.waitEvent = function (callback, target, eventName, func) {
    this._paused = true;
    var listenerFunc = null;
    var that = this;
    listenerFunc = function(e) {
      target.removeEventListener(eventName, listenerFunc);
      that.noDelay(callback, func(e));
    };
    target.addEventListener(eventName, listenerFunc);
  };

  this.waitCallback = function (callback) {
    // Returns a callback to be called once we can continue the execution
    this._paused = true;
    var that = this;
    return function(value) {
      that.noDelay(callback, value);
    };
  };

  this.noDelay = function (callback, value) {
    var primitive = this._createPrimitive(value);
    if (primitive !== Sk.builtin.none.none$) {
      // Apparently when we create a new primitive, the debugger adds a call to
      // the callstack.
      this._resetCallstackOnNextStep = true;
      this.reportValue(value);
    }
    this._paused = false;
    callback(primitive);
    this._setTimeout(this._continue.bind(this), 10);
  };

  this.allowSwitch = function(callback) {
    // Tells the runner that we can switch the execution to another node
    var curNode = context.curNode;
    var ready = function(readyCallback) {
      if(that.waitingOnReadyNode) {
        that.curNode = curNode;
        that.waitingOnReadyNode = false;
        context.setCurNode(curNode);
        readyCallback(callback);
      } else {
        that.readyNodes[curNode] = function() {
          readyCallback(callback);
        };
      }
    };
    this.readyNodes[curNode] = false;
    this.startNextNode(curNode);
    return ready;
  };

  this.defaultSelectNextNode = function(runner, previousNode) {
    var i = previousNode + 1;
    while(i != previousNode) {
      if(i >= runner.nbNodes) { i = 0; }
      if(runner.readyNodes[i]) {
        break;
      } else {
        i++;
      }
    }
    return i;
  };

  // Allow the next node selection process to be customized
  this.selectNextNode = this.defaultSelectNextNode;

  this.startNextNode = function(curNode) {
    // Start the next node when one has been switched from
    var newNode = this.selectNextNode(this, curNode);
    if(newNode == curNode) {
      // No ready node
      this.waitingOnReadyNode = true;
    } else {
      // TODO :: switch execution
      this._paused = true;
      console.log('about to switch from ' + curNode + '/' + this.context.curNode + ' to ' + newNode);
      setTimeout(function() {
        that.nodeStates[curNode] = that._debugger.suspension_stack.slice();
        that._debugger.suspension_stack = that.nodeStates[newNode];
        that.curNode = newNode;
        var ready = that.readyNodes[newNode];
        console.log('switching to ' + newNode);
        if(ready) {
          that.readyNodes[newNode] = false;
          context.setCurNode(newNode);
          if(typeof ready == 'function') {
            ready();
          } else {
            that._paused = false;
            that._continue();
          }
        } else {
          that.waitingOnReadyNode = true;
        }
      }, 0);
    }
  };

  this._createPrimitive = function (data) {
    // TODO :: Might be replaceable with Sk.ffi.remapToPy
    if (data === undefined || data === null) {
      return Sk.builtin.none.none$;  // Reuse the same object.
    }
    var type = typeof data;
    var result = {v: data}; // Emulate a Skulpt object as default
    if (type === 'number') {
      if(Math.floor(data) == data) { // isInteger isn't supported by IE
        result = new Sk.builtin.int_(data);
      } else {
        result = new Sk.builtin.float_(data);
      }
    } else if (type === 'string') {
      result = new Sk.builtin.str(data);
    } else if (type === 'boolean') {
      result = new Sk.builtin.bool(data);
    } else if (typeof data.length != 'undefined') {
      var skl = [];
      for(var i = 0; i < data.length; i++) {
        skl.push(this._createPrimitive(data[i]));
      }
      result = new Sk.builtin.list(skl);
    } else if (data) {
      // Create a dict if it's an object with properties
      var props = [];
      for(var prop in data) {
        if(data.hasOwnProperty(prop)) {
          // We can pass a list [prop1name, prop1val, ...] to Skulpt's dict
          // constructor ; however to work properly they need to be Skulpt
          // primitives too
          props.push(this._createPrimitive(prop));
          props.push(this._createPrimitive(data[prop]));
        }
      }
      if(props.length > 0) {
        result = new Sk.builtin.dict(props);
      }
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

    // Disable document library
    delete Sk.builtinFiles["files"]["src/lib/document.js"];

    this._definePythonNumber();

    this.context.callCallback = this.noDelay.bind(this);
  };

  this.print = function (message, className) {
    if (message === 'Program execution complete') {
      this._onFinished();
    }
    if (message) {
      //console.log('PRINT: ', message, className || '');
    }
  };

  this._onFinished = function () {
    this.startNextNode(this.curNode);
    if(this.waitingOnReadyNode) {
      this.stop();
    }
    try {
      this.context.infos.checkEndCondition(this.context, true);
    } catch (e) {
      this._onStepError(e);
    }
  };

  this._builtinRead = function (x) {
    if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
      throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
  };

  this.get_source_line = function (lineno) {
    return this._code.split('\n')[lineno];
  };

  this._continue = function () {
    if (this.context.infos.checkEndEveryTurn) {
      try {
        this.context.infos.checkEndCondition(context, false);
      } catch(e) {
        this._onStepError(e);
        return;
      }
    }
    if (!this.context.allowInfiniteLoop && this._steps >= this._maxIterations) {
      this._onStepError(window.languageStrings.tooManyIterations);
    } else if (!this.context.allowInfiniteLoop && this._stepsWithoutAction >= this._maxIterWithoutAction) {
      this._onStepError(window.languageStrings.tooManyIterationsWithoutAction);
    } else if (!this._paused && this._isRunning) {
      this.step();
    }
  };

  this.initCodes = function (codes) {
    if(Sk.running) {
      if(typeof Sk.runQueue === 'undefined') {
        Sk.runQueue = [];
      }
      Sk.runQueue.push({ctrl: this, codes: codes});
      return;
    }

    // Set Skulpt to Python 3
    Sk.python3 = true;

    currentPythonContext = this.context;
    this._debugger = new Sk.Debugger(this._editor_filename, this);
    this._configure();
    this._injectFunctions();
    this._code = codes[0];
    this._setBreakpoint(1, false);

    if(typeof this.context.infos.maxIter !== 'undefined') {
      this._maxIterations = Math.ceil(this.context.infos.maxIter/10);
    }
    if(typeof this.context.infos.maxIterWithoutAction !== 'undefined') {
      this._maxIterWithoutAction = Math.ceil(this.context.infos.maxIterWithoutAction/10);
    }
    if(!this._hasActions) {
      // No limit on
      this._maxIterWithoutAction = this._maxIterations;
    }

    var susp_handlers = {};
    susp_handlers["*"] = this._debugger.suspension_handler.bind(this);

    this.nbNodes = codes.length;
    this.curNode = 0;
    context.setCurNode(this.curNode);
    this.readyNodes = [];
    this.nodeStates = [];
    
    for(var i = 0; i < codes.length ; i++) {
      this.readyNodes.push(true);

      try {
        var promise = this._debugger.asyncToPromise(this._asyncCallback(this._editor_filename, codes[i]), susp_handlers, this._debugger);
        promise.then(this._debugger.success.bind(this._debugger), this._debugger.error.bind(this._debugger));
      } catch (e) {
        this._onOutput(e.toString() + "\n");
      }

      this.nodeStates.push(this._debugger.suspension_stack);
      this._debugger.suspension_stack = [];
    }

    this._debugger.suspension_stack = this.nodeStates[0];

    this._resetInterpreterState();
    Sk.running = true;
    this._isRunning = true;
  };

  this.run = function () {
    if(this.stepMode) {
      this._paused = this._stepInProgress;
      this.stepMode = false;
    }
    this._setTimeout(this._continue.bind(this), 100);
  };

  this.runCodes = function(codes) {
    this.initCodes(codes);
    this.run();
  };

  this.runStep = function () {
    this.stepMode = true;
    if(this._isRunning && !this._stepInProgress) {
      this.step();
    }
  };

  this.nbRunning = function () {
    return this._isRunning ? 1 : 0;
  };

  this.removeEditorMarker = function () {
    var editor = this.context.blocklyHelper._aceEditor;
    if(editor && this._editorMarker) {
      editor.session.removeMarker(this._editorMarker);
      this._editorMarker = null;
    }
  };

  this.unSkulptValue = function (origValue) {
    // Transform a value, possibly a Skulpt one, into a printable value
    if(typeof origValue !== 'object' || origValue === null) {
      var value = origValue;
    } else if(origValue.constructor === Sk.builtin.dict) {
      var keys = Object.keys(origValue);
      var dictElems = [];
      for(var i=0; i<keys.length; i++) {
        if(keys[i] == 'size' || keys[i] == '__class__'
            || !origValue[keys[i]].items
            || !origValue[keys[i]].items[0]) {
          continue;
        }
        var items = origValue[keys[i]].items[0];
        dictElems.push('' + this.unSkulptValue(items.lhs) + ': ' + this.unSkulptValue(items.rhs));
      }
      var value = '{' + dictElems.join(',' ) + '}';
    } else if(origValue.constructor === Sk.builtin.list) {
      var oldArray = origValue.v;
      var newArray = [];
      for(var i=0; i<oldArray.length; i++) {
        newArray.push(this.unSkulptValue(oldArray[i]));
      }
      var value = '[' + newArray.join(', ') + ']';
    } else if(origValue.v !== undefined) {
      var value = origValue.v;
      if(typeof value == 'string') {
        value = '"' + value + '"';
      }
    } else if(typeof origValue == 'object') {
      var value = origValue;
    }
    return value;
  };

  this.reportValue = function (origValue, varName) {
    // Show a popup displaying the value of a block in step-by-step mode
    if(origValue === undefined
        || (origValue && origValue.constructor === Sk.builtin.func)
        || !this._editorMarker
        || !context.display
        || !this.stepMode) {
      return origValue;
    }

    var value = this.unSkulptValue(origValue);

    var highlighted = $('.aceHighlight');
    if(highlighted.length == 0) {
      return origValue;
    } else if(highlighted.find('.ace_start').length > 0) {
      var target = highlighted.find('.ace_start')[0];
    } else {
      var target = highlighted[0];
    }
    var bbox = target.getBoundingClientRect();

    var leftPos = bbox.left+10;
    var topPos = bbox.top-14;

    if(typeof value == 'boolean') {
      var displayStr = value ? window.languageStrings.valueTrue : window.languageStrings.valueFalse;
    } else if(value === null) {
      var displayStr = "None"
    } else {
      var displayStr = value.toString();
    }
    if(typeof value == 'boolean') {
      displayStr = value ? window.languageStrings.valueTrue : window.languageStrings.valueFalse;
    }
    if(varName) {
      displayStr = '' + varName + ' = ' + displayStr;
    }

    var dropDownDiv = '' +
        '<div class="blocklyDropDownDiv" style="transition: transform 0.25s, opacity 0.25s; background-color: rgb(255, 255, 255); border-color: rgb(170, 170, 170); left: '+leftPos+'px; top: '+topPos+'px; display: block; opacity: 1; transform: translate(0px, -20px);">' +
        '  <div class="blocklyDropDownContent">' +
        '    <div class="valueReportBox">' +
        displayStr +
        '    </div>' +
        '  </div>' +
        '  <div class="blocklyDropDownArrow arrowBottom" style="transform: translate(22px, 15px) rotate(45deg);"></div>' +
        '</div>';

    $('.blocklyDropDownDiv').remove();
    $('body').append(dropDownDiv);

    return origValue;
  };

  this.stop = function () {
    for (var i = 0; i < this._timeouts.length; i += 1) {
      window.clearTimeout(this._timeouts[i]);
    }
    this._timeouts = [];
    this.removeEditorMarker();
    if(Sk.runQueue) {
      for (var i=0; i<Sk.runQueue.length; i++) {
        if(Sk.runQueue[i].ctrl === this) {
          Sk.runQueue.splice(i, 1);
          i--;
        }
      }
    }
    if(window.quickAlgoInterface) {
      window.quickAlgoInterface.setPlayPause(false);
    }
    this._resetInterpreterState();
  };

  this.isRunning = function () {
    return this._isRunning;
  };

  this._resetInterpreterState = function () {
    this._steps = 0;
    this._stepsWithoutAction = 0;
    this._lastNbActions = 0;
    this._nbActions = 0;
    this._allowStepsWithoutDelay = 0;

    this._isRunning = false;
    this.stepMode = false;
    this._stepInProgress = false;
    this._resetCallstackOnNextStep = false;
    this._paused = false;
    Sk.running = false;

    if(Sk.runQueue && Sk.runQueue.length > 0) {
      var nextExec = Sk.runQueue.shift();
      setTimeout(function () { nextExec.ctrl.runCodes(nextExec.codes); }, 100);
    }
  };

  this._resetCallstack = function () {
    if (this._resetCallstackOnNextStep) {
      this._resetCallstackOnNextStep = false;
      this._debugger.suspension_stack.pop();
    }
  };

  this.step = function () {
    this._resetCallstack();
    this._stepInProgress = true;
    var editor = this.context.blocklyHelper._aceEditor;
    var markDelay = this.context.infos ? Math.floor(this.context.infos.actionDelay/4) : 0;
    if(this.context.display && (this.stepMode || markDelay > 30)) {
      var curSusp = this._debugger.suspension_stack[this._debugger.suspension_stack.length-1];
      if(curSusp && curSusp.lineno) {
        this.removeEditorMarker();
        var splitCode = this._code.split(/[\r\n]/);
        var Range = ace.require('ace/range').Range;
        this._editorMarker = editor.session.addMarker(
            new Range(curSusp.lineno-1, curSusp.colno, curSusp.lineno, 0),
            "aceHighlight",
            "line");
      }
    } else {
      this.removeEditorMarker();
    }

    var stepDelay = 0;
    if(!this.stepMode && this.context.allowInfiniteLoop) {
      // Add a delay in infinite loops to avoid using all CPU
      if(this._allowStepsWithoutDelay > 0) {
        // We just had a waitDelay, don't delay further
        this._allowStepsWithoutDelay -= 1;
      } else {
        stepDelay = 10;
      }
    }
    var realStepDelay = markDelay + stepDelay;

    if(realStepDelay > 0) {
      this._paused = true;
      setTimeout(this.realStep.bind(this), realStepDelay);
    } else {
      this.realStep();
    }
  };

  this.realStep = function () {
    // For reportValue in Skulpt
    window.currentPythonRunner = this;

    this._paused = this.stepMode;
    this._debugger.enable_step_mode();
    this._debugger.resume.call(this._debugger);
    this._steps += 1;
    if(this._lastNbActions != this._nbActions) {
      this._lastNbActions = this._nbActions;
      this._stepsWithoutAction = 0;
    } else {
      this._stepsWithoutAction += 1;
    }
  };

  this._onStepSuccess = function () {
    // If there are still timeouts, there's still a step in progress
    this._stepInProgress = !!this._timeouts.length;
    this._continue();
  };

  this._onStepError = function (message) {
    context.onExecutionEnd && context.onExecutionEnd();
    // We always get there, even on a success
    this.stop();

    message = '' + message;

    // Skulpt doesn't support well NoneTypes
    if(message.indexOf("TypeError: Cannot read property") > -1 && message.indexOf("undefined") > -1) {
      message = message.replace(/^.* line/, "TypeError: NoneType value used in operation on line");
    }

    if(message.indexOf('undefined') > -1) {
      message += '. ' + window.languageStrings.undefinedMsg;
    }

    // Transform message depending on whether we successfully
    if(this.context.success) {
      message = "<span style='color:green;font-weight:bold'>" + message + "</span>";
    } else {
      message = this.context.messagePrefixFailure + message;
    }

    this.messageCallback(message);
  };

  this._setBreakpoint = function (bp, isTemporary) {
    this._debugger.add_breakpoint(this._editor_filename + ".py", bp, "0", isTemporary);
  };

  this._asyncCallback = function (editor_filename, code) {
    return function() {
      return Sk.importMainWithBody(editor_filename, true, code, true);
    };
  };

  this.signalAction = function () {
    // Allows a context to signal an "action" happened
    this._stepsWithoutAction = 0;
  };
}

function initBlocklyRunner(context, msgCallback) {
  return new PythonInterpreter(context, msgCallback);
};
