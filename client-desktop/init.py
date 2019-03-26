from socketIO_client_nexus import SocketIO

socket = SocketIO("https://domartelle-server.herokuapp.com", {})

def receive_data(type,data):
    """Recoit les donnees provenant du cloud Heroku, les sauvegarde en local et les affiche"""
    save_data(type,data)
    display_data(type,data)
    display_data_10_days(type)
    
def display_data(type,data):
    """Affiche les donnees unitaires"""
    if type == "temperature":
        print("La temperature dans la maison est "+ data +" degre Celsius")
    elif type == "luminosity":
        print("Le taux de luminosite dans la maison est de "+ data +" %")
    elif type == "movement":
        print("Une personne est presente dans la maison...")
    elif type == "humidity":
        print("Le taux d'humidite dans la maison est de "+ data +" %")
    else:
        print("Format de donnees non reconnu")

def display_data_10_days(type):
    """Affiche la tendance des donnees du type demande sur 10 jours"""

def save_data(type,data):
    """Sauvegarde les donnees dans un fichier json """
