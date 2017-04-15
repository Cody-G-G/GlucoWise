import React, {Component} from 'react';
import {View} from 'react-native';
import {StockLine} from 'react-native-pathjs-charts';
import styles from './styles';
import processBGLValue from "../../helpers/util/readingProcessor";
import {timeRanges, readingUnitStandards} from "../../helpers/util/constants";
import dateUtil from "../../helpers/util/date";

export default class ReadingsGraph extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const readings = this.props.readings;
        const minReading = readings.reduce((acc, cur) => Math.min(acc, cur.y), readings.length > 0 && readings[0].y);
        const maxReading = readings.reduce((acc, cur) => Math.max(acc, cur.y), readings.length > 0 && readings[0].y);
        let minLimit = processBGLValue(30, this.props.standard);
        let maxLimit = processBGLValue(250, this.props.standard);
        minLimit = minLimit < minReading ? minLimit : minReading;
        maxLimit = maxLimit > maxReading ? maxLimit : maxReading;
        const safeRangeMin = this.props.safeRangeMin >= minLimit ? this.props.safeRangeMin : minLimit;
        const safeRangeMax = this.props.safeRangeMax <= maxLimit ? this.props.safeRangeMax : maxLimit;

        const regions = [{
            label: '',
            from: safeRangeMin,
            to: safeRangeMax,
            fill: '#18c947'
        }];

        const regionStyling = {
            labelOffset: {
                left: 25,
                top: 5,
            },
            fillOpacity: 0.5
        };

        const options = {
            width: 305,
            height: 370,
            color: '#4169e1',
            margin: {
                top: 30,
                left: 35,
                bottom: 40,
                right: 10
            },
            axisX: {
                showAxis: true,
                showLines: true,
                showLabels: true,
                showTicks: true,
                zeroAxis: false,
                orient: 'bottom',
                labelFunction: (v) => {
                    return this.props.timeRange === timeRanges.lastDay ? dateUtil.hourOfDayHoursAgo((24 - v), Date.now()) : 60 - v;
                },
                label: {
                    fontFamily: 'Arial',
                    fontSize: 14,
                    fontWeight: true,
                    fill: '#34495E'
                }
            },
            axisY: {
                showAxis: true,
                showLines: true,
                showLabels: true,
                showTicks: true,
                zeroAxis: false,
                orient: 'left',
                tickValues: this.getYTickValues(minLimit, maxLimit),
                label: {
                    fontFamily: 'Arial',
                    fontSize: 14,
                    fontWeight: true,
                    fill: '#34495E'
                }
            },
            min: minLimit,
            max: maxLimit,
            showAreas: false,
            strokeWidth: 3
        };

        return (
            <View style={styles.graphPanel}>
                <StockLine data={[readings]}
                           options={options}
                           regions={regions}
                           regionStyling={regionStyling}
                           xKey='x'
                           yKey='y'/>
            </View>
        );
    }

    getYTickValues(min, max) {
        const tickValues = [];
        const numberOfTicks = 14;
        const tickDifference = this.props.standard === readingUnitStandards.US ?
            Math.round(((max - min) / numberOfTicks) / 10) * 10 :
            (max - min) / numberOfTicks;
        for (let tick = min; tick <= max; tick += tickDifference) {
            tickValues.push({value: Math.round(tick)});
        }
        return tickValues
    }
}