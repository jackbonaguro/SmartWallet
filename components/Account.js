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

import  { connect } from 'react-redux';
import { setWalletAction, setEncryptedWalletAction } from '../redux/actions';

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
        //Set up ethers and providers
        //TODO: Allow provider configuration through app
        let ethers = this.props.ethers;
        let infuraProvider = new ethers.providers.InfuraProvider('rinkeby','5f3d75af05a14b1590570019d26675d6');
        let httpProvider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/5f3d75af05a14b1590570019d26675d6');
        let provider = new ethers.providers.FallbackProvider([
            infuraProvider,
            httpProvider,
        ]);
        this.provider = provider;
        //Attempt to load saved wallet from storage
        this.loadEncryptedWallet();
    }

    generateWallet() {
        let disconnectedWallet = this.props.ethers.Wallet.createRandom(this.props.ethers.utils.randomBytes(128));
        let wallet = disconnectedWallet.connect(this.provider);
        this.props.dispatch(setWalletAction(wallet));

        //provider.listAccounts().then(result => console.log(result));  //Not allowed on Infura
        console.log(wallet.address);
        console.log(wallet.mnemonic);
        console.log(wallet.path);
        return wallet;
    }

    loadEncryptedWallet() {
        AsyncStorage.getItem('encryptedWallet').then((encryptedWallet) => {
            if (encryptedWallet && encryptedWallet !== null) {
                console.log(`Encrypted Wallet: ${JSON.stringify(encryptedWallet)}`);
                this.props.dispatch(setEncryptedWalletAction(encryptedWallet));

                this.props.ethers.Wallet.fromEncryptedJson(encryptedWallet, 'password').then((disconnectedWallet) => {
                    let wallet = disconnectedWallet.connect(this.provider);
                    //console.log(wallet.provider);
                    this.props.dispatch(setWalletAction(wallet));
                });
            } else {
                console.log('No encrypted wallet!');
            }
        }).catch((err) => {
            console.error(err);
        });
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
            <View style={styles.container}>
                <Text style={styles.welcome}>External Account</Text>
                {/*<Text style={styles.instructions}>{`Web3 Version: ${this.web3.version}`}</Text>*/}
                {/*<Text style={styles.instructions}>{`Network: ${this.state.netId}`}</Text>*/}
                {/*<Text style={styles.instructions}>{`Provider: ${this.web3.currentProvider.host}\n`}</Text>*/}
                <Text style={styles.instructions}>{`Account:\t${
                    this.props.wallet ?
                        this.props.wallet.address :
                        'No Account'}`
                }</Text>
                <Text style={styles.instructions}>{`Balance:\t${this.state.balance}`}</Text>
                <Text style={styles.instructions}>{`Encrypted Wallet:\t${this.props.encryptedWallet}`}</Text>
                {/*<Text style={styles.instructions}>{`Block #${this.state.latestBlockNumber}`}</Text>*/}
                <Button onPress={() => {
                    console.log('Generate');
                    let wallet = this.generateWallet();
                    wallet.encrypt('password').then((json) => {
                        this.saveEncryptedWallet(json);
                    });
                }} title='Generate'/>
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
)(Account);
