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
            graphReadings: null
        }
    }

    componentWillMount() {
        this.setReadings();
    }

    render() {
        log("Rendering GraphScreen");
        let timeRangeButtonText = this.state.hourRange === 24 ? "60m" : "24h";
        let currentTimeRange = this.state.hourRange === 24 ? "24h" : "60m";
        return (
            <View style={styles.screenContainer}>
                <GraphPanel readings={this.state.graphReadings}
                            hourRange={this.state.hourRange}/>
                <ReadingsPanel readings={this.state.readings}
                               toggleTimeRange={this.toggleTimeRange.bind(this)}
                               timeRangeButtonText={timeRangeButtonText}
                               currentTimeRange={currentTimeRange}/>
            </View>
        );
    }

    componentDidMount() {
        db.initBGLReadingListener(this.setReadings.bind(this));
    }

    getGraphReadings(readings, hourRange) {
        let graphReadings = [];
        let timeUnitsFromPresent = hourRange === 24 ? dateUtil.hoursFromPresent : dateUtil.minutesFromPresent;
        readings.forEach((reading) => {
                graphReadings.push({
                    x: timeUnitsFromPresent(reading.date),
                    y: reading.value
                })
            }
        );
        return [graphReadings];
    }

    toggleTimeRange() {
        log("Toggled time range");
        let newHourRange = this.state.hourRange === 24 ? 1 : 24;
        let readings = newHourRange === 24 ? db.get24hBGLReadings() : db.get60mBGLReadings();
        let graphReadings = this.getGraphReadings(readings, newHourRange);
        this.setState({
            hourRange: newHourRange,
            readings: readings,
            graphReadings: graphReadings
        });
    }

    setReadings() {
        let readings = this.state.hourRange === 24 ? db.get24hBGLReadings() : db.get60mBGLReadings();
        let graphReadings = this.getGraphReadings(readings, this.state.hourRange);
        this.setState({
            readings: readings,
            graphReadings: graphReadings
        });
    }
}