'use strict';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import ReadingsGraph from './ReadingsGraph';
import StepsGraph from './StepsGraph';
import db from "../../data/database";
import gFit from "../../data/googleFit";
import dateUtil from "../../helpers/util/date";
import {graphModes, timeRanges} from "../../helpers/util/constants";
import log from "../../helpers/util/logger";
import TimeRangePanel from "./TimeRangePanel";

export default class GraphScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeRange: timeRanges.lastHour,
            data: [],
            graphData: [[]],
            safeRangeMin: '',
            safeRangeMax: '',
            standard: '',
            graphMode: graphModes.steps
        }
    }

    componentWillMount() {
        this.updateState();
    }

    render() {
        log("Rendering GraphScreen");
        return (
            <View style={styles.screenContainer}>
                {this.state.graphMode === graphModes.readings ?
                    <ReadingsGraph readings={this.state.graphData}
                                   safeRangeMin={this.state.safeRangeMin}
                                   safeRangeMax={this.state.safeRangeMax}
                                   standard={this.state.standard}/> :
                    <StepsGraph steps={this.state.graphData}/>
                }
                <TimeRangePanel timeRange={this.state.timeRange}
                                onPress={this.updateState}/>
            </View>
        );
    }

    componentDidMount() {
        db.initBGLReadingListener(this.updateState);
        db.initBGLSafeRangeListener(this.updateState);
        db.initBGLStandardListener(this.updateState)
    }

    componentWillUnmount() {
        log("Unmounting GraphScreen");
    }

    /**
     * @param data
     * @param timeRange
     * @param graphMode
     * @returns {[*]}
     */
    getDataForGraph(data, timeRange, graphMode) {
        log("Processing data for graph: " + JSON.stringify(data));
        let graphData = [];
        let timeUnitsFromPresent = timeRange === timeRanges.lastDay ? dateUtil.hoursFromPresent : dateUtil.minutesFromPresent;
        let xAxis;
        switch (graphMode) {
            case(graphModes.readings):
                xAxis = "x";
                break;
            case(graphModes.steps):
                xAxis = "name";
                break;
            case(graphModes.calories):
                break;
        }
        data.forEach((dataPoint) => {
                let graphDataPoint = {};
                graphDataPoint[xAxis] = timeUnitsFromPresent(dataPoint.date);
                graphDataPoint["y"] = dataPoint.value;
                graphData.push(graphDataPoint);
            }
        );
        return [graphData];
    }

    /**
     * @param data
     * @returns {Array}
     */
    mapValuesToDates(data) {
        log("Mapping data values to dates: " + JSON.stringify(data));
        const mappedData = [];
        for (let i = 0; i < data.dates.length; i++) {
            mappedData.push({date: new Date(data.dates[i]), value: data.values[i]});
        }
        return mappedData.reverse();
    }

    /**
     * @param newTimeRange
     */
    updateState = (newTimeRange) => {
        const timeRange = (typeof newTimeRange !== 'undefined') ? newTimeRange : this.state.timeRange;
        this.getData(timeRange, this.state.graphMode)
            .then((data) => {
                const safeRange = db.getBGLSafeRange();
                this.setState({
                    standard: db.getBGLStandard(),
                    data: data,
                    graphData: this.getDataForGraph(data, timeRange, this.state.graphMode),
                    safeRangeMin: safeRange.minValue,
                    safeRangeMax: safeRange.maxValue,
                    timeRange: timeRange
                });
            })
            .catch((error) => log("getData for " + this.state.graphMode + " failed: " + error));
    };

    /**
     * @param newGraphMode
     */
    updateGraphMode = (newGraphMode) => {
        const graphMode = (typeof newGraphMode !== 'undefined') ? newGraphMode : this.state.graphMode;
        this.getData(this.state.timeRange, graphMode)
            .then((data) => {
                const graphData = this.getDataForGraph(data, this.state.timeRange, newGraphMode);
                this.setState({
                    graphMode: graphMode,
                    // data: data,
                    graphData: graphData
                });
            })
            .catch((error) => log("getData for " + newGraphMode + " failed: " + error));
    };

    /**
     *
     * @param timeRange
     * @param graphMode
     * @returns {*}
     */
    getData(timeRange, graphMode) {
        log("Getting data - mode: " + graphMode + " timeRange: " + timeRange);
        return new Promise(async(resolve) => {
            let data;
            switch (graphMode) {
                case(graphModes.readings):
                    data = timeRange === timeRanges.lastDay ? db.get24hBGLReadings() : db.get60mBGLReadings();
                    break;
                case(graphModes.steps):
                    data = this.mapValuesToDates(await (timeRange === timeRanges.lastDay ? gFit.stepsLast24hInHourBuckets() : gFit.stepsLast60mInMinuteBuckets()));
                    break;
                case(graphModes.calories):
                    break;
            }
            resolve(data);
        });
    }
}