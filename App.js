/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import './global';
import 'unorm';
import 'ethers/dist/shims.js';

import  { Provider } from 'react-redux';
import store from './redux/store';

import { ethers } from 'ethers';

import Root from './components/Root';

export default class App extends Component<Props> {
    constructor(props) {
        super(props);
    }

  render() {
    return (
        <Provider store={store}>
            {/*<Text>React Native Web3 App</Text>*/}
            <Root ethers={ethers}></Root>
        </Provider>
    );
  }
}
