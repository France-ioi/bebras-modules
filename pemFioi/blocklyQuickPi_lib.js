//"use strict";

// This is a template of library for use with quickAlgo.
var getContext = function (display, infos, curLevel) {
    // Local language strings for each language
    var introControls = null;
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
                changeLedState: "Passer la LED %1 à %2 ",
                toggleLedState: "Inverser la LED sur le port %1",
                displayText: "Afficher à l'écran Ligne 1: %1 Ligne 2: %2",
                readTemperature: "température ambiante",
                sleep: "Attendre pendant %1 millisecondes",
                setServoAngle: "Mettre le servo à l'angle %2 sur le port %1",
                readRotaryAngle: "état du potentiomètre",
                readDistance: "distance lue par le capteur à ultrasons",
                readLightIntensity: "Intensité lumineuse",
                readHumidity: "l'humidité ambiante",
                currentTime: "Temps actuel en millisecondes",
                setBuzzerState: "buzzer sur le port %1",
                getTemperature: "Get temperature %1",

                plotPixel: "Draw pixel",
                unplotPixel: "Clear pixel",
                drawLine: "Draw Line (x₀,y₀) %1 %2 (x₁,y₁) %3  %4",
                drawRectangle: "Draw Rectangle (x₀,y₀) %1 %2 (x₁,y₁) %3  %4 Fill %5",
                drawCircle: "Draw circle (x₀,y₀) %1 %2 Radius %3 Fill 4",
                clearScreen: "Clear entiere screen",

                readAcceleration: "Read acceleration (mm/s²)",
                computeRotation: "Compute rotation from accelerometer (°) %1",
                readSoundLevel: "Read sound intensity",

                readMagneticForce: "Read Magnetic Force (µT) %1",
                computeCompassHeading: "Compute Compass Heading (°)",

                readInfraredState: "Read Infrared Receiver State %1",
                setInfraredState: "Set Infrared transmiter State %1",




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
                buttonStateInPort : "buttonStateInPort",
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
                readLightIntensity: "readLightIntensity",
                readHumidity: "readHumidity",
                currentTime: "currentTime",
                setBuzzerState: "setBuzzerState",
                getTemperature: "getTemperature",

                plotPixel: "plotPixel",
                unplotPixel: "unplotPixel",
                drawLine: "drawLine",
                drawRectangle: "drawRectangle",
                drawCircle: "drawCircle",
                clearScreen: "clearScreen",

                readAcceleration: "readAcceleration",
                computeRotation: "computeRotation",

                readSoundLevel: "readSoundLevel",


                readMagneticForce: "readMagneticForce",
                computeCompassHeading: "computeCompassHeading",

                readInfraredState: "readInfraredState",
                setInfraredState: "setInfraredState",


            },
            description: {
                // Descriptions of the functions in Python (optional)
                turnLedOn: "turnLedOn(): Turns on a light connected to Raspberry",
                turnLedOff: "turnLedOff(): Turns off a light connected to Raspberry",
                buttonState: "buttonState(): Returns the state of a button, Pressed means True and not pressed means False",
                buttonStateInPort: "buttonStateInPort(port): Returns the state of a button, Pressed means True and not pressed means False",
                waitForButton: "waitForButton(port): Stops program execution until a button is pressed",
                buttonWasPressed: "buttonWasPressed(port): Returns true if the button has been pressed and will clear the value",
                changeLedState: "changeLedState(port, state): Change led state in the given port",
                toggleLedState: "toggleLedState(port): Toggles the led state",
                displayText: "displayText(line1, line2): Display text in LCD screen",
                readTemperature: "readTemperature(port): Read Ambient temperature",
                sleep: "sleep(1000): pause program execute for a number of seconds",
                setServoAngle: "setServoAngle(port, angle): Set servo motor to an specified angle",
                readRotaryAngle: "readRotaryAngle(port): Read state of potentiometer",
                readDistance: "readDistance(port): Read distance using ultrasonic sensor",
                readLightIntensity: "readLightIntensity(port): Read light intensity",
                readHumidity: "readHumidity(port): lire l'humidité ambiante",
                currentTime: "currentTime(milliseconds): Temps actuel en millisecondes",
                setBuzzerState: "setBuzzerState(port, state): sonnerie",
                getTemperature: "getTemperature(port): Get temperature",

                plotPixel: "plotPixel(x, y)",
                unplotPixel: "unplotPixel(x, y)",
                drawLine: "drawLine(x0, y0, x1, y1)",
                drawRectangle: "drawRectangle(x0, y0, x1, y1, fill)",
                drawCircle: "drawCircle(x0, y0, radius, fill)",
                clearScreen: "clearScreen()",

                readAcceleration: "readAcceleration(axis)",
                computeRotation: "computeRotation()",

                readSoundLevel: "readSoundLevel()",


                readMagneticForce: "readMagneticForce()",
                computeCompassHeading: "computeCompassHeading()",

                readInfraredState: "readInfraredState()",
                setInfraredState: "setInfraredState()",

            },
            constant: {
            },

            startingBlockName: "Programme", // Name for the starting block
            messages: {
                sensorNotFound: "Accès à un capteur ou actuateur inexistant.",
                manualTestSuccess: "Test automatique validé.",
                testSuccess: "Bravo ! La sortie est correcte",
                wrongState: "Test échoué. Un état invalide a été atteint",
                programEnded: "programme terminé.",
                piPlocked: "appareil est verrouillé. Déverrouillez ou redémarrez.",
                cantConnect: "Impossible de se connecter à l'appareil.",
                sensorInOnlineMode: "Vous ne pouvez pas agir sur les capteurs en mode connecté.",
                actuatorsWhenRunning: "Impossible de modifier les actionneurs lors de l'exécution d'un programme",
                cantConnectoToUSB: "Aucun appareil n'est connecté en USB",
                cantConnectoToBT: "Aucun appareil n'est connecté en Bluetooth",
                canConnectoToUSB: "Connecté en USB.",
                canConnectoToBT: "Connecté en Bluetooth.",
                noPortsAvailable: "Aucun port compatible avec ce {0} n'est disponible (type {1})",
                sensor: "capteur",
                actuator: "actionneur",
                removeConfirmation: "Êtes-vous certain de vouloir retirer ce capteur ou actuateur?",
                remove: "Retirer",
                keep: "Garder",
                connectionHTML: `
                <div id="piui">
                    <button type="button" id="piconnect" class="btn">
                        <span class="fa fa-wifi"></span><span id="piconnecttext" class="btnText">Connecter</span> <span id="piconnectprogress" class="fas fa-spinner fa-spin"></span>
                    </button>
    
                    <span id="piinstallui">
                        <span class="fa fa-exchange-alt"></span>
                        <button type="button" id="piinstall" class="btn">
                            <span class="fa fa-upload"></span><span>Installer</span><span id=piinstallprogresss class="fas fa-spinner fa-spin"></span><span id="piinstallcheck" class="fa fa-check"></span>
                        </button>
                    </span>

                    <span id="pichangehatui">
                        <button type="button" id="pichangehat" class="btn">
                            <span class="fas fa-hat-wizard"></span><span>Change Board</span></span></span>
                        </button>
                    </span>
                </div>`,
                connectionDialogHTML: `
                <div class="content connectPi qpi">
                    <div class="panel-heading">
                        <h2 class="sectionTitle">
                            <span class="iconTag"><i class="icon fas fa-list-ul"></i></span>
                            Configuration du Raspberry Pi
                        </h2>
                        <div class="exit" id="picancel"><i class="icon fas fa-times"></i></div>
                    </div>
                    <div class="panel-body">
                        <div class="switchRadio btn-group" id="piconsel">
                            <button type="button" class="btn active" id="piconwifi"><i class="fa fa-wifi icon"></i>WiFi</button>
                            <button type="button" class="btn" id="piconusb"><i class="fab fa-usb icon"></i>USB</button>
                            <button type="button" class="btn" id="piconbt"><i class="fab fa-bluetooth-b icon"></i>Bluetooth</button>
                        </div>
                        <div id="pischoolcon">
                            <div class="form-group">
                                <label id="pischoolkeylabel">Indiquez un identifiant d'école</label>
                                <div class="input-group">
                                    <div class="input-group-prepend">Aa</div>
                                    <input type="text" id="schoolkey" class="form-control">
                                </div>
                            </div>
                            <div class="form-group">
                                <label id="pilistlabel">Sélectionnez un appareil à connecter dans la liste suivante</label>
                                <div class="input-group">
                                    <button class="input-group-prepend" id=pigetlist disabled>Obtenir la liste</button>
                                    <select id="pilist" class="custom-select" disabled>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label id="piiplabel">ou entrez son adesse IP</label>
                                <div class="input-group">
                                    <div class="input-group-prepend">123</div>
                                    <input id=piaddress type="text" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div panel-body-usbbt>
                            <label id="piconnectionlabel"></label>
                        </div>
    
                        <div class="inlineButtons">
                            <button id="piconnectok" class="btn"><i class="fa fa-wifi icon"></i>Connecter l'appareil</button>
                            <button id="pirelease" class="btn"><i class="fa fa-times icon"></i>Déconnecter</button>
                        </div>
                    </div>
                </div>
                `,

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
                readDistance: "Read distance using ultrasonic sensor",
                readLightIntensity: "Read light intensity",
                readHumidity: "lire l'humidité ambiante",
                currentTime: "returns current time",
                setBuzzerState: "sonnerie",
                getTemperature: "Get temperature",

                plotPixel: "plotPixel",
                unplotPixel: "unplotPixel",
                drawLine: "drawLine",
                drawRectangle: "drawRectangle",
                drawCircle: "drawCircle",
                clearScreen: "clearScreen",

                readAcceleration: "readAcceleration",
                computeRotation: "computeRotation",

                readSoundLevel: "readSoundLevel",

                readMagneticForce: "readMagneticForce",
                computeCompassHeading: "computeCompassHeading",

                readInfraredState: "readInfraredState",
                setInfraredState: "setInfraredState",
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
    var orange = false;
    var paper;
    context.offLineMode = true;

    context.onExecutionEnd = function () {

    };

    infos.checkEndEveryTurn = true;
    infos.checkEndCondition = function (context, lastTurn) {

        if (!context.display && !context.autoGrading && context.autoValidateManual) {
            context.success = true;
            throw (strings.messages.manualTestSuccess);
        }

        if (context.autoGrading) {
            for (var sensorStates in context.gradingStatesBySensor) {
                for (var i = 0; i < context.gradingStatesBySensor[sensorStates].length; i++) {
                    var state = context.gradingStatesBySensor[sensorStates][i];

                    if (state.time < context.currentTime) {
                        if (!state.hit) {
                            context.success = false;
                            throw (strings.messages.wrongState);
                        }
                    }
                    else {
                        if (lastTurn) {
                            context.success = false;
                            throw (strings.messages.wrongState);
                        }
                    }
                }
            }

            if (lastTurn) {
                context.success = true;
                context.doNotStartGrade = false;
                throw (strings.messages.programEnded);
            }
        } else {
            if (!context.offLineMode) {
                $('#piinstallcheck').hide();
            }

            if (lastTurn) {
                context.success = false;
                if (context.autoGrading)
                    context.doNotStartGrade = false;
                else
                    context.doNotStartGrade = true;

                throw (strings.messages.programEnded);
            }
        }
    };

    context.resetSensorTable = function()
    {
        var sensorTable = [];

        for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
            var sensor = infos.quickPiSensors[iSensor];

            var tableEntry = {
                type: sensor.type,
                name: sensor.name,
                port: sensor.port
            }

            if (sensor.subType)
                tableEntry.subType = sensor.subType;

            sensorTable.push(tableEntry);

        }

        context.quickPiConnection.setSessionSensorTable(sensorTable);
    }

    context.reset = function (taskInfos) {
        if (!context.offLineMode) {
            $('#piinstallcheck').hide();
            context.quickPiConnection.startNewSession();
        }

        if (taskInfos != undefined) {
            // Instructions that have been called without
            // ever getting into a quickpi block
            context.piLessInstructions = 0;

            context.currentTime = 0;
            context.autoGrading = taskInfos.autoGrading;
            if (context.autoGrading) {
                context.gradingInput = taskInfos.input;
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
                    state.hit = false;

                    if (state.time > context.maxTime)
                        context.maxTime = state.time;
                }
            }
        }

        for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
            var sensor = infos.quickPiSensors[iSensor];

            sensor.state = null;
            sensor.lastState = 0;
            sensor.lastStateChange = null;
            sensor.callsInTimeSlot = 0;
            sensor.lastTimeIncrease = 0;
            sensor.removed = false;
        }

        if (context.display) {
            context.resetDisplay();
        } else {

            context.success = false;
        }

        if (context.display) {
            if (context.autoGrading)
                context.autoValidateManual = true;
            else
                context.autoValidateManual = false;
        }

        context.timeLineStates = [];

        context.liveUpdateCount = 0;
        context.sensorPollInterval = setInterval(function () {
            if ((!context.runner || !context.runner.isRunning())
                && !context.offLineMode) {

                if (context.liveUpdateCount == 0) {
                    for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
                        var sensor = infos.quickPiSensors[iSensor];

                        updateLiveSensor(sensor);
                    }
                }
            }
        }, 200);
    };

    function updateLiveSensor(sensor) {
        if (findSensorDefinition(sensor).isSensor && findSensorDefinition(sensor).getLiveState) {
            context.liveUpdateCount++;

            findSensorDefinition(sensor).getLiveState(sensor.port, function (returnVal) {
                context.liveUpdateCount--;

                if (!sensor.removed) {
                    sensor.state = returnVal;
                    drawSensor(sensor);
                }
            });
        }
    }

    function findSensorDefinition(sensor) {
        for (var iType = 0; iType < sensorDefinitions.length; iType++) {
            var type = sensorDefinitions[iType];

            if (sensor.type == type.name) {
                if (sensor.subType && type.subTypes) {

                    for (var iSubType = 0; iSubType < type.subTypes.length; iSubType++) {
                        var subType = type.subTypes[iSubType];

                        if (subType.subType == sensor.subType) {
                            return $.extend({}, type, subType);
                        }              
                    }
                } else {
                    return type;
                }
            }
        }

        return null;
    }


    function getCurrentBoard(sensor) {
        var found = boardDefinitions.find(function (element) {
            if (context.board == element.name)
                return element;
        });

        return found;
    }


    context.board = "grovepi";

    var boardDefinitions = [
        {
            name: "grovepi",
            friendlyName: "Grove Base Hat for Raspberry Pi",
            image: "grovepihat.png",
            adc: "stm32grove",
            portTypes: {
                "D": [5, 16, 18, 22, 24, 26],
                "A": [0, 2, 4, 6],
                "i2c": ["i2c"],
            },
        },
        {
            name: "quickpi",
            friendlyName: "France IOI QuickPi Hat",
            image: "quickpihat.png",
            adc: "ads1015",
            portTypes: {
                "D": [5, 16, 24],
                "A": [0],
            },
            builtinSensors: [
                {
                    type: "screen",
                    subType: "oled128x32",
                    port: "i2c",                    
                    suggestedName: "oledscreen1",
                },
                {
                    type: "led",
                    subType: "red",
                    port: "D4",
                    suggestedName: "redled1",
                },
                {
                    type: "led",
                    subType: "green",
                    port: "D17",
                    suggestedName: "greenled1",
                },
                {
                    type: "led",
                    subType: "blue",
                    port: "D27",       
                    suggestedName: "blueled1",             
                },
                {
                    type: "irtrans",
                    port: "D22", 
                    suggestedName: "infraredtransmiter1",        
                },
                {
                    type: "irrecv",
                    port: "D23",
                    suggestedName: "infraredreceiver1",
                },
                {
                    type: "sound",
                    port: "A1",
                    suggestedName: "microphone1",
                },
                {
                    type: "buzzer",
                    subType: "passive",
                    port: "D25",
                    suggestedName: "buzzer1",
                },
                {
                    type: "accelerometer",
                    subType: "BMI160",
                    port: "i2c",
                    suggestedName: "accelerometer1",
                },
                {
                    type: "gyroscope",
                    subType: "BMI160",
                    port: "i2c",
                    suggestedName: "gryscope1",
                },
                {
                    type: "magnetometer",
                    subType: "LSM303C",
                    port: "i2c",
                    suggestedName: "magnetometer1",
                },
                {
                    type: "temperature",
                    subType: "LSM303C",
                    port: "i2c",
                    suggestedName: "temperature1",
                },
                {
                    type: "range",
                    subType: "vl53l0x",
                    port: "i2c",
                    suggestedName: "distance1",
                },
                {
                    type: "button",
                    port: "D26",
                    suggestedName: "button1",
                },
                {
                    type: "light",
                    port: "A2",
                    suggestedName: "light1",
                },
                {
                    type: "stick",
                    port: "D19",
                    suggestedName: "stick1",
                }
            ]
        },
        {
            name: "pinohat",
            image: "pinohat.png",
            friendlyName: "Raspberry Pi without hat",
            adc: ["ads1015", "mcp3008", "none"],
            portTypes: {
                "D": [5, 16, 24],
                "A": [0],
            },
        }
    ]


    var sensorDefinitions = [
        /******************************** */
        /*             Actuators          */
        /**********************************/
        {
            name: "led",
            description: "LED",
            isAnalog: false,
            isSensor: false,
            portType: "D",
            selectorImages: ["ledon-red.png"],
            valueType: "boolean",
            getPercentageFromState: function (state) {
                if (state)
                    return 1;
                else
                    return 0;
            },
            getStateFromPercentage: function (percentage) {
                if (percentage)
                    return 1;
                else
                    return 0;
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            setLiveState: function (port, state, callback) {
                var ledstate = state ? 1 : 0;
                var command = "changeLedState(\"" + port + "\"," + ledstate + ")";

                context.quickPiConnection.sendCommand(command, callback);
            },
            subTypes: [{
                subType: "blue",
                description: "LED bleue",
                selectorImages: ["ledon-blue.png"],
            },
            {
                subType: "green",
                description: "LED verte",
                selectorImages: ["ledon-green.png"],
            },
            {
                subType: "orange",
                description: "LED orange",
                selectorImages: ["ledon-orange.png"],
            },
            {
                subType: "red",
                description: "LED rouge",
                selectorImages: ["ledon-red.png"],
            }
            ],
        },
        {
            name: "buzzer",
            description: "Buzzer",
            isAnalog: false,
            isSensor: false,
            portType: "D",
            selectorImages: ["buzzer-ringing.png"],
            valueType: "boolean",
            getPercentageFromState: function (state) {
                if (state)
                    return 1;
                else
                    return 0;
            },
            getStateFromPercentage: function (percentage) {
                if (percentage)
                    return 1;
                else
                    return 0;
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            subTypes: [{
                subType: "active",
                description: "Grove Buzzer",
                setLiveState: function (port, state, callback) {
                    var ledstate = state ? 1 : 0;
                    var command = "setBuzzerState(\"" + port + "\"," + ledstate + ")";
    
                    context.quickPiConnection.sendCommand(command, callback);
                },
            },
            {
                subType: "passive",
                description: "Quick Pi Passive Buzzer",
                setLiveState: function (port, state, callback) {
                    var ledstate = state ? 1 : 0;
                    var command = "changePassiveBuzzerState(\"" + port + "\"," + ledstate + ")";
    
                    context.quickPiConnection.sendCommand(command, callback);
                },
            }],
        },
        {
            name: "servo",
            description: "Servo motor",
            isAnalog: true,
            isSensor: false,
            portType: "D",
            valueType: "number",
            valueMin: 0,
            valueMax: 180,
            selectorImages: ["servo.png", "servo-pale.png", "servo-center.png"],
            getPercentageFromState: function (state) {
                return state / 180;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 180);
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            setLiveState: function (port, state, callback) {
                var command = "setServoAngle(\"" + port + "\"," + state + ")";

                context.quickPiConnection.sendCommand(command, callback);
            }
        },
        {
            name: "screen",
            description: "Screen",
            isAnalog: false,
            isSensor: false,
            doubleWidth: true,
            portType: "i2c",
            valueType: "object",
            selectorImages: ["screen.png"],
            compareState: function (state1, state2) {
                // Both are null are equal
                if (state1 == null && state2 == null)
                    return true;

                // If only one is null they are different
                if ((state1 == null && state2) ||
                    (state1 && state2 == null))
                    return false;

                // Otherwise compare the strings
                return state1.line1 == state2.line1 &&
                    state1.line2 == state2.line2;
            },
            setLiveState: function (port, state, callback) {
                var command = "displayText(\"" + state.line1 + "\", \"" + state.line2 + "\")";

                context.quickPiConnection.sendCommand(command, callback);
            },
            subTypes: [{
                subType: "16x2lcd",
                description: "Grove 16x2 LCD",
            },
            {
                subType: "oled128x32",
                description: "128x32 Oled Screen",
            }],

        },
        {
            name: "irtrans",
            description: "IR Transmiter",
            isAnalog: true,
            isSensor: true,
            portType: "D",
            valueType: "number",
            valueMin: 0,
            valueMax: 60,
            selectorImages: ["irtrans.png"],
            getPercentageFromState: function (state) {
                return state / 60;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 60);
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            setLiveState: function (port, state, callback) {
                var ledstate = state ? 1 : 0;
                var command = "setInfraredState(\"" + port + "\"," + ledstate + ")";

                context.quickPiConnection.sendCommand(command, callback);
            },
        },
        /******************************** */
        /*             sensors            */
        /**********************************/
        {
            name: "button",
            description: "Button",
            isAnalog: false,
            isSensor: true,
            portType: "D",
            valueType: "boolean",
            selectorImages: ["buttonoff.png"],
            getPercentageFromState: function (state) {
                if (state)
                    return 1;
                else
                    return 0;
            },
            getStateFromPercentage: function (percentage) {
                if (percentage)
                    return 1;
                else
                    return 0;
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            getLiveState: function (port, callback) {
                context.quickPiConnection.sendCommand("buttonStateInPort(\"" + port + "\")", function (retVal) {
                    var intVal = parseInt(retVal, 10);
                    callback(intVal != 0);
                });
            },
        },
        {
            name: "stick",
            description: "5 way button",
            isAnalog: false,
            isSensor: true,
            portType: "D",
            valueType: "boolean",
            selectorImages: ["stick.png"],
            gpiosNames: ["Up", "Down", "Left", "Right", "Center"],
            gpios: [10, 9, 11, 8, 7],
            getPercentageFromState: function (state) {
                if (state)
                    return 1;
                else
                    return 0;
            },
            getStateFromPercentage: function (percentage) {
                if (percentage)
                    return 1;
                else
                    return 0;
            },
            compareState: function (state1, state2) {
                if (state1 == null && state2 == null)
                    return true;

                return state1[0] == state2[0] &&
                        state1[1] == state2[1] &&
                        state1[2] == state2[2] &&
                        state1[3] == state2[3] &&
                        state1[4] == state2[4];
            },
            getLiveState: function (port, callback) {
                var cmd = "readStick(" + this.gpios.join() + ")";

                context.quickPiConnection.sendCommand("readStick(" + this.gpios.join() + ")", function (retVal) {
                    var array = JSON.parse(retVal);
                    callback(array);
                });
            },
            getButtonState: function(buttonname, state) {
                if (state) {
                    var buttonparts = buttonname.split(" ");
                    var actualbuttonmame = buttonname;
                    if (buttonparts.length == 2) {
                        actualbuttonmame = buttonparts[1];
                    }

                    var index = this.gpiosNames.indexOf(actualbuttonmame);

                    if (index >= 0) {
                        return state[index];
                    }
                }

                return false;
            }
        },
        {
            name: "temperature",
            description: "Temperature sensor",
            isAnalog: true,
            isSensor: true,
            portType: "A",
            valueType: "number",
            valueMin: 0,
            valueMax: 60,
            selectorImages: ["temperature-hot.png", "temperature-overlay.png"],
            getPercentageFromState: function (state) {
                return state / 60;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 60);
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            getLiveState: function (port, callback) {
                context.quickPiConnection.sendCommand("readTemperature(\"" + port + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
            subTypes: [{
                subType: "groveanalog",
                description: "Grove 16x2 LCD",
                portType: "A",
            },
            {
                subType: "LSM303C",
                description: "128x32 Oled Screen",
                portType: "i2c",
            },
            {
                subType: "DHT11",
                description: "128x32 Oled Screen",
                portType: "D",
            }],
        },
        {
            name: "potentiometer",
            description: "Potentiometer",
            isAnalog: true,
            isSensor: true,
            portType: "A",
            valueType: "number",
            valueMin: 0,
            valueMax: 100,
            selectorImages: ["potentiometer.png", "potentiometer-pale.png"],
            getPercentageFromState: function (state) {
                return state / 100;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 100);
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            getLiveState: function (port, callback) {
                context.quickPiConnection.sendCommand("readRotaryAngle(\"" + port + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
        },
        {
            name: "light",
            description: "Light sensor",
            isAnalog: true,
            isSensor: true,
            portType: "A",
            valueType: "number",
            valueMin: 0,
            valueMax: 100,
            selectorImages: ["light.png"],
            getPercentageFromState: function (state) {
                return state / 100;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 100);
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            getLiveState: function (port, callback) {
                context.quickPiConnection.sendCommand("readLightIntensity(\"" + port + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
        },
        {
            name: "range",
            description: "Capteur de distance à ultrason",
            isAnalog: true,
            isSensor: true,
            portType: "D",
            valueType: "number",
            valueMin: 0,
            valueMax: 5000,
            selectorImages: ["range.png"],
            getPercentageFromState: function (state) {
                return state / 500;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 500);
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            /*
            getLiveState: function (port, callback) {
                context.quickPiConnection.sendCommand("readDistance(\"" + port + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },*/
            subTypes: [{
                subType: "vl53l0x",
                description: "Time of flight distance sensor",
                portType: "i2c",
            },
            {
                subType: "ultrasonic",
                description: "Capteur de distance à ultrason",
                portType: "D",
            }],

        },
        {
            name: "humidity",
            description: "Humidity sensor",
            isAnalog: true,
            isSensor: true,
            portType: "D",
            valueType: "number",
            valueMin: 0,
            valueMax: 100,
            selectorImages: ["humidity.png"],
            getPercentageFromState: function (state) {
                return state / 100;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 100);
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            getLiveState: function (port, callback) {
                context.quickPiConnection.sendCommand("readHumidity(\"" + port + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
        },
        {
            name: "sound",
            description: "Sound sensor",
            isAnalog: true,
            isSensor: true,
            portType: "A",
            valueType: "number",
            valueMin: 0,
            valueMax: 100,
            selectorImages: ["sound.png"],
            getPercentageFromState: function (state) {
                return state / 100;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 100);
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            getLiveState: function (port, callback) {
                context.quickPiConnection.sendCommand("readSoundLevel(\"" + port + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
        },
        {
            name: "accelerometer",
            description: "Accelerometer sensor (BMI160)",
            isAnalog: true,
            isSensor: true,
            portType: "i2c",
            valueType: "object",
            valueMin: 0,
            valueMax: 100,
            selectorImages: ["accel.png"],
            getPercentageFromState: function (state) {
                return state / 100;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 100);
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            getLiveState: function (port, callback) {
                context.quickPiConnection.sendCommand("readAccelBMI160()", function(val) {
                    var array = JSON.parse(val);
                    callback(array);
                });
            },
        },
        {
            name: "gyroscope",
            description: "Gyropscope sensor (BMI160)",
            isAnalog: true,
            isSensor: true,
            portType: "i2c",
            valueType: "object",
            valueMin: 0,
            valueMax: 100,
            selectorImages: ["gyro.png"],
            getPercentageFromState: function (state) {
                return state / 100;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 100);
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            getLiveState: function (port, callback) {
                context.quickPiConnection.sendCommand("readGyroBMI160()", function(val) {

                    var array = JSON.parse(val);
                    callback(array);
                });
            },
        },
        {
            name: "magnetometer",
            description: "Magnetometer sensor (LSM303C)",
            isAnalog: true,
            isSensor: true,
            portType: "i2c",
            valueType: "object",
            valueMin: 0,
            valueMax: 100,
            selectorImages: ["mag.png"],
            getPercentageFromState: function (state) {
                return state / 100;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 100);
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            getLiveState: function (port, callback) {
                context.quickPiConnection.sendCommand("readMagnetometerLSM303C()", function(val) {

                    var array = JSON.parse(val);
                    callback(array);
                });
            },
        },
        {
            name: "irrecv",
            description: "IR Receiver",
            isAnalog: true,
            isSensor: true,
            portType: "D",
            valueType: "number",
            valueMin: 0,
            valueMax: 60,
            selectorImages: ["irrecv.png"],
            getPercentageFromState: function (state) {
                return state / 60;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 60);
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            getLiveState: function (port, callback) {
                context.quickPiConnection.sendCommand("buttonStateInPort(\"" + port + "\")", function (retVal) {
                    var intVal = parseInt(retVal, 10);
                    callback(intVal == 0);
                });
            },
        },

    ];

    context.savePrograms = function(xml) {
        if (context.infos.customSensors) 
        {
            var node = goog.dom.createElement("quickpi");
            xml.appendChild(node);

            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                var currentSensor = infos.quickPiSensors[i];

                var node = goog.dom.createElement("sensor");

                node.setAttribute("type", currentSensor.type);
                node.setAttribute("port", currentSensor.port);
                node.setAttribute("name", currentSensor.name);

                if (currentSensor.subType)
                    node.setAttribute("subType", currentSensor.subType);

                var elements = xml.getElementsByTagName("quickpi");

                elements[0].appendChild(node);
            }
        }
    }

    context.loadPrograms = function(xml) {
        if (context.infos.customSensors) {
            var elements = xml.getElementsByTagName("sensor");

            if (elements.length > 0) {
                for (var i = 0; i < infos.quickPiSensors.length; i++) {
                    var sensor = infos.quickPiSensors[i];
                    sensor.removed = true;
                }
                infos.quickPiSensors = [];

                for (var i = 0; i < elements.length; i++) {
                    var sensornode = elements[i];
                    var sensor = {
                        "type" : sensornode.getAttribute("type"),
                        "port" : sensornode.getAttribute("port"),
                        "name" : sensornode.getAttribute("name"),
                    };

                    if (sensornode.getAttribute("subType")) {
                        sensor.subType = sensornode.getAttribute("subType");
                    }

                    sensor.state = null;
                    sensor.lastState = 0;
                    sensor.lastStateChange = null;
                    sensor.callsInTimeSlot = 0;
                    sensor.lastTimeIncrease = 0;
    
                    infos.quickPiSensors.push(sensor);
                }

                this.resetDisplay();
            }
        }
    }


    // Reset the context's display
    context.resetDisplay = function () {
        // Do something here
        //$('#grid').html('Display for the library goes here.');

        // Ask the parent to update sizes
        //context.blocklyHelper.updateSize();
        //context.updateScale();

        if (!context.display || !this.raphaelFactory)
            return;

        var piUi = strings.messages.connectionHTML;

        var hasIntroControls = $('#taskIntro').find('#introControls').length;
        if (!hasIntroControls) {
            $('#taskIntro').append(`<div id="introControls"></div>`);
        }
        if (introControls === null) {
            introControls = piUi + $('#introControls').html();
        }
        $('#introControls').html(introControls)
        $('#taskIntro').addClass('piui');

        $('#grid').html(`
            <div id="virtualSensors" style="height: 90%; width: 90%; padding: 5px;">
            </div>
             `
        );

        this.raphaelFactory.destroyAll();
        paper = this.raphaelFactory.create("paperMain", "virtualSensors", $('#virtualSensors').width(), $('#virtualSensors').height());

        var quickPiSensors = infos.quickPiSensors;

        if (context.autoGrading) {
            var numSensors = infos.quickPiSensors.length;
            var sensorSize = Math.min(paper.height / numSensors * 0.80, paper.width / 10);

            context.sensorSize = sensorSize * .90;

            context.timelineStartx = context.sensorSize * 3;

            var maxTime = context.maxTime;
            if (maxTime == 0)
                maxTime = 1000;

            context.pixelsPerTime = (paper.width - context.timelineStartx - 10) / maxTime;

            for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
                var sensor = infos.quickPiSensors[iSensor];

                sensor.drawInfo = {
                    x: 0,
                    y: 10 + (sensorSize * iSensor),
                    width: sensorSize * .90,
                    height: sensorSize * .90
                }

                drawSensor(sensor);
                drawTimeLine();

                var key = sensor.type.toUpperCase() + sensor.port.toUpperCase();
                if (context.gradingStatesBySensor.hasOwnProperty(key)) {
                    var states = context.gradingStatesBySensor[key];
                    var startTime = 0;
                    var lastState = null;
                    sensor.lastAnalogState = null;

                    for (var iState = 0; iState < states.length; iState++) {
                        var state = states[iState];

                        drawSensorTimeLineState(sensor, lastState, startTime, state.time, "expected", true);

                        startTime = state.time;
                        lastState = state.state;
                    }

                    drawSensorTimeLineState(sensor, lastState, startTime, state.time, "expected", true);

                    sensor.lastAnalogState = null;
                }
            }

            for (var iState = 0; iState < context.timeLineStates.length; iState++) {
                var timelinestate = context.timeLineStates[iState];

                drawSensorTimeLineState(timelinestate.sensor,
                    timelinestate.state,
                    timelinestate.startTime,
                    timelinestate.endTime,
                    timelinestate.type,
                    true)
            }
        } else {

            var hasdoublewitdh = false;
            var nSensors = quickPiSensors.length;

            quickPiSensors.forEach(function (sensor) {
                if (findSensorDefinition(sensor).doubleWidth) {
                    hasdoublewitdh = true;
                    nSensors++;
                }
            });

            if (infos.customSensors) {
                nSensors++;
            }

            if (nSensors < 4)
                nSensors = 4;

            var geometry = squareSize(paper.width, paper.height, nSensors);

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

                    if (iSensor == infos.quickPiSensors.length && infos.customSensors) {
                        drawCustomSensorAdder(x, y, geometry.size);
                    } else if (infos.quickPiSensors[iSensor]) {
                        var sensor = infos.quickPiSensors[iSensor];
                        var doublewitdh = findSensorDefinition(sensor).doubleWidth;

                        if (doublewitdh) {
                            row++;

                            sensor.drawInfo = {
                                x: x,
                                y: y,
                                width: geometry.size * 2,
                                height: geometry.size
                            }
                        } else {
                            sensor.drawInfo = {
                                x: x,
                                y: y,
                                width: geometry.size,
                                height: geometry.size
                            }
                        }

                        drawSensor(sensor);
                    }
                    iSensor++;
                }
            }
        }

        context.blocklyHelper.updateSize();

        context.inUSBConnection = false;
        context.inBTConnection = false;
        context.releasing = false;
        context.offLineMode = true;

        showasReleased();

        if (context.quickPiConnection.isConnecting()) {
            showasConnecting();
        }

        if (context.quickPiConnection.isConnected()) {
            showasConnected();

            context.offLineMode = false;
        }

        $('#piconnect').click(function () {

            window.displayHelper.showPopupDialog(strings.messages.connectionDialogHTML);

            if (context.offLineMode) {
                $('#piconnectok').attr('disabled', false);
                $('#pirelease').attr('disabled', true);
            }
            else {
                $('#piconnectok').attr('disabled', true);
                $('#pirelease').attr('disabled', false);
            }

            $('#piconnectionlabel').hide();

            if (context.quickPiConnection.isConnected()) {
                if (sessionStorage.connectionMethod == "USB") {
                    $('#piconwifi').removeClass('active');
                    $('#piconusb').addClass('active');
                    $('#pischoolcon').hide();
                    $('#piaddress').val("192.168.233.1");

                    $('#piconnectok').attr('disabled', true);
                    $('#piconnectionlabel').show();
                    $('#piconnectionlabel').text(strings.messages.canConnectoToUSB)

                    context.inUSBConnection = true;
                    context.inBTConnection = false;
                } else if (sessionStorage.connectionMethod == "BT") {
                    $('#piconwifi').removeClass('active');
                    $('#piconbt').addClass('active');
                    $('#pischoolcon').hide();

                    $('#piaddress').val("192.168.233.2");

                    $('#piconnectok').attr('disabled', true);
                    $('#piconnectionlabel').show();
                    $('#piconnectionlabel').text(strings.messages.canConnectoToBT)
                    
                    context.inUSBConnection = false;
                    context.inBTConnection = true;
                }
            } else {
                sessionStorage.connectionMethod = "WIFI";
            }

            if (sessionStorage.pilist) {
                populatePiList(JSON.parse(sessionStorage.pilist));
            }

            if (sessionStorage.raspberryPiIpAddress) {
                $('#piaddress').val(sessionStorage.raspberryPiIpAddress);
            }

            if (sessionStorage.schoolkey) {
                $('#schoolkey').val(sessionStorage.schoolkey);
            }

            $('#piconnectok').click(function () {
                context.inUSBConnection = false;
                context.inBTConnection = false;

                $('#popupMessage').hide();
                window.displayHelper.popupMessageShown = false;

                var ipaddress = $('#piaddress').val();
                sessionStorage.raspberryPiIpAddress = ipaddress;

                showasConnecting();
                context.quickPiConnection.connect(ipaddress);
            });

            $('#pirelease').click(function () {
                context.inUSBConnection = false;
                context.inBTConnection = false;

                $('#popupMessage').hide();
                window.displayHelper.popupMessageShown = false;

                // IF connected release lock
                context.releasing = true;
                context.quickPiConnection.releaseLock();
            });

            $('#picancel').click(function () {
                context.inUSBConnection = false;
                context.inBTConnection = false;
                
                $('#popupMessage').hide();
                window.displayHelper.popupMessageShown = false;
            });

            $('#schoolkey').on('input', function (e) {
                var schoolkey = $('#schoolkey').val();
                sessionStorage.schoolkey = schoolkey;

                if (schoolkey)
                    $('#pigetlist').attr("disabled", false);
                else
                    $('#pigetlist').attr("disabled", true);
            });


            $('#pigetlist').click(function () {
                var schoolkey = $('#schoolkey').val();

                fetch('http://www.france-ioi.org/QuickPi/list.php?school=' + schoolkey)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (jsonlist) {
                        populatePiList(jsonlist);
                    });
            });

            // Select device connexion methods
            $('#piconsel .btn').click(function () {
                if (!context.quickPiConnection.isConnected()) {
                    if (!$(this).hasClass('active')) {
                        $('#piconsel .btn').removeClass('active');
                        $(this).addClass('active');
                    }
                }
            });

            $('#piconwifi').click(function () {
                if (!context.quickPiConnection.isConnected()) {
                    sessionStorage.connectionMethod = "WIFI";
                    $(this).addClass('active');
                    $('#pischoolcon').show("slow");
                    $('#piconnectionlabel').hide();
                }

                context.inUSBConnection = false;
                context.inBTConnection = false;

            });

            $('#piconusb').click(function () {
                $('#piconnectionlabel').show();
                if (!context.quickPiConnection.isConnected()) {
                    sessionStorage.connectionMethod = "USB";
                    $('#piconnectok').attr('disabled', true);
                    $('#piconnectionlabel').show();
                    $('#piconnectionlabel').text(strings.messages.cantConnectoToUSB)

                    $(this).addClass('active');
                    $('#pischoolcon').hide("slow");
                    $('#piaddress').val("192.168.233.1");
                    
                    context.inUSBConnection = true;
                    context.inBTConnection = false;

                    function updateUSBAvailability(available) {

                        if  (context.inUSBConnection && context.offLineMode) {
                            if (available) {
                                $('#piconnectok').attr('disabled', false);

                                $('#piconnectionlabel').text(strings.messages.canConnectoToUSB)
                            } else {
                                $('#piconnectok').attr('disabled', true);

                                $('#piconnectionlabel').text(strings.messages.cantConnectoToUSB)
                            }

                            context.quickPiConnection.isAvailable("192.168.233.1", updateUSBAvailability);
                        }
                    }

                    updateUSBAvailability(false);
                    
                    
                }
            });

            $('#piconbt').click(function () {
                $('#piconnectionlabel').show();
                if (!context.quickPiConnection.isConnected()) {
                    sessionStorage.connectionMethod = "BT";
                    $('#piconnectok').attr('disabled', true);
                    $('#piconnectionlabel').show();
                    $('#piconnectionlabel').text(strings.messages.cantConnectoToBT)

                    $(this).addClass('active');
                    $('#pischoolcon').hide("slow");

                    $('#piaddress').val("192.168.233.2");

                    context.inUSBConnection = false;
                    context.inBTConnection = true;

                    function updateBTAvailability(available) {

                        if  (context.inUSBConnection && context.offLineMode) {
                            if (available) {
                                $('#piconnectok').attr('disabled', false);

                                $('#piconnectionlabel').text(strings.messages.canConnectoToBT)
                            } else {
                                $('#piconnectok').attr('disabled', true);

                                $('#piconnectionlabel').text(strings.messages.cantConnectoToBT)
                            }

                            context.quickPiConnection.isAvailable("192.168.233.2", updateUSBAvailability);
                        }
                    }

                    updateBTAvailability(false);
                }
            });

            function populatePiList(jsonlist) {
                sessionStorage.pilist = JSON.stringify(jsonlist);

                var select = document.getElementById("pilist");
                var first = true;

                $('#pilist').empty();

                for (var i = 0; i < jsonlist.length; i++) {
                    var pi = jsonlist[i];

                    var el = document.createElement("option");
                    el.textContent = jsonlist[i].name;
                    el.value = jsonlist[i].ip;

                    select.appendChild(el);

                    if (first) {
                        $('#piaddress').val(jsonlist[i].ip);
                        first = false;
                        $('#pilist').prop('disabled', false);
                    }
                }
            }

            $('#pilist').on('change', function () {
                $("#piaddress").val(this.value);
            });
        });



        $('#pichangehat').click(function () {
            window.displayHelper.showPopupDialog(`
            <div class="content connectPi qpi">
            <div class="panel-heading">
                <h2 class="sectionTitle">
                    <span class="iconTag"><i class="icon fas fa-list-ul"></i></span>
                    Select your hat
                </h2>
                <div class="exit" id="picancel"><i class="icon fas fa-times"></i></div>
            </div>
            <div class="panel-body">

                <div id=boardlist>
                </div>

                <div panel-body-usbbt>
                    <label id="piconnectionlabel"></label>
                </div>
            </div>
        </div>`);

            $('#picancel').click(function () {
                $('#popupMessage').hide();
                window.displayHelper.popupMessageShown = false;
            });


            for (var i = 0; i < boardDefinitions.length; i++) {
                let board = boardDefinitions[i];
                var image = document.createElement('img');
                image.src = getImg(board.image);

                $('#boardlist').append(image);

                image.onclick = function () {
                    $('#popupMessage').hide();
                    window.displayHelper.popupMessageShown = false;

                    context.board = board.name;

                    for (var i = 0; i < infos.quickPiSensors.length; i++) {
                        var sensor = infos.quickPiSensors[i];
                        sensor.removed = true;
                    }
                    infos.quickPiSensors = [];

                    if (board.builtinSensors) {
                        for (var i = 0; i < board.builtinSensors.length; i++) {
                            var sensor = board.builtinSensors[i];

                            var newSensor = {
                                "type": sensor.type,
                                "port": sensor.port,
                            };

                            if (sensor.subType) {
                                newSensor.subType = sensor.subType;
                            }

                            newSensor.name = getSensorSuggestedName(sensor.type, sensor.suggestedName);

                            sensor.state = null;
                            sensor.lastState = 0;
                            sensor.lastStateChange = null;
                            sensor.callsInTimeSlot = 0;
                            sensor.lastTimeIncrease = 0;

                            infos.quickPiSensors.push(newSensor);
                        }
                    }

                    context.resetDisplay();
                }
            }
        });


        $('#piinstall').click(function () {
            context.blocklyHelper.reportValues = false;
            python_code = context.blocklyHelper.getCode("python");

            if (context.runner)
                context.runner.stop();

            context.installing = true;
            $('#piinstallprogresss').show();
            $('#piinstallcheck').hide();

            context.quickPiConnection.installProgram(python_code, function () {
                context.justinstalled = true;
                $('#piinstallprogresss').hide();
                $('#piinstallcheck').show();
            });
        });


        if (parseInt(sessionStorage.autoConnect)) {
            if (!context.quickPiConnection.isConnected() && !context.quickPiConnection.isConnecting()) {
                $('#piconnect').attr("disabled", true);
                context.quickPiConnection.connect(sessionStorage.raspberryPiIpAddress);
            }
        }
    };

    function drawCustomSensorAdder(x, y, size) {
        if (context.sensorAdder) {
            context.sensorAdder.remove();
        }

        var centerx = x + size / 2;
        var centery = y + size / 2;
        var fontsize = size * .70;

        context.sensorAdder = paper.text(centerx, centery, "+");

        context.sensorAdder.attr({
            "font-size": fontsize + "px",
            fill: "lightgray"
        });
        context.sensorAdder.node.style = "-moz-user-select: none; -webkit-user-select: none;";

        context.sensorAdder.click(function () {

            window.displayHelper.showPopupDialog(`
                <div class="content qpi">
                    <div class="panel-heading">
                        <h2 class="sectionTitle">
                            <span class="iconTag"><i class="icon fas fa-list-ul"></i></span>
                            Ajouter un composant
                        </h2>
                        <div class="exit" id="picancel"><i class="icon fas fa-times"></i></div>
                    </div>
                    <div id="sensorPicker" class="panel-body">
                        <label>Sélectionnez un composant à ajouter à votre Raspberry Pi et attachez-le à un port.</label>
                        <div class="flex-container">
                            <div id="selector-image-container" class="flex-col half">
                                <img id="selector-sensor-image">
                            </div>
                            <div class="flex-col half">
                                <div class="form-group">
                                    <div class="input-group">
                                        <select id="selector-sensor-list" class="custom-select"></select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">
                                        <select id="selector-sensor-port" class="custom-select"></select>
                                    </div>
                                    <label id="selector-label"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="singleButton">
                        <button id="selector-add-button" class="btn btn-centered"><i class="icon fa fa-check"></i>Ajouter</button>
                    </div>
                </div>
            `);

            var select = document.getElementById("selector-sensor-list");
            for (var iSensorDef = 0; iSensorDef < sensorDefinitions.length; iSensorDef++) {
                var sensorDefinition = sensorDefinitions[iSensorDef];

                var el = document.createElement("option");
                el.textContent = sensorDefinition.description;
                el.value = sensorDefinition.name;

                if (sensorDefinition.subType)
                el.value += "-" + sensorDefinition.subType;

                select.appendChild(el);
            }

            $('#selector-sensor-list').on('change', function () {

                var values = this.value.split("-");

                var dummysensor = { type: values[0] };

                if (values.length == 2)
                    dummysensor.subType = values[1];

                var sensorDefinition = findSensorDefinition(dummysensor);

                var imageContainer = document.getElementById("selector-image-container");
                while (imageContainer.firstChild) {
                    imageContainer.removeChild(imageContainer.firstChild);
                }
                for (var i = 0; i < sensorDefinition.selectorImages.length; i++) {
                    var image = document.createElement('img');

                    image.src = getImg(sensorDefinition.selectorImages[i]);

                    imageContainer.appendChild(image);

                    //$('#selector-sensor-image').attr("src", getImg(sensorDefinition.selectorImages[0]));
                }

                var hasPorts = false;
                $('#selector-sensor-port').empty();
                var portSelect = document.getElementById("selector-sensor-port");
                var ports = getCurrentBoard().portTypes[sensorDefinition.portType];
                for (var iPort = 0; iPort < ports.length; iPort++) {
                    var port = sensorDefinition.portType + ports[iPort];
                    if (sensorDefinition.portType == "i2c")
                        port = "i2c";


                    if (!isPortUsed(sensorDefinition.name, port)) {
                        var option = document.createElement('option');
                        option.innerText = port;
                        option.value = port;
                        portSelect.appendChild(option);
                        hasPorts = true;
                    }
                }

                if (!hasPorts) {
                    $('#selector-add-button').attr("disabled", true);

                    var object_function = strings.messages.actuator;
                    if (sensorDefinition.isSensor)
                        object_function = strings.messages.sensor;

                    $('#selector-label').text(strings.messages.noPortsAvailable.format(object_function, sensorDefinition.portType));
                    $('#selector-label').show();
                }
                else {
                    $('#selector-add-button').attr("disabled", false);
                    $('#selector-label').hide();
                }
            });

            $('#selector-add-button').click(function () {
                var sensorType = $("#selector-sensor-list option:selected").val();
                var values = sensorType.split("-");

                var dummysensor = { type: values[0] };
                if (values.length == 2)
                    dummysensor.subType = values[1];

                var sensorDefinition = findSensorDefinition(dummysensor);


                var port = $("#selector-sensor-port option:selected").text();

                infos.quickPiSensors.push({
                        type: sensorDefinition.name,
                        subType: sensorDefinition.subType,
                        port: port },
                );

                $('#popupMessage').hide();
                window.displayHelper.popupMessageShown = false;

                context.resetDisplay();
            });


            $("#selector-sensor-list").trigger("change");

            $('#picancel').click(function () {
                $('#popupMessage').hide();
                window.displayHelper.popupMessageShown = false;
            });
        });
    };

    function isPortUsed(type, port) {
        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];

            if (sensor.type == type && port == "i2c")
                return true;

            if (sensor.port == port)
                return true;
        }

        return false;
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
            rows: ncols,
            cols: nrows,
            size: cell_size
        };
    }

    function showasConnected() {
        $('#piconnectprogress').hide();
        $('#piinstallcheck').hide();
        $('#piinstallprogresss').hide();
        $('#piinstallui').show();
        $('#piconnect').css('background-color', '#F9A423');

        $('#piinstall').css('background-color', "#488FE1");

        $('#piconnecttext').hide();
    }

    function showasConnecting() {
        $('#piconnectprogress').show();
        $('#piinstallcheck').hide();
        $('#piinstallprogresss').hide();
    }

    function showasReleased() {
        $('#piconnectprogress').hide();
        $('#piinstallcheck').hide();
        $('#piinstallprogresss').hide();
        $('#piinstallui').hide();
        $('#piconnect').css('background-color', '#F9A423');
        $('#piconnecttext').show();
    }


    function showasDisconnected() {
        $('#piconnectprogress').hide();
        $('#piinstallcheck').hide();
        $('#piinstallprogresss').hide();
        $('#piinstall').css('background-color', 'gray');
        $('#piconnect').css('background-color', 'gray');
        $('#piconnecttext').hide();
    }

    function raspberryPiConnected() {
        showasConnected();

        context.resetSensorTable();
        
        context.quickPiConnection.startNewSession();

        context.liveUpdateCount = 0;
        context.offLineMode = false;

        sessionStorage.autoConnect = "1";

        context.resetDisplay();
    }

    function raspberryPiDisconnected(wasConnected) {

        if (context.releasing || !wasConnected)
            showasReleased();
        else
            showasDisconnected();

        context.offLineMode = true;

        if (context.quickPiConnection.wasLocked()) {
            window.displayHelper.showPopupMessage(strings.messages.piPlocked, 'blanket');
        } else if (!context.releasing && !wasConnected) {
            window.displayHelper.showPopupMessage(strings.messages.cantConnect, 'blanket');
        }

        if (wasConnected && !context.releasing && !context.quickPiConnection.wasLocked()) {
            context.quickPiConnection.connect(sessionStorage.raspberryPiIpAddress);
        } else {
            // If I was never connected don't attempt to autoconnect again
            sessionStorage.autoConnect = "0";
            context.resetDisplay();
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
        if (context.sensorPollInterval) {
            clearInterval(context.sensorPollInterval);
        }

        if (context.display) {
            // Do something here
        }

        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];

            sensor.removed = true;
        }

    };

    context.findSensor = function findSensor(type, port, error=true) {
        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];

            if (sensor.type == type && sensor.port == port)
                return sensor;
        }

        if (error) {
            context.success = false;
            //context.doNotStartGrade = true;
            throw (strings.messages.sensorNotFound);
        }

        return null;
    }

    function drawTimeLine() {
        if (paper == undefined || !context.display)
            return;

        if (context.timelineText)
            for (var i = 0; i < context.timelineText.length; i++) {
                context.timelineText[i].remove();
            }

        context.timelineText = [];

        for (var i = 0; i <= context.maxTime; i += 1000) {
            var x = context.timelineStartx + (i * context.pixelsPerTime);

            var timelabel = paper.text(x, paper.height - context.sensorSize / 2, (i / 1000));

            timelabel.attr({ "font-size": "20" + "px", 'text-anchor': 'center', 'font-weight': 'bold', fill: "gray" });

            context.timelineText.push(timelabel);
            /*
                        paper.path(["M", x,
                            paper.height - context.sensorSize / 2,
                            "L", x,
                            paper.height - context.sensorSize]);*/
        }
        /*
                paper.path(["M", context.timelineStartx,
                    paper.height - context.sensorSize * 3 / 4,
                    "L", paper.width,
                    paper.height - context.sensorSize * 3 / 4]);
        */
    }

    function drawCurrentTime() {
        if (!paper || !context.display)
            return;

        var startx = context.timelineStartx + (context.currentTime * context.pixelsPerTime);

        if (context.timeLineCurrent)
            context.timeLineCurrent.remove();

        if (context.timeLineCircle)
            context.timeLineCircle.remove();

        if (context.timeLineTriangle)
            context.timeLineTriangle.remove();

        context.timeLineCurrent = paper.path(["M", startx,
            0,
            "L", startx,
            paper.height]);

        context.timeLineCurrent.attr({
            "stroke-width": 5,
            "stroke": "#678AB4",
            "stroke-linecap": "round"
        });

        var circleradius = 10;
        context.timeLineCircle = paper.circle(startx, paper.height - circleradius, 10);

        context.timeLineCircle.attr({
            "fill": "white",
            "stroke": "#678AB4"
        });

        var trianglew = 10;
        context.timeLineTriangle = paper.path(["M", startx, 0,
            "L", startx + trianglew, 0,
            "L", startx, trianglew,
            "L", startx - trianglew, 0,
            "L", startx, 0
        ]);

        context.timeLineTriangle.attr({
            "fill": "#678AB4",
            "stroke": "#678AB4"
        });

    }

    function storeTimeLineState(sensor, state, startTime, endTime, type) {
        var found = false;
        var timelinestate = {
            sensor: sensor,
            state: state,
            startTime: startTime,
            endTime: endTime,
            type: type
        };

        for (var i = 0; i < context.timeLineStates.length; i++) {
            var currenttlstate = context.timeLineStates[i];

            if (currenttlstate.sensor == sensor &&
                currenttlstate.startTime == startTime &&
                currenttlstate.endTime == endTime &&
                currenttlstate.type == type) {
                context.timeLineStates[i] = timelinestate;
                found = true;
                break;
            }
        }

        if (!found) {
            context.timeLineStates.push(timelinestate);
        }
    }


    function drawSensorTimeLineState(sensor, state, startTime, endTime, type, skipsave = false) {
        if (paper == undefined ||
            !context.display ||
            !context.autoGrading)
            return;

        if (!skipsave) {
            storeTimeLineState(sensor, state, startTime, endTime, type);
        }

        var startx = context.timelineStartx + (startTime * context.pixelsPerTime);
        var stateLenght = (endTime - startTime) * context.pixelsPerTime;

        var ypositionmiddle = ((sensor.drawInfo.y + (sensor.drawInfo.height * .5)) + (sensor.drawInfo.height * .20));

        var ypositiontop = sensor.drawInfo.y
        var ypositionbottom = sensor.drawInfo.y + sensor.drawInfo.height;

        var color = "green";
        var strokewidth = 4;
        if (type == "expected") {
            color = "lightgrey";
            strokewidth = 8;
        } else if (type == "wrong") {
            color = "red";
            strokewidth = 4;
        }
        else if (type == "actual") {
            color = "yellow";
            strokewidth = 4;
        }

        var isAnalog = findSensorDefinition(sensor).isAnalog;
        var percentage = + state;

        if (isAnalog) {
            var offset = (ypositionbottom - ypositiontop) * findSensorDefinition(sensor).getPercentageFromState(state);

            if (type == "wrong") {
                color = "red";
                ypositionmiddle += 4;
            }
            else if (type == "actual") {
                color = "yellow";
                ypositionmiddle += 4;
            }

            if (sensor.lastAnalogState != null
                && sensor.lastAnalogState != state) {
                var oldStatePercentage = findSensorDefinition(sensor).getPercentageFromState(sensor.lastAnalogState);

                var previousOffset = (ypositionbottom - ypositiontop) * oldStatePercentage;

                var joinline = paper.path(["M", startx,
                    ypositiontop + offset,
                    "L", startx,
                    ypositiontop + previousOffset]);

                joinline.attr({
                    "stroke-width": strokewidth,
                    "stroke": color,
                    "stroke-linejoin": "round",
                    "stroke-linecap": "round"
                });

                paper.text(startx + 15, ypositiontop + offset - 10, state);
            }

            sensor.lastAnalogState = state == null ? 0 : state;

            stateline = paper.path(["M", startx,
                ypositiontop + offset,
                "L", startx + stateLenght,
                ypositiontop + offset]);

            stateline.attr({
                "stroke-width": strokewidth,
                "stroke": color,
                "stroke-linejoin": "round",
                "stroke-linecap": "round"
            });
        } else if (sensor.type == "screen") {
            if (state) {
                sensor.stateBubble = paper.text(startx, ypositionmiddle + 10, '\uf27a');

                sensor.stateBubble.attr({
                    "font": "Font Awesome 5 Free",
                    "stroke": color,
                    "fill": color,
                    "font-size": (strokewidth * 2) + "px"
                });

                sensor.stateBubble.node.style.fontFamily = '"Font Awesome 5 Free"';
                sensor.stateBubble.node.style.fontWeight = "bold";

                function showPopup() {
                    if (!sensor.tooltip) {
                        sensor.tooltipText = paper.text(startx, ypositionmiddle + 50, state.line1 + "\n" + state.line2);

                        var textDimensions = sensor.tooltipText.getBBox();

                        sensor.tooltip = paper.rect(textDimensions.x - 15, textDimensions.y - 15, textDimensions.width + 30, textDimensions.height + 30);
                        sensor.tooltip.attr({
                            "stroke": "black",
                            "stroke-width": 2,
                            "fill": "white",
                        });

                        sensor.tooltipText.toFront();
                    }
                };

                sensor.stateBubble.click(showPopup);

                sensor.stateBubble.hover(showPopup, function () {
                    if (sensor.tooltip) {
                        sensor.tooltip.remove();
                        sensor.tooltip = null;
                    }
                    if (sensor.tooltipText) {
                        sensor.tooltipText.remove();
                        sensor.tooltipText = null;
                    }
                });
            }
        } else if (percentage != 0) {
            var stateline = paper.path(["M", startx,
                ypositionmiddle,
                "L", startx + stateLenght,
                ypositionmiddle]);

            stateline.attr({
                "stroke-width": strokewidth,
                "stroke": color,
                "stroke-linejoin": "round",
                "stroke-linecap": "round"
            });
        }

        if (type == "wrong") {
            /*
            wrongindicator = paper.path(["M", startx,
                             sensor.drawInfo.y,
                        "L", startx + stateLenght,
                                sensor.drawInfo.y + sensor.drawInfo.height, 
    
                        "M", startx,
                                sensor.drawInfo.y + sensor.drawInfo.height,
                        "L", startx + stateLenght,
                                   sensor.drawInfo.y
                            ]);
    
            wrongindicator.attr({
                "stroke-width": 5, "stroke" : "red", "stroke-linecap": "round" });*/
        }

        // Make sure the current time bar is always on top of states
        drawCurrentTime(sensor);
    }

    function getImg(filename) {
        // Get the path to an image stored in bebras-modules
        return (window.modulesPath ? window.modulesPath : '../../modules/') + 'img/quickpi/' + filename;
    }


    function setSlider(sensor, juststate, imgx, imgy, imgw, imgh, min, max) {
        if (juststate) {
            var percentage = findSensorDefinition(sensor).getPercentageFromState(sensor.state);

            thumby = sensor.sliderdata.insiderecty +
                sensor.sliderdata.insideheight -
                sensor.sliderdata.thumbheight -
                (percentage * sensor.sliderdata.scale);

            sensor.thumb.attr('y', thumby);

            return;
        }

        removeSlider(sensor);


        sensor.sliderdata = {};

        var actuallydragged;

        sensor.hasslider = true;
        sensor.focusrect.drag(
            function (dx, dy, x, y, event) {

                var newy = sensor.sliderdata.zero + dy;

                if (newy < sensor.sliderdata.insiderecty)
                    newy = sensor.sliderdata.insiderecty;

                if (newy > sensor.sliderdata.insiderecty + sensor.sliderdata.insideheight - sensor.sliderdata.thumbheight)
                    newy = sensor.sliderdata.insiderecty + sensor.sliderdata.insideheight - sensor.sliderdata.thumbheight;

                sensor.thumb.attr('y', newy);

                var percentage = 1 - ((newy - sensor.sliderdata.insiderecty) / sensor.sliderdata.scale);

                sensor.state = findSensorDefinition(sensor).getStateFromPercentage(percentage);
                drawSensor(sensor, sensor.state, true);

                actuallydragged++;
            },
            function (x, y, event) {

                showSlider();
                actuallydragged = 0;
                sensor.sliderdata.zero = sensor.thumb.attr('y');
            },
            function (event) {
                if (actuallydragged > 4) {
                    hideSlider(sensor);
                }
            }
        );

        function showSlider() {
            hideSlider(sensorWithSlider);
            sensorWithSlider = sensor;

            var outsiderectx = sensor.drawInfo.x;
            var outsiderecty = sensor.drawInfo.y;
            var outsidewidth = sensor.drawInfo.width / 6;
            var outsideheight = sensor.drawInfo.height;

            var insidewidth = outsidewidth / 6;
            sensor.sliderdata.insideheight = sensor.drawInfo.height * 0.60;

            var insiderectx = outsiderectx + (outsidewidth / 2) - (insidewidth / 2);
            sensor.sliderdata.insiderecty = outsiderecty + (outsideheight / 2) - (sensor.sliderdata.insideheight / 2);

            var circleradius = (outsidewidth / 2) - 1;

            var pluscirclex = outsiderectx + (outsidewidth / 2);
            var pluscircley = outsiderecty + circleradius + 1;

            var minuscirclex = pluscirclex;
            var minuscircley = outsiderecty + outsideheight - circleradius - 1;


            paper.setStart();


            sensor.sliderrect = paper.rect(outsiderectx, outsiderecty, outsidewidth, outsideheight, outsidewidth / 2);
            sensor.sliderrect.attr("fill", "#468DDF");
            sensor.sliderrect.attr("stroke", "#468DDF");

            sensor.sliderrect = paper.rect(insiderectx, sensor.sliderdata.insiderecty, insidewidth, sensor.sliderdata.insideheight, 2);
            sensor.sliderrect.attr("fill", "#2E5D94");
            sensor.sliderrect.attr("stroke", "#2E5D94");


            sensor.plusset = paper.set();

            sensor.pluscircle = paper.circle(pluscirclex, pluscircley, circleradius);
            sensor.pluscircle.attr("fill", "#F5A621");
            sensor.pluscircle.attr("stroke", "#F5A621");

            sensor.plus = paper.text(pluscirclex, pluscircley, "+");
            sensor.plus.attr({ fill: "white" });
            sensor.plus.node.style = "-moz-user-select: none; -webkit-user-select: none;";

            sensor.plusset.push(sensor.pluscircle, sensor.plus);

            sensor.plusset.click(function () {
                if (sensor.state < max)
                    sensor.state += 1;

                drawSensor(sensor, sensor.state, true);
            });


            sensor.minusset = paper.set();

            sensor.minuscircle = paper.circle(minuscirclex, minuscircley, circleradius);
            sensor.minuscircle.attr("fill", "#F5A621");
            sensor.minuscircle.attr("stroke", "#F5A621");

            sensor.minus = paper.text(minuscirclex, minuscircley, "-");
            sensor.minus.attr({ fill: "white" });
            sensor.minus.node.style = "-moz-user-select: none; -webkit-user-select: none;";

            sensor.minusset.push(sensor.minuscircle, sensor.minus);

            sensor.minusset.click(function () {
                if (sensor.state > min)
                    sensor.state -= 1;

                drawSensor(sensor, sensor.state, true);
            });


            var thumbwidth = outsidewidth * .80;
            sensor.sliderdata.thumbheight = outsidewidth * 1.4;
            sensor.sliderdata.scale = (sensor.sliderdata.insideheight - sensor.sliderdata.thumbheight);


            var percentage = findSensorDefinition(sensor).getPercentageFromState(sensor.state);


            var thumby = sensor.sliderdata.insiderecty + sensor.sliderdata.insideheight - sensor.sliderdata.thumbheight - (percentage * sensor.sliderdata.scale);

            var thumbx = insiderectx + (insidewidth / 2) - (thumbwidth / 2);

            sensor.thumb = paper.rect(thumbx, thumby, thumbwidth, sensor.sliderdata.thumbheight, outsidewidth / 2);
            sensor.thumb.attr("fill", "#F5A621");
            sensor.thumb.attr("stroke", "#F5A621");

            sensor.slider = paper.setFinish();

            sensor.thumb.drag(
                function (dx, dy, x, y, event) {

                    var newy = sensor.sliderdata.zero + dy;

                    if (newy < sensor.sliderdata.insiderecty)
                        newy = sensor.sliderdata.insiderecty;

                    if (newy > sensor.sliderdata.insiderecty + sensor.sliderdata.insideheight - sensor.sliderdata.thumbheight)
                        newy = sensor.sliderdata.insiderecty + sensor.sliderdata.insideheight - sensor.sliderdata.thumbheight;

                    sensor.thumb.attr('y', newy);

                    var percentage = 1 - ((newy - sensor.sliderdata.insiderecty) / sensor.sliderdata.scale);
                    sensor.state = findSensorDefinition(sensor).getStateFromPercentage(percentage);
                    drawSensor(sensor, sensor.state, true);


                },
                function (x, y, event) {
                    sensor.sliderdata.zero = sensor.thumb.attr('y');

                },
                function (event) {
                }
            );
        }
    }

    function removeSlider(sensor) {
        if (sensor.hasslider && sensor.focusrect) {
            sensor.focusrect.undrag();
            sensor.hasslider = false;
        }

        if (sensor.slider) {
            sensor.slider.remove();
            sensor.slider = null;
        }
    }

    function sensorInConnectedModeError() {
        window.displayHelper.showPopupMessage(strings.messages.sensorInOnlineMode, 'blanket');
    }

    function actuatorsInRunningModeError() {
        window.displayHelper.showPopupMessage(strings.messages.actuatorsWhenRunning, 'blanket');
    }


    function drawSensor(sensor, state = true, juststate = false, donotmovefocusrect = false) {
        if (paper == undefined || !context.display || !sensor.drawInfo)
            return;

        var imgw = sensor.drawInfo.width / 2;
        var imgh = sensor.drawInfo.height / 2;

        var imgx = sensor.drawInfo.x + imgw / 3;
        var imgy = sensor.drawInfo.y + (sensor.drawInfo.height / 2) - (imgh / 2);

        var state1x = imgx + (imgw / 2);
        var state1y = imgy + imgh + (imgh * .2);

        var portx = imgx + imgw;
        var porty = imgy + imgh / 3;

        var portsize = sensor.drawInfo.height * 0.10;
        var statesize = sensor.drawInfo.height * 0.08;

        if (!sensor.focusrect || !sensor.focusrect.paper.canvas)
            sensor.focusrect = paper.rect(imgx, imgy, imgw, imgh);

        sensor.focusrect.attr({
                "fill": "468DDF",
                "fill-opacity": 0,
                "opacity": 0,
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
        });

        if (context.autoGrading) {
            imgw = sensor.drawInfo.width * .80;
            imgh = sensor.drawInfo.height * .80;

            imgx = sensor.drawInfo.x + imgw * 0.75;
            imgy = sensor.drawInfo.y + (sensor.drawInfo.height / 2) - (imgh / 2);

            state1x = imgx + imgw * 1.2;
            state1y = imgy + (imgh / 2);

            portx = sensor.drawInfo.x;
            porty = imgy + (imgh / 2);

            portsize = imgh / 3;
            statesize = imgh / 2;
        }


        if (sensor.type == "led") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.ledon || !sensor.ledon.paper.canvas) {
                var imagename = "ledon-";
                if (sensor.subType)
                    imagename += sensor.subType;
                else
                    imagename += "red";

                imagename += ".png";

                sensor.ledon = paper.image(getImg(imagename), imgx, imgy, imgw, imgh);
            }

            if (!sensor.ledoff || !sensor.ledoff.paper.canvas) {
                sensor.ledoff = paper.image(getImg('ledoff.png'), imgx, imgy, imgw, imgh);

                    sensor.focusrect.click(function () {
                        if (!context.autoGrading && (!context.runner || !context.runner.isRunning())) {
                            sensor.state = !sensor.state;
                            drawSensor(sensor);
                        } else {
                            actuatorsInRunningModeError();
                        }
                    });
            }

            sensor.ledon.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            sensor.ledoff.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.state) {
                sensor.ledon.attr({ "opacity": 1 });
                sensor.ledoff.attr({ "opacity": 0 });

                sensor.stateText = paper.text(state1x, state1y, "ON");
            } else {
                sensor.ledon.attr({ "opacity": 0 });
                sensor.ledoff.attr({ "opacity": 1 });

                sensor.stateText = paper.text(state1x, state1y, "OFF");
            }


            if ((!context.runner || !context.runner.isRunning())
                && !context.offLineMode) {

                findSensorDefinition(sensor).setLiveState(sensor.port, sensor.state, function(x) {});
            }

        } else if (sensor.type == "buzzer") {
            if (!sensor.buzzeron || !sensor.buzzeron.paper.canvas)
                sensor.buzzeron = paper.image(getImg('buzzer-ringing.png'), imgx, imgy, imgw, imgh);

            if (!sensor.buzzeroff || !sensor.buzzeroff.paper.canvas) {
                sensor.buzzeroff = paper.image(getImg('buzzer.png'), imgx, imgy, imgw, imgh);

                    sensor.focusrect.click(function () {
                        if (!context.autoGrading && (!context.runner || !context.runner.isRunning())) {
                            sensor.state = !sensor.state;
                            drawSensor(sensor);
                        } else {
                            actuatorsInRunningModeError();
                        }
                    });
            }

            if (sensor.state) {
                if (!sensor.buzzerInterval) {
                    sensor.buzzerInterval = setInterval(function () {

                        if (!sensor.removed) {
                            sensor.ringingState = !sensor.ringingState;
                            drawSensor(sensor, true, false, true);
                        } else {
                            clearInterval(sensor.buzzerInterval);
                        }

                    }, 100);
                }
            } else {
                if (sensor.buzzerInterval) {
                    clearInterval(sensor.buzzerInterval);
                    sensor.buzzerInterval = null;
                    sensor.ringingState = null;
                }
            }
            sensor.buzzeron.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            sensor.buzzeroff.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            var drawState = sensor.state;
            if (sensor.ringingState != null)
                drawState = sensor.ringingState;

            if (drawState) {
                sensor.buzzeron.attr({ "opacity": 1 });
                sensor.buzzeroff.attr({ "opacity": 0 });


            } else {
                sensor.buzzeron.attr({ "opacity": 0 });
                sensor.buzzeroff.attr({ "opacity": 1 });
            }

            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.stateText = paper.text(state1x, state1y, "ON");
            } else {
                sensor.stateText = paper.text(state1x, state1y, "OFF");
            }


            if ((!context.runner || !context.runner.isRunning())
                && !context.offLineMode) {

                var setLiveState = findSensorDefinition(sensor).setLiveState;

                if (setLiveState) {
                    setLiveState(sensor.port, sensor.state, function(x) {});
                }
            }

        } else if (sensor.type == "button") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.buttonon || !sensor.buttonon.paper.canvas)
                sensor.buttonon = paper.image(getImg('buttonon.png'), imgx, imgy, imgw, imgh);

            if (!sensor.buttonoff || !sensor.buttonoff.paper.canvas)
                sensor.buttonoff = paper.image(getImg('buttonoff.png'), imgx, imgy, imgw, imgh);

            sensor.buttonon.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            sensor.buttonoff.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.state) {
                sensor.buttonon.attr({ "opacity": 1 });
                sensor.buttonoff.attr({ "opacity": 0 });

                sensor.stateText = paper.text(state1x, state1y, "ON");
            } else {
                sensor.buttonon.attr({ "opacity": 0 });
                sensor.buttonoff.attr({ "opacity": 1 });

                sensor.stateText = paper.text(state1x, state1y, "OFF");
            }

            if (!context.autoGrading && !sensor.buttonon.node.onmousedown) {
                sensor.focusrect.node.onmousedown = function () {
                    if (context.offLineMode) {
                        sensor.state = true;
                        drawSensor(sensor);
                    } else
                        sensorInConnectedModeError();
                };


                sensor.focusrect.node.onmouseup = function () {
                    if (context.offLineMode) {
                        sensor.state = false;
                        sensor.wasPressed = true;
                        drawSensor(sensor);

                        if (sensor.onPressed)
                            sensor.onPressed();
                    } else
                        sensorInConnectedModeError();
                }

                sensor.focusrect.node.ontouchstart = sensor.focusrect.node.onmousedown;
                sensor.focusrect.node.ontouchend = sensor.focusrect.node.onmouseup;
            }
        } else if (sensor.type == "screen") {
            if (sensor.stateText) {
                sensor.stateText.remove();
                sensor.stateText = null;
            }

            if (sensor.stateText2) {
                sensor.stateText2.remove();
                sensor.stateText2 = null;
            }

            imgw = sensor.drawInfo.width / 1.3;
            imgh = sensor.drawInfo.height / 1.2;

            imgx = sensor.drawInfo.x + (sensor.drawInfo.width * .05);
            imgy = sensor.drawInfo.y + (sensor.drawInfo.height / 2) - (imgh / 2);

            portx = imgx + imgw * 1.1;
            porty = imgy + imgh / 3;

            if (context.autoGrading) {
                imgw = sensor.drawInfo.width * 1.5;
                imgh = sensor.drawInfo.height * .70;

                imgx = sensor.drawInfo.x + imgw / 2;
                imgy = sensor.drawInfo.y + (sensor.drawInfo.height / 2) - (imgh / 2);

                state1x = imgx + imgw;
                state1y = imgy + (imgh / 2);

                portx = sensor.drawInfo.x;
                porty = imgy + (imgh / 2);

                portsize = imgh / 4;
                statesize = imgh / 6;
            }

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('screen.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.state) {
                var statex = imgx + (imgw * .13);

                var statey = imgy + (imgh * .4);
                var state2y = statey + (imgh * .2);

                if (sensor.state.line1.length > 16)
                    sensor.state.line1 = sensor.state.line1.substring(0, 16);

                if (sensor.state.line2.length > 16)
                    sensor.state.line2 = sensor.state.line2.substring(0, 16);

                sensor.stateText = paper.text(statex, statey, sensor.state.line1);
                sensor.stateText2 = paper.text(statex, state2y, sensor.state.line2);

                sensor.stateText.attr("")

            }
        } else if (sensor.type == "temperature") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state == null)
                sensor.state = 25; // FIXME

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('temperature-cold.png'), imgx, imgy, imgw, imgh);

            if (!sensor.img2 || !sensor.img2.paper.canvas)
                sensor.img2 = paper.image(getImg('temperature-hot.png'), imgx, imgy, imgw, imgh);

            if (!sensor.img3 || !sensor.img3.paper.canvas)
                sensor.img3 = paper.image(getImg('temperature-overlay.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            sensor.img2.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            sensor.img3.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            var scale = imgh / 60;

            var cliph = scale * sensor.state;

            sensor.img2.attr({
                "clip-rect":
                    imgx + "," +
                    (imgy + imgh - cliph) + "," +
                    (imgw) + "," +
                    cliph
            });

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "C");

            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, 0, 60);
            }
            else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }

        } else if (sensor.type == "servo") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('servo.png'), imgx, imgy, imgw, imgh);

            if (!sensor.pale || !sensor.pale.paper.canvas)
                sensor.pale = paper.image(getImg('servo-pale.png'), imgx, imgy, imgw, imgh);


            if (!sensor.center || !sensor.center.paper.canvas)
                sensor.center = paper.image(getImg('servo-center.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            sensor.pale.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "transform": ""
            });
            sensor.center.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            sensor.pale.rotate(sensor.state);

            if (sensor.state == null)
                sensor.state = 0;

            sensor.state = Math.round(sensor.state);

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "°");

            if ((!context.runner || !context.runner.isRunning())
                && !context.offLineMode) {
                if (!sensor.updatetimeout) {
                    sensor.updatetimeout = setTimeout(function () {

                        findSensorDefinition(sensor).setLiveState(sensor.port, sensor.state, function(x) {});

                        sensor.updatetimeout = null;
                    }, 100);
                }
            }

            if (!context.autoGrading &&
                (!context.runner || !context.runner.isRunning())) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, 0, 180);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }
        } else if (sensor.type == "potentiometer") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('potentiometer.png'), imgx, imgy, imgw, imgh);

            if (!sensor.pale || !sensor.pale.paper.canvas)
                sensor.pale = paper.image(getImg('potentiometer-pale.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            sensor.pale.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "transform": ""
            });

            if (sensor.state == null)
                sensor.state = 0;

            sensor.pale.rotate(sensor.state * 3.6);

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "%");

            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, 0, 100);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }

        } else if (sensor.type == "range") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('range.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.state == null)
                sensor.state = 0;

            if (sensor.rangedistance)
                sensor.rangedistance.remove();

            if (sensor.rangedistancestart)
                sensor.rangedistancestart.remove();

            if (sensor.rangedistanceend)
                sensor.rangedistanceend.remove();

            var rangew;

            if (sensor.state < 30) {
                rangew = imgw * sensor.state / 100;
            } else {
                var firstpart = imgw * 30 / 100;
                var remaining = imgw - firstpart;

                rangew = firstpart + (remaining * (sensor.state) * 0.002);
            }

            var centerx = imgx + (imgw / 2);

            sensor.rangedistance = paper.path(["M", centerx - (rangew / 2),
                imgy + imgw,
                "L", centerx + (rangew / 2),
                imgy + imgw]);

            var markh = 16;

            sensor.rangedistancestart = paper.path(["M", centerx - (rangew / 2),
                imgy + imgw - (markh / 2),
                "L", centerx - (rangew / 2),
                imgy + imgw + (markh / 2)]);

            sensor.rangedistanceend = paper.path(["M", centerx + (rangew / 2),
                imgy + imgw - (markh / 2),
                "L", centerx + (rangew / 2),
                imgy + imgw + (markh / 2)]);

            sensor.rangedistance.attr({
                "stroke-width": 4,
                "stroke": "#468DDF",
                "stroke-linecapstring": "round"
            });

            sensor.rangedistancestart.attr({
                "stroke-width": 4,
                "stroke": "#468DDF",
                "stroke-linecapstring": "round"
            });


            sensor.rangedistanceend.attr({
                "stroke-width": 4,
                "stroke": "#468DDF",
                "stroke-linecapstring": "round"
            });

            if (sensor.state >= 10)
                sensor.state = Math.round(sensor.state);

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "cm");
            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, 0, 500);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }
        } else if (sensor.type == "light") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('light.png'), imgx, imgy, imgw, imgh);

            if (!sensor.moon || !sensor.moon.paper.canvas)
                sensor.moon = paper.image(getImg('light-moon.png'), imgx, imgy, imgw, imgh);

            if (!sensor.sun || !sensor.sun.paper.canvas)
                sensor.sun = paper.image(getImg('light-sun.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.state == null)
                sensor.state = 0;

            if (sensor.state > 50) {
                var opacity = (sensor.state - 50) * 0.02;
                sensor.sun.attr({
                    "x": imgx,
                    "y": imgy,
                    "width": imgw,
                    "height": imgh,
                    "opacity": opacity * .80
                });
                sensor.moon.attr({ "opacity": 0 });
            }
            else {
                var opacity = (50 - sensor.state) * 0.02;
                sensor.moon.attr({
                    "x": imgx,
                    "y": imgy,
                    "width": imgw,
                    "height": imgh,
                    "opacity": opacity * .80
                });
                sensor.sun.attr({ "opacity": 0 });
            }

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "%");
            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, 0, 100);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }
        } else if (sensor.type == "humidity") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('humidity.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.state == null)
                sensor.state = 0;

            sensor.stateText = paper.text(state1x, state1y, sensor.state + "%");
            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, 0, 100);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }
        } else if (sensor.type == "accelerometer") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('accel.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                try {
                sensor.stateText = paper.text(state1x, state1y, "X: " + sensor.state[0] + " Y: " + sensor.state[1] + " Z: " + sensor.state[2]);
                } catch (Err)
                {
                    var a = 1;
                }
            }
        } else if (sensor.type == "gyroscope") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('gyro.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            }); 
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.stateText = paper.text(state1x, state1y, "X: " + sensor.state[0] + " Y: " + sensor.state[1] + " Z: " + sensor.state[2]);
            }
        } else if (sensor.type == "magnetometer") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('mag.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.stateText = paper.text(state1x, state1y, "X: " + sensor.state[0] + " Y: " + sensor.state[1] + " Z: " + sensor.state[2]);
            }
        } else if (sensor.type == "sound") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('sound.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.stateText = paper.text(state1x, state1y, sensor.state);
            }
        } else if (sensor.type == "irtrans") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.ledon || !sensor.ledon.paper.canvas) {
                sensor.ledon = paper.image(getImg("irtranson.png"), imgx, imgy, imgw, imgh);
            }

            if (!sensor.ledoff || !sensor.ledoff.paper.canvas) {
                sensor.ledoff = paper.image(getImg('irtransoff.png'), imgx, imgy, imgw, imgh);

                    sensor.focusrect.click(function () {
                        if (!context.autoGrading && (!context.runner || !context.runner.isRunning())) {
                            sensor.state = !sensor.state;
                            drawSensor(sensor);
                        } else {
                            actuatorsInRunningModeError();
                        }
                    });
            }

            sensor.ledon.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            sensor.ledoff.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.state) {
                sensor.ledon.attr({ "opacity": 1 });
                sensor.ledoff.attr({ "opacity": 0 });

                sensor.stateText = paper.text(state1x, state1y, "ON");
            } else {
                sensor.ledon.attr({ "opacity": 0 });
                sensor.ledoff.attr({ "opacity": 1 });

                sensor.stateText = paper.text(state1x, state1y, "OFF");
            }


            if ((!context.runner || !context.runner.isRunning())
                && !context.offLineMode) {

                findSensorDefinition(sensor).setLiveState(sensor.port, sensor.state, function(x) {});
            }
        } else if (sensor.type == "irrecv") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.buttonon || !sensor.buttonon.paper.canvas)
                sensor.buttonon = paper.image(getImg('irrecvon.png'), imgx, imgy, imgw, imgh);

            if (!sensor.buttonoff || !sensor.buttonoff.paper.canvas)
                sensor.buttonoff = paper.image(getImg('irrecvoff.png'), imgx, imgy, imgw, imgh);

            sensor.buttonon.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            sensor.buttonoff.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if (sensor.state) {
                sensor.buttonon.attr({ "opacity": 1 });
                sensor.buttonoff.attr({ "opacity": 0 });

                sensor.stateText = paper.text(state1x, state1y, "ON");
            } else {
                sensor.buttonon.attr({ "opacity": 0 });
                sensor.buttonoff.attr({ "opacity": 1 });

                sensor.stateText = paper.text(state1x, state1y, "OFF");
            }
        } else if (sensor.type == "stick") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('stick.png'), imgx, imgy, imgw, imgh);
                
            if (!sensor.imgup || !sensor.imgup.paper.canvas)
                sensor.imgup = paper.image(getImg('stickup.png'), imgx, imgy, imgw, imgh);

            if (!sensor.imgdown || !sensor.imgdown.paper.canvas)
                sensor.imgdown = paper.image(getImg('stickdown.png'), imgx, imgy, imgw, imgh);

            if (!sensor.imgleft || !sensor.imgleft.paper.canvas)
                sensor.imgleft = paper.image(getImg('stickleft.png'), imgx, imgy, imgw, imgh);

            if (!sensor.imgright || !sensor.imgright.paper.canvas)
                sensor.imgright = paper.image(getImg('stickright.png'), imgx, imgy, imgw, imgh);

            if (!sensor.imgcenter || !sensor.imgcenter.paper.canvas)
                sensor.imgcenter = paper.image(getImg('stickcenter.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });
            
            sensor.imgup.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": 0,
            });
            sensor.imgdown.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": 0,
            });
            sensor.imgleft.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": 0,
            });
            sensor.imgright.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": 0,
            });            
            sensor.imgcenter.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": 0,
            });

            if (sensor.stateText)
               sensor.stateText.remove();

            if (sensor.state) {
                var stateString = "";

                if (sensor.state[0]) {
                    stateString += "UP"
                    sensor.imgup.attr({ "opacity": 1 });
                }
                if (sensor.state[1]) {
                    stateString += "DOWN"
                    sensor.imgdown.attr({ "opacity": 1 });
                }
                if (sensor.state[2]) {
                    stateString += "LEFT"
                    sensor.imgleft.attr({ "opacity": 1 });
                }
                if (sensor.state[3]) {
                    stateString += "RIGHT"
                    sensor.imgright.attr({ "opacity": 1 });
                }
                if (sensor.state[4]) {
                    stateString += "CENTER"
                    sensor.imgcenter.attr({ "opacity": 1 });
                }

                sensor.stateText = paper.text(state1x, state1y, stateString);
            } else {
                sensor.state = [false, false, false, false, false];
            }

            function poinInRect(rect, x, y) {

                if (x > rect.left && x < rect.right && y > rect.top  && y < rect.bottom) 
                    return true; 
          
                return false; 
            }

            function moveRect(rect, x, y) {
                rect.left += x;
                rect.right += x;

                rect.top += y;
                rect.bottom += y;
            }

            sensor.focusrect.node.onmousedown = function(evt) {
                if (!context.offLineMode) {
                    sensorInConnectedModeError();
                    return;
                }

                var e = evt.target;
                var dim = e.getBoundingClientRect();
                var rectsize = dim.width * .30;


                var rect = {
                    left: dim.left,
                    right: dim.left + rectsize,
                    top: dim.top,
                    bottom: dim.top + rectsize,    
                }

                // Up left
                if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[0] = true;
                    sensor.state[2] = true;
                }

                // Up
                 moveRect(rect, rectsize, 0);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[0] = true;
                 }

                 // Up right
                 moveRect(rect, rectsize, 0);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[0] = true;
                    sensor.state[3] = true;
                 }

                 // Right
                 moveRect(rect, 0, rectsize);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[3] = true;
                 }

                 // Center
                 moveRect(rect, -rectsize, 0);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[4] = true;
                 }

                 // Left
                 moveRect(rect, -rectsize, 0);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[2] = true;
                 }

                 // Down left
                 moveRect(rect, 0, rectsize);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[1] = true;
                    sensor.state[2] = true;
                 }

                 // Down
                 moveRect(rect, rectsize, 0);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[1] = true;
                 }

                 // Down right
                 moveRect(rect, rectsize, 0);
                 if (poinInRect(rect, evt.clientX, evt.clientY)) {
                    sensor.state[1] = true;
                    sensor.state[3] = true;
                 }

                 drawSensor(sensor);
            }

            sensor.focusrect.node.onmouseup = function(evt) {
                if (!context.offLineMode) {
                    sensorInConnectedModeError();
                    return;
                }

                sensor.state = [false, false, false, false, false];
                drawSensor(sensor);
            }

            sensor.focusrect.node.ontouchstart = sensor.focusrect.node.onmousedown;
            sensor.focusrect.node.ontouchend = sensor.focusrect.node.onmouseup;
        }


        sensor.focusrect.mousedown(function () {
            if (infos.customSensors && !context.autoGrading) {
                if (context.removerect) {
                    context.removerect.remove();
                }

                if (!context.runner || !context.runner.isRunning()) {
                context.removerect = paper.text(portx, imgy, "\uf00d"); // fa-times char
                removeRect = context.removerect;
                sensorWithRemoveRect = sensor;

                context.removerect.attr({
                    "font-size": "30" + "px",
                    fill: "lightgray",
                    "font-family": "Font Awesome 5 Free",
                    'text-anchor': 'start',
                    "x": portx,
                    "y": imgy,
                });

                context.removerect.node.style = "-moz-user-select: none; -webkit-user-select: none;";
                context.removerect.node.style.fontFamily = '"Font Awesome 5 Free"';
                context.removerect.node.style.fontWeight = "bold";


                context.removerect.click(function (element) {

                    window.displayHelper.showPopupMessage(strings.messages.removeConfirmation,
                        'blanket',
                        strings.messages.remove,
                        function () {
                            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                                if (infos.quickPiSensors[i] === sensor) {
                                    sensor.removed = true;
                                    infos.quickPiSensors.splice(i, 1);
                                }
                            }
                            context.resetDisplay();
                        },
                        strings.messages.keep);
                });
            }
            }
        });

        if (sensor.portText)
            sensor.portText.remove();

        if (sensor.stateText) {
            sensor.stateText.attr({ "font-size": statesize + "px", 'text-anchor': 'middle', 'font-weight': 'bold', fill: "gray" });
            try {
            sensor.stateText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
            } catch (err) {
                var a = 1;
            }
        }

        if (sensor.stateText2) {
            sensor.stateText2.attr({ "font-size": statesize + "px", 'text-anchor': 'start', 'font-weight': 'bold', fill: "gray" });
            sensor.stateText2.node.style = "-moz-user-select: none; -webkit-user-select: none;";
        }


        sensor.portText = paper.text(portx, porty, sensor.port);
        sensor.portText.attr({ "font-size": portsize + "px", 'text-anchor': 'start', fill: "gray" });
        sensor.portText.node.style = "-moz-user-select: none; -webkit-user-select: none;";

        if (sensor.nameText) {
            sensor.nameText.remove();
        }


        if (sensor.name) {
            sensor.nameText = paper.text(portx, porty - 20, sensor.name);
            sensor.nameText.attr({ "font-size": portsize + "px", 'text-anchor': 'start', fill: "gray" });
            sensor.nameText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
        }


        if (!donotmovefocusrect) {
            // This needs to be in front of everything
            sensor.focusrect.toFront();
        }

    }


    context.registerQuickPiEvent = function (sensorType, port, newState, setInSensor = true) {
        var sensor = context.findSensor(sensorType, port);
        if (!sensor) {
            context.success = false;
            context.doNotStartGrade = true;
            throw (strings.messages.sensorNotFound);
        }

        if (setInSensor) {
            sensor.state = newState;
            drawSensor(sensor);
        }

        if (context.autoGrading && context.gradingStatesBySensor != undefined) {
            var fail = false;
            var type = "actual";
            var expectedState = context.getSensorExpectedState(sensorType, port);

            if (expectedState != null)
                expectedState.hit = true;

            if (sensor.lastStateChange == null) {
                sensor.lastStateChange = 0;
                sensor.lastState = 0;
            }

            drawSensorTimeLineState(sensor, sensor.lastState, sensor.lastStateChange, context.currentTime, type);

            if (context.currentTime >= context.maxTime) {
                context.success = true;
                context.doNotStartGrade = false;
                throw (strings.messages.testSuccess);
            }
            else if (expectedState != null &&
                !findSensorDefinition(sensor).compareState(expectedState.state, newState)) {
                type = "wrong";
                fail = true;

                drawSensorTimeLineState(sensor, newState, context.currentTime, context.currentTime + 100, type);
            }

            sensor.lastStateChange = context.currentTime;
            sensor.lastState = newState;

            if (fail) {
                context.success = false;
                context.doNotStartGrade = false;
                throw (strings.messages.wrongState);
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
        var sensorStates = context.gradingStatesBySensor[key];

        if (!sensorStates)
            return; // Fail??

        var lastState;
        var startTime = -1;
        for (var i = 0; i < sensorStates.length; i++) {
            if (startTime >= 0) {
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
        if (state == null && context.currentTime >= startTime) {
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

        var sensor = context.findSensor(sensorType, port);
        if (!sensor) {
            context.success = false;
            context.doNotStartGrade = true;
            throw (strings.messages.sensorNotFound);
        }

        if (state == null) {
            state = sensor.state;
        }
        else {
            sensor.state = state;
            drawSensor(sensor);
        }

        if (sensor.lastStateChange == null) {
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
    context.advanceToNextRelease = function (sensorType, port) {
        var retval = false;
        var iStates = 0;

        // Advance until current time, ignore everything in the past.
        while (context.gradingStatesByTime[iStates].time <= context.currentTime)
            iStates++;

        for (; iStates < context.gradingStatesByTime.length; iStates++) {
            sensorState = context.gradingStatesByTime[iStates];

            if (sensorState.type == sensorType &&
                sensorState.port == port) {

                sensorState.hit = true;
                if (!sensorState.state) {
                    context.currentTime = sensorState.time;
                    retval = true;
                    break;
                }
            }
            else {
                retval = false;
                break;
            }
        }

        return retval;
    };

    context.normalizePort = function(port, preferedtype) {
        var newPort = port;
        if (typeof port === 'string')
        {
            newPort = port.toUpperCase();

            if (newPort != "I2C") {
                if (newPort[0] != 'D' && newPort[0] != 'A') {
                    newPort = preferedtype + newPort;
                }
            }
        }
        else
        {
            if (preferedtype)
                newPort = preferedtype + port;
        }

        return newPort;
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
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("turnLedOn()", cb);
        }
    };

    context.quickpi.turnLedOff = function (callback) {
        context.registerQuickPiEvent("led", "D5", false);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("turnLedOff()", cb);
        }
    };

    context.quickpi.waitForButton = function (callback) {
        //        context.registerQuickPiEvent("button", "D22", "wait", false);

        if (!context.display || context.autoGrading) {

            context.advanceToNextRelease("button", "D22");

            context.waitDelay(callback);
        } else if (context.offLineMode) {
            button = context.findSensor("button", "D22");
            if (button) {
                var cb = context.runner.waitCallback(callback);
                button.onPressed = function () {
                    cb();
                }
            } else {
                context.waitDelay(callback);
            }
        }
        else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("waitForButton(22)", cb);
        }
    };

    context.quickpi.buttonState = function (callback) {

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("button", "D22");

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);
            var button = context.findSensor("button", "D22");

            findSensorDefinition(button).getLiveState("D22", function(returnVal) {
                button.state = returnVal != "0";
                drawSensor(button);
                cb(returnVal != "0");
            });
        }
    };

    context.quickpi.buttonStateInPort = function (name, callback) {

        var sensor = findSensorByName(name);

        if (!context.display || context.autoGrading || context.offLineMode) {

            if (sensor.type == "stick") {
                var state = context.getSensorState("stick", sensor.port);
                var stickDefinition = findSensorDefinition(sensor);
                var buttonstate = stickDefinition.getButtonState(name, sensor.state);


                context.runner.noDelay(callback, buttonstate);
            } else {
                var state = context.getSensorState("button", sensor.port);

                context.runner.noDelay(callback, state);
            }
        } else {
            var cb = context.runner.waitCallback(callback);

            if (sensor.type == "stick") {
                var stickDefinition = findSensorDefinition(sensor);

                stickDefinition.getLiveState(sensor.port, function(returnVal) {
                    sensor.state = returnVal;
                    drawSensor(sensor);

                    var buttonstate = stickDefinition.getButtonState(name, sensor.state);

                    cb(buttonstate);
                });

            } else {
                findSensorDefinition(sensor).getLiveState(sensor.port, function(returnVal) {
                    sensor.state = returnVal;
                    drawSensor(sensor);
                    cb(returnVal);
                });
            }
        }
    };


    context.quickpi.toggleLedState = function (port, callback) {
        port = context.normalizePort(port, "D");

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("button", port);

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("toggleLedState(\"" + port + "\")", function (returnVal) {
                cb(returnVal != "0");
            });
        }
    };


    context.quickpi.buttonWasPressed = function (port, callback) {
        port = context.normalizePort(port, "D");

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("button", port);

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);
            context.quickPiConnection.sendCommand("buttonWasPressed(\"" + port + "\")", function (returnVal) {
                cb(returnVal != "0");
            });
        }

    };

    context.quickpi.changeLedState = function (port, state, callback) {
        port = context.normalizePort(port, "D");

        var command = "changeLedState(\"" + port + "\"," + (state ? "True" : "False") + ")";

        context.registerQuickPiEvent("led", port, state ? true : false);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, cb);
        }
    };

    context.quickpi.setBuzzerState = function (port, state, callback) {
        port = context.normalizePort(port, "D");

        var command = "setBuzzerState(\"" + port + "\"," + (state ? "True" : "False") + ")";

        context.registerQuickPiEvent("buzzer", port, state ? true : false);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, cb);
        }
    };



    context.quickpi.toggleLedState = function (port, callback) {
        port = context.normalizePort(port, "D");

        var command = "toggleLedState(\"" + port + "\")";
        var state = context.getSensorState("led", port);

        context.registerQuickPiEvent("led", port, !state);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, cb);
        }
    };

    context.quickpi.displayText = function (line1, line2, callback) {
        var command = "displayText(\"" + line1 + "\", \"" + line2 + "\")";

        context.registerQuickPiEvent("screen", "i2c",
            {
                line1: line1,
                line2: line2
            }
        );

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };

    context.quickpi.readTemperature = function (port, callback) {
        port = context.normalizePort(port, "A");

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("temperature", port);

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("temperature", port);
            
            findSensorDefinition(sensor).getLiveState(port, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    context.quickpi.sleep = function (time, callback) {
        if (!context.display || context.autoGrading) {
            context.currentTime += time;
            context.runner.noDelay(callback);
        }
        else {
            context.runner.waitDelay(callback, null, time);
        }
    };


    context.quickpi.setServoAngle = function (port, angle, callback) {
        if (angle > 180)
            angle = 180;
        else if (angle < 0)
            angle = 0;

        port = context.normalizePort(port, "D");

        context.registerQuickPiEvent("servo", port, angle);
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var command = "setServoAngle(\"" + port + "\"," + angle + ")";
            cb = context.runner.waitCallback(callback);
            context.quickPiConnection.sendCommand(command, cb);
        }
    };


    context.quickpi.readRotaryAngle = function (port, callback) {
        port = context.normalizePort(port, "A");

        if (!context.display || context.autoGrading || context.offLineMode) {

            var state = context.getSensorState("potentiometer", port);
            context.waitDelay(callback, state);
        } else {

            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("potentiometer", port);

            findSensorDefinition(sensor).getLiveState(port, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };


    context.quickpi.readDistance = function (port, callback) {
        port = context.normalizePort(port, "D");

        if (!context.display || context.autoGrading || context.offLineMode) {

            var state = context.getSensorState("range", port);
            context.waitDelay(callback, state);
        } else {

            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("range", port);

            findSensorDefinition(sensor).getLiveState(port, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };



    context.quickpi.readLightIntensity = function (port, callback) {
        port = context.normalizePort(port, "A");

        if (!context.display || context.autoGrading || context.offLineMode) {

            var state = context.getSensorState("light", port);
            context.waitDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("light", port);

            findSensorDefinition(sensor).getLiveState(port, function(returnVal) {
                sensor.state = returnVal;

                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    context.quickpi.readHumidity = function (port, callback) {
        port = context.normalizePort(port, "D");

        if (!context.display || context.autoGrading || context.offLineMode) {

            var state = context.getSensorState("humidity", port);
            context.waitDelay(callback, state);
        } else {

            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("humidity", port);

            findSensorDefinition(sensor).getLiveState(port, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    context.quickpi.currentTime = function (callback) {
        var millis = new Date().getTime();

        if (context.autoGrading) {
            millis = context.currentTime;
        }

        context.runner.waitDelay(callback, millis);
    };

    context.quickpi.getTemperature = function(location, callback) {
        var retVal =  25;

        context.waitDelay(callback, retVal);
    };


    context.quickpi.plotPixel = function(x, y, callback) {
        /*
        context.registerQuickPiEvent("screen", "i2c",
            {
                line1: line1,
                line2: line2
            }
        );
            FIXME
        */

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "plotPixel(" + x + "," + y + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };

    context.quickpi.unplotPixel = function(x, y, callback) {
        /*
        context.registerQuickPiEvent("screen", "i2c",
            {
                line1: line1,
                line2: line2
            }
        );
            FIXME
        */

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "unplotPixel(" + x + "," + y + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.drawLine = function(x0, y0, x1, y1, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "drawLine(" + x0 + "," + y0 + "," + x1 + "," + y1 + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.drawRectangle = function(x0, y0, x1, y1, fill, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);
            var fillstring = "False";
            if (fill)
                fillstring = "True";

            var command = "drawRectangle(" + x0 + "," + y0 + "," + x1 + "," + y1 + "," + fillstring + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };
    
    context.quickpi.drawCircle = function(x0, y0, radius, fill, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);
            var fillstring = "False";
            if (fill)
                fillstring = "True";

            var command = "drawCircle(" + x0 + "," + y0 + "," + radius + "," + fillstring + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.clearScreen = function(callback) {
        /*
        context.registerQuickPiEvent("screen", "i2c",
            {
                line1: line1,
                line2: line2
            }
        );
            FIXME
        */

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "clearScreen()";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };

    context.quickpi.readAcceleration = function(axis, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "readAcceleration(\"" + axis + "\")";
            context.quickPiConnection.sendCommand(command, function (returnVal) {
                cb(returnVal);
            });
        }
    };

    context.quickpi.computeRotation = function(rotationType, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);
            var command = "computeRotation(\"" + rotationType + "\")";

            context.quickPiConnection.sendCommand(command, function (returnVal) {
                cb(returnVal);
            });
        }
    };


    context.quickpi.readSoundLevel = function (port, callback) {
        port = context.normalizePort(port, "A");

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("sound", port);

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("sound", port);
            
            findSensorDefinition(sensor).getLiveState(port, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    context.quickpi.readMagneticForce = function (axis, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("magnetometer", "i2c");

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("magnetometer", "i2c");
            
            findSensorDefinition(sensor).getLiveState(axis, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
            
        }
    };

    context.quickpi.computeCompassHeading = function (rotationType, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("magnetometer", "i2c");

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("magnetometer", "i2c");
            
            findSensorDefinition(sensor).getLiveState(function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    
    context.quickpi.readInfraredState = function (port, callback) {

        port = context.normalizePort(port, "D");

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("irrecv", port);

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("irrecv", port);
            
            findSensorDefinition(sensor).getLiveState(port, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    context.quickpi.setInfraredState = function (port, state, callback) {
        port = context.normalizePort(port, "D");

        context.registerQuickPiEvent("irtrans", port, state ? true : false);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("irtrans", port);
            
            findSensorDefinition(sensor).setLiveState(port, state, cb);

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

    function getSensorPorts(sensorType)
    {
        return function () {
            var ports = [];
            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                var sensor = infos.quickPiSensors[i];

                if (sensor.type == sensorType) {
                    ports.push([sensor.port, sensor.port]);
                }
            }

            if (sensorType == "button") {
                for (var i = 0; i < infos.quickPiSensors.length; i++) {
                    var sensor = infos.quickPiSensors[i];
    
                    if (sensor.type == "stick") {
                        var stickDefinition = findSensorDefinition(sensor);

                        for (var iStick = 0; iStick < stickDefinition.gpiosNames.length; iStick++) {
                            var name = sensor.name + " " + stickDefinition.gpiosNames[iStick];

                            ports.push([name, name]);
                        }
                    }
                }                
            }

            if (ports.length == 0) {
                ports.push(["none", "none"]);
            }

            return ports;
        }
    }
    

    function getSensorNames(sensorType)
    {
        return function () {
            var ports = [];
            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                var sensor = infos.quickPiSensors[i];

                if (sensor.type == sensorType) {
                    ports.push([sensor.name, sensor.name]);
                }
            }

            if (sensorType == "button") {
                for (var i = 0; i < infos.quickPiSensors.length; i++) {
                    var sensor = infos.quickPiSensors[i];
    
                    if (sensor.type == "stick") {
                        var stickDefinition = findSensorDefinition(sensor);

                        for (var iStick = 0; iStick < stickDefinition.gpiosNames.length; iStick++) {
                            var name = sensor.name + " " + stickDefinition.gpiosNames[iStick];

                            ports.push([name, name]);
                        }
                    }
                }                
            }

            if (ports.length == 0) {
                ports.push(["none", "none"]);
            }

            return ports;
        }
    }
    

    function findSensorByName(name) {
        var firstname = name.split(" ")[0];

        for (var i = 0; i < infos.quickPiSensors.length; i++) {

            var sensor = infos.quickPiSensors[i];

            if (sensor.name == firstname) {
                return sensor;
            }
        }
        return null;
    }

    


    function getSensorSuggestedName(type, suggested) {
        if (suggested) {
            if (!findSensorByName(suggested))
                return suggested;
        }

        var i = 0;
        var newName;

        do {
            i++;
            newname = type + i.toString();
        } while (findSensorByName(newName));

        return newName;
    }
    

    context.customBlocks = {
        // Define our blocks for our namespace "template"
        quickpi: {
            // Categories are reflected in the Blockly menu
            sensors: [
                { name: "buttonState", yieldsValue: true },
                { name: "currentTime", yieldsValue: true },

                { name: "waitForButton" },
                {
                    name: "buttonStateInPort", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("button")
                            }
                        ]
                    }
                },
                {
                    name: "buttonWasPressed", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorPorts("button")
                            }
                        ]
                    }
                },
                {
                    name: "readTemperature", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorPorts("temperature")
                            }
                        ]
                    }
                },
                {
                    name: "readRotaryAngle", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorPorts("potentiometer")
                            }
                        ]
                    }
                },
                {
                    name: "readDistance", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorPorts("range")
                            }
                        ]
                    }
                },
                {
                    name: "readLightIntensity", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorPorts("light")
                            }
                        ]
                    }
                },
                {
                    name: "readHumidity", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorPorts("humidity")
                            }
                        ]
                    }
                },
                {
                    name: "readAcceleration", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": [["x", "x"], ["y", "y"], ["z", "z"] ]
                            }
                        ]
                    }
                },
                {
                    name: "computeRotation", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": [["pitch", "pitch"], ["roll", "roll"]]
                            }
                        ]
                    }
                },
                {
                    name: "readSoundLevel", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorPorts("sound")
                            }
                        ]
                    }
                },
                {
                    name: "readMagneticForce", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": [["x", "x"], ["y", "y"], ["z", "z"] ]
                            }
                        ]
                    }
                },
                {
                    name: "computeCompassHeading", yieldsValue: true
                },
                {
                    name: "readInfraredState", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorPorts("irrecv")
                            }
                        ]
                    }
                },

            ],
            actions: [
                { name: "turnLedOn" },
                { name: "turnLedOff" },
                {
                    name: "changeLedState", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorPorts("led")
                            },
                            { "type": "field_dropdown", "name": "PARAM_1", "options": [["ON", "1"], ["OFF", "0"]] },
                        ]
                    }
                },
                {
                    name: "setBuzzerState", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorPorts("buzzer")
                            },
                            { "type": "field_dropdown", "name": "PARAM_1", "options": [["ON", "1"], ["OFF", "0"]] },
                        ]
                    }
                },
                {
                    name: "toggleLedState", params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorPorts("led")
                            },
                        ]
                    }
                },

                {
                    name: "setServoAngle", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorPorts("servo")
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
                    name: "plotPixel", params: ["Number", "Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                            { "type": "input_value", "name": "PARAM_1"},
                        ]
                    },
                    blocklyXml: "<block type='plotPixel'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "unplotPixel", params: ["Number", "Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                            { "type": "input_value", "name": "PARAM_1"},
                        ]
                    },
                    blocklyXml: "<block type='unplotPixel'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "drawLine", params: ["Number", "Number", "Number", "Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                            { "type": "input_value", "name": "PARAM_1"},
                            { "type": "input_value", "name": "PARAM_2"},
                            { "type": "input_value", "name": "PARAM_3"},
                        ]
                    },
                    blocklyXml: "<block type='drawLine'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_2'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_3'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "drawRectangle", params: ["Number", "Number", "Number", "Number", "Boolean"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                            { "type": "input_value", "name": "PARAM_1"},
                            { "type": "input_value", "name": "PARAM_2"},
                            { "type": "input_value", "name": "PARAM_3"},
                            { "type": "input_value", "name": "PARAM_4"},
                        ]
                    },
                    blocklyXml: "<block type='drawRectangle'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_2'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_3'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_4'><shadow type='logic_boolean'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "drawCircle", params: ["Number", "Number", "Number", "Boolean"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                            { "type": "input_value", "name": "PARAM_1"},
                            { "type": "input_value", "name": "PARAM_2"},
                            { "type": "input_value", "name": "PARAM_3"},
                        ]
                    },
                    blocklyXml: "<block type='drawCircle'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_2'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_3'><shadow type='logic_boolean'></shadow></value>" +
                        "</block>"
                },

                {
                    name: "clearScreen"
                },
                {
                    name: "sleep", params: ["Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0", "value": 0 },
                        ]
                    }
                    ,
                    blocklyXml: "<block type='sleep'>" +
                        "<value name='PARAM_0'><shadow type='math_number'><field name='NUM'>1000</field></shadow></value>" +
                        "</block>"
                },
                {
                    name: "setInfraredState", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {"type": "field_dropdown", "name": "PARAM_0", "options": getSensorPorts("irtrans")},
                            { "type": "field_dropdown", "name": "PARAM_1", "options": [["ON", "1"], ["OFF", "0"]] },
                        ]
                    }
                },
            ],
            internet: [
                {
                    name: "getTemperature", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            { "type": "field_input", "name": "PARAM_0", text: "Paris, France"},
                        ]
                    },
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
                sensors: 100,
                internet: 200,
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

var sensorWithSlider = null;
var removeRect = null;
var sensorWithRemoveRect = null;

window.addEventListener('click', function (e) {
    var keep = false;
    var keepremove = false;
    e = e || window.event;
    var target = e.target || e.srcElement;

    if (sensorWithRemoveRect && sensorWithRemoveRect.focusrect && target == sensorWithRemoveRect.focusrect.node)
        keepremove = true;

    if (removeRect && !keepremove) {
        removeRect.remove();
        removeRect = null;
    }

    if (sensorWithSlider && sensorWithSlider.focusrect && target == sensorWithSlider.focusrect.node)
        keep = true;

    if (sensorWithSlider && sensorWithSlider.slider) {
        sensorWithSlider.slider.forEach(function (element) {
            if (target == element.node ||
                target.parentNode == element.node) {
                keep = true;
                return false;
            }
        });
    }

    if (!keep) {
        hideSlider(sensorWithSlider);
    }

}, false);//<-- we'll get to the false in a minute


function hideSlider(sensor) {
    if (!sensor)
        return;

    if (sensor.slider) {
        sensor.slider.remove();
        sensor.slider = null;
    }

    if (sensor.focusrect && sensor.focusrect.paper && sensor.focusrect.paper.canvas)
        sensor.focusrect.toFront();
};
