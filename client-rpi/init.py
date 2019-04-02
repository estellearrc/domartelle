import sys, os, logging, subprocess
from actuators import Led, Servomotor
from sensors import TemperatureSensor, HumiditySensor, LuminositySensor, MovementSensor
from socketIO_client_nexus import SocketIO #installer dans la Rpi voir dans README de Raph 


logging.getLogger('socketIO-client').setLevel(logging.DEBUG)
socketIO = SocketIO('https://domartelle-server.herokuapp.com')

led1 = Led(29)
led2 = Led(33)
led3 = Led(38)
servo1 = Servomotor(40)
servo2 = Servomotor(37)

def connect():
    print('connected to the server')
    socketIO.emit('authentication', {'key': os.environ['SOCKET_KEY']})
    socketIO.on('authenticated', authenticated)
    socketIO.emit('piConnected')

def reconnect():
    print('reconnected to the server')
    socketIO.emit('piConnected')

def on_disconnect():
    print('disconnected')
    socketIO.emit('piDisconnected')

def authenticated(*args):
    print('RPI is connected to the Server')

def instruction_received(type,pin,state):
    print("bres is my god")
    if type == "instruction_led":
        if pin == 29 :
            led1.instruction(pin,state)
        elif pin == 33 :
            led2.instruction(pin,state)
        else : 
            led3.instruction(pin,state)
    elif type == "instruction_servos" :
        if pin == 40 :
            servo1.instruction(pin,state)
        else : 
            servo2.instruction(pin,state)



    #nao_scripts.instruction(tts, rp, args)

def send_data(type,data):
    """Envoie les donnees sur le cloud Heroku"""
    toSend = type +";"+ data
    socketIO.emit('data_to_desktop',toSend)

def main():
    
    socketIO.on('connect', connect)

    socketIO.on('reconnect', reconnect)

    socketIO.on('disconnect', on_disconnect)

    socketIO.on('instruction_to_rpi', instruction_received)

    socketIO.on('data_to_desktop', send_data)

    # Keeps the socket open indefinitely...
    socketIO.wait()

    t1 = TemperatureSensor(7,True)
    t1.RetrieveTemperature()
    h1 = HumiditySensor(15,True)
    h1.RetrieveHumidity()
    l1 = LuminositySensor(16, True)
    l1.RetrieveLuminosity()
    m1 = MovementSensor(23,True)
    m1.RetrieveMovement()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Killed by user')
        sys.exit(0)
