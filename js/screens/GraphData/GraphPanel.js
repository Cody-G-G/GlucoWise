import React, {Component} from 'react';
import {View, Dimensions} from 'react-native';
import {StockLine} from 'react-native-pathjs-charts';
import styles from './styles';

export default class GraphPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
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
                labelFunction: (v) => {
                    return parseFloat(v.toFixed(1));
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

        let readings = typeof this.props.readings[0][0] != 'undefined' ? this.props.readings : [[{x: 0, y: 0}]];
        return (
            <View style={styles.graphPanel}>
                <StockLine data={readings}
                           options={options}
                           regions={regions}
                           regionStyling={regionStyling}
                           xKey='x'
                           yKey='y'/>
            </View>
        );
    }
}