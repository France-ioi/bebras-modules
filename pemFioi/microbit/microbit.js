var DEBUG_SILENCE_SENSORS = false;
var DEBUG_OUTPUT_IN_CONSOLE = true;
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
        if(nbCommandsExecuted > 500) {
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
        } else if(command == "isButtonPressed(\"button a\")") {
            if(DEBUG_SILENCE_SENSORS) {
                return callback(0);
            }
            executeSerial("print(button_a.is_pressed())", function(data) { callback(data == 'True' ? 1 : 0); });
        } else if(command == "isButtonPressed(\"button b\")") {
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

pwm7 = PWM(Pin(7), freq=50)
pwm7.duty(30)

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
    if name == "button a":
        return button_a.is_pressed()
    elif name == "button b":
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

f = open("main.py", "w")
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
f.close()


`;



function md5cycle(x, k) {
var a = x[0], b = x[1], c = x[2], d = x[3];

a = ff(a, b, c, d, k[0], 7, -680876936);
d = ff(d, a, b, c, k[1], 12, -389564586);
c = ff(c, d, a, b, k[2], 17,  606105819);
b = ff(b, c, d, a, k[3], 22, -1044525330);
a = ff(a, b, c, d, k[4], 7, -176418897);
d = ff(d, a, b, c, k[5], 12,  1200080426);
c = ff(c, d, a, b, k[6], 17, -1473231341);
b = ff(b, c, d, a, k[7], 22, -45705983);
a = ff(a, b, c, d, k[8], 7,  1770035416);
d = ff(d, a, b, c, k[9], 12, -1958414417);
c = ff(c, d, a, b, k[10], 17, -42063);
b = ff(b, c, d, a, k[11], 22, -1990404162);
a = ff(a, b, c, d, k[12], 7,  1804603682);
d = ff(d, a, b, c, k[13], 12, -40341101);
c = ff(c, d, a, b, k[14], 17, -1502002290);
b = ff(b, c, d, a, k[15], 22,  1236535329);

a = gg(a, b, c, d, k[1], 5, -165796510);
d = gg(d, a, b, c, k[6], 9, -1069501632);
c = gg(c, d, a, b, k[11], 14,  643717713);
b = gg(b, c, d, a, k[0], 20, -373897302);
a = gg(a, b, c, d, k[5], 5, -701558691);
d = gg(d, a, b, c, k[10], 9,  38016083);
c = gg(c, d, a, b, k[15], 14, -660478335);
b = gg(b, c, d, a, k[4], 20, -405537848);
a = gg(a, b, c, d, k[9], 5,  568446438);
d = gg(d, a, b, c, k[14], 9, -1019803690);
c = gg(c, d, a, b, k[3], 14, -187363961);
b = gg(b, c, d, a, k[8], 20,  1163531501);
a = gg(a, b, c, d, k[13], 5, -1444681467);
d = gg(d, a, b, c, k[2], 9, -51403784);
c = gg(c, d, a, b, k[7], 14,  1735328473);
b = gg(b, c, d, a, k[12], 20, -1926607734);

a = hh(a, b, c, d, k[5], 4, -378558);
d = hh(d, a, b, c, k[8], 11, -2022574463);
c = hh(c, d, a, b, k[11], 16,  1839030562);
b = hh(b, c, d, a, k[14], 23, -35309556);
a = hh(a, b, c, d, k[1], 4, -1530992060);
d = hh(d, a, b, c, k[4], 11,  1272893353);
c = hh(c, d, a, b, k[7], 16, -155497632);
b = hh(b, c, d, a, k[10], 23, -1094730640);
a = hh(a, b, c, d, k[13], 4,  681279174);
d = hh(d, a, b, c, k[0], 11, -358537222);
c = hh(c, d, a, b, k[3], 16, -722521979);
b = hh(b, c, d, a, k[6], 23,  76029189);
a = hh(a, b, c, d, k[9], 4, -640364487);
d = hh(d, a, b, c, k[12], 11, -421815835);
c = hh(c, d, a, b, k[15], 16,  530742520);
b = hh(b, c, d, a, k[2], 23, -995338651);

a = ii(a, b, c, d, k[0], 6, -198630844);
d = ii(d, a, b, c, k[7], 10,  1126891415);
c = ii(c, d, a, b, k[14], 15, -1416354905);
b = ii(b, c, d, a, k[5], 21, -57434055);
a = ii(a, b, c, d, k[12], 6,  1700485571);
d = ii(d, a, b, c, k[3], 10, -1894986606);
c = ii(c, d, a, b, k[10], 15, -1051523);
b = ii(b, c, d, a, k[1], 21, -2054922799);
a = ii(a, b, c, d, k[8], 6,  1873313359);
d = ii(d, a, b, c, k[15], 10, -30611744);
c = ii(c, d, a, b, k[6], 15, -1560198380);
b = ii(b, c, d, a, k[13], 21,  1309151649);
a = ii(a, b, c, d, k[4], 6, -145523070);
d = ii(d, a, b, c, k[11], 10, -1120210379);
c = ii(c, d, a, b, k[2], 15,  718787259);
b = ii(b, c, d, a, k[9], 21, -343485551);

x[0] = add32(a, x[0]);
x[1] = add32(b, x[1]);
x[2] = add32(c, x[2]);
x[3] = add32(d, x[3]);

}

function cmn(q, a, b, x, s, t) {
a = add32(add32(a, q), add32(x, t));
return add32((a << s) | (a >>> (32 - s)), b);
}

function ff(a, b, c, d, x, s, t) {
return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

function md51(s) {
txt = '';
var n = s.length,
state = [1732584193, -271733879, -1732584194, 271733878], i;
for (i=64; i<=s.length; i+=64) {
md5cycle(state, md5blk(s.substring(i-64, i)));
}
s = s.substring(i-64);
var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
for (i=0; i<s.length; i++)
tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
tail[i>>2] |= 0x80 << ((i%4) << 3);
if (i > 55) {
md5cycle(state, tail);
for (i=0; i<16; i++) tail[i] = 0;
}
tail[14] = n*8;
md5cycle(state, tail);
return state;
}

/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */
function md5blk(s) { /* I figured global was faster.   */
var md5blks = [], i; /* Andy King said do it this way. */
for (i=0; i<64; i+=4) {
md5blks[i>>2] = s.charCodeAt(i)
+ (s.charCodeAt(i+1) << 8)
+ (s.charCodeAt(i+2) << 16)
+ (s.charCodeAt(i+3) << 24);
}
return md5blks;
}

var hex_chr = '0123456789abcdef'.split('');

function rhex(n)
{
var s='', j=0;
for(; j<4; j++)
s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
+ hex_chr[(n >> (j * 8)) & 0x0F];
return s;
}

function hex(x) {
for (var i=0; i<x.length; i++)
x[i] = rhex(x[i]);
return x.join('');
}

function md5(s) {
return hex(md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
return (a + b) & 0xFFFFFFFF;
}

if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
function add32(x, y) {
var lsw = (x & 0xFFFF) + (y & 0xFFFF),
msw = (x >> 16) + (y >> 16) + (lsw >> 16);
return (msw << 16) | (lsw & 0xFFFF);
}
}

var pythonLibHash = md5(pythonLib);