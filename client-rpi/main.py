import os, time, logging, subprocess

from socketIO_client_nexus import SocketIO
from naoqi import ALProxy




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

def instruction_received(*args):
    """
    instr = "python " + args[0] + ".py"
    process = subprocess.Popen(instr.split(), stdout=subprocess.PIPE) #add param cwd='/path/to/folder' for specified script execution localisation
    output, error = process.communicate()
    
    
    try:
        print("instruction received : " + args[0])
    except TypeError:
        print("instruction received : " + args[0]["0"])
        """

    nao_scripts.instruction(tts, rp, args)

def main():
    
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