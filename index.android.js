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
    NativeModules
} from 'react-native';
const btManagerNative = NativeModules.BluetoothManagerModule;
import {List, ListItem, Button, Icon} from 'native-base';
import log from './helpers/logger';
import bleManager from 'react-native-ble';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Toast from 'react-native-root-toast';


let scannedDevices = new Set();
let stateManipulator = {};

class GlucoWise extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deviceList: [{advertisement: {localName: 'TEST'}}],
            connectedUUID: ''
        }
    }

    componentWillMount() {
        stateManipulator.updateDeviceList = (devices) => {
            this.setState({
                deviceList: devices
            });
        };

        stateManipulator.updateConnectedDevice = (connectedId) => {
            this.setState({
                connectedUUID: connectedId
            });
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'space-around',
                alignItems: 'center'
            }}>

                <View style={{flex: 1, paddingTop: 20}}>
                    <Button onPress={scanDevices} large style={{backgroundColor: 'cornflowerblue'}}>
                        <Icon theme={{iconFamily: "MaterialIcons"}} style={{paddingBottom: 10}} name="bluetooth"/>Search Devices
                    </Button>
                </View>

                <View style={{flex: 6, alignSelf: 'stretch'}}>
                    <ListItem itemDivider><Text style={{fontSize:20, fontWeight:'bold'}}>Found Devices</Text></ListItem>
                    <List
                        dataArray={[...this.state.deviceList]}
                        renderRow={
                            (item) => (
                                <ListItem itemDivider
                                          onPress={() => connectToDevice(item)}
                                          style={{backgroundColor: 'cornflowerblue'}} button>
                                    <Text style={{color: 'white'}}>
                                            {item.advertisement.localName}&nbsp;-&nbsp;
                                            {item.id}{this.state.connectedUUID === item.id && " - CONNECTED"}
                                    </Text>
                                </ListItem>)
                        }
                    />
                </View>
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

async function connectToDevice(peripheral) {
    const extendedDeviceId = peripheral.advertisement.localName + " - " + peripheral.id;
    peripheral.connect((error) => {
        if (error) {
            log("ERROR on connection with " + extendedDeviceId + ": " + error);
        } else {
            log("CONNECTED");
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

async function scanDevices() {
    btManagerNative.enable((enabled, error) => {
        log("BT ENABLED: " + enabled);
        log("BT ENABLE ERROR: " + error);
        if (enabled) {
            requestLocationServices()
                .then((result) => {
                    if (result) {
                        bleManager.state = "poweredOn";
                        bleManager.emit("stateChange", "poweredOn");
                        bleManager.startScanning();
                    }
                })
                .catch((error) => log("Location Services Request Rejected with: " + error));
        }
    });
}

async function showToast(message) {
    Toast.show(message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0
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

async function onDiscover() {
    bleManager.on('discover', (peripheral) => {
            log("Found device: " + peripheral);
            onConnection(peripheral);
            onDisconnection(peripheral);
            scannedDevices.add(peripheral);
            stateManipulator.updateDeviceList([...scannedDevices]);
        }
    );
}

async function onStateChange() {
    bleManager.on('stateChange', (state) => {
        log("Noble state changed to: " + state);
    });
}

async function onScanStart() {
    bleManager.on('scanStart', () => {
        log("Device scan started");
        setTimeout(function () {
            bleManager.stopScanning();
        }, 10000);
    });
}

async function onScanStop() {
    bleManager.on('scanStop', () => {
        log("Device scan stopped");
    });
}

async function onConnection(peripheral) {
    peripheral.on('connect', () => {
        log("Connecting to " + peripheral.advertisement.localName + " - " + peripheral.id);
        stateManipulator.updateConnectedDevice(peripheral.id)
    });
}

async function onDisconnection(peripheral) {
    peripheral.on('disconnect', () => {
        log("Disconnecting from " + peripheral.advertisement.localName + " - " + peripheral.id);
        stateManipulator.updateConnectedDevice("");
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