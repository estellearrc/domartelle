#!/usr/bin/python
# import RPi.GPIO as GPIO


class Actuators:
    def _init_(self, pin, room, state):
         self.pin = pin
        self.room=room
        self.state = state
        



class Led(Actuators) :
    id = 0
    def __init__(self,pin,room,state):
        Actuators.__init__(self, pin,room,state)
        self.type = "led"
        Led.id +=1
        self.id = Led.id


    def instruction(self,pin,state):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(pin,GPIO.OUT)
        GPIO.output(pin,state)





class Servomotor :
    id = 0
    def __init__(self,pin,room,state):
        Actuators.__init__(self, pin,room,state)
        self.type = "servo"
        Servomotor.id +=1
        self.id = Servomotor.id

    def instruction(self,pin,state):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(pin,GPIO.OUT)
        pwm = GPIO.PWM(pin,50)
        pwm.start(state) #ici le state sera en pourcentage
    
