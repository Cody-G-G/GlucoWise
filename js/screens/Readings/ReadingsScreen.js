'use strict';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import ReadingsList from "../../helpers/components/ReadingsList";
import db from "../../data/database";
import date from "../../helpers/util/date";
import TextBold from "../../helpers/components/TextBold";
import ReadingDatePicker from "./ReadingDatePicker";
import styles from "./styles";
import log from "../../helpers/util/logger";
import AddReadingButton from "./AddReadingButton";
import AddReadingModal from "./AddReadingModal";

export default class ReadingsScreen extends Component {
    constructor(props) {
        super(props);
        this.today = date.getTodayString();
        this.state = {
            readings: null,
            startDate: this.today,
            endDate: this.today,
            standard: null,
            addingReading: false
        }
    }

    componentWillMount() {
        this.updateState();
    }

    render() {
        log("Rendering ReadingsScreen");
        return (
            <View style={styles.screenContainer}>
                <View style={styles.screenTopPanel}>
                    <View style={styles.dateRangePickers}>
                        <ReadingDatePicker style={styles.readingsDatePicker}
                                           backgroundColor='dimgray'
                                           minDate={"31-08-1994"}
                                           type={'date'}
                                           maxDate={this.state.endDate}
                                           date={this.state.startDate}
                                           handleDateChange={this.updateStartDate}/>
                        <TextBold style={styles.dateRangeSeparatorText}> to </TextBold>
                        <ReadingDatePicker style={styles.readingsDatePicker}
                                           backgroundColor='dimgray'
                                           minDate={this.state.startDate}
                                           type={'date'}
                                           maxDate={this.today}
                                           date={this.state.endDate}
                                           handleDateChange={this.updateEndDate}/>
                    </View>

                    <AddReadingButton addReading={this.addingReading}/>
                </View>

                <ReadingsList style={{flex: 8}}
                              readings={this.state.readings}
                              standard={this.state.standard}
                              deleteReading={db.deleteReading}/>

                <AddReadingModal opened={this.state.addingReading} finished={this.finishedAddingReading}/>
            </View>
        );
    }

    componentDidMount() {
        db.initBGLReadingListener(this.updateState);
        db.initBGLStandardListener(this.updateState);
    }

    updateState = () => {
        this.setState({
            standard: db.getBGLStandard(),
            readings: db.getBGLReadingsInDateRange(this.state.startDate, this.state.endDate),
        });
    };

    /**
     * @param startDate
     */
    updateStartDate = (startDate) => {
        this.setState({
            startDate: startDate,
            readings: db.getBGLReadingsInDateRange(startDate, this.state.endDate)
        });
    };

    /**
     * @param endDate
     */
    updateEndDate = (endDate) => {
        this.setState({
            endDate: endDate,
            readings: db.getBGLReadingsInDateRange(this.state.startDate, endDate)
        });
    };

    finishedAddingReading = () => {
        this.setState({
            addingReading: false
        });
    };

    addingReading = () => {
        this.setState({
            addingReading: true
        });
    };
}