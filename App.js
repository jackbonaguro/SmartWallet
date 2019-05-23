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

import Web3 from './web3.min';

export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        //console.log('constructor');
        this.state = {
            latestBlockNumber: undefined,
            netId: undefined,
        };
        this.web3 = new Web3();
        this.web3.setProvider(new this.web3.providers.HttpProvider('https://rinkeby.infura.io/v3/5f3d75af05a14b1590570019d26675d6'));
        this.web3.eth.getAccounts().then(console.log).catch(console.error);
        this.web3.eth.getBlock('latest').then((block) => {
            this.setState({
                latestBlockNumber: block.number,
            });
        });
        this.web3.eth.net.getId().then((netId) => {
            this.setState({
                netId,
            });
        });
        let account = this.web3.eth.accounts.create(this.web3.utils.randomHex(32));
        console.log(account);
    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>React Native Web3 App</Text>
          <Text style={styles.instructions}>{`Web3 Version: ${this.web3.version}`}</Text>
          <Text style={styles.instructions}>{`Network: ${this.state.netId}`}</Text>
          <Text style={styles.instructions}>{`Provider: ${this.web3.currentProvider.host}\n`}</Text>
          <Text style={styles.instructions}>{`Account: ${this.web3.eth.defaultAccount || 'No Account'}`}</Text>
          <Text style={styles.instructions}>{`Block #${this.state.latestBlockNumber}`}</Text>
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
