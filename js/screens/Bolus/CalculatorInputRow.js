import React, {Component} from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import CustomInput from "../../helpers/components/CustomInput";
import styles from "./styles";

export default class CalculatorInputRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const buttonTextSize = typeof this.props.buttonTextSize !== 'undefined' ? this.props.buttonTextSize : 18;
        const buttonTextStyle = StyleSheet.flatten([styles.inputRowButtonText, {fontSize: buttonTextSize}]);
        return (
            <View style={styles.calculatorInputRow}>
                <CustomInput inputLabel={this.props.inputLabel}
                             inputValue={this.props.inputValue}
                             onChangeText={this.props.onChangeText}
                             fontSize={this.props.fontSize}
                             unitLabel={this.props.unitLabel}
                             unitLabelFlex={this.props.unitLabelFlex}
                             textColor={this.props.textColor}
                             underlineColor={this.props.underlineColor}/>
                <TouchableOpacity style={styles.inputRowButton} onPress={this.props.onPress}>
                    <Text style={buttonTextStyle}>{this.props.buttonText}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}