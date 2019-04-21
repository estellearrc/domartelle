#!/usr/bin/python
import RPi.GPIO as GPIO


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
        GPIO.setup(self.pin, GPIO.OUT)
        GPIO.output(self.pin, value)


class Servomotor(Actuator):
    def __init__(self, pin, room, value):
        Actuator.__init__(self, pin, room, value)
        self.type = "servo"

    def instruction(self, value):
        duty = value / 18 + 2
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(self.pin, GPIO.OUT)
        pwm = GPIO.PWM(self.pin, 50)
        pwm.start(value)
          # ici le state sera en pourcentage
