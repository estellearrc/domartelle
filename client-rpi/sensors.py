#!/usr/bin/python
import RPi.GPIO as GPIO
import random
from Adafruit_Python_DHT import Adafruit_DHT

class TemperatureSensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub
    
    def RetrieveTemperature(self,data):
        if self.stub:
            return random.randint(0,30)
        else:
            temperature = Adafruit_DHT.read_retry(sensor, pin)[1]
            return temperature

class HumiditySensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub

    def RetrieveHumidity(self,data):
        if self.stub:
            return random.randint(0,100)
        else:
            humidity = Adafruit_DHT.read_retry(sensor, pin)[0]
            return humidity

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
