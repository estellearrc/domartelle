#!/usr/bin/python
#import RPi.GPIO as GPIO
import random
import sys
#import Adafruit_DHT

class TemperatureSensor :
    number = 0
    def __init__(self,pin,stub, room):
        TemperatureSensor.number += 1
        self.type = "temperature"
        self.number = TemperatureSensor.number
        self.pin = pin
        self.room = room
        self.stub = stub
        self.value = -1
    
    def RetrieveTemperature(self):
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

class HumiditySensor :
    number = 0
    def __init__(self,pin,stub,room):
        HumiditySensor.number += 1
        self.type = "humidity"
        self.number = HumiditySensor.number
        self.pin = pin
        self.stub = stub
        self.room = room
        self.value = -1

    def RetrieveHumidity(self):
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

class MotionSensor :
    number = 0
    def __init__(self,pin,stub,room):
        MotionSensor.number += 1
        self.type = "motion"
        self.number = MotionSensor.number
        self.pin = pin
        self.stub = stub
        self.room = room
        self.value = -1
    
    def RetrieveMovement(self):
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

class LuminositySensor :
    number = 0
    def __init__(self,stub, room):
        LuminositySensor.number += 1
        self.type = "luminosity"
        self.number = LuminositySensor.number
        self.stub = stub
        self.room = room
        self.value = -1

    def RetrieveLuminosity(self):
        if self.stub:
            self.value = random.randint(0,100)
            return self.value
        else:
            GPIO.setmode(GPIO.BOARD)
            GPIO.setwarnings(False)

            #fonction lisant les donnees SPI de la puce MCP3008, parmi 8 entrees, de 0 a 7
            def readadc(adcnum, clockpin, mosipin, misopin, cspin):
                if ((adcnum > 7) or (adcnum < 0)):
                    return -1
                GPIO.output(cspin, True)
                GPIO.output(clockpin, False)  # start clock low
                GPIO.output(cspin, False)    # bring CS low
                commandout = adcnum
                commandout |= 0x18  # start bit + single-ended bit
                commandout <<= 3    # we only need to send 5 bits here
                for i in range(5):
                    if (commandout & 0x80):
                        GPIO.output(mosipin, True)
                    else:
                        GPIO.output(mosipin, False)
                    commandout <<= 1
                    GPIO.output(clockpin, True)
                    GPIO.output(clockpin, False)
                adcout = 0
                # read in one empty bit, one null bit and 10 ADC bits
                for i in range(12):
                    GPIO.output(clockpin, True)
                    GPIO.output(clockpin, False)
                    adcout <<= 1
                    if (GPIO.input(misopin)):
                        adcout |= 0x1
                GPIO.output(cspin, True)
                adcout /= 2    # first bit is 'null' so drop it
                return adcout

            #numeros des pins utiles
            SPICLK = 23
            SPIMISO = 21
            SPIMOSI = 19
            SPICS = 24
            # definition de l'interface SPI
            GPIO.setup(SPIMOSI, GPIO.OUT)
            GPIO.setup(SPIMISO, GPIO.IN)
            GPIO.setup(SPICLK, GPIO.OUT)
            GPIO.setup(SPICS, GPIO.OUT)
            #definition du ADC utilise (broche du MCP3008). Cette valeur peut aller de 0 a 7.
            adcnum = 0
            # Lecture de la valeur brute du capteur
            read_adc0 = readadc(adcnum, SPICLK, SPIMOSI, SPIMISO, SPICS)
            # conversion de la valeur brute lue en milivolts = ADC * ( 3300 / 1024 )
            millivolts = read_adc0 * ( 3300.0 / 1024.0)
            print("La tension en millivots est :"+ str(millivolts))
            return read_adc0

    
