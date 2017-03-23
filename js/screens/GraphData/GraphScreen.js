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
            graphData: [],
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
            },
            [graphModes.weight]: {
                [timeRanges.lastMonth]: () => gFit.weightLast30dInDayBuckets(),
                [timeRanges.lastHalfYear]: () => gFit.weightLast6MInWeekBuckets(),
                [timeRanges.lastYear]: () => gFit.weightLast1yInMonthBuckets()
            }
        };
        this.timeRangeDataFunctions = {
            [timeRanges.lastHour]: (date) => dateUtil.minutesFromPresent(date),
            [timeRanges.lastDay]: (date) => dateUtil.hoursFromPresent(date),
            [timeRanges.lastWeek]: (date) => dateUtil.dayOfWeek(date),
            [timeRanges.lastMonth]: (date) => dateUtil.daysFromPresent(date),
            [timeRanges.lastHalfYear]: (date) => dateUtil.weeksFromPresent(date),
            [timeRanges.lastYear]: (date) => dateUtil.monthsFromPresent(date)
        };
    }

    componentWillMount() {
        this.updateState();
    }

    render() {
        log("Rendering GraphScreen");
        const graphToRender = this.getGraphToRender();
        const summaryInfoToRender = this.getSummaryInfoToRender();
        const timeRangeTypes = Object.keys(this.graphDataFunctions[this.state.graphMode]);
        const graphModeTypes = Object.values(graphModes);

        return (
            <View style={styles.screenContainer}>
                <View style={styles.mainPanel}>
                    <RadioButtonsPanel fontSize={20}
                                       types={graphModeTypes}
                                       selectedType={this.state.graphMode}
                                       onPress={this.updateGraphMode}/>
                    {summaryInfoToRender}
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

    getSummaryInfoToRender() {
        let toRender;
        const graphMode = this.state.graphMode;
        const graphData = this.state.graphData;
        const isModeCalories = graphMode === graphModes.calories;
        const isModeSteps = graphMode === graphModes.steps;
        const isModeWeight = graphMode === graphModes.weight;
        const isTimeRangeLastWeek = this.state.timeRange === timeRanges.lastWeek;

        if (isModeCalories || isModeSteps) {
            const valueSum = graphData.reduce((acc, curr) => {
                return acc + curr.y;
            }, 0);

            const summaryInfoText = isTimeRangeLastWeek ? "Daily average:" : "Total:";
            const valuesUnit = isModeCalories ? 'kCal' : 'steps';
            const value = isModeCalories && isTimeRangeLastWeek ? Math.round(valueSum / graphData.length) : valueSum;

            toRender = (
                <View style={styles.summaryInfoPanel}>
                    <Text style={styles.summaryInfoText}>
                        {summaryInfoText} {value} {valuesUnit}
                    </Text>
                </View>
            );
        } else if (isModeWeight) {
            const maxWeight = graphData.reduce((acc, curr) => Math.max(acc, curr.y), graphData[0].y);
            const minWeight = graphData.reduce((acc, curr) => Math.min(acc, curr.y), graphData[0].y);

            toRender = (
                <View style={styles.summaryInfoPanel}>
                    <Text style={styles.summaryInfoText}>
                        Min: {minWeight}kg     Max: {maxWeight}kg
                    </Text>
                </View>
            );
        }
        return toRender;
    }

    getGraphToRender() {
        let toRender;
        const graphData = this.state.graphData;
        const timeRange = this.state.timeRange;

        if (graphData.length > 0)
            switch (this.state.graphMode) {
                case(graphModes.glucose):
                    toRender = <ReadingsGraph readings={graphData}
                                              timeRange={timeRange}
                                              safeRangeMin={this.state.safeRangeMin}
                                              safeRangeMax={this.state.safeRangeMax}
                                              standard={this.state.standard}/>;
                    break;
                case(graphModes.steps):
                    toRender = <BarGraph data={graphData} gutter={5} xSize={14}/>;
                    break;
                case(graphModes.calories):
                    let gutter = timeRange === timeRanges.lastDay ? 2 : 5;
                    toRender = <BarGraph data={graphData} gutter={gutter} xSize={10}/>;
                    break;
                case(graphModes.weight):
                    toRender = <BarGraph data={graphData} gutter={2} xSize={10}/>;
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
        const graphData = [];
        const xAxis = this.getXAxisString(graphMode);
        data.forEach((dataPoint) => {
                const graphDataPoint = {
                    [xAxis]: this.getXValue(timeRange, graphMode, dataPoint.date),
                    y: dataPoint.value
                };

                const graphModeIsSteps = graphMode === graphModes.steps;
                const graphModeIsCalories = graphMode === graphModes.calories;
                const timeRangeIs24h = timeRange === timeRanges.lastDay;
                const previousDataPoint = graphData[graphData.length - 1];
                const existsPreviousDataPoint = typeof previousDataPoint !== 'undefined';
                const currentDataPointHasSameTimeAsPrevious = existsPreviousDataPoint ? graphDataPoint[xAxis] === previousDataPoint[xAxis] : false;
                //^ due to rounding, two data points might have same X

                if (currentDataPointHasSameTimeAsPrevious && (graphModeIsSteps || (graphModeIsCalories && timeRangeIs24h)))
                    previousDataPoint.y = previousDataPoint.y + graphDataPoint.y;
                else
                    graphData.push(graphDataPoint);
            }
        );

        //for time to progress to the right (having present as rightmost point)
        graphData.reverse();
        log("Processed data for graph: " + JSON.stringify(graphData));
        return graphData;
    }

    getXValue(timeRange, graphMode, date) {
        const computedTimeUnits = this.timeRangeDataFunctions[timeRange](date);
        const timeRangeIs24h = timeRange === timeRanges.lastDay;
        let xValue;
        switch (graphMode) {
            case(graphModes.glucose):
                xValue = timeRangeIs24h ? (24 - computedTimeUnits) : (60 - computedTimeUnits);
                break;
            case(graphModes.steps):
                xValue = timeRangeIs24h ? dateUtil.hourOfDayHoursAgo(computedTimeUnits) : computedTimeUnits;
                break;
            case(graphModes.calories):
                xValue = timeRangeIs24h ? dateUtil.hourOfDayHoursAgo(computedTimeUnits) : computedTimeUnits;
                break;
            case(graphModes.weight):
                xValue = computedTimeUnits;
                break;
        }

        return xValue;
    }

    getXAxisString(graphMode) {
        switch (graphMode) {
            case(graphModes.glucose):
                return "x";
            case(graphModes.steps):
                return "name";
            case(graphModes.calories):
                return "name";
            case(graphModes.weight):
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
        const graphMode = this.state.graphMode;

        this.getData(timeRange, graphMode)
            .then((data) => {
                const safeRange = db.getBGLSafeRange();
                this.setState({
                    standard: db.getBGLStandard(),
                    data: data,
                    graphData: this.getDataForGraph(data, timeRange, graphMode),
                    safeRangeMin: safeRange.minValue,
                    safeRangeMax: safeRange.maxValue,
                    timeRange: timeRange
                });
            })
            .catch((error) => log("getData for " + graphMode + " failed: " + error));
    };

    /**
     * @param newGraphMode
     */
    updateGraphMode = (newGraphMode) => {
        const graphMode = (typeof newGraphMode !== 'undefined') ? newGraphMode : this.state.graphMode;
        const timeRange = this.getTimeRangeForMode(graphMode);

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

    getTimeRangeForMode(graphMode) {
        const timeRangesForMode = Object.keys(this.graphDataFunctions[graphMode]);
        return timeRangesForMode.includes(this.state.timeRange) ? this.state.timeRange : timeRangesForMode[0]
    }

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