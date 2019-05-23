import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import React from "react";

let Nav = (props) => {
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 25,
        }}>
            <TouchableOpacity onPress={() => {
                if (props.history.location.pathname === '/account') {
                    props.history.replace('/home');
                } else {
                    props.history.replace('/account');
                }
            }}>
                <Icon name="exchange" size={25} color='pink'/>
            </TouchableOpacity>
            <Text style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: 'pink'
            }}>SmartWallet</Text>
            <Icon name="exchange" size={30} color="rgba(0,0,0,0)"/>
        </View>
    )
};

export default Nav;
