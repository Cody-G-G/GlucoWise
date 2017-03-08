'use strict';
import React, {Component} from 'react';
import styles from "./styles";
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import TextBold from "../../helpers/components/TextBold";

export default class DeviceListRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const device = this.props.device;
        return (
            <View style={styles.device}>
                <Text style={styles.deviceDescription}>
                    <TextBold>Name:</TextBold> {device.name}{"\n"}
                    <TextBold>Id:</TextBold> {device.id}
                </Text>

                <TouchableOpacity
                    style={StyleSheet.flatten([styles.deviceButton, {backgroundColor: this.buttonColor(device)}])}
                    onPress={() => this.props.onPress(device)}
                    disabled={this.props.devicesTogglingConnection.includes(device.id)}>

                    <Text style={styles.deviceButtonText}>{this.buttonText(device)}</Text>

                </TouchableOpacity>
            </View>
        );
    }

    buttonColor(device) {
        return this.props.connectedDeviceIDs.includes(device.id) ? 'firebrick' : 'green';
    };

    buttonText(device) {
        return this.props.connectedDeviceIDs.includes(device.id) ? "Disconnect" : "Connect";
    }
}