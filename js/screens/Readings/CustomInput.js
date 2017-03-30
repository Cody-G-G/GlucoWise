'use strict';
import React, {Component} from 'react';
import {TextInput, Text, View, StyleSheet} from 'react-native';
import styles from "./styles";

export default class CustomInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const keyboardType = typeof this.props.type !== 'undefined' ? this.props.type : 'numeric';
        const fontSize = typeof this.props.fontSize !== 'undefined' ? this.props.fontSize : 25;
        const margin = typeof this.props.margin !== 'undefined' ? this.props.margin : 0;
        const maxLength = typeof this.props.maxLength !== 'undefined' ? this.props.maxLength : 5;
        const underlineColor = typeof this.props.underlineColor !== 'undefined' ? this.props.underlineColor : 'black';
        const unitLabelFlex = typeof this.props.unitLabelFlex !== 'undefined' ? this.props.unitLabelFlex : 0.3;
        const textColor = typeof this.props.textColor !== 'undefined' ? this.props.textColor : 'black';

        const inputLabelStyle = StyleSheet.flatten([styles.inputLabel, {fontSize: fontSize, color: textColor}]);
        const valueInputStyle = StyleSheet.flatten([styles.valueInput, {fontSize: fontSize, color: textColor}]);
        const unitLabelStyle = StyleSheet.flatten([styles.unitLabel, {
            fontSize: fontSize,
            flex: unitLabelFlex,
            color: textColor
        }]);
        const customInputStyle = StyleSheet.flatten([styles.customInput, {margin: margin}]);
        const requiredAsterisk = this.props.required && (<Text style={{color:'red'}}>*</Text>);
        return (
            <View style={customInputStyle}>
                <Text style={inputLabelStyle}>{requiredAsterisk}{this.props.inputLabel}: </Text>
                <TextInput style={valueInputStyle}
                           value={String(this.props.inputValue)}
                           keyboardType={keyboardType}
                           underlineColorAndroid={underlineColor}
                           maxLength={maxLength}
                           onChangeText={(input) => this.props.onChangeText(input)}/>
                <Text style={unitLabelStyle}> {this.props.unitLabel}</Text>
            </View>
        );
    }
}