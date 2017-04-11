'use strict';
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import styles from "./styles";
import CustomDatePicker from "../../helpers/components/CustomDatePicker";

export default class DateRangePanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const leftDatePickerStyle = StyleSheet.flatten([styles.customDatePicker, {borderRightWidth: 2}]);
        const rightDatePickerStyle = StyleSheet.flatten([styles.customDatePicker, {borderLeftWidth: 2}]);

        return (
            <View style={styles.dateRangePickers}>
                <CustomDatePicker style={leftDatePickerStyle}
                                  backgroundColor='dimgray'
                                  minDate={"31-08-1994"}
                                  type={'date'}
                                  maxDate={this.props.endDate}
                                  date={this.props.startDate}
                                  handleDateChange={this.props.updateStartDate}/>
                <Text style={styles.dateRangeSeparatorText}> to </Text>
                <CustomDatePicker style={rightDatePickerStyle}
                                  backgroundColor='dimgray'
                                  minDate={this.props.startDate}
                                  type={'date'}
                                  maxDate={this.props.today}
                                  date={this.props.endDate}
                                  handleDateChange={this.props.updateEndDate}/>
            </View>
        );
    }
}