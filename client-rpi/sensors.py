#!/usr/bin/python
import RPi.GPIO as GPIO
import random

class TemperatureSensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub
    
    def RetrieveTemperature(self):
        return 1
    
    def CalculateTemperature(self,data):
        if self.stub:
            return random.randint(0,30)
        else:
            return 1

class HumiditySensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub
    
    def RetrieveHumidity(self):
        a=1

    def CalculateHumidityRate(self,data):
        if self.stub:
            return random.randint(0,100)
        else:
            return 1

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
    
    def RetrieveLuminosity(self):
        return 1

    def CalculateLuminosityRate(self,data):
        if self.stub:
            return random.randint(0,100)
        else:
            return 1