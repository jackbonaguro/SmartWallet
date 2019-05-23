/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome';
import ethers from 'ethers';

import  { connect } from 'react-redux';
import { setWalletAction, setEncryptedWalletAction } from '../redux/actions';
import Nav from "./Nav";

class Home extends Component<Props> {
    constructor(props) {
        super(props);


        this.state = {
            network: '',
        }
    }

    componentDidMount() {
        this.props.provider.getNetwork().then((n) => {
            this.setState({
                network: n.name,
            })
        }).catch(console.error);
    }

    render() {
        return (
            <View style={styles.outer}>
                <Nav history={this.props.history}/>
                <View style={{
                    justifyContent: 'center',
                    flex: 1,
                }}>
                    {/*<ScrollView
                        style={[styles.card, styles.shadow3]}
                        contentContainerStyle={styles.container}
                        showVerticalScrollIndicator={false}
                    >*/}
                    <View style={[styles.container, styles.card, styles.shadow3]}>
                        <Text style={styles.welcome}>Home</Text>
                        <Text style={styles.instructions}>{`Network: ${this.state.network}`}</Text>
                        <Text style={styles.instructions}>{`Provider: ${JSON.stringify(this.props.provider._providers[0].connection.url, null, 4)}\n`}</Text>
                        <Text style={styles.instructions}>{`Account:\t${
                            this.props.wallet ?
                                this.props.wallet.address :
                                'No Account'}`
                        }</Text>
                        {/*<Text style={styles.instructions}>{`Block #${this.state.latestBlockNumber}`}</Text>*/}
                    {/*</ScrollView>*/}
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
        padding: 10,
    },
    card: {
        backgroundColor: 'white',
        margin: 10,
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
    } = walletReducer;
    return {
        wallet,
    };
};
export default connect(
    mapStateToProps,
)(Home);
