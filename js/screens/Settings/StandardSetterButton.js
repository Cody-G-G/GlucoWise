'use strict';
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';

export default class StandardSetterButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity style={StyleSheet.flatten([{flex:1}, {backgroundColor: this.props.buttonColor}])}
                              onPress={() => this.props.setStandard()}>
                <Text style={{fontSize:35, color:'white', fontWeight:'bold', padding:5, textAlign:'center', borderWidth:1}}>
                    {this.props.buttonText}
                </Text>
            </TouchableOpacity>
        );
    }
}