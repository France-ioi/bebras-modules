/*!
 * @author John Ropas
 * @since 17/12/2016
 */

// former initBlocklyRunner

function RunController(context, messageCallback) {

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

CodeEditor.Controllers.RunController =  RunController;
