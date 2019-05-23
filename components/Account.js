/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome';
import RNSecureKeyStore, {ACCESSIBLE} from "react-native-secure-key-store";

import  { connect } from 'react-redux';
import {
    setWalletAction,
    setPrivateKeyAction,
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

    componentDidMount() {
        this.loadWalletFromKeystore();
    }

    /* Generate new wallet and update in Redux */
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

    loadWalletFromKeystore() {
        RNSecureKeyStore.get("smartwallet").then((res) => {
            console.log(res);
        }, (err) => {
            console.log(err);
        });
    }

    saveWalletToKeystore(wallet) {
        RNSecureKeyStore.set(
            "smartwallet",
            wallet.privateKey,
            { accessible: ACCESSIBLE.WHEN_UNLOCKED }
        ).then((res) => {
            console.log(res);
            //this.props.dispatch(statusReduxingAction());
            this.props.dispatch(setPrivateKeyAction(wallet.privateKey));
            //this.props.dispatch(statusIdleAction());
        }, (err) => {
            console.log(err);
        });
    }

    render() {
        return (
            <View style={styles.outer}>
                <Nav history={this.props.history}/>
                <View style={{
                    justifyContent: 'center',
                    flex: 1,
                }}>
                    <View style={[styles.container, styles.shadow3]}>
                        <Text style={styles.welcome}>External Account</Text>
                        {/*<Text style={styles.instructions}>{`Wallet Status:\t${this.props.walletStatus}`}</Text>*/}
                        <Text>Account:</Text>
                        <TextInput
                            style={styles.textInput}
                            value={
                                this.props.wallet ?
                                this.props.wallet.address :
                                '--'
                        }/>
                        <Text style={styles.instructions}>Balance:</Text>
                        <TextInput
                            style={styles.textInput}
                            value={this.state.balance.toString()}
                        />
                        {/*<Text style={styles.instructions}>{`Storage Status:\t${this.props.status}`}</Text>*/}
                        <Text style={styles.instructions}>Private Key:</Text>
                        <TextInput
                            style={styles.textInput}
                            value={this.props.privateKey}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                this.generateWallet().then((wallet) => {
                                    this.saveWalletToKeystore(wallet);
                                }).catch(console.error);
                            }}
                            title='Generate'
                        >
                            <Text style={styles.buttonText}>Generate</Text>
                        </TouchableOpacity>
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
    button: {
        backgroundColor: 'pink',
        borderRadius: 10,
        padding: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    textInput: {
        backgroundColor: '#eef',
        borderRadius: 10,
    },
});

const mapStateToProps = (state) => {
    let { walletReducer } = state;
    let {
        wallet,
        privateKey,
        status,
        walletStatus,
    } = walletReducer;
    return {
        wallet,
        privateKey,
        status,
        walletStatus,
    };
};
export default connect(
    mapStateToProps,
)(Account);
