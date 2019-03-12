import RPi.GPIO as GPIO

def instruction(pin,state):
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(pin,GPIO.OUT)
    GPIO.output(pin,state)
