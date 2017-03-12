'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    NativeAppEventEmitter
} from 'react-native';
import styles from "./styles";
import hexToAscii from "../../helpers/util/hexToAscii";
import permissions from "../../helpers/util/permissions";
import log from '../../helpers/util/logger';
import BleManager from 'react-native-ble-manager';
import SearchButtonPanel from "./SearchButtonPanel";
import DevicesPanel from "./DevicesPanel";
import db from "../../data/database";
const Spinner = require('react-native-spinkit');

export default class ConnectionScreen extends Component {
    constructor(props) {
        super(props);
        this.pressedScan = false;
        this.state = {
            scannedDevices: [],
            devicesTogglingConnection: [],
            scanning: false,
            connectedDeviceIDs: []
        };
    }

    render() {
        log("Rendering ConnectionScreen");
        return (
            <View style={styles.screenContainer}>
                <SearchButtonPanel onPress={this.triggerStateCheckForScan}
                                   scanning={this.state.scanning}/>

                <DevicesPanel onPress={this.toggleDeviceConnection}
                              scannedDevices={this.state.scannedDevices}
                              devicesTogglingConnection={this.state.devicesTogglingConnection}
                              connectedDeviceIDs={this.state.connectedDeviceIDs}/>

                {this.state.scanning &&
                <View style={styles.spinnerPanel}>
                    <Spinner isVisible={this.state.scanning} size={100} type={'Wave'} color={'#4169e1'}/>
                </View>}
            </View>
        );
    }

    componentDidMount() {
        this.initBleManager();
        this.initScanStopListener();
        this.initBluetoothStateChangeListener();
        this.initDeviceDiscoveredListener();
        this.initDeviceConnectedListener();
        this.initDeviceDisconnectedListener();
        this.initReadingCharacteristicUpdate();
    }

    componentWillUnmount() {
        log("Unmounting ConnectionScreen");
    }

    initBleManager() {
        BleManager
            .start()
            .then(() => {
                log('BLE Manager initialized');
            })
            .catch((error) => {
                log("BLE Manager intialization failed: " + error);
            });
    }

    toggleDeviceConnection = (peripheral) => {
        const extendedDeviceId = peripheral.name + " - " + peripheral.id;
        log("Toggling connection with peripheral: <" + extendedDeviceId + ">");
        this.addDeviceTogglingConnection(peripheral.id);

        BleManager.isPeripheralConnected(peripheral.id, [])
            .then((isConnected) => {
                if (isConnected)
                    this.disconnectPeripheral(peripheral, extendedDeviceId);
                else
                    this.connectPeripheral(peripheral, extendedDeviceId);
            })
            .catch((error) => {
                this.removeDeviceTogglingConnection(peripheral.id);
                log("Checking connection to " + extendedDeviceId + " failed: " + error);
            });
    };

    connectPeripheral(peripheral, extendedDeviceId) {
        log("Connecting to " + extendedDeviceId);
        BleManager.connect(peripheral.id)
            .then((peripheralInfo) => {
                log("Connected and found information for device: " + JSON.stringify(peripheralInfo));
                this.enableCharacteristicNotifications(peripheral.id, extendedDeviceId, "ffe0", "ffe4");
            })
            .catch((error) => {
                log("Connection to " + extendedDeviceId + " failed: " + error);
            });
    }

    enableCharacteristicNotifications(deviceId, extendedDeviceId, serviceUUID, characteristicUUID) {
        BleManager.startNotification(deviceId, serviceUUID, characteristicUUID)
            .then(() => log("Notification started for peripheral " + extendedDeviceId + ", service: " + serviceUUID + ", characteristic " + characteristicUUID))
            .catch((error) => log("Error starting notification for peripheral " + extendedDeviceId + ", service: " + serviceUUID + ", characteristic " + characteristicUUID))
    }

    disconnectPeripheral(peripheral, extendedDeviceId) {
        log("Disconnecting from " + extendedDeviceId);
        BleManager.disconnect(peripheral.id)
            .then(() => {
                log("Disconnected from " + extendedDeviceId);
            })
            .catch((error) => {
                log("Disconnecting from " + extendedDeviceId + " failed: " + error);
            });
    }

    triggerStateCheckForScan = () => {
        this.updatePressedScan(true);
        BleManager.checkState();
    };

    startScan() {
        BleManager.scan([], 10)
            .then(() => {
                log("Scan started");
                this.updateScanning(true);
            })
            .catch((error) => {
                log("Error thrown on scan: " + error);
            })
    }

    initReadingCharacteristicUpdate() {
        NativeAppEventEmitter.addListener("BleManagerDidUpdateValueForCharacteristic", (args) => {
            log(typeof args.value);
            log(hexToAscii(args.value));
            const reading = hexToAscii(args.value).slice(0, 5);
            log("Peripheral " + args.peripheral + " characteristic " + args.characteristic + " was updated to " + reading);
            db.saveBGLReading(reading, new Date());
        });
    }

    initDeviceDiscoveredListener() {
        NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral',
            (simpleDeviceObj) => {
                simpleDeviceObj.rssi = undefined;
                let strDeviceObject = JSON.stringify(simpleDeviceObj);
                log("Found device: " + strDeviceObject);
                if (!this.state.scannedDevices.includes(strDeviceObject)) {
                    this.addScannedDevice(strDeviceObject);
                }
            }
        );
    }

    initScanStopListener() {
        NativeAppEventEmitter.addListener('BleManagerStopScan', () => {
            log("Scan stopped");
            this.updateScanning(false)
        });
    }

    initDeviceConnectedListener() {
        NativeAppEventEmitter.addListener('BleManagerConnectPeripheral', (args) => {
            this.removeDeviceTogglingConnection(args.peripheral);
            this.addConnectedDevice(args.peripheral);
            log("Connected to device: " + args.peripheral);
        });
    }

    initDeviceDisconnectedListener() {
        NativeAppEventEmitter.addListener('BleManagerDisconnectPeripheral', (args) => {
            this.removeDeviceTogglingConnection(args.peripheral);
            this.removeConnectedDevice(args.peripheral);
            log("Disconnected device: " + args.peripheral);
        });
    }

    initBluetoothStateChangeListener() {
        NativeAppEventEmitter.addListener('BleManagerDidUpdateState', (args) => {
            log("Bluetooth state is " + args.state);
            if (args.state !== "turning-off" && args.state !== "turning-on" && this.pressedScan) {
                this.updatePressedScan(false);

                permissions.requestLocationCoarsePermission().then((granted) => {
                    granted && permissions.requestLocationServices().then(() => {
                        BleManager.enableBluetooth()
                            .then(() => {
                                log("Bluetooth enabled");
                                this.startScan();
                            })
                            .catch((error) => {
                                log("Enabling bluetooth failed: " + error);
                            });
                    });
                });
            }
        });
    }

    addScannedDevice(device) {
        this.setState({
            scannedDevices: [... this.state.scannedDevices, device]
        });
    }

    addConnectedDevice(connectedId) {
        this.setState({
            connectedDeviceIDs: [... this.state.connectedDeviceIDs, connectedId]
        });
    }

    removeConnectedDevice(connectedId) {
        let connectedUUIDs = this.state.connectedDeviceIDs.slice();
        connectedUUIDs.splice(connectedUUIDs.indexOf(connectedId));
        this.setState({
            connectedDeviceIDs: connectedUUIDs
        });
    }

    addDeviceTogglingConnection(deviceId) {
        this.setState({
            devicesTogglingConnection: [... this.state.devicesTogglingConnection, deviceId]
        });
    }

    removeDeviceTogglingConnection(deviceId) {
        let devicesTogglingConnection = this.state.devicesTogglingConnection.slice();
        devicesTogglingConnection.splice(devicesTogglingConnection.indexOf(deviceId));
        this.setState({
            devicesTogglingConnection: devicesTogglingConnection
        });
    }

    updateScanning(scanning) {
        this.setState({scanning: scanning});
    }

    updatePressedScan(pressedScan) {
        this.pressedScan = pressedScan;
    }
}