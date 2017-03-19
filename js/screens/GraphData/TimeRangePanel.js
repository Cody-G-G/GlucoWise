'use strict';
import React, {Component} from'react';
import {View} from 'react-native';
import TimeRangeButton from "./TimeRangeButton";
import {timeRanges} from "../../helpers/util/constants";
import styles from "./styles";

export default class TimeRangePanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.timeRangePanel}>
                <TimeRangeButton type={timeRanges.lastDay}
                                 selectedType={this.props.timeRange}
                                 onPress={() => this.props.onPress(timeRanges.lastDay)}/>
                <TimeRangeButton type={timeRanges.lastHour}
                                 selectedType={this.props.timeRange}
                                 onPress={() => this.props.onPress(timeRanges.lastHour)}/>
            </View>
        );
    }
}