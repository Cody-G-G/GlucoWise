import React, {Component} from 'react';
import {View, Dimensions} from 'react-native';
import {StockLine} from 'react-native-pathjs-charts';
import styles from './styles';

export default class StepsGraph extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const options = {
            width: 310,
            height: 350,
            color: '#4169e1',
            margin: {
                top: 30,
                left: 35,
                bottom: 40,
                right: 15
            },
            axisX: {
                showAxis: true,
                showLines: true,
                showLabels: true,
                showTicks: true,
                zeroAxis: false,
                orient: 'bottom',
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
                label: {
                    fontFamily: 'Arial',
                    fontSize: 14,
                    fontWeight: true,
                    fill: '#34495E'
                }
            },
            min: 0,
            showAreas: true,
            strokeWidth: 3
        };

        return (
            <View style={styles.graphPanel}>
                <StockLine data={this.props.calories}
                           options={options}
                           xKey='x'
                           yKey='y'/>
            </View>
        );
    }
}
