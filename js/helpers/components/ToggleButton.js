'use strict';
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import styles from "./styles";

export default class ToggleButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity style={StyleSheet.flatten([styles.toggleButton, {backgroundColor: this.props.buttonColor}])}
                              onPress={() => this.props.onPress()}>
                <Text style={styles.standardSetterButtonText}>
                    {this.props.buttonText}
                </Text>
            </TouchableOpacity>
        );
    }
}