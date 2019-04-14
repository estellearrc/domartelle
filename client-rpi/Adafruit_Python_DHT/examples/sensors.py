#!/usr/bin/python
import RPi.GPIO as GPIO
import random
import sys
import time
import Adafruit_DHT

class TemperatureSensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub
    
    def RetrieveTemperature(self):
        while True :
            if self.stub:
                return random.randint(0,30)
            else:
                sensor = Adafruit_DHT.DHT11
                temperature = Adafruit_DHT.read_retry(sensor, self.pin)[1]
                if temperature is not None:
                    return temperature
                else:
                    print('Failed to get reading temperature. Check GPIO pins and try again!')
                    sys.exit(1)
            time.sleep(10)

class HumiditySensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub

    def RetrieveHumidity(self):
        while True:
            if self.stub:
                return random.randint(0,100)
            else:
                sensor = Adafruit_DHT.DHT11
                humidity = Adafruit_DHT.read_retry(sensor, self.pin)[0]
                if humidity is not None:
                    return humidity
                else:
                    print('Failed to get reading humidity. Check GPIO pins and try again!')
                    sys.exit(1)
        time.sleep(10)

class MovementSensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub
    
    def RetrieveMovement(self):
        while True:
            if self.stub:
                return random.randint(0,1)
            else:
                GPIO.setwarnings(False)
                GPIO.setmode(GPIO.BOARD)
                GPIO.setup(self.pin, GPIO.IN)  
                motion = GPIO.input(self.pin)
                return motion
        time.sleep(10)

class LuminositySensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub
    
    def CalculateLuminosityRate(self):
        return 1

    def RetrieveLuminosity(self):
        while True:
            if self.stub:
                return random.randint(0,100)
            else:
                return 1
        time.sleep(10)
