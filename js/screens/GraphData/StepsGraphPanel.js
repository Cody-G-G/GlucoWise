import React, {Component} from 'react';
import {View, Dimensions} from 'react-native';
import {Bar} from 'react-native-pathjs-charts';
import styles from './styles';

export default class StepsGraphPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const options = {
            width: 315,
            height: 280,
            color: '#4169e1',
            gutter: 5,
            margin: {
                top: 20,
                left: 35,
                bottom: 45,
                right: 10
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
                    fontSize: 12,
                    bold: true,
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
                    fontSize: 12,
                    bold: true,
                    fill: '#34495E'
                }
            }
        };

        let steps = typeof this.props.steps[0][0] === 'undefined' ? [[{x: 5, y: 5}]] : this.props.steps;
        return (
            <View style={styles.graphPanel}>
                <Bar data={steps}
                     options={options}
                     accessorKey='y'/>
            </View>
        );
    }
}
