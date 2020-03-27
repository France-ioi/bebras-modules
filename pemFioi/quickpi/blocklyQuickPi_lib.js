//"use strict";
var buzzerSound = {
    context: null,
    default_freq: 1000,
    current_freq: null,
    channels: {},

    getContext: function() {
        if(!this.context) {
            this.context = ('AudioContext' in window) || ('webkitAudioContext' in window) ? new(window.AudioContext || window.webkitAudioContext)() : null;
        }
        return this.context;
    },

    start: function(channel, freq=this.default_freq) {
        if(this.channels[channel] && this.channels[channel].frequency.value == freq) {
            return;
        }
        var context = this.getContext();
        if(!context) {
            return;
        }
        this.stop(channel);

        if (freq > 0) {
            var o = context.createOscillator();
            o.type = 'sine';
            o.frequency.value = freq;
            o.connect(context.destination);
            o.start();
            this.channels[channel] = o;
        }
    },

    stop: function(channel) {
        this.channels[channel] && this.channels[channel].stop();
        delete this.channels[channel];
    },

    stopAll: function() {
        for(var channel in this.channels) {
            if(this.channels.hasOwnProperty(channel)) {
                this.stop(channel);
            }
        }
        this.current_freq = null;
    }
}

// This is a template of library for use with quickAlgo.
var getContext = function (display, infos, curLevel) {

    window.quickAlgoInterface.stepDelayMin = 0.0001;

    // Local language strings for each language
    var introControls = null;
    var localLanguageStrings = {
        fr: { // French strings
            label: {
                // Labels for the blocks
                sleep: "Attendre %1 millisecondes",
                currentTime: "temps écoulé en millisecondes",

                turnLedOn: "Allumer la LED",
                turnLedOff: "Éteindre la LED",
                isLedOn: "LED allumée",
                setLedBrightness: "Set LED %1 brightness %2",
                getLedBrightness: "Get LED brightness %1",
                setLedState: "Passer la LED %1 à %2 ",
                getLedState: "état de la LED %1",
                toggleLedState: "Inverser la LED %1",

                turnBuzzerOn: "Allumer le buzzer",
                turnBuzzerOff: "Éteindre le buzzer",
                isBuzzerOn: "buzzer allumé",
                setBuzzerState: "mettre le buzzer %1 à %2",
                getBuzzerState: "buzzer %1 allumé",
                setBuzzerNote: "Jouer la fréquence %2 sur le buzzer %1",
                getBuzzerNote: "fréquence du buzzer %1",

                buttonState: "bouton enfoncé",
                buttonStateInPort: "bouton  %1 enfoncé",
                waitForButton: "Attendre une pression sur le bouton",
                buttonWasPressed: "Le bouton a été enfoncé",

                displayText: "Afficher à l'écran %1 Ligne 1: %2 Ligne 2: %3",

                readTemperature: "température ambiante",
                getTemperature: "temperature du capteur %1",

                readRotaryAngle: "état du potentiomètre",
                readDistance: "mesure du capteur de distance",
                readLightIntensity: "intensité lumineuse",
                readHumidity: "humidité ambiante",

                setServoAngle: "Mettre le servo %1 à l'angle %2",
                getServoAngle: "angle du servo %1",


                drawPoint: "Draw pixel",
                drawLine: "Draw Line (x₀,y₀) %1 %2 (x₁,y₁) %3  %4",
                drawRectangle: "Draw Rectangle (x₀,y₀) %1 %2 (width,height) %3  %4",
                drawCircle: "Draw circle (x₀,y₀) %1 %2 Diameter %3",
                clearScreen: "Clear entiere screen",
                updateScreen: "Update drawins to the screen",
                autoUpdate: "Screen autoupdate mode",

                fill: "Set fill color",
                noFill: "Do not fill shapes",
                stroke: "Set stroke color",
                noStroke: "Do not stroke",

                readAcceleration: "Read acceleration (m/s²)",
                computeRotation: "Compute rotation from accelerometer (°) %1",
                readSoundLevel: "Read sound intensity",

                readMagneticForce: "Read Magnetic Force (µT) %1",
                computeCompassHeading: "Compute Compass Heading (°)",

                readInfraredState: "Read Infrared Receiver State %1",
                setInfraredState: "Set Infrared transmiter State %1",

                // Gyroscope
                readAngularVelocity: "Read angular velocity (°/s) %1",
                setGyroZeroAngle: "Set the gyroscope zero point",
                computeRotationGyro: "Compute rotation in the gyroscope %1",
            },
            code: {
                // Names of the functions in Python, or Blockly translated in JavaScript
                turnLedOn: "turnLedOn",
                turnLedOff: "turnLedOff",
                buttonState: "buttonState",
                buttonStateInPort : "buttonStateInPort",
                waitForButton: "waitForButton",
                buttonWasPressed: "buttonWasPressed",
                setLedState: "setLedState",
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
                setBuzzerNote: "setBuzzerNote",
                getBuzzerState: "getBuzzerState",
                getTemperature: "getTemperature",

                isLedOn: "isLedOn",
                getLedState: "getLedState",

                setBuzzerNote: "setBuzzerNote",
                getBuzzerNote: "getBuzzerNote",
                setLedBrightness: "setLedBrightness",
                getLedBrightness: "getLedBrightness",
                getServoAngle: "getServoAngle",

                turnBuzzerOn: "turnBuzzerOn",
                turnBuzzerOff: "turnBuzzerOff",
                isBuzzerOn: "isBuzzerOn",


                drawPoint: "drawPoint",
                drawLine: "drawLine",
                drawRectangle: "drawRectangle",
                drawCircle: "drawCircle",
                clearScreen: "clearScreen",
                updateScreen: "updateScreen",
                autoUpdate: "autoUpdate",

                fill: "fill",
                noFill: "noFill",
                stroke: "stroke",
                noStroke: "noStroke",


                readAcceleration: "readAcceleration",
                computeRotation: "computeRotation",

                readSoundLevel: "readSoundLevel",


                readMagneticForce: "readMagneticForce",
                computeCompassHeading: "computeCompassHeading",

                readInfraredState: "readInfraredState",
                setInfraredState: "setInfraredState",


                // Gyroscope
                readAngularVelocity: "readAngularVelocity",
                setGyroZeroAngle: "setGyroZeroAngle",
                computeRotationGyro: "computeRotationGyro",

            },
            description: {
                // Descriptions of the functions in Python (optional)
                turnLedOn: "turnLedOn(): Turns on a light connected to Raspberry",
                turnLedOff: "turnLedOff(): Turns off a light connected to Raspberry",
                buttonState: "buttonState(): Returns the state of a button, Pressed means True and not pressed means False",
                buttonStateInPort: "buttonStateInPort(button): Returns the state of a button, Pressed means True and not pressed means False",
                waitForButton: "waitForButton(button): Stops program execution until a button is pressed",
                buttonWasPressed: "buttonWasPressed(button): Returns true if the button has been pressed and will clear the value",
                setLedState: "setLedState(led, state): Change led state in the given port",
                toggleLedState: "toggleLedState(led): Toggles the led state",
                displayText: "displayText(screen, line1, line2): Display text in LCD screen",
                readTemperature: "readTemperature(thermometer): Read Ambient temperature",
                sleep: "sleep(milliseconds): pause program execute for a number of seconds",
                setServoAngle: "setServoAngle(servo, angle): Set servo motor to an specified angle",
                readRotaryAngle: "readRotaryAngle(potentiometer): Read state of potentiometer",
                readDistance: "readDistance(distanceSensor): Lire la mesure de distance",
                readLightIntensity: "readLightIntensity(lightSensor): Lire l'intensité lumineuse",
                readHumidity: "readHumidity(hygrometer): lire l'humidité ambiante",
                currentTime: "currentTime(milliseconds): Temps actuel en millisecondes",
                setBuzzerState: "setBuzzerState(buzzer, state): sonnerie",
				setBuzzerNote: "setBuzzerNote(port, frequency): sonnerie",
                getBuzzerState: "getBuzzerState(buzzer): get buzzer state",
                getTemperature: "getTemperature(thermometer): Get temperature",

                setBuzzerNote: "setBuzzerNote(buzzer, frequency): sonnerie",
                getBuzzerNote: "getBuzzerNote(buzzer)",
                setLedBrightness: "setLedBrightness(led, brightness)",
                getLedBrightness: "setLedBrightness(led)",
                getServoAngle: "getServoAngle(servo)",

                isLedOn: "isLedOn(): get led state",
                getLedState: "getLedState(led): Get led state",

                turnBuzzerOn: "turnBuzzerOn(): Turn Buzzer On",
                turnBuzzerOff: "turnBuzzerOff(): Turn Buzzer Off",
                isBuzzerOn: "isBuzzerOn(): Is Buzzer On",


                drawPoint: "drawPoint(x, y)",
                drawLine: "drawLine(x0, y0, x1, y1)",
                drawRectangle: "drawRectangle(x0, y0, width, height)",
                drawCircle: "drawCircle(x0, y0, diameter)",
                clearScreen: "clearScreen()",
                updateScreen: "updateScreen()",
                autoUpdate: "autoUpdate(auto)",

                fill: "fill(color)",
                noFill: "noFill()",
                stroke: "stroke(color)",
                noStroke: "noStroke()",


                readAcceleration: "readAcceleration(axis)",
                computeRotation: "computeRotation()",

                readSoundLevel: "readSoundLevel(port)",


                readMagneticForce: "readMagneticForce(axis)",
                computeCompassHeading: "computeCompassHeading()",

                readInfraredState: "readInfraredState()",
                setInfraredState: "setInfraredState()",

                // Gyroscope
                readAngularVelocity: "readAngularVelocity()",
                setGyroZeroAngle: "setGyroZeroAngle()",
                computeRotationGyro: "computeRotationGyro()",
            },
            constant: {
            },

            startingBlockName: "Programme", // Name for the starting block
            messages: {
                sensorNotFound: "Accès à un capteur ou actuateur inexistant : {0}.",
                manualTestSuccess: "Test automatique validé.",
                testSuccess: "Bravo ! La sortie est correcte",
                wrongState: "Test échoué : {0} est dans un état invalide.",
                programEnded: "programme terminé.",
                piPlocked: "L'appareil est verrouillé. Déverrouillez ou redémarrez.",
                cantConnect: "Impossible de se connecter à l'appareil.",
                wrongVersion: "Votre Raspberry Pi a une version trop ancienne, mettez le à jour.",
                sensorInOnlineMode: "Vous ne pouvez pas agir sur les capteurs en mode connecté.",
                actuatorsWhenRunning: "Impossible de modifier les actionneurs lors de l'exécution d'un programme",
                cantConnectoToUSB: 'Tentative de connexion par USB en cours, veuillez brancher votre Raspberry sur le port USB <i class="fas fa-circle-notch fa-spin"></i>',
                cantConnectoToBT: 'Tentative de connection par Bluetooth, veuillez connecter votre appareil au Raspberry par Bluetooth <i class="fas fa-circle-notch fa-spin"></i>',
                canConnectoToUSB: "Connecté en USB.",
                canConnectoToBT: "Connecté en Bluetooth.",
                noPortsAvailable: "Aucun port compatible avec ce {0} n'est disponible (type {1})",
                sensor: "capteur",
                actuator: "actionneur",
                removeConfirmation: "Êtes-vous certain de vouloir retirer ce capteur ou actuateur?",
                remove: "Retirer",
                keep: "Garder",
                minutesago: "Last seen {0} minutes ago",
                hoursago: "Last seen more than one hour ago",
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
                            <span class="fas fa-hat-wizard"></span><span>Changer de carte</span></span></span>
                        </button>
                        <button type="button" id="pihatsetup" class="btn">
                            <span class="fas fa-cog"></span><span>Config</span></span></span>
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
                        <div id="piconnectionmainui">
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
                                <div>
                                    <input id="piusetunnel" disabled type="checkbox">Connecter à travers le France-ioi tunnel
                                </div>
                            </div>

                            <div panel-body-usbbt>
                                <label id="piconnectionlabel"></label>
                            </div>
                        </div>
                        <div class="inlineButtons">
                            <button id="piconnectok" class="btn"><i class="fa fa-wifi icon"></i>Connecter l'appareil</button>
                            <button id="pirelease" class="btn"><i class="fa fa-times icon"></i>Déconnecter</button>
                        </div>
                    </div>
                </div>
                `,
                stickPortsDialog: `
                <div class="content qpi">
                <div class="panel-heading">
                    <h2 class="sectionTitle">
                        <span class="iconTag"><i class="icon fas fa-list-ul"></i></span>
                        Stick names and port
                    </h2>
                    <div class="exit" id="picancel"><i class="icon fas fa-times"></i></div>
                </div>
                <div id="sensorPicker" class="panel-body">
                    <label></label>
                    <div class="flex-container">
                    <table style="display:table-header-group;">
                    <tr>
                    <th>Name</th>
                    <th>Port</th>
                    <th>State</th>
                    <th>Direction</th>
                    </tr>
                    <tr>
                    <td><label id="stickupname"></td><td><label id="stickupport"></td><td><label id="stickupstate"></td><td><label id="stickupdirection"><i class="fas fa-arrow-up"></i></td>
                    </tr>
                    <tr>
                    <td><label id="stickdownname"></td><td><label id="stickdownport"></td><td><label id="stickdownstate"></td><td><label id="stickdowndirection"><i class="fas fa-arrow-down"></i></td>
                    </tr>
                    <tr>
                    <td><label id="stickleftname"></td><td><label id="stickleftport"></td><td><label id="stickleftstate"></td><td><label id="stickleftdirection"><i class="fas fa-arrow-left"></i></td>
                    </tr>
                    <tr>
                    <td><label id="stickrightname"></td><td><label id="stickrightport"></td><td><label id="stickrightstate"></td><td><label id="stickrightdirection"><i class="fas fa-arrow-right"></i></td>
                    </tr>
                    <tr>
                    <td><label id="stickcentername"></td><td><label id="stickcenterport"></td><td><label id="stickcenterstate"></td><td><label id="stickcenterdirection"><i class="fas fa-circle"></i></td>
                    </tr>
                    </table>
                    </div>
                </div>
                <div class="singleButton">
                    <button id="picancel2" class="btn btn-centered"><i class="icon fa fa-check"></i>Fermer</button>
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
                setLedState: "Change led state in the given port",
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
                setBuzzerNote: "sonnerie note",
                getBuzzerState: "get buzzer state",
                getTemperature: "Get temperature",



                setBuzzerNote: "Set buzzer note",
                getBuzzerNote: "Get buzzer note",
                setLedBrightness: "Set Led Brightness",
                getLedBrightness: "Get Led Brightness",
                getServoAngle: "Get Servo Angle",


                isLedOn: "Get led state",
                getLedState: "Get led state",

                turnBuzzerOn: "Turn Buzzer on",
                turnBuzzerOff: "Turn Buzzer off",
                isBuzzerOn: "Is Buzzer On",


                drawPoint: "drawPoint",
                drawLine: "drawLine",
                drawRectangle: "drawRectangle",
                drawCircle: "drawCircle",
                clearScreen: "clearScreen",
                updateScreen: "updateScreen",
                autoUpdate: "autoUpdate",

                fill: "fill",
                noFill: "noFill",
                stroke: "stroke",
                noStroke: "noStroke",

                readAcceleration: "readAcceleration",
                computeRotation: "computeRotation",

                readSoundLevel: "readSoundLevel",

                readMagneticForce: "readMagneticForce",
                computeCompassHeading: "computeCompassHeading",

                readInfraredState: "readInfraredState",
                setInfraredState: "setInfraredState",

                // Gyroscope
                readAngularVelocity: "readAngularVelocity",
                setGyroZeroAngle: "setGyroZeroAngle",
                computeRotationGyro: "computeRotationGyro",

            }
        }
    }

    // Create a base context
    var context = quickAlgoContext(display, infos);

    // Import our localLanguageStrings into the global scope
    var strings = context.setLocalLanguageStrings(localLanguageStrings);


    // Some data can be made accessible by the library through the context object
    context.quickpi = {};


    var boardDefinitions = [
        {
            name: "grovepi",
            friendlyName: "Grove Base Hat for Raspberry Pi",
            image: "grovepihat.png",
            adc: "grovepi",
            portTypes: {
                "D": [5, 16, 18, 22, 24, 26],
                "A": [0, 2, 4, 6],
                "i2c": ["i2c"],
            },
            default: [
                { type: "screen", suggestedName: "screen1", port: "i2c", subType: "16x2lcd" },
                { type: "led", suggestedName: "led1", port: 'D5', subType: "blue" },
                { type: "servo", suggestedName: "servo1", port: "D16" },
                { type: "range", suggestedName: "range1", port :"D18", subType: "ultrasonic"},
                { type: "button", suggestedName: "button1", port: "D22" },
                { type: "humidity", suggestedName: "humidity1", port: "D24"},
                { type: "buzzer", suggestedName: "buzzer1", port: "D26", subType: "active"},
                { type: "temperature", suggestedName: "temperature1", port: 'A0', subType: "groveanalog" },
                { type: "potentiometer", suggestedName: "potentiometer1", port :"A4"},
                { type: "light", suggestedName: "light1", port :"A6"},
            ]
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
                { type: "screen", subType: "oled128x32", port: "i2c",  suggestedName: "screen1", },
                { type: "led", subType: "red", port: "D4", suggestedName: "led1", },
                { type: "led", subType: "green", port: "D17", suggestedName: "led2", },
                { type: "led", subType: "blue", port: "D27",  suggestedName: "led3", },
                { type: "irtrans", port: "D22",  suggestedName: "infraredtransmiter1", },
                { type: "irrecv", port: "D23", suggestedName: "infraredreceiver1", },
                { type: "sound", port: "A1", suggestedName: "microphone1", },
                { type: "buzzer", subType: "passive", port: "D12", suggestedName: "buzzer1", },
                { type: "accelerometer", subType: "BMI160", port: "i2c", suggestedName: "accelerometer1", },
                { type: "gyroscope", subType: "BMI160", port: "i2c", suggestedName: "gryscope1", },
                { type: "magnetometer", subType: "LSM303C", port: "i2c", suggestedName: "magnetometer1", },
                { type: "temperature", subType: "BMI160", port: "i2c", suggestedName: "temperature1", },
                { type: "range", subType: "vl53l0x", port: "i2c", suggestedName: "distance1", },
                { type: "button", port: "D26", suggestedName: "button1", },
                { type: "light", port: "A2", suggestedName: "light1", },
                { type: "stick", port: "D7", suggestedName: "stick1", }
            ],
        },
        {
            name: "pinohat",
            image: "pinohat.png",
            friendlyName: "Raspberry Pi without hat",
            adc: ["ads1015", "none"],
            portTypes: {
                "D": [5, 16, 24],
                "A": [0],
                "i2c": ["i2c"],
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
            pluggable: true,
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
            setLiveState: function (sensor, state, callback) {
                var ledstate = state ? 1 : 0;
                var command = "setLedState(\"" + sensor.name + "\"," + ledstate + ")";

                context.quickPiConnection.sendCommand(command, callback);
            },
            subTypes: [{
                subType: "blue",
                description: "LED bleue",
                selectorImages: ["ledon-blue.png"],
                suggestedName: "blueled",
            },
            {
                subType: "green",
                description: "LED verte",
                selectorImages: ["ledon-green.png"],
                suggestedName: "greenled",
            },
            {
                subType: "orange",
                description: "LED orange",
                selectorImages: ["ledon-orange.png"],
                suggestedName: "orangeled",
            },
            {
                subType: "red",
                description: "LED rouge",
                selectorImages: ["ledon-red.png"],
                suggestedName: "redled",
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
            setLiveState: function (sensor, state, callback) {
                var ledstate = state ? 1 : 0;
                var command = "setBuzzerState(\"" + sensor.name + "\"," + ledstate + ")";

                context.quickPiConnection.sendCommand(command, callback);
            },

            subTypes: [{
                subType: "active",
                description: "Grove Buzzer",
                pluggable: true,
            },
            {
                subType: "passive",
                description: "Quick Pi Passive Buzzer",
            }],
        },
        {
            name: "servo",
            description: "Servo motor",
            isAnalog: true,
            isSensor: false,
            portType: "D",
            valueType: "number",
            pluggable: true,
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
            setLiveState: function (sensor, state, callback) {
                var command = "setServoAngle(\"" + sensor.name + "\"," + state + ")";

                context.quickPiConnection.sendCommand(command, callback);
            }
        },
        {
            name: "screen",
            description: "Screen",
            isAnalog: false,
            isSensor: false,
            cellsAmount: function(paper) {
                if(paper.width < 250) {
                    return 4;
                } else if(paper.width < 350) {
                    return 3;
                }
                return 2;
            },
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
            setLiveState: function (sensor, state, callback) {
                var command = "displayText(\"" + sensor.name + "\"," + state.line1 + "\", \"" + state.line2 + "\")";

                context.quickPiConnection.sendCommand(command, callback);
            },
            subTypes: [{
                subType: "16x2lcd",
                description: "Grove 16x2 LCD",
                pluggable: true,
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
            selectorImages: ["irtranson.png"],
            getPercentageFromState: function (state) {
                return state / 60;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 60);
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            setLiveState: function (sensor, state, callback) {
                var ledstate = state ? 1 : 0;
                var command = "setInfraredState(\"" + sensor.name + "\"," + ledstate + ")";

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
            pluggable: true,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("buttonStateInPort(\"" + sensor.name + "\")", function (retVal) {
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
            gpiosNames: ["up", "down", "left", "right", "center"],
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
            getLiveState: function (sensor, callback) {
                var cmd = "readStick(" + this.gpios.join() + ")";

                context.quickPiConnection.sendCommand("readStick(" + this.gpios.join() + ")", function (retVal) {
                    var array = JSON.parse(retVal);
                    callback(array);
                });
            },
            getButtonState: function(buttonname, state) {
                if (state) {
                    var buttonparts = buttonname.split(".");
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readTemperature(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
            subTypes: [{
                subType: "groveanalog",
                description: "Grove Analog tempeature sensor",
                portType: "A",
                pluggable: true,
            },
            {
                subType: "BMI160",
                description: "Quick Pi Accelerometer+Gyroscope temperature sensor",
                portType: "i2c",
            },
            {
                subType: "DHT11",
                description: "DHT11 Tempeature Sensor",
                portType: "D",
                pluggable: true,
            }],
        },
        {
            name: "potentiometer",
            description: "Potentiometer",
            isAnalog: true,
            isSensor: true,
            portType: "A",
            valueType: "number",
            pluggable: true,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readRotaryAngle(\"" + sensor.name + "\")", function(val) {
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
            pluggable: true,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readLightIntensity(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
        },
        {
            name: "range",
            description: "Capteur de distance",
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readDistance(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
            subTypes: [{
                subType: "vl53l0x",
                description: "Time of flight distance sensor",
                portType: "i2c",
            },
            {
                subType: "ultrasonic",
                description: "Capteur de distance à ultrason",
                portType: "D",
                pluggable: true,
            }],

        },
        {
            name: "humidity",
            description: "Humidity sensor",
            isAnalog: true,
            isSensor: true,
            portType: "D",
            valueType: "number",
            pluggable: true,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readHumidity(\"" + sensor.name + "\")", function(val) {
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
            pluggable: true,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readSoundLevel(\"" + sensor.name + "\")", function(val) {
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
            step: 0.1,
            selectorImages: ["accel.png"],
            getPercentageFromState: function (state) {
                return ((state + 78.48) / 156.96);
            },
            getStateFromPercentage: function (percentage) {
                var value = ((percentage * 156.96) - 78.48);
                return parseFloat(value.toFixed(1));
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            getLiveState: function (sensor, callback) {
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
                return (state + 125) / 250;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 250) - 125;
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readGyroBMI160()", function(val) {

                    var array = JSON.parse(val);
                    array[0] = Math.round(array[0]);
                    array[1] = Math.round(array[1]);
                    array[2] = Math.round(array[2]);
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
                return (state + 1600) / 3200;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 3200) - 1600;
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readMagnetometerLSM303C(False)", function(val) {

                    var array = JSON.parse(val);

                    array[0] = Math.round(array[0]);
                    array[1] = Math.round(array[1]);
                    array[2] = Math.round(array[2]);

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
            selectorImages: ["irrecvon.png"],
            getPercentageFromState: function (state) {
                return state / 60;
            },
            getStateFromPercentage: function (percentage) {
                return Math.round(percentage * 60);
            },
            compareState: function (state1, state2) {
                return state1 == state2;
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("buttonStateInPort(\"" + sensor.name + "\")", function (retVal) {
                    var intVal = parseInt(retVal, 10);
                    callback(intVal == 0);
                });
            },
        },
    ];


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

    function getCurrentBoard() {
        var found = boardDefinitions.find(function (element) {
            if (context.board == element.name)
                return element;
        });

        return found;
    }

    if(window.getQuickPiConnection) {
        var lockstring;
        if (sessionStorage.lockstring)
            lockstring = sessionStorage.lockstring;
        else {
            lockstring = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            sessionStorage.lockstring = lockstring;
        }

        context.quickPiConnection = getQuickPiConnection(lockstring, raspberryPiConnected, raspberryPiDisconnected, raspberryPiChangeBoard);
    }

    var paper;
    context.offLineMode = true;

    context.onExecutionEnd = function () {};

    infos.checkEndEveryTurn = true;
    infos.checkEndCondition = function (context, lastTurn) {

        if (!context.display && !context.autoGrading) {
            context.success = true;
            throw (strings.messages.manualTestSuccess);
        }

        if (context.autoGrading) {
            for (var sensorStates in context.gradingStatesBySensor) {
                for (var i = 0; i < context.gradingStatesBySensor[sensorStates].length; i++) {
                    var state = context.gradingStatesBySensor[sensorStates][i];

                    if (state.time < context.currentTime ||
                        (lastTurn && state.time <= context.currentTime)) {
                        if (!state.hit) {
                            context.success = false;
                            throw (strings.messages.wrongState.format(state.name));
                        }
                    }
                    else if (state.time > context.currentTime) {
                        if (lastTurn) {
                            context.success = false;
                            throw (strings.messages.wrongState.format(state.name));
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
                context.success = true;

                throw (strings.messages.programEnded);
            }
        }
   };

   context.generatePythonSensorTable = function()
   {
        var pythonSensorTable = "sensorTable = [";
        var first = true;

        for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
            var sensor = infos.quickPiSensors[iSensor];
            if (first) {
                first = false;
            } else {
                pythonSensorTable += ",";
            }

            if (sensor.type == "stick") {
                var stickDefinition = findSensorDefinition(sensor);
                var firststick = true;

                for (var iStick = 0; iStick < stickDefinition.gpiosNames.length; iStick++) {
                    var name = sensor.name + "." + stickDefinition.gpiosNames[iStick];
                    var port = "D" + stickDefinition.gpios[iStick];

                    if (firststick) {
                        firststick = false;
                    } else {
                        pythonSensorTable += ",";
                    }

                    pythonSensorTable += "{\"type\":\"button\"";
                    pythonSensorTable += ",\"name\":\"" + name + "\"";
                    pythonSensorTable += ",\"port\":\"" + port + "\"}";
                }
            } else {
                pythonSensorTable += "{\"type\":\"" + sensor.type + "\"";
                pythonSensorTable += ",\"name\":\"" + sensor.name + "\"";
                pythonSensorTable += ",\"port\":\"" + sensor.port + "\"";
                if (sensor.subType)
                    pythonSensorTable += ",\"subType\":\"" + sensor.subType + "\"";

                pythonSensorTable += "}";
            }
        }

        var board = getCurrentBoard();
        pythonSensorTable += "]; currentADC = \"" + board.adc + "\"";

        return pythonSensorTable;
   }

    context.resetSensorTable = function()
    {
        var pythonSensorTable = context.generatePythonSensorTable();

        context.quickPiConnection.sendCommand(pythonSensorTable, function(x) {});
    }


    context.findSensor = function findSensor(type, port, error=true) {
        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];

            if (sensor.type == type && sensor.port == port)
                return sensor;
        }

        if (error) {
            context.success = false;
            throw (strings.messages.sensorNotFound.format('type ' + type + ', port ' + port));
        }

        return null;
    }


    function sensorAssignPort(sensor)
    {
        var board = getCurrentBoard();
        var sensorDefinition = findSensorDefinition(sensor);

        sensor.port = null;

        // first try with built ins
        if (board.builtinSensors) {
            for (var i = 0; i < board.builtinSensors.length; i++) {
                var builtinsensor = board.builtinSensors[i];

                // Search for the specified subtype 
                if (builtinsensor.type == sensor.type && 
                    builtinsensor.subType == sensor.subType &&
                    !context.findSensor(builtinsensor.type, builtinsensor.port, false))
                {
                    sensor.port = builtinsensor.port;
                    sensor.subType = builtinsensor.subType;
                }
            }

            // Search without subtype
            for (var i = 0; i < board.builtinSensors.length; i++) {
                var builtinsensor = board.builtinSensors[i];

                // Search for the specified subtype 
                if (builtinsensor.type == sensor.type && 
                    !context.findSensor(builtinsensor.type, builtinsensor.port, false))
                {
                    sensor.port = builtinsensor.port;
                    sensor.subType = builtinsensor.subType;
                }
            }


            // If this is a button try to set it to a stick
            if (!sensor.port && sensor.type == "button") {
                for (var i = 0; i < board.builtinSensors.length; i++) {
                    var builtinsensor = board.builtinSensors[i];
                    if (builtinsensor.type == "stick")
                    {
                        sensor.port = builtinsensor.port;
                    }
                }
            }
        }


        // Second try assign it a grove port
        if (!sensor.port) {
            var sensorDefinition = findSensorDefinition(sensor);
            var pluggable = sensorDefinition.pluggable;

            if (sensorDefinition.subTypes) {
                for (var iSubTypes = 0; iSubTypes < sensorDefinition.subTypes.length; iSubTypes++) {
                    var subTypeDefinition = sensorDefinition.subTypes[iSubTypes];
                    if (pluggable || subTypeDefinition.pluggable) {
                        var ports = board.portTypes[sensorDefinition.portType];
                        for (var iPorts = 0; iPorts < ports.length; iPorts++) {
                            var port = sensorDefinition.portType;
                            if (sensorDefinition.portType != "i2c")
                                port = sensorDefinition.portType + ports[iPorts];
                            if (!findSensorByPort(port)) {
                                sensor.port = port;

                                if (!sensor.subType)
                                    sensor.subType = subTypeDefinition.subType;
                                break;
                            }
                        }
                    }
                }
            } else {
                if (pluggable) {
                    var ports = board.portTypes[sensorDefinition.portType];
                    for (var iPorts = 0; iPorts < ports.length; iPorts++) {
                        var port = sensorDefinition.portType + ports[iPorts];
                        if (!findSensorByPort(port)) {
                            sensor.port = port;
                            break;
                        }
                    }
                }
            }
        }
    }

    context.reset = function (taskInfos) {
        buzzerSound.stopAll();

        if (!context.offLineMode) {
            $('#piinstallcheck').hide();
            context.quickPiConnection.startNewSession();
            context.resetSensorTable();
        }

        if (taskInfos != undefined) {
            context.currentTime = 0;
            context.autoGrading = taskInfos.autoGrading;
            context.allowInfiniteLoop = !context.autoGrading;
            if (context.autoGrading) {
                context.gradingInput = taskInfos.input;
                context.gradingOutput = taskInfos.output;
                context.maxTime = 0;
                context.tickIncrease = 100;

                if (context.gradingInput)
                {
                    for (var i = 0; i < context.gradingInput.length; i++)
                    {
                        context.gradingInput[i].input = true;
                    }
                    context.gradingStatesByTime = context.gradingInput.concat(context.gradingOutput);
                }
                else {
                    context.gradingStatesByTime = context.gradingOutput;
                }

                context.gradingStatesByTime.sort(function (a, b) { return a.time - b.time; });

                context.gradingStatesBySensor = {};

                for (var i = 0; i < context.gradingStatesByTime.length; i++) {
                    var state = context.gradingStatesByTime[i];

                    if (!context.gradingStatesBySensor.hasOwnProperty(state.name))
                        context.gradingStatesBySensor[state.name] = [];

                    context.gradingStatesBySensor[state.name].push(state);
                    state.hit = false;
                    state.badonce = false;

                    if (state.time > context.maxTime)
                        context.maxTime = state.time;
                }
            }


            if (infos.quickPiSensors == "default")
            {
                infos.quickPiSensors = [];
                addDefaultBoardSensors();
            }
        }

        context.success = false;
        if (context.autoGrading)
            context.doNotStartGrade = false;
        else
            context.doNotStartGrade = true;

        for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
            var sensor = infos.quickPiSensors[iSensor];

            sensor.state = null;
            sensor.lastState = 0;
            sensor.lastStateChange = null;
            sensor.callsInTimeSlot = 0;
            sensor.lastTimeIncrease = 0;
            sensor.removed = false;

            // If the sensor has no port assign one
            if (!sensor.port) {
                sensorAssignPort(sensor);
            }
        }

        if (context.display) {
            context.resetDisplay();
        } else {

            context.success = false;
        }

        context.timeLineStates = [];

        startSensorPollInterval();
    };

    function clearSensorPollInterval() {
        if(context.sensorPollInterval) {
            clearInterval(context.sensorPollInterval);
            context.sensorPollInterval = null;
        }
    };

    function startSensorPollInterval() {
        // Start polling the sensors on the raspberry if the raspberry is connected

        clearSensorPollInterval();

        context.liveUpdateCount = 0;

        if(!context.quickPiConnection.isConnected()) { return; }

        context.sensorPollInterval = setInterval(function () {
            if((context.runner && context.runner.isRunning())
                || context.offLineMode
                || context.liveUpdateCount != 0) { return; }

            context.quickPiConnection.startTransaction();

            for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
                var sensor = infos.quickPiSensors[iSensor];

                updateLiveSensor(sensor);
            }

            context.quickPiConnection.endTransaction();
        }, 200);
    };

    function updateLiveSensor(sensor) {
        if (findSensorDefinition(sensor).isSensor && findSensorDefinition(sensor).getLiveState) {
            context.liveUpdateCount++;

            //console.log("updateLiveSensor " + sensor.name, context.liveUpdateCount);

            findSensorDefinition(sensor).getLiveState(sensor, function (returnVal) {
                context.liveUpdateCount--;

                //console.log("updateLiveSensor callback" + sensor.name, context.liveUpdateCount);

                if (!sensor.removed) {
                    sensor.state = returnVal;
                    drawSensor(sensor);
                }
            });
        }
    }

    context.changeBoard = function(newboardname)
    {
        if (context.board == newboardname)
            return;

        var board = null;
        for (var i = 0; i < boardDefinitions.length; i++) {
            board = boardDefinitions[i];

            if (board.name == newboardname)
                break;
        }

        if (board == null)
            return;

        context.board = newboardname;
        sessionStorage.board = newboardname;

        if (infos.customSensors) {
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
                        "builtin": true,
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
        } else {
            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                var sensor = infos.quickPiSensors[i];
                sensorAssignPort(sensor);
            }
        }

        context.resetSensorTable();
        context.resetDisplay();
    };



    context.board = "grovepi";

    if (sessionStorage.board)
        context.changeBoard(sessionStorage.board)

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
                    node.setAttribute("subtype", currentSensor.subType);

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

                    if (sensornode.getAttribute("subtype")) {
                        sensor.subType = sensornode.getAttribute("subtype");
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
        paper = this.raphaelFactory.create(
            "paperMain",
            "virtualSensors",
            $('#virtualSensors').width(),
            $('#virtualSensors').height()
        );

        if (infos.quickPiSensors == "default")
        {
            infos.quickPiSensors = [];
            addDefaultBoardSensors();
        }

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

                if (context.gradingStatesBySensor.hasOwnProperty(sensor.name)) {
                    var states = context.gradingStatesBySensor[sensor.name];
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

            context.timeLineY = 10 + (sensorSize * (iSensor + 1));
            drawTimeLine();

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

            var nSensors = infos.quickPiSensors.length;

            infos.quickPiSensors.forEach(function (sensor) {
                var cellsAmount = findSensorDefinition(sensor).cellsAmount;
                if (cellsAmount) {
                    nSensors += cellsAmount(paper) - 1;
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


                        var cellsAmount = findSensorDefinition(sensor).cellsAmount;
                        if (cellsAmount) {
                            row += cellsAmount(paper) - 1;

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
                $('#pirelease').attr('disabled', true);
            }
            else {
                $('#pirelease').attr('disabled', false);
            }

            $('#piconnectok').attr('disabled', true);

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

            $('#piaddress').on('input', function (e) {

                if (context.offLineMode)
                {
                    var content = $('#piaddress').val();

                    if (content)
                        $('#piconnectok').attr('disabled', false);
                    else
                        $('#piconnectok').attr('disabled', true);
                }
            });

            if (infos.runningOnQuickPi)
            {
                $('#piconnectionmainui').hide();
                $('#piaddress').val(window.location.hostname);
                $('#piaddress').trigger("input");
            }

            if (sessionStorage.pilist) {
                populatePiList(JSON.parse(sessionStorage.pilist));
            }

            if (sessionStorage.raspberryPiIpAddress) {
                $('#piaddress').val(sessionStorage.raspberryPiIpAddress);
                $('#piaddress').trigger("input");
            }

            if (sessionStorage.schoolkey) {
                $('#schoolkey').val(sessionStorage.schoolkey);
                $('#pigetlist').attr("disabled", false);
            }

            $('#piconnectok').click(function () {
                context.inUSBConnection = false;
                context.inBTConnection = false;

                $('#popupMessage').hide();
                window.displayHelper.popupMessageShown = false;

                if ($('#piusetunnel').is(":checked")) {

                    var piname = $("#pilist option:selected").text().split("-")[0].trim();

                    var url = "ws://api.quick-pi.org/client/" +
                        $('#schoolkey').val()  + "-" +
                        piname +
                        "/api/v1/commands";

                    sessionStorage.quickPiUrl = url;
                    context.quickPiConnection.connect(url);

                } else {
                    var ipaddress = $('#piaddress').val();
                    sessionStorage.raspberryPiIpAddress = ipaddress;

                    showasConnecting();
                    var url = "ws://" + ipaddress + ":5000/api/v1/commands";
                    sessionStorage.quickPiUrl = url;

                    context.quickPiConnection.connect(url);
                }
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
                if (!context.quickPiConnection.isConnected()) {
                    sessionStorage.connectionMethod = "USB";
                    $('#piconnectok').attr('disabled', true);
                    $('#piconnectionlabel').show();
                    $('#piconnectionlabel').html(strings.messages.cantConnectoToUSB)

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

                                $('#piconnectionlabel').html(strings.messages.cantConnectoToUSB)
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
                    $('#piconnectionlabel').html(strings.messages.cantConnectoToBT)

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

                                $('#piconnectionlabel').html(strings.messages.cantConnectoToBT)
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
                $('#piusetunnel').attr('disabled', true);

                for (var i = 0; i < jsonlist.length; i++) {
                    var pi = jsonlist[i];

                    var el = document.createElement("option");

                    var minutes = Math.round(jsonlist[i].seconds_since_ping / 60);
                    var timeago = "";

                    if (minutes < 60)
                        timeago = strings.messages.minutesago.format(minutes);
                    else
                        timeago = strings.messages.hoursago;


                    el.textContent = jsonlist[i].name + " - " + timeago;
                    el.value = jsonlist[i].ip;

                    select.appendChild(el);

                    if (first) {
                        $('#piaddress').val(jsonlist[i].ip);
                        $('#piaddress').trigger("input");
                        first = false;
                        $('#pilist').prop('disabled', false);

                        $('#piusetunnel').attr('disabled', false);
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
                    Choisissez votre carte
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

                $('#boardlist').append(image).append("&nbsp;&nbsp;");

                image.onclick = function () {
                    $('#popupMessage').hide();
                    window.displayHelper.popupMessageShown = false;

                    context.changeBoard(board.name);
                }
            }
        });


        $('#pihatsetup').click(function () {

            var command = "getBuzzerAudioOutput()";
            context.quickPiConnection.sendCommand(command, function(val) {
                var buzzerstate = parseInt(val);

                window.displayHelper.showPopupDialog(`
                <div class="content connectPi qpi">
                <div class="panel-heading">
                    <h2 class="sectionTitle">
                        <span class="iconTag"><i class="icon fas fa-list-ul"></i></span>
                        QuickPi Hat Settings
                    </h2>
                    <div class="exit" id="picancel"><i class="icon fas fa-times"></i></div>
                </div>
                <div class="panel-body">
                    <div>
                        <input type="checkbox" id="buzzeraudio" value="buzzeron"> Output audio trought audio buzzer<br>
                    </div>

                    <div class="inlineButtons">
                        <button id="pisetupok" class="btn"><i class="fas fa-cog icon"></i>Set</button>
                </div>
                </div>
            </div>`);

                $('#buzzeraudio').prop('checked', buzzerstate ? true : false);


                $('#picancel').click(function () {
                    $('#popupMessage').hide();
                    window.displayHelper.popupMessageShown = false;
                });

                $('#pisetupok').click(function () {
                    $('#popupMessage').hide();
                    window.displayHelper.popupMessageShown = false;

                    var radioValue = $('#buzzeraudio').is(":checked");

                    var command = "setBuzzerAudioOutput(" + (radioValue ? "True" : "False") + ")";
                    context.quickPiConnection.sendCommand(command, function(x) {});
                });
            });
        });

        $('#piinstall').click(function () {
            context.blocklyHelper.reportValues = false;

            python_code = context.generatePythonSensorTable();
            python_code += "\n\n";
            python_code += window.task.displayedSubTask.blocklyHelper.getCode('python');

            python_code = python_code.replace("from quickpi import *", "");

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
                context.quickPiConnection.connect(sessionStorage.quickPiUrl);
            }
        }
    };

    function addDefaultBoardSensors() {
        var board = getCurrentBoard();
        var boardDefaultSensors = board.default;

        if (!boardDefaultSensors)
            boardDefaultSensors = board.builtinSensors;

        if (boardDefaultSensors)
        {
            for (var i = 0; i < boardDefaultSensors.length; i++) {
                var sensor = boardDefaultSensors[i];

                var newSensor = {
                    "type": sensor.type,
                    "port": sensor.port,
                    "builtin": true,
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

    };

    function getNewSensorSuggestedName(name) {
        var maxvalue = 0;

        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];

            var firstdigit = sensor.name.search(/\d/);
            if (firstdigit > 0) {
                var namepart = sensor.name.substring(0, firstdigit);
                var numberpart = parseInt(sensor.name.substring(firstdigit), 10);

                if (name == namepart && numberpart > maxvalue) {
                    maxvalue = numberpart;
                }
            }
        }

        return name + (maxvalue + 1);
    }

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

                if (sensorDefinition.subTypes) {
                    for (var iSubType = 0; iSubType < sensorDefinition.subTypes.length; iSubType++) {

                        if (!sensorDefinition.pluggable && !sensorDefinition.subTypes[iSubType].pluggable)
                            continue;


                        var el = document.createElement("option");
                        el.textContent = sensorDefinition.description;

                        if (sensorDefinition.subTypes[iSubType].description)
                            el.textContent = sensorDefinition.subTypes[iSubType].description;

                        el.value = sensorDefinition.name;
                        el.value += "-" + sensorDefinition.subTypes[iSubType].subType;
                        select.appendChild(el);
                    }
                } else {
                    if (!sensorDefinition.pluggable)
                        continue;

                    var el = document.createElement("option");
                    el.textContent = sensorDefinition.description;
                    el.value = sensorDefinition.name;

                    select.appendChild(el);
                }
            }

            var board = getCurrentBoard();
            if (board.builtinSensors) {
                for (var i = 0; i < board.builtinSensors.length; i++) {
                    var sensor = board.builtinSensors[i];
                    var sensorDefinition = findSensorDefinition(sensor);

                    if (context.findSensor(sensor.type, sensor.port, false))
                        continue;

                    var el = document.createElement("option");

                    el.textContent = sensorDefinition.description + "(builtin)";
                    el.value = sensorDefinition.name + "-";

                    if (sensor.subType)
                        el.value += sensor.subType;

                    el.value += "-" + sensor.port;

                    select.appendChild(el);
                }
            }

            $('#selector-sensor-list').on('change', function () {
                var values = this.value.split("-");
                var builtinport = false;

                var dummysensor = { type: values[0] };

                if (values.length >= 2)
                    if (values[1])
                        dummysensor.subType = values[1];

                if (values.length >= 3)
                    builtinport = values[2];

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


                var portSelect = document.getElementById("selector-sensor-port");
                $('#selector-sensor-port').empty();
                var hasPorts = false;
                if (builtinport) {
                    var option = document.createElement('option');
                    option.innerText = builtinport;
                    option.value = builtinport;
                    portSelect.appendChild(option);
                    hasPorts = true;
                } else {
                    var ports = getCurrentBoard().portTypes[sensorDefinition.portType];
                    if (sensorDefinition.portType == "i2c")
                    {
                        ports = ["i2c"];
                    }

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
                var name = getNewSensorSuggestedName(sensorDefinition.name);

                infos.quickPiSensors.push({
                        type: sensorDefinition.name,
                        subType: sensorDefinition.subType,
                        port: port,
                        name: name
                    }
                );

                $('#popupMessage').hide();
                window.displayHelper.popupMessageShown = false;

                context.resetSensorTable();
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

            if (port == "i2c")
            {
                if (sensor.type == type)
                    return true;
            } else {
                if (sensor.port == port)
                    return true;
            }
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

        if (context.board == "quickpi")
            $('#pihatsetup').show();
        else
            $('#pihatsetup').hide();

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
        $('#pihatsetup').hide();
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

        startSensorPollInterval();
    }

    function raspberryPiDisconnected(wasConnected, wrongversion) {

        if (context.releasing || !wasConnected)
            showasReleased();
        else
            showasDisconnected();

        window.task.displayedSubTask.context.offLineMode = true;

        if (context.quickPiConnection.wasLocked()) {
            window.displayHelper.showPopupMessage(strings.messages.piPlocked, 'blanket');
        } else if (wrongversion) {
            window.displayHelper.showPopupMessage(strings.messages.wrongVersion, 'blanket');
        } else if (!context.releasing && !wasConnected) {
            window.displayHelper.showPopupMessage(strings.messages.cantConnect, 'blanket');
        }

        clearSensorPollInterval();

        if (wasConnected && !context.releasing && !context.quickPiConnection.wasLocked() && !wrongversion) {
            context.quickPiConnection.connect(sessionStorage.quickPiUrl);
        } else {
            // If I was never connected don't attempt to autoconnect again
            sessionStorage.autoConnect = "0";
            window.task.displayedSubTask.context.resetDisplay();
        }

    }

    function raspberryPiChangeBoard(board) {
        window.task.displayedSubTask.context.changeBoard(board);
        window.task.displayedSubTask.context.resetSensorTable();
    }


    // Update the context's display to the new scale (after a window resize for instance)
    context.updateScale = function () {
        if (!context.display) {
            return;
        }

        width = $('#virtualSensors').width();
        height =  $('#virtualSensors').height();

        if (!context.oldwidth ||
            !context.oldheight ||
            context.oldwidth != width ||
            context.oldheight != height) {

            context.oldwidth = width;
            context.oldheight =  height;

            context.resetDisplay();
        }
    };

    // When the context is unloaded, this function is called to clean up
    // anything the context may have created
    context.unload = function () {
        // Do something here
        clearSensorPollInterval();
        if (context.display) {
            // Do something here
        }

        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];

            sensor.removed = true;
        }

    };

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

            var timelabel = paper.text(x, context.timeLineY, (i / 1000));

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

        var animationSpeed = 200; // ms
        var startx = context.timelineStartx + (context.currentTime * context.pixelsPerTime);

        if (context.currentTime == 0)
        {
            if (context.timeLineCurrent)
            {
                context.timeLineCurrent.remove();
                context.timeLineCurrent = null;
            }

            if (context.timeLineCircle)
            {
                context.timeLineCircle.remove();
                context.timeLineCircle = null;
            }

            if (context.timeLineTriangle) {
                context.timeLineTriangle.remove();
                context.timeLineTriangle = null;
            }
        }

        var targetpath = ["M", startx, 0, "L", startx, context.timeLineY];

        if (context.timeLineCurrent)
        {
            context.timeLineCurrent.animate({path: targetpath}, animationSpeed);
        }
        else
        {
            context.timeLineCurrent = paper.path(targetpath);

            context.timeLineCurrent.attr({
                    "stroke-width": 5,
                    "stroke": "#678AB4",
                    "stroke-linecap": "round"
            });
        }


        if (context.timeLineCircle)
        {
            context.timeLineCircle.animate({cx: startx}, animationSpeed);
        }
        else
        {
            var circleradius = 10;
            context.timeLineCircle = paper.circle(startx, context.timeLineY, 10);

            context.timeLineCircle.attr({
                "fill": "white",
                "stroke": "#678AB4"
            });
        }

        var trianglew = 10;
        var targetpath = ["M", startx, 0,
                "L", startx + trianglew, 0,
                "L", startx, trianglew,
                "L", startx - trianglew, 0,
                "L", startx, 0
            ];

        if (context.timeLineTriangle)
        {
            context.timeLineTriangle.animate({path: targetpath}, animationSpeed);
        }
        else
        {
            context.timeLineTriangle = paper.path(targetpath);

            context.timeLineTriangle.attr({
                "fill": "#678AB4",
                "stroke": "#678AB4"
            });
        }

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

            var startingpath = ["M", startx,
                    ypositionmiddle,
                    "L", startx,
                    ypositionmiddle];

            var targetpath = ["M", startx,
                    ypositionmiddle,
                    "L", startx + stateLenght,
                    ypositionmiddle];


            if (type == "expected")
            {
                var stateline = paper.path(targetpath);
            }
            else
            {
                var stateline = paper.path(startingpath);
                stateline.animate({path: targetpath}, 200);
            }



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

    function createSlider(sensor, max, min, x, y, w, h, index)
    {
        var sliderobj = {};
        sliderobj.sliderdata = {};

        sliderobj.index = index;
        sliderobj.min = min;
        sliderobj.max = max;

        var outsiderectx = x;
        var outsiderecty = y;
        var outsidewidth = w / 6;
        var outsideheight = h;

        var insidewidth = outsidewidth / 6;
        sliderobj.sliderdata.insideheight = h * 0.60;

        var insiderectx = outsiderectx + (outsidewidth / 2) - (insidewidth / 2);
        sliderobj.sliderdata.insiderecty = outsiderecty + (outsideheight / 2) - (sliderobj.sliderdata.insideheight / 2);

        var circleradius = (outsidewidth / 2) - 1;

        var pluscirclex = outsiderectx + (outsidewidth / 2);
        var pluscircley = outsiderecty + circleradius + 1;

        var minuscirclex = pluscirclex;
        var minuscircley = outsiderecty + outsideheight - circleradius - 1;

        paper.setStart();

        sliderobj.sliderrect = paper.rect(outsiderectx, outsiderecty, outsidewidth, outsideheight, outsidewidth / 2);
        sliderobj.sliderrect.attr("fill", "#468DDF");
        sliderobj.sliderrect.attr("stroke", "#468DDF");

        sliderobj.sliderrect = paper.rect(insiderectx, sliderobj.sliderdata.insiderecty, insidewidth, sliderobj.sliderdata.insideheight, 2);
        sliderobj.sliderrect.attr("fill", "#2E5D94");
        sliderobj.sliderrect.attr("stroke", "#2E5D94");


        sliderobj.plusset = paper.set();

        sliderobj.pluscircle = paper.circle(pluscirclex, pluscircley, circleradius);
        sliderobj.pluscircle.attr("fill", "#F5A621");
        sliderobj.pluscircle.attr("stroke", "#F5A621");

        sliderobj.plus = paper.text(pluscirclex, pluscircley, "+");
        sliderobj.plus.attr({ fill: "white" });
        sliderobj.plus.node.style = "-moz-user-select: none; -webkit-user-select: none;";

        sliderobj.plusset.push(sliderobj.pluscircle, sliderobj.plus);

        sliderobj.plusset.click(function () {
            var step = 1;
            var sensorDef = findSensorDefinition(sensor);
            if (sensorDef.step)
                step = sensorDef.step;

            if (Array.isArray(sensor.state)) {
                if (sensor.state[sliderobj.index] < sliderobj.max)
                    sensor.state[sliderobj.index] += step;
            }
            else
            {
                if (sensor.state < sliderobj.max)
                    sensor.state += step;
            }

            drawSensor(sensor, sensor.state, true);
        });


        sliderobj.minusset = paper.set();

        sliderobj.minuscircle = paper.circle(minuscirclex, minuscircley, circleradius);
        sliderobj.minuscircle.attr("fill", "#F5A621");
        sliderobj.minuscircle.attr("stroke", "#F5A621");

        sliderobj.minus = paper.text(minuscirclex, minuscircley, "-");
        sliderobj.minus.attr({ fill: "white" });
        sliderobj.minus.node.style = "-moz-user-select: none; -webkit-user-select: none;";

        sliderobj.minusset.push(sliderobj.minuscircle, sliderobj.minus);

        sliderobj.minusset.click(function () {

            var step = 1;
            var sensorDef = findSensorDefinition(sensor);
            if (sensorDef.step)
                step = sensorDef.step;

            if (Array.isArray(sensor.state)) {
                if (sensor.state[sliderobj.index] > sliderobj.min)
                    sensor.state[sliderobj.index] -= step;
            } else {
                if (sensor.state > sliderobj.min)
                    sensor.state -= step;
            }

            drawSensor(sensor, sensor.state, true);
        });


        var thumbwidth = outsidewidth * .80;
        sliderobj.sliderdata.thumbheight = outsidewidth * 1.4;
        sliderobj.sliderdata.scale = (sliderobj.sliderdata.insideheight - sliderobj.sliderdata.thumbheight);


        if (Array.isArray(sensor.state)) {
            var percentage = findSensorDefinition(sensor).getPercentageFromState(sensor.state[index]);
        } else {
            var percentage = findSensorDefinition(sensor).getPercentageFromState(sensor.state);
        }


        var thumby = sliderobj.sliderdata.insiderecty + sliderobj.sliderdata.insideheight - sliderobj.sliderdata.thumbheight - (percentage * sliderobj.sliderdata.scale);

        var thumbx = insiderectx + (insidewidth / 2) - (thumbwidth / 2);

        sliderobj.thumb = paper.rect(thumbx, thumby, thumbwidth, sliderobj.sliderdata.thumbheight, outsidewidth / 2);
        sliderobj.thumb.attr("fill", "#F5A621");
        sliderobj.thumb.attr("stroke", "#F5A621");

        sliderobj.slider = paper.setFinish();

        sliderobj.thumb.drag(
            function (dx, dy, x, y, event) {

                var newy = sliderobj.sliderdata.zero + dy;

                if (newy < sliderobj.sliderdata.insiderecty)
                    newy = sliderobj.sliderdata.insiderecty;

                if (newy > sliderobj.sliderdata.insiderecty + sliderobj.sliderdata.insideheight - sliderobj.sliderdata.thumbheight)
                    newy = sliderobj.sliderdata.insiderecty + sliderobj.sliderdata.insideheight - sliderobj.sliderdata.thumbheight;

                sliderobj.thumb.attr('y', newy);

                var percentage = 1 - ((newy - sliderobj.sliderdata.insiderecty) / sliderobj.sliderdata.scale);

                if (Array.isArray(sensor.state)) {
                    sensor.state[sliderobj.index] = findSensorDefinition(sensor).getStateFromPercentage(percentage);
                } else {
                    sensor.state = findSensorDefinition(sensor).getStateFromPercentage(percentage);
                }
                drawSensor(sensor, sensor.state, true);
            },
            function (x, y, event) {
                sliderobj.sliderdata.zero = sliderobj.thumb.attr('y');

            },
            function (event) {
            }
        );

        return sliderobj;
    }


    function setSlider(sensor, juststate, imgx, imgy, imgw, imgh, min, max, triaxial) {
        if (juststate) {

            if (Array.isArray(sensor.state)) {
                for (var i = 0; i < sensor.state.length; i++) {
                    if (sensor.sliders[i] == undefined)
                        continue;

                    var percentage = findSensorDefinition(sensor).getPercentageFromState(sensor.state[i]);

                    thumby = sensor.sliders[i].sliderdata.insiderecty +
                        sensor.sliders[i].sliderdata.insideheight -
                        sensor.sliders[i].sliderdata.thumbheight -
                        (percentage * sensor.sliders[i].sliderdata.scale);

                    sensor.sliders[i].thumb.attr('y', thumby);
                }
            } else {
                var percentage = findSensorDefinition(sensor).getPercentageFromState(sensor.state);

                thumby = sensor.sliders[0].sliderdata.insiderecty +
                    sensor.sliders[0].sliderdata.insideheight -
                    sensor.sliders[0].sliderdata.thumbheight -
                    (percentage * sensor.sliders[0].sliderdata.scale);

                sensor.sliders[0].thumb.attr('y', thumby);
            }

            return;
        }

        removeSlider(sensor);


        sensor.sliders = [];

        var actuallydragged;

        sensor.hasslider = true;
        sensor.focusrect.drag(
            function (dx, dy, x, y, event) {
                if (sensor.sliders.length != 1)
                    return;

                var newy = sensor.sliders[0].sliderdata.zero + dy;

                if (newy < sensor.sliders[0].sliderdata.insiderecty)
                    newy = sensor.sliders[0].sliderdata.insiderecty;

                if (newy > sensor.sliders[0].sliderdata.insiderecty + sensor.sliders[0].sliderdata.insideheight - sensor.sliders[0].sliderdata.thumbheight)
                    newy = sensor.sliders[0].sliderdata.insiderecty + sensor.sliders[0].sliderdata.insideheight - sensor.sliders[0].sliderdata.thumbheight;

                sensor.sliders[0].thumb.attr('y', newy);

                var percentage = 1 - ((newy - sensor.sliders[0].sliderdata.insiderecty) / sensor.sliders[0].sliderdata.scale);

                sensor.state = findSensorDefinition(sensor).getStateFromPercentage(percentage);
                drawSensor(sensor, sensor.state, true);

                actuallydragged++;
            },
            function (x, y, event) {
                showSlider();
                actuallydragged = 0;

                if (sensor.sliders.length == 1)
                    sensor.sliders[0].sliderdata.zero = sensor.sliders[0].thumb.attr('y');
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

            if (Array.isArray(sensor.state)) {

                var offset = 0;
                var sign = -1;
                if (sensor.drawInfo.x -
                     ((sensor.state.length - 1) * sensor.drawInfo.width / 5) < 0)
                {
                    sign = 1;
                    offset = sensor.drawInfo.width;
                }


                for (var i = 0; i < sensor.state.length; i++) {
                    sliderobj = createSlider(sensor,
                        max,
                        min,
                        sensor.drawInfo.x + offset + (sign * i * sensor.drawInfo.width / 5) ,
                        sensor.drawInfo.y,
                        sensor.drawInfo.width,
                        sensor.drawInfo.height,
                        i);

                        sensor.sliders.push(sliderobj);
                }
            } else {
                sliderobj = createSlider(sensor,
                    max,
                    min,
                    sensor.drawInfo.x,
                    sensor.drawInfo.y,
                    sensor.drawInfo.width,
                    sensor.drawInfo.height,
                    0);
                sensor.sliders.push(sliderobj);
            }
        }
    }

    function removeSlider(sensor) {
        if (sensor.hasslider && sensor.focusrect) {
            sensor.focusrect.undrag();
            sensor.hasslider = false;
        }

        if (sensor.sliders) {

            for (var i = 0; i < sensor.sliders.length; i++) {
                sensor.sliders[i].slider.remove();
            }

            sensor.sliders = [];
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

        var imgx = sensor.drawInfo.x + imgw / 6;
        var imgy = sensor.drawInfo.y + (sensor.drawInfo.height / 2) - (imgh / 2);

        var state1x =  (imgx + imgw) + 3;
        var state1y = imgy + imgh / 3;

        var portx = state1x;
        var porty = imgy;

        var namex = sensor.drawInfo.x + (sensor.drawInfo.height / 2);
        var namey = sensor.drawInfo.y + (imgh * 0.20);
        var nameanchor = "middle";

        var portsize = sensor.drawInfo.height * 0.10;
        var statesize = sensor.drawInfo.height * 0.09;
        var namesize = sensor.drawInfo.height * 0.10;

        var drawPortText = true;

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

            namex = portx;
            namesize = portsize;
            nameanchor = "start";
        }


        if (sensor.type == "led") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state == null)
                sensor.state = 0;

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

            if (!sensor.ledon || !sensor.ledon.paper.canvas) {
                var imagename = "ledon-";
                if (sensor.subType)
                    imagename += sensor.subType;
                else
                    imagename += "red";

                imagename += ".png";

                sensor.ledon = paper.image(getImg(imagename), imgx, imgy, imgw, imgh);
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

            var x = typeof sensor.state;

            if(typeof sensor.state == 'number' ) {
                sensor.ledon.attr({ "opacity": sensor.state });
                sensor.ledoff.attr({ "opacity": 1 });
            }


            if ((!context.runner || !context.runner.isRunning())
                && !context.offLineMode) {

                findSensorDefinition(sensor).setLiveState(sensor, sensor.state, function(x) {});
            }

        } else if (sensor.type == "buzzer") {
            var is_running = context.runner ? context.runner.isRunning() : false;
            if(!is_running) {
                sensor.state ? buzzerSound.start(sensor.name) : buzzerSound.stop(sensor.name);
            }
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
                    setLiveState(sensor, sensor.state, function(x) {});
                }
            }

        } else if (sensor.type == "button") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.buttonon || !sensor.buttonon.paper.canvas)
                sensor.buttonon = paper.image(getImg('buttonon.png'), imgx, imgy, imgw, imgh);

            if (!sensor.buttonoff || !sensor.buttonoff.paper.canvas)
                sensor.buttonoff = paper.image(getImg('buttonoff.png'), imgx, imgy, imgw, imgh);

            if (sensor.state == null)
                sensor.state = false;

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

            var screenwidth = 128;
            var screenheight = 32;

            if (!sensor.img || !sensor.img.paper.canvas) {
                sensor.img = paper.image(getImg('screen.png'), imgx, imgy, imgw, imgh);
            }
            //dimk
                

            if (!sensor.screenrect || !sensor.screenrect.paper.canvas) {
                sensor.screenrect = paper.rect(imgx, imgy, screenwidth, screenheight);

                sensor.canvasNode = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
                sensor.canvasNode.setAttribute("x",imgx + (imgw / 2) - (screenwidth/2)); //Set rect data
                sensor.canvasNode.setAttribute("y",imgy + (imgh / 2) - (screenheight/2)); //Set rect data
                sensor.canvasNode.setAttribute("width", screenwidth); //Set rect data
                sensor.canvasNode.setAttribute("height", screenheight); //Set rect data
                paper.canvas.appendChild(sensor.canvasNode);


                sensor.canvas = document.createElement("canvas");
                sensor.canvas.id = "screencanvas";
                sensor.canvas.width = screenwidth;
                sensor.canvas.height = screenheight;
                sensor.canvasNode.appendChild(sensor.canvas);


                sensor.canvaslabel = document.createElement("label");
                sensor.canvaslabel.id = "canvaslabel";
                sensor.canvaslabel.innerText = "Click to show";

                sensor.canvasNode.appendChild(sensor.canvaslabel);

                sensor.displayingscreen = true;

                sensor.focusrect.click(function () {

                    if ((imgw * 0.80) >= screenwidth )
                    {
                        sensor.displayingscreen = true;
                    } else {
                        sensor.displayingscreen = !sensor.displayingscreen;
                    }

                    if (sensor.displayingscreen) {
                        $('#screencanvas').show();
                        sensor.screenrect.attr({ "opacity": 1 });
                    } else {
                        $('#canvaslabel').show();
                        $('#screencanvas').hide();
                        sensor.screenrect.attr({ "opacity": 0 });
                    }
                });
            }

            sensor.screenrect.attr({
                "x": imgx + (imgw / 2) - (128/2),
                "y": imgy + (imgh / 2) - (32/2),
                "width": 128,
                "height": 32,
            });

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            if ((imgw * 0.80) < screenwidth ) {
                sensor.displayingscreen = false;
                $('#screencanvas').hide();
                sensor.screenrect.attr({ "opacity": 0 });
            }

            sensor.canvasNode.setAttribute("x", imgx + (imgw / 2) - (128/2)); //Set rect data
            sensor.canvasNode.setAttribute("y", imgy + (imgh / 2) - (32/2)); //Set rect data
            sensor.canvasNode.setAttribute("width", "128"); //Set rect data
            sensor.canvasNode.setAttribute("height", "32"); //Set rect data


            if (sensor.state) {
                sensor.displayingscreen = false;
                $('#canvaslabel').hide();
                $('#screencanvas').hide();
                sensor.screenrect.attr({ "opacity": 0 });

                var statex = imgx + (imgw * .13);

                var statey = imgy + (imgh * .4);

                if (sensor.state.line1.length > 16)
                    sensor.state.line1 = sensor.state.line1.substring(0, 16);

                if (sensor.state.line2.length > 16)
                    sensor.state.line2 = sensor.state.line2.substring(0, 16);

                sensor.stateText = paper.text(statex, statey, sensor.state.line1 + "\n" + sensor.state.line2);

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

                        findSensorDefinition(sensor).setLiveState(sensor, sensor.state, function(x) {});

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
                sensor.state = 500;

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

                rangew = firstpart + (remaining * (sensor.state) * 0.0015);
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

            if (!sensor.state)
            {
                sensor.state = [0, 0, 1];
            }

            if (sensor.state) {
                try {
                sensor.stateText = paper.text(state1x, state1y, "X: " + sensor.state[0] + "m/s²\nY: " + sensor.state[1] + "m/s²\nZ: " + sensor.state[2] + "m/s²");
                } catch (Err)
                {
                    var a = 1;
                }
            }

            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, -8 * 9.81, 8 * 9.81);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
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

            if (!sensor.state)
            {
                sensor.state = [0, 0, 0];
            }

            if (sensor.state) {
                sensor.stateText = paper.text(state1x, state1y, "X: " + sensor.state[0] + "°/s\nY: " + sensor.state[1] + "°/s\nZ: " + sensor.state[2] + "°/s");
            }

            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, -125, 125);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }
        } else if (sensor.type == "magnetometer") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || !sensor.img.paper.canvas)
                sensor.img = paper.image(getImg('mag.png'), imgx, imgy, imgw, imgh);

            if (!sensor.needle || !sensor.needle.paper.canvas)
                sensor.needle = paper.image(getImg('mag-needle.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            sensor.needle.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "transform": ""
            });

            if (!sensor.state)
            {
                sensor.state = [0, 0, 0];
            }

            if (sensor.state) {
                var heading = Math.atan2(sensor.state[0],sensor.state[1])*(180/Math.PI) + 180;

                sensor.needle.rotate(heading);
            }

            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state) {
                sensor.stateText = paper.text(state1x, state1y, "X: " + sensor.state[0] + "μT\nY: " + sensor.state[1] + "μT\nZ: " + sensor.state[2] + "μT");
            }

            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, -1600, 1600);
            } else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
            }
        } else if (sensor.type == "sound") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state == null)
                sensor.state = 25; // FIXME

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

            if (!context.autoGrading && context.offLineMode) {
                setSlider(sensor, juststate, imgx, imgy, imgw, imgh, 0, 60);
            }
            else {
                sensor.focusrect.click(function () {
                    sensorInConnectedModeError();
                });

                removeSlider(sensor);
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

                findSensorDefinition(sensor).setLiveState(sensor, sensor.state, function(x) {});
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
                    stateString += "UP\n"
                    sensor.imgup.attr({ "opacity": 1 });
                }
                if (sensor.state[1]) {
                    stateString += "DOWN\n"
                    sensor.imgdown.attr({ "opacity": 1 });
                }
                if (sensor.state[2]) {
                    stateString += "LEFT\n"
                    sensor.imgleft.attr({ "opacity": 1 });
                }
                if (sensor.state[3]) {
                    stateString += "RIGHT\n"
                    sensor.imgright.attr({ "opacity": 1 });
                }
                if (sensor.state[4]) {
                    stateString += "CENTER\n"
                    sensor.imgcenter.attr({ "opacity": 1 });
                }

                if (sensor.portText)
                    sensor.portText.remove();


                drawPortText = false;

                if (sensor.portText)
                    sensor.portText.remove();

                var gpios = findSensorDefinition(sensor).gpios;
                var min = 255;
                var max = 0;

                for (var i = 0; i < gpios.length; i++)
                {
                    if (gpios[i] > max)
                        max = gpios[i];

                    if (gpios[i] < min)
                        min = gpios[i];
                }


                sensor.portText = paper.text(portx, porty, "D" + min.toString() + "-D" + max.toString() + "?");
                sensor.portText.attr({ "font-size": portsize + "px", 'text-anchor': 'start', fill: "blue" });
                sensor.portText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
                var b = sensor.portText._getBBox();
                sensor.portText.translate(0,b.height/2);

                $('#stickupstate').text(sensor.state[0] ? "ON" : "OFF");
                $('#stickdownstate').text(sensor.state[1] ? "ON" : "OFF");
                $('#stickleftstate').text(sensor.state[2] ? "ON" : "OFF");
                $('#stickrightstate').text(sensor.state[3] ? "ON" : "OFF");
                $('#stickcenterstate').text(sensor.state[4] ? "ON" : "OFF");

                sensor.portText.click(function () {
                    window.displayHelper.showPopupDialog(strings.messages.stickPortsDialog);

                    $('#picancel').click(function () {
                        $('#popupMessage').hide();
                        window.displayHelper.popupMessageShown = false;
                    });

                    $('#picancel2').click(function () {
                        $('#popupMessage').hide();
                        window.displayHelper.popupMessageShown = false;
                    });

                    $('#stickupname').text(sensor.name + ".up");
                    $('#stickdownname').text(sensor.name + ".down");
                    $('#stickleftname').text(sensor.name + ".left");
                    $('#stickrightname').text(sensor.name + ".right");
                    $('#stickcentername').text(sensor.name + ".center");

                    $('#stickupport').text("D" + gpios[0]);
                    $('#stickdownport').text("D" + gpios[1]);
                    $('#stickleftport').text("D" + gpios[2]);
                    $('#stickrightport').text("D" + gpios[3]);
                    $('#stickcenterport').text("D" + gpios[4]);

                    $('#stickupstate').text(sensor.state[0] ? "ON" : "OFF");
                    $('#stickdownstate').text(sensor.state[1] ? "ON" : "OFF");
                    $('#stickleftstate').text(sensor.state[2] ? "ON" : "OFF");
                    $('#stickrightstate').text(sensor.state[3] ? "ON" : "OFF");
                    $('#stickcenterstate').text(sensor.state[4] ? "ON" : "OFF");

                });


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


        if (sensor.stateText) {
            try {
                sensor.stateText.attr({ "font-size": statesize + "px", 'text-anchor': 'start', 'font-weight': 'bold', fill: "gray" });
                var b = sensor.stateText._getBBox();
                sensor.stateText.translate(0,b.height/2);
                sensor.stateText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
            } catch (err) {
            }
        }


		if (drawPortText) {
        	if (sensor.portText)
            	sensor.portText.remove();

        	sensor.portText = paper.text(portx, porty, sensor.port);
        	sensor.portText.attr({ "font-size": portsize + "px", 'text-anchor': 'start', fill: "gray" });
        	sensor.portText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
        	var b = sensor.portText._getBBox();
        	sensor.portText.translate(0,b.height/2);
		}

        if (sensor.nameText) {
            sensor.nameText.remove();
        }


        if (sensor.name) {
            sensor.nameText = paper.text(namex, namey, sensor.name );
            sensor.nameText.attr({ "font-size": namesize + "px", 'text-anchor': nameanchor, fill: "#7B7B7B" });
            sensor.nameText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
        }


        if (!donotmovefocusrect) {
            // This needs to be in front of everything
            sensor.focusrect.toFront();
        }

    }


    context.registerQuickPiEvent = function (name, newState, setInSensor = true) {
        var sensor = findSensorByName(name);
        if (!sensor) {
            context.success = false;
            throw (strings.messages.sensorNotFound.format(name));
        }

        if (setInSensor) {
            sensor.state = newState;
            drawSensor(sensor);
        }

        if (context.autoGrading && context.gradingStatesBySensor != undefined) {
            var fail = false;
            var type = "actual";
            var expectedState = context.getSensorExpectedState(sensor.name);

            if (expectedState != null)
                expectedState.hit = true;

            if (sensor.lastStateChange == null) {
                sensor.lastStateChange = 0;
                sensor.lastState = 0;
            }

            drawSensorTimeLineState(sensor, sensor.lastState, sensor.lastStateChange, context.currentTime, type);

            if (context.currentTime > context.maxTime) {
                context.success = true;
                throw (strings.messages.testSuccess);
            }
            else if (expectedState != null &&
                !findSensorDefinition(sensor).compareState(expectedState.state, newState)) {

                if (expectedState.badonce)
                {
                    type = "wrong";
                    fail = true;
                    expectedState.badonce = false;
                    drawSensorTimeLineState(sensor, newState, context.currentTime, context.currentTime + 100, type);
                }
                else {
                    expectedState.badonce = true;
                    expectedState.hit = false;

                }
            }

            sensor.lastStateChange = context.currentTime;
            sensor.lastState = newState;

            if (fail) {
                context.success = false;
                throw (strings.messages.wrongState.format(sensor.name));
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

        if (sensor.callsInTimeSlot > 5) {
            context.currentTime += context.tickIncrease;

            sensor.lastTimeIncrease = context.currentTime;
            sensor.callsInTimeSlot = 0;
        }

        drawCurrentTime();
    }

    context.increaseTimeBy = function (time) {

        var iStates = 0;

        var newTime = context.currentTime + time;

        if (!context.gradingStatesByTime)
            return;

        // Advance until current time, ignore everything in the past.
        while (iStates < context.gradingStatesByTime.length &&
               context.gradingStatesByTime[iStates].time <= context.currentTime)
            iStates++;

        for (; iStates < context.gradingStatesByTime.length; iStates++) {
            var sensorState = context.gradingStatesByTime[iStates];

            // Until the new time
            if (sensorState.time >= newTime)
                break;

            // Mark all inputs as hit
            if (sensorState.input) {
                //sensorState.hit = true;
                context.currentTime = sensorState.time;
                context.getSensorState(sensorState.name);
            }
        }

        context.currentTime = newTime;
    }

    context.getSensorExpectedState = function (name) {
        var state = null;

        if (!context.gradingStatesBySensor)
        {
            return null;
        }

        var actualname = name;
        var parts = name.split(".");
        if (parts.length == 2) {
            actualname = parts[0];
        }


        var sensorStates = context.gradingStatesBySensor[actualname];

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


    context.getSensorState = function (name) {
        var state = null;

        if (!context.display || context.autoGrading) {
            var stateTime = context.getSensorExpectedState(name);

            if (stateTime != null) {
                stateTime.hit = true;
                state = stateTime.state;
            }
            else {
                state = 0;
            }
        }

        var sensor = findSensorByName(name);
        if (!sensor) {
            context.success = false;
            throw (strings.messages.sensorNotFound.format(name));
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

        context.increaseTime(sensor);

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


    /***** Functions *****/
    /* Here we define each function of the library.
       Blocks will generally use context.group.blockName as their handler
       function, hence we generally use this name for the functions. */
    context.quickpi.turnLedOn = function (callback) {

        context.registerQuickPiEvent("led1", true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        }
        else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("turnLedOn()", cb);
        }
    };

    context.quickpi.turnLedOff = function (callback) {
        context.registerQuickPiEvent("led1", false);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("turnLedOff()", cb);
        }
    };

    context.quickpi.turnBuzzerOn = function (callback) {

        context.registerQuickPiEvent("buzzer1", true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        }
        else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("turnBuzzerOn()", cb);
        }
    };

    context.quickpi.turnBuzzerOff = function (callback) {
        context.registerQuickPiEvent("buzzer1", false);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("turnBuzzerOff()", cb);
        }
    };

    context.quickpi.isBuzzerOn = function (callback) {
        var sensor = findSensorByName("buzzer1", true);

        var command = "isBuzzerOn()";

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("buzzer1");
            context.waitDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);
            });
        }
    };


    context.quickpi.waitForButton = function (name, callback) {
        //        context.registerQuickPiEvent("button", "D22", "wait", false);
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading) {

            context.advanceToNextRelease("button", sensor.port);

            context.waitDelay(callback);
        } else if (context.offLineMode) {
            if (sensor) {
                var cb = context.runner.waitCallback(callback);
                sensor.onPressed = function () {
                    cb();
                }
            } else {
                context.waitDelay(callback);
            }
        }
        else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("waitForButton(\"" + name + "\")", cb);
        }
    };

    context.quickpi.buttonState = function (callback) {
        var sensor = findSensorByName("button1", true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("button1");

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                sensor.state = returnVal != "0";
                drawSensor(sensor);
                cb(returnVal != "0");
            });
        }
    };

    context.quickpi.buttonStateInPort = function (name, callback) {

        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {

            if (sensor.type == "stick") {
                var state = context.getSensorState(name);
                var stickDefinition = findSensorDefinition(sensor);
                var buttonstate = stickDefinition.getButtonState(name, sensor.state);


                context.runner.noDelay(callback, buttonstate);
            } else {
                var state = context.getSensorState(name);

                context.runner.noDelay(callback, state);
            }
        } else {
            var cb = context.runner.waitCallback(callback);

            if (sensor.type == "stick") {
                var stickDefinition = findSensorDefinition(sensor);

                stickDefinition.getLiveState(sensor, function(returnVal) {
                    sensor.state = returnVal;
                    drawSensor(sensor);

                    var buttonstate = stickDefinition.getButtonState(name, sensor.state);

                    cb(buttonstate);
                });

            } else {
                findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                    sensor.state = returnVal;
                    drawSensor(sensor);
                    cb(returnVal);
                });
            }
        }
    };


    context.quickpi.toggleLedState = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("toggleLedState(\"" + name + "\")", function (returnVal) {
                cb(returnVal != "0");
            });
        }
    };


    context.quickpi.buttonWasPressed = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);
            context.quickPiConnection.sendCommand("buttonWasPressed(\"" + name + "\")", function (returnVal) {
                cb(returnVal != "0");
            });
        }

    };

    context.quickpi.setLedState = function (name, state, callback) {
        var sensor = findSensorByName(name, true);
        var command = "setLedState(\"" + sensor.port + "\"," + (state ? "True" : "False") + ")";

        context.registerQuickPiEvent(name, state ? true : false);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, cb);
        }
    };

    context.quickpi.setBuzzerState = function (name, state, callback) {
        var sensor = findSensorByName(name, true);

        var command = "setBuzzerState(\"" + name + "\"," + (state ? "True" : "False") + ")";

        context.registerQuickPiEvent(name, state ? true : false);

        if(context.display) {
            state ? buzzerSound.start(name) : buzzerSound.stop(name);
        }

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, cb);
        }
    };

    context.quickpi.getBuzzerState = function (name, callback) {
        var sensor = findSensorByName(name, true);

        var command = "getBuzzerState(\"" + name + "\")";

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);
            context.waitDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);

            });
        }
    };

    context.quickpi.setBuzzerNote = function (name, frequency, callback) {
        var sensor = findSensorByName(name, true);
        var command = "setBuzzerNote(\"" + name + "\"," + frequency + ")";

        context.registerQuickPiEvent(name, frequency);

        if(context.display && context.offLineMode) {
            buzzerSound.start(name, frequency);
        }

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);
            context.waitDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);

            });
        }
    };

    context.quickpi.getBuzzerNote = function (name, callback) {
        var sensor = findSensorByName(name, true);

        var command = "getBuzzerNote(\"" + name + "\")";

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);
            context.waitDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);

            });
        }
    };


    context.quickpi.setLedBrightness = function (name, level, callback) {
        var sensor = findSensorByName(name, true);

        if (typeof level == "object")
        {
            level = level.valueOf();
        }

        var command = "setLedBrightness(\"" + name + "\"," + level + ")";

        context.registerQuickPiEvent(name, level);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, cb);
        }
    };


    context.quickpi.getLedBrightness = function (name, callback) {
        var sensor = findSensorByName(name, true);

        var command = "getLedBrightness(\"" + name + "\")";

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);
            context.waitDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);

            });
        }
    };

    context.quickpi.isLedOn = function (callback) {
        var sensor = findSensorByName("led1", true);

        var command = "isLedOn()";

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("led1");
            context.waitDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);

            });
        }
    };

    context.quickpi.getLedState = function (name, callback) {
        var sensor = findSensorByName(name, true);

        var command = "getLedState(\"" + name + "\")";

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);
            context.waitDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);

            });
        }
    };

    context.quickpi.toggleLedState = function (name, callback) {
        var sensor = findSensorByName(name, true);

        var command = "toggleLedState(\"" + name + "\")";
        var state = context.getSensorState(name);

        context.registerQuickPiEvent(name, !state);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, cb);
        }
    };

    context.quickpi.displayText = function (name, line1, line2, callback) {
        var sensor = findSensorByName(name, true);

        var command = "displayText(\"" + name + "\",\""  + line1 + "\", \"" + line2 + "\")";

        context.registerQuickPiEvent(name,
            {
                line1: line1,
                line2: line2
            }
        );

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function (retval) {
                cb();
            });
        }
    };

    context.quickpi.readTemperature = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);

            context.runner.waitDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    context.quickpi.sleep = function (time, callback) {
        if (!context.display || context.autoGrading) {

            context.increaseTimeBy(time);
            context.runner.noDelay(callback);
        }
        else {
            context.runner.waitDelay(callback, null, time);
        }
    };


    context.quickpi.setServoAngle = function (name, angle, callback) {
        var sensor = findSensorByName(name, true);

        if (angle > 180)
            angle = 180;
        else if (angle < 0)
            angle = 0;

        context.registerQuickPiEvent(name, angle);
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var command = "setServoAngle(\"" + name + "\"," + angle + ")";
            cb = context.runner.waitCallback(callback);
            context.quickPiConnection.sendCommand(command, cb);
        }
    };

    context.quickpi.getServoAngle = function (name, callback) {
        var sensor = findSensorByName(name, true);

        var command = "getServoAngle(\"" + name + "\")";

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);
            context.waitDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);

            });
        }
    };


    context.quickpi.readRotaryAngle = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {

            var state = context.getSensorState(name);
            context.waitDelay(callback, state);
        } else {

            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };


    context.quickpi.readDistance = function (name, callback) {
        var sensor = findSensorByName(name, true);
        if (!context.display || context.autoGrading || context.offLineMode) {

            var state = context.getSensorState(name);
            context.waitDelay(callback, state);
        } else {

            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };



    context.quickpi.readLightIntensity = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {

            var state = context.getSensorState(name);
            context.waitDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                sensor.state = returnVal;

                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    context.quickpi.readHumidity = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {

            var state = context.getSensorState(name);
            context.waitDelay(callback, state);
        } else {

            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
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


    context.quickpi.drawPoint = function(x, y, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("screen");

            if (sensor && sensor.canvas)
            {
                var ctx = sensor.canvas.getContext('2d');

                ctx.fillRect(x, y, 1, 1);
            }

            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "drawPoint(" + x + "," + y + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };

    context.quickpi.drawLine = function(x0, y0, x1, y1, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {

            var sensor = findSensorByType("screen");
            if (sensor && sensor.canvas)
            {
                var ctx = sensor.canvas.getContext('2d');

                ctx.beginPath();
                ctx.moveTo(x0, y0);
                ctx.lineTo(x1, y1);
                ctx.closePath();
                ctx.stroke();
            }

            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "drawLine(" + x0 + "," + y0 + "," + x1 + "," + y1 + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.drawRectangle = function(x0, y0, width, height, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("screen");
            if (sensor && sensor.canvas)
            {
                var ctx = sensor.canvas.getContext('2d');

                ctx.beginPath();
                ctx.rect(x0, y0, width, height);
                ctx.closePath();

                if (!context.noStroke)
                    ctx.stroke();

                if (!context.noFill)
                    ctx.fill();
            }

            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "drawRectangle(" + x0 + "," + y0 + "," + width + "," + height + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.drawCircle = function(x0, y0, diameter, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {

            var sensor = findSensorByType("screen");
            if (sensor && sensor.canvas)
            {
                var ctx = sensor.canvas.getContext('2d');

                ctx.beginPath();
                ctx.arc(x0, y0, diameter/2, 0, Math.PI*2);
                ctx.closePath();

                if (!context.noFill)
                    ctx.fill();
            }

            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "drawCircle(" + x0 + "," + y0 + "," + diameter + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.clearScreen = function(callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("screen");
            if (sensor && sensor.canvas)
            {
                var ctx = sensor.canvas.getContext('2d');

                ctx.clearRect(0, 0, sensor.canvas.width, sensor.canvas.height);

            }

            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "clearScreen()";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.updateScreen = function(callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            /*
            var sensor = findSensorByType("screen");
            if (sensor && sensor.canvas)
            {
                var ctx = sensor.canvas.getContext('2d');

                ctx.clearRect(0, 0, sensor.canvas.width, sensor.canvas.height);
            }
            */

            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "updateScreen()";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.autoUpdate = function(autoupdate, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            /*
            var sensor = findSensorByType("screen");
            if (sensor && sensor.canvas)
            {
                var ctx = sensor.canvas.getContext('2d');

                context.noFill = false;
                if (color)
                    ctx.fillStyle = "black";
                else
                    ctx.fillStyle = "white";
            }*/

            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "autoUpdate(\"" + (autoupdate ? "True" : "False") + "\")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };

    context.quickpi.fill = function(color, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("screen");
            if (sensor && sensor.canvas)
            {
                var ctx = sensor.canvas.getContext('2d');

                context.noFill = false;
                if (color)
                    ctx.fillStyle = "black";
                else
                    ctx.fillStyle = "white";
            }

            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "fill(\"" + color + "\")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.noFill = function(callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.noFill = true;

            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "NoFill()";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.stroke = function(color, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("screen");
            if (sensor && sensor.canvas)
            {
                var ctx = sensor.canvas.getContext('2d');

                context.noStroke = false;
                if (color)
                    ctx.strokeStyle = "black";
                else
                    ctx.strokeStyle = "white";
            }

            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);
            var command = "stroke(\"" + color + "\")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.noStroke = function(callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.noStroke = true;
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "noStroke()";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };


    context.quickpi.readAcceleration = function(axis, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("accelerometer");

            var index = 0;
            if (axis == "x")
                index = 0;
            else if (axis == "y")
                index = 1;
            else if (axis == "z")
                index = 2;


            context.waitDelay(callback, sensor.state[index]);
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
            var sensor = findSensorByType("accelerometer");

            var zsign = 1;
            var result = 0;

            if (sensor.state[2] < 0)
                zsign = -1;

            if (rotationType == "pitch")
            {
                result = 180 * Math.atan2 (sensor.state[0], zsign * Math.sqrt(sensor.state[1]*sensor.state[1] + sensor.state[2]*sensor.state[2]))/Math.PI;
            }
            else if (rotationType == "roll")
            {
                result = 180 * Math.atan2 (sensor.state[1], zsign * Math.sqrt(sensor.state[0]*sensor.state[0] + sensor.state[2]*sensor.state[2]))/Math.PI;
            }

            result = Math.round(result);

            context.waitDelay(callback, result);
        } else {
            var cb = context.runner.waitCallback(callback);
            var command = "computeRotation(\"" + rotationType + "\")";

            context.quickPiConnection.sendCommand(command, function (returnVal) {
                cb(returnVal);
            });
        }
    };


    context.quickpi.readSoundLevel = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    context.quickpi.readMagneticForce = function (axis, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("magnetometer");

            var index = 0;
            if (axis == "x")
                index = 0;
            else if (axis == "y")
                index = 1;
            else if (axis == "z")
                index = 2;

            context.waitDelay(callback, sensor.state[index]);
        } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("magnetometer", "i2c");

            findSensorDefinition(sensor).getLiveState(axis, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);

                if (axis == "x")
                    returnVal = returnVal[0];
                else if (axis == "y")
                    returnVal = returnVal[1];
                else if (axis == "z")
                    returnVal = returnVal[2];

                cb(returnVal);
            });
        }
    };

    context.quickpi.computeCompassHeading = function (callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("magnetometer");

            var heading = Math.atan2(sensor.state[0],sensor.state[1])*(180/Math.PI) + 180;

            heading = Math.round(heading);

            context.runner.noDelay(callback, heading);
        } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("magnetometer", "i2c");

            context.quickPiConnection.sendCommand("readMagnetometerLSM303C()", function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);

                returnVal = Math.atan2(sensor.state[0],sensor.state[1])*(180/Math.PI) + 180;

                returnVal = Math.floor(returnVal);

                cb(returnVal);
            }, true);
        }
    };

    context.quickpi.readInfraredState = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);

            context.runner.noDelay(callback, state);
        } else {
            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).getLiveState(sensor, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);
                cb(returnVal);
            });
        }
    };

    context.quickpi.setInfraredState = function (name, state, callback) {
        var sensor = findSensorByName(name, true);

        context.registerQuickPiEvent(name, state ? true : false);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            findSensorDefinition(sensor).setLiveState(sensor, state, cb);
        }
    };


    //// Gyroscope
    context.quickpi.readAngularVelocity = function (axis, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var sensor = findSensorByType("gyroscope");

            var index = 0;
            if (axis == "x")
                index = 0;
            else if (axis == "y")
                index = 1;
            else if (axis == "z")
                index = 2;

            context.waitDelay(callback, sensor.state[index]);
         } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("gyroscope", "i2c");

            findSensorDefinition(sensor).getLiveState(axis, function(returnVal) {
                sensor.state = returnVal;
                drawSensor(sensor);

                if (axis == "x")
                    returnVal = returnVal[0];
                else if (axis == "y")
                    returnVal = returnVal[1];
                else if (axis == "z")
                    returnVal = returnVal[2];

                cb(returnVal);
            });
        }
    };

    context.quickpi.setGyroZeroAngle = function (callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.runner.noDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("setGyroZeroAngle()", function(returnVal) {
                cb();
            }, true);
        }
    };

    context.quickpi.computeRotationGyro = function (axis, callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState("gyroscope", "i2c");

            context.runner.noDelay(callback, 0);
        } else {
            var cb = context.runner.waitCallback(callback);
            var sensor = context.findSensor("gyroscope", "i2c");

            context.quickPiConnection.sendCommand("computeRotationGyro()", function(returnVal) {
                //sensor.state = returnVal;
                //drawSensor(sensor);

                var returnVal = JSON.parse(returnVal);

                if (axis == "x")
                    returnVal = returnVal[0];
                else if (axis == "y")
                    returnVal = returnVal[1];
                else if (axis == "z")
                    returnVal = returnVal[2];

                cb(returnVal);
            }, true);
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
                            var name = sensor.name + "." + stickDefinition.gpiosNames[iStick];

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


    function findSensorByName(name, error=false) {

        if (isNaN(name.substring(0, 1)) && !isNaN(name.substring(1))) {
            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                var sensor = infos.quickPiSensors[i];

                if (sensor.port.toUpperCase() == name.toUpperCase()) {
                    return sensor;
                }
            }
        } else {
            var firstname = name.split(".")[0];


            for (var i = 0; i < infos.quickPiSensors.length; i++) {
                var sensor = infos.quickPiSensors[i];

                if (sensor.name.toUpperCase() == firstname.toUpperCase()) {
                    return sensor;
                }
            }
        }

        if (error) {
            context.success = false;
            throw (strings.messages.sensorNotFound.format(name));
        }

        return null;
    }

    function findSensorByType(type) {
        var firstname = name.split(".")[0];


        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];
            if (sensor.type == type) {
                return sensor;
            }
        }

        return null;
    }

    function findSensorByPort(port) {
        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];
            if (sensor.port == port) {
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

                {
                    name: "waitForButton", params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("button")
                            }
                        ]
                    }
                },
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
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("button")
                            }
                        ]
                    }
                },
                {
                    name: "readTemperature", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("temperature")
                            }
                        ]
                    }
                },
                {
                    name: "readRotaryAngle", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("potentiometer")
                            }
                        ]
                    }
                },
                {
                    name: "readDistance", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("range")
                            }
                        ]
                    }
                },
                {
                    name: "readLightIntensity", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("light")
                            }
                        ]
                    }
                },
                {
                    name: "readHumidity", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("humidity")
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
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("sound")
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
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("irrecv")
                            }
                        ]
                    }
                },
                {
                    name: "readAngularVelocity", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": [["x", "x"], ["y", "y"], ["z", "z"] ]
                            }
                        ]
                    }
                },
                {
                    name: "setGyroZeroAngle"
                },
                {
                    name: "computeRotationGyro", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": [["x", "x"], ["y", "y"], ["z", "z"] ]
                            }
                        ]
                    }
                },

            ],
            actions: [
                { name: "turnLedOn" },
                { name: "turnLedOff" },
                { name: "turnBuzzerOn" },
                { name: "turnBuzzerOff" },
                {
                    name: "setLedState", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("led")
                            },
                            { "type": "field_dropdown", "name": "PARAM_1", "options": [["ON", "1"], ["OFF", "0"]] },
                        ]
                    }
                },
                {
                    name: "setBuzzerState", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("buzzer")
                            },
                            { "type": "field_dropdown", "name": "PARAM_1", "options": [["ON", "1"], ["OFF", "0"]] },
                        ]
                    }
                },
                {
                    name: "setBuzzerNote", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("buzzer")
                            },
                            { "type": "input_value", "name": "PARAM_1"},
                        ]
                    },
                    blocklyXml: "<block type='setBuzzerNote'>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "getBuzzerNote", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("buzzer")
                            },
                        ]
                    }
                },
                {
                    name: "setLedBrightness", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("led")
                            },
                            { "type": "input_value", "name": "PARAM_1"},
                        ]
                    },
                    blocklyXml: "<block type='setLedBrightness'>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "getBuzzerState", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("buzzer")
                            },
                        ]
                    }
                },

                {
                    name: "getLedState", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("led")
                            },
                        ]
                    }
                },
                {
                    name: "getLedBrightness", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("led")
                            },
                        ]
                    }
                },
                {
                    name: "isLedOn", yieldsValue: true
                },
                {
                    name: "isBuzzerOn", yieldsValue: true
                },
                {
                    name: "toggleLedState", params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("led")
                            },
                        ]
                    }
                },

                {
                    name: "setServoAngle", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("servo")
                            },
                            { "type": "input_value", "name": "PARAM_1" },

                        ]
                    },
                    blocklyXml: "<block type='setServoAngle'>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "getServoAngle", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("servo")
                            },
                        ]
                    }
                },
                {
                    name: "setInfraredState", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {"type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("irtrans")},
                            { "type": "field_dropdown", "name": "PARAM_1", "options": [["ON", "1"], ["OFF", "0"]] },
                        ]
                    }
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
            ],
            display: [
                {
                    name: "displayText", params: ["String", "String", "String"], blocklyJson: {
                        "args0": [
                            { "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("screen") },
                            { "type": "input_value", "name": "PARAM_1", "text": "" },
                            { "type": "input_value", "name": "PARAM_2", "text": "" },
                        ]
                    },
                    blocklyXml: "<block type='displayText'>" +
                        "<value name='PARAM_1'><shadow type='text'><field name='TEXT'>Bonjour</field> </shadow></value>" +
                        "<value name='PARAM_2'><shadow type='text'><field name='TEXT'></field> </shadow></value>" +
                        "</block>"

                },
                {
                    name: "drawPoint", params: ["Number", "Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                            { "type": "input_value", "name": "PARAM_1"},
                        ]
                    },
                    blocklyXml: "<block type='drawPoint'>" +
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
                    name: "drawRectangle", params: ["Number", "Number", "Number", "Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                            { "type": "input_value", "name": "PARAM_1"},
                            { "type": "input_value", "name": "PARAM_2"},
                            { "type": "input_value", "name": "PARAM_3"},
                        ]
                    },
                    blocklyXml: "<block type='drawRectangle'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_2'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_3'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "drawCircle", params: ["Number", "Number", "Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                            { "type": "input_value", "name": "PARAM_1"},
                            { "type": "input_value", "name": "PARAM_2"},
                        ]
                    },
                    blocklyXml: "<block type='drawCircle'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_1'><shadow type='math_number'></shadow></value>" +
                        "<value name='PARAM_2'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },

                {
                    name: "clearScreen"
                },
                {
                    name: "updateScreen"
                },
                {
                    name: "autoUpdate", params: ["Boolean"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                        ],
                    },
                    blocklyXml: "<block type='autoUpdate'>" +
                    "<value name='PARAM_0'><shadow type='logic_boolean'></shadow></value>" +
                    "</block>"

                },
                {
                    name: "fill", params: ["Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                        ]
                    },
                    blocklyXml: "<block type='fill'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "noFill"
                },
                {
                    name: "stroke", params: ["Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                        ]
                    },
                    blocklyXml: "<block type='stroke'>" +
                        "<value name='PARAM_0'><shadow type='math_number'></shadow></value>" +
                        "</block>"
                },
                {
                    name: "noStroke"
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
                display: 300,
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

    if (sensorWithSlider && sensorWithSlider.sliders) {
        for (var i = 0; i < sensorWithSlider.sliders.length; i++) {
            sensorWithSlider.sliders[i].slider.forEach(function (element) {
                if (target == element.node ||
                    target.parentNode == element.node) {
                    keep = true;
                    return false;
                }
            });
        }
    }

    if (!keep) {
        hideSlider(sensorWithSlider);
    }

}, false);//<-- we'll get to the false in a minute


function hideSlider(sensor) {
    if (!sensor)
        return;

    if (sensor.sliders) {
        for (var i = 0; i < sensor.sliders.length; i++) {
            sensor.sliders[i].slider.remove();
        }
        sensor.sliders = [];
    }


    if (sensor.focusrect && sensor.focusrect.paper && sensor.focusrect.paper.canvas)
        sensor.focusrect.toFront();
};
