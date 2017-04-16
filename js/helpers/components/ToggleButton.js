'use strict';
import React, {Component} from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {StyleSheet, TouchableOpacity, Text} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import styles from "./styles";

export default class ToggleButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const hasOnColorProp = typeof this.props.onColor !== 'undefined';
        const hasFontSizeProp = typeof this.props.fontSize !== 'undefined';

        let buttonColor;
        let buttonText;
        if (typeof this.props.selectedTypes !== 'undefined' && this.props.selectedTypes.includes(this.props.type)) {
            buttonColor = hasOnColorProp ? this.props.onColor : 'royalblue';
            buttonText = this.props.onText;
        } else {
            buttonColor = 'darkgrey';
            buttonText = this.props.offText;
        }

        const buttonTextStyle = hasFontSizeProp ? StyleSheet.flatten([styles.toggleButtonText, {fontSize: this.props.fontSize}]) : styles.toggleButtonText;
        const buttonStyle = StyleSheet.flatten([styles.toggleButton, {backgroundColor: buttonColor}]);

        return (
            <TouchableOpacity style={buttonStyle} onPress={() => this.props.onPress()}>
                <Text style={buttonTextStyle}>
                    {buttonText}
                </Text>
            </TouchableOpacity>
        );
    }
}