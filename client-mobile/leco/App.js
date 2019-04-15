import React from "react";
import SocketIOClient from "socket.io-client";
import {
  StyleSheet,
  Text,
  View,
  Button,
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
    this.state = {
      actionneurs: [false, false, false, 0, 0]
    };
  }

  changStateActionneur(value) {
    this.setState({ value });
  }

  sendInstruction(type, place, state) {
    console.log("Sending...");
    socket.emit("instruction_to_rpi", type, place, state);
    console.log("Didn't crash");
  }

  render() {
    var copieActionneurs = this.state.actionneurs;
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
              onValueChange={!value}
            />
            <Switch
              style={styles.switch}
              value={copieActionneurs[1]}
              onValueChange={!value}
            />
            <Switch
              style={styles.switch}
              value={copieActionneurs[2]}
              onValueChange={!value}
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
