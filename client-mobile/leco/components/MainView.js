import React from "react";
import SocketIOClient from "socket.io-client";
import { StyleSheet, Text, View, Switch, Slider, Image } from "react-native";
import Header from "./Header";

//To dismiss the Websocket connection warning, apparently useless (cf. https://stackoverflow.com/questions/53638667/unrecognized-websocket-connection-options-agent-permessagedeflate-pfx)
console.ignoredYellowBox = ["Remote debugger"];
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings([
  "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
]);
//

const socket = SocketIOClient("https://domartelle-server.herokuapp.com", {});

export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    socket.emit("launch_app", "set");

    this.state = {
      actionneurs: [false, false, false, false, 0]
    };
    socket.on("data_to_terminal", this.initializeApp);
  }

  //A chaque lancement de l'application, des données seront reçues. Cette fonction fait correspondres les actionneurs aux states correspondant en transformant leur valeur si nécessaire
  initializeApp = (type, room, id, value) => {
    var copieTemporaireActionneurs = this.state.actionneurs;
    console.log("id : " + id);
    console.log("length tab : " + this.state.actionneurs.length);
    if (type === "led" || type === "servo") {
      if (value === 1 && type == "led") {
        copieTemporaireActionneurs[id - 1] = true;
      } else {
        if (value === 0 && type === "led") {
          copieTemporaireActionneurs[id - 1] = false;
        } else {
          if (id === 4) {
            console.log("value door : " + value);
            if (value === 90) {
              copieTemporaireActionneurs[id - 1] = true;
            } else {
              copieTemporaireActionneurs[id - 1] = false;
            }
          } else {
            copieTemporaireActionneurs[id - 1] = value;
          }
        }
      }

      this.setState({
        actionneurs: copieTemporaireActionneurs
      });
    }
  };

  displayDoorImage(actionneur) {
    var sourceImage = require("../images/closed.png");

    if (actionneur === true) {
      sourceImage = require("../images/open.png");
    }
    return <Image style={styles.doorImage} source={sourceImage} />;
  }

  displayLightImage(actionneur) {
    var sourceImage = require("../images/lightbulbOff.png");

    if (actionneur === true) {
      sourceImage = require("../images/lightbulbOn.png");
    }
    return <Image style={styles.lightImage} source={sourceImage} />;
  }

  changStateActionneur(copieActionneurs) {
    this.setState({ actionneurs: copieActionneurs });
  }
  //Envoie instruction pour la porte
  sendInstructionDoor(id, copieActionneurs) {
    this.changStateActionneur(copieActionneurs);
    console.log("Sending...");
    if (this.state.actionneurs[id - 1] === true) {
      socket.emit("instruction_to_rpi", id, 90); //Si la porte est ouverte on fait pivoter le servomoteur de 90°
    } else {
      socket.emit("instruction_to_rpi", id, 0); //Si la porte est fermée on fait revenir le servomoteur à 0°
    }
    console.log("Didn't crash");
  }
  //Envoie l'angle d'ouverture pour le volet
  sendInstructionCurtains(id, copieActionneurs) {
    this.changStateActionneur(copieActionneurs);
    socket.emit("instruction_to_rpi", id, this.state.actionneurs[id - 1]);
  }

  //Envoie l'instruction pour les lumières
  sendInstructionLights(id, copieActionneurs) {
    this.changStateActionneur(copieActionneurs);
    console.log("Sending...");
    if (this.state.actionneurs[id - 1] === false) {
      socket.emit("instruction_to_rpi", id, 0);
    } else {
      socket.emit("instruction_to_rpi", id, 1);
    }

    console.log("Didn't crash");
  }

  render() {
    var copieActionneurs = this.state.actionneurs;
    return (
      <View style={{ flexDirection: "column", flex: 1 }}>
        <Header title="LECO" />
        <View style={styles.viewBackGround}>
          <View style={styles.container}>
            <View style={styles.switchContainer}>
              <View style={styles.lightbulb}>
                {this.displayLightImage(copieActionneurs[0])}
              </View>

              <Text style={styles.title}>Lumière séjour</Text>
              <Switch
                style={styles.switch}
                value={copieActionneurs[0]}
                onValueChange={value => {
                  copieActionneurs[0] = value;
                  this.sendInstructionLights(1, copieActionneurs);
                }}
              />
            </View>

            <View style={styles.switchContainer}>
              <View style={styles.lightbulb}>
                {this.displayLightImage(copieActionneurs[1])}
              </View>
              <Text style={styles.title}>Lumière cuisine</Text>
              <Switch
                style={styles.switch}
                value={copieActionneurs[1]}
                onValueChange={value => {
                  copieActionneurs[1] = value;
                  this.sendInstructionLights(2, copieActionneurs);
                }}
              />
            </View>
            <View style={styles.switchContainer}>
              <View style={styles.lightbulb}>
                {this.displayLightImage(copieActionneurs[2])}
              </View>
              <Text style={styles.title}>Lumière entrée</Text>
              <Switch
                style={styles.switch}
                value={copieActionneurs[2]}
                onValueChange={value => {
                  copieActionneurs[2] = value;
                  this.sendInstructionLights(3, copieActionneurs);
                }}
              />
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={styles.containerDoor}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center"
                }}
              >
                <Text style={styles.titleServo}> Porte d'entrée </Text>
                <Switch
                  style={styles.switchDoor}
                  value={copieActionneurs[3]}
                  onValueChange={() => {
                    copieActionneurs[3] = !copieActionneurs[3];
                    console.log("porte : " + copieActionneurs[3]);
                    this.sendInstructionDoor(4, copieActionneurs);
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  marginBottom: 100
                }}
              >
                {this.displayDoorImage(copieActionneurs[3])}
              </View>
            </View>
            <View style={styles.containerJauge}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center"
                }}
              >
                <Text style={styles.titleServo}> Volet séjour </Text>
              </View>
              <View style={styles.jauge}>
                <View
                  style={{
                    flex: 2
                  }}
                >
                  <Slider
                    width={190}
                    style={{
                      transform: [{ rotateZ: "-90deg" }],
                      marginTop: 90,
                      alignSelf: "center"
                    }}
                    value={copieActionneurs[4]}
                    maximumValue={180}
                    step={10}
                    onValueChange={value => {
                      copieActionneurs[4] = value;
                      console.log(copieActionneurs[4]);
                      this.sendInstructionCurtains(5, copieActionneurs);
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center"
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "flex-start"
                    }}
                  >
                    {" "}
                    {`${copieActionneurs[4]}°`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  switch: {
    flex: 1,
    width: 80,
    height: 50,
    marginBottom: 15,
    alignSelf: "flex-end"
  },
  containerJauge: {
    flex: 1,
    flexDirection: "column"
  },
  jauge: {
    flex: 5,
    flexDirection: "row"
  },
  viewBackGround: {
    flex: 1
  },
  switchContainer: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderColor: "gray",
    flexDirection: "row"
  },
  title: {
    flex: 3,
    fontSize: 25,
    color: "gray",
    marginTop: 35,
    marginLeft: 5
  },
  containerDoor: {
    flex: 1,
    flexDirection: "column",
    borderWidth: 0.5,
    borderColor: "gray"
  },
  switchDoor: {
    flex: 1,
    transform: [{ scaleX: 1.2 }, { scaleY: 1.0 }],
    alignSelf: "center",
    marginTop: 10
  },
  doorImage: {
    width: 140,
    height: 140,
    marginLeft: 20,
    marginTop: 50
  },
  titleServo: {
    marginTop: 5,
    fontSize: 25,
    color: "gray"
  },
  lightImage: {
    width: 50,
    height: 50
  },
  lightbulb: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
