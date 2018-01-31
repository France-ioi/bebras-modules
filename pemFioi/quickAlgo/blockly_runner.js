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

      // Iteration limits
      runner.maxIter = 400000;
      runner.maxIterWithoutAction = 500;

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
            for(var i = 0; i < value.length; i++) {
               strs[i] = runner.valueToString(value.properties[i]);
            }
            return '['+strs.join(', ')+']';
         } else {
            return value.toString();
         }
      };

      runner.reportBlockValue = function(id, value, varName) {
         // Show a popup displaying the value of a block in step-by-step mode
         if(context.display && runner.stepMode) {
            var displayStr = runner.valueToString(value);
            if(value.type == 'boolean') {
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
            runner.delayFactory.createTimeout("wait" + context.curRobot + "_" + Math.random(), function() {
                  runner.noDelay(callback, value);
               },
               delay
            );
         } else {
            runner.noDelay(callback, value);
         }
      };

      runner.noDelay = function(callback, value) {
         var primitive = undefined;
         if (value != undefined) {
            primitive = interpreters[context.curRobot].createPrimitive(value);
         }
         if (runner.stackCount > 100) {
            runner.stackCount = 0;
            runner.stackResetting = true;
            runner.delayFactory.createTimeout("wait_" + Math.random(), function() {
               runner.stackResetting = false;
               callback(primitive);
               runner.runSyncBlock();
            }, 0);
         } else {
            runner.stackCount += 1;
            callback(primitive);
            runner.runSyncBlock();
         }
      };

      runner.initInterpreter = function(interpreter, scope) {
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

                  interpreter.setProperty(scope, code, interpreter.createAsyncFunction(handler));
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

         function highlightBlock(id, callback) {
            id = id ? id.toString() : '';

            if (context.display) {
               if(!runner.scratchMode) {
                  context.blocklyHelper.workspace.traceOn(true);
                  context.blocklyHelper.workspace.highlightBlock(id);
                  highlightPause = true;
               } else {
                  context.blocklyHelper.glowBlock(id);
                  highlightPause = true;
               }
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
         interpreter.setProperty(scope, 'highlightBlock', interpreter.createAsyncFunction(highlightBlock));

         // Add an API function to report a value.
         interpreter.setProperty(scope, 'reportBlockValue', interpreter.createNativeFunction(runner.reportBlockValue));

      };

      runner.stop = function() {
         for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
            if (isRunning[iInterpreter]) {
               toStop[iInterpreter] = true;
               isRunning[iInterpreter] = false;
            }
         }

         if(runner.scratchMode) {
            Blockly.DropDownDiv.hide();
            context.blocklyHelper.glowBlock(null);
         }

         runner.nbActions = 0;
         runner.stepInProgress = false;
         runner.stepMode = false;
         runner.firstHighlight = true;
      };

      runner.runSyncBlock = function() {
         runner.resetDone = false;
         runner.stepInProgress = true;
         // Handle the callback from last highlightBlock
         if(runner.nextCallback) {
            runner.nextCallback();
            runner.nextCallback = null;
         }

         try {
            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               context.curRobot = iInterpreter;
               if (context.infos.checkEndEveryTurn) {
                  context.infos.checkEndCondition(context, false);
               }
               var interpreter = interpreters[iInterpreter];
               while (context.curSteps[iInterpreter].total < runner.maxIter && context.curSteps[iInterpreter].withoutAction < runner.maxIterWithoutAction && !context.programEnded[iInterpreter]) {
                  if (!interpreter.step() || toStop[iInterpreter]) {
                     isRunning[iInterpreter] = false;
                     break;
                  }
                  if (interpreter.paused_) {
                     break;
                  }
                  context.curSteps[iInterpreter].total++;
                  if(context.curSteps[iInterpreter].lastNbMoves != runner.nbActions) {
                     context.curSteps[iInterpreter].lastNbMoves = runner.nbActions;
                     context.curSteps[iInterpreter].withoutAction = 0;
                  } else {
                     context.curSteps[iInterpreter].withoutAction++;
                  }
               }

               if (!context.programEnded[iInterpreter]) {
                  if (context.curSteps[iInterpreter].total >= runner.maxIter) {
                     isRunning[iInterpreter] = false;
                     throw context.blocklyHelper.strings.tooManyIterations;
                  } else if(context.curSteps[iInterpreter].withoutAction >= runner.maxIterWithoutAction) {
                     isRunning[iInterpreter] = false;
                     throw context.blocklyHelper.strings.tooManyIterationsWithoutAction;
                  }
               }
            }
         } catch (e) {
            context.onExecutionEnd && context.onExecutionEnd();
            runner.stepInProgress = false;

            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               isRunning[iInterpreter] = false;
               context.programEnded[iInterpreter] = true;
            }

            var message = e.toString();

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
            setTimeout(function() { messageCallback(message); }, 0);
         }
      };

      runner.initCodes = function(codes) {
         runner.delayFactory.destroyAll();
         interpreters = [];
         runner.nbActions = 0;
         runner.stepInProgress = false;
         runner.stepMode = false;
         runner.firstHighlight = true;
         runner.stackCount = 0;
         context.programEnded = [];
         context.curSteps = [];
         runner.reset();
         for (var iInterpreter = 0; iInterpreter < codes.length; iInterpreter++) {
            context.curSteps[iInterpreter] = {
               total: 0,
               withoutAction: 0,
               lastNbMoves: 0
            };
            context.programEnded[iInterpreter] = false;
            interpreters.push(new Interpreter(codes[iInterpreter], runner.initInterpreter));
            isRunning[iInterpreter] = true;
            toStop[iInterpreter] = false;
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
            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               interpreters[iInterpreter].paused_ = false;
            }
            runner.runSyncBlock();
         }
      };

      runner.step = function () {
         runner.stepMode = true;
         if(!runner.stepInProgress) {
            for (var iInterpreter = 0; iInterpreter < interpreters.length; iInterpreter++) {
               interpreters[iInterpreter].paused_ = false;
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

      runner.reset = function() {
         if(runner.resetDone) { return; }
         context.reset();
         runner.stop();
         runner.resetDone = true;
      };

      context.runner = runner;
      context.callCallback = runner.noDelay;
      context.programEnded = [];
   }
}
