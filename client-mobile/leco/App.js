import React from "react";
import MainView from "./components/MainView";

// Create a stateless function component rather than a class-based one
import { YellowBox } from "react-native";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings(["Setting a timer", "Warning:"]);
  }
  render() {
    return <MainView />;
  }
}
