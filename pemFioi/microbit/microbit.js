var DEBUG_SILENCE_SENSORS = false;
var DEBUG_OUTPUT_IN_CONSOLE = false;
var DEBUG_FULL_OUTPUT = true;
var SERVO_MIN_DUTY = 26;
var SERVO_MAX_DUTY = 124;


async function getSerial(filters) {
    var port = await navigator.serial.requestPort({
        filters: filters
    });
    await port.open({ baudRate: 115200 });
    return port;
}

async function serialWrite(port, data) {
    const writer = port.writable.getWriter();
    const encoder = new TextEncoder();
/*    var remainingData = data;
    while(remainingData.length > 0) {
        await writer.write(encoder.encode(remainingData.substring(0, 64)));
        remainingData = remainingData.substring(64);
    }*/
    writer.write(encoder.encode(data));
    writer.releaseLock();
}

var sensorValues = {
    "light": 0,
    "acx": 12,
    "acy": 10,
    "acz": 20,
    "heading": 0
}

g_instance = null;
var getQuickPiConnection = function (userName, _onConnect, _onDisconnect, _onChangeBoard) {
    this.onConnect = _onConnect;
    this.onDisconnect = _onDisconnect;

    if (g_instance) {
        return g_instance;
    }

    this.connecting = false;
    this.connected = false;
    this.releasing = false;
    this.onConnect = _onConnect;
    this.onDisconnect = _onDisconnect;
    this.onChangeBoard = _onChangeBoard;

    this.currentOutput = "";
    this.outputCallback = null;
    this.processGalaxiaOutput = function(data) {
        var text = new TextDecoder().decode(data);
        this.currentOutput += text;
        var lines = this.currentOutput.split('\r\n');
        if(!DEBUG_FULL_OUTPUT) {
            lines = lines.slice(-50);
        }
        this.currentOutput = lines.join('\r\n');
        if(DEBUG_OUTPUT_IN_CONSOLE) {
            console.log(this.currentOutput);
        }
        window.currentOutput = this.currentOutput;

        if(this.outputCallback && lines[lines.length - 1].startsWith('>>> ') && lines[lines.length - 2].startsWith(currentOutputId)) {
            this.outputCallback(lines[lines.length - 4]);
            this.outputCallback = null;
        }
    }
    
    
    this.serial = null;
    this.connect = async function(url) {
        this.connecting = true;
        this.releasing = false;
        try {
            this.serial = await getSerial([{usbProductId: 0x0204, usbVendorId: 0x0d28}]);
        } catch(e) {
            this.connecting = false;
            _onDisconnect(false);
            return;
        }
        this.connecting = false;
        this.connected = true;

        this.serial.addEventListener('disconnect', () => {
            this.connected = false;
            this.onDisconnect(true);
        });

        this.serialStartRead(this.serial, this.processGalaxiaOutput.bind(this));
        await this.transferPythonLib();
        this.onConnect();
    }

    this.serialStartRead = async function(port, callback) {
        this.reader = port.readable.getReader();
        while (true) {
            const { value, done } = await reader.read();
            callback(value);
            if (done || this.releasing) {
                reader.cancel();
                break;
            }
        }
    }
    
    

    this.transferPythonLib = async function() {
        await serialWrite(this.serial, ("exec(" + JSON.stringify(pythonLib) + ")").replace(/\n/g, "\r\n") + "\r\n");
    }

    this.isAvailable = function(ipaddress, callback) {
        // Avoid blocklyQuickPi_lib auto-connecting
        try {
            sessionStorage["autoConnect"] = 0;
        } catch(e) {}
        
        callback(ipaddress == "localhost");
    }

    this.onclose = function() {}

    this.wasLocked = function() {}

    this.isConnecting = function () {
        return this.connecting;
    }

    this.isConnected = function () {
        return this.connected;
    }

    this.executeProgram = function (pythonProgram) {
        // TODO
    }


    this.installProgram = function (pythonProgram, oninstall) {
        var fullProgram = pythonLib + pythonProgram;
        var cmds = [
            "f = open(\"main.py\", \"w\")"
        ]
        while(fullProgram.length > 0) {
            cmds.push("f.write(" + JSON.stringify(fullProgram.substring(0, 64)) + ")");
            fullProgram = fullProgram.substring(64);
        }
        cmds.push("f.close()");
        cmds.push("exec(open(\"main.py\", \"r\").read())");
        console.log(cmds);
        var idx = -1;
        function executeNext() {
            idx += 1;
            if(idx >= cmds.length) {
                return oninstall();
            }
            executeSerial(cmds[idx] + "\r\n", executeNext);
        }
        executeNext();
    }

    this.runDistributed = function (pythonProgram, graphDefinition, oninstall) {
        return;
    }

    this.stopProgram = function() {
        // TODO
    }

    var releaseTimeout = null;
    this.releaseLock = function() {
        if(!this.serial) { return; }
        var that = this;
        this.releasing = true;
        function endRelease() {
            if(!releaseTimeout) { return; }
            that.serial.close();
            that.serial = null;
            that.connecting = null;
            that.connected = null;
            releaseTimeout = null;
            that.onDisconnect(false);
        }
        serialWrite(this.serial, "\x04").then(() => {
            that.reader.closed.then(() => {
                // For some reason, if we don't use a timeout, the reader is still locked and we can't close the serial port
                setTimeout(endRelease, 100);
            });
        });
        releaseTimeout = setTimeout(endRelease, 10000);
    }

    this.startNewSession = function() {
        // TODO
    }

    this.startTransaction = function() {
        // TODO
    }

    this.endTransaction = function() {
        // TODO
    }



    var executionQueue = [];
    var executing = false;
    var currentExecutionCallback = null;
    var currentOutputId = "";
    var nbCommandsExecuted = 0;
    function executeSerial(command, callback) {
        if(executing) {
            executionQueue.push([command, callback]);
            return;
        }
        executing = true;
        nbCommandsExecuted += 1;
        if(nbCommandsExecuted > 100) {
            executionQueue.push(["\x04", () => {}]);
            executionQueue.push([("exec(" + JSON.stringify(pythonLib) + ")").replace(/\n/g, "\r\n"), () => {}]);
            nbCommandsExecuted = 0;
        }
        currentOutputId = Math.random().toString(36).substring(7);
        currentExecutionCallback = callback;
        serialWrite(this.serial, command + "\r\nprint(\"" + currentOutputId + "\")\r\n").then(() => {
            this.outputCallback = function(data) {
                if(currentExecutionCallback) {
                    currentExecutionCallback(data);
                }
                executing = false;
                if(executionQueue.length > 0) {
                    var [command, callback] = executionQueue.shift();
                    executeSerial(command, callback);
                }
            }
        })
    }
    window.exec = executeSerial.bind(this);

    this.sendCommand = function (command, callback) {
        if(command == "readAccelBMI160()") {
            //callback(JSON.stringify([sensorValues.acx, sensorValues.acy, sensorValues.acz]));
            if(DEBUG_SILENCE_SENSORS) {
                return callback(JSON.stringify([0, 0, 0]))
            }
            executeSerial("print([accelerometer.get_x(), accelerometer.get_y(), accelerometer.get_z()])",
                function(data) {
                    var values = [0, 0, 0];
                    try {
                        values = JSON.parse(data);
                    } catch(e) {}
                    callback(JSON.stringify(values.map(x => Math.round(x/10)/10)));
                });
        } else if(command == "setLedState(\"led\",1)" || command == "turnLedOn()") {
            if(DEBUG_SILENCE_SENSORS) {
                return callback(true);
            }
            executeSerial("led.set_colors(100, 20, 20)\r\nprint(True)", callback);
        } else if(command == "setLedState(\"led\",0)" || command == "turnLedOff()") {
            if(DEBUG_SILENCE_SENSORS) {
                return callback(true);
            }
            executeSerial("led.set_colors(0, 0, 0)\r\nprint(True)", callback);
        } else if(command == "readAcceleration(\"x\")") {
            if(DEBUG_SILENCE_SENSORS) {
                return callback(0);
            }
            executeSerial("print(accelerometer.get_x())", function(data) {
                var value = 0;
                try {
                    value = parseInt(JSON.parse(data));
                } catch(e) {}
                callback(Math.round(value/10)/10);
            });
        } else if(command == "readAcceleration(\"y\")") {
            if(DEBUG_SILENCE_SENSORS) {
                return callback(0);
            }
            executeSerial("print(accelerometer.get_y())", function(data) {
                var value = 0;
                try {
                    value = parseInt(JSON.parse(data));
                } catch(e) {}
                callback(Math.round(value/10)/10);
            });
        } else if(command == "readAcceleration(\"z\")") {
            if(DEBUG_SILENCE_SENSORS) {
                return callback(0);
            }
            executeSerial("print(accelerometer.get_z())", function(data) {
                var value = 0;
                try {
                    value = parseInt(JSON.parse(data));
                } catch(e) {}
                callback(Math.round(value/10)/10);
            });
        } else if(command == "isButtonPressed(\"btnA\")") {
            if(DEBUG_SILENCE_SENSORS) {
                return callback(0);
            }
            executeSerial("print(button_a.is_pressed())", function(data) { callback(data == 'True' ? 1 : 0); });
        } else if(command == "isButtonPressed(\"btnB\")") {
            if(DEBUG_SILENCE_SENSORS) {
                return callback(0);
            }
            executeSerial("print(button_b.is_pressed())", function(data) { callback(data == 'True' ? 1 : 0); });
        } else if(command.startsWith("setServoAngle(\"servo\",")) {
            if(DEBUG_SILENCE_SENSORS) {
                return callback(true);
            }
            var angle = parseInt(command.substring(22, command.length - 1));
            if(!angle || angle < 0) { angle = 0; }
            if(angle > 180) { angle = 180; }
            var duty = Math.floor(SERVO_MIN_DUTY+angle*(SERVO_MAX_DUTY - SERVO_MIN_DUTY)/180);
            executeSerial("pwm7.duty(" + duty + ")\r\nprint(True)", callback);
        } else if(command == "getServoAngle(\"servo\")") {
            if(DEBUG_SILENCE_SENSORS) {
                return callback(90);
            }
            executeSerial("print(pwm7.duty())", function(data) {
                var duty = parseInt(data);
                var angle = Math.floor((duty - SERVO_MIN_DUTY) * 180 / (SERVO_MAX_DUTY - SERVO_MIN_DUTY));
                callback(angle);
            });
        } else if(command.startsWith("setLedMatrixState")) {
            executeSerial(command + "\r\nprint(True)", callback);
        } else {
            console.log("unknown command", command);
            callback();
        }
    }

    g_instance = this;
    return this;
}


var pythonLib = `
from microbit import *
from machine import *

def readAcceleration(axis):
    if axis == "x":
        val = accelerometer.get_x()
    elif axis == "y":
        val = accelerometer.get_y()
    elif axis == "z":
        val = accelerometer.get_z()
    else:
        throw("Unknown axis")
    return round(val/100, 1)

def readAccelBMI160():
    return [readAcceleration("x"), readAcceleration("y"), readAcceleration("z")]

def setLedState(name, state):
    if state == 1:
        led.set_colors(100, 20, 20)
    else:
        led.set_colors(0, 0, 0)

def turnLedOn():
    setLedState("led", 1)

def turnLedOff():
    setLedState("led", 0)

def isButtonPressed(name):
    if name == "btnA":
        return button_a.is_pressed()
    elif name == "btnB":
        return button_b.is_pressed()
    else:
        throw("Unknown button")

def setServoAngle(name, angle):
    if angle < 0:
        angle = 0
    if angle > 180:
        angle = 180
    
    duty = round(SERVO_MIN_DUTY+angle*(SERVO_MAX_DUTY - SERVO_MIN_DUTY)/180);
    pwm7.duty(duty)

def getServoAngle(name):
    duty = pwm7.duty()
    angle = round((duty - SERVO_MIN_DUTY) * 180 / (SERVO_MAX_DUTY - SERVO_MIN_DUTY))
    return angle

matrixState = [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]
def setLedMatrixState(name,state):
    for i in range(5):
        for j in range(5):
            if matrixState[i][j] != state[i][j]:
                if state[i][j] == 1:
                    display.set_pixel(i, j, 9)
                else:
                    display.set_pixel(i, j, 0)
            matrixState[i][j] = state[i][j]
    return True
setLedMatrixState("leds", [[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]])
setLedMatrixState("leds", [[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]])

`;

