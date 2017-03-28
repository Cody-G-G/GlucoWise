'use strict';
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CustomDatePicker from "./CustomDatePicker";
import styles from "./styles";

export default class ModalValueInputRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const fontSize = typeof this.props.fontSize !== 'undefined' ? this.props.fontSize : 25;
        const rowMargin = typeof this.props.rowMargin !== 'undefined' ? this.props.rowMargin : 0;
        const labelStyle = StyleSheet.flatten([styles.inputLabel, {fontSize: fontSize}]);
        const inputRowStyle = StyleSheet.flatten([styles.modalInputRow, {margin: rowMargin}]);
        const requiredAsterisk = this.props.required && (<Text style={{color:'red'}}>*</Text>);

        return (
            <View style={inputRowStyle}>
                <Text style={labelStyle}>{requiredAsterisk}Date: </Text>
                <CustomDatePicker style={styles.modalDatePicker}
                                  backgroundColor='royalblue'
                                  minDate={"31-08-1994"}
                                  type={'datetime'}
                                  maxDate={new Date()}
                                  date={this.props.inputDate}
                                  handleDateChange={this.props.handleDateChange}/>
            </View>
        );
    }
}