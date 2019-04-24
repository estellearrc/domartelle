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
import Header from "./components/Header";

//To dismiss the Websocket connection warning, apparently useless (cf. https://stackoverflow.com/questions/53638667/unrecognized-websocket-connection-options-agent-permessagedeflate-pfx)
console.ignoredYellowBox = ["Remote debugger"];
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings([
  "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
]);
//

const socket = SocketIOClient("https://domartelle-server.herokuapp.com", {});

export default class App extends React.Component {
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
            if (value === 7) {
              copieTemporaireActionneurs[id - 1] = true;
            }
            copieTemporaireActionneurs[id - 1] = false;
          } else {
            copieTemporaireActionneurs[id - 1] = value /* Math.round(
              (value - 2) / (10 / 180) */
            );
          }

          console.log(value);
        }
      }
      console.log("salut : " + this.state.actionneurs);
      this.setState({
        actionneurs: copieTemporaireActionneurs
      });
    }
  };

  displayDoorImage(actionneur) {
    var sourceImage = require("./images/closed-door.png");
    /* console.log(message.membersWhoLiked); */

    if (actionneur === true) {
      sourceImage = require("./images/open-door.png");
    }
    return <Image style={styles.doorImage} source={sourceImage} />;
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
    console.log("test : " + copieActionneurs[2]);
    return (
      <View style={{ flexDirection: "column", flex: 1 }}>
        <Header title="LECO" />
        <View
          source={require("./images/fond.jpg")}
          style={styles.viewBackGround}
        >
          <View style={styles.container}>
            <View style={styles.switchContainer}>
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
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                borderWidth: 0.5,
                borderColor: "gray"
              }}
            >
              <TouchableOpacity
                style={styles.door}
                onPress={() => {
                  copieActionneurs[3] = !copieActionneurs[3];
                  console.log("porte : " + copieActionneurs[3]);
                  this.sendInstructionDoor(4, copieActionneurs);
                }}
              >
                {this.displayDoorImage(copieActionneurs[3])}
              </TouchableOpacity>
            </View>
            <View style={styles.containerJauge}>
              <View
                style={{
                  flex: 4,
                  transform: [{ rotateZ: "-90deg" }]
                }}
              >
                <Slider
                  style={{ marginTop: 90 }}
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
                  alignSelf: "center",
                  marginTop: 20
                }}
              >
                <Text> {`${copieActionneurs[4]}°`}</Text>
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
    marginBottom: 20,
    alignSelf: "flex-end"
  },
  containerJauge: {
    flex: 1,
    flexDirection: "column"
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
    marginTop: 30,
    marginLeft: 5
  },
  door: {
    flex: 1
  },
  doorImage: {
    width: 90,
    height: 120,
    marginLeft: 20,
    marginTop: 50
  }
});
