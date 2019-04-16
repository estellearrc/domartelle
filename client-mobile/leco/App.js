import React from "react";
import SocketIOClient from "socket.io-client";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Slider,
  ImageBackground
} from "react-native";

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
    /* socket.on("data_to_terminal", this.initializeApp); */
    this.state = {
      actionneurs: [false, false, false, 0, 0]
    };
  }

  initializeApp() {}

  changStateActionneur(copieActionneurs) {
    this.setState({ actionneurs: copieActionneurs });
  }

  sendInstruction(id, copieActionneurs) {
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
    return (
      <View style={{ flexDirection: "column", flex: 1 }}>
        <ImageBackground
          source={require("./images/fond.jpg")}
          style={styles.viewBackGround}
        >
          <View style={styles.container}>
            <Switch
              style={styles.switch}
              value={copieActionneurs[0]}
              onValueChange={value => {
                copieActionneurs[0] = value;
                console.log("coucou : " + copieActionneurs[0]);
                this.sendInstruction(1, copieActionneurs);
              }}
            />

            <Switch
              style={styles.switch}
              value={copieActionneurs[1]}
              onValueChange={() => {
                this.sendInstruction(2, copieActionneurs);
              }}
            />
            <Switch
              style={styles.switch}
              value={copieActionneurs[2]}
              onValueChange={() => {
                this.sendInstruction(3, copieActionneurs);
              }}
            />
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
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
                value={copieActionneurs[3]}
                onValueChange={value => this.setState({ value })}
              />
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
                onValueChange={value => this.setState({ value })}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 50,
    marginLeft: 30
  },
  switch: {
    width: 80,
    height: 50,
    marginTop: 30
  },
  containerJauge: {
    flex: 1
  },
  viewBackGround: {
    flex: 1
  }
});
