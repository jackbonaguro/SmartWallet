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
import { NativeRouter, Route, Redirect, Switch } from 'react-router-native';

import  { connect } from 'react-redux';
import {
    setWalletAction,
    setPrivateKeyAction,
    statusLoadingAction,
    statusReduxingAction,
    statusIdleAction,
    walletLoadingAction,
    walletIdleAction,
} from '../redux/actions';

import Account from './Account';
import Home from "./Home";
import RNSecureKeyStore from "react-native-secure-key-store";
import * as ethers from "ethers";

class Root extends Component<Props> {
    componentDidMount() {
        //this.loadEncryptedWallet();
        this.loadWalletFromKeystore();
    }

    //TODO: Move wallet functions to own file since code is repeated here and in Root
    loadEncryptedWallet() {
        this.props.dispatch(statusLoadingAction());
        AsyncStorage.getItem('privateKey').then((encryptedWallet) => {
            if (encryptedWallet && encryptedWallet !== null) {
                this.props.dispatch(statusReduxingAction());
                //console.log(`Encrypted Wallet: ${JSON.stringify(privateKey)}`);
                this.props.dispatch(setPrivateKeyAction(encryptedWallet));
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

    loadWalletFromKeystore() {
        RNSecureKeyStore.get("smartwallet").then((res) => {
            console.log(res);
            this.props.dispatch(setPrivateKeyAction(res));

            //Must manually reconnect wallet to provider...
            this.props.dispatch(walletLoadingAction());
            let wallet = new ethers.Wallet(res, this.props.provider);
            this.props.dispatch(setWalletAction(wallet));
            this.props.dispatch(walletIdleAction());
        }, (err) => {
            if (err.code === 404) {
                console.error('Attempted to load wallet but none found.');
            }
            else {
                console.error(err);
            }
        });
    }

    render() {
        return (
            <NativeRouter>
                <Switch>
                    <Redirect exact from="/" to="/home"/>
                    <Route path="/account" render={(props) => (
                        <Account
                            {...props}
                            ethers={this.props.ethers}
                            provider={this.props.provider}
                        />
                    )}/>
                    <Route path="/home" render={(props) => (
                        <Home
                            {...props}
                            ethers={this.props.ethers}
                            provider={this.props.provider}
                        />
                    )}/>
                </Switch>
            </NativeRouter>
        );
    }
}

const mapStateToProps = (state) => {
    let { walletReducer } = state;
    let {
        wallet,
        privateKey,
    } = walletReducer;
    return {
        wallet,
        privateKey,
    };
};
export default connect(
    mapStateToProps,
)(Root);
