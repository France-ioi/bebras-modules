// This is a template of library for use with quickAlgo.
var getContext = function (display, infos, curLevel) {
    // Local language strings for each language
    var localLanguageStrings = {
        fr: { // French strings
            label: {
                // Labels for the blocks
                turnLedOn: "Allumer la LED",
                turnLedOff: "Éteindre la LED",
                buttonState: "bouton enfoncé",
                buttonStateInPort: "bouton enfoncé sur le port %1",
                waitForButton: "Attendre le bouton",
                buttonWasPressed: "Le bouton a été enfoncé",
                changeLedState: "Passer la LED à %2 sur le port %1",
                toggleLedState: "Inverser la LED sur le port %1",
                displayText: "Afficher à l'écran Ligne 1: %1 Ligne 2: %2",
                readTemperature: "température ambiante",
                sleep: "Mettre le programme en pause pendant %1 secondes",
                setServoAngle: "Mettre le servo à l'angle %2 sur le port %1",
                readRotaryAngle: "état du potentiomètre",
                readDistance: "distance lue par le capteur à ultrasons"
                /*turnLedOn: "Turn Led On",
                turnLedOff: "Turn Led Off",
                buttonState: "Return Button State",
                buttonStateInPort: "Return Button State in port %1",
                waitForButton: "Wait for button",
                buttonWasPressed: "Was button pressed",
                changeLedState: "Turn led %2 in port %1",
                toggleLedState: "Toggle led state in port %1",
                displayText: "Display in screen Line 1: %1 Line 2: %2",
                readTemperature: "Read Ambient temperature",
                sleep: "Pause program for %1 seconds",
                setServoAngle: "Set servo to %2 angle in port %1",
                readRotaryAngle: "Read state of potentiometer",
                readDistance: "Read distance using the ultrasonic sensor"*/
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
                toggleLedState: "toggleLedState",
                displayText: "displayText",
                readTemperature: "readTemperature",
                sleep: "sleep",
                setServoAngle: "setServoAngle",
                readRotaryAngle: "readRotaryAngle",
                readDistance: "readDistance",
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
                toggleLedState: "toggleLedState(): Toggles the led state",
                displayText: "displayText(): Display text in LCD screen",
                readTemperature: "readTemperature(): Read Ambient temperature",
                sleep: "sleep(): pause program execute for a number of seconds",
                setServoAngle: "setServoAngle(): Set servo motor to an specified angle",
                readRotaryAngle: "readRotaryAngle(): Read state of potentiometer",
                readDistance: "readDistance(): Read distance using ultrasonic sensor"
            },
            constant: {
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
                waitForButton: "Stops program execution until a button is pressed",
                buttonWasPressed: "Returns true if the button has been pressed and will clear the value",
                changeLedState: "Change led state in the given port",
                toggleLedState: "If led is on, turns it off, if it's off turns it on",
                buttonStateInPort: "Returns the state of a button, Pressed means True and not pressed means False",
                displayText: "Display text in LCD screen",
                readTemperature: "Read Ambient temperature",
                sleep: "pause program execute for a number of seconds",
                setServoAngle: "Set servo motor to an specified angle",
                readRotaryAngle: "Read state of potentiometer",
                readDistance: "Read distance using ultrasonic sensor"
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

    context.reset = function (taskInfos) {
        if (!context.offLineMode)
            context.quickPiConnection.startNewSession();

        if (taskInfos != undefined) {
            context.currentTime = 0;
            context.autoGrading = taskInfos.autoGrading;
            if (context.autoGrading) {
                context.gradingInput = taskInfos.intput;
                context.gradingOutput = taskInfos.output;
                context.maxTime = 0;
                context.tickIncrease = 100;

                var mergedArray = context.gradingInput.concat(context.gradingOutput);

                mergedArray.sort(function (a, b) { return a.time - b.time; });

                context.gradingStates = {};

                for (var i = 0; i < mergedArray.length; i++) {
                    var state = mergedArray[i];
                    var key = state.type.toUpperCase() + state.port.toUpperCase();

                    if (!context.gradingStates.hasOwnProperty(key))
                        context.gradingStates[key] = [];

                    context.gradingStates[key].push(state);

                    if (state.time > context.maxTime)
                        context.maxTime = state.time;
                }

                context.failed = false;
            }
        }

        if (context.display) {
            context.resetDisplay();
        }
    };


    // Reset the context's display
    context.resetDisplay = function () {
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
            context.sensorSize = sensorSize * .90;

            context.pixelsPerTime = (paper.width - context.sensorSize) / context.maxTime;


            for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
                var sensor = infos.quickPiSensors[iSensor];

                sensor.drawInfo = {
                    x: 0,
                    y: sensorSize * iSensor,
                    width: sensorSize * .90,
                    height: sensorSize * .90
                }

                sensor.state = null;

                drawSensor(sensor);
                drawTimeLine();

                var key = sensor.type.toUpperCase() + sensor.port.toUpperCase();
                if (context.gradingStates.hasOwnProperty(key)) {
                    var states = context.gradingStates[key];
                    var startTime = -1;
                    var lastState = null;
                    for (var iState = 0; iState < states.length; iState++) {
                        var state = states[iState];
                        if (startTime > 0) {
                            drawSensorTimeLineState(sensor, lastState, startTime, state.time, "expected");
                        }

                        startTime = state.time;
                        lastState = state.state;
                    }
                }
            }
        } else {

            var numSensors = infos.quickPiSensors.length;
            var numColumns = 1;
            var sensorSize = paper.height / numSensors * numColumns * 0.80;
            var sensorsPercolumn = Math.ceil(numSensors / numColumns)

            var currentColumn = 0
            var sensorsInColumn = 0;

            context.sensorSize = sensorSize * .90;

            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                sensor = infos.quickPiSensors[i];

                sensor.drawInfo = {
                    x: sensorSize * currentColumn * 2,
                    y: sensorSize * sensorsInColumn,
                    width: sensorSize * .90,
                    height: sensorSize * .90
                }

                sensorsInColumn++;
                if (sensorsInColumn == sensorsPercolumn) {
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
            if (!context.quickPiConnection.isConnected() && !context.quickPiConnection.isConnecting()) {
                $('#pistatus').html("Connecting...");
                $('#piconnect').attr("disabled", true);
                context.quickPiConnection.connect(sessionStorage.raspberryPiIpAddress);
            }
        }
    };

    function raspberryPiConnected() {
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
    context.updateScale = function () {
        if (!context.display) {
            return;
        }
        context.resetDisplay();
    };

    // When the context is unloaded, this function is called to clean up
    // anything the context may have created
    context.unload = function () {
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

    function sensorStateToPercent(sensor, state) {
        var retVal = 0;
        switch (sensor.type) {
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

    function drawTimeLine() {
        for (var i = 1000; i < context.maxTime; i += 1000) {
            var x = context.sensorSize + (i * context.pixelsPerTime);

            paper.text(x + 5, paper.height - context.sensorSize / 2, (i / 1000) + "s");

            paper.path(["M", x,
                paper.height - context.sensorSize / 2,
                "L", x,
                paper.height - context.sensorSize]);
        }

        paper.path(["M", context.sensorSize,
            paper.height - context.sensorSize * 3 / 4,
            "L", paper.width,
            paper.height - context.sensorSize * 3 / 4]);

    }

    function drawCurrentTime() {
        var startx = context.sensorSize + (context.currentTime * context.pixelsPerTime);


        if (context.timeLineCurrent)
            context.timeLineCurrent.remove();

        context.timeLineCurrent = paper.path(["M", startx,
            0,
            "L", startx,
            paper.height]);
    }


    function drawSensorTimeLineState(sensor, state, startTime, endTime, type) {
        var stateOffset = 160;

        var startx = sensor.drawInfo.width + (startTime * context.pixelsPerTime);
        var stateLenght = (endTime - startTime) * context.pixelsPerTime;

        var percentage = sensorStateToPercent(sensor, state);

        var yposition = ((sensor.drawInfo.y + (sensor.drawInfo.height * .5)) + (sensor.drawInfo.height * .20));

        color = "green";
        if (type == "expected") {
            color = "blue";
        } else if (type == "wrong") {
            color = "red";
            yposition += 4;
        }
        else if (type == "actual") {
            color = "yellow";
            yposition += 4;
        }

        if (percentage != 0) {
            stateline = paper.path(["M", startx,
                yposition,
                "L", startx + stateLenght,
                yposition]);

            stateline.attr({
                "stroke-width": 5, "stroke": color
            });
        }

        if (type == "wrong") {
            /*
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
                "stroke-width": 5, "stroke" : "red", "stroke-linecap": "round" });*/
        }
    }

    function getImg(filename) {
        // Get the path to an image stored in bebras-modules
        return (window.modulesPath ? window.modulesPath : '../../modules/') + 'img/quickpi/' + filename;
    }


    function drawSensor(sensor, state = true) {
        var imageOffSet = 50;
        var arrowsOffset = 200;

        var imgx = sensor.drawInfo.x + (sensor.drawInfo.width * .3);

        var state1x = sensor.drawInfo.x + (sensor.drawInfo.width * 1.3);
        var state1y = sensor.drawInfo.y + (sensor.drawInfo.height / 2);

        if (paper == undefined || !context.display)
            return;

        if (sensor.img)
            sensor.img.remove();

        if (sensor.type == "led") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.img = paper.image(getImg('ledon.png'), imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(state1x, state1y, "ON");
            } else {
                sensor.img = paper.image(getImg('ledoff.png'), imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(state1x, state1y, "OFF");
            }

        } else if (sensor.type == "button") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.img = paper.image(getImg('buttonon.png'), imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(state1x, state1y, "ON");
            } else {
                sensor.img = paper.image(getImg('buttonoff.png'), imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(state1x, state1y, "OFF");
            }

            if (!context.autoGrading) {
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
            }

        } else if (sensor.type == "screen") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.stateText2)
                sensor.stateText2.remove();

            sensor.img = paper.image(getImg('screen.png'), imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

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

            sensor.img = paper.image(getImg('temperature.png'), imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "C");

            if (!context.autoGrading) {
                var arrowsize = sensor.drawInfo.height * .30;

                sensor.uparrow = paper.image(getImg('uparrow.png'), state1x, sensor.drawInfo.y, arrowsize, arrowsize);
                sensor.downarrow = paper.image(getImg('downarrow.png'), state1x, sensor.drawInfo.y + sensor.drawInfo.height - arrowsize, arrowsize, arrowsize);


                sensor.uparrow.node.onclick = function () {
                    sensor.state += 1;
                    drawSensor(sensor);
                };

                sensor.downarrow.node.onclick = function () {
                    sensor.state -= 1;
                    drawSensor(sensor);
                };
            }
        } else if (sensor.type == "servo") {
            if (sensor.stateText)
                sensor.stateText.remove();

            sensor.img = paper.image(getImg('servo.png'), imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

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

            sensor.img = paper.image(getImg('potentiometer.png'), imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

            if (sensor.state == null)
                sensor.state = 0;

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "%");

            if (!context.autoGrading) {

                var arrowsize = sensor.drawInfo.height * .30;

                sensor.uparrow = paper.image(getImg('uparrow.png'), state1x, sensor.drawInfo.y, arrowsize, arrowsize);
                sensor.downarrow = paper.image(getImg('downarrow.png'), state1x, sensor.drawInfo.y + sensor.drawInfo.height - arrowsize, arrowsize, arrowsize);

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
        } else if (sensor.type == "range") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.uparrow)
                sensor.uparrow.remove();

            if (sensor.downarrow)
                sensor.downarrow.remove();

            sensor.img = paper.image(getImg('range.png'), imgx, sensor.drawInfo.y, sensor.drawInfo.width, sensor.drawInfo.height);

            if (sensor.state == null)
                sensor.state = 0;

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "%");
            if (!context.autoGrading) {

                var arrowsize = sensor.drawInfo.height * .30;

                sensor.uparrow = paper.image(getImg('uparrow.png'), state1x, sensor.drawInfo.y, arrowsize, arrowsize);
                sensor.downarrow = paper.image(getImg('downarrow.png'), state1x, sensor.drawInfo.y + sensor.drawInfo.height - arrowsize, arrowsize, arrowsize);

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
        }


        if (sensor.portText)
            sensor.portText.remove();

        stateFontSize = sensor.drawInfo.height * 0.13;
        portFontSize = sensor.drawInfo.height * 0.20;


        if (sensor.hasOwnProperty("stateText"))
            sensor.stateText.attr({ "font-size": stateFontSize + "px", 'text-anchor': 'start', 'font-weight': 'bold' });

        if (sensor.hasOwnProperty("stateText2"))
            sensor.stateText2.attr({ "font-size": stateFontSize + "px", 'text-anchor': 'start', 'font-weight': 'bold' });

        sensor.portText = paper.text(sensor.drawInfo.x, sensor.drawInfo.y + (sensor.drawInfo.height / 2), sensor.port);
        sensor.portText.attr({ "font-size": portFontSize + "px", 'text-anchor': 'start', 'font-weight': 'bold' });
    }

    context.compareSensorState = function (sensorType, state1, state2) {
        if (sensorType == "screen") {
            return state1.line1 == state2.line1 &&
                state1.line2 == state2.line2;
        }

        return state1 == state2;
    }

    context.registerQuickPiEvent = function (sensorType, port, newState, setInSensor = true) {
        var sensor = findSensor(sensorType, port);
        if (!sensor) {
            throw ("Sensor is not registered");
        }

        if (setInSensor) {
            sensor.state = newState;
            drawSensor(sensor);
        }

        if (context.autoGrading && context.gradingStates != undefined) {
            var type = "actual";
            var expectedState = context.getSensorExpectedState(sensorType, port);

            if (!sensor.lastStateChange)
                sensor.lastStateChange = 0;

            if (expectedState != null &&
                !context.compareSensorState(sensor.type, expectedState, newState)) {
                type = "wrong";
                context.fail = true;
            }

            drawSensorTimeLineState(sensor, newState, sensor.lastStateChange, context.currentTime, type);
            sensor.lastStateChange = context.currentTime;

            if (context.fail) {
                context.success = false;
                throw ("Test failed");
            }
            else if (context.currentTime > context.maxTime) {
                context.success = true;
                throw ("Bravo ! La sortie est correcte");
            }
            context.increaseTime(sensor);
        }
    }


    context.increaseTime = function (sensor) {

        if (!sensor.lastTimeIncrease) {
            sensor.lastTimeIncrease = 0;
        }

        if (sensor.callsInTimeSlot == undefined)
            sensor.callsInTimeSlot = 0;

        if (sensor.lastTimeIncrease == context.currentTime) {
            sensor.callsInTimeSlot += 1;
        }
        else {
            sensor.lastTimeIncrease = context.currentTime;
            sensor.callsInTimeSlot = 1;
        }

        if (sensor.callsInTimeSlot > 3) {
            context.currentTime += context.tickIncrease;

            sensor.lastTimeIncrease = context.currentTime;
            sensor.callsInTimeSlot = 0;
        }

        drawCurrentTime();
    }

    context.getSensorExpectedState = function (type, port) {
        var state = null;
        var key = type.toUpperCase() + port.toUpperCase();
        sensorStates = context.gradingStates[key];

        var lastState;
        var startTime = -1;
        for (var i = 0; i < sensorStates.length; i++) {
            if (startTime > 0) {
                if (context.currentTime > startTime &&
                    context.currentTime < sensorStates[i].time) {
                    state = lastState;
                    break;
                }
            }

            startTime = sensorStates[i].time;
            lastState = sensorStates[i].state;
        }

        // This is the end state
        if (state == null && context.currentTime > startTime) {
            state = lastState;
        }

        if (state == null)
            state = 0;

        return state;
    }


    context.getSensorState = function (sensorType, port) {
        var state = null;

        if (!context.display || context.autoGrading) {
            var found = false;

            state = context.getSensorExpectedState(sensorType, port);
        }

        sensor = findSensor(sensorType, port);
        if (!sensor) {
            throw ("Referenced not existing sensor " + sensorType + " in port " + port);
        }

        if (state == null) {
            state = sensor.state;
        }
        else {
            sensor.state = state;
            drawSensor(sensor);
        }

        if (!sensor.lastStateChange)
            sensor.lastStateChange = 0;

        drawSensorTimeLineState(sensor, state, sensor.lastStateChange, context.currentTime, "actual");
        sensor.lastStateChange = context.currentTime;

        return state;
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

            context.quickPiConnection.sendCommand("buttonStateInPort(" + port + ")", function (returnVal) {
                cb(returnVal != "0");
            });
        }

    };

    context.quickpi.toggleLedState = function (port, callback) {

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

    context.quickpi.toggleLedState = function (port, callback) {
        var command = "toggleLedState(" + port + ")";
        var state = context.getSensorState("led", "D" + port);

        context.registerQuickPiEvent("led", "D" + port, !state);

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

    context.quickpi.readTemperature = function (port, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("temperature", "A" + port);

            context.runner.noDelay(callback, state);
        } else {
            cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("readTemperature(" + port + ")", function (returnVal) {
                var sensor = findSensor("temperature", "A" + port);
                if (sensor) {
                    sensor.state = returnVal;
                }

                cb(returnVal);
            });
        }
    };

    context.quickpi.sleep = function (time, callback) {
        context.registerQuickPiEvent("sleep", "none", time, false);
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

            var state = context.getSensorState("potentiometer", "A" + port);
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


    context.quickpi.readDistance = function (port, callback) {
        var command = "readDistance(" + port + ")";

        if (!context.display || context.autoGrading || context.offLineMode) {

            var state = context.getSensorState("range", "D" + port);
            context.waitDelay(callback, state);
        } else {

            cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function (returnVal) {
                var sensor = findSensor("range", "D" + port);
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
                {
                    name: "readTemperature", yieldsValue: true, params: ["Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": [
                                    ["A0", "0"], ["A2", "2"], ["A4", "4"], ["A6", "6"]]
                            }
                        ]
                    }
                },


                {
                    name: "sleep", params: ["Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0", "value": 1 },
                        ]
                    }
                    ,
                    blocklyXml: "<block type='sleep'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
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
                {
                    name: "readDistance", yieldsValue: true, params: ["Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": [
                                    ["D5", "5"], ["D16", "16"], ["D18", "18"], ["D22", "22"], ["D24", "24"], ["D26", "26"]]
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
                    name: "toggleLedState", params: ["Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": [
                                    ["D5", "5"], ["D16", "16"], ["D18", "18"], ["D22", "22"], ["D24", "24"], ["D26", "26"]]
                            },
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
                            { "type": "input_value", "name": "PARAM_0", "text": "" },
                            { "type": "input_value", "name": "PARAM_1", "text": "" },
                        ]
                    },
                    blocklyXml: "<block type='displayText'>" +
                        "<value name='PARAM_0'><shadow type='text'><field name='TEXT'>Bonjour</field> </shadow></value>" +
                        "<value name='PARAM_1'><shadow type='text'><field name='TEXT'></field> </shadow></value>" +
                        "</block>"

                },

            ]
        }
        // We can add multiple namespaces by adding other keys to customBlocks.
    };

    // Color indexes of block categories (as a hue in the range 0–420)
    context.provideBlocklyColours = function () {
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
        ]
    };

    // Don't forget to return our newly created context!
    return context;
}

// Register the library; change "template" by the name of your library in lowercase
if (window.quickAlgoLibraries) {
    quickAlgoLibraries.register('quickpi', getContext);
} else {
    if (!window.quickAlgoLibrariesList) { window.quickAlgoLibrariesList = []; }
    window.quickAlgoLibrariesList.push(['quickpi', getContext]);
}
