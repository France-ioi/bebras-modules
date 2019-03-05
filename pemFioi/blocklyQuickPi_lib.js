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

    var lockstring;
    if (sessionStorage.lockstring)
        lockstring = sessionStorage.lockstring;
    else {
        lockstring = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessionStorage.lockstring = lockstring;
    }





    context.quickPiConnection = getQuickPiConnection(lockstring, raspberryPiConnected, raspberryPiDisconnected);
    var paper;
    context.offLineMode = true;


    infos.checkEndEveryTurn = true;
    infos.checkEndCondition = function (context, lastTurn) {
        if (context.autoGrading) {
            for (sensorStates in context.gradingStatesBySensor) {
                for (var i = 0; i < context.gradingStatesBySensor[sensorStates].length; i++) {
                    var state = context.gradingStatesBySensor[sensorStates][i];

                    if (state.time < context.currentTime) {
                        if (!state.hit) {
                            context.success = false;
                            throw("Failed");
                        }
                    }
                    else
                        break;
                }
            }
        }
    };

    context.reset = function (taskInfos) {
        if (!context.offLineMode)
            context.quickPiConnection.startNewSession();

        if (taskInfos != undefined) {
            // Instructions that have been called without
            // ever getting into a quickpi block
            context.piLessInstructions = 0;

            context.currentTime = 0;
            context.autoGrading = taskInfos.autoGrading;
            if (context.autoGrading) {
                context.gradingInput = taskInfos.intput;
                context.gradingOutput = taskInfos.output;
                context.maxTime = 0;
                context.tickIncrease = 100;
               
                if (context.gradingInput)
                    context.gradingStatesByTime = context.gradingInput.concat(context.gradingOutput);
                else
                    context.gradingStatesByTime = context.gradingOutput;

                context.gradingStatesByTime.sort(function (a, b) { return a.time - b.time; });

                context.gradingStatesBySensor = {};

                for (var i = 0; i < context.gradingStatesByTime.length; i++) {
                    var state = context.gradingStatesByTime[i];
                    var key = state.type.toUpperCase() + state.port.toUpperCase();

                    if (!context.gradingStatesBySensor.hasOwnProperty(key))
                        context.gradingStatesBySensor[key] = [];

                    context.gradingStatesBySensor[key].push(state);

                    if (state.time > context.maxTime)
                        context.maxTime = state.time;
                }

                context.failed = false;
            }
        }

        for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
            var sensor = infos.quickPiSensors[iSensor];

            sensor.lastState = 0;
            sensor.lastStateChange = 0;
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

        $('#grid').html(`
            <div id="piui" style="
                    color: white;
                    font-weight: bold;
                    background-color: blue;
                    border: none;
                    padding: 10px 16px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                    cursor: pointer;
                    border-radius: 20px;
                ">
                Raspberry Pi IP Address 
                <input size="15" type="text" id="piaddress" value="192.168.1.31" style="
                    border: none;
                    color: black;
                    padding: 5px 5px;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;

                    cursor: pointer;
                    border-radius: 16px;
                ">
                <button type="button" id="piconnect">Connect!</button>
                <p>

                <button type="button" id="pigetlist">Get List!</button>
                <select id=pilist>
                <select>
            </div>


            <div id=virtualSensors style="height: 90%; width: 90%; padding: 5px;        ">
            </div>
            <div><button type="button" id="piinstall">Install!</button></div>`
        );

        this.raphaelFactory.destroyAll();
        paper = this.raphaelFactory.create("paperMain", "virtualSensors", $('#virtualSensors').width(), $('#virtualSensors').height());

        var quickPiSensors = infos.quickPiSensors;
        if (!Array.isArray(infos.quickPiSensors)) {
            quickPiSensors = infos.quickPiSensors;
        }

        if (context.autoGrading) {
            var numSensors = infos.quickPiSensors.length;
            var sensorSize = Math.min (paper.height / numSensors * 0.80, paper.width / 4);

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
                if (context.gradingStatesBySensor.hasOwnProperty(key)) {
                    var states = context.gradingStatesBySensor[key];
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

            var geometry = squareSize(paper.width, paper.height, quickPiSensors.length);

            context.sensorSize = geometry.size * .10;

            var iSensor = 0;

            for (var col = 0; col < geometry.cols; col++) {
                var y = geometry.size * col;

                var line = paper.path(["M", 0,
                             y,
                            "L", paper.width,
                            y]);

                line.attr({
                    "stroke-width": 1, 
                    "stroke": "lightgrey",
                    "stroke-linecapstring": "round"
                });

                for (var row = 0; row < geometry.rows; row++) {
                    var x = paper.width / geometry.rows * row;
                    var y1 = y + geometry.size / 4;
                    var y2 = y + geometry.size * 3 / 4;
    
    
                    line = paper.path(["M", x,
                                 y1,
                                "L", x,
                                y2]);
    
                    line.attr({
                        "stroke-width": 1, 
                        "stroke": "lightgrey",
                        "stroke-linecapstring": "round"
                    });

                    if (infos.quickPiSensors[iSensor]) {
                        sensor = infos.quickPiSensors[iSensor];

                        sensor.drawInfo = {
                            x: x,
                            y: y,
                            width: geometry.size,
                            height: geometry.size
                        }
       
                        sensor.state = null;
        
                        drawSensor(sensor);
                    }
                    iSensor++;
                }                   
            }
            

        }

        context.blocklyHelper.updateSize();
        //context.updateScale();

        context.reconnect = true;
        context.offLineMode = true;

        if (context.quickPiConnection.isConnecting()) {
            $('#piconnect').html("Release");
            $('#piconnect').attr("disabled", true);
            $('#piinstall').attr("hidden", true);
            $('#piui').css('background-color', 'brown');
            //context.offLineMode = false;
        }


        if (context.quickPiConnection.isConnected()) {
            $('#piconnect').attr("disabled", false);
            $('#piinstall').attr("hidden", false);
            $('#piui').css('background-color', 'green');

            context.offLineMode = false;
        }

        $('#pigetlist').click(function () {
            fetch('http://www.france-ioi.org/QuickPi/list.php?school=school1')
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonlist) {
                var select = document.getElementById("pilist");

                for (var i = 0; i < jsonlist.length; i++) {
                    var pi = jsonlist[i];

                    var el = document.createElement("option");
                    el.textContent = jsonlist[i].name;
                    el.value = jsonlist[i].ip;

                    select.appendChild(el);
                
                }
            });
        });


        $('#pilist').on('change', function () {
            $("#piaddress").val(this.value);
        });

        $('#piconnect').click(function () {
            // if in offline mode try to connect
            if (context.offLineMode) {
                var ipaddress = $('#piaddress').val();
                sessionStorage.raspberryPiIpAddress = ipaddress;

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
                $('#piconnect').attr("disabled", true);
                context.quickPiConnection.connect(sessionStorage.raspberryPiIpAddress);
            }
        }
    };

    // Straight from stack overflow :)
    function squareSize(x, y, n) {
        // Compute number of rows and columns, and cell size
        var ratio = x / y;
        var ncols_float = Math.sqrt(n * ratio);
        var nrows_float = n / ncols_float;

        // Find best option filling the whole height
        var nrows1 = Math.ceil(nrows_float);
        var ncols1 = Math.ceil(n / nrows1);
        while (nrows1 * ratio < ncols1) {
            nrows1++;
            ncols1 = Math.ceil(n / nrows1);
        }
        var cell_size1 = y / nrows1;

        // Find best option filling the whole width
        var ncols2 = Math.ceil(ncols_float);
        var nrows2 = Math.ceil(n / ncols2);
        while (ncols2 < nrows2 * ratio) {
            ncols2++;
            nrows2 = Math.ceil(n / ncols2);
        }
        var cell_size2 = x / ncols2;

        // Find the best values
        var nrows, ncols, cell_size;
        if (cell_size1 < cell_size2) {
            nrows = nrows2;
            ncols = ncols2;
            cell_size = cell_size2;
        } else {
            nrows = nrows1;
            ncols = ncols1;
            cell_size = cell_size1;
        }

        return {
            rows: nrows,
            cols: ncols,
            size: cell_size
        };
    }

    function raspberryPiConnected() {
        context.quickPiConnection.startNewSession();

        context.offLineMode = false;
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

    function drawTimeLine() {
        if (paper == undefined || !context.display)
            return;

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
        if (paper == undefined || !context.display)
            return;

        var startx = context.sensorSize + (context.currentTime * context.pixelsPerTime);

        if (context.timeLineCurrent)
            context.timeLineCurrent.remove();

        context.timeLineCurrent = paper.path(["M", startx,
            0,
            "L", startx,
            paper.height]);
    }

    function isAnalogSensor(sensor, state)
    {
        var retval = {
            analog: false,
            percentage: 0
        };

        if (sensor.type == "potentiometer" ||
            sensor.type == "light") {
            retval.analog = true;
            retval.percentage = state / 100;
        } else if (sensor.type == "servo") {
            retval.analog = true;
            retval.percentage = state / 180;
        } else if (sensor.type == "temperature") {
            retval.analog = true;
            retval.percentage = state / 50;
        }

        return retval;
    }


    function drawSensorTimeLineState(sensor, state, startTime, endTime, type) {
        if (paper == undefined || !context.display)
            return;

        var stateOffset = 160;

        var startx = sensor.drawInfo.width + (startTime * context.pixelsPerTime);
        var stateLenght = (endTime - startTime) * context.pixelsPerTime;


        var ypositionmiddle = ((sensor.drawInfo.y + (sensor.drawInfo.height * .5)) + (sensor.drawInfo.height * .20));

        var ypositiontop = sensor.drawInfo.y
        var ypositionbottom = sensor.drawInfo.y + sensor.drawInfo.height;

        color = "green";
        if (type == "expected") {
            color = "blue";
        } else if (type == "wrong") {
            color = "red";
            ypositionmiddle += 4;
        }
        else if (type == "actual") {
            color = "yellow";
            ypositionmiddle += 4;
        }

        var isAnalog = isAnalogSensor(sensor, state);       
        var percentage = + state;

        if (isAnalog.analog)  {
            var offset = (ypositionbottom - ypositiontop) * isAnalog.percentage;

            if (type == "wrong") {
                color = "red";
                ypositionmiddle += 4;
            }
            else if (type == "actual") {
                color = "yellow";
                ypositionmiddle += 4;
            }

            stateline = paper.path(["M", startx,
                ypositiontop + offset,
                "L", startx + stateLenght,
                ypositiontop + offset]);

            stateline.attr({
                "stroke-width": 5, "stroke": color
            });
        } else if (sensor.type == "screen") {
            sensor.stateText = paper.text(startx, ypositionmiddle, state.line1);
            sensor.stateText = paper.text(startx, ypositionmiddle + 10, state.line2);
        } else if (percentage != 0) {
            stateline = paper.path(["M", startx,
                ypositionmiddle,
                "L", startx + stateLenght,
                ypositionmiddle]);

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


    function drawSensor(sensor, state = true) {
        var imageOffSet = 50;
        var arrowsOffset = 200;

        var imgw = sensor.drawInfo.width / 2;
        var imgh = sensor.drawInfo.width / 2;

        var imgx = sensor.drawInfo.x;
        var imgy = sensor.drawInfo.y + (sensor.drawInfo.height / 2) - (imgh / 2) ;

        var state1x = imgx + imgw;
        var state1y = imgy + imgh * 2 / 3;

        var portx = imgx + imgw;
        var porty = imgy + imgh / 3;

        var arrowsize = sensor.drawInfo.height * .20;

        if (paper == undefined || !context.display)
            return;

        if (sensor.img)
            sensor.img.remove();

        if (sensor.type == "led") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.img = paper.image('../../modules/img/quickpi/ledon.png', imgx, imgy, imgw, imgh);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(state1x, state1y, "ON");
            } else {
                sensor.img = paper.image('../../modules/img/quickpi/ledoff.png', imgx, imgy, imgw, imgh);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(state1x, state1y, "OFF");
            }

        } else if (sensor.type == "button") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.img = paper.image('../../modules/img/quickpi/buttonon.png', imgx, imgy, imgw, imgh);

                if (!context.autoGrading)
                    sensor.stateText = paper.text(state1x, state1y, "ON");
            } else {
                sensor.img = paper.image('../../modules/img/quickpi/buttonoff.png', imgx, imgy, imgw, imgh);

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

            sensor.img = paper.image('../../modules/img/quickpi/screen.png', imgx, imgy, imgw, imgh);

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

            sensor.img = paper.image('../../modules/img/quickpi/temperature.png', imgx, imgy, imgw, imgh);

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "C");

            if (!context.autoGrading) {
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
            }
        } else if (sensor.type == "servo") {
            if (sensor.stateText)
                sensor.stateText.remove();

            sensor.img = paper.image('../../modules/img/quickpi/servo.png', imgx, imgy, imgw, imgh);

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

            sensor.img = paper.image('../../modules/img/quickpi/potentiometer.png', imgx, imgy, imgw, imgh);

            if (sensor.state == null)
                sensor.state = 0;

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "%");

            if (!context.autoGrading) {
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
        } else if (sensor.type == "range") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.uparrow)
                sensor.uparrow.remove();

            if (sensor.downarrow)
                sensor.downarrow.remove();

            sensor.img = paper.image('../../modules/img/quickpi/range.png', imgx, imgy, imgw, imgh);

            if (sensor.state == null)
                sensor.state = 0;

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "%");
            if (!context.autoGrading) {
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
        }


        if (sensor.portText)
            sensor.portText.remove();

        stateFontSize = sensor.drawInfo.height * 0.10;
        portFontSize = sensor.drawInfo.height * 0.10;


        if (sensor.hasOwnProperty("stateText"))
            sensor.stateText.attr({ "font-size": stateFontSize + "px", 'text-anchor': 'start', 'font-weight': 'bold', fill: "gray"  });

        if (sensor.hasOwnProperty("stateText2"))
            sensor.stateText2.attr({ "font-size": stateFontSize + "px", 'text-anchor': 'start', 'font-weight': 'bold', fill: "gray"   });

        sensor.portText = paper.text(portx, porty, sensor.port);
        sensor.portText.attr({ "font-size": portFontSize + "px", 'text-anchor': 'start', fill: "lightgray" });
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

        if (context.autoGrading && context.gradingStatesBySensor != undefined) {
            var type = "actual";
            var expectedState = context.getSensorExpectedState(sensorType, port);

            if (!sensor.lastStateChange) {
                sensor.lastStateChange = 0;
                sensor.lastState = 0;
            }

            if (context.currentTime >= context.maxTime) {
                context.success = true;
                throw ("Bravo ! La sortie est correcte");
            }
            else if (expectedState != null &&
                !context.compareSensorState(sensor.type, expectedState.state, newState)) {
                type = "wrong";
                context.fail = false;
            }
            else {
                if (expectedState != null)
                    expectedState.hit = true;
            }

            drawSensorTimeLineState(sensor, sensor.lastState, sensor.lastStateChange, context.currentTime, type);
            sensor.lastStateChange = context.currentTime;
            sensor.lastState = newState;

            if (context.fail) {
                context.success = false;
                throw ("Test failed");
            }
            else 
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
        sensorStates = context.gradingStatesBySensor[key];

        if (!sensorStates)
            return; // Fail??

        var lastState;
        var startTime = -1;
        for (var i = 0; i < sensorStates.length; i++) {
            if (startTime > 0) {
                if (context.currentTime >= startTime &&
                    context.currentTime < sensorStates[i].time) {
                    state = lastState;
                    break;
                }
            }

            startTime = sensorStates[i].time;
            lastState = sensorStates[i];
        }

        // This is the end state
        if (state == null && context.currentTime > startTime) {
            state = lastState;
        }

        return state;
    }


    context.getSensorState = function (sensorType, port) {
        var state = null;

        if (!context.display || context.autoGrading) {
            var stateTime = context.getSensorExpectedState(sensorType, port);

            if (stateTime != null) {
                stateTime.hit = true;
                state = stateTime.state;
            }
            else {
                state = 0;
            }
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

        if (!sensor.lastStateChange) {
            sensor.lastStateChange = 0;
            sensor.lastState = 0;
        }

        drawSensorTimeLineState(sensor, sensor.lastState, sensor.lastStateChange, context.currentTime, "actual");
        sensor.lastStateChange = context.currentTime;
        sensor.lastState = state;

        return state;
    }

    // This will advance grading time to the next button release for waitForButton
    // will return false if the next event wasn't a button press
    context.advanceToNextRelease = function(sensorType, port)
    {
        var retval = false;
        var iStates = 0;

        // Advance until current time, ignore everything in the past.
        while (context.gradingStatesByTime[iStates].time <= context.currentTime)
            iStates++;

        for (; iStates < context.gradingStatesByTime.length; iStates++)
        {
            sensorState = context.gradingStatesByTime[iStates];

            if (sensorState.type == sensorType &&
                sensorState.port == port) {
                
                if (!sensorState.state)
                {
                    context.currentTime = sensorState.time;
                    retval = true;
                    break;
                }
            }
            else
            {
                retval = false;
                break;
            }
        }

        return retval;
    };




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
//        context.registerQuickPiEvent("button", "D22", "wait", false);

        if (!context.display || context.autoGrading) {

            context.advanceToNextRelease("button", "D22");

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

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.currentTime += time * 1000;
            context.runner.noDelay(callback);
        }
        else {
            
            context.runner.waitDelay(callback, null, time * 1000);
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