'use strict';
import React, {Component} from 'react'; // this is from a 3rd party dependency NPM module, "react"
import {ListItem} from 'native-base'; // this is from a 3rd party dependency NPM module, "native-base"
import {View, Text, ListView, StyleSheet} from 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import styles from "./styles";
import DeviceListRow from "./DeviceListRow";

export default class DevicesPanel extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    render() {
        const dataSource = this.ds.cloneWithRows(this.props.scannedDevices);
        const devicesPanelFlex = this.props.scanning ? 4.6 : 6;
        const devicesPanelStyle = StyleSheet.flatten([styles.devicesPanel, {flex: devicesPanelFlex}]);
        return (
            <View style={devicesPanelStyle}>
                <ListItem itemDivider>
                    <Text style={styles.deviceListHeader}>Found Devices</Text>
                </ListItem>

                <ListView dataSource={dataSource} enableEmptySections={true} renderRow={(rowData) =>
                    <DeviceListRow device={rowData} connectedDeviceIDs={this.props.connectedDeviceIDs} onPress={this.props.onPress}/>
                }/>
            </View>
        );
    }
}