import React from "react";
import SocketIOClient from "socket.io-client";
import { StyleSheet, Text, View, Button, Switch, Slider } from "react-native";

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
      switch1Value: 0,
      switch2Value: 0,
      switch3Value: 0
    };
  }

  changStateLed(switchValue) {
    if (switchValue === 0) {
      switchValue = 1;
    } else {
      switchValue = 0;
    }
    sendInstruction("instruction_led");
  }

  sendInstruction(type, pin, state) {
    socket.emit("instruction_to_rpi", type, pin, state);
  }

  render() {
    return (
      <View style={{ flxDirection: "column", flex: 1 }}>
        <View style={styles.container}>
          <Switch
            style={styles.switch}
            value={this.state.switch1Value}
            onValueChange={this.changStateLed}
          />
          <Switch
            style={styles.switch}
            value={this.state.switch2Value}
            onValueChange={this.changStateLed}
          />
          <Switch
            style={styles.switch}
            value={this.state.switch3Value}
            onValueChange={this.changState}
          />
        </View>
        <View style={styles.containerJauge}>
          <Slider
            value={this.state.degree}
            onValueChange={value => this.setState({ value })}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    marginTop: 50
  },
  switch: {
    width: 80,
    height: 50,
    marginTop: 30
  },
  containerJauge: {
    flex: 1,
    orientation: "vertical"
  }
});
