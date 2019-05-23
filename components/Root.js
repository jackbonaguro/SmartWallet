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
    setEncryptedWalletAction,
    statusLoadingAction,
    statusReduxingAction,
    statusIdleAction,
    walletLoadingAction,
    walletIdleAction,
} from '../redux/actions';

import Account from './Account';
import Home from "./Home";

class Root extends Component<Props> {
    componentDidMount() {
        this.loadEncryptedWallet();
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

    render() {
        return (
            <NativeRouter>
                <Switch>
                    <Redirect exact from="/" to="/account"/>
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
        encryptedWallet,
    } = walletReducer;
    return {
        wallet,
        encryptedWallet,
    };
};
export default connect(
    mapStateToProps,
)(Root);
