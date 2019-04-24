#!/usr/bin/python
import RPi.GPIO as GPIO
import random
import sys
import Adafruit_DHT
import smbus
import time

class Sensor:
    id = 0
    def __init__(self,stub,room):
        Sensor.id += 1
        self.id = Sensor.id
        self.room = room
        self.stub = stub
        self.value = -1


class TemperatureSensor(Sensor) :
    def __init__(self,pin,stub,room):
        self.type = "temperature"
        self.pin = pin
        Sensor.__init__(self,stub,room)
    
    def RetrieveValue(self):
        if self.stub:
            self.value = random.randint(0,30)
            return self.value
        else:
            sensor = Adafruit_DHT.DHT11
            temperature = Adafruit_DHT.read_retry(sensor, self.pin)[1]
            if temperature is not None:
                self.value = temperature
                return self.value
            else:
                print('Failed to get reading temperature. Check GPIO pins and try again!')
                sys.exit(1)

class HumiditySensor(Sensor) :
    def __init__(self,pin,stub,room):
        self.type = "humidity"
        self.pin = pin
        Sensor.__init__(self,stub,room)

    def RetrieveValue(self):
        if self.stub:
            self.value = random.randint(0,100)
            return self.value
        else:
            sensor = Adafruit_DHT.DHT11
            humidity = Adafruit_DHT.read_retry(sensor, self.pin)[0]
            if humidity is not None:
                self.value = humidity
                return self.value
            else:
                print('Failed to get reading humidity. Check GPIO pins and try again!')
                sys.exit(1)

class MotionSensor(Sensor) :
    def __init__(self,pin,stub,room):
        self.type = "motion"
        self.pin = pin
        Sensor.__init__(self,stub,room)
    
    def RetrieveValue(self):
        if self.stub:
            self.value = random.randint(0,1)
            return self.value
        else:
            GPIO.setwarnings(False)
            GPIO.setmode(GPIO.BOARD)
            GPIO.setup(self.pin, GPIO.IN)  
            motion = GPIO.input(self.pin)
            self.value = motion
            return self.value

class LuminositySensor(Sensor) :
    def __init__(self,stub,room):
        self.type = "luminosity"
        Sensor.__init__(self,stub,room)

    def RetrieveValue(self):
        if self.stub:
            self.value = random.randint(0,100)
            return self.value
        else:
            # Get I2C bus
            bus = smbus.SMBus(1)

            # TSL2561 address, 0x39(57)
            # Select control register, 0x00(00) with command register, 0x80(128)
            #		0x03(03)	Power ON mode
            bus.write_byte_data(0x39, 0x00 | 0x80, 0x03)
            # TSL2561 address, 0x39(57)
            # Select timing register, 0x01(01) with command register, 0x80(128)
            #		0x02(02)	Nominal integration time = 402ms
            bus.write_byte_data(0x39, 0x01 | 0x80, 0x02)

            time.sleep(0.5)

            # Read data back from 0x0C(12) with command register, 0x80(128), 2 bytes
            # ch0 LSB, ch0 MSB
            data = bus.read_i2c_block_data(0x39, 0x0C | 0x80, 2)

            # Read data back from 0x0E(14) with command register, 0x80(128), 2 bytes
            # ch1 LSB, ch1 MSB
            data1 = bus.read_i2c_block_data(0x39, 0x0E | 0x80, 2)

            # Convert the data
            ch0 = data[1] * 256 + data[0]
            ch1 = data1[1] * 256 + data1[0]

            return (ch0 - ch1)

    
