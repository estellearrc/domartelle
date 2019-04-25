import React from "react";
import SocketIOClient from "socket.io-client";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Slider,
  Image,
  Button,
  TouchableOpacity
} from "react-native";
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

  initializeApp = (type, room, id, value) => {
    console.log("Coucou Z");
    var copieTemporaireActionneurs = this.state.actionneurs;
    console.log("id : " + id);
    console.log("length tab : " + this.state.actionneurs.length);
    if (type === "led" || type === "servo") {
      console.log("INNNNNN");
      if (value === 1 && type == "led") {
        copieTemporaireActionneurs[id - 1] = true;
        console.log("true");
      } else {
        if (value === 0 && type === "led") {
          copieTemporaireActionneurs[id - 1] = false;
          console.log("false");
        } else {
          if (id === 4) {
            console.log("value door : " + value);
            if (value === 90) {
              copieTemporaireActionneurs[id - 1] = true;
            } else {
              copieTemporaireActionneurs[id - 1] = false;
            }
          } else {
            copieTemporaireActionneurs[
              id - 1
            ] = value; /* Math.round(
              (value - 2) / (10 / 180) */
          }
        }

        console.log(value);
      }

      console.log("salut : " + this.state.actionneurs);
      this.setState({
        actionneurs: copieTemporaireActionneurs
      });
    }
  };

  displayDoorImage(actionneur) {
    var sourceImage = require("../images/closed.png");
    /* console.log(message.membersWhoLiked); */

    if (actionneur === true) {
      sourceImage = require("../images/open.png");
    }
    return <Image style={styles.doorImage} source={sourceImage} />;
  }

  displayLightImage(actionneur) {
    var sourceImage = require("../images/lightbulbOff.png");
    /* console.log(message.membersWhoLiked); */

    if (actionneur === true) {
      sourceImage = require("../images/lightbulbOn.png");
    }
    return <Image style={styles.lightImage} source={sourceImage} />;
  }

  changStateActionneur(copieActionneurs) {
    this.setState({ actionneurs: copieActionneurs });
  }

  sendInstructionDoor(id, copieActionneurs) {
    this.changStateActionneur(copieActionneurs);
    console.log("Sending...");
    if (this.state.actionneurs[id - 1] === true) {
      socket.emit("instruction_to_rpi", id, 90);
      console.log(id);
      console.log("OPENED");
    } else {
      socket.emit("instruction_to_rpi", id, 0);
      console.log(id);
      console.log("CLOSED");
    }
    console.log("Didn't crash");
  }

  sendInstructionCurtains(id, copieActionneurs) {
    /* const value = (2 + (10 / 180) * copieActionneurs[id - 1]).toFixed(2); */
    this.changStateActionneur(copieActionneurs);
    socket.emit("instruction_to_rpi", id, this.state.actionneurs[id - 1]);
  }

  sendInstructionLights(id, copieActionneurs) {
    this.changStateActionneur(copieActionneurs);
    console.log("Sending...");
    if (this.state.actionneurs[id - 1] === false) {
      socket.emit("instruction_to_rpi", id, 0);
      console.log(id);
      console.log("OFF");
    } else {
      socket.emit("instruction_to_rpi", id, 1);
      console.log(id);
      console.log("ON");
    }

    console.log("Didn't crash");
  }

  render() {
    var copieActionneurs = this.state.actionneurs;

    console.log("start" + copieActionneurs[0]);
    console.log("door : " + copieActionneurs[3]);
    return (
      <View style={{ flexDirection: "column", flex: 1 }}>
        <Header title="LECO" />
        <View
          /* source={require("../images/fond.jpg")} */
          style={styles.viewBackGround}
        >
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
                  console.log("coucou : " + copieActionneurs[0]);
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
                  console.log("coucou : " + copieActionneurs[1]);
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
                  console.log("coucou : " + copieActionneurs[2]);
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
                <Text style={styles.titleDoor}> Porte d'entrée </Text>
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
                <Text style={styles.titleDoor}> Volet séjour </Text>
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
  titleDoor: {
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
