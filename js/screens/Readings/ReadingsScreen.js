'use strict';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import ReadingsList from "../../helpers/components/ReadingsList";
import db from "../../data/database";
import date from "../../helpers/util/date";
import TextBold from "../../helpers/components/TextBold";
import ReadingsDatePicker from "./ReadingsDatePicker";
import styles from "./styles";

export default class ReadingsScreen extends Component {
    constructor(props) {
        super(props);
        this.today = date.getTodayString();
        this.state = {
            readings: db.getBGLReadingsInDateRange(this.today, this.today),
            startDate: this.today,
            endDate: this.today
        }
    }

    render() {
        return (
            <View style={{flex:1, backgroundColor: 'white'}}>
                <View style={{flex: 1, flexDirection:'row'}}>
                    <ReadingsDatePicker minDate={"31-08-1994"} maxDate={this.state.endDate} date={this.state.startDate} handleDateChange={this.updateStartDate.bind(this)}/>
                    <TextBold style={styles.dateRangeSeparatorText}> to </TextBold>
                    <ReadingsDatePicker minDate={this.state.startDate} maxDate={this.today} date={this.state.endDate} handleDateChange={this.updateEndDate.bind(this)}/>
                </View>
                <View style={{flex: 8, alignSelf:'stretch'}}>
                    <ReadingsList readings={this.state.readings}/>
                </View>
            </View>
        );
    }

    componentDidMount() {
        db.initBGLReadingListener(this.setReadings.bind(this));
    }

    setReadings() {
        this.setState({
            readings: db.getBGLReadingsInDateRange(this.state.startDate, this.state.endDate),
        });
    }

    updateStartDate(date) {
        this.setState({startDate: date});
        this.setReadings();
    }

    updateEndDate(date) {
        this.setState({endDate: date});
        this.setReadings();
    }
}