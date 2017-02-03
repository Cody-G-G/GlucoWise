'use strict';
import React, {Component} from 'react';
import {ListItem} from 'native-base';
import {View, StyleSheet, ListView, Text, TouchableOpacity} from 'react-native';
import styles from "./styles";
const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

class DevicesPanel extends Component {
    constructor(props) {
        super(props);
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
                                            <B>Name:</B> {JSON.parse(rowData).name}{"\n"}
                                            <B>Id:</B> {JSON.parse(rowData).id}
                                    </Text>
                                    <TouchableOpacity
                                        style={StyleSheet.flatten([styles.deviceButton, {backgroundColor: this.props.connectedDevices.includes(JSON.parse(rowData).id) ? 'firebrick' : 'green'}])}
                                        onPress={() => this.props.onPress(JSON.parse(rowData))} disabled={this.props.devicesTogglingConnection.includes(JSON.parse(rowData).id)}>
                                            <Text style={styles.deviceButtonText}>
                                                {this.props.connectedDevices.includes(JSON.parse(rowData).id) ? "Disconnect" : "Connect"}
                                            </Text>
                                    </TouchableOpacity>
                                </View>
                            }
                />
            </View>
        );
    }
}

export default DevicesPanel;