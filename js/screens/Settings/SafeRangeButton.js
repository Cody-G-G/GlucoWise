'use strict';
import React, {Component} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import styles from "./styles";

export default class SafeRangeButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity
                style={StyleSheet.flatten([styles.safeRangeButton, {backgroundColor: this.props.backgroundColor}])}
                onPress={() => this.props.handlePress()}>
                <Text style={styles.safeRangeButtonText}>{this.props.buttonText}</Text>
            </TouchableOpacity>
        );
    }
}