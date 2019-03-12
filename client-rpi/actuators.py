#!/usr/bin/python
import RPi.GPIO as GPIO

class Led :
    def __init__(self,pin):
        self.pin = pin
        self.state = 0

    def instruction(pin,state):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(pin,GPIO.OUT)
        GPIO.output(pin,state)

class Servomotor :
    def __init__(self,pin):
        self.pin = pin
        self.state = 0

    def instruction(pin,state):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(pin,GPIO.OUT)
        pwm = GPIO.PWM(pin,50)
        pwm.start(state) #ici le state sera en pourcentage