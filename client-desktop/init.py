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
    #save_data(type,value)
    display_data(type,room,id,value)
    #n = 7
    #display_data_n_days(type, n)
    
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

def display_data_n_days(type, n):
    """Affiche la tendance des donnees du type demande sur n jours"""

def save_data(type,value):
    """Sauvegarde les donnees dans un fichier csv """
    path = str(type) + '_log.csv'
    with open(path,'wb') as f:
        getWriter = csv.writer(f,delimiter=',')
        f.seek(0,2) #place le curseur a la fin du fichier
        timestamp = int(time.time())
        getWriter.writerow([timestamp,value])
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



