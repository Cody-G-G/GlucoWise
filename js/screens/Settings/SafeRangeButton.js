'use strict';
import React, {Component} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import styles from "./styles";

export default class SafeRangeButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const fontSize = typeof this.props.fontSize !== 'undefined' ? this.props.fontSize : 23;
        const safeRangeButtonStyle =StyleSheet.flatten([styles.safeRangeButton, {backgroundColor: this.props.backgroundColor}]);
        const safeRangeButtonTextStyle = StyleSheet.flatten([styles.safeRangeButtonText, {fontSize: fontSize}]);

        return (
            <TouchableOpacity
                style={safeRangeButtonStyle}
                onPress={() => this.props.handlePress()}>
                <Text style={safeRangeButtonTextStyle}>{this.props.buttonText}</Text>
            </TouchableOpacity>
        );
    }
}