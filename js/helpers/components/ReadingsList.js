'use strict';
import React, {Component} from 'react';
import {ListView, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'native-base';
import TextBold from "./TextBold";
import styles from "./styles";
import dateUtil from "../util/date";
import processReading from "../util/readingProcessor";

export default class ReadingsList extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    render() {
        return (
            <ListView dataSource={this.ds.cloneWithRows(this.props.readings)} enableEmptySections={true} renderRow={(rowData) =>
                    <View style={styles.reading}>
                        <Text style={styles.readingText}>
                            <TextBold>Value:</TextBold> {processReading(rowData.value, this.props.standard, 1) + " " + this.props.standard}{"\n"}
                            <TextBold>Date:</TextBold> {dateUtil.toDateTimeString(rowData.date)}
                        </Text>
                        <TouchableOpacity
                            style={styles.trashButton}
                            onPress={() => this.props.deleteReading(rowData)}>
                                <Icon style={{color:'white', fontSize:30}} theme={{iconFamily: "MaterialIcons"}} name="delete-forever"/>
                        </TouchableOpacity>
                    </View>
            }/>
        );
    }
}