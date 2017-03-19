'use strict';
import React, {Component} from'react';
import {View} from 'react-native';
import {timeRanges} from "../../helpers/util/constants";
import ToggleButton from "../../helpers/components/ToggleButton";
import styles from "./styles";

export default class TimeRangePanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.timeRangePanel}>
                <ToggleButton type={timeRanges.lastDay}
                              selectedType={this.props.timeRange}
                              onPress={() => this.props.onPress(timeRanges.lastDay)}
                              onColor='royalblue'
                              offColor='darkgrey'
                              onText={timeRanges.lastDay}
                              offText={timeRanges.lastDay}/>
                <ToggleButton type={timeRanges.lastHour}
                              selectedType={this.props.timeRange}
                              onPress={() => this.props.onPress(timeRanges.lastHour)}
                              onColor='royalblue'
                              offColor='darkgrey'
                              onText={timeRanges.lastHour}
                              offText={timeRanges.lastHour}/>
            </View>
        );
    }
}