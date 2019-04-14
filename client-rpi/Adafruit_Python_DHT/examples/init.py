import sys, os, logging, subprocess, time
from actuators import Led, Servomotor
from sensors import TemperatureSensor, HumiditySensor, LuminositySensor, MovementSensor
from socketIO_client_nexus import SocketIO #installer dans la Rpi voir dans README de Raph 


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
    print("bres is my new velvet flower")
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
    socketIO.emit('data_to_desktop',type, data)

def main():
    t1 = TemperatureSensor(4,False)
    h1 = HumiditySensor(4,False)
    l1 = LuminositySensor(False)
    m1 = MovementSensor(11,False)
    while True:
        send_data('temperature',t1.RetrieveTemperature())
        send_data('humidity',h1.RetrieveHumidity()) 
        send_data('luminosity',l1.RetrieveLuminosity())
        send_data('movement',m1.RetrieveMovement())
        time.sleep(10)
    
    socketIO.on('connect', connect)

    socketIO.on('reconnect', reconnect)

    socketIO.on('disconnect', on_disconnect)

    socketIO.on('instruction_to_rpi', instruction_received)

    # Keeps the socket open indefinitely...
    socketIO.wait()



if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Killed by user')
        sys.exit(0)
