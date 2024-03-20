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
    await writer.ready;
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

    this.resetProperties = function() {
        this.connecting = false;
        this.connected = false;
        this.releasing = false;
        this.serial = null;
        this.currentOutput = "";
        this.outputCallback = null;
        this.executionQueue = [];
        this.executing = false;
    }
    this.resetProperties();

    this.onConnect = _onConnect;
    this.onDisconnect = function() {
        _onDisconnect.apply(this, arguments);
    }
    this.onChangeBoard = _onChangeBoard;

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
    
    this.connect = async function(url) {
        this.resetProperties();
        this.connecting = true;
        try {
            this.serial = await getSerial([{usbProductId: 0x4003, usbVendorId: 0x303A}]);
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

        this.serialStartRead(this.serial);
        await this.transferPythonLib();
        this.onConnect();
    }

    this.serialStartRead = async function(port, callback) {
        this.reader = port.readable.getReader();
        while (true) {
            const { value, done } = await reader.read();
            this.processGalaxiaOutput(value);
            if (done || this.releasing) {
                reader.cancel();
                break;
            }
        }
    }


    this.transferPythonLib = async function() {
        await serialWrite(this.serial, "f = open(\"fioilib.py\", \"w\")\r\nf.write(" + JSON.stringify(pythonLib).replace(/\n/g, "\r\n") + ")\r\nf.close()\r\n");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await serialWrite(this.serial, "exec(open(\"fioilib.py\", \"r\").read())\r\n");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await serialWrite(this.serial, "f = open(\"main.py\", \"w\")\r\nf.write(" + JSON.stringify(mainLib).replace(/\n/g, "\r\n") + ")\r\nf.close()\r\n");
        await new Promise(resolve => setTimeout(resolve, 1000));
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
        var fullProgram = pythonProgram;
        var cmds = [
            "f = open(\"program.py\", \"w\")"
        ]
        while(fullProgram.length > 0) {
            cmds.push("f.write(" + JSON.stringify(fullProgram.substring(0, 128)) + ")");
            fullProgram = fullProgram.substring(128);
        }
        cmds.push("f.close()");
        var idx = -1;
        function executeNext() {
            idx += 1;
            if(idx >= cmds.length) {
                oninstall();
                executeSerial("exec(open(\"program.py\", \"r\").read())", () => {});
            }
            executeSerial(cmds[idx] + "\r\n", function() {
                setTimeout(executeNext, 500)
            });
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


    var currentExecutionCallback = null;
    var currentOutputId = "";
    var nbCommandsExecuted = 0;
    function executeSerial(command, callback) {
        if(this.executing) {
            this.executionQueue.push([command, callback]);
            return;
        }
        this.executing = true;
        var that = this;
        nbCommandsExecuted += 1;
        if(nbCommandsExecuted > 500) {
            this.executionQueue.push(["\x04", () => {}]);
            this.executionQueue.push(["exec(open(\"fioilib.py\", \"r\").read())\r\n", () => {}]);
            nbCommandsExecuted = 0;
        }
        currentOutputId = Math.random().toString(36).substring(7);
        currentExecutionCallback = callback;
        serialWrite(this.serial, command + "\r\nprint(\"" + currentOutputId + "\")\r\n").then(() => {
            that.outputCallback = function(data) {
                if(currentExecutionCallback) {
                    currentExecutionCallback(data);
                }
                that.executing = false;
                if(that.executionQueue.length > 0) {
                    var [command, callback] = that.executionQueue.shift();
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
                    callback(JSON.stringify(JSON.parse(data).map(x => Math.round(x/10)/10)));
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
            executeSerial("print(accelerometer.get_x())", function(data) { callback(Math.round(JSON.parse(data)/10)/10); });
        } else if(command == "readAcceleration(\"y\")") {
            if(DEBUG_SILENCE_SENSORS) {
                return callback(0);
            }
            executeSerial("print(accelerometer.get_y())", function(data) { callback(Math.round(JSON.parse(data)/10)/10); });
        } else if(command == "readAcceleration(\"z\")") {
            if(DEBUG_SILENCE_SENSORS) {
                return callback(0);
            }
            executeSerial("print(accelerometer.get_z())", function(data) { callback(Math.round(JSON.parse(data)/10)/10); });
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
            var duty = Math.floor(0.025*1023+angle*0.1*1023/180);
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
        } else if(command.startsWith("setBuzzerState(\"buzzer\",")) {
            if(DEBUG_SILENCE_SENSORS) {
                return callback(true);
            }
            var state = command.substring(24, command.length - 1);
            var target = "off";
            if(state == "True" || state == "1") {
                target = "on";
            }
            executeSerial("p7." + target + "()\r\nprint(True)", callback);
        } else {
            console.log("unknown command", command);
            callback();
        }
    }

    g_instance = this;
    return this;
}


var pythonLib = `
from machine import *
from thingz import *

#pwm7 = PWM(Pin(7), freq=50, duty=205)
#pwm7 = PWM(Pin(7), freq=50, duty_u16=0)
p7 = Pin(7, Pin.OUT)

`

pythonLib += `
SERVO_MIN_DUTY = ` + SERVO_MIN_DUTY + `
SERVO_MAX_DUTY = ` + SERVO_MAX_DUTY + `
`

pythonLib += `def readAcceleration(axis):
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

def setBuzzerState(name, state):
    if state == True or state == 1:
        p7.on()
    else:
        p7.off()

`;

var mainLib = `
import os
from machine import *
from thingz import *

program_exists = False

try:
    open("program.py", "r").close()
    program_exists = True
except OSError:
    pass

if button_a.is_pressed() and button_b.is_pressed():
    if program_exists:
        print("Removing program")
        os.remove("program.py")
elif program_exists:
    exec(open("fioilib.py", "r").read(), globals())
    exec(open("program.py", "r").read(), globals())

`




/*f = open("main.py", "w")
f.write("""
from machine import *
from thingz import *
import os
if button_a.is_pressed() and button_b.is_pressed():
    if os.path.exists("main.py"):
        print("Removing")
        os.remove("main.py")
else:
    print("Hello, world!")
""")
f.close()*/

