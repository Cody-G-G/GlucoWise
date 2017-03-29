'use strict';
import React, {Component} from 'react';
import {View, Text, TextInput} from 'react-native';
import SafeRangeButton from "./SafeRangeButton";
import styles from "./styles";
import isNumberValid from '../../helpers/util/inputValidator';

export default class SafeRangesRowPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.safeRangesRowPanel}>
                <Text style={styles.safeRangeInputLabel}>{this.props.inputLabel}</Text>

                <TextInput style={styles.valueInput}
                           value={this.props.inputValue}
                           keyboardType={'numeric'}
                           underlineColorAndroid={'white'}
                           maxLength={5}
                           onChangeText={(input) => this.props.updateSafeRange(input)}/>
                <SafeRangeButton backgroundColor={'royalblue'}
                                 buttonText={'Set'}
                                 fontSize={30}
                                 handlePress={() => {
                                     isNumberValid(this.props.inputValue) ? this.props.saveSafeRange() : alert("Please input a valid blood glucose value");
                                 }}/>
                <SafeRangeButton backgroundColor={'darkorange'}
                                 buttonText={'Default'}
                                 handlePress={this.props.defaultSafeRange}/>
            </View>
        )
    }
}