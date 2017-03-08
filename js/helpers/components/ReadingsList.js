'use strict';
import React, {Component} from 'react';
import {ListView, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {Icon} from 'native-base';
import TextBold from "./TextBold";
import styles from "./styles";
import dateUtil from "../util/date";

export default class ReadingsList extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    render() {
        const dataSource = this.ds.cloneWithRows(this.props.readings);

        return (
            <View style={this.props.style}>
                <ListView dataSource={dataSource} enableEmptySections={true} renderRow={(rowData) =>
                    <View style={styles.reading}>
                        <Text style={StyleSheet.flatten([styles.readingText, {backgroundColor: this.props.readings[0] === rowData ? 'royalblue' : 'cornflowerblue'}])}>
                            <TextBold>Value:</TextBold> {rowData.value + " " + this.props.standard}{"\n"}
                            <TextBold>Date:</TextBold> {dateUtil.toDateTimeString(rowData.date)}
                        </Text>
                        <TouchableOpacity
                            style={styles.trashButton}
                            onPress={() => this.props.deleteReading(rowData)}>
                                <Icon style={styles.trashIcon} theme={{iconFamily: "MaterialIcons"}} name="delete-forever"/>
                        </TouchableOpacity>
                    </View>
                }/>
            </View>
        );
    }
}