g_instance = null;

var getQuickPiConnection = function (userName, _onConnect, _onDisconnect) {
    this.onConnect = _onConnect;
    this.onDisconnect = _onDisconnect;

    if (g_instance) {
        return g_instance;
    }

    this.raspiServer = "";
    this.wsSession = null;
    this.resultsCallback = null;
    this.commandMode = false;
    this.userName = userName;
    this.sessionTainted = false;
    this.connected = false;
    this.onConnect = _onConnect;
    this.onDisconnect = _onDisconnect;
    this.locked = "";
    this.pingInterval = null;
    this.pingsWithoutPong = 0;
    this.oninstalled = null;
    this.commandQueue = [];

    this.connect = function(ipaddress) {
        if (this.wsSession != null) {
            return;
        }

        url = "ws://" + ipaddress + ":5000/api/v1/commands";
        this.locked = "";
        this.pingsWithoutPong = 0;
        this.commandQueue = [];
        this.resultsCallback = null;

        this.wsSession = new WebSocket(url);

        this.wsSession.onopen = function () {
            var command =
            {
                "command": "grabLock",
                "username": userName
            }

            wsSession.send(JSON.stringify(command));

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

                }, 1000);

        }

        this.wsSession.onmessage = function (evt) {
            var message = JSON.parse(evt.data);

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

                    sendCommand(command.command, command.callback);
                }
            } else if (message.command == "execLineresult") {
                if (commandMode && resultsCallback != null) {
                    tempCallback = resultsCallback;
                    resultsCallback = null;
                    tempCallback(message.result);

                    if (commandQueue.length > 0)
                    {
                        var command = commandQueue.shift();

                        sendCommand(command.command, command.callback);
                    }
                }
            }
        }

        this.wsSession.onclose = function () {

            if (wsSession != null) {
                clearInterval(pingInterval);
                pingInterval = null;

                wsSession = null;
                commandMode = false;
                sessionTainted = false;

                connected = false;

                onDisconnect(connected);
            }
        }
    }

    this.onclose = function() {
        clearInterval(pingInterval);
        pingInterval = null;

        wsSession = null;
        commandMode = false;
        sessionTainted = false;

        onDisconnect(connected);

        connected = false;
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

        var fullProgram = pythonLib + pythonProgram;
        var command =
        {
            "command": "install",
            "program": fullProgram
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

        this.resultsCallback = null;
        this.commandMode = true;
        this.sessionTainted = false;

        var command =
        {
            "command": "startCommandMode",
            "library": pythonLib
        }

        this.commandQueue = [];
        this.wsSession.send(JSON.stringify(command));
    }

    this.sendCommand = function (command, callback) {
        if (this.wsSession != null) {
            if (this.resultsCallback == null) {
                if (!this.commandMode) {
                    this.startNewSession();

                    this.commandQueue.push ({
                        command: command,
                        callback: callback
                    });    
                } else { 

                    var command =
                    {
                        "command": "execLine",
                        "line": command
                    }

                    this.sessionTainted = true;
                    this.resultsCallback = callback;
                    this.wsSession.send(JSON.stringify(command));
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
import RPi.GPIO as GPIO
import time
import smbus
import math
import pigpio 

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

button_interrupt_enabled = {}
button_was_pressed = {}
servo_object = {}
servo_last_value = {}

screenLine1 = None
screenLine2 = None

pi = pigpio.pi()

def changePinState(pin, state):
  pin = int(pin)
  state = int(state)

  GPIO.setup(pin, GPIO.OUT)
  if state:
    GPIO.output(pin, GPIO.HIGH)
  else:
    GPIO.output(pin, GPIO.LOW)

def turnLedOn(pin=5):
	changePinState(pin, 1)

def turnLedOff(pin=5):
	changePinState(pin, 0)

def changeLedState(pin, state):
	changePinState(pin, state)

def toggleLedState(pin):
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

def buttonStateInPort(pin):
  pin = int(pin)

  GPIO.setup(pin, GPIO.IN)
  return GPIO.input(pin)

def buttonState():
	return buttonStateInPort(22)

def waitForButton(pin):
  pin = int(pin)
  GPIO.setup(pin, GPIO.IN)
  while not GPIO.input(pin):
    time.sleep(0.01)
  time.sleep(0.1) # debounce

def buttonWasPressedCallback(pin):
    button_was_pressed[pin] = 1

def buttonWasPressed(pin):
    pin = int(pin)
    init = False
    try:
        init = button_interrupt_enabled[pin]
    except:
        pass

    if not init:
        button_interrupt_enabled[pin] = True
        GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.add_event_detect(pin, GPIO.FALLING, callback=buttonWasPressedCallback, bouncetime=300)

    wasPressed = 0

    try:
        wasPressed = button_was_pressed[pin]
        button_was_pressed[pin] = 0
    except:
            pass

    return wasPressed

usleep = lambda x: time.sleep(x / 1000000.0)

_TIMEOUT1 = 1000
_TIMEOUT2 = 10000

def readDistance(pin):
	pin = int(pin)

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
		return None

	t1 = time.time()
	count = 0
	while count < _TIMEOUT2:
		if not GPIO.input(pin):
			break
		count += 1
	if count >= _TIMEOUT2:
		return None

	t2 = time.time()

	dt = int((t1 - t0) * 1000000)
	if dt > 530:
		return None

	distance = ((t2 - t1) * 1000000 / 29 / 2)    # cm

	return round(distance, 1)

def displayText(line1, line2=""):
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
	pin = int(pin)
	angle = int(angle)

	pulsewidth = (angle * 11.11) + 500
	pi.set_servo_pulsewidth(pin, pulsewidth)

def readADC(pin):
	pin = int(pin)

	reg = 0x30 + pin
	address = 0x04

	bus = smbus.SMBus(1)
	bus.write_byte(address, reg)
	return bus.read_word_data(address, reg)


def readTemperature(pin):
	B = 4275.
	R0 = 100000.

	val = readADC(pin)

	r = 1000. / val - 1.
	r = R0 * r

	return round(1. / (math.log10(r / R0) / B + 1 / 298.15) - 273.15, 1)

def readRotaryAngle(pin):
	return int(readADC(pin) / 10)

def readSoundSensor(pin):
	return int(readADC(pin) / 10)

def readLightIntensity(pin):
	return int(readADC(pin) * 100 / 631)

def sleep(sleep_time):
	sleep_time = float(sleep_time)
	time.sleep(sleep_time)

def reportBlockValue(id, state):
	return state
`