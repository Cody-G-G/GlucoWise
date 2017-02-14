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
            height: 265,
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
