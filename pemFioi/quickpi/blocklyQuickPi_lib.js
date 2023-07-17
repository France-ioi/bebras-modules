//"use strict";
var quickPiLocalLanguageStrings = {
    fr: { // French strings
        label: {
            // Labels for the blocks
            sleep: "attendre %1 millisecondes",
            currentTime: "temps écoulé en millisecondes",

            turnLedOn: "allumer la LED",
            turnLedOff: "éteindre la LED",

            setLedState: "passer la LED %1 à %2 ",
            toggleLedState: "inverser la LED %1",

            isLedOn: "LED allumée",
            isLedOnWithName: "LED %1 allumée",

            setLedBrightness: "mettre la luminosité de %1 à %2",
            getLedBrightness: "lire la luminosité de %1",

            turnBuzzerOn: "allumer le buzzer",
            turnBuzzerOff: "éteindre le buzzer",
            setBuzzerState: "mettre le buzzer %1 à %2",
            isBuzzerOn: "buzzer allumé",
            isBuzzerOnWithName: "buzzer %1 allumé",

            setBuzzerNote: "jouer la fréquence %2Hz sur %1",
            getBuzzerNote: "fréquence du buzzer %1",

            isButtonPressed: "bouton enfoncé",
            isButtonPressedWithName: "bouton  %1 enfoncé",
            waitForButton: "attendre une pression sur le bouton",
            buttonWasPressed: "le bouton a été enfoncé",

            displayText: "afficher %1",
            displayText2Lines: "afficher Ligne 1 : %1 Ligne 2 : %2",

            readTemperature: "température ambiante",
            getTemperatureFromCloud: "temperature de la ville %1",

            readRotaryAngle: "état du potentiomètre %1",
            readDistance: "distance mesurée par %1",
            readLightIntensity: "intensité lumineuse",
            readHumidity: "humidité ambiante",

            setServoAngle: "mettre le servo %1 à l'angle %2",
            getServoAngle: "angle du servo %1",

            setContinousServoDirection: "la direction du servo continu  %1 %2",

            drawPoint: "dessiner un pixel en x₀: %1 y₀: %2",
            isPointSet: "pixel affiché en x₀: %1 y₀: %2",
            drawLine: "ligne x₀: %1 y₀: %2 x₁: %3 y₁: %4",
            drawRectangle: "rectangle x₀: %1 y₀: %2 largeur₀: %3 hauteur₀: %4",
            drawCircle: "cercle x₀: %1 y₀: %2 diamètre₀: %3",
            clearScreen: "effacer tout l'écran",
            updateScreen: "mettre à jour l'écran",
            autoUpdate: "mode de mise à jour automatique de l'écran",

            fill: "mettre la couleur de remplissage à %1",
            noFill: "ne pas remplir les formes",
            stroke: "mettre la couleur de tracé à %1",
            noStroke: "ne pas dessiner les contours",

            readAcceleration: "accélération en (m/s²) dans l'axe %1",
            computeRotation: "calcul de l'angle de rotation (°) sur l'accéléromètre %1",
            readSoundLevel: "volume sonore",

            readMagneticForce: "champ magnétique (µT) sur %1",
            computeCompassHeading: "direction de la boussole en (°)",

            readInfraredState: "infrarouge détecté sur %1",
            setInfraredState: "mettre l'émetteur infrarouge %1 à %2",

            // Gyroscope
            readAngularVelocity: "vitesse angulaire (°/s) du gyroscope %1",
            setGyroZeroAngle: "initialiser le gyroscope à l'état zéro",
            computeRotationGyro: "calculer la rotation du gyroscope %1",

            //Internet store
            connectToCloudStore: "se connecter au cloud. Identifiant %1 Mot de passe %2",
            writeToCloudStore: "écrire dans le cloud : identifiant %1 clé %2 valeur %3",
            readFromCloudStore: "lire dans le cloud : identifiant %1 clé %2",

            // IR Remote
            readIRMessage: "attendre un message IR nom : %1 pendant : %2 ms",
            sendIRMessage: "envoi du message préparé IR nommé %2 sur %1",
            presetIRMessage: "préparer un message IR de nom %1 et contenu %2",
        },
        code: {
            // Names of the functions in Python, or Blockly translated in JavaScript
            turnLedOn: "turnLedOn",
            turnLedOff: "turnLedOff",
            setLedState: "setLedState",

            isButtonPressed: "isButtonPressed",
            isButtonPressedWithName : "isButtonPressed",
            waitForButton: "waitForButton",
            buttonWasPressed: "buttonWasPressed",

            toggleLedState: "toggleLedState",
            displayText: "displayText",
            displayText2Lines: "displayText",
            readTemperature: "readTemperature",
            sleep: "sleep",
            setServoAngle: "setServoAngle",
            readRotaryAngle: "readRotaryAngle",
            readDistance: "readDistance",
            readLightIntensity: "readLightIntensity",
            readHumidity: "readHumidity",
            currentTime: "currentTime",
            getTemperatureFromCloud: "getTemperatureFromCloud",

            isLedOn: "isLedOn",
            isLedOnWithName: "isLedOn",

            setBuzzerNote: "setBuzzerNote",
            getBuzzerNote: "getBuzzerNote",
            setLedBrightness: "setLedBrightness",
            getLedBrightness: "getLedBrightness",
            getServoAngle: "getServoAngle",

            setBuzzerState: "setBuzzerState",
            setBuzzerNote: "setBuzzerNote",

            turnBuzzerOn: "turnBuzzerOn",
            turnBuzzerOff: "turnBuzzerOff",
            isBuzzerOn: "isBuzzerOn",
            isBuzzerOnWithName: "isBuzzerOn",


            drawPoint: "drawPoint",
            isPointSet: "isPointSet",
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

            //Internet store
            connectToCloudStore: "connectToCloudStore",
            writeToCloudStore: "writeToCloudStore",
            readFromCloudStore: "readFromCloudStore",                

            // IR Remote
            readIRMessage: "readIRMessage",
            sendIRMessage: "sendIRMessage",
            presetIRMessage: "presetIRMessage",

            //Continous servo
            setContinousServoDirection: "setContinousServoDirection",
        },
        description: {
            // Descriptions of the functions in Python (optional)
            turnLedOn: "turnLedOn() allume la LED",
            turnLedOff: "turnLedOff() éteint la LED",
            isButtonPressed: "isButtonPressed() retourne True si le bouton est enfoncé, False sinon",
            isButtonPressedWithName: "isButtonPressed(button) retourne True si le bouton est enfoncé, False sinon",
            waitForButton: "waitForButton(button) met en pause l'exécution jusqu'à ce que le bouton soit appuyé",
            buttonWasPressed: "buttonWasPressed(button) indique si le bouton a été appuyé depuis le dernier appel à cette fonction",
            setLedState: "setLedState(led, state) modifie l'état de la LED : True pour l'allumer, False pour l'éteindre",
            toggleLedState: "toggleLedState(led) inverse l'état de la LED",
            displayText: "displayText(line1, line2) affiche une ou deux lignes de texte. line2 est optionnel",
            displayText2Lines: "displayText(line1, line2) affiche une ou deux lignes de texte. line2 est optionnel",
            readTemperature: "readTemperature(thermometer) retourne la température ambiante",
            sleep: "sleep(milliseconds) met en pause l'exécution pendant une durée en ms",
            setServoAngle: "setServoAngle(servo, angle) change l'angle du servomoteur",
            readRotaryAngle: "readRotaryAngle(potentiometer) retourne la position potentiomètre",
            readDistance: "readDistance(distanceSensor) retourne la distance mesurée",
            readLightIntensity: "readLightIntensity(lightSensor) retourne l'intensité lumineuse",
            readHumidity: "readHumidity(hygrometer) retourne l'humidité ambiante",
            currentTime: "currentTime() temps en millisecondes depuis le début du programme",

            setLedBrightness: "setLedBrightness(led, brightness) règle l'intensité lumineuse de la LED",
            getLedBrightness: "getLedBrightness(led) retourne l'intensité lumineuse de la LED",
            getServoAngle: "getServoAngle(servo) retourne l'angle du servomoteur",

            isLedOn: "isLedOn() retourne True si la LED est allumée, False si elle est éteinte",
            isLedOnWithName: "isLedOn(led) retourne True si la LED est allumée, False sinon",

            turnBuzzerOn: "turnBuzzerOn() allume le buzzer",
            turnBuzzerOff: "turnBuzzerOff() éteint le buzzer",

            isBuzzerOn: "isBuzzerOn() retourne True si le buzzer est allumé, False sinon",
            isBuzzerOnWithName: "isBuzzerOn(buzzer) retourne True si le buzzer est allumé, False sinon",

            setBuzzerState: "setBuzzerState(buzzer, state) modifie l'état du buzzer: True pour allumé, False sinon",
            setBuzzerNote: "setBuzzerNote(buzzer, frequency) fait sonner le buzzer à la fréquence indiquée",
            getBuzzerNote: "getBuzzerNote(buzzer) retourne la fréquence actuelle du buzzer",

            getTemperatureFromCloud: "getTemperatureFromCloud(town) retourne la température dans la ville donnée",

            drawPoint: "drawPoint(x, y) dessine un point de un pixel aux coordonnées données",
            isPointSet: "isPointSet(x, y) retourne True si le point aux coordonées x, y est actif",
            drawLine: "drawLine(x0, y0, x1, y1) dessine un segment commençant en x0, y0 jusqu'à x1, y1",
            drawRectangle: "drawRectangle(x0, y0, width, height) dessine un rectangle, de coin haut gauche (x0,y0)",
            drawCircle: "drawCircle(x0, y0, diameter) dessine un cercle de centre x0, y0 et de diamètre donné",
            clearScreen: "clearScreen() efface le contenu de l'écran",
            updateScreen: "updateScreen() mettre à jour l'écran",
            autoUpdate: "autoUpdate(auto) change le mode d'actualisation de l'écran",

            fill: "fill(color) Remplir les formes avec la couleur donnée",
            noFill: "noFill() Ne pas remplir les formes",
            stroke: "stroke(color) dessiner les bords des figures avec la couleur donnée",
            noStroke: "noStroke() ne pas dessiner les bordures des figures",


            readAcceleration: "readAcceleration(axis) lit l'accélération en m/s² sur l'axe (X, Y ou Z)",
            computeRotation: "computeRotation(axis) calcule l'angle de rotation en degrés sur l'accéléromètre",

            readSoundLevel: "readSoundLevel(port) retourne le volume ambiant",


            readMagneticForce: "readMagneticForce(axis) retourne le champ magnétique (µT) sur l'axe (X, Y ou Z)",
            computeCompassHeading: "computeCompassHeading() retourne la direction de la boussole en degrés",

            readInfraredState: "readInfraredState(IRReceiver) retourne True si un signal infra-rouge est détecté, False sinon",
            setInfraredState: "setInfraredState(IREmitter, state) modifie l'état de l'émetteur : True pour l'allumer, False pour l'éteindre",

            // Gyroscope
            readAngularVelocity: "readAngularVelocity(axis) retourne la vitesse engulairee (°/s) du gyroscope",
            setGyroZeroAngle: "setGyroZeroAngle() initialize le gyroscope à l'état 0",
            computeRotationGyro: "computeRotationGyro(axis) calcule la rotation du gyroscope en degrés",

            //Internet store
            connectToCloudStore: "connectToCloudStore(identifier, password) se connecter au cloud avec le nom d'utilisateur et le mot de passe donnés",
            writeToCloudStore: "writeToCloudStore(identifier, key, value) écrire une valeur sur une clé dans le cloud",
            readFromCloudStore: "readFromCloudStore(identifier, key) retourne la valeur lue dans le cloud de la clé donnée",

            // IR Remote
            readIRMessage: "readIRMessage(irrec, timeout) attends un message infrarouge pendant le temps donné en millisecondes et le renvois",
            sendIRMessage: "sendIRMessage(irtrans, name) envoi un message infrarouge précédement configurer avec le nom donné",
            presetIRMessage: "presetIRMessage(name, data) configure un message infrarouge de nom name et de donné data",

            //Continous servo
            setContinousServoDirection: "setContinousServoDirection(servo, direction)",
        },
        constant: {
        },

        startingBlockName: "Programme", // Name for the starting block
        messages: {
            sensorNotFound: "Accès à un capteur ou actuateur inexistant : {0}.",
            manualTestSuccess: "Test automatique validé.",
            testSuccess: "Bravo ! La sortie est correcte",
            wrongState: "Test échoué : <code>{0}</code> a été dans l'état {1} au lieu de {2} à t={3}ms.",
            wrongStateDrawing: "Test échoué : <code>{0}</code> diffère de {1} pixels par rapport à l'affichage attendu à t={2}ms.",
            wrongStateSensor: "Test échoué : votre programme n'a pas lu l'état de <code>{0}</code> après t={1}ms.",
            programEnded: "Programme terminé.",
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
            drawing: "dessin",
            timeLabel: "Temps",
            seconds: "secondes",

            changeBoard: "Changer de carte",
            connect: "Connecter",
            install: "Installer",
            config: "Config",

     
            raspiConfig: "Configuration du Raspberry Pi",
            local: "Local",
            schoolKey: "Indiquez un identifiant d'école",
            connectList: "Sélectionnez un appareil à connecter dans la liste suivante",
            enterIpAddress: "ou entrez son adesse IP",
            getPiList: "Obtenir la liste",
            connectTroughtTunnel: "Connecter à travers le France-ioi tunnel",

            connectToLocalhost: "Connecter l'interface à la machine sur laquelle tourne ce navigateur",
            connectToWindowLocation: "Connecter au Raspberry Pi depuis lequel cette page est chargée",

            connectToDevice: "Connecter l'appareil",
            disconnectFromDevice: "Déconnecter",
       

            irReceiverTitle: "Recevoir des codes infrarouges",
            directIrControl: "Dirigez votre télécommande vers votre carte QuickPi et appuyez sur un des boutons",
            getIrCode: "Recevoir un code",
            closeDialog: "Fermer",

            irRemoteControl: "Télécommande IR",
            
            noIrPresets: "Veuillez utiliser la fonction de préparation de messages IR pour ajouter des commandes de télécommande",
            irEnableContinous: "Activer l'émission IR en continu",
            irDisableContinous: "Désactiver l'émission IR en continu",

            connectToLocalHost: "Connecter l'interface à la machine sur laquelle tourne ce navigateur",

            up: "up",
            down: "down",
            left: "left",
            right: "right",
            center: "center",

            on: "On",
            off: "Off",

            grovehat: "Grove Base Hat for Raspberry Pi",
            quickpihat: "France IOI QuickPi Hat",
            pinohat: "Raspberry Pi without hat",
            led: "LED",
            blueled: "LED bleue",
            greenled: "LED verte",
            orangeled: "LED orange",
            redled: "LED rouge",
            buzzer: "Buzzer",
            grovebuzzer: "Grove Buzzer",
            quickpibuzzer: "Quick Pi Passive Buzzer",
            servo: "Servo Motor",
            screen: "Screen",
            grove16x2lcd: "Grove 16x2 LCD",
            oled128x32: "128x32 Oled Screen",
            irtrans: "IR Transmiter",
            button: "Button",
            fivewaybutton: "5 way button",
            tempsensor: "Temperature sensor",
            groveanalogtempsensor: "Grove Analog tempeature sensor",
            quickpigyrotempsensor: "Quick Pi Accelerometer+Gyroscope temperature sensor",
            dht11tempsensor: "DHT11 Tempeature Sensor",
            potentiometer: "Potentiometer",
            lightsensor: "Light sensor",
            distancesensor: "Capteur de distance",
            timeofflightranger: "Time of flight distance sensor",
            ultrasonicranger: "Capteur de distance à ultrason",
            humiditysensor: "Humidity sensor",
            soundsensor: "Sound sensor",
            accelerometerbmi160: "Accelerometer sensor (BMI160)",
            gyrobmi160: "Gyropscope sensor (BMI160)",
            maglsm303c: "Magnetometer sensor (LSM303C)",
            irreceiver: "IR Receiver",
            cloudstore: "Cloud Store",
            addcomponent: "Ajouter un composant",
            selectcomponent: "Sélectionnez un composant à ajouter à votre Raspberry Pi et attachez-le à un port.",
            add: "Ajouter",
            builtin: "(builtin)",
            chooseBoard: "Choisissez votre carte",
            nameandports: "Noms et ports des capteurs et actionneurs QuickPi",
            name: "Name",
            port: "Port",
            state: "State",

            cloudTypes: {
                object: "Dictionnaire",
                array: "Tableau",
                boolean: "Booléen",
                number: "Nombre",
                string: "Chaîne de caractère"
            },
            cloudMissingKey: "Test échoué : Il vous manque la clé {0} dans le cloud.",
            cloudMoreKey: "Test échoué : La clé {0} est en trop dans le cloud",
            cloudUnexpectedKeyCorrection: "Test échoué : La clé {0} n'étais pas attendu dans le cloud",
            cloudPrimitiveWrongKey: "Test échoué : À la clé {0} du cloud, la valeur {1} était attendue au lieu de {2}",
            cloudArrayWrongKey: "Test échoué : Le tableau à la clé {0} du cloud diffère de celui attendu.",
            cloudDictionaryWrongKey: "Test échoué : Le dictionnaire à la clé {0} diffère de celui attendu",
            cloudWrongType: "Test échoué : Vous avez stocké une valeur de type \"{0}\" dans la clé {1} du cloud, mais le type \"{2}\" était attendu.",

            cloudKeyNotExists: "La clé n'existe pas : {0} ",
            cloudWrongValue: "Clé {0} : la valeur {2} n'est pas celle attendue, {1}.",
            cloudUnexpectedKey: "La clé {0} n'est pas une clé attendue",
            hello: "Bonjour",

            getTemperatureFromCloudWrongValue: "getTemperatureFromCloud: {0} n'est pas une ville supportée par getTemperatureFromCloud",

            experiment: "Expérimenter",
            validate: "Valider",
            validate1: "Valider 1",
            validate2: "Valider 2",
            validate3: "Valider 3",

            sensorNameBuzzer: "buzzer",
            sensorNameLed: "led",
            sensorNameRedLed: "redled",
            sensorNameGreenLed: "greenled",
            sensorNameBlueLed: "blueled",
            sensorNameOrangeLed: "orangeled",
            sensorNameScreen: "screen",
            sensorNameIrTrans: "irtran",
            sensorNameIrRecv: "irrec",
            sensorNameMicrophone: "micro",
            sensorNameTemperature: "temp",
            sensorNameGyroscope: "gyroscope",
            sensorNameMagnetometer: "magneto",
            sensorNameDistance: "distance",
            sensorNameAccelerometer: "accel",
            sensorNameButton: "button",
            sensorNameLight: "light",
            sensorNameStick: "stick",
            sensorNameServo: "servo",
            sensorNameHumidity: "humidity",
            sensorNamePotentiometer: "pot",
            sensorNameCloudStore: "cloud"
        },
        concepts: {
            quickpi_start: 'Créer un programme',
            quickpi_validation: 'Valider son programme',
            quickpi_buzzer: 'Buzzer',
            quickpi_led: 'LEDs',
            quickpi_button: 'Boutons et manette',
            quickpi_screen: 'Écran',
            quickpi_draw: 'Dessiner',
            quickpi_range: 'Capteur de distance',
            quickpi_servo: 'Servomoteur',
            quickpi_thermometer: 'Thermomètre',
            quickpi_microphone: 'Microphone',
            quickpi_light_sensor: 'Capteur de luminosité',
            quickpi_accelerometer: 'Accéléromètre',
            quickpi_wait: 'Gestion du temps',
            quickpi_magneto: 'Magnétomètre',
            quickpi_ir_receiver: 'Récepteur infrarouge',
            quickpi_ir_emitter: 'Émetteur infrarouge',
            quickpi_potentiometer: "Potentiomètre",
            quickpi_gyroscope: "Gyroscope",
            quickpi_cloud: 'Stockage dans le cloud'
        }
    },
    es: {
        label: {
            // Labels for the blocks
            sleep: "esperar %1 milisegundos",
            currentTime: "tiempo transcurrido en milisegundos",

            turnLedOn: "encender el LED",
            turnLedOff: "apagar el LED",

            setLedState: "cambiar el LED %1 a %2 ",
            toggleLedState: "invertir el estado del LED %1",

            isLedOn: "LED encendido",
            isLedOnWithName: "LED %1 encendido",

            setLedBrightness: "Cambiar el brillo de %1 a %2",
            getLedBrightness: "Obtener el brillo de %1",

            turnBuzzerOn: "encender el zumbador",
            turnBuzzerOff: "apagar el zumbador",
            setBuzzerState: "cambiar el zumbador %1 a %2",
            isBuzzerOn: "zumbador encendido",
            isBuzzerOnWithName: "zumbador %1 encendido",

            setBuzzerNote: "frequencia de reproducción %2Hz en %1",
            getBuzzerNote: "frequncia del zumbador %1",

            isButtonPressed: "botón presionado",
            isButtonPressedWithName: "botón  %1 presionado",
            waitForButton: "esperar a que se presione un botón",
            buttonWasPressed: "el botón ha sido presionado",

            displayText: "desplegar texto %1",
            displayText2Lines: "desplegar texto Linea 1 : %1 Linea 2 : %2",

            readTemperature: "temperatura ambiente",
            getTemperatureFromCloud: "temperatura de la ciudad %1", // TODO: verify

            readRotaryAngle: "estado del potenciómetro %1",
            readDistance: "distancia medida por %1",
            readLightIntensity: "intensidad de luz",
            readHumidity: "humedad ambiental",

            setServoAngle: "cambiar el ángulo de el servo %1 a %2°",
            getServoAngle: "ángulo del servo %1",


            drawPoint: "dibuja un pixel",
            isPointSet: "este pixel esta dibujado",
            drawLine: "linea desde x₀: %1 y₀: %2 hasta x₁: %3 y₁: %4",
            drawRectangle: "rectángulo  x: %1 y: %2 largo: %3 alto: %4",
            drawCircle: "circulo x₀: %1 y₀: %2 diametro: %3",
            clearScreen: "limpiar toda la pantalla",
            updateScreen: "actualizar pantalla",
            autoUpdate: "modo de actualización de pantalla automática",

            fill: "establecer el color de fondo en %1",
            noFill: "no rellenar figuras",
            stroke: "color de los bordes %1",
            noStroke: "no dibujar los contornos",

            readAcceleration: "aceleración en m/s² en el eje %1",
            computeRotation: "cálculo del ángulo de rotación (°) en el acelerómetro %1",
            readSoundLevel: "volumen de sonido",

            readMagneticForce: "campo magnético (µT) en %1",
            computeCompassHeading: "dirección de la brújula en (°)",

            readInfraredState: "infrarrojos detectados en %1",
            setInfraredState: "cambiar emisor de infrarrojos %1 a %2",

            // Gyroscope
            readAngularVelocity: "velocidad angular (°/s) del guroscopio %1",
            setGyroZeroAngle: "inicializar el giroscopio a estado cero",
            computeRotationGyro: "calcular la rotación del giroscopio %1",

            //Internet store
            connectToCloudStore: "conectar a la nube. Usuario %1 Contraseña %2",
            writeToCloudStore: "escribir en la nube : Usuario %1 llave %2 valor %3",
            readFromCloudStore: "leer de la nube : Usuario %1 lave %2",

            // IR Remote
            readIRMessage: "esperar un mensaje de infrarrojos : %1 durante : %2 ms",
            sendIRMessage: "enviar el mensaje por infrarrojos %2 por %1",
            presetIRMessage: "preparar un mensaje de infrarrojos con el nombre %1 y el contenido %2",

            //Continous servo
            setContinousServoDirection: "cambiar la dirección del servomotor continuo %1 %2",
        },
        code: {
            // Names of the functions in Python, or Blockly translated in JavaScript
            turnLedOn: "turnLedOn",
            turnLedOff: "turnLedOff",
            setLedState: "setLedState",

            isButtonPressed: "isButtonPressed",
            isButtonPressedWithName : "isButtonPressed",
            waitForButton: "waitForButton",
            buttonWasPressed: "buttonWasPressed",

            toggleLedState: "toggleLedState",
            displayText: "displayText",
            displayText2Lines: "displayText",
            readTemperature: "readTemperature",
            sleep: "sleep",
            setServoAngle: "setServoAngle",
            readRotaryAngle: "readRotaryAngle",
            readDistance: "readDistance",
            readLightIntensity: "readLightIntensity",
            readHumidity: "readHumidity",
            currentTime: "currentTime",
            getTemperatureFromCloud: "getTemperatureFromCloud",

            isLedOn: "isLedOn",
            isLedOnWithName: "isLedOn",

            setBuzzerNote: "setBuzzerNote",
            getBuzzerNote: "getBuzzerNote",
            setLedBrightness: "setLedBrightness",
            getLedBrightness: "getLedBrightness",
            getServoAngle: "getServoAngle",

            setBuzzerState: "setBuzzerState",
            setBuzzerNote: "setBuzzerNote",

            turnBuzzerOn: "turnBuzzerOn",
            turnBuzzerOff: "turnBuzzerOff",
            isBuzzerOn: "isBuzzerOn",
            isBuzzerOnWithName: "isBuzzerOn",


            drawPoint: "drawPoint",
            isPointSet: "isPointSet",
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

            //Internet store
            connectToCloudStore: "connectToCloudStore",
            writeToCloudStore: "writeToCloudStore",
            readFromCloudStore: "readFromCloudStore",                

            // IR Remote
            readIRMessage: "readIRMessage",
            sendIRMessage: "sendIRMessage",
            presetIRMessage: "presetIRMessage",

            //Continous servo
            setContinousServoDirection: "setContinousServoDirection",
        },
        description: {
            // Descriptions of the functions in Python (optional)
            turnLedOn: "turnLedOn() enciende el LED",
            turnLedOff: "turnLedOff() apaga el led LED",
            isButtonPressed: "isButtonPressed() devuelve True si el boton esta presionado, False de otra manera",
            isButtonPressedWithName: "isButtonPressed(button) devuelve True si el boton esta presionado, False de otra manera",
            waitForButton: "waitForButton(button) pausa la ejecución hasta que se presiona el botón",
            buttonWasPressed: "buttonWasPressed(button) indica si se ha pulsado el botón desde la última llamada a esta función",
            setLedState: "setLedState(led, state) modifica el estado del LED: True para encenderlo, False para apagarlo",
            toggleLedState: "toggleLedState(led) invierte el estado del LED",
            displayText: "displayText(line1, line2) muestra una o dos líneas de texto. line2 es opcional",
            displayText2Lines: "displayText(line1, line2) muestra una o dos líneas de texto. line2 es opcional",
            readTemperature: "readTemperature(thermometer) devuelve la temperatura ambiente",
            sleep: "sleep(milliseconds) pausa la ejecución por un tiempo en milisegundos",
            setServoAngle: "setServoAngle(servo, angle) cambiar el ángulo del servomotor",
            readRotaryAngle: "readRotaryAngle(potentiometer) devuelve la posición del potenciómetro",
            readDistance: "readDistance(distanceSensor) devuelve la distancia medida",
            readLightIntensity: "readLightIntensity(lightSensor) devuelve la intensidad de la luz",
            readHumidity: "readHumidity(hygrometer) devuelve la humedad ambiental",
            currentTime: "currentTime() tiempo en milisegundos desde el inicio del programa",

            setLedBrightness: "setLedBrightness(led, brightness) ajusta la intensidad de la luz del LED",
            getLedBrightness: "getLedBrightness(led) devuelve la intensidad de luz del LED",
            getServoAngle: "getServoAngle(servo) devuelve el ángulo del servomotor",

            isLedOn: "isLedOn() devuelve True si el LED está encendido, False si está apagado",
            isLedOnWithName: "isLedOn(led) devuelve True si el LED está encendido, False si está apagado",

            turnBuzzerOn: "turnBuzzerOn() enciende el zumbador",
            turnBuzzerOff: "turnBuzzerOff() apaga el zumbador",

            isBuzzerOn: "isBuzzerOn() devuelve True si el zumbador está encendido, False si está apagado",
            isBuzzerOnWithName: "isBuzzerOn(buzzer) devuelve True si el zumbador está encendido, False si está apagado",

            setBuzzerState: "setBuzzerState(buzzer, state) modifica el estado del zumbador: Verdadero para encendido, Falso para apagado",
            setBuzzerNote: "setBuzzerNote(buzzer, frequency) suena el zumbador en la frecuencia indicada",
            getBuzzerNote: "getBuzzerNote(buzzer) devuelve la frecuencia actual del zumbador",

            getTemperatureFromCloud: "getTemperatureFromCloud(town) obtiene la temperatura de la ciudad", // TODO: Verify

            drawPoint: "drawPoint(x, y) dibuja un punto en las coordenadas x, y",
            isPointSet: "isPointSet(x, y) devuelve True se dibujó sobre el punto x, y, False de lo contrario",
            drawLine: "drawLine(x0, y0, x1, y1) dibuja una linea empezando desde el punto x0, x1, hasta el punto x1, y1",
            drawRectangle: "drawRectangle(x0, y0, width, height) dibuja un rectángulo empezando en el punto x0, y0 con el ancho y altura dados",
            drawCircle: "drawCircle(x0, y0, diameter) dibuja un circulo con centro en x0, y0 y el diametro dado",
            clearScreen: "clearScreen() limpia toda la pantalla",
            updateScreen: "updateScreen() actualiza los contenidos de la pantalla",
            autoUpdate: "autoUpdate(auto) cambia el modo de actualización de pantalla automatica",

            fill: "fill(color) rellenar las figuras con el color dado",
            noFill: "noFill() no rellenar las figuras",
            stroke: "stroke(color) dibujar los bordes de las figuras con el color dado",
            noStroke: "noStroke() no dibujar los bordes de las figuras",


            readAcceleration: "readAcceleration(axis) leer la acceleración (m/s²) en el eje (X, Y o Z)",
            computeRotation: "computeRotation(axis) calcular el ángulo de rotación (°) en el acelerómetro",

            readSoundLevel: "readSoundLevel(port) devuelve el volumen del sonido ambiente",


            readMagneticForce: "readMagneticForce(axis) devuelve el campo magnético (µT) en el eje (X, Y o Z)",
            computeCompassHeading: "computeCompassHeading() devuelve la dirección de la brujula en grados",

            readInfraredState: "readInfraredState() devuelve True si se detecta una señal infrarroja, Falso de otra manera",
            setInfraredState: "setInfraredState(state) si se le pasa True enciende el transmisor infrarrojo, Falso lo apaga",

            // Gyroscope
            readAngularVelocity: "readAngularVelocity(axis) devuelve la velocidad angular (°/s) del gyroscopio",
            setGyroZeroAngle: "setGyroZeroAngle() inicializa el giroscopio a estado cero",
            computeRotationGyro: "computeRotationGyro(axis) calcula la rotación del giroscopio (°)",

            //Internet store
            connectToCloudStore: "connectToCloudStore(identifier, password) se conecta a la nube con el usuario y password dados",
            writeToCloudStore: "writeToCloudStore(identifier, key, value) escribe un valor a un llave en la nube",
            readFromCloudStore: "readFromCloudStore(identifier, key) devuelve un valor leido de la nube de la llave dada",

            // IR Remote
            readIRMessage: "readIRMessage(irrec, timeout) espera por un mensaje infrarrojo y lo devuelve durante el tiempo dado en milisegundos",
            sendIRMessage: "sendIRMessage(irtrans, name) envia un mensaje infrarrojo previamente configurado con el nombre dado",
            presetIRMessage: "presetIRMessage(name, data) configura un mensaje infrarrojo con el nombre y datos dados",

            //Continous servo
            setContinousServoDirection: "setContinousServoDirection(servo, direction) cambia la dirección de un servomotor",
        },
        constant: {
        },

        startingBlockName: "Programa", // Name for the starting block
        messages: {
            sensorNotFound: "Acceso a un componente inexistente: {0}.",
            manualTestSuccess: "Prueba automática validada.",
            testSuccess: "Bien hecho! El resultado es correcto",
            wrongState: "Prueba fallida: <code>{0}</code> estaba en etado {1} en lugar de {2} en t={3}ms.",
            wrongStateDrawing: "Prueba fallida: <code>{0}</code> difiere en {1} píxeles de la visualización esperada en t = {2} ms.",
            wrongStateSensor: "Prueba fallida: su programa no leyó el estado de <code>{0}</code> después de t = {1} ms.",
            programEnded: "Programa completado.",
            piPlocked: "El dispositivo está bloqueado. Desbloquear o reiniciar.",
            cantConnect: "No puede conectarse al dispositivo.",
            wrongVersion: "El software en tu Raspberry Pi es demasiado antiguo, actualízalo.",
            sensorInOnlineMode: "No se pueden modificar sensores en modo conectado.",
            actuatorsWhenRunning: "No se pueden cambiar los actuadores mientras se ejecuta un programa",
            cantConnectoToUSB: 'Intentado conectarse por USB, conecta tu Raspberry Pi al puerto USB <i class="fas fa-circle-notch fa-spin"></i>',
            cantConnectoToBT: 'Intentando conectarse por Bluetooth, conecta tu Raspberry Pi por Bluetooth <i class="fas fa-circle-notch fa-spin"></i>',
            canConnectoToUSB: "USB Conectado.",
            canConnectoToBT: "Bluetooth Conectado.",
            noPortsAvailable: "No hay ningún puerto compatible con {0} disponible (type {1})",
            sensor: "Sensor",
            actuator: "Actuador",
            removeConfirmation: "¿Estás seguro de que deseas quitar este componente?",
            remove: "Eliminar",
            keep: "Mantener",
            minutesago: "Visto por última vez hace {0} minutos",
            hoursago: "Visto por ultima vez hace mas de una hora",
            drawing: "dibujando",
            timeLabel: "Tiempo",
            seconds: "segundos",

            changeBoard: "Cambiar tablero",
            connect: "Conectar",
            install: "Instalar",
            config: "Configuración",

     
            raspiConfig: "Configuración de Raspberry Pi",
            local: "Local",
            schoolKey: "Ingresa una identificación de la escuela",
            connectList: "Selecciona un dispositivo para conectarte de la siguiente lista",
            enterIpAddress: "o ingresa una dirección IP",
            getPiList: "Obtener la lista",
            connectTroughtTunnel: "Conéctate a través del túnel de France-ioi",

            connectToLocalhost: "Conectarse al dispositivo que ejecuta este navegador",
            connectToWindowLocation: "Conéctate a la Raspberry Pi desde la que se carga esta página",

            connectToDevice: "Conectar al dispositivo",
            disconnectFromDevice: "Desconectar",
       

            irReceiverTitle: "Recibir códigos infrarrojos",
            directIrControl: "Apunta tu control remoto a tu tablero QuickPi y presiona uno de los botones",
            getIrCode: "Recibir un código",
            closeDialog: "Cerrar",

            irRemoteControl: "Control remoto Infrarrojo",
            
            noIrPresets: "Utiliza la función de preparación de mensajes IR para agregar comandos de control remoto",
            irEnableContinous: "Activar la emisión IR continua",
            irDisableContinous: "Desactivar la emisión IR continua",

            getTemperatureFromCloudWrongValue: "getTemperatureFromCloud: {0} is not a town supported by getTemperatureFromCloud", // TODO: translate

            up: "arriba",
            down: "abajo",
            left: "izquierda",
            right: "derecha",
            center: "centro",

            on: "Encendido",
            off: "Apagado",

            grovehat: "Sombrero Grove para Raspberry Pi",
            quickpihat: "Sobrero QuickPi de France IOI",
            pinohat: "Raspberry Pi sin sombrero",
            led: "LED",
            blueled: "LED azul",
            greenled: "LED verde",
            orangeled: "LED naranja",
            redled: "LED rojo",
            buzzer: "Zumbador",
            grovebuzzer: "Zumbador Grove",
            quickpibuzzer: "Zumbador passive de QuickPi",
            servo: "Motor Servo",
            screen: "Pantalla",
            grove16x2lcd: "Pantalla Grove 16x2",
            oled128x32: "Pantalla 128x32 Oled",
            irtrans: "Transmisor de infrarrojos",
            button: "Botón",
            fivewaybutton: "Botón de 5 direcciones",
            tempsensor: "Sensor de temperatura",
            groveanalogtempsensor: "Sensor de temperatura analógico Grove",
            quickpigyrotempsensor: "Sensor de temperaturea en el Acelerometro y Gyroscopio de QuickPi",
            dht11tempsensor: "Sensor de Temperatura DHT11",
            potentiometer: "Potenciómetro",
            lightsensor: "Sensor de luz",
            distancesensor: "Sensor de distancia",
            timeofflightranger: "Sensor de distancia por rebote de luz",
            ultrasonicranger: "Sensor de distancia por últrasonido",
            humiditysensor: "Sensor de humedad",
            soundsensor: "Sensor de sonido",
            accelerometerbmi160: "Acelerómetro (BMI160)",
            gyrobmi160: "Giroscopio (BMI160)",
            maglsm303c: "Magnetómetro (LSM303C)",
            irreceiver: "Receptor de infrarrojos",
            cloudstore: "Almacenamiento en la nube",
            addcomponent: "Agregar componente",
            selectcomponent: "Selecciona un componente para agregar a tu Raspberry Pi y conéctalo a un puerto.",
            add: "Agregar",
            builtin: "(incorporado)",
            chooseBoard: "Elije tu tablero",
            nameandports: "Nombres y puertos de sensores y actuadores QuickPi",
            name: "Nombre",
            port: "Puerto",
            state: "Estado",

            cloudTypes: {
                object: "Dictionario",
                array: "Arreglo",
                boolean: "Booleano",
                number: "Nombre",
                string: "Cadena de caracteres"
            },
            cloudMissingKey: "Test échoué : Il vous manque la clé {0} dans le cloud.", // TODO: translate
            cloudMoreKey: "Test échoué : La clé {0} est en trop dans le cloud", // TODO: translate
            cloudUnexpectedKeyCorrection: "Test échoué : La clé {0} n'étais pas attendu dans le cloud", // TODO: translate
            cloudPrimitiveWrongKey: "Test échoué : À la clé {0} du cloud, la valeur {1} était attendue au lieu de {2}", // TODO: translate
            cloudArrayWrongKey: "Test échoué : Le tableau à la clé {0} du cloud diffère de celui attendu.", // TODO: translate
            cloudDictionaryWrongKey: "Test échoué : Le dictionnaire à la clé {0} diffère de celui attendu", // TODO: translate
            cloudWrongType: "Test échoué : Vous avez stocké une valeur de type \"{0}\" dans la clé {1} du cloud, mais le type \"{2}\" était attendu.", // TODO: translate

            cloudKeyNotExists: "La llave no existe : {0} ",
            cloudWrongValue: "Llave {0}: el valor {2} no es el esperado, {1}.",
            cloudUnexpectedKey: "La llave {0} no es una llave esperada",
            hello: "Hola",
            experiment: "Experimentar",
            validate: "Validar",
            validate1: "Validar 1",
            validate2: "Validar 2",
            validate3: "Validar 3",

            sensorNameBuzzer: "timbre",
            sensorNameLed: "led",
            sensorNameRedLed: "ledrojo",
            sensorNameGreenLed: "ledverde",
            sensorNameBlueLed: "ledazul",
            sensorNameScreen: "pantalla",
            sensorNameIrTrans: "tranir",
            sensorNameIrRecv: "recir",
            sensorNameMicrophone: "micro",
            sensorNameTemperature: "temp",
            sensorNameGyroscope: "gyro",
            sensorNameMagnetometer: "magneto",
            sensorNameDistance: "distancia",
            sensorNameAccelerometer: "acel",
            sensorNameButton: "boton",
            sensorNameLight: "luz",
            sensorNameStick: "stick",
            sensorNameServo: "servo",
            sensorNameHumidity: "humedad",
            sensorNamePotentiometer: "pot",
            sensorNameCloudStore: "nube",
        },
        concepts: {
            quickpi_start: 'Crea tu primer programa y ejecútalo',
            quickpi_validation: 'Prueba y valida tus programas',
            quickpi_buzzer: 'Zumbador',
            quickpi_led: 'LEDs o diodos electroluminiscentes',
            quickpi_button: 'Botón',
            quickpi_screen: 'Pantalla',
            quickpi_draw: 'Dibujar sobre la pantalla',
            quickpi_range: 'Sensor de distancia',
            quickpi_servo: 'Servo motor',
            quickpi_thermometer: 'Termómetro',
            quickpi_microphone: 'Micrófono',
            quickpi_light_sensor: 'Sensor de luz',
            quickpi_accelerometer: 'Acelerómetro',
            quickpi_wait: 'Gestión del tiempo',
            quickpi_magneto: 'Magnetómetro', // TODO: verify
            quickpi_ir_receiver: 'Receptor de infrarrojos', // TODO: verify
            quickpi_ir_emitter: 'Emisor de infrarrojos', // TODO: verify
            quickpi_potentiometer: "Potenciómetro", // TODO: verify
            quickpi_gyroscope: "giroscopio", // TODO: verify
            quickpi_cloud: 'Almacenamiento en la nube'
        }
    },
    it: { // Italian strings // TODO
        label: {
            // Labels for the blocks
            sleep: "attendi %1 millisecondei",
            currentTime: "tempo calcolato in millisecondi",

            turnLedOn: "accendi il LED",
            turnLedOff: "spegni il LED",

            setLedState: "passa il LED da %1 a %2 ",
            toggleLedState: "inverti il LED %1",

            isLedOn: "LED acceso",
            isLedOnWithName: "LED %1 acceso",

            setLedBrightness: "imposta la luminosità da %1 a %2",
            getLedBrightness: "leggi la luminosità di %1",

            turnBuzzerOn: "accendi il cicalino",
            turnBuzzerOff: "spegni il cicalino",
            setBuzzerState: "imposta il cicalino %1 a %2",
            isBuzzerOn: "cicalino acceso",
            isBuzzerOnWithName: "cicalino %1 acceso",

            setBuzzerNote: "suona la frequenza %2Hz su %1",
            getBuzzerNote: "frequenza del cicalino %1",

            isButtonPressed: "pulsante premuto",
            isButtonPressedWithName: "pulsante %1 premuto",
            waitForButton: "attendi una pressione sul pulsante",
            buttonWasPressed: "il pulsante è stato premuto",

            displayText: "mostra %1",
            displayText2Lines: "mostra Riga 1 : %1 Riga 2 : %2",

            readTemperature: "temperatura ambiente",
            getTemperatureFromCloud: "temperatura della cità %1", // TODO: verify

            readRotaryAngle: "stato del potenziometro %1",
            readDistance: "distanza misurata all'%1",
            readLightIntensity: "intensità luminosa",
            readHumidity: "umidità ambiente",

            setServoAngle: "metti il servomotore %1 all'angolo %2",
            getServoAngle: "angolo del servomotore %1",

            setContinousServoDirection: "imposta la direzione continua del servo %1 %2",

            drawPoint: "draw pixel",
            isPointSet: "is pixel set in screen",
            drawLine: "riga x₀: %1 y₀: %2 x₁: %3 y₁: %4",
            drawRectangle: "rettangolo x₀: %1 y₀: %2 larghezza₀: %3 altezza₀: %4",
            drawCircle: "cerchio x₀: %1 y₀: %2 diametro₀: %3",
            clearScreen: "cancella tutta la schermata",
            updateScreen: "aggiorna schermata",
            autoUpdate: "aggiornamento automatico della schermata",

            fill: "metti il colore di fondo a %1",
            noFill: "non riempire le forme",
            stroke: "impostare il colore del percorso a %1",
            noStroke: "non disegnare i contorni",

            readAcceleration: "accelerazione in (m/s²) nell'asse %1",
            computeRotation: "calcolo dell'angolo di rotazione (°) sull'accelerometro %1",
            readSoundLevel: "volume sonoro",

            readMagneticForce: "campo magnetico (µT) su %1",
            computeCompassHeading: "direzione della bussola in (°)",

            readInfraredState: "infrarosso rilevato su %1",
            setInfraredState: "imposta il trasmettitore a infrarossi %1 a %2",

            // Gyroscope
            readAngularVelocity: "velocità angolare (°/s) del giroscopio %1",
            setGyroZeroAngle: "inizializza il giroscopio allo stato zero",
            computeRotationGyro: "calcola la rotazione del giroscopio %1",

            //Internet store
            connectToCloudStore: "connettersi al cloud. Nome utente %1 Password %2",
            writeToCloudStore: "scrivi nel cloud : id %1 chiave %2 valore %3",
            readFromCloudStore: "leggi nel cloud : id %1 chiave %2",

            // IR Remote
            readIRMessage: "attendi un messaggio IR nome : %1 per : %2 ms",
            sendIRMessage: "invio del messaggio prepato IR nominato %2 su %1",
            presetIRMessage: "prepara un messaggio IR con il nome %1 e contenuto %2",
        },
        code: {
            // Names of the functions in Python, or Blockly translated in JavaScript
            turnLedOn: "turnLedOn",
            turnLedOff: "turnLedOff",
            setLedState: "setLedState",

            isButtonPressed: "isButtonPressed",
            isButtonPressedWithName : "isButtonPressed",
            waitForButton: "waitForButton",
            buttonWasPressed: "buttonWasPressed",

            toggleLedState: "toggleLedState",
            displayText: "displayText",
            displayText2Lines: "displayText",
            readTemperature: "readTemperature",
            sleep: "sleep",
            setServoAngle: "setServoAngle",
            readRotaryAngle: "readRotaryAngle",
            readDistance: "readDistance",
            readLightIntensity: "readLightIntensity",
            readHumidity: "readHumidity",
            currentTime: "currentTime",
            getTemperatureFromCloud: "getTemperatureFromCloud",

            isLedOn: "isLedOn",
            isLedOnWithName: "isLedOn",

            setBuzzerNote: "setBuzzerNote",
            getBuzzerNote: "getBuzzerNote",
            setLedBrightness: "setLedBrightness",
            getLedBrightness: "getLedBrightness",
            getServoAngle: "getServoAngle",

            setBuzzerState: "setBuzzerState",
            setBuzzerNote: "setBuzzerNote",

            turnBuzzerOn: "turnBuzzerOn",
            turnBuzzerOff: "turnBuzzerOff",
            isBuzzerOn: "isBuzzerOn",
            isBuzzerOnWithName: "isBuzzerOn",


            drawPoint: "drawPoint",
            isPointSet: "isPointSet",
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

            //Internet store
            connectToCloudStore: "connectToCloudStore",
            writeToCloudStore: "writeToCloudStore",
            readFromCloudStore: "readFromCloudStore",                

            // IR Remote
            readIRMessage: "readIRMessage",
            sendIRMessage: "sendIRMessage",
            presetIRMessage: "presetIRMessage",

            //Continous servo
            setContinousServoDirection: "setContinousServoDirection",
        },
        description: {
            // Descriptions of the functions in Python (optional)
            turnLedOn: "turnLedOn() accendi il LED",
            turnLedOff: "turnLedOff() spegni il LED",
            isButtonPressed: "isButtonPressed() riporta True se il pulsante è premuto, False nel caso contrario",
            isButtonPressedWithName: "isButtonPressed(button) riporta True se il pulsante è premuto, False se non lo è",
            waitForButton: "waitForButton(button) sospende l'esecuzione fino a quando non viene premuto il pulsante",
            buttonWasPressed: "buttonWasPressed(button) indica se il tasto è stato premuto dall'ultima volta che questa funzione è stata utilizzata.",
            setLedState: "setLedState(led, state) modifica lo stato del LED : True per accenderlo, False per spegnerlo",
            toggleLedState: "toggleLedState(led) inverte lo stato del LED",
            displayText: "displayText(line1, line2) mostra una o due righe di testo. La line2 è opzionale",
            displayText2Lines: "displayText(line1, line2) mostra una o due righe di testo. La line2 è opzionale",
            readTemperature: "readTemperature(thermometer) riporta la temperatura ambiente",
            sleep: "sleep(milliseconds) mette in pausa l'esecuzione per una durata in ms",
            setServoAngle: "setServoAngle(servo, angle) cambia l'angolo del servomotore",
            readRotaryAngle: "readRotaryAngle(potentiometer) riporta la posizione del potenziometro",
            readDistance: "readDistance(distanceSensor) riporta la distanza misurata",
            readLightIntensity: "readLightIntensity(lightSensor) riporta l'intensità luminosa",
            readHumidity: "readHumidity(hygrometer) riporta l'umidità dell'ambiente",
            currentTime: "currentTime() tempo in millisecondi dall'avvio del programma",

            setLedBrightness: "setLedBrightness(led, brightness) regola l'intensità luminosa del LED",
            getLedBrightness: "getLedBrightness(led) riporta l'intensità luminosa del LED",
            getServoAngle: "getServoAngle(servo) riporta l'angolo del servomotore",

            isLedOn: "isLedOn() riporta True se il LED è acceso, False se è spento",
            isLedOnWithName: "isLedOn(led) riporta True se il LED è acceso, False se è spento",

            turnBuzzerOn: "turnBuzzerOn() accende il cicalino",
            turnBuzzerOff: "turnBuzzerOff() spegne il cicalino",

            isBuzzerOn: "isBuzzerOn() riporta True se il cicalino è acceso, False se è spento",
            isBuzzerOnWithName: "isBuzzerOn(buzzer) riporta True se il cicalino è acceso, False se è spento",

            setBuzzerState: "setBuzzerState(buzzer, state) modifica lo stato del cicalino: True per acceso, False nel caso contrario",
            setBuzzerNote: "setBuzzerNote(buzzer, frequency) fa suonare il cicalino alla frequenza indicata",
            getBuzzerNote: "getBuzzerNote(buzzer) riporta la frequenza attuale del cicalino",

            getTemperatureFromCloud: "getTemperatureFromCloud(town) get the temperature from the town given", // TODO: Translate

            drawPoint: "drawPoint(x, y) draw a point of 1 pixel at given coordinates", // TODO: Translate
            isPointSet: "isPointSet(x, y) return True if the point at coordinates x, y is on", // TODO: Translate
            drawLine: "drawLine(x0, y0, x1, y1) draw a line starting at x0, y0 to x1, y1", // TODO: Translate
            drawRectangle: "drawRectangle(x0, y0, width, height) disegna un rettangolo, con angolo in alto a sinistra (x0,y0)",
            drawCircle: "drawCircle(x0, y0, diameter) draw a circle of center x0, y0 and of given diameter", // TODO: Translate
            clearScreen: "clearScreen() cancella il contenuto della schermata",
            updateScreen: "updateScreen() update screen content", // TODO: Translate
            autoUpdate: "autoUpdate(auto) change the screen actualisation mode", // TODO: Translate

            fill: "fill(color) fill the shapes with the color given", // TODO: Translate
            noFill: "noFill() do not fill the shapes", // TODO: Translate
            stroke: "stroke(color) draw the borders of shapes with the color given", // TODO: Translate
            noStroke: "noStroke() do not draw the borders of shapes", // TODO: Translate


            readAcceleration: "readAcceleration(axis) read the acceleration (m/s²) in the axis (X, Y or Z)", // TODO: Translate
            computeRotation: "computeRotation(axis) compute the rotation angle (°) in the accelerometro", // TODO: Translate

            readSoundLevel: "readSoundLevel(port) return the ambien sound", // TODO: Translate


            readMagneticForce: "readMagneticForce(axis) return the magnetic force (µT) in the axis (X, Y ou Z)", // TODO : Translate
            computeCompassHeading: "computeCompassHeading() return the compass direction in degres", // TODO: Translate

            readInfraredState: "readInfraredState(IRReceiver) riporta True se viene rilevato un segnale infrarosso, False nel caso in contrario",
            setInfraredState: "setInfraredState(IREmitter, state) modifica lo stato del trasmettitore : True per accenderlo, False per spegnerlo",

            // Gyroscope
            readAngularVelocity: "readAngularVelocity(axis) return the angular speed (°/s) of the gyroscope", // TODO: Translate
            setGyroZeroAngle: "setGyroZeroAngle() initialize the gyroscope at the 0 state", // TODO: Translate
            computeRotationGyro: "computeRotationGyro(axis) compute the rotations of the gyroscope in degres", // TODO: Translate

            //Internet store
            connectToCloudStore: "connectToCloudStore(identifier, password) connect to cloud store with the given username and password", // TODO: Translate
            writeToCloudStore: "writeToCloudStore(identifier, key, value) write a value at a key to the cloud", // TODO: Translate
            readFromCloudStore: "readFromCloudStore(identifier, key) read the value at the given key from the cloud", // TODO: Translate

            // IR Remote
            readIRMessage: "readIRMessage(irrec, timeout) wait for an IR message during the given time and then return it", // TODO: Translate
            sendIRMessage: "sendIRMessage(irtrans, name) send an IR message previously configured with the given name", // TODO: Translate
            presetIRMessage: "presetIRMessage(name, data) configure an IR message with the given name and data", // TODO: Translate

            //Continous servo
            setContinousServoDirection: "setContinousServoDirection(servo, direction)",           
        },
        constant: {
        },

        startingBlockName: "Programma", // Name for the starting block
        messages: {
            sensorNotFound: "Accesso a un sensore o attuatore inesistente : {0}.",
            manualTestSuccess: "Test automatico convalidato.",
            testSuccess: "Bravo ! Il risultato è corretto",
            wrongState: "Test fallito : <code>{0}</code> è rimasto nello stato {1} invece di {2} a t={3}ms.",
            wrongStateDrawing: "Test fallito : <code>{0}</code> differisce di {1} pixel rispetto alla visualizzazione prevista a t={2}ms.",
            wrongStateSensor: "Test fallito : il tuo programma non ha letto lo stato di <code>{0}</code> dopo t={1}ms.",
            programEnded: "programma terminato.",
            piPlocked: "L'unità è bloccata. Sbloccare o riavviare.",
            cantConnect: "Impossibile connettersi all'apparecchio.",
            wrongVersion: "Il tuo Raspberry Pi è una versione troppo vecchia, aggiornala.",
            sensorInOnlineMode: "Non è possibile agire sui sensori in modalità connessa.",
            actuatorsWhenRunning: "Impossibile modificare gli azionatori durante l'esecuzione di un programma",
            cantConnectoToUSB: 'Tentativo di connessione via USB in corso, si prega di collegare il Raspberry alla porta USB. <i class="fas fa-circle-notch fa-spin"></i>',
            cantConnectoToBT: 'Tentativo di connessione via Bluetooth, si prega di collegare il dispositivo al Raspberry via Bluetooth <i class="fas fa-circle-notch fa-spin"></i>',
            canConnectoToUSB: "Connesso via USB.",
            canConnectoToBT: "Connesso via Bluetooth.",
            noPortsAvailable: "Non è disponibile alcuna porta compatibile con questo {0} (type {1})",
            sensor: "sensore",
            actuator: "azionatore",
            removeConfirmation: "Sei sicuro di voler rimuovere questo sensore o attuatore?",
            remove: "Rimuovi",
            keep: "Tieni",
            minutesago: "Last seen {0} minutes ago",
            hoursago: "Last seen more than one hour ago",
            drawing: "disegno",
            timeLabel: "Tempo",
            seconds: "secondi",

            changeBoard: "Cambia scheda",
            connect: "Connetti",
            install: "Installa",
            config: "Config",

     
            raspiConfig: "Configurazione del Raspberry Pi",
            local: "Local",
            schoolKey: "Indica un ID scolastico",
            connectList: "Seleziona un apparecchio da connettere nel seguente elenco",
            enterIpAddress: "o inserisci il tuo indirizzo IP",
            getPiList: "Ottieni l'elenco",
            connectTroughtTunnel: "Collegamento attraverso il canale France-ioi",

            connectToLocalhost: "Collegamento dell'interfaccia al computer su cui funziona questo browser",
            connectToWindowLocation: "Connettiti al Rasberry Pi da cui è stata caricata questa pagina",

            connectToDevice: "Connetti l'apparecchio",
            disconnectFromDevice: "Disconnetti",
       

            irReceiverTitle: "Ricevi codici infrarossi",
            directIrControl: "Punta il telecomando verso la scheda QuickPi e premi uno dei tasti.s",
            getIrCode: "Ricevi un codice",
            closeDialog: "Chiudi",

            irRemoteControl: "Telecomando IR",
            
            noIrPresets: "Si prega di utilizzare la funzione di preparazione dei messaggi IR per aggiungere comandi di controllo remoto.",
            irEnableContinous: "Attiva la trasmissione IR continua",
            irDisableContinous: "Disattiva la trasmissione IR continua",

            connectToLocalHost: "Collegamento dell'interfaccia alla periferica su cui funziona questo browser",

            up: "up",
            down: "down",
            left: "left",
            right: "right",
            center: "center",

            on: "On",
            off: "Off",

            getTemperatureFromCloudWrongValue: "getTemperatureFromCloud: {0} is not a town supported by getTemperatureFromCloud", // TODO: translate

            grovehat: "Grove Base Hat for Raspberry Pi",
            quickpihat: "France IOI QuickPi Hat",
            pinohat: "Raspberry Pi without hat",
            led: "LED",
            blueled: "LED blu",
            greenled: "LED verde",
            orangeled: "LED arancione",
            redled: "LED rosso",
            buzzer: "Buzzer",
            grovebuzzer: "Grove Buzzer",
            quickpibuzzer: "Quick Pi Passive Buzzer",
            servo: "Servomotore",
            screen: "Screen",
            grove16x2lcd: "Grove 16x2 LCD",
            oled128x32: "128x32 Oled Screen",
            irtrans: "IR Transmiter",
            button: "Button",
            fivewaybutton: "5 way button",
            tempsensor: "Temperature sensor",
            groveanalogtempsensor: "Grove Analog tempeature sensor",
            quickpigyrotempsensor: "Quick Pi Accelerometer+Gyroscope temperature sensor",
            dht11tempsensor: "DHT11 Tempeature Sensor",
            potentiometer: "Potentiometer",
            lightsensor: "Light sensor",
            distancesensor: "Sensore di distanza",
            timeofflightranger: "Time of flight distance sensor",
            ultrasonicranger: "Sensore di distanza a ultrasuoni",
            humiditysensor: "Humidity sensor",
            soundsensor: "Sound sensor",
            accelerometerbmi160: "Accelerometer sensor (BMI160)",
            gyrobmi160: "Gyropscope sensor (BMI160)",
            maglsm303c: "Magnetometer sensor (LSM303C)",
            irreceiver: "IR Receiver",
            cloudstore: "Cloud Store",
            addcomponent: "Aggiungi un componente",
            selectcomponent: "Seleziona un componente da aggiungere al tuo Raspberry Pi e collegalo a una porta.",
            add: "Aggiungi",
            builtin: "(builtin)",
            chooseBoard: "Scegli la tua scheda",
            nameandports: "Nomi e porte dei sensori e azionatori QuickPi",
            name: "Name",
            port: "Port",
            state: "State",

            cloudTypes: {
                object: "Dictionnaire", // TODO: translate (dictionary)
                array: "Tableau", // TODO: translate
                boolean: "Booléen", // TODO: translate
                number: "Nombre", // TODO: translate
                string: "Chaîne de caractère" // TODO: translate
            },
            cloudMissingKey: "Test échoué : Il vous manque la clé {0} dans le cloud.", // TODO: translate
            cloudMoreKey: "Test échoué : La clé {0} est en trop dans le cloud", // TODO: translate
            cloudUnexpectedKeyCorrection: "Test échoué : La clé {0} n'étais pas attendu dans le cloud", // TODO: translate
            cloudPrimitiveWrongKey: "Test échoué : À la clé {0} du cloud, la valeur {1} était attendue au lieu de {2}", // TODO: translate
            cloudArrayWrongKey: "Test échoué : Le tableau à la clé {0} du cloud diffère de celui attendu.", // TODO: translate
            cloudDictionaryWrongKey: "Test échoué : Le dictionnaire à la clé {0} diffère de celui attendu", // TODO: translate
            cloudWrongType: "Test échoué : Vous avez stocké une valeur de type \"{0}\" dans la clé {1} du cloud, mais le type \"{2}\" était attendu.", // TODO: translate

            cloudKeyNotExists: "La chiave non esiste : {0} ",
            cloudWrongValue: "Chiave {0} : il valore {2} non è quello previsto, {1}.",
            cloudUnexpectedKey: "La chiave {0} non è una chiave prevista",
            hello: "Buongiorno",

            experiment: "Testa",
            validate: "Convalida",
            validate1: "Convalida 1",
            validate2: "Convalida 2",
            validate3: "Convalida 3",

            sensorNameBuzzer: "buzzer",
            sensorNameLed: "led",
            sensorNameRedLed: "redled",
            sensorNameGreenLed: "greenled",
            sensorNameBlueLed: "blueled",
            sensorNameOrangeLed: "orangeled",
            sensorNameScreen: "screen",
            sensorNameIrTrans: "irtran",
            sensorNameIrRecv: "irrec",
            sensorNameMicrophone: "micro",
            sensorNameTemperature: "temp",
            sensorNameGyroscope: "gyroscope",
            sensorNameMagnetometer: "magneto",
            sensorNameDistance: "distance",
            sensorNameAccelerometer: "accel",
            sensorNameButton: "button",
            sensorNameLight: "light",
            sensorNameStick: "stick",
            sensorNameServo: "servo",
            sensorNameHumidity: "humidity",
            sensorNamePotentiometer: "pot",
            sensorNameCloudStore: "cloud",
        },
        concepts: {
            quickpi_start: 'Crea un programma',
            quickpi_validation: 'Convalida il tuo programma',
            quickpi_buzzer: 'Cicalino',
            quickpi_led: 'LED',
            quickpi_button: 'Pulsanti e joystick',
            quickpi_screen: 'Schermo',
            quickpi_draw: 'Disegna',
            quickpi_range: 'Sensore di distanza',
            quickpi_servo: 'Servomotore',
            quickpi_thermometer: 'Termometro',
            quickpi_microphone: 'Microfono',
            quickpi_light_sensor: 'Sensore di luminosità',
            quickpi_accelerometer: 'Accelerometro',
            quickpi_wait: 'Gestione del tempo',
            quickpi_magneto: 'Magnetometro', // TODO: verify
            quickpi_ir_receiver: 'Ricevitore a infrarossi', // TODO: verify
            quickpi_ir_emitter: 'Emettitore a infrarossi', // TODO: verify
            quickpi_potentiometer: "Potenziometro", // TODO: verify
            quickpi_gyroscope: "giroscopio", // TODO: verify
            quickpi_cloud: 'Memorizzazione nel cloud'
        }
    },
    
    none: {
        comment: {
            // Comments for each block, used in the auto-generated documentation for task writers
            turnLedOn: "Turns on a light connected to Raspberry",
            turnLedOff: "Turns off a light connected to Raspberry",
            isButtonPressed: "Returns the state of a button, Pressed means True and not pressed means False",
            waitForButton: "Stops program execution until a button is pressed",
            buttonWasPressed: "Returns true if the button has been pressed and will clear the value",
            setLedState: "Change led state in the given port",
            toggleLedState: "If led is on, turns it off, if it's off turns it on",
            isButtonPressedWithName: "Returns the state of a button, Pressed means True and not pressed means False",
            displayText: "Display text in LCD screen",
            displayText2Lines: "Display text in LCD screen (two lines)",
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
            getTemperatureFromCloud: "Get temperature from town",
            setBuzzerNote: "Set buzzer note",
            getBuzzerNote: "Get buzzer note",
            setLedBrightness: "Set Led Brightness",
            getLedBrightness: "Get Led Brightness",
            getServoAngle: "Get Servo Angle",
            isLedOn: "Get led state",
            isLedOnWithName: "Get led state",
            turnBuzzerOn: "Turn Buzzer on",
            turnBuzzerOff: "Turn Buzzer off",
            isBuzzerOn: "Is Buzzer On",
            isBuzzerOnWithName: "get buzzer state",
            drawPoint: "drawPoint",
            isPointSet: "isPointSet",
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

            //Internet store
            connectToCloudStore: "connectToCloudStore",
            writeToCloudStore: "writeToCloudStore",
            readFromCloudStore: "readFromCloudStore",

            // IR Remote
            readIRMessage: "readIRMessage",
            sendIRMessage: "sendIRMessage",
            presetIRMessage: "presetIRMessage",

            //Continous servo  
            setContinousServoDirection: "setContinousServoDirection",
        }
    }
}


var buzzerSound = {
    context: null,
    default_freq: 200,
    channels: {},
    muted: {},

    getContext: function() {
        if(!this.context) {
            this.context = ('AudioContext' in window) || ('webkitAudioContext' in window) ? new(window.AudioContext || window.webkitAudioContext)() : null;
        }
        return this.context;
    },

    startOscillator: function(freq) {
        var o = this.context.createOscillator();
        o.type = 'sine';
        o.frequency.value = freq;
        o.connect(this.context.destination);
        o.start();
        return o;
    },


    start: function(channel, freq=this.default_freq) {
        if(!this.channels[channel]) {
            this.channels[channel] = {
                muted: false
            }
        }
        if(this.channels[channel].freq === freq) {
            return;
        }
        var context = this.getContext();
        if(!context) {
            return;
        }
        this.stop(channel);

        if (freq == 0 || this.channels[channel].muted) {
            return;
        }
        
        this.channels[channel].oscillator = this.startOscillator(freq);
        this.channels[channel].freq = freq;
    },

    stop: function(channel) {
        if(this.channels[channel]) {
            this.channels[channel].oscillator && this.channels[channel].oscillator.stop();
            delete this.channels[channel].oscillator;
            delete this.channels[channel].freq;
        }
    },

    mute: function(channel) {
        if(!this.channels[channel]) {
            this.channels[channel] = {
                muted: true
            }
            return;
        }
        this.channels[channel].muted = true;
        this.channels[channel].oscillator && this.channels[channel].oscillator.stop();
        delete this.channels[channel].oscillator;
    },

    unmute: function(channel) {
        if(!this.channels[channel]) {
            this.channels[channel] = {
                muted: false
            }
            return;
        }
        this.channels[channel].muted = false;
        if(this.channels[channel].freq) {
            this.channels[channel].oscillator = this.startOscillator(this.channels[channel].freq);
        }
    },

    isMuted: function(channel) {
        if(this.channels[channel]) {
            return this.channels[channel].muted;
        }
        return false;
    },

    stopAll: function() {
        for(var channel in this.channels) {
            if(this.channels.hasOwnProperty(channel)) {
                this.stop(channel);
            }
        }
    }
}



var gyroscope3D = (function() {

    var instance;

    function createInstance(width, height) {
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // debug code start
        /*
        canvas.style.zIndex = 99999;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        document.body.appendChild(canvas);
        */
        // debug code end

        try {
            var renderer = new zen3d.Renderer(canvas, { antialias: true, alpha: true });
        } catch(e) {
            return false;
        }
        
        renderer.glCore.state.colorBuffer.setClear(0, 0, 0, 0);
    
        var scene = new zen3d.Scene();
    
        var lambert = new zen3d.LambertMaterial();
        lambert.diffuse.setHex(0x468DDF);            
       
        var cube_geometry = new zen3d.CubeGeometry(10, 2, 10);
        var cube = new zen3d.Mesh(cube_geometry, lambert);
        cube.position.x = 0;
        cube.position.y = 0;
        cube.position.z = 0;
        scene.add(cube);
    
        var ambientLight = new zen3d.AmbientLight(0xffffff, 2);
        scene.add(ambientLight);
    
        var pointLight = new zen3d.PointLight(0xffffff, 1, 100);
        pointLight.position.set(-20, 40, 10);
        scene.add(pointLight);            
    
        var camera = new zen3d.Camera();
        camera.position.set(0, 13, 13);
        camera.lookAt(new zen3d.Vector3(0, 0, 0), new zen3d.Vector3(0, 1, 0));
        camera.setPerspective(45 / 180 * Math.PI, width / height, 1, 1000);
        scene.add(camera);    
    
    
        return {
            resize: function(width, height) {
                camera.setPerspective(
                    45 / 180 * Math.PI, 
                    width / height, 
                    1, 
                    1000
                );
            },
    
            render: function(ax, ay, az) {
                cube.euler.x = Math.PI * ax / 360;
                cube.euler.y = Math.PI * ay / 360;
                cube.euler.z = Math.PI * az / 360;
                renderer.render(scene, camera);
                return canvas;
            }
        }
    }

    return {
        getInstance: function(width, height) {
            if(!instance) {
                instance = createInstance(width, height);
            } else {
                instance.resize(width, height)
            }
            return instance;
        }
    }

})();



function QuickStore(rwidentifier, rwpassword) {
    var url = 'https://cloud.quick-pi.org';
    var connected = (rwidentifier === undefined);

    function post(path, data, callback) {
        $.ajax({
            type: 'POST',
            url: url + path,
            crossDomain: true,
            data: data,
            dataType: 'json',
            success: callback
        });
    }

    return {
        connected: rwpassword,
        read: function(identifier, key, callback) {
            var data = {
                    prefix: identifier,
                    key: key
            };
            post('/api/data/read', data, callback);
        },

        write: function(identifier, key, value, callback) {
            if (identifier != rwidentifier)
            {
                callback({
                    sucess: false,
                    message: "Écriture sur un identifiant en lecture seule : " + identifier,
                });
            }
            else {
                var data = {
                    prefix: identifier,
                    password: rwpassword,
                    key: key,
                    value: JSON.stringify(value)
                };
                post('/api/data/write', data, callback);
            }
        }
    }
}

// This is a template of library for use with quickAlgo.
var getContext = function (display, infos, curLevel) {

    // Local language strings for each language
    var introControls = null;

    // Create a base context
    var context = quickAlgoContext(display, infos);

    // we set the lib involved to Quick-Pi
    context.title = "Quick-Pi";

    // Import our localLanguageStrings into the global scope
    var strings = context.setLocalLanguageStrings(quickPiLocalLanguageStrings);

    context.disableAutoCompletion = false;

    // Some data can be made accessible by the library through the context object
    context.quickpi = {};


    // List of concepts to be included by conceptViewer
    context.getConceptList = function() {
        var conceptList = [{id: 'language', ignore: true}];
        var quickPiConceptList = [
            {
                id: 'quickpi_start',
                isBase: true,
                order: 1,
                python: []
            },
            {
                id: 'quickpi_validation',
                isBase: true,
                order: 2,
                python: []
            },
            {
                id: 'quickpi_buzzer',
                order: 200,
                python: ['setBuzzerState', 'setBuzzerNote','turnBuzzerOn','turnBuzzerOff', 'setBuzzerState',
                    'getBuzzerNote', 'isBuzzerOn']
            },
            {
                id: 'quickpi_led',
                order: 201,
                python: ['setLedState','toggleLedState','turnLedOn','turnLedOff', 'setLedBrightness', 'getLedBrightness', 'isLedOn']
            },
            {
                id: 'quickpi_button',
                order: 202,
                python: ['isButtonPressed', 'isButtonPressedWithName', 'waitForButton', 'buttonWasPressed']
            },  
            {   
                id: 'quickpi_screen',
                order: 203,
                python: ['displayText']
            },
            {   
                id: 'quickpi_draw',
                order: 203,
                python: ['drawRectangle','drawLine','drawCircle', 'drawPoint', 'clearScreen', 'fill', 'noFill',
                    'stroke', 'noStroke','updateScreen', 'autoUpdate', 'isPointSet']
            },
            {
                id: 'quickpi_range',
                order: 204,
                python: ['readDistance']
            },
            {
                id: 'quickpi_servo',
                order: 205,
                python: ['setServoAngle', 'getServoAngle']
            },
            {
                id: 'quickpi_thermometer',
                order: 206,
                python: ['readTemperature']
            },
            {
                id: 'quickpi_microphone',
                order: 207,
                python: ['readSoundLevel']
            },
            {
                id: 'quickpi_light_sensor',
                order: 208,
                python: ['readLightIntensity']
            },
            {
                id: 'quickpi_accelerometer',
                order: 209,
                python: ['readAcceleration', 'computeRotation']
            },
            {
                id: 'quickpi_wait',
                order: 250,
                python: ['sleep', 'currentTime']
            },
            {
                id: 'quickpi_magneto',
                order: 210,
                python: ['readMagneticForce', 'computeCompassHeading']
            },
            {
                id: 'quickpi_ir_receiver',
                order: 211,
                python: ['readInfraredState', 'readIRMessage']
            },
            {
                id: "quickpi_ir_emitter",
                order: 212,
                python: ["setInfraredState", "sendIRMessage", "presetIRMessage"]
            },
            {
                id: "quickpi_potentiometer",
                order: 213,
                python: ["readRotaryAngle"]
            },
            {
                id: "quickpi_gyroscope",
                order: 214,
                python: ["readAngularVelocity", "setGyroZeroAngle", "computeRotationGyro"]
            },
            {
                id: 'quickpi_cloud',
                order: 220,
                python: ['writeToCloudStore','connectToCloudStore','readFromCloudStore', 'getTemperatureFromCloud']
            }
        ];

        if(window.stringsLanguage == 'fr' || !strings.concepts) {
            var conceptStrings = quickPiLocalLanguageStrings.fr.concepts;
            var conceptIndex = 'quickpi.html';
        } else {
            var conceptStrings = strings.concepts;
            var conceptIndex = 'quickpi_' + window.stringsLanguage + '.html';
        }
        var conceptBaseUrl = 'https://static4.castor-informatique.fr/help/'+conceptIndex;

        for(var i = 0; i < quickPiConceptList.length; i++) {
            var concept = quickPiConceptList[i];
            concept.name = conceptStrings[concept.id];
            concept.url = conceptBaseUrl + '#' + concept.id;
            if(!concept.language) { concept.language = 'all'; }
            conceptList.push(concept);
        }
        return conceptList;
    }

    var boardDefinitions = [
        {
            name: "grovepi",
            friendlyName: strings.messages.grovehat,
            image: "grovepihat.png",
            adc: "grovepi",
            portTypes: {
                "D": [5, 16, 18, 22, 24, 26],
                "A": [0, 2, 4, 6],
                "i2c": ["i2c"],
            },
            default: [
                { type: "screen", suggestedName: strings.messages.sensorNameScreen + "1", port: "i2c", subType: "16x2lcd" },
                { type: "led", suggestedName: strings.messages.sensorNameLed + "1", port: 'D5', subType: "blue" },
                { type: "servo", suggestedName: strings.messages.sensorNameServo + "1", port: "D16" },
                { type: "range", suggestedName: strings.messages.sensorNameDistance + "1", port :"D18", subType: "ultrasonic"},
                { type: "button", suggestedName: strings.messages.sensorNameButton + "1", port: "D22" },
                { type: "humidity", suggestedName: strings.messages.sensorNameHumidity + "1", port: "D24"},
                { type: "buzzer", suggestedName: strings.messages.sensorNameBuzzer + "1", port: "D26", subType: "active"},
                { type: "temperature", suggestedName: strings.messages.sensorNameTemperature + "1", port: 'A0', subType: "groveanalog" },
                { type: "potentiometer", suggestedName: strings.messages.sensorNamePotentiometer + "1", port :"A4"},
                { type: "light", suggestedName: strings.messages.sensorNameLight + "1", port :"A6"},
            ]
        },
        {
            name: "quickpi",
            friendlyName: strings.messages.quickpihat,
            image: "quickpihat.png",
            adc: "ads1015",
            portTypes: {
                "D": [5, 16, 24],
                "A": [0],
            },
            builtinSensors: [
                { type: "screen", subType: "oled128x32", port: "i2c",  suggestedName: strings.messages.sensorNameScreen + "1", },
                { type: "led", subType: "red", port: "D4", suggestedName: strings.messages.sensorNameRedLed + "1", },
                { type: "led", subType: "green", port: "D17", suggestedName: strings.messages.sensorNameGreenLed + "1", },
                { type: "led", subType: "blue", port: "D27",  suggestedName: strings.messages.sensorNameBlueLed + "1", },
                { type: "irtrans", port: "D22",  suggestedName: strings.messages.sensorNameIrTrans + "1", },
                { type: "irrecv", port: "D23", suggestedName: strings.messages.sensorNameIrRecv + "1", },
                { type: "sound", port: "A1", suggestedName: strings.messages.sensorNameMicrophone + "1", },
                { type: "buzzer", subType: "passive", port: "D12", suggestedName: strings.messages.sensorNameBuzzer + "1", },
                { type: "accelerometer", subType: "BMI160", port: "i2c", suggestedName: strings.messages.sensorNameAccelerometer + "1", },
                { type: "gyroscope", subType: "BMI160", port: "i2c", suggestedName: strings.messages.sensorNameGyroscope  + "1", },
                { type: "magnetometer", subType: "LSM303C", port: "i2c", suggestedName: strings.messages.sensorNameMagnetometer + "1", },
                { type: "temperature", subType: "BMI160", port: "i2c", suggestedName: strings.messages.sensorNameTemperature + "1", },
                { type: "range", subType: "vl53l0x", port: "i2c", suggestedName: strings.messages.sensorNameDistance + "1", },
                { type: "button", port: "D26", suggestedName: strings.messages.sensorNameButton + "1", },
                { type: "light", port: "A2", suggestedName: strings.messages.sensorNameLight + "1", },
                { type: "stick", port: "D7", suggestedName: strings.messages.sensorNameStick + "1", }
            ],
        },
        {
            name: "pinohat",
            image: "pinohat.png",
            friendlyName: strings.messages.pinohat,
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
            suggestedName: strings.messages.sensorNameLed,
            description: strings.messages.led,
            isAnalog: false,
            isSensor: false,
            portType: "D",
            getInitialState: function (sensor) {
                return false;
            },
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
            setLiveState: function (sensor, state, callback) {
                var ledstate = state ? 1 : 0;
                var command = "setLedState(\"" + sensor.name + "\"," + ledstate + ")";

                context.quickPiConnection.sendCommand(command, callback);
            },
            getStateString: function(state) {
                return state ? strings.messages.on.toUpperCase() : strings.messages.off.toUpperCase();
            },
            subTypes: [{
                subType: "blue",
                description: strings.messages.blueled,
                selectorImages: ["ledon-blue.png"],
                suggestedName: strings.messages.sensorNameBlueLed,
            },
            {
                subType: "green",
                description: strings.messages.greenled,
                selectorImages: ["ledon-green.png"],
                suggestedName: strings.messages.sensorNameGreenLed,
            },
            {
                subType: "orange",
                description: strings.messages.orangeled,
                selectorImages: ["ledon-orange.png"],
                suggestedName: strings.messages.sensorNameOrangeLed,
            },
            {
                subType: "red",
                description: strings.messages.redled,
                selectorImages: ["ledon-red.png"],
                suggestedName: strings.messages.sensorNameRedLed,
            }
            ],
        },
        {
            name: "buzzer",
            suggestedName: strings.messages.sensorNameBuzzer,
            description: strings.messages.buzzer,
            isAnalog: false,
            isSensor: false,
            getInitialState: function(sensor) {
                return false;
            },
            portType: "D",
            selectorImages: ["buzzer-ringing.png"],
            valueType: "boolean",
            getPercentageFromState: function (state, sensor) {

                if (sensor.showAsAnalog)
                {
                    return (state - sensor.minAnalog) / (sensor.maxAnalog - sensor.minAnalog);
                } else {
                    if (state)
                        return 1;
                    else
                        return 0;
                }
            },
            getStateFromPercentage: function (percentage) {
                if (percentage)
                    return 1;
                else
                    return 0;
            },
            setLiveState: function (sensor, state, callback) {
                var ledstate = state ? 1 : 0;
                var command = "setBuzzerState(\"" + sensor.name + "\"," + ledstate + ")";

                context.quickPiConnection.sendCommand(command, callback);
            },
            getStateString: function(state) {

                if(typeof state == 'number' && 
                    state != 1 &&
                    state != 0) {

                        return state.toString() + "Hz";
                }               
                return state ? strings.messages.on.toUpperCase() : strings.messages.off.toUpperCase();
            },
            subTypes: [{
                subType: "active",
                description: strings.messages.grovebuzzer,
                pluggable: true,
            },
            {
                subType: "passive",
                description: strings.messages.quickpibuzzer,
            }],
        },
        {
            name: "servo",
            suggestedName: strings.messages.sensorNameServo,
            description: strings.messages.servo,
            isAnalog: true,
            isSensor: false,
            getInitialState: function(sensor) {
                return 0;
            },
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
            setLiveState: function (sensor, state, callback) {
                var command = "setServoAngle(\"" + sensor.name + "\"," + state + ")";

                context.quickPiConnection.sendCommand(command, callback);
            },
            getStateString: function(state) {
                return "" + state + "°";
            }
        },
        {
            name: "screen",
            suggestedName: strings.messages.sensorNameScreen,
            description: strings.messages.screen,
            isAnalog: false,
            isSensor: false,
            getInitialState: function(sensor) {
                if (sensor.isDrawingScreen)
                    return null;
                else
                    return {line1: "", line2: ""};
            },
            cellsAmount: function(paper) {
                if(context.board == 'grovepi') {
                    return 2;
                }
                if(paper.width < 250) {
                    return 4;
                } else if(paper.width < 350) {
                    return 3;
                }

                if (context.compactLayout)
                    return 3;
                else
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

                if (state1.isDrawingData != 
                    state2.isDrawingData)
                    return false;

                if (state1 && state1.isDrawingData) {
                    // They are ImageData objects
                    // The image data is RGBA so there are 4 bits per pixel

                    var data1 = state1.getData(1).data;
                    var data2 = state2.getData(1).data;

                    for (var i = 0; i < data1.length; i+=4) {
                        if (data1[i]  != data2[i] ||
                            data1[i + 1]  != data2[i + 1] ||
                            data1[i + 2]  != data2[i + 2] ||
                            data1[i + 3]  != data2[i + 3])
                            return false;
                    }

                    return true;
                } else {

                    // Otherwise compare the strings
                    return (state1.line1 == state2.line1) &&
                                ((state1.line2 == state2.line2) ||
                                (!state1.line2 && !state2.line2));
                }
            },
            setLiveState: function (sensor, state, callback) {
                var line2 = state.line2;
                if (!line2)
                    line2 = "";

                var command = "displayText(\"" + sensor.name + "\"," + state.line1 + "\", \"" + line2 + "\")";

                context.quickPiConnection.sendCommand(command, callback);
            },
            getStateString: function(state) {
                if(!state) { return '""'; }
                
                if (state.isDrawingData)
                    return strings.messages.drawing;
                else
                    return '"' + state.line1 + (state.line2 ? " / " + state.line2 : "") + '"';
            },
            getWrongStateString: function(failInfo) {
                if(!failInfo.expected ||
                   !failInfo.expected.isDrawingData ||
                   !failInfo.actual ||
                   !failInfo.actual.isDrawingData) {
                    return null; // Use default message
                }
                var data1 = failInfo.expected.getData(1).data;
                var data2 = failInfo.actual.getData(1).data;
                var nbDiff = 0;
                for (var i = 0; i < data1.length; i+=4) {
                    if(data1[i] != data2[i]) {
                        nbDiff += 1;
                    }
                }
                return strings.messages.wrongStateDrawing.format(failInfo.name, nbDiff, failInfo.time);
            },
            subTypes: [{
                subType: "16x2lcd",
                description: strings.messages.grove16x2lcd,
                pluggable: true,
            },
            {
                subType: "oled128x32",
                description: strings.messages.oled128x32,
            }],

        },
        {
            name: "irtrans",
            suggestedName: strings.messages.sensorNameIrTrans,
            description: strings.messages.irtrans,
            isAnalog: false,
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
            suggestedName: strings.messages.sensorNameButton,
            description: strings.messages.button,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("isButtonPressed(\"" + sensor.name + "\")", function (retVal) {
                    var intVal = parseInt(retVal, 10);
                    callback(intVal != 0);
                });
            },
        },
        {
            name: "stick",
            suggestedName: strings.messages.sensorNameStick,
            description: strings.messages.fivewaybutton,
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
            },
            cellsAmount: function(paper) {
                return 2;
            },
        },
        {
            name: "temperature",
            suggestedName: strings.messages.sensorNameTemperature,
            description: strings.messages.tempsensor,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readTemperature(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
            subTypes: [{
                subType: "groveanalog",
                description: strings.messages.groveanalogtempsensor,
                portType: "A",
                pluggable: true,
            },
            {
                subType: "BMI160",
                description: strings.messages.quickpigyrotempsensor,
                portType: "i2c",
            },
            {
                subType: "DHT11",
                description: strings.messages.dht11tempsensor,
                portType: "D",
                pluggable: true,
            }],
        },
        {
            name: "potentiometer",
            suggestedName: strings.messages.sensorNamePotentiometer,
            description: strings.messages.potentiometer,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readRotaryAngle(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
        },
        {
            name: "light",
            suggestedName: strings.messages.sensorNameLight,
            description: strings.messages.lightsensor,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readLightIntensity(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
        },
        {
            name: "range",
            suggestedName: strings.messages.sensorNameDistance,
            description: strings.messages.distancesensor,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readDistance(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
            subTypes: [{
                subType: "vl53l0x",
                description: strings.messages.timeofflightranger,
                portType: "i2c",
            },
            {
                subType: "ultrasonic",
                description: strings.messages.ultrasonicranger,
                portType: "D",
                pluggable: true,
            }],

        },
        {
            name: "humidity",
            suggestedName: strings.messages.sensorNameHumidity,
            description: strings.messages.humiditysensor,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readHumidity(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
        },
        {
            name: "sound",
            suggestedName: strings.messages.sensorNameMicrophone,
            description: strings.messages.soundsensor,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readSoundLevel(\"" + sensor.name + "\")", function(val) {
                    val = Math.round(val);
                    callback(val);
                });
            },
        },
        {
            name: "accelerometer",
            suggestedName: strings.messages.sensorNameAccelerometer,
            description: strings.messages.accelerometerbmi160,
            isAnalog: true,
            isSensor: true,
            portType: "i2c",
            valueType: "object",
            valueMin: 0,
            valueMax: 100,
            step: 0.1,
            selectorImages: ["accel.png"],
            getStateString: function (state) {
                if (state == null)
                    return "0m/s²";

                if (Array.isArray(state))
                {
                    return "X: " + state[0] + "m/s² Y: " + state[1] + "m/s² Z: " + state[2] + "m/s²";
                }
                else {
                    return state.toString() + "m/s²";
                }
            },
            getPercentageFromState: function (state) {
                return ((state + 78.48) / 156.96);
            },
            getStateFromPercentage: function (percentage) {
                var value = ((percentage * 156.96) - 78.48);
                return parseFloat(value.toFixed(1));
            },
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readAccelBMI160()", function(val) {
                    var array = JSON.parse(val);
                    callback(array);
                });
            },
            cellsAmount: function(paper) {
                return 2;
            },
        },
        {
            name: "gyroscope",
            suggestedName: strings.messages.sensorNameGyroscope,
            description: strings.messages.gyrobmi160,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readGyroBMI160()", function(val) {

                    var array = JSON.parse(val);
                    array[0] = Math.round(array[0]);
                    array[1] = Math.round(array[1]);
                    array[2] = Math.round(array[2]);
                    callback(array);
                });
            },
            cellsAmount: function(paper) {
                return 2;
            },
        },
        {
            name: "magnetometer",
            suggestedName: strings.messages.sensorNameMagnetometer,
            description: strings.messages.maglsm303c,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("readMagnetometerLSM303C(False)", function(val) {

                    var array = JSON.parse(val);

                    array[0] = Math.round(array[0]);
                    array[1] = Math.round(array[1]);
                    array[2] = Math.round(array[2]);

                    callback(array);
                });
            },
            cellsAmount: function(paper) {
                return 2;
            },
        },
        {
            name: "irrecv",
            suggestedName: strings.messages.sensorNameIrRecv,
            description: strings.messages.irreceiver,
            isAnalog: false,
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
            getLiveState: function (sensor, callback) {
                context.quickPiConnection.sendCommand("isButtonPressed(\"" + sensor.name + "\")", function (retVal) {
                    var intVal = parseInt(retVal, 10);
                    callback(intVal == 0);
                });
            },
        },
        /******************************** */
        /*             dummy sensors      */
        /**********************************/
        {
            name: "cloudstore",
            suggestedName: strings.messages.sensorNameCloudStore,
            description: strings.messages.cloudstore,
            isAnalog: false,
            isSensor: false,
            portType: "none",
            valueType: "object",
            selectorImages: ["cloudstore.png"],
            /*getInitialState: function(sensor) {
                return {};
            },*/

            getWrongStateString: function(failInfo) {
                /**
                 * Call this function when more.length > less.length. It will find the key that is missing inside of the
                 * less array
                 * @param more The bigger array, containing one or more key more than less
                 * @param less Less, the smaller array, he has a key or more missing
                 */
                function getMissingKey(more, less) {
                    for (var i = 0; i < more.length; i++) {
                        var found = false;
                        for (var j = 0; j < less.length; j++) {
                            if (more[i] === less[j]) {
                                found = true;
                                break;
                            }
                        }
                        if (!found)
                            return more[i];
                    }
                    // should never happen because length are different.
                    return null;
                }

                // the type of a value in comparison.
                var valueType = {
                    // Primitive type are strings and integers
                    PRIMITIVE: "primitive",
                    ARRAY: "array",
                    DICTIONARY: "dictionary",
                    // if two values are of wrong type then this is returned
                    WRONG_TYPE: "wrong_type"
                };

                /**
                 * This method allow us to compare two keys of the cloud and their values
                 * @param actual The actual key that we have
                 * @param expected The expected key that we have
                 * @return An object containing the type of the return and the key that differ
                 */
                function compareKeys(actual, expected) {
                    function compareArrays(arr1, arr2) {
                        if (arr1.length != arr2.length)
                            return false;
                        for (var i = 0; i < arr1.length; i++) {
                            for (var j = 0; j < arr2.length; j++) {
                                if (arr1[i] !== arr2[i])
                                    return false;
                            }
                        }
                        return true;
                    }
                    var actualKeys = Object.keys(actual);

                    for (var i = 0; i < actualKeys.length; i++) {
                        var actualVal = actual[actualKeys[i]];

                        // they both have the same keys so we can do that.
                        var expectedVal = expected[actualKeys[i]];

                        if (isPrimitive(expectedVal)) {
                            // if string with int for example
                            if (typeof expectedVal !== typeof actualVal) {
                                return {
                                    type: valueType.WRONG_TYPE,
                                    key: actualKeys[i]
                                }
                            }
                            if (expectedVal !== actualVal) {
                                return {
                                    type: valueType.PRIMITIVE,
                                    key: actualKeys[i]
                                };
                            }
                        } else if (Array.isArray(expectedVal)) {
                            if (!Array.isArray(actualVal)) {
                                return {
                                    type: valueType.WRONG_TYPE,
                                    key: actualKeys[i]
                                };
                            }
                            if (!compareArrays(expectedVal, actualVal)) {
                                return {
                                    type: valueType.ARRAY,
                                    key: actualKeys[i]
                                };
                            }
                            // if we are in a dictionary
                            // method from: https://stackoverflow.com/questions/38304401/javascript-check-if-dictionary
                        } else if (expectedVal.constructor == Object) {
                            if (actualVal.constructor != Object) {
                                return {
                                    type: valueType.WRONG_TYPE,
                                    key: actualKeys[i]
                                };
                            }
                            if (!deepEqual(expectedVal, actualVal)) {
                                return {
                                    type: valueType.DICTIONARY,
                                    key: actualKeys[i]
                                };
                            }
                        }
                    }
                }

                if(!failInfo.expected &&
                    !failInfo.actual)
                    return null;

                var expected = failInfo.expected;
                var actual = failInfo.actual;

                var expectedKeys = Object.keys(expected);
                var actualKeys = Object.keys(actual);

                if (expectedKeys.length != actualKeys.length) {
                    if (expectedKeys.length > actualKeys.length) {
                        var missingKey = getMissingKey(expectedKeys, actualKeys);
                        return strings.messages.cloudMissingKey.format(missingKey);
                    } else {
                        var additionalKey = getMissingKey(actualKeys, expectedKeys);
                        return strings.messages.cloudMoreKey.format(additionalKey);
                    }
                }

                // This will return a key that is missing inside of expectedKeys if there is one, otherwise it will return null.
                var unexpectedKey = getMissingKey(actualKeys, expectedKeys);

                if (unexpectedKey) {
                    return strings.messages.cloudUnexpectedKeyCorrection.format(unexpectedKey);
                }

                var keyCompare = compareKeys(actual, expected);

                switch (keyCompare.type) {
                    case valueType.PRIMITIVE:
                        return strings.messages.cloudPrimitiveWrongKey.format(keyCompare.key, expected[keyCompare.key], actual[keyCompare.key]);
                    case valueType.WRONG_TYPE:
                        var typeActual = typeof actual[keyCompare.key];
                        var typeExpected = typeof expected[keyCompare.key];
                        // we need to check if it is an array or a dictionary
                        if (typeActual == "object") {
                            if (Array.isArray(actual[keyCompare.key]))
                                typeActual = "array";
                        }
                        if (typeExpected == "object") {
                            if (Array.isArray(expected[keyCompare.key]))
                                typeExpected = "array";
                        }
                        var typeActualTranslate = quickPiLocalLanguageStrings.fr.messages.cloudTypes[typeActual];
                        var typeExpectedTranslate = quickPiLocalLanguageStrings.fr.messages.cloudTypes[typeExpected];
                        return strings.messages.cloudWrongType.format(typeActualTranslate, keyCompare.key, typeExpectedTranslate);
                    case valueType.ARRAY:
                        return strings.messages.cloudArrayWrongKey.format(keyCompare.key);
                    case valueType.DICTIONARY:
                        return strings.messages.cloudDictionaryWrongKey.format(keyCompare.key);
                }
            },

            compareState: function (state1, state2) {
                return quickPiStore.compareState(state1, state2);
            }
        },
        {
            name: "clock",
            description: strings.messages.cloudstore,
            isAnalog: false,
            isSensor: false,
            portType: "none",
            valueType: "object",
            selectorImages: ["clock.png"],
        },
    ];


    if(window.quickAlgoInterface) {
        window.quickAlgoInterface.stepDelayMin = 1;
    }


    function findSensorDefinition(sensor) {
        var sensorDef = null;
        for (var iType = 0; iType < sensorDefinitions.length; iType++) {
            var type = sensorDefinitions[iType];

            if (sensor.type == type.name) {
                if (sensor.subType && type.subTypes) {

                    for (var iSubType = 0; iSubType < type.subTypes.length; iSubType++) {
                        var subType = type.subTypes[iSubType];

                        if (subType.subType == sensor.subType) {
                            sensorDef = $.extend({}, type, subType);
                        }
                    }
                } else {
                    sensorDef = type;
                }
            }
        }

        if(sensorDef && !sensorDef.compareState) {
            sensorDef.compareState = function(state1, state2) {
                return state1 == state2;
            };
        }

        return sensorDef;
    }

    var defaultQuickPiOptions = {
        disableConnection: false,
        increaseTimeAfterCalls: 5
        };
    function getQuickPiOption(name) {
        if(name == 'disableConnection') {
            // TODO :: Legacy, remove when all tasks will have been updated
            return (context.infos
                && (context.infos.quickPiDisableConnection
                || (context.infos.quickPi && context.infos.quickPi.disableConnection)));
        }
        if(context.infos && context.infos.quickPi && typeof context.infos.quickPi[name] != 'undefined') {
            return context.infos.quickPi[name];
        } else {
            return defaultQuickPiOptions[name];
        }
    }

    function getWrongStateText(failInfo) {
        var actualStateStr = "" + failInfo.actual;
        var expectedStateStr = "" + failInfo.expected;
        var sensorDef = findSensorDefinition(failInfo.sensor);
        if(sensorDef) {
            if(sensorDef.isSensor) {
                return strings.messages.wrongStateSensor.format(failInfo.name, failInfo.time);
            }
            if(sensorDef.getWrongStateString) {
                var sensorWrongStr = sensorDef.getWrongStateString(failInfo);
                if(sensorWrongStr) {
                    return sensorWrongStr;
                }
            }
            if(sensorDef.getStateString) {
                actualStateStr = sensorDef.getStateString(failInfo.actual);
                expectedStateStr = sensorDef.getStateString(failInfo.expected);
            }
        }
        return strings.messages.wrongState.format(failInfo.name, actualStateStr, expectedStateStr, failInfo.time);
    }

    function getCurrentBoard() {
        var found = boardDefinitions.find(function (element) {
            if (context.board == element.name)
                return element;
        });

        return found;
    }

    function getSessionStorage(name) {
        // Use a try in case it gets blocked
        try {
            return sessionStorage[name];
        } catch(e) {
            return null;
        }
    }

    function setSessionStorage(name, value) {
        // Use a try in case it gets blocked
        try {
            sessionStorage[name] = value;
        } catch(e) {}
    }

    if(window.getQuickPiConnection) {
        var lockstring = getSessionStorage('lockstring');
        if(!lockstring) {
            lockstring = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            setSessionStorage('lockstring', lockstring);
        }

        context.quickPiConnection = getQuickPiConnection(lockstring, raspberryPiConnected, raspberryPiDisconnected, raspberryPiChangeBoard);

        context.quickPiConnection.isAvailable("localhost", function(available) {
            context.localhostAvailable = available;
        });

        context.quickPiConnection.isAvailable(window.location.hostname, function(available) {
            context.windowLocationAvailable = available;
        });

    }

    var paper;
    context.offLineMode = true;
    context.timeLineStates = [];
    var innerState = {};

    var getSensorFullState = function (sensor) {
        return {
            state: sensor.state,
            screenDrawing: sensor.screenDrawing,
            lastDrawnTime: sensor.lastDrawnTime,
            lastDrawnState: sensor.lastDrawnState,
            callsInTimeSlot: sensor.callsInTimeSlot,
            lastTimeIncrease: sensor.lastTimeIncrease,
            removed: sensor.removed,
            quickStore: sensor.quickStore,
        };
    }

    var reloadSensorFullState = function (sensor, save) {
        sensor.state = save.state;
        sensor.screenDrawing = save.screenDrawing;
        sensor.lastDrawnTime = save.lastDrawnTime;
        sensor.lastDrawnState = save.lastDrawnState;
        sensor.callsInTimeSlot = save.callsInTimeSlot;
        sensor.lastTimeIncrease = save.lastTimeIncrease;
        sensor.removed = save.removed;
        sensor.quickStore = save.quickStore;
    };

    context.getInnerState = function() {
        var savedSensors = {};
        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];
            var savedSensor = getSensorFullState(sensor);
            savedSensors[sensor.name] = savedSensor;
        }

        innerState.sensors = savedSensors;
        innerState.timeLineStates = context.timeLineStates.map(function (timeLineState) {
            var timeLineElement = Object.assign({}, timeLineState);
            timeLineElement.sensorName = timeLineElement.sensor.name;
            delete timeLineElement.sensor;

            return timeLineElement;
        });
        innerState.currentTime = context.currentTime;

        return innerState;
    };

    context.implementsInnerState = function () {
        return true;
    }

    context.reloadInnerState = function(data) {
        innerState = data;

        for (var name in data.sensors) {
            var sensor = findSensorByName(name);
            var savedSensor = data.sensors[name];
            context.sensorsSaved[name] = savedSensor;
            reloadSensorFullState(sensor, savedSensor);
        }

        context.timeLineStates = [];
        for (var i = 0; i < data.timeLineStates.length; i++) {
            var newTimeLineState = Object.assign({}, data.timeLineStates[i]);
            newTimeLineState.sensor = findSensorByName(newTimeLineState.sensorName);
            context.timeLineStates.push(newTimeLineState);
        }

        context.currentTime = data.currentTime;
    }
    
    context.getEventListeners = function () {
        return {
            'quickpi/changeSensorState': 'changeSensorState',
        };
    }

    context.redrawDisplay = function () {
        context.resetDisplay();
    }

    context.onExecutionEnd = function () {
        if (context.autoGrading)
        {
            buzzerSound.stopAll();
        }

    };

    infos.checkEndEveryTurn = true;
    infos.checkEndCondition = function (context, lastTurn) {

        if (!context.display && !context.autoGrading && !context.forceGradingWithoutDisplay) {
            context.success = true;
            throw (strings.messages.manualTestSuccess);
        }

        if (context.failImmediately)
        {
            context.success = false;
            throw (context.failImmediately);
        }

        var testEnded = lastTurn || context.currentTime > context.maxTime;

        if (context.autoGrading) {
            if (!testEnded) { return; }

            if (lastTurn && context.display && !context.loopsForever) {
                context.currentTime = Math.floor(context.maxTime * 1.05);
                drawNewStateChanges();
                drawCurrentTime();
            }

            var failInfo = null;

            for(var sensorName in context.gradingStatesBySensor) {
                // Cycle through each sensor from the grading states
                var sensor = findSensorByName(sensorName);
                var sensorDef = findSensorDefinition(sensor);

                var expectedStates = context.gradingStatesBySensor[sensorName];
                if(!expectedStates.length) { continue;}

                var actualStates = context.actualStatesBySensor[sensorName];
                var actualIdx = 0;

                // Check that we went through all expected states
                for (var i = 0; i < context.gradingStatesBySensor[sensorName].length; i++) {
                    var expectedState = context.gradingStatesBySensor[sensorName][i];

                    if(expectedState.hit || expectedState.input ) { continue; } // Was hit, valid
                    var newFailInfo = null;
                    if(actualStates) {
                        // Scroll through actual states until we get the state at this time
                        while(actualIdx + 1 < actualStates.length && actualStates[actualIdx+1].time <= expectedState.time) {
                            actualIdx += 1;
                        }
                        if(!sensorDef.compareState(actualStates[actualIdx].state, expectedState.state)) {
                            newFailInfo = {
                                sensor: sensor,
                                name: sensorName,
                                time: expectedState.time,
                                expected: expectedState.state,
                                actual: actualStates[actualIdx].state
                            };
                        }
                    } else {
                        // No actual states to compare to
                        newFailInfo = {
                            sensor: sensor,
                            name: sensorName,
                            time: expectedState.time,
                            expected: expectedState.state,
                            actual: null
                        };
                    }

                    if(newFailInfo) {
                        // Only update failInfo if we found an error earlier
                        failInfo = failInfo && failInfo.time < newFailInfo.time ? failInfo : newFailInfo;
                    }
                }

                // Check that no actual state conflicts an expected state
                if(!actualStates) { continue; }
                var expectedIdx = 0;
                for(var i = 0; i < actualStates.length ; i++) {
                    var actualState = actualStates[i];
                    while(expectedIdx + 1 < expectedStates.length && expectedStates[expectedIdx+1].time <= actualState.time) {
                        expectedIdx += 1;
                    }
                    if(!sensorDef.compareState(actualState.state, expectedStates[expectedIdx].state)) {
                        // Got an unexpected state change
                        var newFailInfo = {
                            sensor: sensor,
                            name: sensorName,
                            time: actualState.time,
                            expected: expectedStates[expectedIdx].state,
                            actual: actualState.state
                        };
                        failInfo = failInfo && failInfo.time < newFailInfo.time ? failInfo : newFailInfo;
                    }
                }
            }

            if(failInfo) {
                // Missed expected state
                context.success = false;
                throw (getWrongStateText(failInfo));
            } else {
                // Success
                context.success = true;
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
                    return;
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
                    return;
                }
            }


            // If this is a button try to set it to a stick
            if (!sensor.port && sensor.type == "button") {
                for (var i = 0; i < board.builtinSensors.length; i++) {
                    var builtinsensor = board.builtinSensors[i];
                    if (builtinsensor.type == "stick")
                    {
                        sensor.port = builtinsensor.port;
                        return;
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
                                return;
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
                            return;
                        }
                    }
                }
            }
        }
    }

    context.resetSensors = function() {
        for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
            var sensor = infos.quickPiSensors[iSensor];
            if (context.sensorsSaved[sensor.name] && !context.autoGrading) {
                var save = context.sensorsSaved[sensor.name];
                reloadSensorFullState(sensor, save);
            } else {
                sensor.state = null;
                sensor.screenDrawing = null;
                sensor.lastDrawnTime = 0;
                sensor.lastDrawnState = null;
                sensor.callsInTimeSlot = 0;
                sensor.lastTimeIncrease = 0;
                sensor.removed = false;
                sensor.quickStore = null;
            }
            if (sensor.name == "gyroscope")
                sensor.rotationAngles = undefined;
        }
    };
    
    context.reset = function (taskInfos) {
        buzzerSound.stopAll();

        context.alreadyHere = true;

        context.failImmediately  = null;

        if (!context.offLineMode) {
            $('#piinstallcheck').hide();
            context.quickPiConnection.startNewSession();
            context.resetSensorTable();
        }

        context.currentTime = 0;
        if (taskInfos != undefined) {
            context.actualStatesBySensor = {};
            context.tickIncrease = 100;
            context.autoGrading = taskInfos.autoGrading;
            context.loopsForever = taskInfos.loopsForever;
            context.allowInfiniteLoop = !context.autoGrading;
            if (context.autoGrading) {
                context.maxTime = 0;

                if (taskInfos.input)
                {
                    for (var i = 0; i < taskInfos.input.length; i++)
                    {
                        taskInfos.input[i].input = true;
                    }
                    context.gradingStatesByTime = taskInfos.input.concat(taskInfos.output);
                }
                else {
                    context.gradingStatesByTime = taskInfos.output;
                }

                // Copy states to avoid modifying the taskInfos states
                context.gradingStatesByTime = context.gradingStatesByTime.map(
                    function(val) {
                        return Object.assign({}, val);
                    });

                context.gradingStatesByTime.sort(function (a, b) { return a.time - b.time; });

                context.gradingStatesBySensor = {};

                for (var i = 0; i < context.gradingStatesByTime.length; i++) {
                    var state = context.gradingStatesByTime[i];

                    if (!context.gradingStatesBySensor.hasOwnProperty(state.name))
                        context.gradingStatesBySensor[state.name] = [];

                    context.gradingStatesBySensor[state.name].push(state);
//                    state.hit = false;
//                    state.badonce = false;

                    if (state.time > context.maxTime)
                        context.maxTime = state.time;
                }


                for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
                    var sensor = infos.quickPiSensors[iSensor];
                    
                    if (sensor.type == "buzzer") {
                        var states = context.gradingStatesBySensor[sensor.name];

                        if (states) {
                            for (var iState = 0; iState < states.length; iState++) {
                                var state = states[iState].state;
                                
                                if (typeof state == 'number' &&
                                        state != 0 &&
                                        state != 1) {
                                    sensor.showAsAnalog = true;
                                    break;
                                }
                            }
                        }
                    }

                    var isAnalog = findSensorDefinition(sensor).isAnalog || sensor.showAsAnalog;

                    if (isAnalog) {
                        sensor.maxAnalog = Number.MIN_VALUE;
                        sensor.minAnalog = Number.MAX_VALUE;

                        if (context.gradingStatesBySensor.hasOwnProperty(sensor.name)) {
                            var states = context.gradingStatesBySensor[sensor.name];

                            for (var iState = 0; iState < states.length; iState++) {
                                var state = states[iState];

                                if (state.state > sensor.maxAnalog)
                                    sensor.maxAnalog = state.state;
                                if (state.state < sensor.minAnalog)
                                    sensor.minAnalog = state.state;
                            }
                        }
                    }

                    if (sensor.type == "screen") {
                        var states = context.gradingStatesBySensor[sensor.name];

                        if (states) {
                            for (var iState = 0; iState < states.length; iState++) {
                                var state = states[iState];
                                if (state.state.isDrawingData)
                                    sensor.isDrawingScreen = true;
                            }
                        }
                    }
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

        if (paper && context.autoGrading && context.display) {
            if (context.sensorStates)
                context.sensorStates.remove();
            context.sensorStates = paper.set();
        }
    

        context.resetSensors();

        for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
            var sensor = infos.quickPiSensors[iSensor];

            // If the sensor has no port assign one
            if (!sensor.port) {
                sensorAssignPort(sensor);
            }
        }

        if (context.display) {
            context.recreateDisplay = true;
            context.displayAutoGrading = context.autoGrading;
            context.timeLineStates = [];
            context.resetDisplay();
        } else {

            context.success = false;
        }

        // Needs display to be reset before calling registerQuickPiEvent
        for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
            var sensor = infos.quickPiSensors[iSensor];

            // Set initial state
            var sensorDef = findSensorDefinition(sensor);
            if(sensorDef && !sensorDef.isSensor && sensorDef.getInitialState) {
                var initialState = sensorDef.getInitialState(sensor);
                if (initialState != null)
                    context.registerQuickPiEvent(sensor.name, initialState, true, true);
            }
        }

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
                || context.liveUpdateCount != 0
                || context.stopLiveUpdate) { return; }

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
        setSessionStorage('board', newboardname);

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
        context.reset();
    };



    context.board = "quickpi";

    if (getSessionStorage('board'))
        context.changeBoard(getSessionStorage('board'));

    /**
     * This method allow us to save the sensors inside of the variable additional.
     * If other things must be saved from quickPi later, it can be saved inside of this variable.
     * @param additional The additional object saved inside of the xml
     */
    context.saveAdditional = function(additional) {
        // we don't need to save sensors if user can't modify them
        if (!infos.customSensors)
            return;

        additional.quickpiSensors = [];
        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var currentSensor = infos.quickPiSensors[i];
            var savedSensor = {
                type: currentSensor.type,
                port: currentSensor.port,
                name: currentSensor.name
            };
            if (currentSensor.subType)
                savedSensor.subType = currentSensor.subType;
            additional.quickpiSensors.push(savedSensor);
        }
    };

    /**
     * This function loads all additional stuff from the object "additional" for quickpi.
     * For now on it only loads the sensor
     * @param additional The additional variable which contains the sensors
     */
    context.loadAdditional = function(additional) {
        // we load sensors only if custom sensors is available
        if (!infos.customSensors)
            return;

        var newSensors = additional.quickpiSensors;

        // we don't verify if sensors are empty or not, because if they are it is maybe meant this
        // way by the user
        if (!newSensors)
            return;

        for (var i = 0; i < infos.quickPiSensors.length; i++) {
            var sensor = infos.quickPiSensors[i];
            sensor.removed = true;
        }

        infos.quickPiSensors = [];

        for (var i = 0; i < newSensors.length; i++) {
            var sensor = {
                type: newSensors[i].type,
                port: newSensors[i].port,
                name: newSensors[i].name
            };

            if (newSensors[i].subType)
                sensor.sybType = newSensors[i].subType;

            sensor.state = null;
            sensor.callsInTimeSlot = 0;
            sensor.lastTimeIncrease = 0;

            infos.quickPiSensors.push(sensor);
        }

        context.recreateDisplay = true;
        this.resetDisplay();
    };

    context.resetDisplay = function() {
        if (!context.display || !this.raphaelFactory)
            return;


        context.autoGrading = context.displayAutoGrading;

        if (context.recreateDisplay || !paper)
        {
            context.createDisplay();
            context.recreateDisplay = false;
        }

        paper.setSize(($('#virtualSensors').width() * context.quickPiZoom), $('#virtualSensors').height());

        var area = paper.width * paper.height;
        context.compactLayout = false;
        if (area < 218700)
        {
            context.compactLayout = true;
        }

        if (context.sensorDivisions) {
            context.sensorDivisions.remove();
        }

        context.sensorDivisions = paper.set();

        // Fix this so we don't have to recreate this.
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

        if (context.autoGrading) {
            if (context.sensorStates)
                context.sensorStates.remove();
            context.sensorStates = paper.set();
            //paper.clear(); // Do this for now.

            var numSensors = infos.quickPiSensors.length;
            var sensorSize = Math.min(paper.height / numSensors * 0.80, $('#virtualSensors').width() / 10);

            //var sensorSize = Math.min(paper.height / (numSensors + 1));


            context.timeLineSlotHeight = Math.min(paper.height / (numSensors + 1));
            context.sensorSize = sensorSize * .90;

            context.timelineStartx = context.sensorSize * 3;

            var maxTime = context.maxTime;
            if (maxTime == 0)
                maxTime = 1000;

            if (!context.loopsForever)
                maxTime = Math.floor(maxTime * 1.05);

            context.pixelsPerTime = (paper.width - context.timelineStartx - 30) / maxTime;

            context.timeLineY = 25 + (context.timeLineSlotHeight * (infos.quickPiSensors.length));
            

            var color = true;

            for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
                var sensor = infos.quickPiSensors[iSensor];

                sensor.drawInfo = {
                    x: 0,
                    y: 10 + (context.timeLineSlotHeight * iSensor),
                    width: sensorSize * .90,
                    height: sensorSize * .90
                };

                var rect = paper.rect(0, sensor.drawInfo.y, paper.width, context.timeLineSlotHeight);

                rect.attr({
                        "fill": color ? "#0000FF" : "#00FF00",
                        "stroke": "none",
                        "opacity": 0.03,
                    });
                context.sensorDivisions.push(rect);
                color = !color;
            }

            drawTimeLine();

            for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
                var sensor = infos.quickPiSensors[iSensor];

                drawSensor(sensor);
                sensor.timelinelastxlabel = 0;

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

                    drawSensorTimeLineState(sensor, lastState, state.time, context.maxTime, "expected", true);
                    
                    if (!context.loopsForever)
                        drawSensorTimeLineState(sensor, lastState, startTime, maxTime, "finnish", false);

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
                    true);
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

            // TODO : be carefull, the geometry is reversed for cols and rows I think
            var geometry = null;
            if (context.compactLayout)
                geometry = squareSize(paper.width, paper.height, nSensors, 2);
            else
                geometry = squareSize(paper.width, paper.height, nSensors, 1);

            context.sensorSize = geometry.size * .10;

            var iSensor = 0;

            for (var col = 0; col < geometry.cols; col++) {
                var y = geometry.size * col;

                var line = paper.path(["M", 0,
                    y,
                    "L", paper.width,
                    y]);
                context.sensorDivisions.push(line);

                line.attr({
                    "stroke-width": 1,
                    "stroke": "lightgrey",
                    "stroke-linecapstring": "round"
                });

                for (var row = 0; row < geometry.rows; row++) {
                    var x = paper.width / geometry.rows * row;
                    var y1 = y + geometry.size / 4;
                    var y2 = y + geometry.size * 3 / 4;
                    var cells = 1;
                    var sensor = infos.quickPiSensors[iSensor];
                    var foundsize = 0;

                    var cellsAmount = null;
                    if (sensor)
                         cellsAmount = findSensorDefinition(sensor).cellsAmount;

                    if (cellsAmount)
                        cells = cellsAmount(paper);

                    // Particular case if we have a screen and only 2 columns, we can put the
                    // cells of the screen at 2 because the display is still good with it.
                    // I used rows, because I think that for geometry, rows and cols are reversed. You can try to change
                    // it and see the result in animal connecte.
                    if (sensor && sensor.type === "screen" && cells > geometry.rows && cells == 3 && geometry.rows == 2)
                        cells = 2;

                    line = paper.path(["M", x,
                        y1,
                        "L", x,
                        y2]);
                    context.sensorDivisions.push(line);

                    line.attr({
                        "stroke-width": 1,
                        "stroke": "lightgrey",
                        "stroke-linecapstring": "round"
                    });

                    var foundrows = false;
                    var bump = false;

                    while (!foundrows && !bump)
                    {
                        var rowsleft = geometry.rows - row;
                        if (cells > rowsleft)
                        {
                            for (var iNewSensor = iSensor + 1; iNewSensor < infos.quickPiSensors.length; iNewSensor++)
                            {
                                var newSensor = infos.quickPiSensors[iNewSensor];

                                cells = 1;
                                cellsAmount = findSensorDefinition(newSensor).cellsAmount;
                                
                                if (cellsAmount)
                                    cells = cellsAmount(paper);

                                if (cells == 1)
                                {
                                    infos.quickPiSensors[iNewSensor] = sensor;
                                    infos.quickPiSensors[iSensor] = newSensor;
                                    sensor = newSensor;
                                    foundrows = true;
                                    break;
                                }
                            }
                            bump = true;
                        }
                        else
                        {
                            foundrows = true;
                        }
                    }

                    if (bump)
                        continue;


                    if (iSensor == infos.quickPiSensors.length && infos.customSensors) {
                        drawCustomSensorAdder(x, y, geometry.size);
                    } else if (infos.quickPiSensors[iSensor]) {                        
                        row += cells - 1;

                        sensor.drawInfo = {
                                x: x,
                                y: y,
                                width: (paper.width / geometry.rows) * cells,
                                height: geometry.size
                        }

                        drawSensor(sensor);
                    }
                    iSensor++;
                }
            }
        }
    }

    // Reset the context's display
    context.createDisplay = function () {
        // Do something here
        //$('#grid').html('Display for the library goes here.');

        // Ask the parent to update sizes
        //context.blocklyHelper.updateSize();
        //context.updateScale();

        if (!context.display || !this.raphaelFactory)
            return;


        var connectionHTML = "<div id=\"piui\">" +
            "   <button type=\"button\" id=\"piconnect\" class=\"btn\">" +
            "       <span class=\"fa fa-wifi\"></span><span id=\"piconnecttext\" class=\"btnText\">" + strings.messages.connect + "</span> <span id=\"piconnectprogress\" class=\"fas fa-spinner fa-spin\"></span>" +
            "   </button>" +
            "   <span id=\"piinstallui\">" +
            "       <span class=\"fa fa-exchange-alt\"></span>" +
            "       <button type=\"button\" id=\"piinstall\" class=\"btn\">" +
            "           <span class=\"fa fa-upload\"></span><span>" + strings.messages.install + "</span><span id=piinstallprogresss class=\"fas fa-spinner fa-spin\"></span><span id=\"piinstallcheck\" class=\"fa fa-check\"></span>" +
            "       </button>" +
            "   </span>" +
            "   <span id=\"pichangehatui\">" +
            "       <button type=\"button\" id=\"pichangehat\" class=\"btn\">" +
            "           <span class=\"fas fa-hat-wizard\"></span><span>" + strings.messages.changeBoard + "</span></span></span>" +
            "       </button>" +
            "       <button type=\"button\" id=\"pihatsetup\" class=\"btn\">" +
            "           <span class=\"fas fa-cog\"></span><span>" + strings.messages.config + "</span></span></span>" +
            "       </button>" +
            "   </span>" +
            "</div>";

        var piUi = getQuickPiOption('disableConnection') ? '' : connectionHTML;

        var hasIntroControls = $('#taskIntro').find('#introControls').length;
        if (!hasIntroControls) {
            $('#taskIntro').append("<div id=\"introControls\"></div>");
        }
        $('#introControls').html(piUi);
        $('#taskIntro').addClass('piui');

        $('#grid').html("<div id=\"virtualSensors\" style=\"height: 100%; width: 100%;\">"
            + "</div>");


        if (!context.quickPiZoom || !context.autoGrading)
            context.quickPiZoom = 1;

        this.raphaelFactory.destroyAll();
        paper = this.raphaelFactory.create(
                "paperMain",
                "virtualSensors",
                ($('#virtualSensors').width() * context.quickPiZoom),
                $('#virtualSensors').height()
        );

            if (context.autoGrading) {
                $('#virtualSensors').css("overflow-y", "hidden");
                $('#virtualSensors').css("overflow-x", "auto");

                // Allow horizontal zoom on grading
                paper.canvas.onwheel = function(event) {
                        var originalzoom = context.quickPiZoom;
                        context.quickPiZoom += event.deltaY * -0.001;
                    
                        if (context.quickPiZoom < 1)
                            context.quickPiZoom = 1;
    
                        if (originalzoom != context.quickPiZoom)
                            context.resetDisplay();
                };                

                $('#virtualSensors').scroll(function(event) {
                    for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
                        var sensor = infos.quickPiSensors[iSensor];

                        drawSensor(sensor);
                    }
                });        
            }
            else
            {
                $('#virtualSensors').css("overflow-y", "hidden");
                $('#virtualSensors').css("overflow", "hidden");
            }
        

        if (infos.quickPiSensors == "default")
        {
            infos.quickPiSensors = [];
            addDefaultBoardSensors();
        }

        if (context.blocklyHelper) {
            context.blocklyHelper.updateSize();
        }

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
            var connectionDialogHTML = "<div class=\"content connectPi qpi\">" +
                "   <div class=\"panel-heading\">" +
                "       <h2 class=\"sectionTitle\">" +
                "           <span class=\"iconTag\"><i class=\"icon fas fa-list-ul\"></i></span>" +
                            strings.messages.raspiConfig +
                "       </h2>" +
                "       <div class=\"exit\" id=\"picancel\"><i class=\"icon fas fa-times\"></i></div>" +
                "   </div>" +
                "   <div class=\"panel-body\">" +
                "       <div id=\"piconnectionmainui\">" +
                "           <div class=\"switchRadio btn-group\" id=\"piconsel\">" +
                "               <button type=\"button\" class=\"btn\" id=\"piconlocal\"><i class=\"fas fa-location-arrow icon\"></i>" + strings.messages.local + "</button>" +
                "               <button type=\"button\" class=\"btn active\" id=\"piconwifi\"><i class=\"fa fa-wifi icon\"></i>WiFi</button>" +
                "               <button type=\"button\" class=\"btn\" id=\"piconusb\"><i class=\"fab fa-usb icon\"></i>USB</button>" +
                "               <button type=\"button\" class=\"btn\" id=\"piconbt\"><i class=\"fab fa-bluetooth-b icon\"></i>Bluetooth</button>" +
                "           </div>" +
                "           <div id=\"pischoolcon\">" +
                "               <div class=\"form-group\">" +
                "                   <label id=\"pischoolkeylabel\">" + strings.messages.schoolKey + "</label>" +
                "                   <div class=\"input-group\">" +
                "                       <div class=\"input-group-prepend\">Aa</div>" +
                "                       <input type=\"text\" id=\"schoolkey\" class=\"form-control\">" +
                "                   </div>" +
                "               </div>" +
                "               <div class=\"form-group\">" +
                "                   <label id=\"pilistlabel\">" + strings.messages.connectList + "</label>" +
                "                   <div class=\"input-group\">" +
                "                       <button class=\"input-group-prepend\" id=pigetlist disabled>" + strings.messages.getPiList + "</button>" +
                "                       <select id=\"pilist\" class=\"custom-select\" disabled>" +
                "                       </select>" +
                "                   </div>" +
                "               </div>" +
                "               <div class=\"form-group\">" +
                "                   <label id=\"piiplabel\">" + strings.messages.enterIpAddress + "</label>" +
                "                   <div class=\"input-group\">" +
                "                       <div class=\"input-group-prepend\">123</div>" +
                "                       <input id=piaddress type=\"text\" class=\"form-control\">" +
                "                   </div>" +
                "               </div>" +
                "               <div>" +
                "                   <input id=\"piusetunnel\" disabled type=\"checkbox\">" + strings.messages.connectTroughtTunnel +
                "               </div>" +
                "           </div>" +
                "           <div id=\"panel-body-usbbt\">" +
                "               <label id=\"piconnectionlabel\"></label>" +
                "           </div>" +
                "           <div id=\"panel-body-local\">" +
                "               <label id=\"piconnectionlabellocal\"></label>" +
                "               <div id=\"piconnectolocalhost\">" +
                "                   <input type=\"radio\" id=\"piconnectolocalhostcheckbox\" name=\"pilocalconnectiontype\" value=\"localhost\">" +
                                        strings.messages.connectToLocalhost +
                "               </div>" +
                "               <div id=\"piconnectocurrenturl\">" +
                "                   <input type=\"radio\" id=\"piconnectocurrenturlcheckbox\" name=\"pilocalconnectiontype\" value=\"currenturl\">" +
                                        strings.messages.connectToWindowLocation +
                "               </div>" +
                "           </div>" +
                "       </div>" +
                "       <div class=\"inlineButtons\">" +
                "           <button id=\"piconnectok\" class=\"btn\"><i class=\"fa fa-wifi icon\"></i>" + strings.messages.connectToDevice + "</button>" +
                "           <button id=\"pirelease\" class=\"btn\"><i class=\"fa fa-times icon\"></i>" + strings.messages.disconnectFromDevice + "</button>" +
                "       </div>" +
                "   </div>" +
                "</div>";

            window.displayHelper.showPopupDialog(connectionDialogHTML);

            if (context.offLineMode) {
                $('#pirelease').attr('disabled', true);
            }
            else {
                $('#pirelease').attr('disabled', false);
            }

            $('#piconnectok').attr('disabled', true);

            $('#piconnectionlabel').hide();

            if (context.quickPiConnection.isConnected()) {
                if (getSessionStorage('connectionMethod') == "USB") {
                    $('#piconwifi').removeClass('active');
                    $('#piconusb').addClass('active');
                    $('#pischoolcon').hide();
                    $('#piaddress').val("192.168.233.1");

                    $('#piconnectok').attr('disabled', true);
                    $('#piconnectionlabel').show();
                    $('#piconnectionlabel').text(strings.messages.canConnectoToUSB)

                    context.inUSBConnection = true;
                    context.inBTConnection = false;
                } else if (getSessionStorage('connectionMethod') == "BT") {
                    $('#piconwifi').removeClass('active');
                    $('#piconbt').addClass('active');
                    $('#pischoolcon').hide();

                    $('#piaddress').val("192.168.233.2");

                    $('#piconnectok').attr('disabled', true);
                    $('#piconnectionlabel').show();
                    $('#piconnectionlabel').text(strings.messages.canConnectoToBT)

                    context.inUSBConnection = false;
                    context.inBTConnection = true;
                } else if (getSessionStorage('connectionMethod') == "LOCAL") {
                    $('#piconlocal').trigger("click");
                }
            } else {
                setSessionStorage('connectionMethod', "WIFI");
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


            if (getSessionStorage('pilist')) {
                populatePiList(JSON.parse(getSessionStorage('pilist')));
            }

            if (getSessionStorage('raspberryPiIpAddress')) {
                $('#piaddress').val(getSessionStorage('raspberryPiIpAddress'));
                $('#piaddress').trigger("input");
            }

            if (getSessionStorage('schoolkey')) {
                $('#schoolkey').val(getSessionStorage('schoolkey'));
                $('#pigetlist').attr("disabled", false);
            }

            function setLocalIp()
            {
                var localvalue = $('input[name=pilocalconnectiontype]:checked').val()

                if (localvalue == "localhost") {
                    $('#piaddress').val("localhost");
                    $('#piaddress').trigger("input");
                } else {
                    $('#piaddress').val(window.location.hostname);
                    $('#piaddress').trigger("input");
                }
            }

            $('input[type=radio][name=pilocalconnectiontype]').change(function() {
                setLocalIp();
            });
           
            function cleanUSBBTIP()
            {
                var ipaddress = $('#piaddress').val();

                if (ipaddress == "192.168.233.1" ||
                    ipaddress == "192.168.233.2" ||
                    ipaddress == "localhost" ||
                    ipaddress == window.location.hostname)
                {
                        $('#piaddress').val("");
                        $('#piaddress').trigger("input");
                        
                        var schoolkey = $('#schoolkey').val();
                        if (schoolkey.length > 1)
                            $('#pigetlist').trigger("click");
                }
            }

            cleanUSBBTIP();

            $('#panel-body-local').hide();

            if (context.localhostAvailable || context.windowLocationAvailable)
            {
                if (!context.quickPiConnection.isConnected() ||
                    getSessionStorage('connectionMethod') == "LOCAL")
                {
                    $('#piconsel .btn').removeClass('active');
                    $('#piconlocal').addClass('active');

                    
                    $('#pischoolcon').hide();
                    $('#piconnectionlabel').hide();
                    $('#panel-body-local').show();
                    setSessionStorage('connectionMethod', "LOCAL");

                    if (context.localhostAvailable &&
                        context.windowLocationAvailable)
                    {
                        $("#piconnectolocalhostcheckbox").prop("checked", true);

                        setLocalIp();
                    } else if (context.localhostAvailable) {
                        $('#piconnectolocalhost').hide();
                        $('#piconnectocurrenturlcheckbox').hide();

                        setLocalIp();
                    } else if (context.windowLocationAvailable) {
                        $('#piconnectocurrenturl').hide();
                        $('#piconnectolocalhostcheckbox').hide();

                        setLocalIp();
                    }
                }
            }
            else
            {
                $('#panel-body-local').hide();
                $("#piconlocal").hide();
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

                    setSessionStorage('quickPiUrl', url);
                    context.quickPiConnection.connect(url);

                } else {
                    var ipaddress = $('#piaddress').val();
                    setSessionStorage('raspberryPiIpAddress', ipaddress);

                    showasConnecting();
                    var url = "ws://" + ipaddress + ":5000/api/v1/commands";
                    setSessionStorage('quickPiUrl', url);

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
                setSessionStorage('schoolkey', schoolkey);

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

            $('#piconlocal').click(function () {
                context.inUSBConnection = false;
                context.inBTConnection = false;

                cleanUSBBTIP();

                if (!context.quickPiConnection.isConnected()) {
                    setLocalIp();
                    setSessionStorage('connectionMethod', "LOCAL");
                    $(this).addClass('active');
                    $('#panel-body-local').show();
                    $('#pischoolcon').hide();
                    $('#piconnectionlabel').hide();

                    $(this).addClass('active');
                }

            });

            $('#piconwifi').click(function () {
                context.inUSBConnection = false;
                context.inBTConnection = false;

                cleanUSBBTIP();

                if (!context.quickPiConnection.isConnected()) {
                    setSessionStorage('connectionMethod', "WIFI");
                    $(this).addClass('active');
                    $('#panel-body-local').hide();
                    $('#pischoolcon').show();
                    $('#piconnectionlabel').hide();
                }

            });

            $('#piconusb').click(function () {
                if (!context.quickPiConnection.isConnected()) {
                    setSessionStorage('connectionMethod', "USB");
                    $('#piconnectok').attr('disabled', true);
                    $('#panel-body-local').hide();
                    $('#piconnectionlabel').show();
                    $('#piconnectionlabel').html(strings.messages.cantConnectoToUSB)

                    $(this).addClass('active');
                    $('#pischoolcon').hide();
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

                            setTimeout(function() { 
                                context.quickPiConnection.isAvailable("192.168.233.1", updateUSBAvailability);
                            }, 1000);
                        }
                    }

                    updateUSBAvailability(false);


                }
            });

            $('#piconbt').click(function () {
                $('#piconnectionlabel').show();
                if (!context.quickPiConnection.isConnected()) {
                    setSessionStorage('connectionMethod', "BT");
                    $('#piconnectok').attr('disabled', true);
                    $('#panel-body-local').hide();
                    $('#piconnectionlabel').show();
                    $('#piconnectionlabel').html(strings.messages.cantConnectoToBT)

                    $(this).addClass('active');
                    $('#pischoolcon').hide();

                    $('#piaddress').val("192.168.233.2");

                    context.inUSBConnection = false;
                    context.inBTConnection = true;

                    function updateBTAvailability(available) {

                        if  (context.inBTConnection && context.offLineMode) {
                            if (available) {
                                $('#piconnectok').attr('disabled', false);

                                $('#piconnectionlabel').text(strings.messages.canConnectoToBT)
                            } else {
                                $('#piconnectok').attr('disabled', true);

                                $('#piconnectionlabel').html(strings.messages.cantConnectoToBT)
                            }

                            setTimeout(function() { 
                                context.quickPiConnection.isAvailable("192.168.233.2", updateBTAvailability);
                            }, 1000);                            
                        }
                    }

                    updateBTAvailability(false);
                }
            });

            function populatePiList(jsonlist) {
                setSessionStorage('pilist', JSON.stringify(jsonlist));

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
            window.displayHelper.showPopupDialog("<div class=\"content connectPi qpi\">" +
                "   <div class=\"panel-heading\">" +
                "       <h2 class=\"sectionTitle\">" +
                "           <span class=\"iconTag\"><i class=\"icon fas fa-list-ul\"></i></span>" +
                            strings.messages.chooseBoard +
                "       </h2>" +
                "       <div class=\"exit\" id=\"picancel\"><i class=\"icon fas fa-times\"></i></div>" +
                "   </div>" +
                "   <div class=\"panel-body\">" +
                "       <div id=boardlist>" +
                "       </div>" +
                "       <div panel-body-usbbt>" +
                "           <label id=\"piconnectionlabel\"></label>" +
                "       </div>" +
                "   </div>" +
                "</div>");

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

                window.displayHelper.showPopupDialog("<div class=\"content connectPi qpi\">" +
                    "   <div class=\"panel-heading\">" +
                    "       <h2 class=\"sectionTitle\">" +
                    "           <span class=\"iconTag\"><i class=\"icon fas fa-list-ul\"></i></span>" +
                                strings.messages.nameandports +
                    "       </h2>" +
                    "       <div class=\"exit\" id=\"picancel\"><i class=\"icon fas fa-times\"></i></div>" +
                    "   </div>" +
                    "   <div class=\"panel-body\">" +
                    "       <table id='sensorTable' style=\"display:table-header-group;\">" +
                    "           <tr>" +
                    "               <th>" + strings.messages.name + "</th>" +
                    "               <th>" + strings.messages.port + "</th>" +
                    "               <th>" + strings.messages.state + "</th>" +
                    "           </tr>" +
                    "       </table>" +
                    "   <!--" +
                    "       <div>" +
                    "           <input type=\"checkbox\" id=\"buzzeraudio\" value=\"buzzeron\"> Output audio trought audio buzzer<br>" +
                    "       </div>" +
                    "       <div class=\"inlineButtons\">" +
                    "           <button id=\"pisetupok\" class=\"btn\"><i class=\"fas fa-cog icon\"></i>Set</button>" +
                    "       </div>" +
                    "   -->" +
                    "   </div>" +
                    "</div>");

                var table = document.getElementById("sensorTable");
                for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
                    var sensor = infos.quickPiSensors[iSensor];

                    function addNewRow()
                    {
                        var row = table.insertRow();
                        var type = row.insertCell();
                        var name = row.insertCell();
                        var port = row.insertCell();

                        return [type, name, port];
                    }

                    
                    if (sensor.type == "stick")
                    {
                        var gpios = findSensorDefinition(sensor).gpios;
                        var cols = addNewRow();

                        cols[0].appendChild(document.createTextNode(sensor.type));
                        cols[1].appendChild(document.createTextNode(sensor.name + ".up"));
                        cols[2].appendChild(document.createTextNode("D" + gpios[0]));

                        var cols = addNewRow();

                        cols[0].appendChild(document.createTextNode(sensor.type));
                        cols[1].appendChild(document.createTextNode(sensor.name + ".down"));
                        cols[2].appendChild(document.createTextNode("D" + gpios[1]));
                        var cols = addNewRow();

                        cols[0].appendChild(document.createTextNode(sensor.type));
                        cols[1].appendChild(document.createTextNode(sensor.name + ".left"));
                        cols[2].appendChild(document.createTextNode("D" + gpios[2]));
                        var cols = addNewRow();

                        cols[0].appendChild(document.createTextNode(sensor.type));
                        cols[1].appendChild(document.createTextNode(sensor.name + ".right"));
                        cols[2].appendChild(document.createTextNode("D" + gpios[3]));
                        var cols = addNewRow();

                        cols[0].appendChild(document.createTextNode(sensor.type));
                        cols[1].appendChild(document.createTextNode(sensor.name + ".center"));
                        cols[2].appendChild(document.createTextNode("D" + gpios[4]));

/*
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
    */
                    }
                    else
                    {          
                        var cols = addNewRow();
    
    
                        cols[0].appendChild(document.createTextNode(sensor.type));
                        cols[1].appendChild(document.createTextNode(sensor.name));
                        cols[2].appendChild(document.createTextNode(sensor.port));
                    }
           
                }

                $('#picancel').click(function () {
                    $('#popupMessage').hide();
                    window.displayHelper.popupMessageShown = false;
                });

        });

        $('#piinstall').click(function () {
            context.blocklyHelper.reportValues = false;

            var python_code = context.generatePythonSensorTable();
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


        if (parseInt(getSessionStorage('autoConnect'))) {
            if (!context.quickPiConnection.isConnected() && !context.quickPiConnection.isConnecting()) {
                $('#piconnect').attr("disabled", true);
                context.quickPiConnection.connect(getSessionStorage('quickPiUrl'));
            }
        }
    };

    function warnClientSensorStateChanged(sensor) {
        if (context.dispatchContextEvent) {
            var sensorStateCopy = JSON.parse(JSON.stringify(sensor.state));
            context.dispatchContextEvent({type: 'quickpi/changeSensorState', payload: [sensor.name, sensorStateCopy], onlyLog: true});
        }
    }

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
                sensor.callsInTimeSlot = 0;
                sensor.lastTimeIncrease = 0;

                infos.quickPiSensors.push(newSensor);
            }

            var newSensor = {
                "type": "cloudstore",
                "name": "cloud1",
            };
            infos.quickPiSensors.push(newSensor);
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

            window.displayHelper.showPopupDialog("<div class=\"content qpi\">" +
                "   <div class=\"panel-heading\">" +
                "       <h2 class=\"sectionTitle\">" +
                "           <span class=\"iconTag\"><i class=\"icon fas fa-list-ul\"></i></span>" +
                            strings.messages.addcomponent +
                "       </h2>" +
                "       <div class=\"exit\" id=\"picancel\"><i class=\"icon fas fa-times\"></i></div>" +
                "   </div>" +
                "   <div id=\"sensorPicker\" class=\"panel-body\">" +
                "       <label>" + strings.messages.selectcomponent + "</label>" +
                "       <div class=\"flex-container\">" +
                "           <div id=\"selector-image-container\" class=\"flex-col half\">" +
                "               <img id=\"selector-sensor-image\">" +
                "           </div>" +
                "           <div class=\"flex-col half\">" +
                "               <div class=\"form-group\">" +
                "                   <div class=\"input-group\">" +
                "                       <select id=\"selector-sensor-list\" class=\"custom-select\"></select>" +
                "                   </div>" +
                "              </div>" +
                "              <div class=\"form-group\">" +
                "                   <div class=\"input-group\">" +
                "                       <select id=\"selector-sensor-port\" class=\"custom-select\"></select>" +
                "                   </div>" +
                "                   <label id=\"selector-label\"></label>" +
                "               </div>" +
                "           </div>" +
                "       </div>" +
                "   </div>" +
                "   <div class=\"singleButton\">" +
                "       <button id=\"selector-add-button\" class=\"btn btn-centered\"><i class=\"icon fa fa-check\"></i>" + strings.messages.add + "</button>" +
                "   </div>" +
                "</div>");

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

                    el.textContent = sensorDefinition.description + strings.messages.builtin;
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
                var name = getNewSensorSuggestedName(sensorDefinition.suggestedName);

                if(name == 'screen1') {
                    // prepend screen because squareSize func can't handle cells wrap
                    infos.quickPiSensors.unshift({
                        type: sensorDefinition.name,
                        subType: sensorDefinition.subType,
                        port: port,
                        name: name
                    });                    

                } else {
                    infos.quickPiSensors.push({
                        type: sensorDefinition.name,
                        subType: sensorDefinition.subType,
                        port: port,
                        name: name
                    });                    
                }



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
    function squareSize(x, y, n, ratio) {
        // Compute number of rows and columns, and cell size
        var ratio = x / y * ratio;
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

        setSessionStorage('autoConnect', "1");

        context.recreateDisplay = true;
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
            context.quickPiConnection.connect(getSessionStorage('quickPiUrl'));
        } else {
            // If I was never connected don't attempt to autoconnect again
            setSessionStorage('autoConnect', "0");
            window.task.displayedSubTask.context.resetDisplay();
        }

    }

    function raspberryPiChangeBoard(board) {

        if (board != "unknow")
        {
            window.task.displayedSubTask.context.changeBoard(board);
            window.task.displayedSubTask.context.resetSensorTable();
        }
    }


    // Update the context's display to the new scale (after a window resize for instance)
    context.updateScale = function () {
        if (!context.display) {
            return;
        }

        var width = $('#virtualSensors').width();
        var height =  $('#virtualSensors').height();

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

        var timelinewidth = context.maxTime * context.pixelsPerTime;

        var pixelsPerTick = 50;
        var numberofTicks = timelinewidth / pixelsPerTick;
        var step = context.maxTime / numberofTicks;

        if (step > 1000)
        {
            step = Math.round(step / 1000) * 1000;
        }
        else if (step > 500)
        {
            step = Math.round(step / 500) * 500;
        }
        else if (step > 100)
        {
            step = Math.round(step / 100) * 100;
        }
        else if (step > 10)
        {
            step = Math.round(step / 10) * 10;
        }

        var i = 0;
        var lastx = 0;
        var color = false;

        var textStart = 0;

        var timelabel = paper.text(textStart, context.timeLineY, strings.messages.timeLabel);
        timelabel.attr({ "font-size": "10px", 'text-anchor': 'start', 'font-weight': 'bold', fill: "gray" });
        context.timelineText.push(timelabel);
        timelabel.node.style.MozUserSelect = "none";
        timelabel.node.style.WebkitUserSelect = "none";

        var bbox = timelabel.getBBox();
        textStart = bbox.x + bbox.width + 3;

        var timelabel = paper.text(textStart, context.timeLineY, '\uf00e');      
        timelabel.node.style.fontFamily = '"Font Awesome 5 Free"';
        timelabel.node.style.fontWeight = "bold";
        timelabel.node.style.MozUserSelect = "none";
        timelabel.node.style.WebkitUserSelect = "none";

        timelabel.attr({ "font-size": "20" + "px",
        'text-anchor': 'start',
         'font-weight': 'bold',
         'fill': "#4A90E2",
         });
        context.timelineText.push(timelabel);

        timelabel.click(function()
        {
            var originalzoom = context.quickPiZoom;
            context.quickPiZoom += 0.3;
        
            if (context.quickPiZoom < 1)
                context.quickPiZoom = 1;

            if (originalzoom != context.quickPiZoom)
                context.resetDisplay();
        });


        var bbox = timelabel.getBBox();
        textStart = bbox.x + bbox.width + 3;

        var timelabel = paper.text(textStart, context.timeLineY, '\uf010');      
        timelabel.node.style.fontFamily = '"Font Awesome 5 Free"';
        timelabel.node.style.fontWeight = "bold";
        timelabel.node.style.MozUserSelect = "none";
        timelabel.node.style.WebkitUserSelect = "none";

        timelabel.attr({ "font-size": "20" + "px",
         'text-anchor': 'start',
          'font-weight': 'bold',
           'fill': "#4A90E2",
         });
        context.timelineText.push(timelabel);

        timelabel.click(function()
        {
            var originalzoom = context.quickPiZoom;
            context.quickPiZoom -= 0.3;
        
            if (context.quickPiZoom < 1)
                context.quickPiZoom = 1;

            if (originalzoom != context.quickPiZoom)
                context.resetDisplay();
        });


        
        for (; i <= context.maxTime; i += step) {
            var x = context.timelineStartx + (i * context.pixelsPerTime);

            var labelText = (i / 1000).toFixed(2);
            if (step >= 1000)
                labelText = (i / 1000).toFixed(0);


            var timelabel = paper.text(x, context.timeLineY, labelText);

            timelabel.attr({ "font-size": "15px", 'text-anchor': 'center', 'font-weight': 'bold', fill: "gray" });
            timelabel.node.style = "-moz-user-select: none; -webkit-user-select: none;";

            context.timelineText.push(timelabel);


            var timelinedivisor = paper.path(["M", x,
                                        0,
                                        "L", x,
                                        context.timeLineY]);
                timelinedivisor.attr({
                                           "stroke-width": 1,
                                            "stroke": "lightgray",
                                             "opacity": 0.2,
                                             'z-index': 100,
 
                                            });

            context.sensorStates.push(timelinedivisor);
        }
        if (!context.timeLineHoverLine || isElementRemoved(context.timeLineHoverLine)) {    
            context.timeLineHoverLine = paper.rect(0, 0, 0, 0);
        }

        context.timeLineHoverLine.attr({
                                            "stroke": "blue",
                                             "opacity": 0.2,
                                             "opacity": 0
        });

        
        if (context.timeLineHoverPath) {
            context.timeLineHoverPath.remove();
        }

        context.timeLineHoverPath = paper.rect(context.timelineStartx, 0, context.maxTime * context.pixelsPerTime, context.timeLineY);
        
        context.timeLineHoverPath.attr({
            "fill": "lightgray",
            "stroke": "none",
            "opacity": 0.0,
        });



        context.timeLineHoverPath.mousemove(function(event){

            if (context.runner && context.runner.isRunning())
                return;

            $('#screentooltip').remove();
            var scrolloffset = $('#virtualSensors').scrollLeft();

            var ms = (event.clientX + scrolloffset - context.timelineStartx) / context.pixelsPerTime;
            ms = Math.round(ms);

            if (ms < -4)
                return;
            if (ms < 0)
                ms = 0;

            $( "body" ).append('<div id="screentooltip"></div>');
            $('#screentooltip').css("position", "absolute");
            $('#screentooltip').css("border", "1px solid gray");
            $('#screentooltip').css("background-color", "#efefef");
            $('#screentooltip').css("padding", "3px");
            $('#screentooltip').css("z-index", "1000");

                        
            $('#screentooltip').css("left", event.clientX + 2).css("top", event.clientY + 2);

            $('#screentooltip').text(ms.toString() + "ms");

            
            for(var sensorName in context.gradingStatesBySensor) {
                // Cycle through each sensor from the grading states
                var sensor = findSensorByName(sensorName);
                var sensorDef = findSensorDefinition(sensor);

                var expectedStates = context.gradingStatesBySensor[sensorName];
                if(!expectedStates.length) { continue;}

                var actualStates = context.actualStatesBySensor[sensorName];
                var actualIdx = 0;

                var currentSensorState = null;

                // Check that we went through all expected states
                for (var i = 0; i < context.gradingStatesBySensor[sensorName].length; i++) {
                    var expectedState = context.gradingStatesBySensor[sensorName][i];

                    if (expectedState.time >= ms)
                    {
                        break;
                    }

                    currentSensorState = expectedState;
                }

                if (currentSensorState)
                {
                    sensor.state = currentSensorState.state;
                    drawSensor(sensor);
                }
            }

            context.timeLineHoverLine.attr({
                        "x": event.clientX + scrolloffset,
                        "y": 0,
                        "width": 1,
                        "height": context.timeLineY,

                                           "stroke-width": 4,
                                            "stroke": "blue",
                                             "opacity": 0.2,
                                             "stroke-linecap": "square",
                                             "stroke-linejoin": "round",
            });

        });

        context.timeLineHoverPath.mouseout(function() {
            if (context.runner && context.runner.isRunning())
                return;

            context.timeLineHoverLine.attr({
                "opacity": 0.0,
            });

            $('#screentooltip').remove();

            context.resetSensors();
            for (var iSensor = 0; iSensor < infos.quickPiSensors.length; iSensor++) {
                var sensor = infos.quickPiSensors[iSensor];

                drawSensor(sensor);
            }
            
        });


        if (!context.loopsForever) {
            var endx = context.timelineStartx + (context.maxTime * context.pixelsPerTime);
            var x = context.timelineStartx + (i * context.pixelsPerTime);
            var timelabel = paper.text(x, context.timeLineY, '\uf11e');      
            timelabel.node.style.fontFamily = '"Font Awesome 5 Free"';
            timelabel.node.style.fontWeight = "bold";
            timelabel.node.style.MozUserSelect = "none";
            timelabel.node.style.WebkitUserSelect = "none";
    

            timelabel.attr({ "font-size": "20" + "px", 'text-anchor': 'middle', 'font-weight': 'bold', fill: "gray" });
            context.timelineText.push(timelabel);

			if (context.timeLineEndLine)
				context.timeLineEndLine.remove();

            context.timeLineEndLine = paper.path(["M", endx,
                                                0,
                                                "L", endx,
                                                context.timeLineY]);


            if (context.endFlagEnd)
                context.endFlagEnd.remove();
            context.endFlagEnd = paper.rect(endx, 0, x, context.timeLineY + 10);
            context.endFlagEnd.attr({
                "fill": "lightgray",
                "stroke": "none",
                "opacity": 0.2,
            });
        }


        /*
                paper.path(["M", context.timelineStartx,
                    paper.height - context.sensorSize * 3 / 4,
                    "L", paper.width,
                    paper.height - context.sensorSize * 3 / 4]);
        */
    }

    function drawCurrentTime() {
        if (!paper || !context.display || isNaN(context.currentTime))
            return;
/*
        if (context.currentTimeText)
            context.currentTimeText.remove();

        context.currentTimeText = paper.text(0, paper.height - 40, context.currentTime.toString() + "ms");
        context.currentTimeText.attr({
            "font-size": "10px",
            'text-anchor': 'start'
        });            */

        if (!context.autoGrading)
            return;

        var animationSpeed = 200; // ms
        var startx = context.timelineStartx + (context.currentTime * context.pixelsPerTime);

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


    function drawSensorTimeLineState(sensor, state, startTime, endTime, type, skipsave = false, expectedState = null) {
        if (!skipsave) {
            storeTimeLineState(sensor, state, startTime, endTime, type);
        }

        if (paper == undefined ||
            !context.display ||
            !context.autoGrading)
            return;

        var startx = context.timelineStartx + (startTime * context.pixelsPerTime);
        var stateLenght = (endTime - startTime) * context.pixelsPerTime;

        var ypositionmiddle = ((sensor.drawInfo.y + (context.timeLineSlotHeight * .5)));

        var ypositiontop = sensor.drawInfo.y
        var ypositionbottom = sensor.drawInfo.y + context.timeLineSlotHeight;

        var color = "green";
        var strokewidth = 4;
        if (type == "expected" || type == "finnish") {
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

        var drawnElements = [];
        var deleteLastDrawnElements = true;

        if (sensor.type == "accelerometer" ||
            sensor.type == "gyroscope" ||
            sensor.type == "magnetometer") {

            if (state != null) {
            for (var i = 0; i < 3; i++) {
                var startx = context.timelineStartx + (startTime * context.pixelsPerTime);
                var stateLenght = (endTime - startTime) * context.pixelsPerTime;
        
                var yspace = context.timeLineSlotHeight / 3;
                var ypositiontop = sensor.drawInfo.y + (yspace * i)
                var ypositionbottom = ypositiontop + yspace;
        
                var offset = (ypositionbottom - ypositiontop) * findSensorDefinition(sensor).getPercentageFromState(state[i], sensor);
                
                if (type == "expected" || type == "finnish") {
                    color = "lightgrey";
                    strokewidth = 4;
                } else  if (type == "wrong") {
                    color = "red";
                    strokewidth = 2;
                }
                else if (type == "actual") {
                    color = "yellow";
                    strokewidth = 2;
                }

                if (sensor.lastAnalogState != null &&
                    sensor.lastAnalogState[i] != state[i]) {

                    var oldStatePercentage = findSensorDefinition(sensor).getPercentageFromState(sensor.lastAnalogState[i], sensor);

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
                    context.sensorStates.push(joinline);

                    if (sensor.timelinelastxlabel == null)
                        sensor.timelinelastxlabel = [0, 0, 0];
                
                    if ((startx) - sensor.timelinelastxlabel[i] > 40)
                    {
                        var sensorDef = findSensorDefinition(sensor);
                        var stateText = state.toString();
                        if(sensorDef && sensorDef.getStateString) {
                            stateText = sensorDef.getStateString(state[i]);
                        }

                        var paperText = paper.text(startx, ypositiontop + offset - 10, stateText);
                        drawnElements.push(paperText);
                        context.sensorStates.push(paperText);

                        sensor.timelinelastxlabel[i] = startx;
                    }
                }

                var stateline = paper.path(["M", startx,
                    ypositiontop + offset,
                    "L", startx + stateLenght,
                    ypositiontop + offset]);

                stateline.attr({
                    "stroke-width": strokewidth,
                    "stroke": color,
                    "stroke-linejoin": "round",
                    "stroke-linecap": "round"
                });

                drawnElements.push(stateline);
                context.sensorStates.push(stateline);
            }
                sensor.lastAnalogState = state == null ? [0, 0, 0] : state;
            }
            

        } else
        if (isAnalog || sensor.showAsAnalog) {
            var offset = (ypositionbottom - ypositiontop) * findSensorDefinition(sensor).getPercentageFromState(state, sensor);

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
                var oldStatePercentage = findSensorDefinition(sensor).getPercentageFromState(sensor.lastAnalogState, sensor);

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

                context.sensorStates.push(joinline);

                if (!sensor.timelinelastxlabel)
                    sensor.timelinelastxlabel = 0;
                
                if (!sensor.timelinelastxlabel)
                    sensor.timelinelastxlabel = 0;

                if ((startx) - sensor.timelinelastxlabel > 5)
                {
                    var sensorDef = findSensorDefinition(sensor);
                    var stateText = state.toString();
                    if(sensorDef && sensorDef.getStateString) {
                        stateText = sensorDef.getStateString(state);
                    }

                    var y = 0;

                    if (sensor.timelinestateup) {
                        y = ypositiontop + offset - 10;
                        sensor.timelinestateup = false;
                    }
                    else {
                        y = ypositiontop + offset + 10;
                        
                        sensor.timelinestateup = true;
                    }

                    var paperText = paper.text(startx, y, stateText);
                    drawnElements.push(paperText);
                    context.sensorStates.push(paperText);

                    sensor.timelinelastxlabel = startx;
                }
            }

            sensor.lastAnalogState = state == null ? 0 : state;

            var stateline = paper.path(["M", startx,
                ypositiontop + offset,
                "L", startx + stateLenght,
                ypositiontop + offset]);

            stateline.attr({
                "stroke-width": strokewidth,
                "stroke": color,
                "stroke-linejoin": "round",
                "stroke-linecap": "round"
            });

            drawnElements.push(stateline);
            context.sensorStates.push(stateline);
        } else if (sensor.type == "stick") {
            var stateToFA = [
                "\uf062",
                "\uf063",
                "\uf060",
                "\uf061",
                "\uf111",
            ]
            

            var spacing = context.timeLineSlotHeight / 5;
            for (var i = 0; i < 5; i++)
            {
                if (state && state[i])
                {
                    var ypos = sensor.drawInfo.y + (i * spacing);
                    var startingpath = ["M", startx,
                            ypos,
                            "L", startx,
                            ypos];

                    var targetpath = ["M", startx,
                            ypos,
                            "L", startx + stateLenght,
                            ypos];

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
                        "stroke-width": 2,
                        "stroke": color,
                        "stroke-linejoin": "round",
                        "stroke-linecap": "round"
                    });

                    drawnElements.push(stateline);
                    context.sensorStates.push(stateline);

                    if (type == "expected") {
                        sensor.stateArrow = paper.text(startx, ypos + 7, stateToFA[i]);
                        context.sensorStates.push(sensor.stateArrow);

                        sensor.stateArrow.attr({
                            "text-anchor": "start",
                            "font": "Font Awesome 5 Free",
                            "stroke": color,
                            "fill": color,
                            "font-size": (strokewidth * 2) + "px"
                        });
        
                        sensor.stateArrow.node.style.fontFamily = '"Font Awesome 5 Free"';
                        sensor.stateArrow.node.style.fontWeight = "bold";
                    }
                }
            }

        } else if (sensor.type == "screen" && state) {
            var sensorDef = findSensorDefinition(sensor);
            if (type != "actual" || !sensor.lastScreenState || !sensorDef.compareState(sensor.lastScreenState, state)) 
            {
                sensor.lastScreenState = state;
                if (state.isDrawingData) {
                    var stateBubble = paper.text(startx, ypositiontop + 10, '\uf303');

                    stateBubble.attr({
                        "font": "Font Awesome 5 Free",
                        "stroke": color,
                        "fill": color,
                        "font-size": (4 * 2) + "px"
                    });

                    stateBubble.node.style.fontFamily = '"Font Awesome 5 Free"';
                    stateBubble.node.style.fontWeight = "bold";

                    $(stateBubble.node).css("z-index", "1");

                    function showPopup(event) {

                        if (!sensor.showingTooltip)
                        {
                            $( "body" ).append('<div id="screentooltip"></div>');

                            $('#screentooltip').css("position", "absolute");
                            $('#screentooltip').css("border", "1px solid gray");
                            $('#screentooltip').css("background-color", "#efefef");
                            $('#screentooltip').css("padding", "3px");
                            $('#screentooltip').css("z-index", "1000");
                            $('#screentooltip').css("width", "262px");
                            $('#screentooltip').css("height", "70px");

                            $('#screentooltip').css("left", event.clientX+2).css("top", event.clientY+2);

                            var canvas = document.createElement("canvas");
                            canvas.id = "tooltipcanvas";
                            canvas.width = 128 * 2;
                            canvas.height = 32 * 2;
                            $('#screentooltip').append(canvas);

                            
                            $(canvas).css("position", "absolute");
                            $(canvas).css("z-index", "1500");
                            $(canvas).css("left", 3).css("top", 3);


                            var ctx = canvas.getContext('2d');

                            if (expectedState && type == "wrong") {
                                screenDrawing.renderDifferences(expectedState, state, canvas, 2);
                            } else {
                                screenDrawing.renderToCanvas(state, canvas, 2);
                            }
      
                            sensor.showingTooltip = true;
                        }
                    };

                    $(stateBubble.node).mouseenter(showPopup);
                    $(stateBubble.node).click(showPopup);

                    $(stateBubble.node).mouseleave(function(event) {
                        sensor.showingTooltip = false;
                        $('#screentooltip').remove();
                    });

                } else {
                    var stateBubble = paper.text(startx, ypositionmiddle + 10, '\uf27a');

                    stateBubble.attr({
                        "font": "Font Awesome 5 Free",
                        "stroke": color,
                        "fill": color,
                        "font-size": (strokewidth * 2) + "px"
                    });

                    stateBubble.node.style.fontFamily = '"Font Awesome 5 Free"';
                    stateBubble.node.style.fontWeight = "bold";

                    function showPopup() {
                        if (!sensor.tooltip) {
                            sensor.tooltipText = paper.text(startx, ypositionmiddle + 50, state.line1 + "\n" + (state.line2 ? state.line2 : ""));

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

                    stateBubble.click(showPopup);

                    stateBubble.hover(showPopup, function () {
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
                drawnElements.push(stateBubble);
                context.sensorStates.push(stateBubble);
            } else {
                deleteLastDrawnElements = false;
            }
        } else if (sensor.type == "cloudstore") {
            var sensorDef = findSensorDefinition(sensor);
            if (type != "actual" || !sensor.lastScreenState || !sensorDef.compareState(sensor.lastScreenState, state)) 
            {
                sensor.lastScreenState = state;
                    var stateBubble = paper.text(startx, ypositionmiddle + 10, '\uf044');

                    stateBubble.attr({
                        "font": "Font Awesome 5 Free",
                        "stroke": color,
                        "fill": color,
                        "font-size": (4 * 2) + "px"
                    });

                    stateBubble.node.style.fontFamily = '"Font Awesome 5 Free"';
                    stateBubble.node.style.fontWeight = "bold";

                    function showPopup(event) {

                        if (!sensor.showingTooltip)
                        {
                            $( "body" ).append('<div id="screentooltip"></div>');

                            $('#screentooltip').css("position", "absolute");
                            $('#screentooltip').css("border", "1px solid gray");
                            $('#screentooltip').css("background-color", "#efefef");
                            $('#screentooltip').css("padding", "3px");
                            $('#screentooltip').css("z-index", "1000");
                            /*
                            $('#screentooltip').css("width", "262px");
                            $('#screentooltip').css("height", "70px");*/

                            $('#screentooltip').css("left", event.clientX+2).css("top", event.clientY+2);


                            if (expectedState && type == "wrong") {
                                var div = quickPiStore.renderDifferences(expectedState, state);
                                $('#screentooltip').append(div);
                            } else {
                                for (var property in state) {
                                    var div = document.createElement("div");
                                    $(div).text(property + " = " + state[property]);
                                    $('#screentooltip').append(div);
                                }
                            }

                            sensor.showingTooltip = true;
                        }
                    };

                    $(stateBubble.node).mouseenter(showPopup);
                    $(stateBubble.node).click(showPopup);

                    $(stateBubble.node).mouseleave(function(event) {
                        sensor.showingTooltip = false;
                        $('#screentooltip').remove();
                    });

                drawnElements.push(stateBubble);
                context.sensorStates.push(stateBubble);
                
            } else {
                deleteLastDrawnElements = false;
            }
        } else if (percentage != 0) {
            if (type == "wrong" || type == "actual") {
                ypositionmiddle += 2;
            }

            if (type == "expected") {
                var c = paper.rect(startx, ypositionmiddle, stateLenght, strokewidth);
                c.attr({
                    "stroke": "none",
                    "fill": color,
                });

            } else {
                var c = paper.rect(startx, ypositionmiddle, 0, strokewidth);
                c.attr({
                    "stroke": "none",
                    "fill": color,
                });

                c.animate({ width: stateLenght }, 200);
            }
            drawnElements.push(c);
            context.sensorStates.push(c);
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

        if(type == 'actual' || type == 'wrong') {
            if(!sensor.drawnGradingElements) {
                sensor.drawnGradingElements = [];
            } else if(deleteLastDrawnElements) {
                for(var i = 0; i < sensor.drawnGradingElements.length; i++) {
                    var dge = sensor.drawnGradingElements[i];
                    if(dge.time >= startTime) {
                        for(var j = 0; j < dge.elements.length; j++) {
                            dge.elements[j].remove();
                        }
                        sensor.drawnGradingElements.splice(i, 1);
                        i -= 1;
                    }
                }
            }
            if(drawnElements.length) {
                sensor.drawnGradingElements.push({time: startTime, elements: drawnElements});
            }
        }

        // Make sure the current time bar is always on top of states
        drawCurrentTime();
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

            warnClientSensorStateChanged(sensor);
            drawSensor(sensor, true);
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

            warnClientSensorStateChanged(sensor);
            drawSensor(sensor, true);
        });


        var thumbwidth = outsidewidth * .80;
        sliderobj.sliderdata.thumbheight = outsidewidth * 1.4;
        sliderobj.sliderdata.scale = (sliderobj.sliderdata.insideheight - sliderobj.sliderdata.thumbheight);


        if (Array.isArray(sensor.state)) {
            var percentage = findSensorDefinition(sensor).getPercentageFromState(sensor.state[index], sensor);
        } else {
            var percentage = findSensorDefinition(sensor).getPercentageFromState(sensor.state, sensor);
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
                warnClientSensorStateChanged(sensor);
                drawSensor(sensor, true);
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

                    var percentage = findSensorDefinition(sensor).getPercentageFromState(sensor.state[i], sensor);

                    thumby = sensor.sliders[i].sliderdata.insiderecty +
                        sensor.sliders[i].sliderdata.insideheight -
                        sensor.sliders[i].sliderdata.thumbheight -
                        (percentage * sensor.sliders[i].sliderdata.scale);

                    sensor.sliders[i].thumb.attr('y', thumby);
                }
            } else {
                var percentage = findSensorDefinition(sensor).getPercentageFromState(sensor.state, sensor);

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
                warnClientSensorStateChanged(sensor);
                drawSensor(sensor, true);

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
                    offset = sensor.drawInfo.width * .70;
                }

                // if offset is equal to 0, we need to reverse
                if (offset == 0) {
                    for (var i = 0; i < sensor.state.length; i++) {
                        var sliderobj = createSlider(sensor,
                            max,
                            min,
                            sensor.drawInfo.x + offset + (sign * Math.abs(i + 1 - sensor.state.length) * sensor.drawInfo.height / 5),
                            sensor.drawInfo.y,
                            sensor.drawInfo.height,
                            sensor.drawInfo.height,
                            i);

                        sensor.sliders.push(sliderobj);
                    }
                }
                else {
                    for (var i = 0; i < sensor.state.length; i++) {
                        var sliderobj = createSlider(sensor,
                            max,
                            min,
                            sensor.drawInfo.x + offset + (sign * i * sensor.drawInfo.height / 5),
                            sensor.drawInfo.y,
                            sensor.drawInfo.height,
                            sensor.drawInfo.height,
                            i);

                        sensor.sliders.push(sliderobj);
                    }
                }
            } else {
                var sliderobj = createSlider(sensor,
                    max,
                    min,
                    sensor.drawInfo.x,
                    sensor.drawInfo.y,
                    sensor.drawInfo.height,
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

    function isElementRemoved(element) {
        return !element.paper.canvas || !element.node.parentElement;
    }

    var irRemoteDialog = "<div class=\"content qpi\">" +
        "   <div class=\"panel-heading\">" +
        "       <h2 class=\"sectionTitle\">" +
        "           <span class=\"iconTag\"><i class=\"icon fas fa-list-ul\"></i></span>" +
                    strings.messages.irRemoteControl +
        "       </h2>" +
        "       <div class=\"exit\" id=\"picancel\"><i class=\"icon fas fa-times\"></i></div>" +
        "   </div>" +
        "   <div id=\"sensorPicker\" class=\"panel-body\">" +
        "       <div id=\"piremotemessage\" >" +
        "       </div>" +
        "       <div id=\"piremotecontent\" >" +
        "       </div>" +
        "   </div>" +
        "   <div class=\"singleButton\">" +
        "       <button id=\"picancel2\" class=\"btn btn-centered\"><i class=\"icon fa fa-check\"></i>" + strings.messages.closeDialog + "</button>" +
        "   </div>" +
        "</div>";

    function drawSensor(sensor, juststate = false, donotmovefocusrect = false) {
        saveSensorStateIfNotRunning(sensor);

        if (paper == undefined || !context.display || !sensor.drawInfo)
            return;

        var scrolloffset = 0;
        var fadeopacity = 1;

        var imgw = sensor.drawInfo.width / 1.8;
        var imgh = sensor.drawInfo.height / 2;
        imgw = imgh;

        var imgx = sensor.drawInfo.x - (imgw / 2) + (sensor.drawInfo.width / 2); 
        var imgy = sensor.drawInfo.y + (sensor.drawInfo.height / 2) - (imgh / 2);

        var state1x =  (imgx + imgw) + 3;
        var state1y = imgy + imgh / 3;

        var state1x = sensor.drawInfo.x + (sensor.drawInfo.width / 2)
        var state1y = imgy + imgh + 6;
        var stateanchor = "middle";

        if (sensor.type == "accelerometer" ||
            sensor.type == "gyroscope" ||
            sensor.type == "magnetometer" ||
            sensor.type == "stick")
        {
            if (context.compactLayout)
                imgx = sensor.drawInfo.x + 5;
            else
                imgx = sensor.drawInfo.x - (imgw / 4) + (sensor.drawInfo.width / 4); 

            state1x =  (imgx + imgw) + 10;
            state1y = imgy; 
            stateanchor = 'start';
        }


        var portx = state1x;
        var porty = imgy;

        var namex = sensor.drawInfo.x + (sensor.drawInfo.width / 2);
        var namey = sensor.drawInfo.y + (imgh * 0.20);
        var nameanchor = "middle";

        var portsize = sensor.drawInfo.height * 0.11;

        if (context.compactLayout)
            var statesize = sensor.drawInfo.height * 0.14;
        else
            var statesize = sensor.drawInfo.height * 0.10;

        var namesize = sensor.drawInfo.height * 0.15;

        

        var drawPortText = true;
        var drawName = true;

        drawPortText = false;

        if (!sensor.focusrect || isElementRemoved(sensor.focusrect))
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

            scrolloffset = $('#virtualSensors').scrollLeft();

            if (scrolloffset > 0)
                fadeopacity = 0.3;

            imgw = sensor.drawInfo.width * .80;
            imgh = sensor.drawInfo.height * .80;

            imgx = sensor.drawInfo.x + (imgw * 0.75) + scrolloffset;
            imgy = sensor.drawInfo.y + (sensor.drawInfo.height / 2) - (imgh / 2);

            state1x = imgx + imgw * 1.2;
            state1y = imgy + (imgh / 2);

            portx = sensor.drawInfo.x;
            porty = imgy + (imgh / 2);

            portsize = imgh / 3;
            statesize = sensor.drawInfo.height * 0.2;

            namex = portx;
            namesize = portsize;
            nameanchor = "start";
        }


        if (sensor.type == "led") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state == null)
                sensor.state = 0;

            if (!sensor.ledoff || isElementRemoved(sensor.ledoff)) {
                sensor.ledoff = paper.image(getImg('ledoff.png'), imgx, imgy, imgw, imgh);

                    sensor.focusrect.click(function () {
                        if (!context.autoGrading && (!context.runner || !context.runner.isRunning())) {
                            sensor.state = !sensor.state;
                            warnClientSensorStateChanged(sensor);
                            drawSensor(sensor);
                        } else {
                            actuatorsInRunningModeError();
                        }
                    });
            }

            if (!sensor.ledon || isElementRemoved(sensor.ledon)) {
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

            if (sensor.showAsAnalog)
            {
                sensor.stateText = paper.text(state1x, state1y, sensor.state);
            }
            else
            {
                if (sensor.state) {
                    sensor.stateText = paper.text(state1x, state1y, strings.messages.on.toUpperCase());
                } else {
                    sensor.stateText = paper.text(state1x, state1y, strings.messages.off.toUpperCase());
                }
            }

            if (sensor.state) {
                sensor.ledon.attr({ "opacity": fadeopacity });
                sensor.ledoff.attr({ "opacity": 0 });
            } else {
                sensor.ledon.attr({ "opacity": 0 });
                sensor.ledoff.attr({ "opacity": fadeopacity });
            }

            var x = typeof sensor.state;

            if(typeof sensor.state == 'number' ) {
                sensor.ledon.attr({ "opacity": sensor.state * fadeopacity });
                sensor.ledoff.attr({ "opacity": fadeopacity });
            }


            if ((!context.runner || !context.runner.isRunning())
                && !context.offLineMode) {

                findSensorDefinition(sensor).setLiveState(sensor, sensor.state, function(x) {});
            }

        } else if (sensor.type == "buzzer") {           

            if(typeof sensor.state == 'number' &&
               sensor.state != 0 &&
               sensor.state != 1) {
                buzzerSound.start(sensor.name, sensor.state);
            } else if (sensor.state) {
                buzzerSound.start(sensor.name);
            } else {
                buzzerSound.stop(sensor.name);
            }

            if(!juststate) {
                if(sensor.muteBtn) {
                    sensor.muteBtn.remove();
                }
                

                var muteBtnSize = sensor.drawInfo.width * 0.15;
                sensor.muteBtn = paper.text(
                    imgx + imgw, 
                    imgy + (imgh / 2), 
                    buzzerSound.isMuted(sensor.name) ? "\uf6a9" : "\uf028"
                );
                sensor.muteBtn.node.style.fontWeight = "bold";           
                sensor.muteBtn.node.style.cursor = "default";           
                sensor.muteBtn.node.style.MozUserSelect = "none";
                sensor.muteBtn.node.style.WebkitUserSelect = "none";
                sensor.muteBtn.attr({
                    "font-size": muteBtnSize + "px",                
                    fill: buzzerSound.isMuted(sensor.name) ? "lightgray" : "#468DDF",
                    "font-family": '"Font Awesome 5 Free"',
                    'text-anchor': 'start'
                });            
                sensor.muteBtn.click(function () {
                    if(buzzerSound.isMuted(sensor.name)) {
                        buzzerSound.unmute(sensor.name)
                    } else {
                        buzzerSound.mute(sensor.name)
                    }
                    drawSensor(sensor);
                });
            }            


            if (!sensor.buzzeron || isElementRemoved(sensor.buzzeron))
                sensor.buzzeron = paper.image(getImg('buzzer-ringing.png'), imgx, imgy, imgw, imgh);

            if (!sensor.buzzeroff || isElementRemoved(sensor.buzzeroff)) {
                sensor.buzzeroff = paper.image(getImg('buzzer.png'), imgx, imgy, imgw, imgh);

                    sensor.focusrect.click(function () {
                        if (!context.autoGrading && (!context.runner || !context.runner.isRunning())) {
                            sensor.state = !sensor.state;
                            warnClientSensorStateChanged(sensor);
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
                            drawSensor(sensor, true, true);
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
                sensor.buzzeron.attr({ "opacity": fadeopacity });
                sensor.buzzeroff.attr({ "opacity": 0 });


            } else {
                sensor.buzzeron.attr({ "opacity": 0 });
                sensor.buzzeroff.attr({ "opacity": fadeopacity });
            }

            if (sensor.stateText)
                sensor.stateText.remove();

            var stateText = findSensorDefinition(sensor).getStateString(sensor.state);

            sensor.stateText = paper.text(state1x, state1y, stateText);


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

            if (!sensor.buttonon || isElementRemoved(sensor.buttonon))
                sensor.buttonon = paper.image(getImg('buttonon.png'), imgx, imgy, imgw, imgh);

            if (!sensor.buttonoff || isElementRemoved(sensor.buttonoff))
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
                sensor.buttonon.attr({ "opacity": fadeopacity });
                sensor.buttonoff.attr({ "opacity": 0 });

                sensor.stateText = paper.text(state1x, state1y, strings.messages.on.toUpperCase());
            } else {
                sensor.buttonon.attr({ "opacity": 0 });
                sensor.buttonoff.attr({ "opacity": fadeopacity });

                sensor.stateText = paper.text(state1x, state1y, strings.messages.off.toUpperCase());
            }

            if (!context.autoGrading && !sensor.buttonon.node.onmousedown) {
                sensor.focusrect.node.onmousedown = function () {
                    if (context.offLineMode) {
                        sensor.state = true;
                        warnClientSensorStateChanged(sensor);
                        drawSensor(sensor);
                    } else
                        sensorInConnectedModeError();
                };


                sensor.focusrect.node.onmouseup = function () {
                    if (context.offLineMode) {
                        sensor.state = false;
                        sensor.wasPressed = true;
                        warnClientSensorStateChanged(sensor);
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

            var borderSize = 5;

            var screenScale = 2;
            if(sensor.drawInfo.width < 300) {
                screenScale = 1;
            }
            if(sensor.drawInfo.width < 150) {
                screenScale = 0.5;
            }             

            var screenScalerSize = {
                width: 128 * screenScale,
                height: 32 * screenScale
            }
            borderSize = borderSize * screenScale;

            imgw = screenScalerSize.width + borderSize * 2;
            imgh = screenScalerSize.height + borderSize * 2;            
            imgx = sensor.drawInfo.x - (imgw / 2) + (sensor.drawInfo.width / 2); 

            imgy = sensor.drawInfo.y + Math.max(0, (sensor.drawInfo.height - imgh) * 0.5);            

            portx = imgx + imgw + borderSize;
            porty = imgy + imgh / 3;
/*
            if (context.autoGrading) {
                state1x = imgx + imgw;
                state1y = imgy + (imgh / 2);

                portsize = imgh / 4;
                statesize = imgh / 6;
            }
            */
            statesize = imgh / 3.5;

            if (!sensor.img || isElementRemoved(sensor.img)) {
                sensor.img = paper.image(getImg('screen.png'), imgx, imgy, imgw, imgh);
            }
               


            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": fadeopacity,
            });


            if (sensor.state) {
                if (sensor.state.isDrawingData) {
                    if (!sensor.screenrect ||
                        isElementRemoved(sensor.screenrect) ||
                        !sensor.canvasNode) {
                        sensor.screenrect = paper.rect(imgx, imgy, screenScalerSize.width, screenScalerSize.height);
        
                        sensor.canvasNode = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
                        sensor.canvasNode.setAttribute("x",imgx + borderSize); //Set rect data
                        sensor.canvasNode.setAttribute("y",imgy + borderSize); //Set rect data
                        sensor.canvasNode.setAttribute("width", screenScalerSize.width); //Set rect data
                        sensor.canvasNode.setAttribute("height", screenScalerSize.height); //Set rect data
                        paper.canvas.appendChild(sensor.canvasNode);
        
                        sensor.canvas = document.createElement("canvas");
                        sensor.canvas.id = "screencanvas";
                        sensor.canvas.width = screenScalerSize.width;
                        sensor.canvas.height = screenScalerSize.height;
                        sensor.canvasNode.appendChild(sensor.canvas);
                    }

                    $(sensor.canvas).css({ opacity: fadeopacity });
                    sensor.canvasNode.setAttribute("x", imgx + borderSize); //Set rect data
                    sensor.canvasNode.setAttribute("y", imgy + borderSize); //Set rect data
                    sensor.canvasNode.setAttribute("width", screenScalerSize.width); //Set rect data
                    sensor.canvasNode.setAttribute("height", screenScalerSize.height); //Set rect data

                    sensor.screenrect.attr({
                        "x": imgx + borderSize,
                        "y": imgy + borderSize,
                        "width": 128,
                        "height": 32,
                    });
        
                    sensor.screenrect.attr({ "opacity": 0 });
        
                    context.initScreenDrawing(sensor);
                    //sensor.screenDrawing.copyToCanvas(sensor.canvas, screenScale);
                    screenDrawing.renderToCanvas(sensor.state, sensor.canvas, screenScale);
                } else {
                    var statex = imgx + (imgw * .05);

                    var statey = imgy + (imgh * .2);

                    if (sensor.state.line1.length > 16)
                        sensor.state.line1 = sensor.state.line1.substring(0, 16);

                    if (sensor.state.line2 && sensor.state.line2.length > 16)
                        sensor.state.line2 = sensor.state.line2.substring(0, 16);

                    if (sensor.canvasNode) {
                        $(sensor.canvasNode).remove();
                        sensor.canvasNode = null;
                    }

                    sensor.stateText = paper.text(statex, statey, sensor.state.line1 + "\n" + (sensor.state.line2 ? sensor.state.line2 : ""));
                    stateanchor = "start";
                    sensor.stateText.attr("")
                }
            }
        } else if (sensor.type == "temperature") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (sensor.state == null)
                sensor.state = 25; // FIXME

            if (!sensor.img || isElementRemoved(sensor.img))
                sensor.img = paper.image(getImg('temperature-cold.png'), imgx, imgy, imgw, imgh);

            if (!sensor.img2 || isElementRemoved(sensor.img2))
                sensor.img2 = paper.image(getImg('temperature-hot.png'), imgx, imgy, imgw, imgh);

            if (!sensor.img3 || isElementRemoved(sensor.img3))
                sensor.img3 = paper.image(getImg('temperature-overlay.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": fadeopacity,
                
            });
            sensor.img2.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": fadeopacity,
            });

            sensor.img3.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": fadeopacity,
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

            sensor.stateText = paper.text(state1x, state1y, sensor.state + " °C");

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

            if (!sensor.img || isElementRemoved(sensor.img))
                sensor.img = paper.image(getImg('servo.png'), imgx, imgy, imgw, imgh);

            if (!sensor.pale || isElementRemoved(sensor.pale))
                sensor.pale = paper.image(getImg('servo-pale.png'), imgx, imgy, imgw, imgh);


            if (!sensor.center || isElementRemoved(sensor.center))
                sensor.center = paper.image(getImg('servo-center.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": fadeopacity,
            });
            sensor.pale.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "transform": "",
                "opacity": fadeopacity,
            });
            sensor.center.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": fadeopacity,
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

            if (!sensor.img || isElementRemoved(sensor.img))
                sensor.img = paper.image(getImg('potentiometer.png'), imgx, imgy, imgw, imgh);

            if (!sensor.pale || isElementRemoved(sensor.pale))
                sensor.pale = paper.image(getImg('potentiometer-pale.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": fadeopacity,
            });

            sensor.pale.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "transform": "",
                "opacity": fadeopacity,
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

            if (!sensor.img || isElementRemoved(sensor.img))
                sensor.img = paper.image(getImg('range.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": fadeopacity,
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

            sensor.stateText = paper.text(state1x, state1y, sensor.state + " cm");
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

            if (!sensor.img || isElementRemoved(sensor.img))
                sensor.img = paper.image(getImg('light.png'), imgx, imgy, imgw, imgh);

            if (!sensor.moon || isElementRemoved(sensor.moon))
                sensor.moon = paper.image(getImg('light-moon.png'), imgx, imgy, imgw, imgh);

            if (!sensor.sun || isElementRemoved(sensor.sun))
                sensor.sun = paper.image(getImg('light-sun.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": fadeopacity,
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
                    "opacity": opacity * .80 * fadeopacity
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
                    "opacity": opacity * .80 * fadeopacity
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

            if (!sensor.img || isElementRemoved(sensor.img))
                sensor.img = paper.image(getImg('humidity.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": fadeopacity,
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

            if (!sensor.img || isElementRemoved(sensor.img))
                sensor.img = paper.image(getImg('accel.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": fadeopacity,
            });


            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.state)
            {
                sensor.state = [0, 0, 1];
            }

            if (sensor.state) {
                try {
                sensor.stateText = paper.text(state1x, state1y, "X: " + sensor.state[0] + " m/s²\nY: " + sensor.state[1] + " m/s²\nZ: " + sensor.state[2] + " m/s²");
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
            if (!sensor.state) {
                sensor.state = [0, 0, 0];
            }
            if (sensor.stateText) {
                sensor.stateText.remove();
            }
            sensor.stateText = paper.text(state1x, state1y, "X: " + sensor.state[0] + "°/s\nY: " + sensor.state[1] + "°/s\nZ: " + sensor.state[2] + "°/s");
            if (!sensor.previousState)
                sensor.previousState = [0, 0, 0];

            if (sensor.rotationAngles != undefined) {

                // update the rotation angle
                for (var i = 0; i < 3; i++)
                    sensor.rotationAngles[i] += sensor.previousState[i] * ((new Date() - sensor.lastSpeedChange) / 1000);

                sensor.lastSpeedChange = new Date();
            }


            sensor.previousState = sensor.state;

            if (!context.autoGrading && context.offLineMode) {
                var img3d = gyroscope3D.getInstance(imgw, imgh);
            }
            if(img3d) {
                if (!sensor.screenrect || isElementRemoved(sensor.screenrect)) {
                    sensor.screenrect = paper.rect(imgx, imgy, imgw, imgh);
                    sensor.screenrect.attr({ "opacity": 0 });
    
                    sensor.canvasNode = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
                    sensor.canvasNode.setAttribute("x", imgx);
                    sensor.canvasNode.setAttribute("y", imgy);
                    sensor.canvasNode.setAttribute("width", imgw);
                    sensor.canvasNode.setAttribute("height", imgh);
                    paper.canvas.appendChild(sensor.canvasNode);
    
                    sensor.canvas = document.createElement("canvas");
                    sensor.canvas.width = imgw;
                    sensor.canvas.height = imgh;
                    sensor.canvasNode.appendChild(sensor.canvas);
                }

                var sensorCtx = sensor.canvas.getContext('2d');
                sensorCtx.clearRect(0, 0, imgw, imgh);
                
                sensorCtx.drawImage(img3d.render(                
                    sensor.state[0], 
                    sensor.state[2],
                    sensor.state[1]
                ), 0, 0);

                if(!juststate) {
                    sensor.focusrect.drag(
                        function(dx, dy, x, y, event) {
                            sensor.state[0] = Math.max(-125, Math.min(125, sensor.old_state[0] + dy));
                            sensor.state[1] = Math.max(-125, Math.min(125, sensor.old_state[1] - dx));
                            warnClientSensorStateChanged(sensor);
                            drawSensor(sensor, true)
                        },
                        function() {
                            sensor.old_state = sensor.state.slice();
                        }
                    );
                }

            } else {
                if (!sensor.img || isElementRemoved(sensor.img)) {
                    sensor.img = paper.image(getImg('gyro.png'), imgx, imgy, imgw, imgh);
                }
                sensor.img.attr({
                    "x": imgx,
                    "y": imgy,
                    "width": imgw,
                    "height": imgh,
                    "opacity": fadeopacity,
                });
                if (!context.autoGrading && context.offLineMode) {
                    setSlider(sensor, juststate, imgx, imgy, imgw, imgh, -125, 125);
                } else {
                    sensor.focusrect.click(function () {
                        sensorInConnectedModeError();
                    });
    
                    removeSlider(sensor);
                }                            
            }            
        } else if (sensor.type == "magnetometer") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || isElementRemoved(sensor.img))
                sensor.img = paper.image(getImg('mag.png'), imgx, imgy, imgw, imgh);

            if (!sensor.needle || isElementRemoved(sensor.needle))
                sensor.needle = paper.image(getImg('mag-needle.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": fadeopacity,
            });

            sensor.needle.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "transform": "",
                "opacity": fadeopacity,
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
                sensor.stateText = paper.text(state1x, state1y, "X: " + sensor.state[0] + " μT\nY: " + sensor.state[1] + " μT\nZ: " + sensor.state[2] + " μT");
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

            if (!sensor.img || isElementRemoved(sensor.img))
                sensor.img = paper.image(getImg('sound.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": fadeopacity,
            });

            // if we just do sensor.state, if it is equal to 0 then the state is not displayed
            if (sensor.state != null) {
                sensor.stateText = paper.text(state1x, state1y, sensor.state + " dB");
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

            if (!sensor.ledon || isElementRemoved(sensor.ledon)) {
                sensor.ledon = paper.image(getImg("irtranson.png"), imgx, imgy, imgw, imgh);
            }

            if (!sensor.ledoff || isElementRemoved(sensor.ledoff)) {
                sensor.ledoff = paper.image(getImg('irtransoff.png'), imgx, imgy, imgw, imgh);

                    sensor.focusrect.click(function () {
                        if (!context.autoGrading && (!context.runner || !context.runner.isRunning())
                            && !context.offLineMode) {
                            //sensor.state = !sensor.state;
                            //drawSensor(sensor);
                            window.displayHelper.showPopupDialog(irRemoteDialog);

                            $('#picancel').click(function () {
                                $('#popupMessage').hide();
                                window.displayHelper.popupMessageShown = false;
                            });
        
                            $('#picancel2').click(function () {
                                $('#popupMessage').hide();
                                window.displayHelper.popupMessageShown = false;
                            });
        
                            var addedSomeButtons = false;
                            var remotecontent = document.getElementById('piremotecontent');
                            var parentdiv = document.createElement("DIV");
                            parentdiv.className  = "form-group";
        
                            remotecontent.appendChild(parentdiv);
                            var count = 0;
                            for (var code in context.remoteIRcodes)
                            {
                                addedSomeButtons = true;
                                context.remoteIRcodes[code];
        
                                var btn = document.createElement("BUTTON");
                                var t = document.createTextNode(code);
        
                                btn.className = "btn";
                                btn.appendChild(t);
                                parentdiv.appendChild(btn);
        
                                let capturedcode = code;
                                let captureddata = context.remoteIRcodes[code];
                                btn.onclick = function() {
                                    $('#popupMessage').hide();
                                    window.displayHelper.popupMessageShown = false;
            
                                    //if (sensor.waitingForIrMessage)
                                        //sensor.waitingForIrMessage(capturedcode);

                                    context.quickPiConnection.sendCommand("presetIRMessage(\"" + capturedcode + "\", '" + captureddata + "')", function(returnVal) {});
                                    context.quickPiConnection.sendCommand("sendIRMessage(\"irtran1\", \"" + capturedcode + "\")", function(returnVal) {});
                            
                                };
        
                                count += 1;
        
                                if (count == 4)
                                {
                                    count = 0;
                                    parentdiv = document.createElement("DIV");
                                    parentdiv.className  = "form-group";
                                    remotecontent.appendChild(parentdiv);
                                }
                            }
                            if (!addedSomeButtons)
                            {
                                $('#piremotemessage').text(strings.messages.noIrPresets);
                            }
        
                            var btn = document.createElement("BUTTON");
        
                            if (sensor.state)
                                var t = document.createTextNode(strings.messages.irDisableContinous);
                            else
                                var t = document.createTextNode(strings.messages.irEnableContinous);
        
                            
                            btn.className = "btn";
                            btn.appendChild(t);
                            parentdiv.appendChild(btn);
                            btn.onclick = function() {
                                $('#popupMessage').hide();
                                window.displayHelper.popupMessageShown = false;
        
                                sensor.state = !sensor.state;
                                warnClientSensorStateChanged(sensor);
                                drawSensor(sensor);
                            };
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
                sensor.ledon.attr({ "opacity": fadeopacity });
                sensor.ledoff.attr({ "opacity": 0 });

                sensor.stateText = paper.text(state1x, state1y, strings.messages.on.toUpperCase());
            } else {
                sensor.ledon.attr({ "opacity": 0 });
                sensor.ledoff.attr({ "opacity": fadeopacity });

                sensor.stateText = paper.text(state1x, state1y, strings.messages.off.toUpperCase());
            }


            if ((!context.runner || !context.runner.isRunning())
                && !context.offLineMode) {

                findSensorDefinition(sensor).setLiveState(sensor, sensor.state, function(x) {});
            }
        } else if (sensor.type == "irrecv") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.buttonon || isElementRemoved(sensor.buttonon))
                sensor.buttonon = paper.image(getImg('irrecvon.png'), imgx, imgy, imgw, imgh);

            if (!sensor.buttonoff || isElementRemoved(sensor.buttonoff))
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
                sensor.buttonon.attr({ "opacity": fadeopacity });
                sensor.buttonoff.attr({ "opacity": 0 });

                sensor.stateText = paper.text(state1x, state1y, strings.messages.on.toUpperCase());
            } else {
                sensor.buttonon.attr({ "opacity": 0 });
                sensor.buttonoff.attr({ "opacity": fadeopacity });

                sensor.stateText = paper.text(state1x, state1y, strings.messages.off.toUpperCase());
            }

            sensor.focusrect.click(function () {
                if (context.offLineMode) {
                    window.displayHelper.showPopupDialog(irRemoteDialog);

                    $('#picancel').click(function () {
                        $('#popupMessage').hide();
                        window.displayHelper.popupMessageShown = false;
                    });

                    $('#picancel2').click(function () {
                        $('#popupMessage').hide();
                        window.displayHelper.popupMessageShown = false;
                    });

                    var addedSomeButtons = false;
                    var remotecontent = document.getElementById('piremotecontent');
                    var parentdiv = document.createElement("DIV");
                    parentdiv.className  = "form-group";

                    remotecontent.appendChild(parentdiv);
                    var count = 0;
                    for (var code in context.remoteIRcodes)
                    {
                        addedSomeButtons = true;
                        context.remoteIRcodes[code];

                        var btn = document.createElement("BUTTON");
                        var t = document.createTextNode(code);

                        btn.className = "btn";
                        btn.appendChild(t);
                        parentdiv.appendChild(btn);

                        let capturedcode = code;
                        btn.onclick = function() {
                            $('#popupMessage').hide();
                            window.displayHelper.popupMessageShown = false;
    
                            if (sensor.waitingForIrMessage)
                                sensor.waitingForIrMessage(capturedcode);
                        };

                        count += 1;

                        if (count == 4)
                        {
                            count = 0;
                            parentdiv = document.createElement("DIV");
                            parentdiv.className  = "form-group";
                            remotecontent.appendChild(parentdiv);
                        }
                    }
                    if (!addedSomeButtons)
                    {
                        $('#piremotemessage').text(strings.messages.noIrPresets);
                    }

                    var btn = document.createElement("BUTTON");

                    if (sensor.state)
                        var t = document.createTextNode(strings.messages.irDisableContinous);
                    else
                        var t = document.createTextNode(strings.messages.irEnableContinous);

                    
                    btn.className = "btn";
                    btn.appendChild(t);
                    parentdiv.appendChild(btn);
                    btn.onclick = function() {
                        $('#popupMessage').hide();
                        window.displayHelper.popupMessageShown = false;

                        sensor.state = !sensor.state;
                        warnClientSensorStateChanged(sensor);
                        drawSensor(sensor);
                    };

                }
                else{
                    //sensorInConnectedModeError();

                    context.stopLiveUpdate = true;

                    var irLearnDialog = "<div class=\"content qpi\">" +
                        "   <div class=\"panel-heading\">" +
                        "       <h2 class=\"sectionTitle\">" +
                        "           <span class=\"iconTag\"><i class=\"icon fas fa-list-ul\"></i></span>" +
                                    strings.messages.irReceiverTitle +
                        "       </h2>" +
                        "       <div class=\"exit\" id=\"picancel\"><i class=\"icon fas fa-times\"></i></div>" +
                        "   </div>" +
                        "   <div id=\"sensorPicker\" class=\"panel-body\">" +
                        "       <div class=\"form-group\">" +
                        "           <p>" + strings.messages.directIrControl + "</p>" +
                        "       </div>" +
                        "       <div class=\"form-group\">" +
                        "           <p id=piircode></p>" +
                        "       </div>" +
                        "   </div>" +
                        "   <div class=\"singleButton\">" +
                        "       <button id=\"piirlearn\" class=\"btn\"><i class=\"fa fa-wifi icon\"></i>" + strings.messages.getIrCode + "</button>" +
                        "       <button id=\"picancel2\" class=\"btn\"><i class=\"fa fa-times icon\"></i>" + strings.messages.closeDialog + "</button>" +
                        "   </div>" +
                        "</div>";

                    window.displayHelper.showPopupDialog(irLearnDialog);

                    $('#picancel').click(function () {
                        $('#popupMessage').hide();
                        window.displayHelper.popupMessageShown = false;
                        context.stopLiveUpdate = false;
                    });

                    $('#picancel2').click(function () {
                        $('#popupMessage').hide();
                        window.displayHelper.popupMessageShown = false;
                        context.stopLiveUpdate = false;
                    });

                    $('#piirlearn').click(function () {

                        $('#piirlearn').attr('disabled', true);

                        $("#piircode").text("");
                        context.quickPiConnection.sendCommand("readIRMessageCode(\"irrec1\", 10000)", function(retval)
                        {
                            $('#piirlearn').attr('disabled', false);
                            $("#piircode").text(retval);
                        });
                    });

                }
            });
/*
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
                        drawSensor(sensor);

                        if (sensor.onPressed)
                            sensor.onPressed();
                    } else
                        sensorInConnectedModeError();
                }

                sensor.focusrect.node.ontouchstart = sensor.focusrect.node.onmousedown;
                sensor.focusrect.node.ontouchend = sensor.focusrect.node.onmouseup;
            }*/
        } else if (sensor.type == "stick") {
            if (sensor.stateText)
                sensor.stateText.remove();

            if (!sensor.img || isElementRemoved(sensor.img))
                sensor.img = paper.image(getImg('stick.png'), imgx, imgy, imgw, imgh);

            if (!sensor.imgup || isElementRemoved(sensor.imgup))
                sensor.imgup = paper.image(getImg('stickup.png'), imgx, imgy, imgw, imgh);

            if (!sensor.imgdown || isElementRemoved(sensor.imgdown))
                sensor.imgdown = paper.image(getImg('stickdown.png'), imgx, imgy, imgw, imgh);

            if (!sensor.imgleft || isElementRemoved(sensor.imgleft))
                sensor.imgleft = paper.image(getImg('stickleft.png'), imgx, imgy, imgw, imgh);

            if (!sensor.imgright || isElementRemoved(sensor.imgright))
                sensor.imgright = paper.image(getImg('stickright.png'), imgx, imgy, imgw, imgh);

            if (!sensor.imgcenter || isElementRemoved(sensor.imgcenter))
                sensor.imgcenter = paper.image(getImg('stickcenter.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": fadeopacity,
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

            if (!sensor.state)
                sensor.state = [false, false, false, false, false];

            var stateString = "\n";
            if (sensor.state[0]) {
                stateString += strings.messages.up.toUpperCase() + "\n";
                sensor.imgup.attr({ "opacity": 1 });
            }
            if (sensor.state[1]) {
                stateString += strings.messages.down.toUpperCase() + "\n";
                sensor.imgdown.attr({ "opacity": 1 });
            }
            if (sensor.state[2]) {
                stateString += strings.messages.left.toUpperCase() + "\n";
                sensor.imgleft.attr({ "opacity": 1 });
            }
            if (sensor.state[3]) {
                stateString += strings.messages.right.toUpperCase() + "\n";
                sensor.imgright.attr({ "opacity": 1 });
            }
            if (sensor.state[4]) {
                stateString += strings.messages.center.toUpperCase() + "\n";
                sensor.imgcenter.attr({ "opacity": 1 });
            }

            sensor.stateText = paper.text(state1x, state1y, stateString);

            if (sensor.portText)
                sensor.portText.remove();

            drawPortText = false;

            if (sensor.portText)
                sensor.portText.remove();

            if (!context.autoGrading) {
                var gpios = findSensorDefinition(sensor).gpios;
                var min = 255;
                var max = 0;

                for (var i = 0; i < gpios.length; i++) {
                    if (gpios[i] > max)
                        max = gpios[i];

                    if (gpios[i] < min)
                        min = gpios[i];
                }


                $('#stickupstate').text(sensor.state[0] ? strings.messages.on.toUpperCase() : strings.messages.off.toUpperCase());
                $('#stickdownstate').text(sensor.state[1] ? strings.messages.on.toUpperCase() : strings.messages.off.toUpperCase());
                $('#stickleftstate').text(sensor.state[2] ? strings.messages.on.toUpperCase() : strings.messages.off.toUpperCase());
                $('#stickrightstate').text(sensor.state[3] ? strings.messages.on.toUpperCase() : strings.messages.off.toUpperCase());
                $('#stickcenterstate').text(sensor.state[4] ? strings.messages.on.toUpperCase() : strings.messages.off.toUpperCase());

/*
                sensor.portText = paper.text(state1x, state1y, "D" + min.toString() + "-D" + max.toString() + "?");
                sensor.portText.attr({ "font-size": portsize + "px", 'text-anchor': 'start', fill: "blue" });
                sensor.portText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
                var b = sensor.portText._getBBox();
                sensor.portText.translate(0, b.height / 2);

                var stickPortsDialog = `
                <div class="content qpi">
                <div class="panel-heading">
                    <h2 class="sectionTitle">
                        <span class="iconTag"><i class="icon fas fa-list-ul"></i></span>
                        Noms et ports de la manette
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
                `;

                sensor.portText.click(function () {
                    window.displayHelper.showPopupDialog(stickPortsDialog);

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
                */
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

                 warnClientSensorStateChanged(sensor);
                 drawSensor(sensor);
            }

            sensor.focusrect.node.onmouseup = function(evt) {
                if (!context.offLineMode) {
                    sensorInConnectedModeError();
                    return;
                }

                sensor.state = [false, false, false, false, false];
                warnClientSensorStateChanged(sensor);
                drawSensor(sensor);
            }

            sensor.focusrect.node.ontouchstart = sensor.focusrect.node.onmousedown;
            sensor.focusrect.node.ontouchend = sensor.focusrect.node.onmouseup;
        } else if (sensor.type == "cloudstore") {
            if (!sensor.img || isElementRemoved(sensor.img))
                sensor.img = paper.image(getImg('cloudstore.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
                "opacity": scrolloffset ? 0.3 : 1,
            });
            
            drawPortText = false;
            drawName = false;

        } else if (sensor.type == "clock") {
            if (!sensor.img || isElementRemoved(sensor.img))
                sensor.img = paper.image(getImg('clock.png'), imgx, imgy, imgw, imgh);

            sensor.img.attr({
                "x": imgx,
                "y": imgy,
                "width": imgw,
                "height": imgh,
            });

            sensor.stateText = paper.text(state1x, state1y, context.currentTime.toString() + "ms");

            drawPortText = false;
            drawName = false;
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
                            context.recreateDisplay = true;
                            context.resetDisplay();
                        },
                        strings.messages.keep);
                });
            }
            }
        });


        if (sensor.stateText) {
            try {
                var statecolor = "gray";
                if (context.compactLayout)
                    statecolor = "black";

                sensor.stateText.attr({ "font-size": statesize + "px", 'text-anchor': stateanchor, 'font-weight': 'bold', fill: statecolor });
                var b = sensor.stateText._getBBox();
                sensor.stateText.translate(0, b.height/2);
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


        if (drawName) {
            if (sensor.name) {
                sensor.nameText = paper.text(namex, namey, sensor.name );
                sensor.nameText.attr({ "font-size": namesize + "px", 'text-anchor': nameanchor, fill: "#7B7B7B" });
                sensor.nameText.node.style = "-moz-user-select: none; -webkit-user-select: none;";
            }
        }


        if (!donotmovefocusrect) {
            // This needs to be in front of everything
            sensor.focusrect.toFront();
        }

        saveSensorStateIfNotRunning(sensor);
    }

    function saveSensorStateIfNotRunning(sensor) {
        // save the sensor if we are not running
        if (!(context.runner && context.runner.isRunning())) {
            if (_findFirst(sensorDefinitions, function(globalSensor) {
                return globalSensor.name === sensor.type;
            }).isSensor) {
                context.sensorsSaved[sensor.name] = {
                    state: Array.isArray(sensor.state) ? sensor.state.slice() : sensor.state,
                    screenDrawing: sensor.screenDrawing,
                    lastDrawnTime: sensor.lastDrawnTime,
                    lastDrawnState: sensor.lastDrawnState,
                    callsInTimeSlot: sensor.callsInTimeSlot,
                    lastTimeIncrease: sensor.lastTimeIncrease,
                    removed: sensor.removed,
                    quickStore: sensor.quickStore
                };
            }
        }
    }

    function _findFirst(array, func) {
        for (var i = 0; i < array.length; i++) {
            if (func(array[i]))
                return array[i];
        }
        return undefined;
    }

    context.sensorsSaved = {};

    context.registerQuickPiEvent = function (name, newState, setInSensor = true, allowFail = false) {
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

            if(!context.actualStatesBySensor[name]) {
                context.actualStatesBySensor[name] = [];
            }
            var actualStates = context.actualStatesBySensor[name];

            var lastRealState = actualStates.length > 0 ? actualStates[actualStates.length-1] : null;
            if(lastRealState) {
                if(lastRealState.time == context.currentTime) {
                    lastRealState.state = newState;
                } else {
                    actualStates.push({time: context.currentTime, state: newState});
                }
            } else {
                actualStates.push({time: context.currentTime, state: newState});
            }

            drawNewStateChangesSensor(name, newState);

            context.increaseTime(sensor);
        }
    }

    function drawNewStateChangesSensor(name, newState=null) {
        var sensor = findSensorByName(name);
        if (!sensor) {
            context.success = false;
            throw (strings.messages.sensorNotFound.format(name));
        }

        var sensorDef = findSensorDefinition(sensor);
        if(sensor.lastDrawnState !== null) {
            // Get all states between the last drawn time and now
            var expectedStates = context.getSensorExpectedState(name, sensor.lastDrawnTime, context.currentTime);
            for(var i = 0; expectedStates && i < expectedStates.length; i++) {
                // Draw the line up to the next expected state
                var expectedState = expectedStates[i];
                var nextTime = i+1 < expectedStates.length ? expectedStates[i+1].time : context.currentTime;
                var type = "actual";
                // Check the previous state
                if(!sensorDef.compareState(sensor.lastDrawnState, expectedState.state)) {
                    type = "wrong";
                }
                drawSensorTimeLineState(sensor, sensor.lastDrawnState, sensor.lastDrawnTime, nextTime, type, false, expectedState.state);
                sensor.lastDrawnTime = nextTime;
            }
        }

        sensor.lastDrawnTime = context.currentTime;

        if(newState !== null && sensor.lastDrawnState != newState) {
            // Draw the new state change
            if(sensor.lastDrawnState === null) {
                sensor.lastDrawnState = newState;
            }

            var type = "actual";
            // Check the new state
            var expectedState = context.getSensorExpectedState(name, context.currentTime);

            if (expectedState !== null && !sensorDef.compareState(expectedState.state, newState))
            {
                type = "wrong";
            }
            drawSensorTimeLineState(sensor, newState, context.currentTime, context.currentTime, type, false, expectedState && expectedState.state);
            sensor.lastDrawnState = newState;
        }
    }

    function drawNewStateChanges() {
        // Draw all sensors
        if(!context.gradingStatesBySensor) { return; }
        for(var sensorName in context.gradingStatesBySensor) {
            drawNewStateChangesSensor(sensorName);
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

        if (sensor.callsInTimeSlot > getQuickPiOption('increaseTimeAfterCalls')) {
            context.currentTime += context.tickIncrease;

            sensor.lastTimeIncrease = context.currentTime;
            sensor.callsInTimeSlot = 0;
        }

        drawCurrentTime();
        if(context.autoGrading)
        {
            drawNewStateChanges();
        }

        if(context.runner) {
            // Tell the runner an "action" happened
            context.runner.signalAction();
        }
    }

    context.increaseTimeBy = function (time) {

        var iStates = 0;

        var newTime = context.currentTime + time;

        if (context.gradingStatesByTime) {
            // Advance until current time, ignore everything in the past.
            while (iStates < context.gradingStatesByTime.length &&
                context.gradingStatesByTime[iStates].time < context.currentTime)
                iStates++;

            for (; iStates < context.gradingStatesByTime.length; iStates++) {
                var sensorState = context.gradingStatesByTime[iStates];

                // Until the new time
                if (sensorState.time >= newTime)
                    break;

                // Mark all inputs as hit
                if (sensorState.input) {
                    sensorState.hit = true;
    //                context.currentTime = sensorState.time;
                    context.getSensorState(sensorState.name);
                }
            }
        }

        if(context.runner) {
            // Tell the runner an "action" happened
            context.runner.signalAction();
        }

        context.currentTime = newTime;

        drawCurrentTime();
        if (context.autoGrading) {
            drawNewStateChanges();
        }
    }

    context.getSensorExpectedState = function (name, targetTime = null, upToTime = null) {
        var state = null;
        if(targetTime === null) {
            targetTime = context.currentTime;
        }

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
            return null; // Fail??

        var lastState;
        var startTime = -1;
        for (var idx = 0; idx < sensorStates.length; idx++) {
            if (startTime >= 0
                && targetTime >= startTime
                && targetTime < sensorStates[idx].time) {
                    state = lastState;
                    break;
            }

            startTime = sensorStates[idx].time;
            lastState = sensorStates[idx];
        }

        // This is the end state
        if(state === null && targetTime >= startTime) {
            state = lastState;
        }

        if(state && upToTime !== null) {
            // If upToTime is given, return an array of states instead
            var states = [state];
            for(var idx2 = idx+1; idx2 < sensorStates.length; idx2++) {
                if(sensorStates[idx2].time < upToTime) {
                    states.push(sensorStates[idx2]);
                } else {
                    break;
                }
            }
            return states;
        } else {
            return state;
        }
    }


    context.getSensorState = function (name) {
        var state = null;

        var sensor = findSensorByName(name);
        if ((!context.display && !context.forceGradingWithoutDisplay) || context.autoGrading) {
            var stateTime = context.getSensorExpectedState(name);

            if (stateTime != null) {
                stateTime.hit = true;
                state = stateTime.state;
                if(sensor) {
                    // Redraw from the beginning of this state
                    sensor.lastDrawnTime = Math.min(sensor.lastDrawnTime, stateTime.time);
                }
            }
            else {
                state = 0;
            }
        }

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

        drawNewStateChangesSensor(sensor.name, sensor.state);

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

    context.quickpi.changeSensorState = function (sensorName, sensorState, callback) {
        var sensor = findSensorByName(sensorName);
        sensor.state = sensorState;
        drawSensor(sensor);
        callback();
    }

    /***** Functions *****/
    /* Here we define each function of the library.
       Blocks will generally use context.group.blockName as their handler
       function, hence we generally use this name for the functions. */
    context.quickpi.turnLedOn = function (callback) {

        var sensor = findSensorByType("led");

        context.registerQuickPiEvent(sensor.name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        }
        else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("turnLedOn()", cb);
        }
    };

    context.quickpi.turnLedOff = function (callback) {

        var sensor = findSensorByType("led");

        context.registerQuickPiEvent(sensor.name, false);

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


    context.quickpi.isButtonPressed = function (arg1, arg2) {
        if(typeof arg2 == "undefined") {
            // no arguments
            var callback = arg1;
            var sensor = findSensorByType("button");
            var name = sensor.name;
        } else {
            var callback = arg2;
            var sensor = findSensorByName(arg1, true);
            var name = arg1;
        }

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
                    sensor.state = returnVal != "0";
                    drawSensor(sensor);
                    cb(returnVal != "0");
                });
            }
        }
    };

    context.quickpi.isButtonPressedWithName = context.quickpi.isButtonPressed;

    context.quickpi.buttonWasPressed = function (name, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);

            var wasPressed = !!sensor.wasPressed;
            sensor.wasPressed = false;

            context.runner.noDelay(callback, wasPressed);
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

    context.quickpi.isBuzzerOn = function (arg1, arg2) {
        if(typeof arg2 == "undefined") {
            // no arguments
            var callback = arg1;
            var sensor = findSensorByType("buzzer");
        } else {
            var callback = arg2;
            var sensor = findSensorByName(arg1, true);
        }

        var command = "isBuzzerOn(\"" + sensor.name + "\")";

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

    context.quickpi.isBuzzerOnWithName = context.quickpi.isBuzzerOn;

    context.quickpi.setBuzzerNote = function (name, frequency, callback) {
        var sensor = findSensorByName(name, true);
        var command = "setBuzzerNote(\"" + name + "\"," + frequency + ")";

        context.registerQuickPiEvent(name, frequency);

        if(context.display && context.offLineMode) {
            buzzerSound.start(name, frequency);
        }

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
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
            context.waitDelay(callback, sensor.state);
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
            context.waitDelay(callback, sensor.state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);

            });
        }
    };

    context.quickpi.isLedOn = function (arg1, arg2) {
        if(typeof arg2 == "undefined") {
            // no arguments
            var callback = arg1;
            var sensor = findSensorByType("led");
        } else {
            var callback = arg2;
            var sensor = findSensorByName(arg1, true);
        }

        var command = "getLedState(\"" + sensor.name + "\")";

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback, sensor.state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal)
                cb(returnVal);

            });
        }
    };

    context.quickpi.isLedOnWithName = context.quickpi.isLedOn;


    context.quickpi.toggleLedState = function (name, callback) {
        var sensor = findSensorByName(name, true);

        var command = "toggleLedState(\"" + name + "\")";
        var state = sensor.state;

        context.registerQuickPiEvent(name, !state);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) { return returnVal != "0"; });
        }
    };

    context.quickpi.displayText = function (line1, arg2, arg3) {
        if(typeof arg3 == "undefined") {
            // Only one argument
            var line2 = null;
            var callback = arg2;
        } else {
            var line2 = arg2;
            var callback = arg3;
        }

        var sensor = findSensorByType("screen");

        var command = "displayText(\"" + line1 + "\", \"\")";

        context.registerQuickPiEvent(sensor.name,
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

    context.quickpi.displayText2Lines = context.quickpi.displayText;

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
        context.increaseTimeBy(time);
        if (!context.display || context.autoGrading) {
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
            context.waitDelay(callback, sensor.state);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand(command, function(returnVal) {
                returnVal = parseFloat(returnVal);
                cb(returnVal);

            });
        }
    };


    context.quickpi.setContinousServoDirection = function (name, direction, callback) {
        var sensor = findSensorByName(name, true);

        if (direction > 0)
            angle = 0;
        else if (direction < 0)
            angle = 180;
        else
            angle = 90;

        context.registerQuickPiEvent(name, angle);
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var command = "setServoAngle(\"" + name + "\"," + angle + ")";
            cb = context.runner.waitCallback(callback);
            context.quickPiConnection.sendCommand(command, cb);
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


    var getTemperatureFromCloudURl = "https://cloud.quick-pi.org/cache/weather.php";

    var getTemperatureFromCloudSupportedTowns = [];

    // setup the supported towns
    $.get(getTemperatureFromCloudURl + "?q=" + "supportedtowns", function(towns) {
        getTemperatureFromCloudSupportedTowns = JSON.parse(towns);
    });

    // We create a cache so there is less calls to the api and we get the results of the temperature faster
    var getTemperatureFromCloudCache = {};

    context.quickpi.getTemperatureFromCloud = function(location, callback) {
        var url = getTemperatureFromCloudURl;

        if (!arrayContains(getTemperatureFromCloudSupportedTowns, location))
            throw strings.messages.getTemperatureFromCloudWrongValue.format(location);

        var cache = getTemperatureFromCloudCache;
        if (cache[location] != undefined && ((Date.now() - cache[location].lastUpdate) / 1000) / 60 < 10) {
            context.waitDelay(callback, cache[location].temperature);
            return;
        }

        var cb = context.runner.waitCallback(callback);
        $.get(url + "?q=" + location, function(data) {
            // If the server return invalid it mean that the town given is not supported
            if (data === "invalid") {
                // This only happen when the user give an invalid town to the server, which should never happen because
                // the validity of the user input is checked above.
                cb(0);
            } else {
                cache[location] = {
                    lastUpdate: Date.now(),
                    temperature: data
                };
                cb(data);
            }
        });
    };

    context.initScreenDrawing = function(sensor) {
        if  (!sensor.screenDrawing)                
            sensor.screenDrawing = new screenDrawing(sensor.canvas);
    }    


    context.quickpi.drawPoint = function(x, y, callback) {
        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        sensor.screenDrawing.drawPoint(x, y);
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());        

        
        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "drawPoint(" + x + "," + y + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };

    context.quickpi.isPointSet = function(x, y, callback) {
        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        var value = sensor.screenDrawing.isPointSet(x, y);
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());        

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback, value);
        } else {
            var cb = context.runner.waitCallback(callback);

            var command = "isPointSet(" + x + "," + y + ")";
            context.quickPiConnection.sendCommand(command, function () {
                cb();
            });
        }
    };

    context.quickpi.drawLine = function(x0, y0, x1, y1, callback) {
        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        sensor.screenDrawing.drawLine(x0, y0, x1, y1);
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());        

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


    context.quickpi.drawRectangle = function(x0, y0, width, height, callback) {
        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        sensor.screenDrawing.drawRectangle(x0, y0, width, height);
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());        


        if (!context.display || context.autoGrading || context.offLineMode) {
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

        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        sensor.screenDrawing.drawCircle(x0, y0, diameter, diameter);
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());        


        if (!context.display || context.autoGrading || context.offLineMode) {
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
        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        sensor.screenDrawing.clearScreen();
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());        

        
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


    context.quickpi.updateScreen = function(callback) {
        if (!context.display || context.autoGrading || context.offLineMode) {
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

        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        sensor.screenDrawing.fill(color);
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());        

        if (!context.display || context.autoGrading || context.offLineMode) {
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
        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        sensor.screenDrawing.noFill();
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());        


        if (!context.display || context.autoGrading || context.offLineMode) {
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
        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        sensor.screenDrawing.stroke(color);
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData()); 

        if (!context.display || context.autoGrading || context.offLineMode) {

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
        var sensor = findSensorByType("screen");

        context.initScreenDrawing(sensor);
        sensor.screenDrawing.noStroke();
        context.registerQuickPiEvent(sensor.name, sensor.screenDrawing.getStateData());        

        if (!context.display || context.autoGrading || context.offLineMode) {
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

            var state = context.getSensorState(sensor.name);

            if (Array.isArray(state))
                context.waitDelay(callback, state[index]);
            else
                context.waitDelay(callback, 0);
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
                sensor.state = JSON.parse(returnVal);
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

            context.runner.noDelay(callback, state ? true : false);
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
            var sensor = findSensorByType("gyroscope");

            sensor.rotationAngles = [0, 0, 0];
            sensor.lastSpeedChange = new Date();

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
            var sensor = findSensorByType("gyroscope");


            var ret = 0;

            if (sensor.rotationAngles != undefined) {
                for (var i = 0; i < 3; i++)
                    sensor.rotationAngles[i] += sensor.state[i] * ((new Date() - sensor.lastSpeedChange) / 1000);

                sensor.lastSpeedChange = new Date();

                if (axis == "x")
                    ret = sensor.rotationAngles[0];
                else if (axis == "y")
                    ret = sensor.rotationAngles[1];
                else if (axis == "z")
                    ret = sensor.rotationAngles[2];
            }

            context.runner.noDelay(callback, ret);
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


    context.quickpi.connectToCloudStore = function (prefix, password, callback) {
        var sensor = findSensorByType("cloudstore");

        if (!context.display || context.autoGrading) {
            sensor.quickStore = new quickPiStore(true);
        } else {
            sensor.quickStore = QuickStore(prefix, password);
        }

        context.runner.noDelay(callback, 0);
    };

    context.quickpi.writeToCloudStore = function (identifier, key, value, callback) {
        var sensor = findSensorByType("cloudstore");

        if (!sensor.quickStore || !sensor.quickStore.connected)
        {
            context.success = false;
            throw("Cloud store not connected");
        }

        if (!context.display || context.autoGrading) {
            sensor.quickStore.write(identifier, key, value);

            context.registerQuickPiEvent(sensor.name, sensor.quickStore.getStateData());

            context.runner.noDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            sensor.quickStore.write(identifier, key, value, function(data) {
                if (!data || !data.success)
                {
                    if (data && data.message)
                        context.failImmediately = "cloudstore: " + data.message;
                    else
                        context.failImmediately = "Error trying to communicate with cloud store";
    
                }
                cb();
            });
        }
    };

    context.quickpi.readFromCloudStore = function (identifier, key, callback) {
        var sensor = findSensorByType("cloudstore");

        if (!sensor.quickStore)
        {
            if (!context.display || context.autoGrading) {
                sensor.quickStore = new quickPiStore();
            } else {
                sensor.quickStore = QuickStore();
            }
        }

        if (!context.display || context.autoGrading) {
            var state = context.getSensorState(sensor.name);
            var value = "";

            if (state.hasOwnProperty(key)) {
                value = state[key];
            }
            else {
                context.success = false;
                throw("Key not found");    
            }

            sensor.quickStore.write(identifier, key, value);
            context.registerQuickPiEvent(sensor.name, sensor.quickStore.getStateData());
            
            context.runner.noDelay(callback, value);
        } else {
            var cb = context.runner.waitCallback(callback);
            sensor.quickStore.read(identifier, key, function(data) {
                var value = "";
                if (data && data.success)
                {
                    try {
                        value = JSON.parse(data.value);
                    } catch(err)
                    {
                        value = data.value;
                    }
                }
                else
                {
                    if (data && data.message)
                        context.failImmediately = "cloudstore: " + data.message;
                    else
                        context.failImmediately = "Error trying to communicate with cloud store";
                }

                cb(value);
            });
        }
    };



    
    context.quickpi.readIRMessage = function (name, timeout, callback) {
        var sensor = findSensorByName(name, true);

        if (!context.display || context.autoGrading || context.offLineMode) {
            var state = context.getSensorState(name);

            var cb = context.runner.waitCallback(callback);

            sensor.waitingForIrMessage = function(command)
            {
                clearTimeout(sensor.waitingForIrMessageTimeout);
                sensor.waitingForIrMessage = null;

                cb(command);
            }

            sensor.waitingForIrMessageTimeout = setTimeout(function () {
                if (sensor.waitingForIrMessage) {
                    sensor.waitingForIrMessage = null;
                    cb("none");
                }
            }, 
            timeout);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("readIRMessage(\"irrec1\", " + timeout + ")", function(returnVal) {

                if (typeof returnVal === 'string')
                    returnVal = returnVal.replace(/['"]+/g, '')

                cb(returnVal);
            }, true);
        }
    };

    context.quickpi.sendIRMessage = function (name, preset, callback) {
        var sensor = findSensorByName(name, true);

        //context.registerQuickPiEvent(name, state ? true : false);

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("sendIRMessage(\"irtran1\", \"" + preset + "\")", function(returnVal) {
                cb();
            }, true);
        }
    };

    context.quickpi.presetIRMessage = function (preset, data, callback) {
        //var sensor = findSensorByName(name, true);

        //context.registerQuickPiEvent(name, state ? true : false);
        if (!context.remoteIRcodes)

            context.remoteIRcodes = {};

        context.remoteIRcodes[preset] = data;

        if (!context.display || context.autoGrading || context.offLineMode) {
            context.waitDelay(callback);
        } else {
            var cb = context.runner.waitCallback(callback);

            context.quickPiConnection.sendCommand("presetIRMessage(\"" + preset + "\", \"" + JSON.stringify(JSON.parse(data)) + "\")", function(returnVal) {
                cb();
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
            newName = type + i.toString();
        } while (findSensorByName(newName));

        return newName;
    }


    context.customBlocks = {
        // Define our blocks for our namespace "template"
        quickpi: {
            // Categories are reflected in the Blockly menu
            sensors: [
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
                    name: "isButtonPressed", yieldsValue: true
                },
                {
                    name: "isButtonPressedWithName", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("button")
                            },
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
                    name: "readIRMessage", yieldsValue: true, params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            { "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("irrecv") },
                            { "type": "input_value", "name": "PARAM_1"},
                        ]
                    },
                    blocklyXml: "<block type='readIRMessage'>" +
                        "<value name='PARAM_1'><shadow type='math_number'><field name='NUM'>10000</field></shadow></value>" +
                        "</block>"
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
            actuator: [
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
                            { "type": "field_dropdown", "name": "PARAM_1", "options": [[strings.messages.on.toUpperCase(), "1"], [strings.messages.off.toUpperCase(), "0"]] },
                        ]
                    }
                },
                {
                    name: "setBuzzerState", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("buzzer")
                            },
                            { "type": "field_dropdown", "name": "PARAM_1", "options": [[strings.messages.on.toUpperCase(), "1"], [strings.messages.off.toUpperCase(), "0"]] },
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
                        "<value name='PARAM_1'><shadow type='math_number'><field name='NUM'>200</field></shadow></value>" +
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
                    name: "isLedOnWithName", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("led")
                            },
                        ]
                    }
                },
                {
                    name: "isBuzzerOn", yieldsValue: true
                },
                {
                    name: "isBuzzerOnWithName", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("buzzer")
                            },
                        ]
                    }
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
                    name: "setContinousServoDirection", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {
                                "type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("servo")
                            },
                            { 
                                "type": "field_dropdown", "name": "PARAM_1", "options": [["forward", "1"], ["backwards", "-1"], ["stop", "0"]] 
                            },

                        ]
                    },
                },
                {
                    name: "setInfraredState", params: ["String", "Number"], blocklyJson: {
                        "args0": [
                            {"type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("irtrans")},
                            { "type": "field_dropdown", "name": "PARAM_1", "options": [[strings.messages.on.toUpperCase(), "1"], [strings.messages.off.toUpperCase(), "0"]] },
                        ]
                    }
                },
                {
                    name: "sendIRMessage", params: ["String", "String"], blocklyJson: {
                        "args0": [
                            {"type": "field_dropdown", "name": "PARAM_0", "options": getSensorNames("irtrans")},
                            { "type": "input_value", "name": "PARAM_1", "text": "" },
                        ]
                    },
                    blocklyXml: "<block type='sendIRMessage'>" +
                        "<value name='PARAM_1'><shadow type='text'><field name='TEXT'></field> </shadow></value>" +
                        "</block>"
                },
                {
                    name: "presetIRMessage", params: ["String", "String"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0", "text": "" },
                            { "type": "input_value", "name": "PARAM_1", "text": "" },
                        ]
                    },
                    blocklyXml: "<block type='presetIRMessage'>" +
                        "<value name='PARAM_0'><shadow type='text'><field name='TEXT'></field> </shadow></value>" +
                        "<value name='PARAM_1'><shadow type='text'><field name='TEXT'></field> </shadow></value>" +
                        "</block>"
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
                    name: "displayText", params: ["String", "String"], variants: [[null], [null, null]], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0", "text": "" },
                        ]
                    },
                    blocklyXml: "<block type='displayText'>" +
                        "<value name='PARAM_0'><shadow type='text'><field name='TEXT'>" + strings.messages.hello + "</field> </shadow></value>" +
                        "</block>"

                },
                {
                    name: "displayText2Lines", params: ["String", "String"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0", "text": "" },
                            { "type": "input_value", "name": "PARAM_1", "text": "" },
                        ]
                    },
                    blocklyXml: "<block type='displayText2Lines'>" +
                        "<value name='PARAM_0'><shadow type='text'><field name='TEXT'>" + strings.messages.hello + "</field> </shadow></value>" +
                        "<value name='PARAM_1'><shadow type='text'><field name='TEXT'></field> </shadow></value>" +
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
                    name: "isPointSet", yieldsValue: true, params: ["Number", "Number"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0"},
                            { "type": "input_value", "name": "PARAM_1"},
                        ]
                    },
                    blocklyXml: "<block type='isPointSet'>" +
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
                    name: "getTemperatureFromCloud", yieldsValue: true, params: ["String"], blocklyJson: {
                        "args0": [
                            { "type": "field_input", "name": "PARAM_0", text: "Paris"},
                        ]
                    },
                    blocklyXml: "<block type='getTemperatureFromCloud'>" +
                        "<value name='PARAM_0'><shadow type='text'><field name='TEXT'></field> </shadow></value>" +
                        "</block>"
                },
                {
                    name: "connectToCloudStore", params: ["String", "String"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0", text: ""},
                            { "type": "input_value", "name": "PARAM_1", text: ""},
                        ]
                    },
                    blocklyXml: "<block type='connectToCloudStore'>" +
                        "<value name='PARAM_0'><shadow type='text'><field name='TEXT'></field> </shadow></value>" +
                        "<value name='PARAM_1'><shadow type='text'><field name='TEXT'></field> </shadow></value>" +
                        "</block>"
                },
                {
                    name: "writeToCloudStore", params: ["String", "String", "String"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0", text: ""},
                            { "type": "input_value", "name": "PARAM_1", text: ""},
                            { "type": "input_value", "name": "PARAM_2", text: ""},
                        ]
                    },
                    blocklyXml: "<block type='writeToCloudStore'>" +
                        "<value name='PARAM_0'><shadow type='text'><field name='TEXT'></field> </shadow></value>" +
                        "<value name='PARAM_1'><shadow type='text'><field name='TEXT'></field> </shadow></value>" +
                        "<value name='PARAM_2'><shadow type='text'><field name='TEXT'></field> </shadow></value>" +
                        "</block>"
                },
                {
                    name: "readFromCloudStore", yieldsValue: true, params: ["String", "String"], blocklyJson: {
                        "args0": [
                            { "type": "input_value", "name": "PARAM_0", text: ""},
                            { "type": "input_value", "name": "PARAM_1", text: ""},
                        ]
                    },
                    blocklyXml: "<block type='readFromCloudStore'>" +
                        "<value name='PARAM_0'><shadow type='text'><field name='TEXT'></field> </shadow></value>" +
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
                actuator: 0,
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
