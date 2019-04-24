from socketIO_client_nexus import SocketIO
import sys, csv, time, os

#logging.getLogger('socketIO-client').setLevel(logging.DEBUG) #permet de debboguer les erreurs
socketIO = SocketIO("https://domartelle-server.herokuapp.com")

def connect():
    print('connected to the server')
    socketIO.emit('authentication', {'key': os.environ['SOCKET_KEY']})
    socketIO.on('authenticated', authenticated)
    socketIO.emit('computer Connected')

def reconnect():
    print('reconnected to the server')
    socketIO.emit('computer Connected')

def on_disconnect():
    print('disconnected')
    socketIO.emit('computer Disconnected')

def authenticated(*args):
    print('computer is connected to the Server')
	
def data_received(type,room,id,value):
    """Recoit les donnees provenant du cloud Heroku, les sauvegarde en local et les affiche"""
    save_data(type,room,value)
    display_data(type,room,id,value)
    
def display_data(type,room,id,value):
    """Affiche les donnees unitaires"""
    if type == "temperature":
        print("The temperature in the "+ room +" is "+ str(value) +" Celsius degrees")
    elif type == "luminosity":
        print("The luminosity in the "+ room +" is "+ str(value) +" %")
    elif type == "motion":
        if value == 1:
            print("Someone is in the "+ room +"...")
        else:
            print("The "+room+" is empty")
    elif type == "humidity":
        print("The humidity rate in the "+room+" is "+ str(value) +" %")
    elif type == "led":
        if value == 1:
            print("The light in the "+room+" is on")
        else:
            print("The light in the "+room+" is off")
    elif type == "servo":
        if value == 0:
            print("The door or the window in the "+room+" is closed")
        else:
            print("The door or the window in the "+room+" is open")
    else:
        print("Unknown data type")

def save_data(type,room,value):
    """Sauvegarde les donnees dans un fichier csv """
    path = 'logs/'+ str(type) + '_log.csv'
    with open(path,'ab') as f:
        writer = csv.writer(f,delimiter=',') 
        timestamp = int(time.time())
        writer.writerow([timestamp,value,room])
        f.close()

def main():
    
    socketIO.on('connect', connect)

    socketIO.on('reconnect', reconnect)

    socketIO.on('disconnect', on_disconnect)

    socketIO.on('data_to_terminal', data_received)

    # Keeps the socket open indefinitely...
    socketIO.wait()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Killed by user')
        sys.exit(0)



