import React from "react";
import "./App.css";
import { EasyOnboarding } from "./components/EasyOnboarding";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      isConnected: false,
    };

    this.onConnected = this.onConnected.bind(this);
  }

  async onConnected() {
    this.setState({
      isConnected: true,
    });
  }

  render() {
    return (
      <div className="App">
        <h5>Easy MetaMask Onboarding dApp</h5>
        <h2> &nbsp; </h2>
        <EasyOnboarding onConnected={this.onConnected} />
        {this.state.isConnected && <h1>🚀</h1>}
      </div>
    );
  }
}

export default App;
