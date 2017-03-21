'use strict';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import ReadingsGraph from './ReadingsGraph';
import BarGraph from './BarGraph';
import db from "../../data/database";
import gFit from "../../data/googleFit";
import dateUtil from "../../helpers/util/date";
import {graphModes, timeRanges} from "../../helpers/util/constants";
import log from "../../helpers/util/logger";
import RadioButtonsPanel from "./RadioButtonsPanel";
import GraphsHelpModal from "./GraphsHelpModal";
import emitter from "../../helpers/util/eventEmitter";

export default class GraphScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeRange: timeRanges.lastDay,
            graphData: [[]],
            safeRangeMin: '',
            safeRangeMax: '',
            standard: '',
            graphMode: graphModes.steps
        };
        this.graphDataFunctions = {
            [graphModes.steps]: {
                [timeRanges.lastDay]: () => gFit.stepsLast24hInHourBuckets(),
                [timeRanges.lastHour]: () => gFit.stepsLast60mInMinuteBuckets()
            },
            [graphModes.glucose]: {
                [timeRanges.lastDay]: () => db.get24hBGLReadings(),
                [timeRanges.lastHour]: () => db.get60mBGLReadings()
            },
            [graphModes.calories]: {
                [timeRanges.lastDay]: () => gFit.caloriesExpendedLast24hInHourBuckets(),
                [timeRanges.lastWeek]: () => gFit.caloriesExpendedLast7dInDayBuckets()
            }
        };
        this.timeUnitsFromPresentFunctions = {
            [timeRanges.lastHour]: (date) => dateUtil.minutesFromPresent(date),
            [timeRanges.lastDay]: (date) => dateUtil.hoursFromPresent(date),
            [timeRanges.lastWeek]: (date) => dateUtil.daysFromPresent(date)
        };
    }

    componentWillMount() {
        this.updateState();
    }

    render() {
        log("Rendering GraphScreen");
        const graphToRender = this.getGraphToRender();
        const totalToRender = this.getTotalToRender();
        const timeRangeTypes = Object.keys(this.graphDataFunctions[this.state.graphMode]);

        return (
            <View style={styles.screenContainer}>
                <View style={styles.mainPanel}>
                    <RadioButtonsPanel fontSize={25}
                                       types={[graphModes.glucose, graphModes.steps, graphModes.calories]}
                                       selectedType={this.state.graphMode}
                                       onPress={this.updateGraphMode}/>
                    {totalToRender}
                    {graphToRender}
                    <RadioButtonsPanel types={timeRangeTypes}
                                       selectedType={this.state.timeRange}
                                       onPress={this.updateState}/>
                </View>
                <GraphsHelpModal helpOpen={this.state.helpOpen} onClose={this.closeHelpModal}/>
            </View>
        );
    }

    componentDidMount() {
        db.initBGLReadingListener(this.updateState);
        db.initBGLSafeRangeListener(this.updateState);
        db.initBGLStandardListener(this.updateState);
        this.initGraphsHelpListener();
    }

    componentWillUnmount() {
        log("Unmounting GraphScreen");
    }

    initGraphsHelpListener() {
        emitter.addGraphsHelpListener(() => {
            this.setState({
                helpOpen: true
            });
        });
    }

    closeHelpModal = () => {
        this.setState({
            helpOpen: false
        });
    };

    getTotalToRender() {
        if (this.state.graphMode !== graphModes.glucose) {
            const valuesSum = this.state.graphData[0].reduce((acc, curr) => {
                return acc + curr.y;
            }, 0);
            const valuesUnit = this.state.graphMode === graphModes.calories ? 'kCal' : 'steps';
            return (
                <View style={styles.totalPanel}>
                    <Text style={styles.totalText}>
                        Total: {valuesSum} {valuesUnit}
                    </Text>
                </View>
            );
        }
    }

    getGraphToRender() {
        let toRender;
        if (this.state.graphData[0].length > 0)
            switch (this.state.graphMode) {
                case(graphModes.glucose):
                    toRender = <ReadingsGraph readings={this.state.graphData}
                                              safeRangeMin={this.state.safeRangeMin}
                                              safeRangeMax={this.state.safeRangeMax}
                                              standard={this.state.standard}/>;
                    break;
                case(graphModes.steps):
                    toRender = <BarGraph data={this.state.graphData} gutter={5} xSize={14}/>;
                    break;
                case(graphModes.calories):
                    let xSize = this.state.timeRange === timeRanges.lastDay ? 10 : 14;
                    let gutter = this.state.timeRange === timeRanges.lastDay ? 2 : 5;
                    toRender = <BarGraph data={this.state.graphData} gutter={gutter} xSize={xSize}/>;
                    break;
            }
        else
            toRender = (
                <View style={styles.graphPanel}>
                    <Text style={styles.noDataText}>No data to plot</Text>
                </View>
            );

        return toRender
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
        let timeUnitsFromPresent = this.timeUnitsFromPresentFunctions[timeRange];
        let xAxis = this.getXAxisString(graphMode);
        data.forEach((dataPoint) => {
                let graphDataPoint = {};
                graphDataPoint[xAxis] = timeUnitsFromPresent(dataPoint.date);
                graphDataPoint["y"] = dataPoint.value;

                const graphModeIsSteps = graphMode === graphModes.steps;
                const previousDataPoint = graphData[graphData.length - 1];
                const existsPreviousDataPoint = typeof previousDataPoint !== 'undefined';
                const currentDataPointHasSameTimeAsPrevious = existsPreviousDataPoint ? graphDataPoint[xAxis] === previousDataPoint[xAxis] : false; // due to rounding, two datapoints might have same X

                if (currentDataPointHasSameTimeAsPrevious && graphModeIsSteps)
                    previousDataPoint.y = previousDataPoint.y + graphDataPoint.y;
                else
                    graphData.push(graphDataPoint);
            }
        );
        log("Processed data for graph: " + JSON.stringify(graphData));
        return [graphData];
    }

    getXAxisString(graphMode) {
        switch (graphMode) {
            case(graphModes.glucose):
                return "x";
            case(graphModes.steps):
                return "name";
            case(graphModes.calories):
                return "name";
        }
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
        const timeRangesForMode = Object.keys(this.graphDataFunctions[graphMode]);
        const timeRange = timeRangesForMode.includes(this.state.timeRange) ? this.state.timeRange : timeRangesForMode[0];
        this.getData(timeRange, graphMode)
            .then((data) => {
                const graphData = this.getDataForGraph(data, timeRange, newGraphMode);
                this.setState({
                    graphMode: graphMode,
                    graphData: graphData,
                    timeRange: timeRange
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
            let data = await this.graphDataFunctions[graphMode][timeRange]();
            resolve(graphMode === graphModes.glucose ? data : this.mapValuesToDates(data));
        });
    }
}