'use strict';
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import styles from "./styles";

export default class StandardSetterButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity style={StyleSheet.flatten([{flex:1}, {backgroundColor: this.props.buttonColor}])}
                              onPress={() => this.props.setStandard()}>
                <Text style={styles.standardSetterButton}>
                    {this.props.buttonText}
                </Text>
            </TouchableOpacity>
        );
    }
}