#!/usr/bin/python
import RPi.GPIO as GPIO
import time as time


class Actuator:
    id = 0

    def __init__(self, pin, room, value):
        Actuator.id += 1
        self.id = Actuator.id
        self.pin = pin
        self.room = room
        self.value = value


class Led(Actuator):
    def __init__(self, pin, room, value):
        Actuator.__init__(self, pin, room, value)
        self.type = "led"

    def instruction(self, value):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(self.pin,GPIO.OUT)
        GPIO.output(self.pin,int(value))
        print(int(value))


class Servomotor(Actuator):
    def __init__(self, pin, room, value):
        Actuator.__init__(self, pin, room, value)
        self.type = "servo"
        self.start = 0

    def instruction(self, value):
        duty = value / 18 + 2
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(self.pin,GPIO.OUT)
        pwm = GPIO.PWM(self.pin,50)
        position = self.start
        pwm.start(self.start) 
        if position <value:
                while position < value:  
                        pwm.ChangeDutyCycle(float(position))
                        position = position + 0.1
                        time.sleep(0.1)
             
        else: 
                while position > value:  
                        pwm.ChangeDutyCycle(float(position))
                        position = position - 0.1
                        time.sleep(0.1)
                
        self.start = value
        pwm.stop()
        print(value)
        print("done")
