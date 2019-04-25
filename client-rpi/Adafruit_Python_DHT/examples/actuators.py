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

        # Cette fonction envoie l'ordre à la led de s'allumer ou s'éteindre
    def instruction(self, value):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(self.pin, GPIO.OUT)
        GPIO.output(self.pin, int(value))
        print(int(value))


class Servomotor(Actuator):
    def __init__(self, pin, room, value):
        Actuator.__init__(self, pin, room, value)
        self.type = "servo"
        self.start = 0

        # Cette fonction traduit les angles en degré pour donner une position au servomoteur
    def calculateAngle(self, n):
        result = float(((10 * n) / 180) + 2)
        return round(result, 2)

        # Cette fonction envoie l'ordre au servomoteur de pivoter
    def instruction(self, value):
        GPIO.setmode(GPIO.BOARD)
        GPIO.setup(self.pin, GPIO.OUT)
        pwm = GPIO.PWM(self.pin, 50)
        angle_start = self.calculateAngle(self.start)
        angle_end = self.calculateAngle(value)
        pwm.start(angle_start)
        if angle_start < angle_end:
            while angle_start < angle_end:
                pwm.ChangeDutyCycle(float(angle_start))
                angle_start = angle_start + 0.1
                time.sleep(0.1)

        else:
            while angle_start > angle_end:
                pwm.ChangeDutyCycle(float(angle_start))
                angle_start = angle_start - 0.1
                time.sleep(0.1)

        self.start = value
        pwm.stop()
        print("done")
