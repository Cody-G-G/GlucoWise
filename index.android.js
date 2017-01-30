'use strict';

import React, {Component} from 'react';
import {
    AppRegistry,
    Navigator,
    View,
    Text,
    ListView,
    ScrollView,
    StyleSheet,
    PermissionsAndroid,
    NetInfo,
    NativeModules,
    TouchableOpacity
} from 'react-native';
const btManagerNative = NativeModules.BluetoothManagerModule;
const Spinner = require('react-native-spinkit');
import {ListItem, Button, Icon} from 'native-base';
import log from './helpers/logger';
import bleManager from 'react-native-ble';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
let scannedDevices = new Set();
let stateManipulator = {};

const styles = StyleSheet.create({
    deviceButton: {
        flex: 2,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 7
    },
    deviceButtonText: {
        color: 'white',
        fontSize: 20
    },
    deviceDescription: {
        backgroundColor: 'cornflowerblue',
        color: 'white',
        flex: 4,
        fontSize: 20,
        padding: 7
    },
    device: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 1
    },
    deviceListHeader: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    buttonPanel: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 20
    },
    devicesPanel: {
        flex: 6,
        alignSelf: 'stretch'
    },
    spinnerPanel: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    screenContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center'
    }

});

class GlucoWise extends Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     deviceList: ds.cloneWithRows([
        //         {advertisement: {localName: 'TEST'}, id: 'UUIDTEST'},
        //         {advertisement: {localName: 'TEST2'}, id: ''},
        //         {advertisement: {localName: 'TEST3'}, id: ''},
        //         {advertisement: {localName: 'TEST4'}, id: 'UUIDTEST4'},
        //         {advertisement: {localName: 'TEST5'}, id: ''},
        //         {advertisement: {localName: 'TEST6'}, id: ''},
        //         {advertisement: {localName: 'TEST7'}, id: ''},
        //         {advertisement: {localName: 'TEST8'}, id: ''},
        //         {advertisement: {localName: 'TEST9'}, id: ''}
        //     ]),
        //     scanning: false,
        //     connectedUUIDs: ['UUIDTEST', 'UUIDTEST4']
        // };

        this.state = {
            deviceList: ds.cloneWithRows([]),
            scanning: false,
            connectedUUIDs: []
        }
    }

    componentWillMount() {
        stateManipulator.updateDeviceList = (devices) => {
            this.setState({
                deviceList: ds.cloneWithRows(devices)
            });
        };

        stateManipulator.addConnectedDevice = (connectedId) => {
            let connectedUUIDs = this.state.connectedUUIDs.slice();
            connectedUUIDs.push(connectedId);
            this.setState({
                connectedUUIDs: connectedUUIDs
            });
        };

        stateManipulator.removeConnectedDevices = (connectedId) => {
            let connectedUUIDs = this.state.connectedUUIDs.slice();
            connectedUUIDs.splice(connectedUUIDs.indexOf(connectedId));
            this.setState({
                connectedUUIDs: connectedUUIDs
            });
        };

        stateManipulator.updateScanning = (scanning) => {
            this.setState({scanning: scanning});
        };
    }

    renderSpinnerPanel() {
        if (this.state.scanning) {
            return (
                <View style={styles.spinnerPanel}>
                    <Spinner isVisible={this.state.scanning} size={100} type={'Wave'} color={'#6495ED'}/>
                </View>
            );
        } else return null;
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <View style={styles.buttonPanel}>
                    <Button onPress={scanDevices} large style={{backgroundColor: 'cornflowerblue'}} disabled={this.state.scanning}>
                        <Icon theme={{iconFamily: "MaterialIcons"}} name="bluetooth"/>Search Devices
                    </Button>
                </View>

                <View style={styles.devicesPanel}>
                    <ListItem itemDivider>
                        <Text style={styles.deviceListHeader}>Found Devices</Text>
                    </ListItem>
                    <ListView dataSource={this.state.deviceList} enableEmptySections={true} renderRow={(rowData) =>
                                <View style={styles.device}>
                                    <Text style={styles.deviceDescription}>
                                            <B>Name:</B> {rowData.advertisement.localName}{"\n"}
                                            <B>Id:</B> {rowData.id}
                                    </Text>
                                    <TouchableOpacity
                                        style={StyleSheet.flatten([styles.deviceButton, {backgroundColor: this.state.connectedUUIDs.includes(rowData.id) ? 'firebrick' : 'green'}])}
                                        onPress={() => toggleDeviceConnection(rowData)}>
                                            <Text style={styles.deviceButtonText}>
                                                {this.state.connectedUUIDs.includes(rowData.id) ? "Disconnect" : "Connect"}
                                            </Text>
                                    </TouchableOpacity>
                                </View>
                        }
                    />
                </View>

                {this.renderSpinnerPanel()}
            </View>
        )
    }

    componentDidMount() {
        requestLocationCoarsePermission();
        onDiscover();
        onStateChange();
        onScanStart();
        onScanStop();
    }
}

function toggleDeviceConnection(peripheral) {
    const extendedDeviceId = peripheral.advertisement.localName + " - " + peripheral.id + " - " + peripheral.state ;
    log("Toggling connection with peripheral: <" + extendedDeviceId + ">");

    if (peripheral.state === "disconnected") {
        connectPeripheral(peripheral, extendedDeviceId)
    } else if (peripheral.state === 'connected') {
        disconnectPeripheral(peripheral, extendedDeviceId);
    }
}

function connectPeripheral(peripheral, extendedDeviceId) {
    peripheral.connect((error) => {
        if (error) {
            log("ERROR on connection with " + extendedDeviceId + ": " + error);
        } else {
            log("CONNECTED " + extendedDeviceId);
            peripheral.discoverSomeServicesAndCharacteristics(null, ["0000ffe400001000800000805f9b34fb"], (error, services, characteristics) => {
                if (error)
                    log("ERROR: " + error);
                else {
                    log("CHARACTERISTICS: " + characteristics[0]);
                    characteristics[0].subscribe((error) => {
                        log("ERROR ON SUBSCRIPTION: " + error);
                    });
                    characteristics[0].on('data', (data, isNotification) => log("DATA: " + data));
                }
            });
        }
    });
}

function disconnectPeripheral(peripheral, extendedDeviceId) {
    peripheral.disconnect((error) => {
        if(error) {
            log("ERROR on disconnection with " + extendedDeviceId + ": " + error);
        } else {
            log("DISCONNECTED " + extendedDeviceId)
        }
    });
}

function scanDevices() {
    btManagerNative.enable((enabled, error) => {
        if (error) {
            log("BT ENABLE ERROR: " + error);
        } else {
            if (enabled) {
                log("BT ENABLED: " + enabled);
                requestLocationServices()
                    .then((result) => {
                        if (result) {
                            bleManager.state = "poweredOn";
                            bleManager.emit("stateChange", "poweredOn");
                            bleManager.startScanning();
                        }
                    })
                    .catch((error) => log("Location Services Request Rejected with: " + error));
            } else {
                log("BT ENABLE CANCELLED");
            }
        }
    });
}

async function requestLocationCoarsePermission() {
    try {
        const granted = await
            PermissionsAndroid.requestPermission(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                {
                    'title': 'Location permission',
                    'message': 'In order to use bluetooth, the app needs Location permissions.'
                }
            );
        log("Permission LOCATION_COARSE granted: " + granted);
    } catch (err) {
        log("ERROR on requesting LOCATION_COARSE_LOCATION permission: " + err);
    }
}

function onDiscover() {
    bleManager.on('discover', (peripheral) => {
            log("Found device: " + peripheral);
            onConnection(peripheral);
            onDisconnection(peripheral);
            scannedDevices.add(peripheral);
            stateManipulator.updateDeviceList([...scannedDevices]);
        }
    );
}

function onStateChange() {
    bleManager.on('stateChange', (state) => {
        log("Noble state changed to: " + state);
    });
}

function onScanStart() {
    bleManager.on('scanStart', () => {
        log("Device scan started");
        stateManipulator.updateScanning(true);
        setTimeout(function () {
            bleManager.stopScanning();
        }, 10000);
    });
}

function onScanStop() {
    bleManager.on('scanStop', () => {
        log("Device scan stopped");
        stateManipulator.updateScanning(false);
    });
}

function onConnection(peripheral) {
    peripheral.on('connect', () => {
        log("Connecting to " + peripheral.advertisement.localName + " - " + peripheral.id);
        stateManipulator.addConnectedDevice(peripheral.id);
    });
}

function onDisconnection(peripheral) {
    peripheral.on('disconnect', () => {
        log("Disconnecting from " + peripheral.advertisement.localName + " - " + peripheral.id);
        stateManipulator.removeConnectedDevices(peripheral.id);
    });
}

async function requestLocationServices() {
    log("Requesting Location Services");
    return new Promise((resolve, reject) => {
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
            ok: "YES",
            cancel: "NO"
        })
            .then((success) => {
                log("Location Service Request Success: " + success);
                resolve(true)
            })
            .catch((error) => {
                log("Location Service Request ERROR: " + error.message);
                reject(false);
            });
    });
}

AppRegistry.registerComponent('GlucoWise', () => GlucoWise);