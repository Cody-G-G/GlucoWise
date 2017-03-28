import React, {Component} from 'react';
import {View} from 'react-native';
import {Bar} from 'react-native-pathjs-charts';
import styles from './styles';

export default class BarGraph extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const marginTop = (typeof this.props.marginTop !== 'undefined') ? this.props.marginTop : 31;
        const gutter = (typeof this.props.gutter !== 'undefined') ? this.props.gutter : 5;
        const xSize = (typeof this.props.xSize !== 'undefined') ? this.props.xSize : 14;
        const height = (typeof this.props.height !== 'undefined') ? this.props.height : 310;

        const options = {
            width: 310,
            height: height,
            color: '#4169e1',
            gutter: gutter,
            margin: {
                top: marginTop,
                left: 35,
                bottom: 45,
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
                    fontSize: xSize,
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
                <Bar data={[this.props.data]}
                     options={options}
                     accessorKey='y'/>
            </View>
        );
    }
}
