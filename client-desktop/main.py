import SocketIOClient from "socket.io-client"

socket = SocketIOClient("https://domartelle.herokuapp.com", {})

def receive_data(type,data):
    """Reçoit les données provenant du cloud Heroku, les sauvegarde en local et les affiche"""
    save_data(type,data)
    display_data(type,data)
    display_data_10_days(type)
    
def display_data(type,data):
    """Affiche les données unitaires"""
    if type == "temperature":
        print("La température dans la maison est "+ data +" °C")
    elif type == "luminosity":
        print("Le taux de luminosité dans la maison est de "+ data +" %")
    elif type == "movement":
        print("Une personne est présente dans la maison...")
    elif type == "humidity":
        print("Le taux d'humidité dans la maison est de "+ data +" %")
    else:
        print("Format de données non reconnu")

def display_data_10_days(type):
    """Affiche la tendance des données du type demandé sur 10 jours"""

def save_data(type,data):
    """Sauvegarde les données dans un fichier json"""
