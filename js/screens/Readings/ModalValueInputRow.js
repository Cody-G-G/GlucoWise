'use strict';
import React, {Component} from 'react';
import {TextInput, Text, View, StyleSheet} from 'react-native';
import styles from "./styles";

export default class ModalValueInputRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const keyboardType = typeof this.props.type !== 'undefined' ? this.props.type : 'numeric';
        const fontSize = typeof this.props.fontSize !== 'undefined' ? this.props.fontSize : 25;
        const rowMargin = typeof this.props.rowMargin !== 'undefined' ? this.props.rowMargin : 0;
        const maxLength = typeof this.props.maxLength !== 'undefined' ? this.props.maxLength : 5;
        const inputLabelStyle = StyleSheet.flatten([styles.inputLabel, {fontSize: fontSize}]);
        const valueInputStyle = StyleSheet.flatten([styles.valueInput, {fontSize: fontSize}]);
        const inputRowStyle = StyleSheet.flatten([styles.modalInputRow, {margin: rowMargin}]);
        return (
            <View style={inputRowStyle}>
                <Text style={inputLabelStyle}>{this.props.inputLabel}: </Text>
                <TextInput style={valueInputStyle}
                           value={this.props.inputValue}
                           keyboardType={keyboardType}
                           maxLength={maxLength}
                           onChangeText={(input) => this.props.onChangeText(input)}/>
            </View>
        );
    }
}