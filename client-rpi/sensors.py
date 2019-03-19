#!/usr/bin/python
import RPi.GPIO as GPIO

class TemperatureSensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub
    
    def RetrieveTemperature(self):
        a=1
    
    def CalculateTemperature(self,data):
        a=1

class HumiditySensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub
    
    def RetrieveHumidity(self):
        a=1

    def CalculateHumidityRate(self,data):
        a=1

class MovementSensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub
    
    def RetrieveMovement(self):
        a=1

class LuminositySensor :
    def __init__(self,pin,stub):
        self.pin = pin
        self.stub = stub
    
    def RetrieveLuminosity(self):
        a=1

    def CalculateLuminosityRate(self,data):
        a=1