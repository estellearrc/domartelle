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

    def instruction(self, state):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(self.pin, GPIO.OUT)
        GPIO.output(self.pin, state)


class Servomotor(Actuator):
    def __init__(self, pin, room, value):
        Actuator.__init__(self, pin, room, value)
        self.type = "servo"

    def instruction(self, pin, value):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(pin, GPIO.OUT)
        pwm = GPIO.PWM(pin, 50)
        pwm.start(state)  # ici le state sera en pourcentage
