/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
//import Geth from 'react-native-geth';
import './global';

//import Web3 from './web3.min';
import { ethers } from 'ethers';

export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        let infuraProvider = new ethers.providers.InfuraProvider('rinkeby','5f3d75af05a14b1590570019d26675d6');
        let httpProvider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/5f3d75af05a14b1590570019d26675d6');
        let provider = new ethers.providers.FallbackProvider([
            infuraProvider,
            httpProvider,
        ]);
        let wallet = ethers.Wallet.createRandom(ethers.utils.randomBytes(128));
        wallet = wallet.connect(provider);
        //provider.listAccounts().then(result => console.log(result));
        console.log(wallet.address);
        wallet.getBalance().then((balance) => {
            //console.log
            this.setState({
                balance,
            })
        });

        this.state = {
            address: wallet.address,
            balance: 0,
        }
    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>React Native Web3 App</Text>
          {/*<Text style={styles.instructions}>{`Web3 Version: ${this.web3.version}`}</Text>*/}
          {/*<Text style={styles.instructions}>{`Network: ${this.state.netId}`}</Text>*/}
          {/*<Text style={styles.instructions}>{`Provider: ${this.web3.currentProvider.host}\n`}</Text>*/}
          <Text style={styles.instructions}>{`Account:\t${this.state.address || 'No Account'}`}</Text>
          <Text style={styles.instructions}>{`Balance:\t${this.state.balance}`}</Text>
          {/*<Text style={styles.instructions}>{`Block #${this.state.latestBlockNumber}`}</Text>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
