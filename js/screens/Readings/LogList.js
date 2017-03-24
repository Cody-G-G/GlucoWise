'use strict';
import React, {Component} from 'react';
import {ListView, Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {Icon} from 'native-base';
import TextBold from "../../helpers/components/TextBold";
import styles from "./styles";
import dateUtil from "../../helpers/util/date";
import {dbObjects} from "../../helpers/util/constants";

export default class LogList extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    render() {
        const dataSource = this.ds.cloneWithRows(this.props.data);
        return (
            <View style={this.props.style}>
                <ListView dataSource={dataSource} enableEmptySections={true} renderRow={(rowData) =>
                    <View style={styles.logRow}>

                        {rowData.objectName === dbObjects.reading ?
                        <View style={styles.logRowReadingDescription}>
                            <TextBold style={styles.logRowReadingHeaderText}>Glucose Reading</TextBold>
                            <Text style={styles.logRowText}><TextBold>Value:</TextBold> {rowData.value + " " + this.props.standard}</Text>
                            <Text style={styles.logRowText}><TextBold>Date:</TextBold> {dateUtil.toDateTimeString(rowData.date)}</Text>
                        </View>:
                        <View style={styles.logRowFoodDescription}>
                            <TextBold style={styles.logRowFoodHeaderText}>Consumed Food Item</TextBold>
                            <Text style={styles.logRowText}><TextBold>Name:</TextBold> {rowData.name}</Text>
                            <Text style={styles.logRowText}><TextBold>Date:</TextBold> {dateUtil.toDateTimeString(rowData.date)}</Text>
                            <Text style={styles.logRowText}><TextBold>Calories:</TextBold> {rowData.calories} kcal</Text>
                        </View>
                        }

                        <TouchableOpacity
                            style={styles.trashButton}
                            onPress={() => this.props.delete(rowData, rowData.objectName)}>
                                <Icon style={styles.trashIcon} theme={{iconFamily: "MaterialIcons"}} name="delete-forever"/>
                        </TouchableOpacity>
                    </View>
                }/>
            </View>
        );
    }
}