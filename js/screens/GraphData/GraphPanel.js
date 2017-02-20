import React, {Component} from 'react';
import {View, Dimensions} from 'react-native';
import {StockLine} from 'react-native-pathjs-charts';
import styles from './styles';

export default class GraphPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let readings = [[
            {x: 24, y: 70},
            {x: 20, y: 130},
            {x: 15, y: 110},
            {x: 13, y: 90},
            {x: 9.66, y: 65},
            {x: 8, y: 150}
        ]];
        this.props.readings[0] = this.props.readings[0].concat(readings[0]);
        const regions = [{
            label: '',
            from: 70,
            to: 130,
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
            width: 315,
            height: 280,
            color: '#2980B9',
            margin: {
                top: 20,
                left: 35,
                bottom: 25,
                right: 10
            },
            animate: {
                type: 'delayed',
                duration: 200
            },
            axisX: {
                showAxis: true,
                showLines: true,
                showLabels: true,
                showTicks: true,
                zeroAxis: false,
                orient: 'bottom',
                tickValues: [
                    {value: 0},
                    {value: 2},
                    {value: 4},
                    {value: 6},
                    {value: 8},
                    {value: 10},
                    {value: 12},
                    {value: 14},
                    {value: 16},
                    {value: 18},
                    {value: 20},
                    {value: 22},
                    {value: 24}
                ],
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
                tickValues: [
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
                ],
                label: {
                    fontFamily: 'Arial',
                    fontSize: 14,
                    fontWeight: true,
                    fill: '#34495E'
                }
            },
            min: 40,
            max: 220,
            showAreas: false,
            strokeWidth: 3
        };

        return (
            <View style={styles.graphPanel}>
                <StockLine data={this.props.readings}
                           options={options}
                           regions={regions}
                           regionStyling={regionStyling}
                           xKey='x'
                           yKey='y'/>
            </View>
        );
    }
}
