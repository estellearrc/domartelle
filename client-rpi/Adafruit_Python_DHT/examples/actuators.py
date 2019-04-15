#!/usr/bin/python
import RPi.GPIO as GPIO

class Led :
    id = 0
    def __init__(self,pin,type,room,number,state):
        self.pin = pin
        self.room=room
        self.type = type
        self.number= number
        self.state = state
        Led.id +=1
        self.id = Led.id


    def instruction(self,pin,state):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(pin,GPIO.OUT)
        GPIO.output(pin,state)





class Servomotor :
    id = 0
    def __init__(self,pin,type,room,number,state):
        self.pin = pin
        self.room=room
        self.type = type
        self.number= number
        self.state = state
        Servomotor.id +=1
        self.id = Servomotor.id

    def instruction(self,pin,state):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(pin,GPIO.OUT)
        pwm = GPIO.PWM(pin,50)
        pwm.start(state) #ici le state sera en pourcentage
    
    def createServo(self)
    return {"_class_": "Servomotor",{json.dumps(self, default=lambda o: o.__dict__, indent=4)}}