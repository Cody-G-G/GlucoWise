'use strict';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import ReadingsGraphPanel from './ReadingsGraphPanel';
import StepsGraphPanel from './StepsGraphPanel';
import ReadingsListPanel from './ReadingsListPanel';
import db from "../../data/database";
import gFit from "../../data/googleFit";
import dateUtil from "../../helpers/util/date";
import {graphModes} from "../../helpers/util/constants";
import log from "../../helpers/util/logger";

export default class GraphScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hourRange: 1,
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
        let timeRangeButtonText = this.state.hourRange === 24 ? "60m" : "24h";
        let currentTimeRange = this.state.hourRange === 24 ? "24h" : "60m";
        return (
            <View style={styles.screenContainer}>
                {this.state.graphMode === graphModes.readings ?
                    <ReadingsGraphPanel readings={this.state.graphData}
                                        safeRangeMin={this.state.safeRangeMin}
                                        safeRangeMax={this.state.safeRangeMax}
                                        standard={this.state.standard}/> :
                    <StepsGraphPanel steps={this.state.graphData}/>
                }
                <ReadingsListPanel readings={this.state.data}
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

    componentWillUnmount() {
        log("Unmounting GraphScreen");
    }

    /**
     * @param data
     * @param hourRange
     * @param graphMode
     * @returns {[*]}
     */
    getDataForGraph(data, hourRange, graphMode) {
        log("Processing data for graph: " + JSON.stringify(data));
        let graphData = [];
        let timeUnitsFromPresent = hourRange === 24 ? dateUtil.hoursFromPresent : dateUtil.minutesFromPresent;
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

    toggleTimeRange = () => {
        log("Toggled time range");
        this.updateState(this.state.hourRange === 24 ? 1 : 24);
    };

    /**
     * @param newHourRange
     */
    updateState = (newHourRange) => {
        const hourRange = (typeof newHourRange !== 'undefined') ? newHourRange : this.state.hourRange;
        this.getData(hourRange, this.state.graphMode)
            .then((data) => {
                const safeRange = db.getBGLSafeRange();
                this.setState({
                    standard: db.getBGLStandard(),
                    data: data,
                    graphData: this.getDataForGraph(data, hourRange, this.state.graphMode),
                    safeRangeMin: safeRange.minValue,
                    safeRangeMax: safeRange.maxValue,
                    hourRange: hourRange
                });
            })
            .catch((error) => log("getData for " + this.state.graphMode + " failed: " + error));
    };

    /**
     * @param newGraphMode
     */
    updateGraphMode = (newGraphMode) => {
        const graphMode = (typeof newGraphMode !== 'undefined') ? newGraphMode : this.state.graphMode;
        this.getData(this.state.hourRange, graphMode)
            .then((data) => {
                const graphData = this.getDataForGraph(data, this.state.hourRange, newGraphMode);
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
     * @param hourRange
     * @param graphMode
     * @returns {*}
     */
    getData(hourRange, graphMode) {
        log("Getting data - mode: " + graphMode + " hourRange: " + hourRange);
        return new Promise(async(resolve) => {
            let data;
            switch (graphMode) {
                case(graphModes.readings):
                    data = hourRange === 24 ? db.get24hBGLReadings() : db.get60mBGLReadings();
                    break;
                case(graphModes.steps):
                    data = this.mapValuesToDates(await (hourRange === 24 ? gFit.stepsLast24hInHourBuckets() : gFit.stepsLast60mInMinuteBuckets()));
                    break;
                case(graphModes.calories):
                    break;
            }
            resolve(data);
        });
    }
}