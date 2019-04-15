import sys, os, logging, subprocess, time
import json
from actuators import Led, Servomotor
from sensors import TemperatureSensor, HumiditySensor, LuminositySensor, MotionSensor
from socketIO_client_nexus import SocketIO #installer dans la Rpi voir dans README de Raph 


socketIO = SocketIO('https://domartelle-server.herokuapp.com')

actuators = []
sensors = []

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

def objToJSON(obj):
    with open('config.json','w',encoding='utf-8') as f:
        json.dump(obj, f, default=lambda o: o.__dict__)

def JSONToObj():
    with open('config.json','r') as f:
        obj_dict = json.load(f)
    for obj in obj_dict:
        if(obj["type"] == "led"):
            pin = obj["pin"]
            type = obj["type"]
            room = obj["room"]
            state = obj["state"]
            actuators.append(Led(pin,type,room,state))
        elif(obj["type"] == "servo"):
            pin = obj["pin"]
            type = obj["type"]
            room = obj["room"]
            state = obj["state"]
            actuators.append(Servomotor(pin,type,room,state))
        elif(obj["type"] == "temperature"):
            pin = obj["pin"]
            room = obj["room"]
            stub = obj["stub"]
            sensors.append(TemperatureSensor(pin,stub,room))
        elif(obj["type"] == "humidity"):
            pin = obj["pin"]
            room = obj["room"]
            stub = obj["stub"]
            sensors.append(HumiditySensor(pin,stub,room))
        elif(obj["type"] == "luminosity"):
            room = obj["room"]
            stub = obj["stub"]
            sensors.append(LuminositySensor(stub,room))
        elif(obj["type"] == "motion"):
            pin = obj["pin"]
            room = obj["room"]
            stub = obj["stub"]
            sensors.append(MotionSensor(pin,stub,room))
        else:
            print("Unknown type object")

def instruction_received(type,pin,state):
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
    t1 = TemperatureSensor(4,False,"living room")
    h1 = HumiditySensor(4,False,"bathroom")
    l1 = LuminositySensor(False,"bedroom")
    m1 = MotionSensor(11,False,"study")
    led1 = Led(29,"living room",1)
    led2 = Led(33, "kitchen",0)
    led3 = Led(38, "entrance",1)
    servo1 = Servomotor(40, "entrance",0)
    servo2 = Servomotor(37, "living room",0)
    while True:
        send_data('temperature',t1.RetrieveTemperature())
        send_data('humidity',h1.RetrieveHumidity()) 
        send_data('luminosity',l1.RetrieveLuminosity())
        send_data('motion',m1.RetrieveMovement())
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
