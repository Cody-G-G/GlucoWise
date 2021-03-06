'use strict';
import DatePicker from 'react-native-datepicker' // this is from a 3rd party dependency NPM module, "react-native-datepicker"
import React, {Component} from 'react' // this is from a 3rd party dependency NPM module, "react"
import {View, StyleSheet} from 'react-native' // this is from a 3rd party dependency NPM module, "react-native"
import styles from "./styles";

export default class CustomDatePicker extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DatePicker
                style={this.props.style}
                date={this.props.date}
                mode={this.props.type}
                format={this.props.type === 'date' ? 'DD-MM-YYYY' : 'DD-MM-YYYY HH:mm'}
                minDate={this.props.minDate}
                maxDate={this.props.maxDate}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={true}
                iconSource={require('../../../assets/date.png')}
                customStyles={{
                        dateText: styles.dateText,
                        dateInput: styles.dateInput,
                        dateTouchBody: StyleSheet.flatten([styles.dateTouchBody, {backgroundColor: this.props.backgroundColor}])
                    }}
                onDateChange={(date) => {this.props.handleDateChange(date)}}
            />
        )
    }
}