import sys, os, logging, subprocess, time
import json, csv
from actuators import Led, Servomotor, Actuator
from sensors import Sensor, TemperatureSensor, HumiditySensor, LuminositySensor, MotionSensor
from socketIO_client_nexus import SocketIO #installer dans la Rpi voir dans README de Raph 


socketIO = SocketIO('https://domartelle-server.herokuapp.com')

actuators = []
sensors = []

# led1 = Led(29,"living room",1)
# actuators.append(led1)
# led2 = Led(33, "kitchen",0)
# actuators.append(led2)
# led3 = Led(38, "entrance",1)
# actuators.append(led3)
# servo1 = Servomotor(40, "entrance",0)
# actuators.append(servo1)
# servo2 = Servomotor(37, "living room",0)
# actuators.append(servo2)

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




def objToJSON():
    with open('config.json','w') as f:
        for actuator in actuators:
            json.dump(actuator, f, default=lambda o: o.__dict__, sort_keys=True)
            f.write('\n')
        for sensor in sensors:
            json.dump(sensor, f, default=lambda o: o.__dict__, sort_keys=True)
            f.write('\n')
        f.close()

def JSONToObj():
    with open('config.json', 'r') as f:
        for line in f:
            obj = json.loads(line)
            if(obj['type'] == "led"):
                pin = obj['pin']
                room = obj["room"]
                state = obj["state"]
                actuators.append(Led(pin,room,state))
            elif(obj["type"] == "servo"):
                pin = obj["pin"]
                room = obj["room"]
                state = obj["state"]
                actuators.append(Servomotor(pin,room,state))
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
        f.close()
  
def instruction_received(id,value):
    print("coucou Z")
    actuators[id-1].value = value
    write("set")
    read("set")
    print("FIN")



def send_data(type,room,id,value):
    """Envoie les donnees sur le cloud Heroku"""
    socketIO.emit('data_to_terminal',type, room, id, value)
def write(getOrSet):
    with open(getOrSet+'.csv','wb') as f:
        writer = csv.writer(f,delimiter=',') #quotechar='"', quoting=csv.QUOTE_MINIMAL
        for actuator in actuators:
            writer.writerow([actuator.type,actuator.room,actuator.id,actuator.value])
        for sensor in sensors:
            writer.writerow([sensor.type,sensor.room,sensor.id,sensor.value])
        f.close()

def read(getOrSet):
    with open(getOrSet+'.csv', 'r') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter = ',')
        for row in csv_reader:
            type = row[0]
            room = row[1]
            id = int(row[2])
            value = float(row[3])
            send_data(type,room,id,value)
            if(getOrSet == 'set'):
                if(type == "led" or type == "servo"):
                    launch_instruction(id,value)
        csv_file.close()


def launch_instruction(id,value):
    print(actuators[id-1])
    actuators[id-1].instruction(value)

def retrieve_data(n):
    """Recupere les donnees des capteurs toutes les n secondes"""
    for i in range(n):
        for sensor in sensors:
            sensor.value = sensor.RetrieveValue()
        write('get')
        read('get')
        time.sleep(n)

def main():
    # t1 = TemperatureSensor(4,False,"living room")
    # h1 = HumiditySensor(4,False,"bathroom")
    # l1 = LuminositySensor(False,"bedroom")
    # m1 = MotionSensor(11,False,"study")
    # sensors.append(t1)
    # sensors.append(h1)
    # sensors.append(l1)
    # sensors.append(m1)

    # objToJSON()
    
    print("Listening...")
    
    JSONToObj()
    
    print("Listening...")
    
    socketIO.on('connect', connect)

    socketIO.on('reconnect', reconnect)

    socketIO.on('disconnect', on_disconnect)

    socketIO.on('instruction_to_rpi', instruction_received)
    
    socketIO.on('launch_app', read)
    
    print("Listening...")
    
    retrieve_data(5)
    print("Listening...")

    # Keeps the socket open indefinitely...
    socketIO.wait()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Killed by user')
        sys.exit(0)
