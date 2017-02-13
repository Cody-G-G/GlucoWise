'use strict';
import React, { Component } from 'react';
import { ListItem } from 'native-base';
import { View, StyleSheet, ListView, Text, TouchableOpacity } from 'react-native';
import styles from "./styles";
import TextBold from "../../helpers/components/TextBold";
import log from "../../helpers/util/logger";
import db from "../../data/database";

export default class DevicesPanel extends Component {
    constructor(props) {
        super(props);
        // db.saveBGLReading(180, new Date());
        // db.saveBGLReading(180, new Date());
        // let readings = db.getBGLReadings();
        // log("READINGS: " + readings.length + " " + readings[0].value);
    }

    render() {
        return (
            <View style={styles.devicesPanel}>

                <ListItem itemDivider>
                    <Text style={styles.deviceListHeader}>Found Devices</Text>
                </ListItem>

                <ListView dataSource={this.props.scannedDevices} enableEmptySections={true} renderRow={(rowData) =>
                                <View style={styles.device}>
                                    <Text style={styles.deviceDescription}>
                                            <TextBold>Name:</TextBold> {JSON.parse(rowData).name}{"\n"}
                                            <TextBold>Id:</TextBold> {JSON.parse(rowData).id}
                                    </Text>

                                    <TouchableOpacity
                                        style={StyleSheet.flatten([styles.deviceButton, {backgroundColor: this.buttonColor(rowData)}])}
                                        onPress={() => this.props.onPress(JSON.parse(rowData))}
                                        disabled={this.props.devicesTogglingConnection.includes(JSON.parse(rowData).id)}>

                                            <Text style={styles.deviceButtonText}>{this.buttonText(rowData)}</Text>

                                    </TouchableOpacity>
                                </View>
                         }
                />
            </View>
        );
    }

    buttonColor(rowData) {
        return this.props.connectedDevices.includes(JSON.parse(rowData).id) ? 'firebrick' : 'green';
    }

    buttonText(rowData) {
        return this.props.connectedDevices.includes(JSON.parse(rowData).id) ? "Disconnect" : "Connect";
    }
}