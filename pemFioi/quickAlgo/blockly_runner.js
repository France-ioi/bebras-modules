/*
    blockly_runner:
        Blockly (translated into JavaScript) code runner, with highlighting and
        value reporting features.
*/

function initBlocklyRunner(context, messageCallback) {
   init(context, [], [], [], false, {});

   function init(context, interpreters, isRunning, toStop, stopPrograms, runner) {
      runner.hasActions = false;
      runner.nbActions = 0;
      runner.scratchMode = context.blocklyHelper ? context.blocklyHelper.scratchMode : false;
      runner.delayFactory = new DelayFactory();
      runner.resetDone = false;

      // Node status
      runner.nbNodes = 1;
      runner.curNode = 0;
      runner.nodesReady = [];
      runner.waitingOnReadyNode = false;

      // Iteration limits
      runner.maxIter = 400000;
      runner.maxIterWithoutAction = 500;
      runner.allowStepsWithoutDelay = 0;

      // Counts the call stack depth to know when to reset it
      runner.stackCount = 0;

      // During step-by-step mode
      runner.stepInProgress = false;
      runner.stepMode = false;
      runner.nextCallBack = null;

      // First highlightBlock of this run
      runner.firstHighlight = true;

      runner.strings = languageStrings;

      runner.valueToString = function(value) {
         if(interpreters.length == 0) {
            return value.toString(); // We "need" an interpreter to access ARRAY prototype
         }
         var itp = interpreters[0];
         if(itp.isa(value, itp.ARRAY)) {
            var strs = [];
            for(var i = 0; i < value.properties.length; i++) {
               strs[i] = runner.valueToString(value.properties[i]);
            }
            return '['+strs.join(', ')+']';
         } else if(value && value.toString) {
            return value.toString();
         } else {
            return "" + value;
         }
      };

      runner.reportBlockValue = function(id, value, varName) {
         // Show a popup displaying the value of a block in step-by-step mode
         if(context.display && runner.stepMode) {
            var displayStr = runner.valueToString(value);
            if(value && value.type == 'boolean') {
               displayStr = value.data ? runner.strings.valueTrue : runner.strings.valueFalse;
            }
            if(varName) {
               varName = varName.toString();
               // Get the original variable name
               for(var dbIdx in Blockly.JavaScript.variableDB_.db_) {
                  if(Blockly.JavaScript.variableDB_.db_[dbIdx] == varName) {
                     varName = dbIdx.substring(0, dbIdx.length - 9);
                     // Get the variable name with the right case
                     for(var i=0; i<context.blocklyHelper.workspace.variableList.length; i++) {
                        var varNameCase = context.blocklyHelper.workspace.variableList[i];
                        if(varName.toLowerCase() == varNameCase.toLowerCase()) {
                           varName = varNameCase;
                           break;
                        }
                     }
                     break;
                  }
               }
               displayStr = varName + ' = ' + displayStr;
            }
            context.blocklyHelper.workspace.reportValue(id, displayStr);
         }
         return value;
      };

      runner.waitDelay = function(callback, value, delay) {
         if (delay > 0) {
            runner.stackCount = 0;
            runner.delayFactory.createTimeout("wait" + context.curNode + "_" + Math.random(), function() {
                  runner.noDelay(callback, value);
               },
               delay
            );
            runner.allowStepsWithoutDelay = Math.min(runner.allowStepsWithoutDelay + Math.ceil(delay/10), 100);
         } else {
            runner.noDelay(callback, value);
         }
      };

      runner.waitEvent = function(callback, target, eventName, func) {
         runner.stackCount = 0;
         var listenerFunc = null;
         listenerFunc = function(e) {
            target.removeEventListener(eventName, listenerFunc);
            runner.noDelay(callback, func(e));
         };
         target.addEventListener(eventName, listenerFunc);
      };

      runner.waitCallback = function(callback) {
         // Returns a callback to be called once we can continue the execution
         //runner.stackCount = 0;
         return function(value) {
            runner.noDelay(callback, value);
         }
      };

      runner.noDelay = function(callback, value) {
         var primitive = undefined;
         if (value !== undefined) {
            if(value && (typeof value.length != 'undefined' ||
                         typeof value === 'object')) {
               // It's an array, create a primitive out of it
               primitive = interpreters[context.curNode].nativeToPseudo(value);
            } else {
               primitive = value;
            }
         }
         var infiniteLoopDelay = false;
         if(context.allowInfiniteLoop) {
            if(runner.allowStepsWithoutDelay > 0) {
               runner.allowStepsWithoutDelay -= 1;
            } else {
               infiniteLoopDelay = true;
            }
         }
         if(runner.stackCount > 100 || (infiniteLoopDelay && runner.stackCount > 5)) {
            // In case of an infinite loop, add some delay to slow down a bit
            var delay = infiniteLoopDelay ? 50 : 0;

            runner.stackCount = 0;
            runner.stackResetting = true;
            runner.delayFactory.createTimeout("wait_" + Math.random(), function() {
               runner.stackResetting = false;
               callback(primitive);
               runner.runSyncBlock();
            }, delay);
         } else {
            runner.stackCount += 1;
            callback(primitive);
            runner.runSyncBlock();
         }
      };

      runner.allowSwitch = function(callback) {
         // Tells the runner that we can switch the execution to another node
         var curNode = context.curNode;
         var ready = function(readyCallback) {
            if(runner.waitingOnReadyNode) {
               runner.curNode = curNode;
               runner.waitingOnReadyNode = false;
               context.setCurNode(curNode);
               readyCallback(callback);
            } else {
               runner.nodesReady[curNode] = function() {
                  readyCallback(callback);
               };
            }
         };
         runner.nodesReady[curNode] = false;
         runner.startNextNode(curNode);
         return ready;
      };

      runner.defaultSelectNextNode = function(runner, previousNode) {
         var i = previousNode + 1;
         if(i >= runner.nbNodes) { i = 0; }
         while(i != previousNode) {
            if(runner.nodesReady[i]) {
               break;
            } else {
               i++;
            }
            if(i >= runner.nbNodes) { i = 0; }
         }
         return i;
      };

      // Allow the next node selection process to be customized
      runner.selectNextNode = runner.defaultSelectNextNode;

      runner.startNextNode = function(curNode) {
         // Start the next node when one has been switched from
         var newNode = runner.selectNextNode(runner, curNode);
         function setWaiting() {
            for(var i = 0; i < runner.nodesReady.length ; i++) {
               if(!context.programEnded[i]) {
                  // TODO :: Timeout?
                  runner.waitingOnReadyNode = true;
                  return;
               }
            }
            // All nodes finished their program
            // TODO :: better message
            throw "all nodes finished (blockly_runner)";
         }
         if(newNode == curNode) {
            // No ready node
            setWaiting();
         } else {
            runner.curNode = newNode;
            var ready = runner.nodesReady[newNode];
            if(ready) {
               context.setCurNode(newNode);
               if(typeof ready == 'function') {
                  ready();
               }
               runner.nodesReady[newNode] = false;
               runner.runSyncBlock();
            } else {
               setWaiting();
            }
         }
      };

      runner.initInterpreter = function(interpreter, scope) {
         // Wrapper for async functions
         var createAsync = function(func) {
            return function() {
               var args = [];
               for(var i=0; i < arguments.length-1; i++) {
                  // TODO :: Maybe JS-Interpreter has a better way of knowing?
                  if(typeof arguments[i] != 'undefined' && arguments[i].isObject) {
                     args.push(interpreter.pseudoToNative(arguments[i]));
                  } else {
                     args.push(arguments[i]);
                  }
               }
               args.push(arguments[arguments.length-1]);
               func.apply(func, args);
               };
         };

         var makeHandler = function(runner, handler) {
            // For commands belonging to the "actions" category, we count the
            // number of actions to put a limit on steps without actions
            return function () {
               runner.nbActions += 1;
               handler.apply(this, arguments);
            };
         };

         for (var objectName in context.customBlocks) {
            for (var category in context.customBlocks[objectName]) {
               for (var iBlock in context.customBlocks[objectName][category]) {
                  var blockInfo = context.customBlocks[objectName][category][iBlock];
                  var code = context.strings.code[blockInfo.name];
                  if (typeof(code) == "undefined") {
                     code = blockInfo.name;
                  }

                  if(category == 'actions') {
                     runner.hasActions = true;
                     var handler = makeHandler(runner, blockInfo.handler);
                  } else {
                     var handler = blockInfo.handler;
                  }

                  interpreter.setProperty(scope, code, interpreter.createAsyncFunction(createAsync(handler)));
               }
            }
         }

         var makeNative = function(func) {
            return function() {
               var value = func.apply(func, arguments);
               var primitive = undefined;
               if (value != undefined) {
                  if(typeof value.length != 'undefined') {
                     // It's an array, create a primitive out of it
                     primitive = interpreters[context.curNode].nativeToPseudo(value);
                  } else {
                     primitive = value;
                  }
               }
               return primitive;
            };
         }

         if(Blockly.JavaScript.externalFunctions) {
            for(var name in Blockly.JavaScript.externalFunctions) {
               interpreter.setProperty(scope, name, interpreter.createNativeFunction(makeNative(Blockly.JavaScript.externalFunctions[name])));
            }
         }

         /*for (var objectName in context.generators) {
            for (var iGen = 0; iGen < context.generators[objectName].length; iGen++) {
               var generator = context.generators[objectName][iGen];
               interpreter.setProperty(scope, objectName + "_" + generator.labelEn, interpreter.createAsyncFunction(generator.fct));
            }
         }*/
         interpreter.setProperty(scope, "program_end", interpreter.createAsyncFunction(createAsync(context.program_end)));

         function highlightBlock(id, callback) {
            id = id ? id.toString() : '';

            if (context.display) {
               try {
                  if(context.infos && !context.infos.actionDelay) {
                     id = null;
                  }
                  context.blocklyHelper.highlightBlock(id);
                  highlightPause = !!id;
               } catch(e) {}
            }

            // We always execute directly the first highlightBlock
            if(runner.firstHighlight || !runner.stepMode) {
               runner.firstHighlight = false;
               callback();
               runner.runSyncBlock();
            } else {
               // Interrupt here for step mode, allows to stop before each
               // instruction
               runner.nextCallback = callback;
               runner.stepInProgress = false;
            }
         }

         // Add an API function for highlighting blocks.
         interpreter.setProperty(scope, 'highlightBlock', interpreter.createAsyncFunction(createAsync(highlightBlock)));

         // Add an API function to report a value.
         interpreter.setProperty(scope, 'reportBlockValue', interpreter.createNativeFunction(runner.reportBlockValue));

      };

      runner.stop = function(aboutToPlay) {
         for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
            if (isRunning[iInterpreter]) {
               toStop[iInterpreter] = true;
               isRunning[iInterpreter] = false;
            }
         }

         if(runner.scratchMode) {
            Blockly.DropDownDiv.hide();
            context.blocklyHelper.highlightBlock(null);
         }

         if(!aboutToPlay && window.quickAlgoInterface) {
            window.quickAlgoInterface.setPlayPause(false);
         }

         runner.nbActions = 0;
         runner.stepInProgress = false;
         runner.stepMode = false;
         runner.firstHighlight = true;
      };

      runner.runSyncBlock = function() {
         runner.resetDone = false;
         runner.stepInProgress = true;
         runner.oneStepDone = false;
         // Handle the callback from last highlightBlock
         if(runner.nextCallback) {
            runner.nextCallback();
            runner.nextCallback = null;
         }

         try {
            if(runner.stepMode && runner.oneStepDone) {
               runner.stepInProgress = false;
               return;
            }
            var iInterpreter = runner.curNode;
            context.setCurNode(iInterpreter);
            if (context.infos.checkEndEveryTurn) {
               context.infos.checkEndCondition(context, false);
            }
            var interpreter = interpreters[iInterpreter];
            var wasPaused = interpreter.paused_;
            while(!context.programEnded[iInterpreter]) {
               if(!context.allowInfiniteLoop &&
                     (context.curSteps[iInterpreter].total >= runner.maxIter || context.curSteps[iInterpreter].withoutAction >= runner.maxIterWithoutAction)) {
                  return;
               }
               if (!interpreter.step() || toStop[iInterpreter]) {
                  isRunning[iInterpreter] = false;
                  return;
               }
               if (interpreter.paused_) {
                  runner.oneStepDone = !wasPaused;
                  return;
               }
               context.curSteps[iInterpreter].total++;
               if(context.curSteps[iInterpreter].lastNbMoves != runner.nbActions) {
                  context.curSteps[iInterpreter].lastNbMoves = runner.nbActions;
                  context.curSteps[iInterpreter].withoutAction = 0;
               } else {
                  context.curSteps[iInterpreter].withoutAction++;
               }
            }

            if (!context.programEnded[iInterpreter] && !context.allowInfiniteLoop) {
               if (context.curSteps[iInterpreter].total >= runner.maxIter) {
                  isRunning[iInterpreter] = false;
                  throw context.blocklyHelper.strings.tooManyIterations;
               } else if(context.curSteps[iInterpreter].withoutAction >= runner.maxIterWithoutAction) {
                  isRunning[iInterpreter] = false;
                  throw context.blocklyHelper.strings.tooManyIterationsWithoutAction;
               }
            }

            if(context.programEnded[iInterpreter]) {
               runner.startNextNode(iInterpreter);
            }
         } catch (e) {
            context.onExecutionEnd && context.onExecutionEnd();
            runner.stepInProgress = false;

            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               isRunning[iInterpreter] = false;
               context.programEnded[iInterpreter] = true;
            }

            var message = e.message || e.toString();

            // Translate "Unknown identifier" message
            if(message.substring(0, 20) == "Unknown identifier: ") {
               var varName = message.substring(20);
               // Get original variable name if possible
               for(var dbIdx in Blockly.JavaScript.variableDB_.db_) {
                  if(Blockly.JavaScript.variableDB_.db_[dbIdx] == varName) {
                     varName = dbIdx.substring(0, dbIdx.length - 9);
                     break;
                  }
               }
               message = runner.strings.uninitializedVar + ' ' + varName;
            }

            if(message.indexOf('undefined') != -1) {
               console.error(e)
               message += '. ' + runner.strings.undefinedMsg;
            }

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
            runner.delayFactory.destroyAll();
            if(window.quickAlgoInterface) {
               window.quickAlgoInterface.setPlayPause(false);
            }
            setTimeout(function() { messageCallback(message); }, 0);
         }
      };

      runner.initCodes = function(codes) {
         runner.delayFactory.destroyAll();
         interpreters = [];
         runner.nbNodes = codes.length;
         runner.curNode = 0;
         runner.nodesReady = [];
         runner.waitingOnReadyNode = false;
         runner.nbActions = 0;
         runner.stepInProgress = false;
         runner.stepMode = false;
         runner.allowStepsWithoutDelay = 0;
         runner.firstHighlight = true;
         runner.stackCount = 0;
         context.programEnded = [];
         context.curSteps = [];
         runner.reset(true);
         for (var iInterpreter = 0; iInterpreter < codes.length; iInterpreter++) {
            context.curSteps[iInterpreter] = {
               total: 0,
               withoutAction: 0,
               lastNbMoves: 0
            };
            context.programEnded[iInterpreter] = false;

            interpreters.push(new Interpreter(codes[iInterpreter], runner.initInterpreter));
            runner.nodesReady.push(true);
            isRunning[iInterpreter] = true;
            toStop[iInterpreter] = false;

            if(iInterpreter > 0) {
               // This is a fix for pseudoToNative identity comparisons (===),
               // as without that fix, pseudo-objects coming from another
               // interpreter would not get recognized to the right type.
               interpreters[iInterpreter].ARRAY = interpreters[0].ARRAY;
               interpreters[iInterpreter].ARRAY_PROTO = interpreters[0].ARRAY_PROTO;
               interpreters[iInterpreter].REGEXP = interpreters[0].REGEXP;
            }
         }
         runner.maxIter = 400000;
         if (context.infos.maxIter != undefined) {
            runner.maxIter = context.infos.maxIter;
         }
         if(runner.hasActions) {
            runner.maxIterWithoutAction = 500;
            if (context.infos.maxIterWithoutAction != undefined) {
               runner.maxIterWithoutAction = context.infos.maxIterWithoutAction;
            }
         } else {
            // If there's no actions in the current task, "disable" the limit
            runner.maxIterWithoutAction = runner.maxIter;
         }
      };

      runner.runCodes = function(codes) {
         runner.initCodes(codes);
         runner.runSyncBlock();
      };

      runner.run = function () {
         runner.stepMode = false;
         if(!runner.stepInProgress) {
            // XXX :: left to avoid breaking tasks in case I'm wrong, but we
            // should be able to remove this code (it breaks multi-interpreter
            // step-by-step)
            if(interpreters.length == 1) {
               interpreters[0].paused_ = false;
            }
            runner.runSyncBlock();
         }
      };

      runner.step = function () {
         runner.stepMode = true;
         if(!runner.stepInProgress) {
            // XXX :: left to avoid breaking tasks in case I'm wrong, but we
            // should be able to remove this code (it breaks multi-interpreter
            // step-by-step)
            if(interpreters.length == 1) {
               interpreters[0].paused_ = false;
            }
            runner.runSyncBlock();
         }
      };

      runner.nbRunning = function() {
         var nbRunning = 0;
         for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
            if (isRunning[iInterpreter]) {
               nbRunning++;
            }
         }
         return nbRunning;
      };

      runner.isRunning = function () {
         return this.nbRunning() > 0;
      };

      runner.reset = function(aboutToPlay) {
         if(runner.resetDone) { return; }
         context.reset();
         runner.stop(aboutToPlay);
         runner.resetDone = true;
      };

      runner.signalAction = function() {
         // Allows contexts to signal an "action" happened
         for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
            context.curSteps[iInterpreter].withoutAction = 0;
         }
      };

      context.runner = runner;
      context.callCallback = runner.noDelay;
      context.programEnded = [];
   }
}
