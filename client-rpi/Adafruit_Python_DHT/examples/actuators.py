#!/usr/bin/python
import RPi.GPIO as GPIO

class Led :
    id = 0
    def __init__(self,pin,room,state):
        self.pin = pin
        self.type = "led"
        self.room=room
        self.state = state
        Led.id +=1
        self.id = Led.id


    def instruction(self,pin,state):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(pin,GPIO.OUT)
        GPIO.output(pin,state)





class Servomotor :
    id = 0
    def __init__(self,pin,room,state):
        self.pin = pin
        self.type = "servo"
        self.room=room
        self.state = state
        Servomotor.id +=1
        self.id = Servomotor.id

    def instruction(self,pin,state):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(pin,GPIO.OUT)
        pwm = GPIO.PWM(pin,50)
        pwm.start(state) #ici le state sera en pourcentage
    