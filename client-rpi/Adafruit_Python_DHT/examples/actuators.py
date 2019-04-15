#!/usr/bin/python
# import RPi.GPIO as GPIO


class Actuator:
    id = 0
    def _init_(self, pin, room, state):
        Actuator.id += 1
        self.id = Actuator.id
        self.pin = pin
        self.room = room
        self.state = state
        



class Led(Actuator) :
    def __init__(self,pin,room,state):
        Actuator.__init__(self, pin,room,state)
        self.type = "led"


    def instruction(self,pin,state):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(pin,GPIO.OUT)
        GPIO.output(pin,state)





class Servomotor(Actuator) :
    def __init__(self,pin,room,state):
        Actuator.__init__(self, pin,room,state)
        self.type = "servo"

    def instruction(self,pin,state):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(pin,GPIO.OUT)
        pwm = GPIO.PWM(pin,50)
        pwm.start(state) #ici le state sera en pourcentage
    
