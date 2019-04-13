from socketIO_client_nexus import SocketIO

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
	
def data_received(type,data):
    """Recoit les donnees provenant du cloud Heroku, les sauvegarde en local et les affiche"""
    #save_data(type,data)
    display_data(type,data)
    #display_data_10_days(type)
    
def display_data(type,data):
    """Affiche les donnees unitaires"""
    if type == "temperature":
        print("La temperature dans la maison est "+ str(data) +" degre Celsius")
    elif type == "luminosity":
        print("Le taux de luminosite dans la maison est de "+ str(data) +" %")
    elif type == "movement":
        print("Une personne est presente dans la maison...")
    elif type == "humidity":
        print("Le taux d'humidite dans la maison est de "+ str(data) +" %")
    else:
        print("Format de donnees non reconnu")

def display_data_10_days(type):
    """Affiche la tendance des donnees du type demande sur 10 jours"""

def save_data(type,data):
    """Sauvegarde les donnees dans un fichier json """

def main():
    
    socketIO.on('connect', connect)

    socketIO.on('reconnect', reconnect)

    socketIO.on('disconnect', on_disconnect)

    socketIO.on('data_to_desktop', data_received)

    # Keeps the socket open indefinitely...
    socketIO.wait()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Killed by user')
        sys.exit(0)



