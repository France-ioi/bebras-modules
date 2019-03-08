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