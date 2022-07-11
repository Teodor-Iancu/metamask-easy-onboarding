import React from "react";
import MetaMaskOnboarding from "@metamask/onboarding";
import { RINKEBY_TESTNET_CHAIN_NAME, RINKEBY_TESTNET } from "./rpcs";

// Set network and network name
const ACTUAL_EVM_NETWORK = RINKEBY_TESTNET;
const ACTUAL_EVM_NAME = RINKEBY_TESTNET_CHAIN_NAME;

// Check if the chain Id is the same as the ACTUAL_EVM_NETWORK
const isACTUAL_EVM_NETWORK = (chainId) =>
  chainId && chainId.toLowerCase() === ACTUAL_EVM_NETWORK.chainId.toLowerCase();

export class EasyOnboarding extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts: [],
      chainId: null,
      onboarding: new MetaMaskOnboarding(),
    };

    this.connectMetaMask = this.connectMetaMask.bind(this);
    this.switchChain = this.switchChain.bind(this);
  }

  //Called immediately after a component is mounted. Setting state here will trigger re-rendering.
  componentDidMount() {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      this.connectMetaMask();

      // Update account if the user switches accounts in MetaMask
      window.ethereum.on("accountsChanged", (accounts) =>
        this.setState({ accounts })
      );

      // Reload site if the user selects a different chain
      window.ethereum.on("chainChanged", () => window.location.reload());

      // Set the chainId
      window.ethereum.on("connect", (connectInfo) => {
        const chainId = connectInfo.chainId;
        this.setState({ chainId });
        if (isACTUAL_EVM_NETWORK(chainId)) {
          // The user is now connected and has the correct chain selected.
          this.props.onConnected();
        }
      });
    }
  }

  connectMetaMask() {
    // Request user to connect to MetaMask
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => this.setState({ accounts }));
  }

  switchChain() {
    // Request user to switch to ACTUAL_EVM_NETWORK
    window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [ACTUAL_EVM_NETWORK],
    });
  }

  render() {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (this.state.accounts.length > 0) {
        this.state.onboarding.stopOnboarding();
      }
    }

    if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
      // If user has no MetaMask installed, start the onboarding process
      return (
        <div>
          <h3>🔔 To run this dApp please install MetaMask!</h3>
          <button onClick={this.state.onboarding.startOnboarding}>
            <h3>🦊 Click here to install MetaMask!</h3>
          </button>
        </div>
      );
    } else if (this.state.accounts.length === 0) {
      // If accounts is empty ask the user to connect to MetaMask.
      return (
        <div>
          <h3>🔔To run this dApp please connect to your MetaMask wallet!</h3>
          <button onClick={this.connectMetaMask}>
            <h3> 🦊 Connect Wallet </h3>
          </button>
        </div>
      );
    } else if (!isACTUAL_EVM_NETWORK(this.state.chainId)) {
      // If the chain id is not ACTUAL_EVM_NETWORK, ask the user to switch it
      return (
        <div>
          <p>
          🔔 Your wallet is connected, but to use this dApp<br/> you need to switch your MetaMask wallet 
            to {ACTUAL_EVM_NAME.chainName}!
          </p>
          <button onClick={this.switchChain}>
            <h3>🔁 Switch network to {ACTUAL_EVM_NAME.chainName}</h3>
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Your wallet is successfully connected to the right network ✔️</h3>
        </div>
      );
    }
  }
}
