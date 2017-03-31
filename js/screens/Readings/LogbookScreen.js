'use strict';
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LogList from "./LogList";
import db from "../../data/database";
import date from "../../helpers/util/date";
import CustomDatePicker from "../../helpers/components/CustomDatePicker";
import styles from "./styles";
import log from "../../helpers/util/logger";
import AddButton from "../../helpers/components/AddButton";
import AddLogEntryModal from "../../helpers/components/AddLogEntryModal";
import ToggleButtonsGroup from "../../helpers/components/ToggleButtonsGroup";

export default class LogbookScreen extends Component {
    constructor(props) {
        super(props);
        this.today = date.getTodayString();
        this.state = {
            data: [],
            startDate: this.today,
            endDate: this.today,
            standard: '',
            addModalOpen: false,
            logModes: {
                Readings: true,
                Food: true
            }
        };
    }

    componentWillMount() {
        this.updateState();
    }

    render() {
        log("Rendering LogbookScreen");
        const modeTypes = Object.keys(this.state.logModes);
        const selectedModeTypes = modeTypes.filter(mode => this.state.logModes[mode]);
        const leftDatePickerStyle = StyleSheet.flatten([styles.customDatePicker, {borderRightWidth: 2}]);
        const rightDatePickerStyle = StyleSheet.flatten([styles.customDatePicker, {borderLeftWidth: 2}]);
        return (
            <View style={styles.screenContainer}>
                <View style={styles.screenTopPanel}>
                    <View style={styles.dateRangePickers}>
                        <CustomDatePicker style={leftDatePickerStyle}
                                          backgroundColor='dimgray'
                                          minDate={"31-08-1994"}
                                          type={'date'}
                                          maxDate={this.state.endDate}
                                          date={this.state.startDate}
                                          handleDateChange={this.updateStartDate}/>
                        <Text style={styles.dateRangeSeparatorText}> to </Text>
                        <CustomDatePicker style={rightDatePickerStyle}
                                          backgroundColor='dimgray'
                                          minDate={this.state.startDate}
                                          type={'date'}
                                          maxDate={this.today}
                                          date={this.state.endDate}
                                          handleDateChange={this.updateEndDate}/>
                    </View>

                    <AddButton onPress={this.openAddModal}/>
                </View>

                <LogList data={this.state.data}
                         standard={this.state.standard}
                         delete={db.delete}/>

                <ToggleButtonsGroup types={modeTypes}
                                    selectedTypes={selectedModeTypes}
                                    onPress={this.updateState}/>

                <AddLogEntryModal opened={this.state.addModalOpen} finished={this.finishedAdding}/>
            </View>
        );
    }

    componentDidMount() {
        db.initBGLReadingListener(this.updateState);
        db.initConsumedFoodItemListener(this.updateState);
        db.initBGLStandardListener(this.updateState);
    }

    componentWillUnmount() {
        log("Unmounting LogbookScreen");
    }

    updateState = (mode) => {
        log("Updating LogbookScreen state with mode " + mode);
        const logModes = this.state.logModes;
        typeof mode !== 'undefined' && (logModes[mode] = !logModes[mode]);

        if (logModes.Readings && logModes.Food) {
            const glucoseData = db.getBGLReadingsInDateRange(this.state.startDate, this.state.endDate);
            const foodData = db.getConsumedFoodItemsInDateRange(this.state.startDate, this.state.endDate);
            const data = [...glucoseData, ...foodData].sort((a, b) => b.date - a.date);

            this.setState({
                standard: db.standard,
                data: data,
                logModes: logModes
            });
        } else if (logModes.Readings) {
            this.setState({
                standard: db.standard,
                data: db.getBGLReadingsInDateRange(this.state.startDate, this.state.endDate),
                logModes: logModes
            });
        } else if (logModes.Food) {
            this.setState({
                data: db.getConsumedFoodItemsInDateRange(this.state.startDate, this.state.endDate),
                logModes: logModes
            });
        } else {
            this.setState({
                data: [],
                logModes: logModes
            });
        }
    };

    /**
     * @param startDate
     */
    updateStartDate = (startDate) => {
        this.setState({
            startDate: startDate,
            data: db.getBGLReadingsInDateRange(startDate, this.state.endDate)
        });
    };

    /**
     * @param endDate
     */
    updateEndDate = (endDate) => {
        this.setState({
            endDate: endDate,
            data: db.getBGLReadingsInDateRange(this.state.startDate, endDate)
        });
    };

    finishedAdding = () => {
        this.setState({
            addModalOpen: false
        });
    };

    openAddModal = () => {
        this.setState({
            addModalOpen: true
        });
    };
}