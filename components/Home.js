/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome';

import  { connect } from 'react-redux';
import { setWalletAction, setEncryptedWalletAction } from '../redux/actions';
import Nav from "./Nav";

class Home extends Component<Props> {
    constructor(props) {
        super(props);

        //Small state for async data
        if (this.props.wallet) {
            this.props.wallet.getBalance().then((balance) => {
                this.setState({
                    balance,
                })
            });
        }
        this.state = {
            balance: 0,
        }
    }

    saveEncryptedWallet(encryptedWallet) {
        console.log('Saving Wallet...');
        AsyncStorage.setItem('encryptedWallet', encryptedWallet).then(() => {
            console.log('Saved!');
            this.props.dispatch(setEncryptedWalletAction(encryptedWallet));

            this.props.ethers.Wallet.fromEncryptedJson(encryptedWallet, 'password').then((disconnectedWallet) => {
                let wallet = disconnectedWallet.connect(this.provider);
                //console.log(wallet.provider);
                this.props.dispatch(setWalletAction(wallet));
            });
        }).catch((err) => {
            console.error(err);
        });
    }

    render() {
        return (
            <View style={styles.outer}>
                <Nav history={this.props.history}/>
                <View style={styles.container}>
                    <Text style={styles.welcome}>Home</Text>
                    {/*<Text style={styles.instructions}>{`Web3 Version: ${this.web3.version}`}</Text>*/}
                    {/*<Text style={styles.instructions}>{`Network: ${this.state.netId}`}</Text>*/}
                    {/*<Text style={styles.instructions}>{`Provider: ${this.web3.currentProvider.host}\n`}</Text>*/}
                    <Text style={styles.instructions}>{`Account:\t${
                        this.props.wallet ?
                            this.props.wallet.address :
                            'No Account'}`
                    }</Text>
                    {/*<Text style={styles.instructions}>{`Block #${this.state.latestBlockNumber}`}</Text>*/}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outer: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    container: {
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

const mapStateToProps = (state) => {
    let { walletReducer } = state;
    let {
        wallet,
        encryptedWallet,
    } = walletReducer;
    return {
        wallet,
        encryptedWallet,
    };
};
export default connect(
    mapStateToProps,
)(Home);
