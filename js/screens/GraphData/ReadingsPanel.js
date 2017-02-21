'use strict';
import React, {Component} from 'react';
import {ListItem, Icon} from 'native-base';
import {Text, TouchableOpacity, View, ListView} from 'react-native';
import styles from "./styles";
import db from "../../data/database";
import dateUtil from "../../helpers/util/date";
import TextBold from "../../helpers/components/TextBold";
import TimeRangeButton from "./TimeRangeButton";

export default class ReadingsPanel extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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
                <ListView dataSource={this.ds.cloneWithRows(this.props.readings)} enableEmptySections={true} renderRow={(rowData) =>
                    <View style={styles.reading}>
                        <Text style={styles.readingText}>
                            <TextBold>Value:</TextBold> {rowData.value + " mg/dl"}{"\n"}
                            <TextBold>Date:</TextBold> {dateUtil.toDateTimeString(rowData.date)}
                        </Text>
                        <TouchableOpacity
                            style={styles.trashButton}
                            onPress={() => db.deleteReading(rowData)}>
                                <Icon style={{color:'white', fontSize:30}} theme={{iconFamily: "MaterialIcons"}} name="delete-forever"/>
                        </TouchableOpacity>
                    </View>
                }/>
            </View>
        );
    }
}