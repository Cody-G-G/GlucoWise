'use strict';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import GraphPanel from './GraphPanel';
import ReadingsPanel from './ReadingsPanel';
import db from "../../data/database";
import dateUtil from "../../helpers/util/date";
import log from "../../helpers/util/logger";

export default class GraphScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hourRange: 1,
            readings: null,
            graphReadings: null,
            safeRangeMin: null,
            safeRangeMax: null,
            standard: null
        }
    }

    componentWillMount() {
        this.updateState();
    }

    render() {
        log("Rendering GraphScreen");
        let timeRangeButtonText = this.state.hourRange === 24 ? "60m" : "24h";
        let currentTimeRange = this.state.hourRange === 24 ? "24h" : "60m";
        return (
            <View style={styles.screenContainer}>
                <GraphPanel readings={this.state.graphReadings}
                            safeRangeMin={this.state.safeRangeMin}
                            safeRangeMax={this.state.safeRangeMax}
                            standard={this.state.standard}/>
                <ReadingsPanel readings={this.state.readings}
                               toggleTimeRange={this.toggleTimeRange}
                               timeRangeButtonText={timeRangeButtonText}
                               currentTimeRange={currentTimeRange}
                               standard={this.state.standard}
                               deleteReading={db.deleteReading}/>
            </View>
        );
    }

    componentDidMount() {
        db.initBGLReadingListener(this.updateState);
        db.initBGLSafeRangeListener(this.updateState);
        db.initBGLStandardListener(this.updateState)
    }

    /**
     * @param readings
     * @param hourRange
     * @returns {[*]}
     */
    getGraphReadings(readings, hourRange) {
        let graphReadings = [];
        let timeUnitsFromPresent = hourRange === 24 ? dateUtil.hoursFromPresent : dateUtil.minutesFromPresent;
        readings.forEach((reading) => {
                graphReadings.push({
                    x: timeUnitsFromPresent(reading.date),
                    y: reading.value,
                })
            }
        );
        return [graphReadings];
    }

    toggleTimeRange = () => {
        log("Toggled time range");
        this.updateState(this.state.hourRange === 24 ? 1 : 24);
    };

    /**
     * @param newHourRange
     */
    updateState = (newHourRange) => {
        let hourRange = (typeof newHourRange !== 'undefined') ? newHourRange : this.state.hourRange;
        let readings = hourRange === 24 ? db.get24hBGLReadings() : db.get60mBGLReadings();
        let standard = db.getBGLStandard();
        let safeRange = db.getBGLSafeRange();
        let graphReadings = this.getGraphReadings(readings, hourRange);
        this.setState({
            standard: standard,
            readings: readings,
            graphReadings: graphReadings,
            safeRangeMin: safeRange.minValue,
            safeRangeMax: safeRange.maxValue,
            hourRange: hourRange
        });
    };
}