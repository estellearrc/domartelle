#!/usr/bin/python
import RPi.GPIO as GPIO

class Led :
    number = 0
    def __init__(self,pin,room,id,state):
        self.pin = pin
        self.type="led"
        self.room=room
        self.id= id
        self.state = state
        Led.number +=1
        self.number = Led.number


    def instruction(self,pin,state):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(pin,GPIO.OUT)
        GPIO.output(pin,state)

class Servomotor :
    number = 0
    def __init__(self,pin,room,id,state):
        self.pin = pin
        self.type="servo"
        self.room=room
        self.id= id
        self.state = state
        Servomotor.number +=1
        self.number = Servomotor.number

    def instruction(self,pin,state):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(pin,GPIO.OUT)
        pwm = GPIO.PWM(pin,50)
        pwm.start(state) #ici le state sera en pourcentage