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
import { setWalletAction, setEncryptedWalletAction } from '../redux/actions';

import Account from './Account';

class Root extends Component<Props> {
    constructor(props) {
        super(props);

        //Small state for wallet async data
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

    render() {
        return (
            <NativeRouter>
                <Switch>
                    <Redirect exact from="/" to="/account"/>
                    <Route path="/account" render={(props) => (
                        <Account {
                            ...props
                         }
                            ethers={this.props.ethers}
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
