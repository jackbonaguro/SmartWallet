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
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";

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
        return new Promise((resolve) => {
            //I think this might be what is blocking
            let disconnectedWallet = this.props.ethers.Wallet.createRandom(this.props.ethers.utils.randomBytes(128));
            let wallet = disconnectedWallet.connect(this.props.provider);
            this.props.dispatch(setWalletAction(wallet));
            this.props.dispatch(walletIdleAction());
            resolve(wallet);
        });
    }

    //TODO: Move wallet functions to own file since code is repeated here and in Root
    loadEncryptedWallet() {
        this.props.dispatch(statusLoadingAction());
        AsyncStorage.getItem('privateKey').then((encryptedWallet) => {
            if (encryptedWallet && encryptedWallet !== null) {
                this.props.dispatch(statusReduxingAction());
                //console.log(`Encrypted Wallet: ${JSON.stringify(privateKey)}`);
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
        AsyncStorage.setItem('privateKey', encryptedWallet).then(() => {
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
                <View style={{
                    justifyContent: 'center',
                    flex: 1,
                    //backgroundColor: '#d0d',
                    //padding: 10,
                }}>
                    <View style={[styles.container, styles.shadow3]}>
                        <Text style={styles.welcome}>External Account</Text>
                        <Text style={styles.instructions}>{`Wallet Status:\t${this.props.walletStatus}`}</Text>
                        <Text style={styles.instructions}>{`Account:\t${
                            this.props.wallet ?
                                this.props.wallet.address :
                                '--'}`
                        }</Text>
                        <Text style={styles.instructions}>{`Balance:\t${this.state.balance}\n`}</Text>
                        <Text style={styles.instructions}>{`Storage Status:\t${this.props.status}`}</Text>
                        <Text style={styles.instructions}>{`Encrypted Wallet:\t${this.props.privateKey}`}</Text>
                        <Button onPress={() => {
                            this.generateWallet().then((wallet) => {
                                wallet.encrypt('password').then((json) => {
                                    this.saveEncryptedWallet(json);
                                });
                            }).catch(console.error);
                        }} title='Generate'/>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    outer: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        margin: 10,
        padding: 10,
        borderRadius: 15,
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
    shadow3: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
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
        encryptedWallet: privateKey,
        status,
        walletStatus,
    };
};
export default connect(
    mapStateToProps,
)(Account);
