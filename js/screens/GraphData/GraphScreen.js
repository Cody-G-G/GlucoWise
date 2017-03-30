'use strict';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import ReadingsGraph from './ReadingsGraph';
import BarGraph from './BarGraph';
import db from "../../data/database";
import gFit from "../../data/googleFit";
import dateUtil from "../../helpers/util/date";
import {dataModes, timeRanges, calorieModes} from "../../helpers/util/constants";
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
            graphMode: dataModes.steps,
            calorieMode: calorieModes.expended
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
                [calorieModes.expended]: {
                    [timeRanges.lastDay]: (now) => gFit.caloriesExpendedPrevious24hInHourBuckets(now),
                    [timeRanges.lastWeek]: (now) => gFit.caloriesExpendedPrevious7dInDayBuckets(now)
                },
                [calorieModes.ingested]: {
                    [timeRanges.lastDay]: (now) => db.get24hCaloriesIngested(now),
                    [timeRanges.lastWeek]: (now) => db.get7dCaloriesIngested(now)
                }
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
        const extraModeButtonsToRender = this.getExtraModeButtonsToRender();
        const summaryInfoToRender = this.getSummaryInfoToRender();
        const graphMode = this.state.graphMode;
        const isModeCalories = graphMode === dataModes.calories;
        const timeRangeTypes = Object.keys(isModeCalories ? this.graphDataFunctions[graphMode][this.state.calorieMode] : this.graphDataFunctions[graphMode]);
        const graphModeTypes = Object.values(dataModes);

        return (
            <View style={styles.screenContainer}>
                <View style={styles.mainPanel}>
                    <ToggleButtonsGroup fontSize={20}
                                        types={graphModeTypes}
                                        selectedTypes={[graphMode]}
                                        onPress={this.updateGraphMode}/>
                    {extraModeButtonsToRender}
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

    getExtraModeButtonsToRender() {
        let toRender;
        let calorieTypes = Object.values(calorieModes);

        if (this.state.graphMode === dataModes.calories) {
            toRender = <ToggleButtonsGroup types={calorieTypes}
                                           fontSize={24}
                                           selectedTypes={[this.state.calorieMode]}
                                           onPress={this.updateGraphMode}/>
        }
        return toRender;
    }

    getSummaryInfoToRender() {
        let toRender;
        const graphData = this.state.graphData;

        switch (this.state.graphMode) {
            case dataModes.calories: {
                toRender = this.getSummaryCaloriesInfo(graphData);
                break;
            }
            case dataModes.steps: {
                toRender = this.getSummaryStepsInfo(graphData);
                break;
            }
            case dataModes.weight: {
                toRender = this.getSummaryWeightInfo(graphData);
                break;
            }
        }
        return toRender;
    }

    /**
     * @param graphData
     * @returns {XML}
     */
    getSummaryWeightInfo(graphData) {
        const maxWeight = graphData.length > 0 ? graphData.reduce((acc, curr) => Math.max(acc, curr.y), graphData[0].y) : '- ';
        const minWeight = graphData.length > 0 ? graphData.reduce((acc, curr) => Math.min(acc, curr.y), graphData[0].y) : '- ';

        return (
            <View style={styles.summaryInfoPanel}>
                <Text style={styles.summaryInfoText}>
                    Min: {minWeight}kg     Max: {maxWeight}kg
                </Text>
            </View>
        );
    }

    /**
     * @param graphData
     * @returns {XML}
     */
    getSummaryStepsInfo(graphData) {
        const valueSum = graphData.reduce((acc, curr) => {
            return acc + curr.y;
        }, 0);

        return (
            <View style={styles.summaryInfoPanel}>
                <Text style={styles.summaryInfoText}>
                    Total: {valueSum} steps
                </Text>
            </View>
        );
    }

    /**
     * @param graphData
     * @returns {XML}
     */
    getSummaryCaloriesInfo(graphData) {
        log(JSON.stringify(graphData));
        const isTimeRangeLastWeek = this.state.timeRange === timeRanges.lastWeek;
        const valueSum = graphData.reduce((acc, curr) => {
            return acc + Number(curr.y);
        }, 0);
        const valueAvg6d = graphData.length > 0 ? (valueSum - graphData[graphData.length - 1].y) / (graphData.length - 1) : 0;
        const summaryInfoText = isTimeRangeLastWeek ? "Daily average:" : "Total:";
        const value = isTimeRangeLastWeek ? Math.round(valueAvg6d) : valueSum;

        return (
            <View style={styles.summaryInfoPanel}>
                <Text style={styles.summaryInfoText}>
                    {summaryInfoText} {value} kCal
                </Text>
            </View>
        );
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
                    toRender = <BarGraph data={graphData}/>;
                    break;
                case(dataModes.calories):
                    let gutter = timeRange === timeRanges.lastDay ? 2 : 5;
                    toRender = <BarGraph data={graphData} gutter={gutter} xSize={10} height={290} marginTop={16}/>;
                    break;
                case(dataModes.weight):
                    toRender = <BarGraph data={graphData} marginTop={26}/>;
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
        const isGraphModeCalories = graphMode === dataModes.calories;
        data.forEach((dataPoint) => {
                const xValue = this.getXValue(timeRange, graphMode, dataPoint.date, now);
                const existsPrevious = graphData.length > 0;
                const previousDataPoint = graphData[graphData.length - 1];
                const hasSameXAsPrevious = existsPrevious ? xValue === previousDataPoint[xAxis] : false;

                if (hasSameXAsPrevious && isGraphModeCalories)
                    previousDataPoint.y += dataPoint.value;
                else
                    graphData.push({
                        [xAxis]: xValue,
                        y: dataPoint.value
                    });
            }
        );

        //for time to progress to the right (having present as rightmost point)
        graphData.reverse();
        log("Processed data for graph: " + JSON.stringify(graphData));
        return graphData;
    }

    /**
     * @param timeRange
     * @param graphMode
     * @param date
     * @param now
     * @returns {*}
     */
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

    /**
     * @param graphMode
     * @returns {*}
     */
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
        log("Updating state with time range: " + newTimeRange);
        const now = Date.now();
        const timeRange = (typeof newTimeRange !== 'undefined') ? newTimeRange : this.state.timeRange;
        const graphMode = this.state.graphMode;
        const calorieMode = this.state.calorieMode;

        this.getData(timeRange, graphMode, now, calorieMode)
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
     * @param newMode
     */
    updateGraphMode = (newMode) => {
        const now = Date.now();
        const isGraphMode = Object.values(dataModes).includes(newMode);
        const graphMode = (typeof newMode !== 'undefined' && isGraphMode) ? newMode : this.state.graphMode;
        const calorieMode = (typeof newMode !== 'undefined' && !isGraphMode) ? newMode : this.state.calorieMode;
        const timeRange = this.getTimeRangeForMode(graphMode, calorieMode);

        this.getData(timeRange, graphMode, now, calorieMode)
            .then((data) => {
                const graphData = this.getDataForGraph(data, timeRange, graphMode, now);
                this.setState({
                    graphMode: graphMode,
                    graphData: graphData,
                    timeRange: timeRange,
                    calorieMode: calorieMode
                });
            })
            .catch((error) => log("getData for " + newMode + " failed: " + error));
    };

    getTimeRangeForMode(graphMode, calorieMode) {
        const isModeCalories = graphMode === dataModes.calories;
        const timeRangesForMode = Object.keys(isModeCalories ? this.graphDataFunctions[graphMode][calorieMode] : this.graphDataFunctions[graphMode]);
        return timeRangesForMode.includes(this.state.timeRange) ? this.state.timeRange : timeRangesForMode[0];
    }

    /**
     * @param timeRange
     * @param graphMode
     * @param now
     * @param calorieMode
     * @returns {*}
     */
    getData(timeRange, graphMode, now, calorieMode) {
        log("Getting data - mode: " + graphMode + " timeRange: " + timeRange + " calorieMode: " + calorieMode);
        const isGraphModeGlucose = graphMode === dataModes.glucose;
        const isGraphModeCalories = graphMode === dataModes.calories;
        const isCalorieModeIngested = calorieMode === calorieModes.ingested;
        const graphDataFunction = isGraphModeCalories ? this.graphDataFunctions[graphMode][calorieMode][timeRange] : this.graphDataFunctions[graphMode][timeRange];
        return new Promise(async(resolve) => {
            let data;
            try {
                data = await graphDataFunction(now);
                resolve(isGraphModeGlucose || (isGraphModeCalories && isCalorieModeIngested) ? data : this.mapValuesToDates(data));
            } catch (error) {
                log("Error on getting data: " + error);
                resolve([]);
            }
        });
    }
}