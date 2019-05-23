/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome';

import  { connect } from 'react-redux';
import {
    setWalletAction,
    setEncryptedWalletAction,
    statusSavingAction,
    statusLoadingAction,
    statusReduxingAction,
    statusIdleAction,
    walletLoadingAction,
    walletIdleAction,
} from '../redux/actions';

import Nav from "./Nav";

class Account extends Component<Props> {
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

    generateWallet() {
        this.props.dispatch(walletLoadingAction());
        //I think this might be what is blocking
        let disconnectedWallet = this.props.ethers.Wallet.createRandom(this.props.ethers.utils.randomBytes(128));
        let wallet = disconnectedWallet.connect(this.props.provider);
        this.props.dispatch(setWalletAction(wallet));
        this.props.dispatch(walletIdleAction());
        return wallet;
    }

    //TODO: Move wallet functions to own file since code is repeated here and in Root
    loadEncryptedWallet() {
        this.props.dispatch(statusLoadingAction());
        AsyncStorage.getItem('encryptedWallet').then((encryptedWallet) => {
            if (encryptedWallet && encryptedWallet !== null) {
                this.props.dispatch(statusReduxingAction());
                //console.log(`Encrypted Wallet: ${JSON.stringify(encryptedWallet)}`);
                this.props.dispatch(setEncryptedWalletAction(encryptedWallet));
                this.props.dispatch(statusIdleAction());

                //Must manually reconnect wallet to provider...
                this.props.dispatch(walletLoadingAction());
                this.props.ethers.Wallet.fromEncryptedJson(encryptedWallet, 'password').then((disconnectedWallet) => {
                    let wallet = disconnectedWallet.connect(this.props.provider);
                    //console.log(wallet.provider);
                    this.props.dispatch(setWalletAction(wallet));
                    this.props.dispatch(walletIdleAction());
                });
            } else {
                console.error('Attempted to load wallet but none found.');
            }
        }).catch((err) => {
            console.error(err);
        });
    }

    // This will update store.encryptedWallet, but not store.wallet ***
    saveEncryptedWallet(encryptedWallet) {
        this.props.dispatch(statusSavingAction());
        AsyncStorage.setItem('encryptedWallet', encryptedWallet).then(() => {
            this.props.dispatch(statusReduxingAction());
            this.props.dispatch(setEncryptedWalletAction(encryptedWallet));
            this.props.dispatch(statusIdleAction());
            //TODO: Double-check that saved ew == store.ew?
        }).catch((err) => {
            console.error(err);
        });
    }

    render() {
        return (
            <View style={styles.outer}>
                <Nav history={this.props.history}/>
                <View style={styles.container}>
                    <Text style={styles.welcome}>External Account</Text>
                    <Text style={styles.instructions}>{`Wallet Status:\t${this.props.walletStatus}`}</Text>
                    <Text style={styles.instructions}>{`Account:\t${
                        this.props.wallet ?
                            this.props.wallet.address :
                            '--'}`
                    }</Text>
                    <Text style={styles.instructions}>{`Balance:\t${this.state.balance}`}</Text>
                    <Text style={styles.instructions}>{`Storage Status:\t${this.props.status}`}</Text>
                    <Text style={styles.instructions}>{`Encrypted Wallet:\t${this.props.encryptedWallet}`}</Text>
                    <Button onPress={() => {
                        let wallet = this.generateWallet();
                        wallet.encrypt('password').then((json) => {
                            this.saveEncryptedWallet(json);
                        });
                    }} title='Generate'/>
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
        status,
        walletStatus,
    } = walletReducer;
    return {
        wallet,
        encryptedWallet,
        status,
        walletStatus,
    };
};
export default connect(
    mapStateToProps,
)(Account);
