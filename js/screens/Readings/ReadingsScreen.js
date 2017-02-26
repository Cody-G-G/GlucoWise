'use strict';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import ReadingsList from "../../helpers/components/ReadingsList";
import db from "../../data/database";
import date from "../../helpers/util/date";
import TextBold from "../../helpers/components/TextBold";
import ReadingsDatePicker from "./ReadingsDatePicker";
import styles from "./styles";
import log from "../../helpers/util/logger";

export default class ReadingsScreen extends Component {
    constructor(props) {
        super(props);
        this.today = date.getTodayString();
        this.state = {
            readings: null,
            startDate: this.today,
            endDate: this.today,
            standard: null
        }
    }

    componentWillMount() {
        this.updateState();
    }

    render() {
        log("Rendering ReadingsScreen");
        return (
            <View style={{flex:1, backgroundColor: 'white'}}>
                <View style={{flex: 1, flexDirection:'row'}}>
                    <ReadingsDatePicker minDate={"31-08-1994"} maxDate={this.state.endDate} date={this.state.startDate} handleDateChange={this.updateStartDate.bind(this)}/>
                    <TextBold style={styles.dateRangeSeparatorText}> to </TextBold>
                    <ReadingsDatePicker minDate={this.state.startDate} maxDate={this.today} date={this.state.endDate} handleDateChange={this.updateEndDate.bind(this)}/>
                </View>
                <View style={{flex: 8, alignSelf:'stretch'}}>
                    <ReadingsList readings={this.state.readings} standard={this.state.standard} deleteReading={db.deleteReading}/>
                </View>
            </View>
        );
    }

    componentDidMount() {
        db.initBGLReadingListener(this.updateState.bind(this));
    }

    updateState() {
        this.setState({
            readings: db.getBGLReadingsInDateRange(this.state.startDate, this.state.endDate),
            standard: db.getBGLStandard().standard
        });
    }

    /**
     * @param startDate
     */
    updateStartDate(startDate) {
        this.setState({
            startDate: startDate,
            readings: db.getBGLReadingsInDateRange(startDate, this.state.endDate)
        });
    }

    /**
     * @param endDate
     */
    updateEndDate(endDate) {
        this.setState({
            endDate: endDate,
            readings: db.getBGLReadingsInDateRange(this.state.startDate, endDate)
        });
    }
}