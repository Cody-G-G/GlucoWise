'use strict';
import React, {Component} from 'react';
import {ListItem} from 'native-base';
import {View, Text} from 'react-native';
import styles from "./styles";
import ReadingsList from "../../helpers/components/ReadingsList";
import TimeRangeButton from "./TimeRangeButton";

export default class ReadingsPanel extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.readingsPanel}>
                <View style={{flexDirection: 'row'}}>
                    <ListItem style={{flex: 4}} itemDivider>
                        <Text style={styles.readingsListHeaderText}>Readings last {this.props.currentTimeRange}</Text>
                    </ListItem>
                    <TimeRangeButton toggleTimeRange={this.props.toggleTimeRange}
                                     timeRangeButtonText={this.props.timeRangeButtonText}/>
                </View>
                <ReadingsList readings={this.props.readings} standard={this.props.standard} deleteReading={this.props.deleteReading}/>
            </View>
        );
    }
}