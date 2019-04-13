#!/usr/bin/python
import RPi.GPIO as GPIO
import random
from Adafruit_Python_DHT import Adafruit_DHT

class TemperatureSensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub
    
    def RetrieveTemperature(self):
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

class HumiditySensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub

    def RetrieveHumidity(self):
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

class MovementSensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub
    
    def RetrieveMovement(self):
        if self.stub:
            return random.randint(0,1)
        else:
            return 1

class LuminositySensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub
    
    def CalculateLuminosityRate(self):
        return 1

    def RetrieveLuminosity(self,data):
        if self.stub:
            return random.randint(0,100)
        else:
            return 1
