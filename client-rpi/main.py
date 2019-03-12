import os, logging, subprocess

from socketIO_client_nexus import SocketIO #installer dans la Rpi voir dans README de Raph 

import led
import servos


logging.getLogger('socketIO-client').setLevel(logging.DEBUG)
socketIO = SocketIO('https://domartelle.herokuapp.com')

#####
 

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
    if type == "instruction_led":
        led.instruction(pin,state)
    elif type == "instruction_servos" :
        servos.instruction(pin,state)



    #nao_scripts.instruction(tts, rp, args)

def send_data(type,data):
    """Envoie les données sur le cloud Heroku"""
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

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Killed by user')
        sys.exit(0)