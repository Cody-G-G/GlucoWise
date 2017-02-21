'use strict';
import React, {Component} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import styles from "./styles";

export default class TimeRangeButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity
                style={styles.timeRangeButton}
                onPress={() => this.props.toggleTimeRange()}>
                <Text style={styles.timeRangeButtonText}>{this.props.timeRangeButtonText} View</Text>
            </TouchableOpacity>
        );
    }
}