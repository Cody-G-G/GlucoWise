'use strict';
import React, {Component} from 'react';
import {ListItem} from 'native-base';
import {View, Text, ListView} from 'react-native';
import styles from "./styles";
import DeviceListRow from "./DeviceListRow";

export default class DevicesPanel extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    }

    render() {
        const dataSource = this.ds.cloneWithRows(this.props.scannedDevices);

        return (
            <View style={styles.devicesPanel}>
                <ListItem itemDivider>
                    <Text style={styles.deviceListHeader}>Found Devices</Text>
                </ListItem>

                <ListView dataSource={dataSource}
                          enableEmptySections={true}
                          renderRow={(rowData) =>
                                <DeviceListRow device={rowData}
                                               connectedDeviceIDs={this.props.connectedDeviceIDs}
                                               onPress={this.props.onPress}
                                               devicesTogglingConnection={this.props.devicesTogglingConnection}/>
                          }
                />
            </View>
        );
    }
}