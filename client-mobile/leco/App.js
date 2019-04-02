import React from "react";
import SocketIOClient from "socket.io-client";
import { StyleSheet, Text, View, Button } from "react-native";

//To dismiss the Websocket connection warning, apparently useless (cf. https://stackoverflow.com/questions/53638667/unrecognized-websocket-connection-options-agent-permessagedeflate-pfx)
console.ignoredYellowBox = ["Remote debugger"];
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings([
  "Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?"
]);
//

const socket = SocketIOClient("https://remote-nao.herokuapp.com", {});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      switch1Value: 0,
      switch2Value: 0,
      switch3Value: 0
    };
  }

  changState(switchValue) {
    if (switchValue === 0) {
      switchValue = 1;
    } else {
      switchValue = 0;
    }
    sendInstruction();
  }

  sendInstruction = {type,pin,state} => {
    socket.emit("instruction_to_rpi", type,pin,state);
  };

  render() {
    return (
      <View style={styles.container}>
        <Switch value={switch1Value} onValueChange={this.changState} />
        <Switch value={switch2Value} onValueChange={this.changState} />
        <Switch value={switch3Value} onValueChange={this.changState} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
