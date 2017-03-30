import React, {Component} from 'react';
import {View} from 'react-native';
import {StockLine} from 'react-native-pathjs-charts';
import styles from './styles';
import processBGLValue from "../../helpers/util/readingProcessor";
import {timeRanges} from "../../helpers/util/constants";
import dateUtil from "../../helpers/util/date";

export default class ReadingsGraph extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const regions = [{
            label: '',
            from: this.props.safeRangeMin,
            to: this.props.safeRangeMax,
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
                tickValues: this.getYTickValues(),
                label: {
                    fontFamily: 'Arial',
                    fontSize: 14,
                    fontWeight: true,
                    fill: '#34495E'
                }
            },
            min: processBGLValue(40, this.props.standard),
            max: processBGLValue(220, this.props.standard),
            showAreas: false,
            strokeWidth: 3
        };

        return (
            <View style={styles.graphPanel}>
                <StockLine data={[this.props.readings]}
                           options={options}
                           regions={regions}
                           regionStyling={regionStyling}
                           xKey='x'
                           yKey='y'/>
            </View>
        );
    }

    getYTickValues() {
        return [
            {value: 40},
            {value: 55},
            {value: 70},
            {value: 90},
            {value: 110},
            {value: 130},
            {value: 150},
            {value: 170},
            {value: 190},
            {value: 205},
            {value: 220}
        ].map(entry => {
            return {value: processBGLValue(entry.value, this.props.standard)}
        });
    }
}