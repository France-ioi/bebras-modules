g_instance = null;
NEED_VERSION = 2;

var getQuickPiConnection = function (userName, _onConnect, _onDisconnect, _onChangeBoard) {
    this.onConnect = _onConnect;
    this.onDisconnect = _onDisconnect;

    if (g_instance) {
        return g_instance;
    }

    this.raspiServer = "";
    this.wsSession = null;
    this.transaction = false;
    this.resultsCallbackArray = null;
    this.commandMode = false;
    this.userName = userName;
    this.sessionTainted = false;
    this.connected = false;
    this.onConnect = _onConnect;
    this.onDisconnect = _onDisconnect;
    this.onChangeBoard = _onChangeBoard;
    this.locked = "";
    this.pingInterval = null;
    this.pingsWithoutPong = 0;
    this.oninstalled = null;
    this.commandQueue = [];
    this.seq = 0;
    this.wrongVersion = false;
    this.onDistributedEvent = null;

    this.connect = function(url) {
        if (this.wsSession != null) {
            return;
        }

        this.locked = "";
        this.pingsWithoutPong = 0;
        this.commandQueue = [];
        this.resultsCallbackArray = [];
        this.wrongVersion = false;

        this.seq = Math.floor(Math.random() * 65536);

        this.wsSession = new WebSocket(url);

        this.wsSession.onopen = function () {
            var command =
            {
                "command": "grabLock",
                "username": userName,
                "detectionLib": pythonLibDetection
            }

            wsSession.send(JSON.stringify(command));
        }

        this.wsSession.onmessage = function (evt) {
            var message = JSON.parse(evt.data);

            if (message.command == "hello") {
                var version = 0;
                if (message.version)
                    version = message.version;

                if (version < NEED_VERSION) {
                    wrongVersion = true;
                    wsSession.close();
                    onclose();
                }
                else {
                    var replaceLib = pythonLibHash != message.libraryHash;


                    if (replaceLib)
                        transferPythonLib();
                    else {
                        var command =
                        {
                            "command": "pythonLib",
                            "replaceLib": false,
                        };
    
                        wsSession.send(JSON.stringify(command));
                    }

                    connected = true;
                    onConnect();
        
                    pingInterval = setInterval(function() {
                        var command =
                        {
                            "command": "ping"
                        }
        
                        if (pingsWithoutPong > 8)
                        {
                            wsSession.close();
                            onclose();
                        } else {
                            pingsWithoutPong++;
                            wsSession.send(JSON.stringify(command));
                            lastPingSend = + new Date();
                        }
        
                        }, 4000);        

                    if (onChangeBoard && message.board)
                    {
                        onChangeBoard(message.board);
                    }
                }
            }
            if (message.command == "locked") {
                locked = message.lockedby;
            } else if (message.command == "pong") {
                pingsWithoutPong = 0;
            } else if (message.command == "installed") {

                if (oninstalled != null)
                    oninstalled();

            } else if (message.command == "startCommandMode") {
                if (commandQueue.length > 0)
                {
                    var command = commandQueue.shift();

                    resultsCallbackArray = [];
                    sendCommand(command.command, command.callback);
                }
            } else if (message.command == "execLineresult") {
                if (commandMode) {

                    //console.log("Result seq: " + message.seq);

                    if (resultsCallbackArray && resultsCallbackArray.length > 0)
                    {
                        //console.log("resultsCallbackArray has elements")
                        if (message.seq >= resultsCallbackArray[0].seq)
                        {
                            //console.log("we under the seq");
                            var callbackelement = null;
                            var found = false;

                            while (resultsCallbackArray.length > 0)
                            {
                                callbackelement = resultsCallbackArray.shift();

                                if (callbackelement.seq == message.seq)
                                {
                                    //console.log("we found it " + callbackelement.command, message.seq );
                                    found = true;
                                    break;
                                }
                            }

                            if (found) {
                                callbackelement.callback(message.result);
                            }
                        }
                    }


                    if (commandQueue.length > 0 && !transaction)
                    {
                        var command = commandQueue.shift();

                        sendCommand(command.command, command.callback);
                    }
                }
            } else if (message.command == "closed") {
                if (wsSession) {
                        wsSession.close();
                }
            }
            else if (message.command == "distributedEvent")
            {
                if (onDistributedEvent)
                    onDistributedEvent(message.event);
            }
        }

        this.wsSession.onclose = function (event) {
            if (wsSession != null) {
                clearInterval(pingInterval);
                pingInterval = null;

                wsSession = null;
                commandMode = false;
                sessionTainted = false;

                connected = false;

                onDisconnect(connected, wrongVersion);
            }
        }
    }

    this.transferPythonLib = function()
    {
        var size = 10*1025; // Max 5KbSize
        var numChunks = Math.ceil(pythonLib.length / size);

        for (let i = 0, o = 0; i < numChunks; ++i, o += size) {

            var chunk = pythonLib.substr(o, size);
            var command =
            {
                "command": "pythonLib",
                "replaceLib": true,
                "library": chunk,
                "last": ((numChunks -1 ) == i),
            };

            wsSession.send(JSON.stringify(command));
        }
    }

    this.isAvailable = function(ipaddress, callback) {
        url = "ws://" + ipaddress + ":5000/api/v1/commands";

        try {
           var websocket = new WebSocket(url);

           websocket.onopen = function () {
               websocket.onclose = null;
               websocket.close();
               callback(true);
           }
           websocket.onclose = function () {
               callback(false);
           }
        } catch(err) {
            callback(false);
        }
    }

    this.onclose = function() {
        clearInterval(pingInterval);
        pingInterval = null;

        wsSession = null;
        commandMode = false;
        sessionTainted = false;
        connected = false;

        onDisconnect(connected, wrongVersion);

    }

    this.wasLocked = function()
    {
        if (this.locked)
            return true;

        return false;
    }

    this.isConnecting = function () {
        return this.wsSession != null;
    }

    this.isConnected = function () {
        return this.connected;
    }

    this.executeProgram = function (pythonProgram) {
        if (this.wsSession == null)
            return;

        this.commandMode = false;

        var fullProgram = pythonLib + pythonProgram;
        var command =
        {
            "command": "startRunMode",
            "program": fullProgram
        }

        this.wsSession.send(JSON.stringify(command));
    }


    this.installProgram = function (pythonProgram, oninstall) {
        if (this.wsSession == null)
            return;

        this.commandMode = false;
        this.oninstalled = oninstall;

        var fullProgram = pythonProgram;
        var command =
        {
            "command": "install",
            "program": fullProgram
        }

        this.wsSession.send(JSON.stringify(command));
    }

    this.runDistributed = function (pythonProgram, graphDefinition, oninstall) {
        if (this.wsSession == null)
            return;

        this.commandMode = false;
        this.oninstalled = oninstall;

        var fullProgram = pythonLib + pythonProgram;
        var command =
        {
            "command": "rundistributed",
            "program": fullProgram,
            "graph": graphDefinition
        }

        this.wsSession.send(JSON.stringify(command));
    }

    this.stopProgram = function() {
        if (this.wsSession != null) {
            var command =
            {
                "command": "stopAll",
            }

            this.wsSession.send(JSON.stringify(command));
        }
    }

    this.releaseLock = function() {
        if (this.wsSession == null)
            return;

        if (this.wsSession != null) {
            var command =
            {
                "command": "close",
            }

            this.wsSession.send(JSON.stringify(command));
        }
    }

    this.startNewSession = function() {
        if (this.wsSession == null)
            return;

        if (this.commandMode && !this.sessionTainted)
            return;

        this.resultsCallbackArray = [];
        this.commandMode = true;
        this.sessionTainted = false;

        var command =
        {
            "command": "startCommandMode",
        }

        this.commandQueue = [];
        this.wsSession.send(JSON.stringify(command));
    }

    this.startTransaction = function()
    {
        this.transaction = true;
    }

    this.endTransaction = function()
    {
        messages = [];
        this.resultsCallbackArray = [];

        for (var i = 0; i < this.commandQueue.length; i++)
        {
            this.seq++;
            messages.push(
            {
                "command": "execLine",
                "line": this.commandQueue[i].command,
                "seq": seq,
                "long": this.commandQueue[i].long? true: false
            });

            //console.log("trans seq: " + seq);

            this.resultsCallbackArray.push ({
                "seq": seq,
                "callback": this.commandQueue[i].callback,
                "command": this.commandQueue[i].command
            });

            this.sessionTainted = true;
        }

        this.commandQueue = [];

        var command =
        {
            "command": "transaction",
            "messages": messages,
        }

        this.wsSession.send(JSON.stringify(command));

        this.transaction = false;
    }

    this.sendCommand = function (command, callback, long) {

        if (this.wsSession != null && this.wsSession.readyState == 1) {
            if (!this.transaction) {
                if (!this.commandMode) {
                    this.startNewSession();

                    console.log("..............................");

                    this.commandQueue.push ({
                        "command": command,
                        "callback": callback,
                        "long": long? true: false
                    });
                } else {
                    this.seq++;
                    var commandobj =
                    {
                        "command": "execLine",
                        "line": command,
                        "seq": seq,
                        "long": long? true: false
                    }

                    //console.log("send command ", command, seq);

                    //console.log("Sending seq: " + seq);
                    this.resultsCallbackArray.push ({
                        "seq": seq,
                        "callback": callback,
                        "command": command,
                    });

                    this.sessionTainted = true;
                    this.wsSession.send(JSON.stringify(commandobj));
                }
            }
            else {
                this.commandQueue.push ({
                    command: command,
                    callback: callback
                });
            }
        }
    }


    g_instance = this;
    return this;
}


var pythonLib = `
try:
    sensorTable
except:
    sensorTable = []


import RPi.GPIO as GPIO
import time
import smbus
import math
import pigpio
import threading
import argparse

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

led_brightness = {}
buzzer_frequency = {}
servo_angle = {}

button_interrupt_enabled = {}
button_was_pressed = {}
servo_object = {}
servo_last_value = {}
pin_state = {}

DHT11_last_value = {}

distance_last_value = {}

passive_buzzer_last_value = {}

screenLine1 = None
screenLine2 = None

oleddisp = None
oledfont = None
oledimage = None
oleddraw = None
oledwidth = 128
oledheight = 32
oledautoupdate = True


vl53l0x = None

enabledBMI160 = False
isBMX160 = False
enabledLSM303C = False

compassOffset = None
compassScale = None


pi = pigpio.pi()

parser = argparse.ArgumentParser()
parser.add_argument('--nodeid', action='store')
args = parser.parse_args()
nodeId = args.nodeid


def nameToPin(name):
    for sensor in sensorTable:
        if sensor["name"] == name:
            return sensor["port"]

    return 0

def nameToDef(name, type):
    for sensor in sensorTable:
        if sensor["name"] == name:
            return sensor

    for sensor in sensorTable:
        if sensor["type"] == type:
            return sensor

    return None

def normalizePin(pin):
    returnpin = 0
    hadporttype = False

    pin = str(pin)

    if pin.isdigit():
        returnpin = pin
    elif len(pin) >= 2 and pin[0].isalpha() and pin[1:].isdigit():
        returnpin = pin[1:]
    else:
        returnpin = normalizePin(nameToPin(pin))

    return int(returnpin)


def cleanupPin(pin):
        pi.set_mode(pin, pigpio.INPUT)

def changePinState(pin, state):
    pin = normalizePin(pin)

    if pin != 0:
        state = int(state)

        pin_state[pin] = state

        cleanupPin(pin)
        GPIO.setup(pin, GPIO.OUT)
        if state:
            GPIO.output(pin, GPIO.HIGH)
        else:
            GPIO.output(pin, GPIO.LOW)

def getPinState(pin):
    pin = normalizePin(pin)
    state = 0

    try:
        state = pin_state[pin]
    except:
        pass

    return state


def getBuzzerState(pin):
    return getPinState(pin)

def isLedOn(pin=4):
    return getPinState(pin)

def getLedState(pin):
    return getPinState(pin)


def turnLedOn(pin=4):
	changePinState(pin, 1)

def turnLedOff(pin=4):
	changePinState(pin, 0)

def setLedState(pin, state):
    changePinState(pin, state)

def toggleLedState(pin):
    pin = normalizePin(pin)

    GPIO.setup(pin, GPIO.OUT)
    if GPIO.input(pin):
        GPIO.output(pin, GPIO.LOW)
    else:
        GPIO.output(pin, GPIO.HIGH)

def buzzOn(pin):
  changePinState(pin, 1)

def buzzOff(pin):
  changePinState(pin, 0)

def magnetOn(pin):
  changePinState(pin, 1)

def magnetOff(pin):
  changePinState(pin, 0)

def isButtonPressed(pin=None):
    if pin == None:
        pin = "button1"

    pin = normalizePin(pin)

    GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    return GPIO.input(pin)

def waitForButton(pin):
    pin = normalizePin(pin)
    cleanupPin(pin)
    GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    while not GPIO.input(pin):
        time.sleep(0.01)
    time.sleep(0.1) # debounce

def buttonWasPressedCallback(pin):
    button_was_pressed[pin] = 1

def buttonWasPressed(pin):
    pin = normalizePin(pin)
    init = False
    try:
        init = button_interrupt_enabled[pin]
    except:
        pass

    if not init:
        button_interrupt_enabled[pin] = True
        GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        GPIO.add_event_detect(pin, GPIO.FALLING, callback=buttonWasPressedCallback, bouncetime=300)

    wasPressed = 0

    try:
        wasPressed = button_was_pressed[pin]
        button_was_pressed[pin] = 0
    except:
            pass

    return wasPressed

def initVL53():
    global vl53l0x

    try:
        vl53l0x = VL53L0X()
    except:
        vl53l0x = None


def readDistanceVL53(pin):
    global vl53l0x
    distance = 0
    justinit = False

    if vl53l0x == None:
        initVL53()

        if vl53l0x is not None:
            justinit = True

    try:
        distance = vl53l0x.range / 10
    except:
        try:
            if not justinit:
                initVL53()
                distance = vl53l0x.range / 10
        except:
            pass

    return distance

usleep = lambda x: time.sleep(x / 1000000.0)

_TIMEOUT1 = 1000
_TIMEOUT2 = 10000

def readDistanceUltrasonic(pin):
    pin = normalizePin(pin)

    cleanupPin(pin)

    last_value = 0
    try:
        last_value = distance_last_value[pin]
    except:
        pass

    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, GPIO.LOW)
    usleep(2)
    GPIO.output(pin, GPIO.HIGH)
    usleep(10)
    GPIO.output(pin, GPIO.LOW)

    GPIO.setup(pin, GPIO.IN)

    t0 = time.time()
    count = 0
    while count < _TIMEOUT1:
        if GPIO.input(pin):
            break
        count += 1
    if count >= _TIMEOUT1:
        return last_value

    t1 = time.time()
    count = 0
    while count < _TIMEOUT2:
        if not GPIO.input(pin):
            break
        count += 1
    if count >= _TIMEOUT2:
        return last_value

    t2 = time.time()

    dt = int((t1 - t0) * 1000000)
    if dt > 530:
        return last_value

    distance = ((t2 - t1) * 1000000 / 29 / 2)    # cm

    distance = round(distance, 1)

    distance_last_value[pin] = distance

    return distance

def initOLEDScreen():
    global oleddisp
    global oledfont
    global oledimage
    global oleddraw

    if oleddisp == None:
        from luma.core.interface.serial import i2c
        from luma.core.render import canvas
        from luma.oled.device import ssd1306
        from PIL import Image, ImageDraw, ImageFont

        # Reset the screen
        RESET=21
        GPIO.setup(RESET, GPIO.OUT)
        GPIO.output(RESET, 0)
        time.sleep(0.01)
        GPIO.output(RESET, 1)


        serial = i2c(port=1, address=0x3C)
        oleddisp = ssd1306(serial, width=oledwidth, height=oledheight)

        oledfont = ImageFont.load_default()
        oledimage = Image.new('1', (oledwidth, oledheight))
        oleddraw = ImageDraw.Draw(oledimage)

        oleddisp.display(oledimage)

# Address 0x3c
def displayTextOled(line1, line2=""):
    global oleddisp
    global oledfont
    global oledimage
    global oleddraw

    initOLEDScreen()

    # This will allow arguments to be numbers
    line1 = str(line1)

    if line2:
        line2 = str(line2)
    else:
        line2 = ""

    oleddraw.rectangle((0, 0, oledwidth, oledheight), outline=0, fill=0)

    oleddraw.text((0, 0), line1, font=oledfont, fill=255)
    oleddraw.text((0, 15), line2, font=oledfont, fill=255)

    updateScreen()

def autoUpdate(autoupdate):
    global oledautoupdate

    oledautoupdate = bool(autoupdate)

def updateScreen():
    global oleddisp
    global oledimage

    oleddisp.display(oledimage)

fillcolor = 255
strokecolor = 255

def fill(color):
    global fillcolor

    if int(color) > 0:
        fillcolor = 255
    else:
        fillcolor = 0

def noFill():
    global fillcolor
    fillcolor = None

def stroke(color):
    global strokecolor

    if int(color) > 0:
        strokecolor = 255
    else:
        strokecolor = 0

def noStroke():
    global strokecolor
    strokecolor = None

def drawPoint(x, y):
    global oleddraw
    global strokecolor

    initOLEDScreen()

    oleddraw.point((x, y), fill=strokecolor)

    global oledautoupdate
    if oledautoupdate:
        updateScreen()

def drawText(x, y, text):
    global oleddisp
    global oledfont
    global oledimage
    global oleddraw

    initOLEDScreen()

    # This will allow arguments to be numbers
    text = str(text)

    oleddraw.text((x, y), text, font=oledfont, fill=strokecolor)

    updateScreen()


def drawLine(x0, y0, x1, y1):
    global oleddraw
    global strokecolor

    initOLEDScreen()

    oleddraw.line((x0, y0, x1, y1), fill=strokecolor)

    global oledautoupdate
    if oledautoupdate:
        updateScreen()

def drawRectangle(x0, y0, width, height):
    global oleddraw
    global fillcolor
    global strokecolor

    initOLEDScreen()
    oleddraw.rectangle((x0, y0, x0 + width - 1, y0 + height - 1), fill=fillcolor, outline=strokecolor)

    global oledautoupdate
    if oledautoupdate:
        updateScreen()

def drawCircle(x0, y0, diameter):
    global oleddraw
    global fillcolor
    global strokecolor

    initOLEDScreen()

    radius = diameter / 2

    boundx0 = x0 - radius
    boundy0 = y0 - radius

    boundx1 = x0 + radius
    boundy1 = y0 + radius

    oleddraw.ellipse((boundx0, boundy0, boundx1, boundy1), fill=fillcolor, outline=strokecolor)

    global oledautoupdate
    if oledautoupdate:
        updateScreen()

def clearScreen():
    global oleddraw

    initOLEDScreen()

    oleddraw.rectangle((0, 0, oledwidth, oledheight), outline=0, fill=0)

    global oledautoupdate
    if oledautoupdate:
        updateScreen()

def isPointSet(x, y):
    global oleddraw
    global oledimage

    initOLEDScreen()

    pixels = oledimage.load()

    return pixels[x,y] > 0

def displayText16x2(line1, line2=""):
    global screenLine1
    global screenLine2

    if line1 == screenLine1 and line2 == screenLine2:
        return

    screenLine1 = line1
    screenLine2 = line2

    address = 0x3e
    bus = smbus.SMBus(1)

    bus.write_byte_data(address, 0x80, 0x01) #clear
    time.sleep(0.05)
    bus.write_byte_data(address, 0x80, 0x08 | 0x04) # display on, no cursor
    bus.write_byte_data(address, 0x80, 0x28) # two lines
    time.sleep(0.05)

    # This will allow arguments to be numbers
    line1 = str(line1)
    line2 = str(line2)

    count = 0
    for c in line1:
        bus.write_byte_data(address, 0x40, ord(c))
        count += 1
        if count == 16:
            break

    bus.write_byte_data(address, 0x80, 0xc0) # Next line
    count = 0
    for c in line2:
        bus.write_byte_data(address, 0x40, ord(c))
        count += 1
        if count == 16:
            break

def setServoAngle(pin, angle):
    pin = normalizePin(pin)

    if pin != 0:
        servo_angle[pin] = 0

        angle = int(angle)

        if angle < 0:
            angle = 0
        elif angle > 180:
            angle = 180

        pulsewidth = (angle * 11.11) + 500
        pi.set_servo_pulsewidth(pin, pulsewidth)

def getServoAngle(pin):
    pin = normalizePin(pin)
    angle = 0

    try:
        angle = servo_angle[pin]
    except:
        pass

    return angle

def setContinousServoDirection(pin, direction):
    if direction > 0:
        angle = 0
    elif direction < 0:
        angle = 180
    else:
        angle = 90

    setServoAngle(pin, angle)


def readGrovePiADC(pin):
    pin = normalizePin(pin)

    reg = 0x30 + pin
    address = 0x04

    try:
        bus = smbus.SMBus(1)
        bus.write_byte(address, reg)
        return bus.read_word_data(address, reg)
    except:
        return 0


def sleep(sleep_time):
	sleep_time = float(sleep_time)
	time.sleep(sleep_time/1000)

def reportBlockValue(id, state):
    return state


class DHT11Result:
    'DHT11 sensor result returned by DHT11.read() method'

    ERR_NO_ERROR = 0
    ERR_MISSING_DATA = 1
    ERR_CRC = 2

    error_code = ERR_NO_ERROR
    temperature = -1
    humidity = -1

    def __init__(self, error_code, temperature, humidity):
        self.error_code = error_code
        self.temperature = temperature
        self.humidity = humidity

    def is_valid(self):
        return self.error_code == DHT11Result.ERR_NO_ERROR

# Taken from https://github.com/szazo/DHT11_Python
class DHT11:
    'DHT11 sensor reader class for Raspberry'

    __pin = 0

    def __init__(self, pin):
        self.__pin = pin

    def read(self):
        GPIO.setup(self.__pin, GPIO.OUT)

        # send initial high
        self.__send_and_sleep(GPIO.HIGH, 0.05)

        # pull down to low
        self.__send_and_sleep(GPIO.LOW, 0.02)

        # change to input using pull up
        GPIO.setup(self.__pin, GPIO.IN, GPIO.PUD_UP)

        # collect data into an array
        data = self.__collect_input()

        # parse lengths of all data pull up periods
        pull_up_lengths = self.__parse_data_pull_up_lengths(data)

        # if bit count mismatch, return error (4 byte data + 1 byte checksum)
        if len(pull_up_lengths) != 40:
            return DHT11Result(DHT11Result.ERR_MISSING_DATA, 0, 0)

        # calculate bits from lengths of the pull up periods
        bits = self.__calculate_bits(pull_up_lengths)

        # we have the bits, calculate bytes
        the_bytes = self.__bits_to_bytes(bits)

        # calculate checksum and check
        checksum = self.__calculate_checksum(the_bytes)
        if the_bytes[4] != checksum:
            return DHT11Result(DHT11Result.ERR_CRC, 0, 0)

        # ok, we have valid data, return it
        return DHT11Result(DHT11Result.ERR_NO_ERROR, the_bytes[2], the_bytes[0])

    def __send_and_sleep(self, output, sleep):
        GPIO.output(self.__pin, output)
        time.sleep(sleep)

    def __collect_input(self):
        # collect the data while unchanged found
        unchanged_count = 0

        # this is used to determine where is the end of the data
        max_unchanged_count = 100

        last = -1
        data = []
        while True:
            current = GPIO.input(self.__pin)
            data.append(current)
            if last != current:
                unchanged_count = 0
                last = current
            else:
                unchanged_count += 1
                if unchanged_count > max_unchanged_count:
                    break

        return data

    def __parse_data_pull_up_lengths(self, data):
        STATE_INIT_PULL_DOWN = 1
        STATE_INIT_PULL_UP = 2
        STATE_DATA_FIRST_PULL_DOWN = 3
        STATE_DATA_PULL_UP = 4
        STATE_DATA_PULL_DOWN = 5

        state = STATE_INIT_PULL_DOWN

        lengths = [] # will contain the lengths of data pull up periods
        current_length = 0 # will contain the length of the previous period

        for i in range(len(data)):

            current = data[i]
            current_length += 1

            if state == STATE_INIT_PULL_DOWN:
                if current == GPIO.LOW:
                    # ok, we got the initial pull down
                    state = STATE_INIT_PULL_UP
                    continue
                else:
                    continue
            if state == STATE_INIT_PULL_UP:
                if current == GPIO.HIGH:
                    # ok, we got the initial pull up
                    state = STATE_DATA_FIRST_PULL_DOWN
                    continue
                else:
                    continue
            if state == STATE_DATA_FIRST_PULL_DOWN:
                if current == GPIO.LOW:
                    # we have the initial pull down, the next will be the data pull up
                    state = STATE_DATA_PULL_UP
                    continue
                else:
                    continue
            if state == STATE_DATA_PULL_UP:
                if current == GPIO.HIGH:
                    # data pulled up, the length of this pull up will determine whether it is 0 or 1
                    current_length = 0
                    state = STATE_DATA_PULL_DOWN
                    continue
                else:
                    continue
            if state == STATE_DATA_PULL_DOWN:
                if current == GPIO.LOW:
                    # pulled down, we store the length of the previous pull up period
                    lengths.append(current_length)
                    state = STATE_DATA_PULL_UP
                    continue
                else:
                    continue

        return lengths

    def __calculate_bits(self, pull_up_lengths):
        # find shortest and longest period
        shortest_pull_up = 1000
        longest_pull_up = 0

        for i in range(0, len(pull_up_lengths)):
            length = pull_up_lengths[i]
            if length < shortest_pull_up:
                shortest_pull_up = length
            if length > longest_pull_up:
                longest_pull_up = length

        # use the halfway to determine whether the period it is long or short
        halfway = shortest_pull_up + (longest_pull_up - shortest_pull_up) / 2
        bits = []

        for i in range(0, len(pull_up_lengths)):
            bit = False
            if pull_up_lengths[i] > halfway:
                bit = True
            bits.append(bit)

        return bits

    def __bits_to_bytes(self, bits):
        the_bytes = []
        byte = 0

        for i in range(0, len(bits)):
            byte = byte << 1
            if (bits[i]):
                byte = byte | 1
            else:
                byte = byte | 0
            if ((i + 1) % 8 == 0):
                the_bytes.append(byte)
                byte = 0

        return the_bytes

    def __calculate_checksum(self, the_bytes):
        return the_bytes[0] + the_bytes[1] + the_bytes[2] + the_bytes[3] & 255


def readTemperatureDHT11(pin):
    pin = normalizePin(pin)
    haveold = False

    try:
        lasttime = DHT11_last_value[pin]["time"]
        haveold = True
        if time.time() - lasttime < 2:
            return DHT11_last_value[pin]["temperature"]
    except:
        pass


    instance = DHT11(pin=pin)
    result = instance.read()
    if result.is_valid():
        DHT11_last_value[pin] = {
            "time": time.time(),
            "temperature": result.temperature,
            "humidity": result.humidity
        }
        return result.temperature
    elif haveold:
        return DHT11_last_value[pin]["temperature"]

    return 0

def readHumidity(pin):
    pin = normalizePin(pin)
    haveold = False

    try:
        lasttime = DHT11_last_value[pin]["time"]
        haveold = True
        if time.time() - lasttime < 2:
            return DHT11_last_value[pin]["humidity"]
    except:
        pass


    instance = DHT11(pin=pin)
    result = instance.read()
    if result.is_valid():
        DHT11_last_value[pin] = {
            "time": time.time(),
            "temperature": result.temperature,
            "humidity": result.humidity
        }
        return result.humidity
    elif haveold:
        return DHT11_last_value[pin]["humidity"]

    return 0

def currentTime():
    return time.time() * 1000


BMI160_DEVICE_ADDRESS = 0x68
BMI160_REGA_USR_CHIP_ID      = 0x00
BMI160_REGA_USR_ACC_CONF_ADDR     = 0x40
BMI160_REGA_USR_ACC_RANGE_ADDR    = 0x41
BMI160_REGA_USR_GYR_CONF_ADDR     = 0x42
BMI160_REGA_USR_GYR_RANGE_ADDR    = 0x43
BMI160_REGA_CMD_CMD_ADDR          =   0x7e
BMI160_REGA_CMD_EXT_MODE_ADDR     =   0x7f
BMI160_REGA_TEMPERATURE           = 0x20

BMX160_MAGN_CONFIG_ADDR         = (0x44)
BMX160_MAGN_RANGE_ADDR          = (0x4B)
BMX160_MAGN_IF_0_ADDR           = (0x4C)
BMX160_MAGN_IF_1_ADDR           = (0x4D)
BMX160_MAGN_IF_2_ADDR           = (0x4E)
BMX160_MAGN_IF_3_ADDR           = (0x4F)
BMX160_MAGN_ODR_ADDR            = (0x44)

CMD_SOFT_RESET_REG      = 0xb6
CMD_PMU_ACC_SUSPEND     = 0x10
CMD_PMU_ACC_NORMAL      = 0x11
CMD_PMU_ACC_LP1         = 0x12
CMD_PMU_ACC_LP2         = 0x13
CMD_PMU_GYRO_SUSPEND    = 0x14
CMD_PMU_GYRO_NORMAL     = 0x15
CMD_PMU_GYRO_FASTSTART  = 0x17

BMX160_MAGN_NORMAL_MODE               = 0x19
BMX160_MAGN_ODR_25HZ                  = 0x06

BMX160_MAGN_SUSPEND_MODE              = 0x18
BMX160_MAGN_NORMAL_MODE               = 0x19
BMX160_MAGN_LOWPOWER_MODE             = 0x1A

BMI160_USER_DATA_14_ADDR = 0X12 # accel x
BMI160_USER_DATA_15_ADDR = 0X13 # accel x
BMI160_USER_DATA_16_ADDR = 0X14 # accel y
BMI160_USER_DATA_17_ADDR = 0X15 # accel y
BMI160_USER_DATA_18_ADDR = 0X16 # accel z
BMI160_USER_DATA_19_ADDR = 0X17 # accel z

BMI160_USER_DATA_8_ADDR  = 0X0C # gyr x
BMI160_USER_DATA_9_ADDR  = 0X0D # gyr x
BMI160_USER_DATA_10_ADDR = 0X0E # gyr y
BMI160_USER_DATA_11_ADDR = 0X0F # gyr y
BMI160_USER_DATA_12_ADDR = 0X10 # gyr z
BMI160_USER_DATA_13_ADDR = 0X11 # gyr z

BMI160_USER_DATA_0_ADDR  = 0X04 # mag x
BMI160_USER_DATA_1_ADDR  = 0X05 # mag x
BMI160_USER_DATA_2_ADDR  = 0X06 # mag y
BMI160_USER_DATA_3_ADDR  = 0X07 # mag y
BMI160_USER_DATA_4_ADDR  = 0X08 # mag z
BMI160_USER_DATA_5_ADDR  = 0X09 # mag z


def initBMX160Mag():
    bus = smbus.SMBus(1)

    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_CMD_CMD_ADDR, BMX160_MAGN_NORMAL_MODE)
    time.sleep(0.00065) # datasheet says wait for 650microsec
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_0_ADDR, 0x80)
    # put mag into sleep mode
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_3_ADDR, 0x01)
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_2_ADDR, 0x4B)
    # set x-y to regular power preset
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_3_ADDR, 0x04)
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_2_ADDR, 0x51)
    # set z to regular preset
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_3_ADDR, 0x0E)
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_2_ADDR, 0x52)
    # prepare MAG_IF[1-3] for mag_if data mode
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_3_ADDR, 0x02)
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_2_ADDR, 0x4C)
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_1_ADDR, 0x42)
    # Set ODR to 25 Hz
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_ODR_ADDR, BMX160_MAGN_ODR_25HZ)
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMX160_MAGN_IF_0_ADDR, 0x00)
    # put in low power mode.
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_CMD_CMD_ADDR, BMX160_MAGN_NORMAL_MODE)


def initBMI160():
    global isBMX160

    bus = smbus.SMBus(1)
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_USR_ACC_CONF_ADDR, 0x25)
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_USR_ACC_RANGE_ADDR, 0x5)
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_USR_GYR_CONF_ADDR, 0x26)
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_USR_GYR_RANGE_ADDR, 0x1)

    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_CMD_CMD_ADDR, CMD_SOFT_RESET_REG)

    time.sleep(0.1)
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_CMD_CMD_ADDR, CMD_PMU_ACC_NORMAL) # Enable ACCEL
    time.sleep(0.0038)
    bus.write_byte_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_CMD_CMD_ADDR, CMD_PMU_GYRO_NORMAL)  ## Enable Gyro
    time.sleep(0.080)

    chipid = bus.read_i2c_block_data(0x68, 0x00, 1)

    try:
        isBMX160 = chipid[0] == 216
    except:
        pass

    if isBMX160:
        initBMX160Mag()
    

def readAccelBMI160():
    global enabledBMI160

    try:
        if not enabledBMI160:
            enabledBMI160 = True
            initBMI160()

        bus = smbus.SMBus(1)
        acc_value = bus.read_i2c_block_data(BMI160_DEVICE_ADDRESS, BMI160_USER_DATA_14_ADDR, 6)
        acc_x =  (acc_value[1] << 8) | acc_value[0]
        acc_y =  (acc_value[3] << 8) | acc_value[2]
        acc_z =  (acc_value[5] << 8) | acc_value[4]

        if acc_x & 0x8000 != 0:
            acc_x -= 1 << 16

        if acc_y & 0x8000 != 0:
            acc_y -= 1 << 16

        if acc_z & 0x8000 != 0:
            acc_z -= 1 << 16

        acc_x = float(acc_x)  / 16384.0 * 9.81;
        acc_y = float(acc_y)  / 16384.0 * 9.81;
        acc_z = float(acc_z) / 16384.0 * 9.81;

        return [round(acc_x, 1), round(acc_y, 1), round(acc_z, 1)]
    except:
        enabledBMI160 = False
        return [0, 0, 0]

def readAcceleration(axis):
    acceleration = readAccelBMI160()

    if axis.lower() == "x":
        return acceleration[0]
    elif axis.lower() == "y":
        return acceleration[1]
    elif axis.lower() == "z":
        return acceleration[2]

    return 0

def computeRotation(rotationType):
    acceleration = readAccelBMI160()
    zsign = 1

    if acceleration[2] < 0:
        zsign = -1

    if rotationType.lower() == "pitch":
        pitch = 180 * math.atan2 (acceleration[0], zsign * math.sqrt(acceleration[1]*acceleration[1] + acceleration[2]*acceleration[2]))/math.pi

        return int(pitch)
    elif rotationType.lower() == "roll":
        roll = 180 * math.atan2 (acceleration[1], zsign * math.sqrt(acceleration[0]*acceleration[0] + acceleration[2]*acceleration[2]))/math.pi

        return int(roll)

    return 0



def readGyroBMI160():
    global enabledBMI160

    try:
        if not enabledBMI160:
            enabledBMI160 = True
            initBMI160()

        bus = smbus.SMBus(1)
        value = bus.read_i2c_block_data(BMI160_DEVICE_ADDRESS, BMI160_USER_DATA_8_ADDR, 15)
        x =  (value[1] << 8) | value[0]
        y =  (value[3] << 8) | value[2]
        z =  (value[5] << 8) | value[4]

        time = (value[14] << 16) | (value[13] << 8) | value[12]

        if x & 0x8000 != 0:
            x -= 1 << 16

        if y & 0x8000 != 0:
            y -= 1 << 16

        if z & 0x8000 != 0:
            z -= 1 << 16

        x = float(x)  * 0.030517578125;
        y = float(y)  * 0.030517578125;
        z = float(z)  * 0.030517578125;

        return [x, y, z, time]
    except:
        enabledBMI160 = False
        return [0, 0, 0]

def twos_comp(val, bits):
        # Calculate the 2s complement of int:val #
        if(val&(1<<(bits-1)) != 0):
                val = val - (1<<bits)
        return val

def readTemperatureBMI160(pin):
    global enabledBMI160

    try:
        if not enabledBMI160:
            enabledBMI160 = True
            initBMI160()

        bus = smbus.SMBus(1)
        temp_value = bus.read_i2c_block_data(BMI160_DEVICE_ADDRESS, BMI160_REGA_TEMPERATURE, 2)


        temp = twos_comp(temp_value[1] << 8 | temp_value[0], 16)

        temp = (temp * 0.0019073486328125) + 22.5

#        if temp & 0x8000:
            #temp = (23.0 - ((0x10000 - temp)/512.0));
#        else:
#            temp = ((temp/512.0) + 23.0);

        return temp
    except:
        enabledBMI160 = False
        return 0

ACC_I2C_ADDR = 0x1D
MAG_I2C_ADDR = 0x1E

CTRL_REG1               = 0x20
CTRL_REG2               = 0x21
CTRL_REG3               = 0x22
CTRL_REG4               = 0x23
CTRL_REG5               = 0x24

CTRL_REG1_A = 0x20
CTRL_REG2_A = 0x21
CTRL_REG3_A = 0x22
CTRL_REG4_A = 0x23
CTRL_REG5_A = 0x24
CTRL_REG6_A = 0x25
CTRL_REG7_A = 0x26

MAG_OUTX_L     = 0x28
MAG_OUTX_H     = 0x29
MAG_OUTY_L     = 0x2A
MAG_OUTY_H     = 0x2B
MAG_OUTZ_L     = 0x2C
MAG_OUTZ_H     = 0x2D


def initLSM303C():
    bus = smbus.SMBus(1)

    ## Magnetometer
    bus.write_byte_data(MAG_I2C_ADDR, CTRL_REG1, 0x7E) # X, Y High performace, Data rate 80hz
    bus.write_byte_data(MAG_I2C_ADDR, CTRL_REG4, 0x0C) # Z High performace
    bus.write_byte_data(MAG_I2C_ADDR, CTRL_REG5, 0x40)
    bus.write_byte_data(MAG_I2C_ADDR, CTRL_REG3, 0x00)

    ## Accelerometer
    bus.write_byte_data(ACC_I2C_ADDR, CTRL_REG5_A, 0x40)
    time.sleep(0.05)
    bus.write_byte_data(ACC_I2C_ADDR, CTRL_REG4_A, 0x0C)
    bus.write_byte_data(ACC_I2C_ADDR, CTRL_REG1_A, 0xBF) # High resolution, 100Hz output, enable all three axis


def readMagnetometerLSM303C(allowcalibration=True, calibratedvalues=True):
    global enabledLSM303C
    global compassOffset
    global compassScale
    global enabledBMI160
    global isBMX160

    try:
        if not enabledBMI160:
            initBMI160()
            enabledBMI160 = True

        if not isBMX160:
            if not enabledLSM303C:
                enabledLSM303C = True
                initLSM303C()

        if compassOffset is None or compassScale is None:
            loadCompassCalibration()

        if allowcalibration:
            if compassOffset is None or compassScale is None:
                calibrateCompassGame()

        bus = smbus.SMBus(1)

        if isBMX160:
            value = bus.read_i2c_block_data(BMI160_DEVICE_ADDRESS, BMI160_USER_DATA_0_ADDR, 6)
        else:
            value = bus.read_i2c_block_data(MAG_I2C_ADDR, MAG_OUTX_L, 6)

        X =  twos_comp((value[1] << 8) | value[0], 16)
        Y =  twos_comp((value[3] << 8) | value[2], 16)
        Z =  twos_comp((value[5] << 8) | value[4], 16)

        X = X * 0.048828125
        Y = Y * 0.048828125
        Z = Z * 0.048828125

        if (compassOffset is not None) and (compassScale is not None) and calibratedvalues:
            X = round((X + compassOffset[0]) * compassScale[0], 0)
            Y = round((Y + compassOffset[1]) * compassScale[1], 0)
            Z = round((Z + compassOffset[2])* compassScale[2], 0)

        return [X, Y, Z]
    except:
        enabledLSM303C = False
        return [0, 0, 0]

def computeCompassHeading():
    values = readMagnetometerLSM303C()

    heading = math.atan2(values[0],values[1])*(180/math.pi) + 180

    return heading


def reaAccelerometerLSM303C():
    global enabledLSM303C

    try:
        if not enabledLSM303C:
            enabledLSM303C = True
            initLSM303C()

        bus = smbus.SMBus(1)

        value = bus.read_i2c_block_data(ACC_I2C_ADDR, MAG_OUTX_L, 6)

        X =  twos_comp((value[1] << 8) | value[0], 16)
        Y =  twos_comp((value[3] << 8) | value[2], 16)
        Z =  twos_comp((value[5] << 8) | value[4], 16)

        X = round(X * 0.00059814453125, 2)
        Y = round(Y * 0.00059814453125, 2)
        Z =  round(Z * 0.00059814453125, 2)

        return [X, Y, Z]
    except:
        enabledLSM303C = False
        return [0, 0, 0]

def readMagneticForce(axis):
    maneticforce = readMagnetometerLSM303C()

    if axis.lower() == "x":
        return maneticforce[0]
    elif axis.lower() == "y":
        return maneticforce[1]
    elif axis.lower() == "z":
        return maneticforce[2]

    return 0


def readStick(pinup, pindown, pinleft, pinright, pincenter):
    pinup = normalizePin(pinup)
    pindown = normalizePin(pindown)
    pinleft = normalizePin(pinleft)
    pinright = normalizePin(pinright)
    pincenter = normalizePin(pincenter)


    GPIO.setup(pinup, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(pindown, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(pinleft, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(pinright, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(pincenter, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

    return [GPIO.input(pinup),
            GPIO.input(pindown),
            GPIO.input(pinleft),
            GPIO.input(pinright),
            GPIO.input(pincenter)]

def setInfraredState(pin, state):
    pin = normalizePin(pin)

    if pin != 0:
        state = int(state)

        cleanupPin(pin)

        pi.set_mode(pin, pigpio.OUTPUT)

        pi.wave_clear()
        pi.wave_tx_stop()

        if state:
            wf = []

            wf.append(pigpio.pulse(1<<pin, 0, 13))
            wf.append(pigpio.pulse(0, 1<<pin, 13))

            pi.wave_add_generic(wf)

            a = pi.wave_create()

            pi.wave_send_repeat(a)

def changeActiveBuzzerState(pin, state):
    changePinState(pin, state)


def changePassiveBuzzerState(pin, state):
    pin = normalizePin(pin)
    laststate = 255

    try:
        laststate = passive_buzzer_last_value[pin]
    except:
        pass

    state = int(state)

    pin_state[pin] = state
    if state != laststate:
        passive_buzzer_last_value[pin] = state
        pi.set_mode(pin, pigpio.OUTPUT)

        pi.wave_clear()
        pi.wave_tx_stop()

        if state:
            wf = []

            wf.append(pigpio.pulse(1<<pin, 0, 500))
            wf.append(pigpio.pulse(0, 1<<pin, 500))

            pi.wave_add_generic(wf)

            a = pi.wave_create()

            pi.wave_send_repeat(a)
        else:
            GPIO.setup(pin, GPIO.OUT)
            GPIO.output(pin, GPIO.LOW)



def getBuzzerNote(pin):
    pin = normalizePin(pin)
    frequency = 0

    try:
        frequency = buzzer_frequency[pin]
    except:
        pass

    return frequency


def setLedBrightness(pin, level):
    pin = normalizePin(pin)

    if level > 1:
        level = 1

    led_brightness [pin] = level

    pi.set_mode(pin, pigpio.OUTPUT)

    pi.set_mode(pin, pigpio.OUTPUT)
    pi.set_PWM_frequency(pin,1000)
    pi.set_PWM_range(pin, 4000)

    dutycycle = int(4000 * level);
    pi.set_PWM_dutycycle(pin, dutycycle)

def getLedBrightness(pin):
    pin = normalizePin(pin)
    level = 0

    try:
        level = led_brightness[pin]
    except:
        pass

    return level


def readADCADS1015(pin, gain=1):
    ADS1x15_CONFIG_GAIN = {
        2/3: 0x0000, # +/- 6.144V
        1:   0x0200, # +/- 4.096v
        2:   0x0400, # +/- 2.048v
        4:   0x0600, # +/- 1.024v
        8:   0x0800, # +/- 0.512v
        16:  0x0A00 # +/- 0.256v
    }

    ADS1x15_GAIN_MAX_VOLTAGE = {
        2/3: 6.144,
        1:   4.096,
        2:   2.048,
        4:   1.024,
        8:   0.512,
        16:  0.256
    }


    ADS1015_CONFIG_DR = {
        128:   0x0000,
        250:   0x0020,
        490:   0x0040,
        920:   0x0060,
        1600:  0x0080,
        2400:  0x00A0,
        3300:  0x00C0
    }

    ADS1x15_CONFIG_MUX_OFFSET      = 12
    ADS1x15_CONFIG_OS_SINGLE       = 0x8000
    ADS1x15_CONFIG_MODE_SINGLE      = 0x0100
    ADS1x15_CONFIG_COMP_QUE_DISABLE = 0x0003
    ADS1x15_POINTER_CONFIG = 0x01
    ADS1x15_POINTER_CONVERSION     = 0x00
    ADS1x15_CONFIG_MODE_CONTINUOUS  = 0x0000

    bus = smbus.SMBus(1)

    address = 0x48

    pin = normalizePin(pin)

    mux = pin + 0x04
    gainbits = ADS1x15_CONFIG_GAIN[gain]
    data_rate = 0x00C0 #3.3ksps

    config = ADS1x15_CONFIG_OS_SINGLE
    config |= (mux & 0x07) << ADS1x15_CONFIG_MUX_OFFSET
    config |= gainbits
    config |= ADS1x15_CONFIG_MODE_CONTINUOUS
    config |= data_rate
    config |= ADS1x15_CONFIG_COMP_QUE_DISABLE

    value = 0

    try:
        bus.write_i2c_block_data(address, ADS1x15_POINTER_CONFIG, [(config >> 8) & 0xFF, config & 0xFF])

        time.sleep(0.001)

        result = bus.read_i2c_block_data(address, ADS1x15_POINTER_CONVERSION, 2)

        value = twos_comp(result[0] << 8 | result[1], 16)

        max = ADS1x15_GAIN_MAX_VOLTAGE[gain];

        # Normalize the value so that 0v is 0 and 3.3v is 999
        value = value / (32768. / max  * 3.3 / 1000.)

        if value < 0:
            value = 0

        if value > 999:
            value = 999
    except:
        pass

    return value


def readSoundLevel(pin):
    pin = normalizePin(pin)
    max = -25000
    min = 25000

    for i in range(20):
        val = int(readADCADS1015(pin, 16))

        if val > max:
            max = val

        if val < min:
            min = val

    return max - min

adcHandler = [
    {
        "type": "grovepi",
        "handler": readGrovePiADC
    },
    {
        "type": "ads1015",
        "handler": readADCADS1015
    }
]


def readADC(pin):
    try:
        for handler in adcHandler:
            if handler["type"] == currentADC:
                return handler["handler"](pin)
    except:
        pass

    return 0

def readTemperatureGroveAnalog(pin):
    B = 4275.
    R0 = 100000.

    val = readADC(pin)

    if val == 0:
        return 0

    r = 1000. / val - 1.
    r = R0 * r

    return round(1. / (math.log10(r / R0) / B + 1 / 298.15) - 273.15, 1)


def readRotaryAngle(pin):
	return int(readADC(pin) / 10)

def readSoundSensor(pin):
	return int(readADC(pin) / 10)

def readLightIntensity(pin):
	return int((readADC(pin) + 1)/ 10)

sensorHandler = [
    {
        "type": "screen",
        "subType": "oled128x32",
        "handler": displayTextOled
    },
    {
        "type": "screen",
        "subType": "16x2lcd",
        "handler": displayText16x2
    },
    {
        "type": "range",
        "subType": "vl53l0x",
        "handler": readDistanceVL53
    },
    {
        "type": "range",
        "subType": "ultrasonic",
        "handler": readDistanceUltrasonic
    },
    {
        "type": "temperature",
        "subType": "BMI160",
        "handler": readTemperatureBMI160
    },
    {
        "type": "temperature",
        "subType": "groveanalog",
        "handler": readTemperatureGroveAnalog
    },
    {
        "type": "temperature",
        "subType": "DHT11",
        "handler": readTemperatureDHT11
    },
    {
        "type": "buzzer",
        "subType": "passive",
        "handler": changePassiveBuzzerState
    },
    {
        "type": "buzzer",
        "subType": "active",
        "handler": changeActiveBuzzerState
    },
]

def nameToHandler(name, type):
    sensor =  nameToDef(name, "range")

    if sensor is not None:
        for handler in sensorHandler:
            if handler["type"] == type and "subType" in sensor and handler["subType"] == sensor["subType"]:
                return [sensor, handler["handler"]]
    return None


def readDistance(name):
    ret =  nameToHandler(name, "range")

    if ret is not None:
        sensor = ret[0]
        handler = ret[1]

        return handler(name)

    return 0


def displayText(line1, line2=""):
    ret =  nameToHandler("screen1", "screen")
    sensor =  nameToDef("screen1", "screen")

    if ret is not None:
        sensor = ret[0]
        handler = ret[1]

        return handler(line1, line2)

def displayText2Lines(line1, line2=""):
    return displayText(line1, line2)

def readTemperature(name):
    ret =  nameToHandler(name, "temperature")

    if ret is not None:
        sensor = ret[0]
        handler = ret[1]

        return round(handler(name), 1)

    return 0

def setBuzzerState(name, state):
    ret =  nameToHandler(name, "buzzer")

    pin = normalizePin(name)
    pin_state[pin] = state
    if ret is not None:
        sensor = ret[0]
        handler = ret[1]

        return handler(name, state)

    return 0

def setBuzzerNote(pin, frequency):
    pin = normalizePin(pin)

    pi.set_mode(pin, pigpio.OUTPUT)

    buzzer_frequency [pin] = level

    pi.wave_clear()
    pi.wave_tx_stop()

    wf = []

    if frequency == 0:
        pi.wave_tx_stop()
        GPIO.setup(pin, GPIO.OUT)
        GPIO.output(pin, GPIO.LOW)
    else:
        delay = int(1000000/frequency/2)

        wf.append(pigpio.pulse(1<<pin, 0, delay))
        wf.append(pigpio.pulse(0, 1<<pin, delay))

        pi.wave_add_generic(wf)

        a = pi.wave_create()

        pi.wave_send_repeat(a)

def turnBuzzerOn(pin=12):
    setBuzzerState("buzzer1", 1)

def turnBuzzerOff(pin=12):
    setBuzzerState("buzzer1", 0)

def isBuzzerOn(pin=12):
    pin = normalizePin(pin)
    state = 0

    try:
        state = pin_state[pin]
    except:
        pass

    return state


def setBuzzerAudioOutput(value):
    if value:
        pi.set_mode(12, pigpio.ALT0) # 12 is PWM0
    else:
        pi.set_mode(12, pigpio.ALT1) # 12 normal


def getBuzzerAudioOutput():
    if pi.get_mode(12) == pigpio.ALT0:
        return 1

    return 0


def dSquared(c, s):
    dx = c[0] - s[0]
    dy = c[1] - s[1]
    dz = c[2] - s[2]

    return (dx*dx) + (dy*dy) + (dz*dz)

def measureScore(c, data):
	minD = 0
	maxD = 0

	minD = maxD = dSquared(c, data[0])
	for row in data[1:]:
		d = dSquared(c, row)

		if d < minD:
			minD = d

		if d > maxD:
			maxD = d

	return maxD - minD

def spherify(centre, data):
	radius = 0
	scaleX = 0.0
	scaleY = 0.0
	scaleZ = 0.0

	scale = 0.0
	weightX = 0.0
	weightY = 0.0
	weightZ = 0.0

	for row in data:
		d = math.sqrt(dSquared(centre, row))

	if d > radius:
		radius = d

	# Now, for each data point, determine a scalar multiplier for the vector between the centre and that point that
	# takes the point onto the surface of the enclosing sphere.
	for row in data:
		# Calculate the distance from this point to the centre of the sphere
		d = math.sqrt(dSquared(centre, row))

		# Now determine a scalar multiplier that, when applied to the vector to the centre,
                # will place this point on the surface of the sphere.
		s = (radius / d) - 1

		scale = max(scale, s)

                # next, determine the scale effect this has on each of our components.
		dx = (row[0] - centre[0])
		dy = (row[1] - centre[1])
		dz = (row[2] - centre[2])

		weightX += s * abs(dx / d)
		weightY += s * abs(dy / d)
		weightZ += s * abs(dz / d)

	wmag = math.sqrt((weightX * weightX) + (weightY * weightY) + (weightZ * weightZ))

	scaleX = 1.0 + scale * (weightX / wmag)
	scaleY = 1.0 + scale * (weightY / wmag)
	scaleZ = 1.0 + scale * (weightZ / wmag)

	scale = [0, 0, 0]
	scale[0] = int((1024 * scaleX))
	scale[1] = int((1024 * scaleY))
	scale[2] = int((1024 * scaleZ))

	centre[0] = centre[0]
	centre[1] = centre[1]
	centre[2] = centre[2]

	return [scale, centre, radius]

def approximateCentre(data):
	samples = len(data)
	centre = [0, 0, 0]

	for row in data:
		for i in range(3):
			centre[i] = centre[i] + row[i]

	for i in range(3):
		centre[i] = int(centre[i] / samples)


	#print("centre", centre)

	c = centre
	best = [0, 0, 0]
	t = [0, 0,0]
	score = measureScore(c, data)
	#print("initial score", score)
	CALIBRATION_INCREMENT = 10
	while True:
		for x in range(-CALIBRATION_INCREMENT, CALIBRATION_INCREMENT + CALIBRATION_INCREMENT, CALIBRATION_INCREMENT):
			for y in range(-CALIBRATION_INCREMENT, CALIBRATION_INCREMENT + CALIBRATION_INCREMENT, CALIBRATION_INCREMENT):
				for z in range(-CALIBRATION_INCREMENT, CALIBRATION_INCREMENT + CALIBRATION_INCREMENT, CALIBRATION_INCREMENT):
					t = c
					t[0] += x
					t[1] += y
					t[2] += z
					s = measureScore(t, data)
					#print("try", t, "score", s)
					if (s < score):
						score = s
						best = t
						print(best)


		if (best[0] == c[0]) and (best[1] == c[1]) and (best[2] == c[2]):
			#print("best is equal to centre", best, c)
			break

		#print(best)
		c = best

	return c


def calibrateCompass(data):
    centre = approximateCentre(data)
    return spherify(centre, data)

def loadCompassCalibration():
    offset = None
    scale = None
    try:
        f = open("/mnt/data/compasscalibration.txt", 'r')
        x = f.readline()
        f.close()

        values = x.split(",")

        if len(values) == 6:
            offset = [float(values[0]), float(values[1]), float(values[2])]
            scale = [float(values[3]), float(values[4]), float(values[5])]

        if offset is not None and scale is not None:
            global compassOffset
            global compassScale

            compassOffset = offset
            compassScale = scale

            return [offset, scale]
    except:
        pass

    return None

def saveCompassCalibration(scale, offset):
    f = open("/mnt/data/compasscalibration.txt", "w+")

    f.write(str(offset[0]) + ","
             + str(offset[1]) + ","
             + str(offset[2]) + ","
             + str(scale[0]) + ","
             + str(scale[1]) + ","
             + str(scale[2]) + "\\n")

    f.close()

def calibrateCompassGame():
    n = 7
    scale = 4

    rect = [[0 for x in range(n)] for y in range(n)]

    autoUpdate(False)

    done = False
    rect_offset_x = 97
    rect_offset_y = 1

    fill(1)
    drawText(0, 0, "Rotate the board")

    stroke(1)
    fill(0)
    drawRectangle(rect_offset_x - 1, rect_offset_y - 1, (n * scale) + 2, (n * scale) + 2)
    updateScreen()

    cursor_color = 0

    data = []

    start = time.time()
    while not done and (time.time() - start) < 30:
        magvalues =  readMagnetometerLSM303C(False, False)
        if isBMX160:
            accelvalues = readAccelBMI160()
        else:
            accelvalues =  reaAccelerometerLSM303C()
        
        x_accel = accelvalues[0]
        y_accel = accelvalues[1]

        data.append(magvalues)

        x_rect = int((x_accel + 1) * (n / 2))
        y_rect = int((y_accel + 1) * (n / 2))

        if (x_rect >= n):
            x_rect = n - 1
        if (x_rect < 0):
            x_rect = 0

        if (y_rect >= n):
            y_rect = n - 1
        if (y_rect < 0):
            y_rect = 0

        rect[x_rect][y_rect] = 1

	    #print(x_rect, x_accel, y_rect, y_accel)

        done = True # Asume we are done
        for x in range(n):
            for y in range(n):
                if rect[x][y] == 0:
                    done = False
                stroke(rect[x][y])
                fill(rect[x][y])

                if x_rect == x and y_rect == y:
                    fill(cursor_color)
                    stroke(cursor_color)
                    if cursor_color == 1:
                        cursor_color = 0
                    else:
                        cursor_color = 1

                drawRectangle((x * scale) + rect_offset_x,
					        (y * scale) + rect_offset_y,
                            scale, scale)
        updateScreen()

    result = calibrateCompass(data)

    saveCompassCalibration(result[0], result[1])

    global compassOffset
    global compassScale

    compassOffset = result[0]
    compassScale = result[1]

gyro_angles = [0, 0, 0]
gyro_calibration = [0, 0, 0]
stop_gyro = False
gyro_thread = None
gyro_angles_lock = None

def setGyroZeroAngle():
    global angles
    global calibration
    global gyro_thread
    global gyro_angles_lock

    if gyro_thread is None:
        gyro_angles = [0, 0, 0]
        calibrationsamples = 500
        samples = 0
        while samples < calibrationsamples:
            values = readGyroBMI160()

            gyro_calibration[0] += values[0]
            gyro_calibration[1] += values[1]
            gyro_calibration[2] += values[2]
            samples += 1

        gyro_calibration[0] /= samples
        gyro_calibration[1] /= samples
        gyro_calibration[2] /= samples

        gyro_angles_lock = threading.Lock()

        gyro_thread = threading.Thread(target=gyroThread)
        gyro_thread.start()
    else:
        gyro_angles_lock.acquire(True)
        angles = [0, 0, 0]
        gyro_angles_lock.release()


def computeRotationGyro():
    global gyro_angles

    return [int(gyro_angles[0]), int(gyro_angles[1]), int(gyro_angles[2])]

def gyroThread():
    global gyro_angles
    global gyro_calibration
    global stop_gyro

    lasttime = readGyroBMI160()[3]
    start = time.time()

    while True:
        if stop_gyro:
            break
        values = readGyroBMI160()

        dt = (values[3] - lasttime) * 3.9e-5
        lasttime = values[3]

        gyro_angles_lock.acquire(True)
        gyro_angles[0] += (values[0] - gyro_calibration[0]) * dt
        gyro_angles[1] += (values[1] - gyro_calibration[1]) * dt
        gyro_angles[2] += (values[2] - gyro_calibration[2]) * dt
        gyro_angles_lock.release()
     
# Begin getTemperatureFromCloud
   
getTemperatureCloudUrl = "https://cloud.quick-pi.org/cache/weather.php"

def _getTemperatureSupportedTowns():
    import requests
    import json

    return json.loads(requests.get(getTemperatureCloudUrl + "?q=supportedtowns").text)

getTemperatureSupportedTowns = _getTemperatureSupportedTowns()

getTemperatureCache = {}

def getTemperatureFromCloud(town):
    import requests
    import time
    current_milli_time = lambda: int(round(time.time() * 1000))

    if not town in getTemperatureSupportedTowns:
        return "Not supported"

    if town in getTemperatureCache:
        # lower than 10 minutes
        if ((current_milli_time() - getTemperatureCache[town]["lastUpdate"]) / 1000) / 60 < 10:
            return getTemperatureCache[town]["temperature"]

    ret = requests.get(getTemperatureCloudUrl + "?q=" + town).text

    getTemperatureCache[town] = {}
    getTemperatureCache[town]["lastUpdate"] = current_milli_time()
    getTemperatureCache[town]["temperature"] = ret

    return ret

# End getTemperatureFromCloud

quickpi_cloudstoreurl = 'http://cloud.quick-pi.org'
quickpi_cloudstoreid = ""
quickpi_cloudstorepw = ""

def connectToCloudStore(identifier, password):
        global quickpi_cloudstoreid
        global quickpi_cloudstorepw

        quickpi_cloudstoreid = identifier
        quickpi_cloudstorepw = password

def writeToCloudStore(identifier, key, value):
        import requests
        import json

        global quickpi_cloudstoreid
        global quickpi_cloudstorepw

        data = { "prefix": identifier,
                "password": quickpi_cloudstorepw,
                "key": key,
                "value": json.dumps(value) }

        ret = requests.post(quickpi_cloudstoreurl + '/api/data/write', data = data)

        pass

def readFromCloudStore(identifier, key):
        import requests
        import json

        value = 0
        data = {'prefix': identifier, 'key': key};

        ret = requests.post(quickpi_cloudstoreurl + '/api/data/read', data = data)

        #print (ret.json())
        if ret.json()["success"]:
                try:
                        value = json.loads(ret.json()["value"])
                except:
                        value = ret.json()["value"]

        return value

def getNodeID():
    return nodeId

def getNeighbors():
    import json
    import requests
    global nodeId

    ret = requests.post('http://localhost:5000/api/v1/getNeighbors/{}'.format(nodeId))

    return ret.json()
    

def getNextMessage():
    import requests
    global nodeId
    while True:
        ret = requests.post('http://localhost:5000/api/v1/getNextMessage/{}'.format(nodeId))
        returnData = ret.json()
        if returnData["hasmessage"]:
            print(returnData["hasmessage"])
            return returnData["value"]
    
        time.sleep(1)

def sendMessage(toNodeId, message):
    import requests
    global nodeId
    data = {'fromId': nodeId,
            'message': message }

    ret = requests.post('http://localhost:5000/api/v1/sendMessage/{}'.format(toNodeId), json = data)

def submitAnswer(answer):
    import requests
    global nodeId
    data = { 'answer': answer }

    ret = requests.post('http://localhost:5000/api/v1/submitAnswer/{}'.format(nodeId), json = data)

    print(ret)

last_tick = 0
in_code = False
code = []
fetching_code = False
IRGPIOTRANS = 22
IRGPIO = 23
POST_MS = 15
POST_US    = POST_MS * 1000
PRE_MS     = 200
PRE_US     = PRE_MS  * 1000
SHORT = 10
TOLERANCE  = 25
TOLER_MIN =  (100 - TOLERANCE) / 100.0
TOLER_MAX =  (100 + TOLERANCE) / 100.0
GLITCH = 250
FREQ = 38.0
GAP_MS     = 100
GAP_S      = GAP_MS  / 1000.0


installed_callback = False

IR_presets = {}

def IR_compare(p1, p2):
   """
   Check that both recodings correspond in pulse length to within
   TOLERANCE%.  If they do average the two recordings pulse lengths.

   Input

        M    S   M   S   M   S   M    S   M    S   M
   1: 9000 4500 600 560 600 560 600 1700 600 1700 600
   2: 9020 4570 590 550 590 550 590 1640 590 1640 590

   Output

   A: 9010 4535 595 555 595 555 595 1670 595 1670 595
   """
   if len(p1) != len(p2):
      return False

   for i in range(len(p1)):
      v = p1[i] / p2[i]
      if (v < TOLER_MIN) or (v > TOLER_MAX):
         return False

   for i in range(len(p1)):
       p1[i] = int(round((p1[i]+p2[i])/2.0))

   return True

def IR_normalise(c):
   entries = len(c)
   p = [0]*entries # Set all entries not processed.
   for i in range(entries):
      if not p[i]: # Not processed?
         v = c[i]
         tot = v
         similar = 1.0

         # Find all pulses with similar lengths to the start pulse.
         for j in range(i+2, entries, 2):
            if not p[j]: # Unprocessed.
               if (c[j]*TOLER_MIN) < v < (c[j]*TOLER_MAX): # Similar.
                  tot = tot + c[j]
                  similar += 1.0

         # Calculate the average pulse length.
         newv = round(tot / similar, 2)
         c[i] = newv

         # Set all similar pulses to the average value.
         for j in range(i+2, entries, 2):
            if not p[j]: # Unprocessed.
               if (c[j]*TOLER_MIN) < v < (c[j]*TOLER_MAX): # Similar.
                  c[j] = newv
                  p[j] = 1

def IR_end_of_code():
   global code, fetching_code, SHORT
   if len(code) > SHORT:
      IR_normalise(code)
      fetching_code = False
   else:
      code = []

def IR_callback(gpio, level, tick):
    global last_tick, in_code, code, fetching_code, IRGPIO, POST_MS, POST_US, PRE_US

    if level != pigpio.TIMEOUT:
        edge = pigpio.tickDiff(last_tick, tick)
        last_tick = tick

        if fetching_code:
            if (edge > PRE_US) and (not in_code): # Start of a code.
                in_code = True
                pi.set_watchdog(IRGPIO, POST_MS) # Start watchdog.

            elif (edge > POST_US) and in_code: # End of a code.
                in_code = False
                pi.set_watchdog(IRGPIO, 0) # Cancel watchdog.
                IR_end_of_code()

            elif in_code:
                code.append(edge)

    else:
        pi.set_watchdog(IRGPIO, 0) # Cancel watchdog.
        if in_code:
            in_code = False
            IR_end_of_code()

def readIRMessageCode(sensorname, timeout):
    global IRGPIO, fetching_code, code, installed_callback, GLITCH

    if not installed_callback:
        pi.set_mode(IRGPIO, pigpio.INPUT) # IR RX connected to this GPIO.
        pi.set_glitch_filter(IRGPIO, GLITCH) # Ignore glitches.
        cb = pi.callback(IRGPIO, pigpio.EITHER_EDGE, IR_callback)

        installed_callback = True

    fetching_code = True

    start = time.time()
    while fetching_code:
        time.sleep(0.1)
        if time.time() - start > timeout/1000:
            break

    returncode = code
    code = []
    return returncode

def readIRMessage(remotecode, timeout):
    start = time.time()

    while time.time() - start < timeout / 1000:
        code = readIRMessageCode(remotecode, timeout)

        for presetname, presetcode in IR_presets.items():
            if IR_compare(presetcode, code):
                return presetname

    return ""

def IR_carrier(gpio, frequency, micros):
    """
    Generate carrier square wave.
    """
    wf = []
    cycle = 1000.0 / frequency
    cycles = int(round(micros/cycle))
    on = int(round(cycle / 2.0))
    sofar = 0
    for c in range(cycles):
       target = int(round((c+1)*cycle))
       sofar += on
       off = target - sofar
       sofar += off
       wf.append(pigpio.pulse(1<<gpio, 0, on))
       wf.append(pigpio.pulse(0, 1<<gpio, off))
    return wf
 
def sendIRMessage(sensorname, name):
    global IRGPIOTRANS, FREQ

    try:
        time.sleep(0.20) ## FIXME I need this otherwise this won't work if I read the distance sensor first ...
        pi.set_mode(IRGPIOTRANS, pigpio.OUTPUT)
        pi.wave_add_new()

        emit_time = time.time()

        code = IR_presets[name]

        marks_wid = {}
        spaces_wid = {}

        wave = [0]*len(code)

        for i in range(0, len(code)):
            ci = int(code[i])
            if i & 1: # Space
                if ci not in spaces_wid:
                    pi.wave_add_generic([pigpio.pulse(0, 0, ci)])
                    spaces_wid[ci] = pi.wave_create()
                wave[i] = spaces_wid[ci]
            else: # Mark
                if ci not in marks_wid:
                    wf = IR_carrier(IRGPIOTRANS, FREQ, ci)
                    pi.wave_add_generic(wf)
                    marks_wid[ci] = pi.wave_create()
                wave[i] = marks_wid[ci]

        delay = emit_time - time.time()

        if delay > 0.0:
            time.sleep(delay)
        
        pi.wave_chain(wave)

        while pi.wave_tx_busy():
            time.sleep(0.002)

        emit_time = time.time() + GAP_S

        for i in marks_wid:
            pi.wave_delete(marks_wid[i])

        marks_wid = {}

        for i in spaces_wid:
            pi.wave_delete(spaces_wid[i])

        spaces_wid = {}
    except Exception  as e:
        pass
        print("------------------------------------------>", e)
        
def presetIRMessage(name, data):
    import json
    global IR_presets

    IR_presets[name] = json.loads(data)

# SPDX-FileCopyrightText: 2017 Tony DiCola for Adafruit Industries
#
# SPDX-License-Identifier: MIT

import math


# Configuration constants:
_SYSRANGE_START = 0x00
_SYSTEM_THRESH_HIGH = 0x0C
_SYSTEM_THRESH_LOW = 0x0E
_SYSTEM_SEQUENCE_CONFIG = 0x01
_SYSTEM_RANGE_CONFIG = 0x09
_SYSTEM_INTERMEASUREMENT_PERIOD = 0x04
_SYSTEM_INTERRUPT_CONFIG_GPIO = 0x0A
_GPIO_HV_MUX_ACTIVE_HIGH = 0x84
_SYSTEM_INTERRUPT_CLEAR = 0x0B
_RESULT_INTERRUPT_STATUS = 0x13
_RESULT_RANGE_STATUS = 0x14
_RESULT_CORE_AMBIENT_WINDOW_EVENTS_RTN = 0xBC
_RESULT_CORE_RANGING_TOTAL_EVENTS_RTN = 0xC0
_RESULT_CORE_AMBIENT_WINDOW_EVENTS_REF = 0xD0
_RESULT_CORE_RANGING_TOTAL_EVENTS_REF = 0xD4
_RESULT_PEAK_SIGNAL_RATE_REF = 0xB6
_ALGO_PART_TO_PART_RANGE_OFFSET_MM = 0x28
_I2C_SLAVE_DEVICE_ADDRESS = 0x8A
_MSRC_CONFIG_CONTROL = 0x60
_PRE_RANGE_CONFIG_MIN_SNR = 0x27
_PRE_RANGE_CONFIG_VALID_PHASE_LOW = 0x56
_PRE_RANGE_CONFIG_VALID_PHASE_HIGH = 0x57
_PRE_RANGE_MIN_COUNT_RATE_RTN_LIMIT = 0x64
_FINAL_RANGE_CONFIG_MIN_SNR = 0x67
_FINAL_RANGE_CONFIG_VALID_PHASE_LOW = 0x47
_FINAL_RANGE_CONFIG_VALID_PHASE_HIGH = 0x48
_FINAL_RANGE_CONFIG_MIN_COUNT_RATE_RTN_LIMIT = 0x44
_PRE_RANGE_CONFIG_SIGMA_THRESH_HI = 0x61
_PRE_RANGE_CONFIG_SIGMA_THRESH_LO = 0x62
_PRE_RANGE_CONFIG_VCSEL_PERIOD = 0x50
_PRE_RANGE_CONFIG_TIMEOUT_MACROP_HI = 0x51
_PRE_RANGE_CONFIG_TIMEOUT_MACROP_LO = 0x52
_SYSTEM_HISTOGRAM_BIN = 0x81
_HISTOGRAM_CONFIG_INITIAL_PHASE_SELECT = 0x33
_HISTOGRAM_CONFIG_READOUT_CTRL = 0x55
_FINAL_RANGE_CONFIG_VCSEL_PERIOD = 0x70
_FINAL_RANGE_CONFIG_TIMEOUT_MACROP_HI = 0x71
_FINAL_RANGE_CONFIG_TIMEOUT_MACROP_LO = 0x72
_CROSSTALK_COMPENSATION_PEAK_RATE_MCPS = 0x20
_MSRC_CONFIG_TIMEOUT_MACROP = 0x46
_SOFT_RESET_GO2_SOFT_RESET_N = 0xBF
_IDENTIFICATION_MODEL_ID = 0xC0
_IDENTIFICATION_REVISION_ID = 0xC2
_OSC_CALIBRATE_VAL = 0xF8
_GLOBAL_CONFIG_VCSEL_WIDTH = 0x32
_GLOBAL_CONFIG_SPAD_ENABLES_REF_0 = 0xB0
_GLOBAL_CONFIG_SPAD_ENABLES_REF_1 = 0xB1
_GLOBAL_CONFIG_SPAD_ENABLES_REF_2 = 0xB2
_GLOBAL_CONFIG_SPAD_ENABLES_REF_3 = 0xB3
_GLOBAL_CONFIG_SPAD_ENABLES_REF_4 = 0xB4
_GLOBAL_CONFIG_SPAD_ENABLES_REF_5 = 0xB5
_GLOBAL_CONFIG_REF_EN_START_SELECT = 0xB6
_DYNAMIC_SPAD_NUM_REQUESTED_REF_SPAD = 0x4E
_DYNAMIC_SPAD_REF_EN_START_OFFSET = 0x4F
_POWER_MANAGEMENT_GO1_POWER_FORCE = 0x80
_VHV_CONFIG_PAD_SCL_SDA__EXTSUP_HV = 0x89
_ALGO_PHASECAL_LIM = 0x30
_ALGO_PHASECAL_CONFIG_TIMEOUT = 0x30
_VCSEL_PERIOD_PRE_RANGE = 0
_VCSEL_PERIOD_FINAL_RANGE = 1

import smbus2

bus = smbus2.SMBus(1)


def _decode_timeout(val):
    # format: "(LSByte * 2^MSByte) + 1"
    return float(val & 0xFF) * math.pow(2.0, ((val & 0xFF00) >> 8)) + 1


def _encode_timeout(timeout_mclks):
    # format: "(LSByte * 2^MSByte) + 1"
    timeout_mclks = int(timeout_mclks) & 0xFFFF
    ls_byte = 0
    ms_byte = 0
    if timeout_mclks > 0:
        ls_byte = timeout_mclks - 1
        while ls_byte > 255:
            ls_byte >>= 1
            ms_byte += 1
        return ((ms_byte << 8) | (ls_byte & 0xFF)) & 0xFFFF
    return 0


def _timeout_mclks_to_microseconds(timeout_period_mclks, vcsel_period_pclks):
    macro_period_ns = ((2304 * (vcsel_period_pclks) * 1655) + 500) // 1000
    return ((timeout_period_mclks * macro_period_ns) + (macro_period_ns // 2)) // 1000


def _timeout_microseconds_to_mclks(timeout_period_us, vcsel_period_pclks):
    macro_period_ns = ((2304 * (vcsel_period_pclks) * 1655) + 500) // 1000
    return ((timeout_period_us * 1000) + (macro_period_ns // 2)) // macro_period_ns


class VL53L0X:
    """Driver for the VL53L0X distance sensor."""

    # Class-level buffer for reading and writing data with the sensor.
    # This reduces memory allocations but means the code is not re-entrant or
    # thread safe!
    _BUFFER = bytearray(3)

    def __init__(self, address=41, io_timeout_s=0):
        # pylint: disable=too-many-statements
        self.io_timeout_s = io_timeout_s
        self._i2c_address = address


        # Check identification registers for expected values.
        # From section 3.2 of the datasheet.
        if (
            self._read_u8(0xC0) != 0xEE
            or self._read_u8(0xC1) != 0xAA
            or self._read_u8(0xC2) != 0x10
        ):
            raise RuntimeError(
                "Failed to find expected ID register values. Check wiring!"
            )
        # Initialize access to the sensor.  This is based on the logic from:
        #   https://github.com/pololu/vl53l0x-arduino/blob/master/VL53L0X.cpp
        # Set I2C standard mode.
        for pair in ((0x88, 0x00), (0x80, 0x01), (0xFF, 0x01), (0x00, 0x00)):
            self._write_u8(pair[0], pair[1])
        self._stop_variable = self._read_u8(0x91)
        for pair in ((0x00, 0x01), (0xFF, 0x00), (0x80, 0x00)):
            self._write_u8(pair[0], pair[1])
        # disable SIGNAL_RATE_MSRC (bit 1) and SIGNAL_RATE_PRE_RANGE (bit 4)
        # limit checks
        config_control = self._read_u8(_MSRC_CONFIG_CONTROL) | 0x12
        self._write_u8(_MSRC_CONFIG_CONTROL, config_control)
        # set final range signal rate limit to 0.25 MCPS (million counts per
        # second)
        self.signal_rate_limit = 0.25
        self._write_u8(_SYSTEM_SEQUENCE_CONFIG, 0xFF)
        spad_count, spad_is_aperture = self._get_spad_info()
        # The SPAD map (RefGoodSpadMap) is read by
        # VL53L0X_get_info_from_device() in the API, but the same data seems to
        # be more easily readable from GLOBAL_CONFIG_SPAD_ENABLES_REF_0 through
        # _6, so read it from there.
        ref_spad_map = bytearray(7)
        ref_spad_map[0] = _GLOBAL_CONFIG_SPAD_ENABLES_REF_0

#        self._device.write(ref_spad_map, end=1)
#        self._device.readinto(ref_spad_map, start=1)

        result = bus.read_i2c_block_data(address, ref_spad_map[0], len(ref_spad_map) - 1)

        for i in range(len(result)):
            ref_spad_map[i + 1] = result[i]

        for pair in (
            (0xFF, 0x01),
            (_DYNAMIC_SPAD_REF_EN_START_OFFSET, 0x00),
            (_DYNAMIC_SPAD_NUM_REQUESTED_REF_SPAD, 0x2C),
            (0xFF, 0x00),
            (_GLOBAL_CONFIG_REF_EN_START_SELECT, 0xB4),
        ):
            self._write_u8(pair[0], pair[1])

        first_spad_to_enable = 12 if spad_is_aperture else 0
        spads_enabled = 0
        for i in range(48):
            if i < first_spad_to_enable or spads_enabled == spad_count:
                # This bit is lower than the first one that should be enabled,
                # or (reference_spad_count) bits have already been enabled, so
                # zero this bit.
                ref_spad_map[1 + (i // 8)] &= ~(1 << (i % 8))
            elif (ref_spad_map[1 + (i // 8)] >> (i % 8)) & 0x1 > 0:
                spads_enabled += 1
#       self._device.write(ref_spad_map)
        bus.write_i2c_block_data(address, ref_spad_map[0], ref_spad_map[1:])
        for pair in (
            (0xFF, 0x01),
            (0x00, 0x00),
            (0xFF, 0x00),
            (0x09, 0x00),
            (0x10, 0x00),
            (0x11, 0x00),
            (0x24, 0x01),
            (0x25, 0xFF),
            (0x75, 0x00),
            (0xFF, 0x01),
            (0x4E, 0x2C),
            (0x48, 0x00),
            (0x30, 0x20),
            (0xFF, 0x00),
            (0x30, 0x09),
            (0x54, 0x00),
            (0x31, 0x04),
            (0x32, 0x03),
            (0x40, 0x83),
            (0x46, 0x25),
            (0x60, 0x00),
            (0x27, 0x00),
            (0x50, 0x06),
            (0x51, 0x00),
            (0x52, 0x96),
            (0x56, 0x08),
            (0x57, 0x30),
            (0x61, 0x00),
            (0x62, 0x00),
            (0x64, 0x00),
            (0x65, 0x00),
            (0x66, 0xA0),
            (0xFF, 0x01),
            (0x22, 0x32),
            (0x47, 0x14),
            (0x49, 0xFF),
            (0x4A, 0x00),
            (0xFF, 0x00),
            (0x7A, 0x0A),
            (0x7B, 0x00),
            (0x78, 0x21),
            (0xFF, 0x01),
            (0x23, 0x34),
            (0x42, 0x00),
            (0x44, 0xFF),
            (0x45, 0x26),
            (0x46, 0x05),
            (0x40, 0x40),
            (0x0E, 0x06),
            (0x20, 0x1A),
            (0x43, 0x40),
            (0xFF, 0x00),
            (0x34, 0x03),
            (0x35, 0x44),
            (0xFF, 0x01),
            (0x31, 0x04),
            (0x4B, 0x09),
            (0x4C, 0x05),
            (0x4D, 0x04),
            (0xFF, 0x00),
            (0x44, 0x00),
            (0x45, 0x20),
            (0x47, 0x08),
            (0x48, 0x28),
            (0x67, 0x00),
            (0x70, 0x04),
            (0x71, 0x01),
            (0x72, 0xFE),
            (0x76, 0x00),
            (0x77, 0x00),
            (0xFF, 0x01),
            (0x0D, 0x01),
            (0xFF, 0x00),
            (0x80, 0x01),
            (0x01, 0xF8),
            (0xFF, 0x01),
            (0x8E, 0x01),
            (0x00, 0x01),
            (0xFF, 0x00),
            (0x80, 0x00),
        ):
            self._write_u8(pair[0], pair[1])

        self._write_u8(_SYSTEM_INTERRUPT_CONFIG_GPIO, 0x04)
        gpio_hv_mux_active_high = self._read_u8(_GPIO_HV_MUX_ACTIVE_HIGH)
        self._write_u8(
            _GPIO_HV_MUX_ACTIVE_HIGH, gpio_hv_mux_active_high & ~0x10
        )  # active low
        self._write_u8(_SYSTEM_INTERRUPT_CLEAR, 0x01)
        self._measurement_timing_budget_us = self.measurement_timing_budget
        self._write_u8(_SYSTEM_SEQUENCE_CONFIG, 0xE8)
        self.measurement_timing_budget = self._measurement_timing_budget_us
        self._write_u8(_SYSTEM_SEQUENCE_CONFIG, 0x01)

        self._perform_single_ref_calibration(0x40)
        self._write_u8(_SYSTEM_SEQUENCE_CONFIG, 0x02)
        self._perform_single_ref_calibration(0x00)
        # "restore the previous Sequence Config"
        self._write_u8(_SYSTEM_SEQUENCE_CONFIG, 0xE8)

    def _read_u8(self, address):
        # Read an 8-bit unsigned value from the specified 8-bit address.
#        self._BUFFER[0] = address & 0xFF
#        self._device.write(self._BUFFER, end=1)
#        self._device.readinto(self._BUFFER, end=1)
        result = bus.read_i2c_block_data(self._i2c_address, address & 0xFF, 1)

        return result[0]


    def _read_u16(self, address):
        # Read a 16-bit BE unsigned value from the specified 8-bit address.
#        with self._device:
#            self._BUFFER[0] = address & 0xFF
#            self._device.write(self._BUFFER, end=1)
#            self._device.readinto(self._BUFFER)

#        msg = smbus2.i2c_msg.read(_i2c_address, 2)
#        result = bus.i2c_rdwr(msg)
       result = bus.read_i2c_block_data(self._i2c_address, address & 0xFF, 2)


       return (result[0] << 8) | result[1]

    def _write_u8(self, address, val):
        # Write an 8-bit unsigned value to the specified 8-bit address.
#        with self._device:
#            self._BUFFER[0] = address & 0xFF
#        self._BUFFER[1] = val & 0xFF
#        self._device.write(self._BUFFER, end=2)
        bus.write_byte_data(self._i2c_address, address & 0xFF, val & 0xFF)

    def _write_u16(self, address, val):
        # Write a 16-bit BE unsigned value to the specified 8-bit address.
#        with self._device:
#            self._BUFFER[0] = address & 0xFF
#            self._BUFFER[1] = (val >> 8) & 0xFF
#            self._BUFFER[2] = val & 0xFF
#            self._device.write(self._BUFFER)
        self._BUFFER[1] = (val >> 8) & 0xFF
        self._BUFFER[2] = val & 0xFF

        bus.write_i2c_block_data(self._i2c_address, address & 0xFF, self._BUFFER[1:3])


    def _get_spad_info(self):
        # Get reference SPAD count and type, returned as a 2-tuple of
        # count and boolean is_aperture.  Based on code from:
        #   https://github.com/pololu/vl53l0x-arduino/blob/master/VL53L0X.cpp
        for pair in ((0x80, 0x01), (0xFF, 0x01), (0x00, 0x00), (0xFF, 0x06)):
            self._write_u8(pair[0], pair[1])
        self._write_u8(0x83, self._read_u8(0x83) | 0x04)
        for pair in (
            (0xFF, 0x07),
            (0x81, 0x01),
            (0x80, 0x01),
            (0x94, 0x6B),
            (0x83, 0x00),
        ):
            self._write_u8(pair[0], pair[1])
        start = time.monotonic()
        while self._read_u8(0x83) == 0x00:
            if (
                self.io_timeout_s > 0
                and (time.monotonic() - start) >= self.io_timeout_s
            ):
                raise RuntimeError("Timeout waiting for VL53L0X!")
        self._write_u8(0x83, 0x01)
        tmp = self._read_u8(0x92)
        count = tmp & 0x7F
        is_aperture = ((tmp >> 7) & 0x01) == 1
        for pair in ((0x81, 0x00), (0xFF, 0x06)):
            self._write_u8(pair[0], pair[1])
        self._write_u8(0x83, self._read_u8(0x83) & ~0x04)
        for pair in ((0xFF, 0x01), (0x00, 0x01), (0xFF, 0x00), (0x80, 0x00)):
            self._write_u8(pair[0], pair[1])
        return (count, is_aperture)

    def _perform_single_ref_calibration(self, vhv_init_byte):
        # based on VL53L0X_perform_single_ref_calibration() from ST API.
        self._write_u8(_SYSRANGE_START, 0x01 | vhv_init_byte & 0xFF)
        start = time.monotonic()
        while (self._read_u8(_RESULT_INTERRUPT_STATUS) & 0x07) == 0:
            if (
                self.io_timeout_s > 0
                and (time.monotonic() - start) >= self.io_timeout_s
            ):
                raise RuntimeError("Timeout waiting for VL53L0X!")
        self._write_u8(_SYSTEM_INTERRUPT_CLEAR, 0x01)
        self._write_u8(_SYSRANGE_START, 0x00)

    def _get_vcsel_pulse_period(self, vcsel_period_type):
        # pylint: disable=no-else-return
        # Disable should be removed when refactor can be tested
        if vcsel_period_type == _VCSEL_PERIOD_PRE_RANGE:
            val = self._read_u8(_PRE_RANGE_CONFIG_VCSEL_PERIOD)
            return (((val) + 1) & 0xFF) << 1
        elif vcsel_period_type == _VCSEL_PERIOD_FINAL_RANGE:
            val = self._read_u8(_FINAL_RANGE_CONFIG_VCSEL_PERIOD)
            return (((val) + 1) & 0xFF) << 1
        return 255

    def _get_sequence_step_enables(self):
        # based on VL53L0X_GetSequenceStepEnables() from ST API
        sequence_config = self._read_u8(_SYSTEM_SEQUENCE_CONFIG)
        tcc = (sequence_config >> 4) & 0x1 > 0
        dss = (sequence_config >> 3) & 0x1 > 0
        msrc = (sequence_config >> 2) & 0x1 > 0
        pre_range = (sequence_config >> 6) & 0x1 > 0
        final_range = (sequence_config >> 7) & 0x1 > 0
        return (tcc, dss, msrc, pre_range, final_range)

    def _get_sequence_step_timeouts(self, pre_range):
        # based on get_sequence_step_timeout() from ST API but modified by
        # pololu here:
        #   https://github.com/pololu/vl53l0x-arduino/blob/master/VL53L0X.cpp
        pre_range_vcsel_period_pclks = self._get_vcsel_pulse_period(
            _VCSEL_PERIOD_PRE_RANGE
        )
        msrc_dss_tcc_mclks = (self._read_u8(_MSRC_CONFIG_TIMEOUT_MACROP) + 1) & 0xFF
        msrc_dss_tcc_us = _timeout_mclks_to_microseconds(
            msrc_dss_tcc_mclks, pre_range_vcsel_period_pclks
        )
        pre_range_mclks = _decode_timeout(
            self._read_u16(_PRE_RANGE_CONFIG_TIMEOUT_MACROP_HI)
        )
        pre_range_us = _timeout_mclks_to_microseconds(
            pre_range_mclks, pre_range_vcsel_period_pclks
        )
        final_range_vcsel_period_pclks = self._get_vcsel_pulse_period(
            _VCSEL_PERIOD_FINAL_RANGE
        )
        final_range_mclks = _decode_timeout(
            self._read_u16(_FINAL_RANGE_CONFIG_TIMEOUT_MACROP_HI)
        )
        if pre_range:
            final_range_mclks -= pre_range_mclks
        final_range_us = _timeout_mclks_to_microseconds(
            final_range_mclks, final_range_vcsel_period_pclks
        )
        return (
            msrc_dss_tcc_us,
            pre_range_us,
            final_range_us,
            final_range_vcsel_period_pclks,
            pre_range_mclks,
        )

    @property
    def signal_rate_limit(self):
        """The signal rate limit in mega counts per second."""
        val = self._read_u16(_FINAL_RANGE_CONFIG_MIN_COUNT_RATE_RTN_LIMIT)
        # Return value converted from 16-bit 9.7 fixed point to float.
        return val / (1 << 7)

    @signal_rate_limit.setter
    def signal_rate_limit(self, val):
        assert 0.0 <= val <= 511.99
        # Convert to 16-bit 9.7 fixed point value from a float.
        val = int(val * (1 << 7))
        self._write_u16(_FINAL_RANGE_CONFIG_MIN_COUNT_RATE_RTN_LIMIT, val)

    @property
    def measurement_timing_budget(self):
        """The measurement timing budget in microseconds."""
        budget_us = 1910 + 960  # Start overhead + end overhead.
        tcc, dss, msrc, pre_range, final_range = self._get_sequence_step_enables()
        step_timeouts = self._get_sequence_step_timeouts(pre_range)
        msrc_dss_tcc_us, pre_range_us, final_range_us, _, _ = step_timeouts
        if tcc:
            budget_us += msrc_dss_tcc_us + 590
        if dss:
            budget_us += 2 * (msrc_dss_tcc_us + 690)
        elif msrc:
            budget_us += msrc_dss_tcc_us + 660
        if pre_range:
            budget_us += pre_range_us + 660
        if final_range:
            budget_us += final_range_us + 550
        self._measurement_timing_budget_us = budget_us
        return budget_us

    @measurement_timing_budget.setter
    def measurement_timing_budget(self, budget_us):
        # pylint: disable=too-many-locals
        assert budget_us >= 20000
        used_budget_us = 1320 + 960  # Start (diff from get) + end overhead
        tcc, dss, msrc, pre_range, final_range = self._get_sequence_step_enables()
        step_timeouts = self._get_sequence_step_timeouts(pre_range)
        msrc_dss_tcc_us, pre_range_us, _ = step_timeouts[:3]
        final_range_vcsel_period_pclks, pre_range_mclks = step_timeouts[3:]
        if tcc:
            used_budget_us += msrc_dss_tcc_us + 590
        if dss:
            used_budget_us += 2 * (msrc_dss_tcc_us + 690)
        elif msrc:
            used_budget_us += msrc_dss_tcc_us + 660
        if pre_range:
            used_budget_us += pre_range_us + 660
        if final_range:
            used_budget_us += 550
            # "Note that the final range timeout is determined by the timing
            # budget and the sum of all other timeouts within the sequence.
            # If there is no room for the final range timeout, then an error
            # will be set. Otherwise the remaining time will be applied to
            # the final range."
            if used_budget_us > budget_us:
                raise ValueError("Requested timeout too big.")
            final_range_timeout_us = budget_us - used_budget_us
            final_range_timeout_mclks = _timeout_microseconds_to_mclks(
                final_range_timeout_us, final_range_vcsel_period_pclks
            )
            if pre_range:
                final_range_timeout_mclks += pre_range_mclks
            self._write_u16(
                _FINAL_RANGE_CONFIG_TIMEOUT_MACROP_HI,
                _encode_timeout(final_range_timeout_mclks),
            )
            self._measurement_timing_budget_us = budget_us

    @property
    def range(self):
        """Perform a single reading of the range for an object in front of
        the sensor and return the distance in millimeters.
        """
        # Adapted from readRangeSingleMillimeters &
        # readRangeContinuousMillimeters in pololu code at:
        #   https://github.com/pololu/vl53l0x-arduino/blob/master/VL53L0X.cpp
        for pair in (
            (0x80, 0x01),
            (0xFF, 0x01),
            (0x00, 0x00),
            (0x91, self._stop_variable),
            (0x00, 0x01),
            (0xFF, 0x00),
            (0x80, 0x00),
            (_SYSRANGE_START, 0x01),
        ):
            self._write_u8(pair[0], pair[1])
        start = time.monotonic()
        while (self._read_u8(_SYSRANGE_START) & 0x01) > 0:
            if (
                self.io_timeout_s > 0
                and (time.monotonic() - start) >= self.io_timeout_s
            ):
                raise RuntimeError("Timeout waiting for VL53L0X!")
        start = time.monotonic()
        while (self._read_u8(_RESULT_INTERRUPT_STATUS) & 0x07) == 0:
            if (
                self.io_timeout_s > 0
                and (time.monotonic() - start) >= self.io_timeout_s
            ):
                raise RuntimeError("Timeout waiting for VL53L0X!")
        # assumptions: Linearity Corrective Gain is 1000 (default)
        # fractional ranging is not enabled
        range_mm = self._read_u16(_RESULT_RANGE_STATUS + 10)
        self._write_u8(_SYSTEM_INTERRUPT_CLEAR, 0x01)
        return range_mm

`;


var pythonLibDetection = `
import RPi.GPIO as GPIO
import pigpio
import time
import smbus

#quickpi_expected_i2c = [0x1d, 0x1e, 0x29, 0x3c, 0x48, 0x68]
quickpi_expected_base_i2c = [0x29, 0x3c, 0x48, 0x68]

grove_expected_i2c = [0x04]
GPIO.setwarnings(False)

def listi2cDevices():
        #Set the screen pin high so that the screen can be detected
        RESET=21
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(RESET, GPIO.OUT)
        time.sleep(0.01)
        GPIO.output(RESET, 1)

        pi = pigpio.pi()

        i2c_present = []
        for device in range(128):
                h = pi.i2c_open(1, device)
                try:
                        pi.i2c_read_byte(h)
                        i2c_present.append(device)
                except:
                        pass
                pi.i2c_close(h)

        pi.stop()

        return i2c_present

def detectBoard():
        i2cdevices = listi2cDevices()

        if i2cdevices == grove_expected_i2c:
                return "grovepi"
        else:
                hasbasesensors = True
                for dev in quickpi_expected_base_i2c:
                        if dev not in i2cdevices:
                                hasbasesensors = False

                if hasbasesensors:
                        if (0x1d in i2cdevices) and (0x1e in i2cdevices):
                                return "quickpi" # This is a quickpi with standalone magnetometer

                        else:
                                bus = smbus.SMBus(1)
                                chipid = bus.read_i2c_block_data(0x68, 0x00, 1)
                                if chipid[0] == 216:
                                        return "quickpi" # This a quickpi with a bmx160 (accel, gyro and mag combo)


        if len(i2cdevices) == 0:
                return "none"
        else:
                return "unknow"
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