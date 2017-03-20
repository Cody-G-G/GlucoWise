import React, {Component} from 'react';
import {View, Dimensions} from 'react-native';
import {Bar} from 'react-native-pathjs-charts';
import styles from './styles';

export default class StepsGraph extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const options = {
            width: 310,
            height: 325,
            color: '#4169e1',
            gutter: 5,
            margin: {
                top: 26,
                left: 35,
                bottom: 40,
                right: 5
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
            }
        };

        return (
            <View style={styles.graphPanel}>
                <Bar data={this.props.steps}
                     options={options}
                     accessorKey='y'/>
            </View>
        );
    }
}
