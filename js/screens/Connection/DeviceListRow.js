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
        const device = JSON.parse(this.props.device);
        const deviceButtonStyle = StyleSheet.flatten([styles.deviceButton, {backgroundColor: this.buttonColor(device)}]);

        return (
            <View style={styles.device}>
                <Text style={styles.deviceDescription}>
                    <TextBold>Name:</TextBold> {device.name}{"\n"}
                    <TextBold>Id:</TextBold> {device.id}
                </Text>

                <TouchableOpacity style={deviceButtonStyle} onPress={() => this.props.onPress(device)}>
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