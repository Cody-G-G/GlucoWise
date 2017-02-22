'use strict';
import DatePicker from 'react-native-datepicker'
import React, {Component} from 'react'
import {View} from 'react-native'
import styles from "./styles";

export default class ReadingsDatePicker extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <DatePicker
                style={{flex:1}}
                date={this.props.date}
                mode="date"
                format="DD-MM-YYYY"
                minDate="31-08-1994"
                maxDate={this.props.today}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={true}
                iconSource={require('../../../assets/date.png')}
                customStyles={{
                        dateText: styles.dateText,
                        dateTouchBody: styles.dateTouchBody
                    }}
                onDateChange={(date) => {this.props.handleDateChange(date)}}
            />
        )
    }
}