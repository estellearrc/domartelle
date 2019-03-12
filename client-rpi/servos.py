import RPi.GPIO as GPIO

def instruction(pin,state):
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(pin,GPIO.OUT)
    pwm = GPIO.PWM(pin,50)
    pwm.start(state) #ici le state sera en pourcentage