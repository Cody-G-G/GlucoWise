'use strict';
import React, {Component} from 'react';
import {View, Text, TextInput} from 'react-native';
import SafeRangeButton from "./SafeRangeButton";
import styles from "./styles";
import isInputValid from '../../helpers/util/readingValidator';
import ReadingValueInput from "../../helpers/components/ReadingValueInput";

export default class SafeRangesRowPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.safeRangesRowPanel}>
                <Text style={styles.safeRangeInputLabel}>{this.props.inputLabel}</Text>
                <ReadingValueInput style={styles.valueInput}
                                   inputValue={this.props.inputValue}
                                   onChangeText={this.props.updateSafeRange}/>
                <SafeRangeButton backgroundColor={'royalblue'}
                                 buttonText={'Set'}
                                 handlePress={() => {
                                     isInputValid(this.props.inputValue) ? this.props.saveSafeRange() : alert("Please input a valid blood glucose value");
                                 }}/>
                <SafeRangeButton backgroundColor={'darkorange'}
                                 buttonText={'Default'}
                                 handlePress={this.props.defaultSafeRange}/>
            </View>
        )
    }
}