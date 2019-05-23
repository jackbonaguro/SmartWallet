/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { YellowBox } from 'react-native';

import 'ethers/dist/shims.js';
import { ethers } from 'ethers';

import  { Provider } from 'react-redux';
import store from './redux/store';

import Root from './components/Root';

console.ignoredYellowBox = ['Setting a timer'];
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = { ...console };
console.warn = (message) => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};

export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        let infuraProvider = new ethers.providers.InfuraProvider('rinkeby','5f3d75af05a14b1590570019d26675d6');
        let httpProvider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/5f3d75af05a14b1590570019d26675d6');
        this.provider = new ethers.providers.FallbackProvider([
            infuraProvider,
            httpProvider,
        ]);
    }

    render() {
        return (
            <Provider store={store}>
                <Root ethers={ethers} provider={this.provider}/>
            </Provider>
        );
    }
}
