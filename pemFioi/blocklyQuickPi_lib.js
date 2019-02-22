// This is a template of library for use with quickAlgo.
var getContext = function(display, infos, curLevel) {
   // Local language strings for each language
   var localLanguageStrings = {
      fr: { // French strings
         label: {
            // Labels for the blocks
            turnLedOn: "Turn Led On",
            turnLedOff: "Turn Led Off",
            buttonState: "Return Button State",
            buttonStateInPort: "Return Button State in port %1",
            waitForButton: "Wait for button",
            buttonWasPressed: "Was button pressed",
            changeLedState: "Turn led %2 in port %1",
            displayText: "Display in screen Line 1: %1 Line 2: %2",
            readTemperature: "Read Ambient temperature",
            sleep: "Pause program for %1 seconds",
            setServoAngle: "Set servo to %2 angle in port %1",
            readRotaryAngle: "Read state of potentiometer",
         },
         code: {
            // Names of the functions in Python, or Blockly translated in JavaScript
            turnLedOn: "turnLedOn",
            turnLedOff: "turnLedOff",
            buttonState: "buttonState",
            buttonStateInPort: "buttonStateInPort",
            waitForButton: "waitForButton",
            buttonWasPressed: "buttonWasPressed",
            changeLedState: "changeLedState",
            displayText: "displayText",
            readTemperature: "readTemperature",
            sleep: "sleep",
            setServoAngle: "setServoAngle",
            readRotaryAngle: "readRotaryAngle",
         },
         description: {
            // Descriptions of the functions in Python (optional)
            turnLedOn: "turnLedOn(): Turns on a light connected to Raspberry",
            turnLedOff: "turnLedOff(): Turns off a light connected to Raspberry",
            buttonState: "buttonState(): Returns the state of a button, Pressed means True and not pressed means False",
            buttonStateInPort: "buttonStateInPort(): Returns the state of a button, Pressed means True and not pressed means False",
            waitForButton: "waitForButton(): Stops program execution until a button is pressed",
            buttonWasPressed: "buttonWasPressed(): Returns true if the button has been pressed and will clear the value",
            changeLedState: "changeLedState(): Change led state in the given port",
            displayText: "displayText(): Display text in LCD screen",
            readTemperature: "readTemperature(): Read Ambient temperature",
            sleep: "sleep(): pause program execute for a number of seconds",
            setServoAngle: "setServoAngle(): Set servo motor to an specified angle",
            readRotaryAngle: "readRotaryAngle(): Read state of potentiometer",
         },
         constant: {
            // Translations for constant names (optional)
            /*"ONE": "UN",
            "TRUEVALUE": "VALEURVRAI",
            "LIBNAME": "NOMLIB",*/
         },

         startingBlockName: "Programme", // Name for the starting block
         messages: {
         }
      },
      none: {
         comment: {
            // Comments for each block, used in the auto-generated documentation for task writers
            turnLedOn: "Turns on a light connected to Raspberry",
            turnLedOff: "Turns off a light connected to Raspberry",
            buttonState: "Returns the state of a button, Pressed means True and not pressed means False",
            buttonStateInPort: "Returns the state of a button, Pressed means True and not pressed means False",
            waitForButton: "Stops program execution until a button is pressed",
            buttonWasPressed: "Returns true if the button has been pressed and will clear the value",
            changeLedState: "Change led state in the given port",
            displayText: "Display text in LCD screen",
            readTemperature: "Read Ambient temperature",
            sleep: "pause program execute for a number of seconds",
            setServoAngle: "Set servo motor to an specified angle",
            readRotaryAngle: "Read state of potentiometer",
         }
      }
   }

   // Create a base context
   var context = quickAlgoContext(display, infos);
   // Import our localLanguageStrings into the global scope
   var strings = context.setLocalLanguageStrings(localLanguageStrings);


   // Some data can be made accessible by the library through the context object
   context.quickpi = {};

   context.TASK_FAILED = 0;
   context.TASK_SUCCEEDED = 1;
   context.TASK_ONGOING = 2;

   context.quickPiConnection = getQuickPiConnection("USERNAMEGOESHERE", raspberryPiConnected, raspberryPiDisconnected);
   var paper;
   context.offLineMode = true;

   // A context must have a reset function to get back to the initial state
    context.reset = function (taskInfos) {
        // Do something here
        if (!context.offLineMode)
            context.quickPiConnection.startNewSession();

        context.currentEventStreamPos = 0;
        context.sensorReturnsPos = 0;
        if (taskInfos != undefined ) {
            context.autoGrading = taskInfos.autoGrading;
            
            if (context.autoGrading) {
                context.currentEventStream = new Array(taskInfos.patterRepeat * taskInfos.eventStream.length);
                context.expectedEventStream = taskInfos.eventStream;
                context.patterRepeat = taskInfos.patterRepeat;
                context.failed = false;
            }
        }

      if (context.display) {
         context.resetDisplay();
      }
   };


   // Reset the context's display
   context.resetDisplay = function() {
      // Do something here
      //$('#grid').html('Display for the library goes here.');

      // Ask the parent to update sizes
      //context.blocklyHelper.updateSize();
      //context.updateScale();

       $('#grid').html('<div id="piui" style="background-color: green;">Raspberry Pi IP Address <input type="text" id="piaddress" value="192.168.1.31"><button type="button" id="piconnect">Connect!</button>Status: <span id="pistatus">Disconnected</span></div></div><div id=virtualSensors></div><div><button type="button" id="piinstall">Install!</button></div>');

       this.raphaelFactory.destroyAll();
       paper = this.raphaelFactory.create("paperMain", "virtualSensors", $('#grid').width() - 24, $('#grid').height() - 24);

       var quickPiSensors = infos.quickPiSensors;
       if (!Array.isArray(infos.quickPiSensors)) {
           quickPiSensors = infos.quickPiSensors;
       } 

       if (context.autoGrading) {
           var numSensors = infos.quickPiSensors.length;
           var sensorSize = paper.height / numSensors * 0.80;
           var sensorsPercolumn = Math.ceil(numSensors)
           var currentColumn = 0


           for (var i = 0; i < infos.quickPiSensors.length; i++) {
               var sensor = infos.quickPiSensors[i];

               sensor.drawInfo = {
                   x: 0,
                   y: sensorSize * i,
                   width: sensorSize * .90,
                   height: sensorSize * .90
               }

               sensor.state = null;

               drawSensor(sensor);
           }

           for (var iStateGroup = 0; iStateGroup < context.expectedEventStream.length; iStateGroup++) {
               var stateGroup = context.expectedEventStream[iStateGroup];

               for (var i = 0; i < stateGroup.length; i++) {
                    sensor = findSensor(stateGroup[i].sensorType, stateGroup[i].port);
                    if (sensor)
                        drawSensorTimeLineState(sensor, stateGroup[i].state, iStateGroup, "expected");
                    else
                        console.log("Reference to not existing sensor");
               }
            }
       } else {
           
           var numSensors = infos.quickPiSensors.length;
           var numColumns = 2;
           var sensorSize = paper.height / numSensors * numColumns * 0.80;
           var sensorsPercolumn = Math.ceil(numSensors / numColumns)

           var currentColumn = 0
           var sensorsInColumn = 0;

           for (var i = 0; i < infos.quickPiSensors.length; i++) {
               sensor = infos.quickPiSensors[i];

               sensor.drawInfo = {
                   x: sensorSize * currentColumn * 2,
                   y: sensorSize * sensorsInColumn,
                   width: sensorSize * .90,
                   height: sensorSize * .90
               }

               sensorsInColumn++;
               if (sensorsInColumn == sensorsPercolumn)
               {
                    currentColumn++;
                    sensorsInColumn = 0;
               }

               sensor.state = null;

               drawSensor(sensor);
           }
       }

      context.blocklyHelper.updateSize();
      //context.updateScale();

       context.reconnect = true;
       context.offLineMode = true;

       if (context.quickPiConnection.isConnecting()) {
           $('#pistatus').html("Connecting...");
           $('#piconnect').html("Release");
           $('#piconnect').attr("disabled", true);
           $('#piinstall').attr("hidden", true);
           $('#piui').css('background-color', 'brown');
           //context.offLineMode = false;
       }


       if (context.quickPiConnection.isConnected()) {
           $('#pistatus').html("Connected");
           $('#piconnect').attr("disabled", false);
           $('#piinstall').attr("hidden", false);
           $('#piui').css('background-color', 'green');

           context.offLineMode = false;
       }

       $('#piconnect').click(function () {
           // if in offline mode try to connect
           if (context.offLineMode) {
                var ipaddress = $('#piaddress').val();
                sessionStorage.raspberryPiIpAddress = ipaddress;

                $('#pistatus').html("Connecting...");
                $('#piconnect').attr("disabled", true);
                context.quickPiConnection.connect(ipaddress);
           } else {
                // IF connected release lock
                context.reconnect = false;
                context.quickPiConnection.releaseLock();
           }
       });

       $('#piinstall').click(function () {
           context.blocklyHelper.reportValues = false;
           python_code = context.blocklyHelper.getCode("python");

            context.quickPiConnection.installProgram(python_code);
           var a = 1;
       });


       if (sessionStorage.autoConnect) {
           if (!context.quickPiConnection.isConnected() &&  !context.quickPiConnection.isConnecting()) {
               $('#pistatus').html("Connecting...");
               $('#piconnect').attr("disabled", true);
               context.quickPiConnection.connect(sessionStorage.raspberryPiIpAddress);
           }
       }
    };

    function raspberryPiConnected()
    {
        context.quickPiConnection.startNewSession();

        context.offLineMode = false;
        $('#pistatus').html("Connected");
        $('#piconnect').html("Release");
        $('#piconnect').attr("disabled", false);
        $('#piinstall').attr("hidden", false);
        $('#piui').css('background-color', 'green');

        sessionStorage.autoConnect = true;
    }

    function raspberryPiDisconnected(wasConnected) {
        $('#piconnect').html("Connect");
        $('#piinstall').attr("hidden", true);
        $('#piui').css('background-color', 'brown');
        $('#pistatus').html("Disconnected ...");

        context.offLineMode = true;

        if (wasConnected && context.reconnect) {
            $('#piconnect').attr("disabled", true);
            context.quickPiConnection.connect(sessionStorage.raspberryPiIpAddress);
        } else {
            // If I was never connected don't attempt to autoconnect again
            $('#piconnect').attr("disabled", false);
            sessionStorage.autoConnect = false;
        }

    }


   // Update the context's display to the new scale (after a window resize for instance)
   context.updateScale = function() {
      if (!context.display) {
         return;
      }
      context.resetDisplay();
   };

   // When the context is unloaded, this function is called to clean up
   // anything the context may have created
   context.unload = function() {
      // Do something here
      if (context.display) {
         // Do something here
      }
    };

    function findSensor(type, port) {
        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            sensor = infos.quickPiSensors[i];

            if (sensor.type == type && sensor.port == port)
                return sensor;
        }

        return null;
    }

    function sensorStateToPercent(sensor, state)
    {
        var retVal = 0;
        switch(sensor.type)
        {
            case "button":
            case "led":
                if (state)
                    retVal = 1;
                else
                    retVal = 0;
                break;
        }

        return retVal;
    }


    function drawSensorTimeLineState(sensor, state, stateNumber, type) {
        var stateOffset = 160;

        var percentage = sensorStateToPercent(sensor, state);

        if (percentage == 0)
            return;

        var yposition = ((sensor.drawInfo.y + (sensor.drawInfo.height * percentage)) + (sensor.drawInfo.height * .20)); 

        color = "green";
        if (type == "expected") {
            color = "blue";
        } else if (type == "wrong") {
            color = "red";
            yposition += 4;
        }
        else if (type == "actual") {
            color = "green";
            yposition += 4;
        }

        stateline = paper.path(["M", sensor.drawInfo.x + stateOffset + (sensor.drawInfo.width * stateNumber),
                                yposition,
                                "L", sensor.drawInfo.x + stateOffset + 40 + (sensor.drawInfo.width * stateNumber),
                                yposition]);

        stateline.attr({
            "stroke-width": 5, "stroke" : color });

        if (type == "wrong") {
            wrongindicator = paper.path(["M", sensor.drawInfo.x + stateOffset + (sensor.drawInfo.width * stateNumber),
                             sensor.drawInfo.y,
                        "L", sensor.drawInfo.x + stateOffset + 40 + (sensor.drawInfo.width * stateNumber),
                                sensor.drawInfo.y + sensor.drawInfo.height, 

                        "M", sensor.drawInfo.x + stateOffset + (sensor.drawInfo.width * stateNumber),
                                sensor.drawInfo.y + sensor.drawInfo.height,
                        "L", sensor.drawInfo.x + stateOffset + 40 + (sensor.drawInfo.width * stateNumber),
                                   sensor.drawInfo.y
                            ]);

            wrongindicator.attr({
                "stroke-width": 5, "stroke" : "red", "stroke-linecap": "round" });
        }
    }


    function drawSensor(sensor, state = true) {
        var imageOffSet = 50;
        var arrowsOffset = 200;
    
        var imgx = sensor.drawInfo.x + (sensor.drawInfo.width * .3);

        var state1x = sensor.drawInfo.x + (sensor.drawInfo.width * 1.3);
        var state1y = sensor.drawInfo.y + (sensor.drawInfo.height/2);

        if (paper == undefined || !context.display)
            return;

        if (sensor.img)
            sensor.img.remove();

        if (sensor.type == "led") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.img = paper.image('../../modules/img/quickpi/ledon.png', imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(state1x, state1y, "ON");
            } else {
                sensor.img = paper.image('../../modules/img/quickpi/ledoff.png', imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(state1x, state1y, "OFF");
            }

        } else if (sensor.type == "button") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.img = paper.image('../../modules/img/quickpi/buttonon.png', imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(state1x, state1y, "ON");
            } else {
                sensor.img = paper.image('../../modules/img/quickpi/buttonoff.png', imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(state1x, state1y, "OFF");
            }

            sensor.img.node.ontouchstart = function () {
                sensor.state = true;
                drawSensor(sensor);
            };

            sensor.img.node.onmousedown = function () {
                sensor.state = true;
                drawSensor(sensor);
            };


            sensor.img.node.ontouchend = function () {
                sensor.state = false;
                sensor.wasPressed = true;
                drawSensor(sensor);

                if (sensor.onPressed)
                    sensor.onPressed();
            }

            sensor.img.node.onmouseup = function () {
                sensor.state = false;
                sensor.wasPressed = true;
                drawSensor(sensor);

                if (sensor.onPressed)
                    sensor.onPressed();
            }


        } else if (sensor.type == "screen") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.stateText2)
                sensor.stateText2.remove();

            sensor.img = paper.image('../../modules/img/quickpi/screen.png', imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

            if (sensor.state) {
                sensor.stateText = paper.text(state1x, state1y, sensor.state.line1);
                sensor.stateText2 = paper.text(state1x, state1y + 15, sensor.state.line2);
            }
        } else if (sensor.type == "temperature") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.uparrow)
                sensor.uparrow.remove();

            if (sensor.downarrow)
                sensor.downarrow.remove();


            if (!sensor.state)
                sensor.state = 25; // FIXME

            sensor.img = paper.image('../../modules/img/quickpi/temperature.png', imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "C");

            var arrowsize = sensor.drawInfo.height * .30;

            sensor.uparrow = paper.image('../../modules/img/quickpi/uparrow.png', state1x, sensor.drawInfo.y, arrowsize, arrowsize);
            sensor.downarrow = paper.image('../../modules/img/quickpi/downarrow.png', state1x, sensor.drawInfo.y + sensor.drawInfo.height - arrowsize, arrowsize, arrowsize);


            sensor.uparrow.node.onclick = function () {
                sensor.state += 1;
                drawSensor(sensor);
            };

            sensor.downarrow.node.onclick = function () {
                sensor.state -= 1;
                drawSensor(sensor);
            };            

        } else if (sensor.type == "servo") {
            if (sensor.stateText)
                sensor.stateText.remove();

            sensor.img = paper.image('../../modules/img/quickpi/servo.png', imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

            if (sensor.state == null)
                sensor.state = 0;

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "°");
        }
        else if (sensor.type == "potentiometer") {
            if (sensor.stateText)
                sensor.stateText.remove();

                
            if (sensor.uparrow)
                sensor.uparrow.remove();

            if (sensor.downarrow)
                sensor.downarrow.remove();

            sensor.img = paper.image('../../modules/img/quickpi/potentiometer.png', imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

            if (sensor.state == null)
                sensor.state = 0;

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "%");

            var arrowsize = sensor.drawInfo.height * .30;

            sensor.uparrow = paper.image('../../modules/img/quickpi/uparrow.png', state1x, sensor.drawInfo.y, arrowsize, arrowsize);
            sensor.downarrow = paper.image('../../modules/img/quickpi/downarrow.png', state1x, sensor.drawInfo.y + sensor.drawInfo.height - arrowsize, arrowsize, arrowsize);

            sensor.uparrow.node.onclick = function () {
                sensor.state += 1;
                if (sensor.state > 100)
                sensor.state = 100;
                drawSensor(sensor);
            };

            sensor.downarrow.node.onclick = function () {
                sensor.state -= 1;
                if (sensor.state < 0)
                    sensor.state = 0;
                drawSensor(sensor);
            };            
        }

        if (sensor.portText)
            sensor.portText.remove();

        stateFontSize = sensor.drawInfo.height * 0.13;
        portFontSize = sensor.drawInfo.height * 0.20;
        
        

        if (sensor.hasOwnProperty("stateText"))
            sensor.stateText.attr({ "font-size": stateFontSize + "px", 'text-anchor': 'start', 'font-weight': 'bold' });

        if (sensor.hasOwnProperty("stateText2"))
            sensor.stateText2.attr({ "font-size": stateFontSize + "px", 'text-anchor': 'start', 'font-weight': 'bold' });

        sensor.portText = paper.text(sensor.drawInfo.x, sensor.drawInfo.y + (sensor.drawInfo.height/2), sensor.port);
        sensor.portText.attr({ "font-size": portFontSize + "px", 'text-anchor': 'start', 'font-weight': 'bold' });
    }

    context.registerQuickPiEvent = function(sensorType, port, newState, setInSensor=true) {
        var sensor = findSensor(sensorType, port);
        if (!sensor) {
            throw("Sensors is not registered");
        }

        // Ignore events that don't change states
        if (sensorType == "sleep")
        {
            // Merge multiple sleeps
        }

        if (sensor.state == newState)
            return;

        if (setInSensor) {
            sensor.state = newState;
            drawSensor(sensor);
        }

        if (context.currentEventStream != undefined) {
            context.currentEventStream[context.currentEventStreamPos] = {
                sensorType: sensorType,
                port: port,
                state: newState
            };

            var taskStatus = context.quickpi.validateEventStream();

            if (context.autoGrading)
            {
                if (taskStatus == context.TASK_FAILED)
                {
                    drawSensorTimeLineState(sensor, newState, context.currentEventStreamPos, "wrong");
                }
                else
                {
                    drawSensorTimeLineState(sensor, newState, context.currentEventStreamPos, "actual");
                }
            }

            

            context.currentEventStreamPos++;
            if (context.currentEventStreamPos == context.currentEventStream.length)
                context.currentEventStreamPos = 0;
        }
    }

    context.getSensorState = function(sensorType, port) {

        if (!context.display || context.autoGrading)
        {
            var state = null;
            sensor = context.expectedEventStream[context.currentEventStreamPos];

            if (sensor.sensorType == sensorType &&
                sensor.port == port) {
                state = sensor.state;

                context.registerQuickPiEvent(sensorType, port, state, false);
            }
            else {
                context.failed = true;
                throw ("Failed expected sequence")
            }
        }
        else
        {
            sensor = findSensor(sensorType, port);

            if (sensor)
            {
                return sensor.state;
            }
            else
            {
                throw("Referenced not existing sensor " + sensorType + " in port " + port);
            }
        }

        return state;
    }

    context.quickpi.validateEventStream = function() {
        var currentStream = 0;
        var currentPattern = 0;
        var match = context.TASK_SUCCEEDED;

        if (!context.autoGrading) {
            return context.TASK_ONGOING;
        }

        /*
        currentStream = context.currentEventStreamPos
        if (currentStream == 0)
            currentStream = context.currentEventStream.length;
        currentStream--;
        */


        while (currentStream < context.currentEventStream.length) {

            if (context.currentEventStream[currentStream] == undefined) {
                match = context.TASK_ONGOING;
                break;
            }

            if (context.currentEventStream[currentStream].sensorType != context.expectedEventStream[currentPattern].sensorType
                || context.currentEventStream[currentStream].port != context.expectedEventStream[currentPattern].port) {
                match = context.TASK_FAILED;
                break;
            }

            if (context.currentEventStream[currentStream].sensorType == "led"
                || context.currentEventStream[currentStream].sensorType == "sleep"
                || context.currentEventStream[currentStream].sensorType == "button") {
                if (context.currentEventStream[currentStream].state != context.expectedEventStream[currentPattern].state) {
                    match = context.TASK_FAILED;
                    break;
                }
            } else if (context.currentEventStream[currentStream].sensorType == "screen") {
                if (context.currentEventStream[currentStream].state.line1 != context.expectedEventStream[currentPattern].line1
                    || context.currentEventStream[currentStream].state.line1 != context.expectedEventStream[currentPattern].line2) {
                    match = context.TASK_FAILED;
                    break;
                }
            } else {
                match = context.TASK_FAILED
                break;
            }

            currentStream++;

            currentPattern++;
            if (currentPattern == context.expectedEventStream.length)
                currentPattern = 0;
        }

        return match;
    }


   /***** Functions *****/
   /* Here we define each function of the library.
      Blocks will generally use context.group.blockName as their handler
      function, hence we generally use this name for the functions. */
    context.quickpi.turnLedOn = function (callback) {

        context.registerQuickPiEvent("led", "D5", true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        }
        else {
            cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("turnLedOn()", cb);
        }      
    };

    context.quickpi.turnLedOff = function (callback) {
        context.registerQuickPiEvent("led", "D5", false);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("turnLedOff()", cb);
        }
    };

    context.quickpi.waitForButton = function (callback) {
        context.registerQuickPiEvent("button", "D22", "wait", false);

        if (!context.display || context.autoGrading) {
            context.waitDelay(callback);
        } else if (context.offLineMode) {
            button = findSensor("button", "D22");
            if (button) {
                cb = context.runner.waitCallback(callback);
                button.onPressed = function () {
                    cb();
                }
            } else {
                context.waitDelay(callback);
            }
        }
        else {
            cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("waitForButton(22)", cb);
        }
    };

    context.quickpi.buttonState = function (callback) {

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("button", "D22");

            context.runner.noDelay(callback, state);
        } else {
            cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("buttonState()", function (returnVal) {
                cb(returnVal != "0");
            });
        }
    };

    context.quickpi.buttonStateInPort = function (port, callback) {

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("button", "D" + port);

            context.runner.noDelay(callback, state);
        } else {
            cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("buttonState(" + port + ")", function (returnVal) {
                cb(returnVal != "0");
            });
        }

    };

    context.quickpi.buttonWasPressed = function (port, callback) {

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("button", "D" + port);

            context.runner.noDelay(callback, state);
        } else {
            cb = context.runner.waitCallback(callback);
            context.quickPiConnection.sendCommand("buttonWasPressed(" + port + ")", function (returnVal) {
                cb(returnVal != "0");
            });
        }

    };

    context.quickpi.changeLedState = function (port, state, callback) {
        var command = "changeLedState(" + port + "," + state + ")";

        context.registerQuickPiEvent("led", "D" + port, state == true);

        if (context.offLineMode) {
            context.waitDelay(callback);
        } else {
            cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, cb);
        }        
    };


    context.quickpi.displayText = function (line1, line2, callback) {
        var command = "displayText(\"" + line1 + "\", \"" + line2 + "\")";

        context.registerQuickPiEvent("screen", "i2c",
            state = {
                line1: line1,
                line2: line2
            }
        );
        
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, cb);
        }
    };

    context.quickpi.readTemperature = function (callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("temperature", "A0");

            context.runner.noDelay(callback, state);
        } else {
            cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("readTemperature(0)", function (returnVal) {
                var sensor = findSensor("temperature", "A0");
                if (sensor) {
                    sensor.state = returnVal;
                }

                cb(returnVal);
            });
        }
    };

    context.quickpi.sleep = function (time, callback) {
        context.registerQuickPiEvent("sleep", "none", time);
        if (context.display) {
            context.runner.waitDelay(callback, null, time * 1000);
        }
        else {
            context.runner.noDelay(callback);
        }
    };


    context.quickpi.setServoAngle = function (port, angle, callback) {
        context.registerQuickPiEvent("servo", "D" + port, angle);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var command = "setServoAngle(" + port + "," + angle + ")";
            cb = context.runner.waitCallback(callback);
            context.quickPiConnection.sendCommand(command, cb);
        }        
    };


    context.quickpi.readRotaryAngle = function (port, callback) {
        var command = "readRotaryAngle(" + port + ")";

        if (!context.display || context.autoGrading || context.offLineMode) {

            var state = getSensorState("potentiometer", "A" + port);
            context.waitDelay(callback, state);
        } else {

            cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function (returnVal) {
                var sensor = findSensor("potentiometer", "A" + port);
                if (sensor) {
                    sensor.state = returnVal;
                }

                cb(returnVal);
            });
        }
    };

   /***** Blocks definitions *****/
   /* Here we define all blocks/functions of the library.
      Structure is as follows:
      {
         group: [{
            name: "someName",
            // category: "categoryName",
            // yieldsValue: optional true: Makes a block with return value rather than simple command
            // params: optional array of parameter types. The value 'null' denotes /any/ type. For specific types, see the Blockly documentation ([1,2])
            // handler: optional handler function. Otherwise the function context.group.blockName will be used
            // blocklyJson: optional Blockly JSON objects
            // blocklyInit: optional function for Blockly.Blocks[name].init
            //   if not defined, it will be defined to call 'this.jsonInit(blocklyJson);
            // blocklyXml: optional Blockly xml string
            // codeGenerators: optional object:
            //   { Python: function that generates Python code
            //     JavaScript: function that generates JS code
            //   }
         }]
      }
      [1] https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks
      [2] https://developers.google.com/blockly/guides/create-custom-blocks/type-checks
   */

   context.customBlocks = {
      // Define our blocks for our namespace "template"
      quickpi: {
         // Categories are reflected in the Blockly menu
          sensors: [
            { name: "buttonState", yieldsValue: true },
            { name: "waitForButton" },
             {
                 name: "buttonStateInPort", yieldsValue: true, params: ["Number"], blocklyJson: {
                     "args0": [
                         {
                         "type": "field_dropdown", "name": "PARAM_0", "options": [
                             ["D5", "5"], ["D16", "16"], ["D18", "18"], ["D22", "22"], ["D24", "24"], ["D26", "26"]]
                         }
                     ]
                 }
             },
             {
                 name: "buttonWasPressed", yieldsValue: true, params: ["Number"], blocklyJson: {
                     "args0": [
                         {
                         "type": "field_dropdown", "name": "PARAM_0", "options": [
                             ["D5", "5"], ["D16", "16"], ["D18", "18"], ["D22", "22"], ["D24", "24"], ["D26", "26"]]
                         }
                     ]
                 }
             },

             { name: "readTemperature", yieldsValue: true },
             {
                 name: "sleep", params: ["Number"], blocklyJson: {
                     "args0": [
                         { "type": "field_number", "name": "PARAM_0", "value": 1 },
                     ]
                 }

             },
              {
                  name: "readRotaryAngle", yieldsValue: true, params: ["Number"], blocklyJson: {
                     "args0": [
                         {
                         "type": "field_dropdown", "name": "PARAM_0", "options": [
                             ["A0", "0"], ["A2", "2"], ["A4", "4"], ["A6", "6"]]
                         }
                     ]
                 }
             },

         ],
        actions: [
            { name: "turnLedOn" },
            { name: "turnLedOff" },
            {
                name: "changeLedState", params: ["Number", "Number"], blocklyJson: {
                    "args0": [
                       {
                           "type": "field_dropdown", "name": "PARAM_0", "options": [
                               ["D5", "5"], ["D16", "16"], ["D18", "18"], ["D22", "22"], ["D24", "24"], ["D26", "26"]]
                        },
                        { "type": "field_dropdown", "name": "PARAM_1", "options": [["ON", "1"], ["OFF", "0"]] },                         
                    ]
                }
            },
            {
                name: "setServoAngle", params: ["Number", "Number"], blocklyJson: {
                    "args0": [
                        {
                            "type": "field_dropdown", "name": "PARAM_0", "options": [
                                ["D5", "5"], ["D16", "16"], ["D18", "18"], ["D22", "22"], ["D24", "24"], ["D26", "26"]]
                        },
                        { "type": "input_value", "name": "PARAM_1" },

                    ]
                },
                blocklyXml: "<block type='setServoAngle'>" +
                "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                "</block>"
             },
             {
                name: "displayText", params: ["String", "String"], blocklyJson: {
                    "args0": [
                        { "type": "input_value", "name": "PARAM_0", "text": "Hello!" },
                        { "type": "input_value", "name": "PARAM_1", "text": "my name is Pablo" },
                    ]
                },
                blocklyXml: "<block type='displayText'>" +
                               "<value name='PARAM_0'><shadow type='text'><field name='TEXT'>Hello!</field> </shadow></value>" + 
                               "<value name='PARAM_1'><shadow type='text'><field name='TEXT'>Line 2</field> </shadow></value>" +
                               "</block>"

            },

          ]
      }
      // We can add multiple namespaces by adding other keys to customBlocks.
   };

   // Color indexes of block categories (as a hue in the range 0–420)
   context.provideBlocklyColours = function() {
      return {
         categories: {
            actions: 0,
            sensors: 100
         }
      };
   };

   // Constants available in Python
   context.customConstants = {
      quickpi: [
          /*
         { name: "ONE", value: 1 },
         { name: "TRUEVALUE", value: true },
         { name: "LIBNAME", value: "quickpi" }
         */
      ]
   };

   // Don't forget to return our newly created context!
   return context;
}

// Register the library; change "template" by the name of your library in lowercase
if(window.quickAlgoLibraries) {
   quickAlgoLibraries.register('quickpi', getContext);
} else {
   if(!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
   window.quickAlgoLibrariesList.push(['quickpi', getContext]);
}
