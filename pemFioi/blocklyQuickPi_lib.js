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
            "ONE": "UN",
            "TRUEVALUE": "VALEURVRAI",
            "LIBNAME": "NOMLIB",
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

        context.stateStreamPos = 0;
        context.sensorReturnsPos = 0;
        if (taskInfos != undefined ) {
            context.autoGrading = taskInfos.autoGrading;
            
            if (context.autoGrading) {
                context.stateStream = new Array(taskInfos.patterRepeat * taskInfos.streamPattern.length);
                context.streamPattern = taskInfos.streamPattern;
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
           for (var i = 0; i < infos.quickPiSensors.length; i++) {
               var sensor = infos.quickPiSensors[i];

               sensor.drawInfo = {
                   x: 0,
                   y: i * 100,
                   width: 100,
                   height: 100
               }

               sensor.state = null;

               drawSensor(sensor);
           }

           for (var i = 0; i < context.streamPattern.length; i++) {
               var step = context.streamPattern[i];

               if (Array.isArray(step)) {
                   // This is an array of states
                   for (var j = 0; j < step.length; j++) {
                       var sensorState = step[j];

                       sensor = findSensor(sensorState.sensorType, sensorState.port);

                       drawSensorTimeLineState(sensor, sensorState.state, i);
                   }
               }
           }
       } else {
           for (var i = 0; i < infos.quickPiSensors.length; i++) {
               sensor = infos.quickPiSensors[i];

               sensor.drawInfo = {
                   x: 0,
                   y: i * 100,
                   width: 100,
                   height: 100
               }

               sensor.state = null;

               drawSensor(sensor);
           }
       }

      context.blocklyHelper.updateSize();
      //context.updateScale();

       context.reconnect = true;

       if (context.quickPiConnection.isConnecting()) {
           $('#pistatus').html("Connecting...");
           $('#piconnect').html("Release");
           $('#piconnect').attr("disabled", true);
           $('#piinstall').attr("hidden", true);
           $('#piui').css('background-color', 'brown');
           context.offLineMode = false;
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

           alert(python_code);

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

        if (wasConnected && context.reconnect) {
            $('#piconnect').attr("disabled", true);
            context.quickPiConnection.connect(sessionStorage.raspberryPiIpAddress);
        } else {
            // If I was never connected don't attempt to autoconnect again
            $('#piconnect').attr("disabled", false);
            sessionStorage.autoConnect = false;
        }

        context.offLineMode = true;
        $('#pistatus').html("Disconnected ...");
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


    function drawSensorTimeLineState(sensor, state, stateNumber) {
        var stateOffset = 160;

        stateline = paper.path(["M", sensor.drawInfo.x + stateOffset + (50 * stateNumber), sensor.drawInfo.y + 50, "L", sensor.drawInfo.x + stateOffset + 40 + (50 * stateNumber), sensor.drawInfo.y + 50]);

        stateline.attr({
            "stroke-width": 5, "stroke" : "gray" });
    }


    function drawSensor(sensor, state = true) {
        var imageOffSet = 50;
        var stateOffset = 160;
        var arrowsOffset = 200;

        if (paper == undefined || !context.display)
            return;

        if (sensor.img)
            sensor.img.remove();

        if (sensor.type == "led") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.img = paper.image('../../modules/img/quickpi/ledon.png', sensor.drawInfo.x + imageOffSet, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(sensor.drawInfo.x + stateOffset, sensor.drawInfo.y + 40, "ON");
            } else {
                sensor.img = paper.image('../../modules/img/quickpi/ledoff.png', sensor.drawInfo.x + imageOffSet, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(sensor.drawInfo.x + stateOffset, sensor.drawInfo.y +  40, "OFF");
            }

            if (sensor.stateText)
                sensor.stateText.attr({ "font-size": 12, 'text-anchor': 'start', 'font-weight': 'bold' });

        } else if (sensor.type == "button") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.img = paper.image('../../modules/img/quickpi/buttonon.png', sensor.drawInfo.x + imageOffSet, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(sensor.drawInfo.x + stateOffset, sensor.drawInfo.y + 40, "Pressed");
            } else {
                sensor.img = paper.image('../../modules/img/quickpi/buttonoff.png', sensor.drawInfo.x + imageOffSet, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(sensor.drawInfo.x + stateOffset, sensor.drawInfo.y + 40, "Not pressed");
            }

            if (sensor.stateText)
                sensor.stateText.attr({ "font-size": 12, 'text-anchor': 'start', 'font-weight': 'bold' });

            sensor.img.node.onmousedown = function () {
                sensor.state = true;
                drawSensor(sensor);
            };

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

            sensor.img = paper.image('../../modules/img/quickpi/screen.png', sensor.drawInfo.x + imageOffSet, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

            if (sensor.state) {
                sensor.stateText = paper.text(sensor.drawInfo.x + stateOffset, sensor.drawInfo.y + 40, sensor.state.line1);
                sensor.stateText2 = paper.text(sensor.drawInfo.x + stateOffset, sensor.drawInfo.y + 55, sensor.state.line2);

                sensor.stateText.attr({ "font-size": 12, 'text-anchor': 'start', 'font-weight': 'bold' });
                sensor.stateText2.attr({ "font-size": 12, 'text-anchor': 'start', 'font-weight': 'bold' });
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

            sensor.img = paper.image('../../modules/img/quickpi/temperature.png', sensor.drawInfo.x + imageOffSet, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

            sensor.stateText = paper.text(sensor.drawInfo.x + stateOffset, sensor.drawInfo.y + 40, sensor.state + "C");
            sensor.stateText.attr({ "font-size": 12, 'text-anchor': 'start', 'font-weight': 'bold' });

            sensor.uparrow = paper.image('../../modules/img/quickpi/uparrow.png', sensor.drawInfo.x + arrowsOffset, sensor.drawInfo.y + 10, 50, 29);
            sensor.downarrow = paper.image('../../modules/img/quickpi/downarrow.png', sensor.drawInfo.x + arrowsOffset, sensor.drawInfo.y + 55, 50, 29);


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

            sensor.img = paper.image('../../modules/img/quickpi/servo.png', sensor.drawInfo.x + imageOffSet, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

            if (sensor.state == null)
                sensor.state = 0;

            sensor.stateText = paper.text(sensor.drawInfo.x + stateOffset, sensor.drawInfo.y + 40, "Angle " + sensor.state + "°");

            sensor.stateText.attr({ "font-size": 12, 'text-anchor': 'start', 'font-weight': 'bold' });
        }
        else if (sensor.type == "potentiometer") {
            if (sensor.stateText)
                sensor.stateText.remove();

            sensor.img = paper.image('../../modules/img/quickpi/potentiometer.png', sensor.drawInfo.x + imageOffSet, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

            if (sensor.state == null)
                sensor.state = 0;

            sensor.stateText = paper.text(sensor.drawInfo.x + stateOffset, sensor.drawInfo.y + 40, sensor.state + "%");

            sensor.stateText.attr({ "font-size": 12, 'text-anchor': 'start', 'font-weight': 'bold' });
        }

        if (sensor.portText)
            sensor.portText.remove();

        sensor.portText = paper.text(sensor.drawInfo.x + 10, sensor.drawInfo.y + 50, sensor.port);
        sensor.portText.attr({ "font-size": 18, 'text-anchor': 'start', 'font-weight': 'bold' });
    }

    function changeSensorState(sensorType, port, newState) {

        if (sensorType != "button") {
            sensor = findSensor(sensorType, port);
            if (sensor) {
                sensor.state = newState;
                drawSensor(sensor);
            }
        }

        if (context.stateStream != undefined) {
            context.stateStream[context.stateStreamPos] = {
                sensorType: sensorType,
                port: port,
                state: newState
            };
            context.stateStreamPos++;
            if (context.stateStreamPos == context.stateStream.length)
                context.stateStreamPos = 0;
        }
    }

    function getSensorState(sensorType, port) {
        var state = null;
        sensor = context.sensorReturns[context.sensorReturnsPos];

        if (sensor.sensorType == sensorType &&
            sensor.port == port) {
            state = sensor.state;
        }
        else {
            context.failed = true;
        }

        context.sensorReturnsPos++;
        if (context.sensorReturnsPos == context.sensorReturns.length)
            context.sensorReturnsPos = 0;

        return state;
    }

    context.quickpi.checkPattern = function() {
        var currentStream = 0;
        var currentPattern = 0;
        var match = context.TASK_SUCCEEDED;

        if (!context.autoGrading) {
            return context.TASK_ONGOING;
        }

        /*
        currentStream = context.stateStreamPos
        if (currentStream == 0)
            currentStream = context.stateStream.length;
        currentStream--;
        */


        while (currentStream < context.stateStream.length) {

            if (context.stateStream[currentStream] == undefined) {
                match = context.TASK_ONGOING;
                break;
            }

            if (context.stateStream[currentStream].sensorType != context.streamPattern[currentPattern].sensorType
                || context.stateStream[currentStream].port != context.streamPattern[currentPattern].port) {
                match = context.TASK_FAILED;
                break;
            }

            if (context.stateStream[currentStream].sensorType == "led"
                || context.stateStream[currentStream].sensorType == "sleep"
                || context.stateStream[currentStream].sensorType == "button") {
                if (context.stateStream[currentStream].state != context.streamPattern[currentPattern].state) {
                    match = context.TASK_FAILED;
                    break;
                }
            } else if (context.stateStream[currentStream].sensorType == "screen") {
                if (context.stateStream[currentStream].state.line1 != context.streamPattern[currentPattern].line1
                    || context.stateStream[currentStream].state.line1 != context.streamPattern[currentPattern].line2) {
                    match = context.TASK_FAILED;
                    break;
                }
            } else {
                match = context.TASK_FAILED
                break;
            }

            currentStream++;

            currentPattern++;
            if (currentPattern == context.streamPattern.length)
                currentPattern = 0;
        }

        return match;
    }


   /***** Functions *****/
   /* Here we define each function of the library.
      Blocks will generally use context.group.blockName as their handler
      function, hence we generally use this name for the functions. */
    context.quickpi.turnLedOn = function (callback) {

        changeSensorState("led", "D5", true);

        if (context.offLineMode) {
            context.waitDelay(callback);
        }
        else {
            context.quickPiConnection.sendCommand("turnLedOn()", function (returnVal) {
                context.waitDelay(callback);
            });
        }      
    };

    context.quickpi.turnLedOff = function (callback) {
        changeSensorState("led", "D5", false);

        if (context.offLineMode) {
            context.waitDelay(callback);
        } else {
            context.quickPiConnection.sendCommand("turnLedOff()", function (returnVal) {
                context.waitDelay(callback);
            });
        }
    };

    context.quickpi.waitForButton = function (callback) {
        changeSensorState("button", "D22", true);

        if (!context.display || context.autoGrading) {
            context.waitDelay(callback);
        } else if (context.offLineMode) {
            button = findSensor("button", "D22");
            if (button) {
                button.onPressed = function () {
                    context.waitDelay(callback);
                }
            }
        }
        else {
            context.quickPiConnection.sendCommand("waitForButton(22)", function (returnVal) {
                context.waitDelay(callback);
            });
        }
    };

    context.quickpi.buttonState = function (callback) {

        if (!context.display || context.autoGrading) {
            var state = getSensorState("button", "D22");

            context.runner.noDelay(callback, state);
        } if (context.offLineMode) {
            button = findSensor("button", "D22");
            if (button) {
                    context.runner.noDelay(callback, button.state);
            }
        } else {
            context.quickPiConnection.sendCommand("buttonState()", function (returnVal) {
                context.runner.noDelay(callback, returnVal != "0");
            });
        }

    };

    context.quickpi.buttonStateInPort = function (port, callback) {

        if (!context.display || context.autoGrading) {
            var state = getSensorState("button", port);

            context.runner.noDelay(callback, state);
        } if (context.offLineMode) {
            button = findSensor("button", "D" + port);
            if (button) {
                context.runner.noDelay(callback, button.state);
            }
        } else {
            context.quickPiConnection.sendCommand("buttonState(" + port + ")", function (returnVal) {
                context.runner.noDelay(callback, returnVal != "0");
            });
        }

    };

    context.quickpi.buttonWasPressed = function (port, callback) {

        if (!context.display || context.autoGrading) {
            var state = getSensorState("button", port);

            context.runner.noDelay(callback, state);
        } if (context.offLineMode) {
            button = findSensor("button", "D" + port);
            if (button) {
                var wasPressed = false;
                
                if (button.wasPressed != undefined)
                    wasPressed = button.wasPressed;

                button.wasPressed = false;

                context.waitDelay(callback, wasPressed);
            }
        } else {
            context.quickPiConnection.sendCommand("buttonWasPressed(" + port + ")", function (returnVal) {
                context.waitDelay(callback, returnVal != "0");
            });
        }

    };

    context.quickpi.changeLedState = function (port, state, callback) {
        var command = "changeLedState(" + port + "," + state + ")";

        changeSensorState("led", "D" + port, state == true);

        if (context.offLineMode) {
            context.waitDelay(callback);
        } else {
            context.quickPiConnection.sendCommand(command, function (returnVal) {
                context.waitDelay(callback);
            });

        }        
    };


    context.quickpi.displayText = function (line1, line2, callback) {
        var command = "displayText(\"" + line1 + "\", \"" + line2 + "\")";

        changeSensorState("screen", "i2c",
            state = {
                line1: line1,
                line2: line2
            }
        );
        
        if (context.offLineMode) {
            context.waitDelay(callback);
        } else {
            context.quickPiConnection.sendCommand(command, function (returnVal) {
                context.waitDelay(callback);
            });
        }
    };

    context.quickpi.readTemperature = function (callback) {
        var sensor = findSensor("temperature", "A0");

        if (context.offLineMode) {
            var retVal = 0;
            if (sensor) {
                retVal = sensor.state;
            }
            context.waitDelay(callback, retVal);
        } else {
            context.quickPiConnection.sendCommand("readTemperature(0)", function (returnVal) {
                if (sensor) {
                    sensor.state = returnVal;
                }

                context.waitDelay(callback, returnVal);
            });
        }
    };

    context.quickpi.sleep = function (time, callback) {
        changeSensorState("sleep", "none", time);

        if (context.display) {
            setTimeout(function () {
                context.runner.noDelay(callback);
            }, time * 1000);
        }
        else {
            context.runner.noDelay(callback);
        }
    };


    context.quickpi.setServoAngle = function (port, angle, callback) {

        var command = "setServoAngle(" + port + "," + angle + ")";

        changeSensorState("servo", "D" + port, angle);


        if (context.offLineMode) {
            context.waitDelay(callback);
        } else {
            context.quickPiConnection.sendCommand(command, function (returnVal) {
                context.waitDelay(callback);
            });
        }        
    };


    context.quickpi.readRotaryAngle = function (port, callback) {
        var sensor = findSensor("potentiometer", "A" + port);

        var command = "readRotaryAngle(" + port + ")";

        if (context.offLineMode) {
            var retVal = 0;
            if (sensor) {
                retVal = sensor.state;
            }
            context.waitDelay(callback, retVal);
        } else {
            context.quickpi.qwerty();
            /*
            context.quickPiConnection.sendCommand(command, function (returnVal) {
                if (sensor) {
                    sensor.state = returnVal;
                }

                context.waitDelay(callback, returnVal);
            });*/
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
            { name: "turnLedOn" }, // Function taking no argument
            { name: "turnLedOff" }, // Function taking no argument
            { name: "buttonState", yieldsValue: true },
            { name: "waitForButton" },
             /*{
                 name: "turnLedOnInPort",
                 params: [{ options: ["SQUARE"] }],
                 params_names: ['port']

             }*/
            // 5, 16, 18, 22, 24, 26
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
             { name: "readTemperature", yieldsValue: true },
             {
                 name: "sleep", params: ["Number"], blocklyJson: {
                     "args0": [
                         { "type": "field_number", "name": "PARAM_0", "value": 1 },
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
                 "<value name='PARAM_1'><shadow type='math_number'><field name='TEXT'>Line 2</field> </shadow></value>" +
                 "</block>"
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
         { name: "ONE", value: 1 },
         { name: "TRUEVALUE", value: true },
         { name: "LIBNAME", value: "quickpi" }
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
