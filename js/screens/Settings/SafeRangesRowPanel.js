'use strict';
import React, {Component} from 'react';
import {View, Text, TextInput} from 'react-native';
import SafeRangeButton from "./SafeRangeButton";
import styles from "./styles";

export default class SafeRangesRowPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.safeRangesRowPanel}>
                <Text style={styles.safeRangeInputLabel}>{this.props.inputLabel}</Text>
                <TextInput style={styles.safeRangeInput}
                           value={String(this.props.inputValue)}
                           keyboardType={'numeric'}
                           maxLength={5}
                           onChangeText={(input) => this.props.updateSafeRange(input)}/>
                <SafeRangeButton backgroundColor={'royalblue'}
                                 buttonText={'Set'}
                                 handlePress={() => {
                                     this.isInputValid() ? this.props.saveSafeRange() : alert("Please input a valid number");
                                 }}/>
                <SafeRangeButton backgroundColor={'darkorange'} buttonText={'Default'} handlePress={this.props.defaultSafeRange}/>
            </View>
        )
    }

    isInputValid() {
        let numbers = '0123456789.';
        let decimalPoints = 0;
        let valid = true;
        let digits = String(this.props.inputValue).trim().split('');

        let isInputEmpty = digits.length === 0;
        let isLastCharDecimalPoint = digits[digits.length - 1] === '.';

        digits.forEach((digit) => {
            let isValidDigit = (numbers.indexOf(digit) !== -1);
            digit === '.' && decimalPoints++;

            if (!isValidDigit || decimalPoints > 1) {
                valid = false;
            }
        });

        (isInputEmpty || isLastCharDecimalPoint) && (valid = false);

        return valid;
    }
}