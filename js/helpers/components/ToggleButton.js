'use strict';
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import styles from "./styles";

export default class ToggleButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let buttonColor;
        let buttonText;
        if (this.props.selectedType === this.props.type) {
            buttonColor = this.props.onColor;
            buttonText = this.props.onText;
        } else {
            buttonColor = this.props.offColor;
            buttonText = this.props.offText;
        }
        return (
            <TouchableOpacity style={StyleSheet.flatten([styles.toggleButton, {backgroundColor: buttonColor}])}
                              onPress={() => this.props.onPress()}>
                <Text style={styles.standardSetterButtonText}>
                    {buttonText}
                </Text>
            </TouchableOpacity>
        );
    }
}