'use strict';
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import styles from "./styles";

export default class StandardSetterButton extends Component {
    constructor(props) {
        super(props);
        this.standardUK = "mmol/L";
        this.standardUS = "mg/dL";
    }

    render() {
        let buttonText = this.props.type === 'US' ? this.standardUS : this.standardUK;
        let buttonColor = buttonText === this.props.standard ? 'royalblue' : 'darkgrey';
        return (
            <TouchableOpacity style={StyleSheet.flatten([{flex:1}, {backgroundColor: buttonColor}])}
                              onPress={() => this.props.onPress()}>
                <Text style={styles.standardSetterButton}>
                    {buttonText}
                </Text>
            </TouchableOpacity>
        );
    }
}