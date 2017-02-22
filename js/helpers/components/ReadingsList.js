'use strict';
import React, {Component} from 'react';
import {ListView, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'native-base';
import TextBold from "./TextBold";
import styles from "./styles";
import db from "../../data/database";
import dateUtil from "../util/date";

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
        );
    }
}