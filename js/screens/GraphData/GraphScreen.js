'use strict';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import ReadingsGraph from './ReadingsGraph';
import BarGraph from './BarGraph';
import db from "../../data/database";
import gFit from "../../data/googleFit";
import dateUtil from "../../helpers/util/date";
import {dataModes, timeRanges} from "../../helpers/util/constants";
import log from "../../helpers/util/logger";
import ToggleButtonsGroup from "../../helpers/components/ToggleButtonsGroup";
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
            graphMode: dataModes.steps
        };
        this.graphDataFunctions = {
            [dataModes.steps]: {
                [timeRanges.lastDay]: (now) => gFit.stepsLast24hInHourBuckets(now),
                [timeRanges.lastHour]: (now) => gFit.stepsLast60mInMinuteBuckets(now)
            },
            [dataModes.glucose]: {
                [timeRanges.lastDay]: () => db.get24hBGLReadings(),
                [timeRanges.lastHour]: () => db.get60mBGLReadings()
            },
            [dataModes.calories]: {
                [timeRanges.lastDay]: (now) => gFit.caloriesExpendedPrevious24hInHourBuckets(now),
                [timeRanges.lastWeek]: (now) => gFit.caloriesExpendedPrevious7dInDayBuckets(now)
            },
            [dataModes.weight]: {
                [timeRanges.lastMonth]: (now) => gFit.weightLast30dInDayBuckets(now),
                [timeRanges.lastHalfYear]: (now) => gFit.weightLast6MInWeekBuckets(now),
                [timeRanges.lastYear]: (now) => gFit.weightLast1yInMonthBuckets(now)
            }
        };
        this.timeRangeDataFunctions = {
            [timeRanges.lastHour]: (from, now) => dateUtil.minutesBetween(from, now),
            [timeRanges.lastDay]: (from, now) => dateUtil.hoursBetween(from, now),
            [timeRanges.lastWeek]: (date) => dateUtil.dayOfWeek(date),
            [timeRanges.lastMonth]: (from, now) => dateUtil.daysBetween(from, now),
            [timeRanges.lastHalfYear]: (date) => dateUtil.monthOfYear(date),
            [timeRanges.lastYear]: (date) => dateUtil.monthOfYear(date)
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
        const graphModeTypes = Object.values(dataModes);

        return (
            <View style={styles.screenContainer}>
                <View style={styles.mainPanel}>
                    <ToggleButtonsGroup fontSize={20}
                                        types={graphModeTypes}
                                        selectedTypes={[this.state.graphMode]}
                                        onPress={this.updateGraphMode}/>
                    {summaryInfoToRender}
                    {graphToRender}
                    <ToggleButtonsGroup types={timeRangeTypes}
                                        selectedTypes={[this.state.timeRange]}
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
        const isModeCalories = graphMode === dataModes.calories;
        const isModeSteps = graphMode === dataModes.steps;
        const isModeWeight = graphMode === dataModes.weight;
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
                case(dataModes.glucose):
                    toRender = <ReadingsGraph readings={graphData}
                                              timeRange={timeRange}
                                              safeRangeMin={this.state.safeRangeMin}
                                              safeRangeMax={this.state.safeRangeMax}
                                              standard={this.state.standard}/>;
                    break;
                case(dataModes.steps):
                    toRender = <BarGraph data={graphData} gutter={5} xSize={14}/>;
                    break;
                case(dataModes.calories):
                    let gutter = timeRange === timeRanges.lastDay ? 2 : 5;
                    toRender = <BarGraph data={graphData} gutter={gutter} xSize={10}/>;
                    break;
                case(dataModes.weight):
                    toRender = <BarGraph data={graphData} gutter={5} xSize={14}/>;
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
     * @param now
     * @returns {[*]}
     */
    getDataForGraph(data, timeRange, graphMode, now) {
        log("Processing data for graph: " + JSON.stringify(data));
        const graphData = [];
        const xAxis = this.getXAxisString(graphMode);
        data.forEach((dataPoint) => {
                graphData.push({
                    [xAxis]: this.getXValue(timeRange, graphMode, dataPoint.date, now),
                    y: dataPoint.value
                });
            }
        );

        //for time to progress to the right (having present as rightmost point)
        graphData.reverse();
        log("Processed data for graph: " + JSON.stringify(graphData));
        return graphData;
    }

    getXValue(timeRange, graphMode, date, now) {
        const computedTimeUnits = this.timeRangeDataFunctions[timeRange](date, now);
        const timeRangeIs24h = timeRange === timeRanges.lastDay;
        let xValue;
        switch (graphMode) {
            case(dataModes.glucose):
                xValue = timeRangeIs24h ? Math.round(24 - computedTimeUnits) : Math.round(60 - computedTimeUnits);
                break;
            case(dataModes.steps):
                xValue = timeRangeIs24h ? dateUtil.hourOfDayHoursAgo(computedTimeUnits, now) : Math.round(computedTimeUnits);
                break;
            case(dataModes.calories):
                xValue = timeRangeIs24h ? dateUtil.hourOfDayHoursAgo(computedTimeUnits, now) : computedTimeUnits;
                break;
            case(dataModes.weight):
                xValue = timeRange === timeRanges.lastMonth ? Math.round(computedTimeUnits) : computedTimeUnits;
                break;
        }

        return xValue;
    }

    getXAxisString(graphMode) {
        switch (graphMode) {
            case(dataModes.glucose):
                return "x";
            case(dataModes.steps):
                return "name";
            case(dataModes.calories):
                return "name";
            case(dataModes.weight):
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
        const now = Date.now();
        const timeRange = (typeof newTimeRange !== 'undefined') ? newTimeRange : this.state.timeRange;
        const graphMode = this.state.graphMode;

        this.getData(timeRange, graphMode, now)
            .then((data) => {
                const safeRange = db.getBGLSafeRange();
                this.setState({
                    standard: db.getBGLStandard(),
                    data: data,
                    graphData: this.getDataForGraph(data, timeRange, graphMode, now),
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
        const now = Date.now();
        const graphMode = (typeof newGraphMode !== 'undefined') ? newGraphMode : this.state.graphMode;
        const timeRange = this.getTimeRangeForMode(graphMode);

        this.getData(timeRange, graphMode, now)
            .then((data) => {
                const graphData = this.getDataForGraph(data, timeRange, newGraphMode, now);
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
     * @param now
     * @returns {*}
     */
    getData(timeRange, graphMode, now) {
        log("Getting data - mode: " + graphMode + " timeRange: " + timeRange);
        return new Promise(async(resolve) => {
            let data = await this.graphDataFunctions[graphMode][timeRange](now);
            resolve(graphMode === dataModes.glucose ? data : this.mapValuesToDates(data));
        });
    }
}