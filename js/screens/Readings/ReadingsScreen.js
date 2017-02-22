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
            readings: db.getBGLReadings(),
            startDate: this.today,
            endDate: this.today
        }
    }

    render() {
        return (
            <View style={{backgroundColor: 'white'}}>
                <View style={{flexDirection:'row'}}>
                    <ReadingsDatePicker today={this.today} date={this.state.startDate} handleDateChange={this.updateStartDate.bind(this)}/>
                    <TextBold style={styles.dateRangeSeparatorText}> to </TextBold>
                    <ReadingsDatePicker today={this.today} date={this.state.endDate} handleDateChange={this.updateEndDate.bind(this)}/>
                </View>
                <ReadingsList readings={db.getBGLReadings()}/>
            </View>
        );
    }

    componentDidMount() {
        db.initBGLReadingListener(this.setReadings.bind(this));
    }

    setReadings() {
        this.setState({
            readings: db.getBGLReadings(),
        });
    }

    updateStartDate(date) {
        this.setState({startDate: date})
    }

    updateEndDate(date) {
        this.setState({endDate: date})
    }
}