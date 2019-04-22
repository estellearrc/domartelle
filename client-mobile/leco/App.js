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
    /* socket.once('data_to_terminal', this.initializeApp); */
    this.state = {
      actionneurs: [false, false, false, false, 0]
    };
  }

  initializeApp(type, room, id, value) {
    /* for(var i =0;i< this.state.actionneurs.length;i++){
     */
    console.log("Coucou Z");
  }

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

  sendInstructionServo(id, copieActionneurs) {
    this.changStateActionneur(copieActionneurs);
    console.log("Sending...");
    if (this.state.actionneurs[id - 1] === true) {
      socket.emit("instruction_to_rpi", id, 7);
    } else {
      socket.emit("instruction_to_rpi", id, 5);
    }
  }

  sendInstructionLed(id, copieActionneurs) {
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
                  this.sendInstructionLed(1, copieActionneurs);
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
                  this.sendInstructionLed(2, copieActionneurs);
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
                  this.sendInstructionLed(3, copieActionneurs);
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
                  this.sendInstructionServo(4, copieActionneurs);
                }}
              >
                {this.displayDoorImage(copieActionneurs[3])}
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.containerJauge,
                {
                  transform: [{ rotateZ: "-90deg" }],
                  alignSelf: "center"
                }
              ]}
            >
              <Slider
                value={copieActionneurs[4]}
                maximumValue={75}
                step={10}
                onValueChange={value => {
                  copieActionneurs[4] = value;
                }}
              />
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
    flex: 1
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
    width: 120,
    height: 180,
    marginLeft: 20,
    marginTop: 20
  }
});
