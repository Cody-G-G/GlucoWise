'use strict';
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    ListView,
    NativeAppEventEmitter
} from 'react-native';
import styles from "./styles";
import hexToAscii from "./../../helpers/h2a";
import permissions from "./../../helpers/permissions";
import log from './../../helpers/logger';
import BleManager from 'react-native-ble-manager';
import SearchButtonPanel from "./SearchButtonPanel";
import DevicesPanel from "./DevicesPanel";
const Spinner = require('react-native-spinkit');

class ConnectionScreen extends Component {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.scannedDevices = [];
        this.pressedScan = false;
        this.state = {
            scannedDevices: this.ds.cloneWithRows([]),
            devicesTogglingConnection: [],
            scanning: false,
            connectedDevices: []
        };
    }

    render() {
        return (
            <View style={styles.screenContainer}>
                <SearchButtonPanel onPress={this.triggerStateCheckForScan.bind(this)}
                                   scanning={this.state.scanning}/>

                <DevicesPanel onPress={this.toggleDeviceConnection.bind(this)}
                              scannedDevices={this.state.scannedDevices}
                              devicesTogglingConnection={this.state.devicesTogglingConnection}
                              connectedDevices={this.state.connectedDevices}/>

                {this.state.scanning &&
                <View style={styles.spinnerPanel}>
                    <Spinner isVisible={this.state.scanning} size={100} type={'Wave'} color={'#6495ED'}/>
                </View>}
            </View>
        );
    }

    componentDidMount() {
        permissions.requestLocationCoarsePermission();
        this.initializeBleManager();
        this.onScanStop();
        this.onBluetoothStateChange();
        this.onDeviceDiscovered();
        this.onDeviceConnected();
        this.onDeviceDisconnected();
        this.onCharacteristicUpdate();
    }

    initializeBleManager() {
        BleManager
            .start()
            .then(() => {
                log('BLE Manager initialized');
            })
            .catch((error) => {
                log("BLE Manager intialization failed: " + error);
            });
    }

    toggleDeviceConnection(peripheral) {
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
    }

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

    triggerStateCheckForScan() {
        this.updatePressedScan(true);
        BleManager.checkState();
    }

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

    onCharacteristicUpdate() {
        NativeAppEventEmitter.addListener("BleManagerDidUpdateValueForCharacteristic", (args) => {
            log("Peripheral " + args.peripheral + " characteristic " + args.characteristic + " was updated to " + hexToAscii(args.value));
        });
    }

    onDeviceDiscovered() {
        NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral',
            (simpleDeviceObj) => {
                simpleDeviceObj.rssi = undefined;
                let strDeviceObject = JSON.stringify(simpleDeviceObj);
                log("Found device: " + strDeviceObject);
                if (!this.scannedDevices.includes(strDeviceObject)) {
                    this.scannedDevices.push(strDeviceObject);
                    this.updateScannedDevices([...this.scannedDevices]);
                }
            }
        );
    }

    onScanStop() {
        NativeAppEventEmitter.addListener('BleManagerStopScan', () => {
            log("Scan stopped");
            this.updateScanning(false)
        });
    }

    onDeviceConnected() {
        NativeAppEventEmitter.addListener('BleManagerConnectPeripheral', (args) => {
            this.removeDeviceTogglingConnection(args.peripheral);
            this.addConnectedDevice(args.peripheral);
            log("Connected to device: " + args.peripheral);
        });
    }

    onDeviceDisconnected() {
        NativeAppEventEmitter.addListener('BleManagerDisconnectPeripheral', (args) => {
            this.removeDeviceTogglingConnection(args.peripheral);
            this.removeConnectedDevices(args.peripheral);
            log("Disconnected device: " + args.peripheral);
        });
    }

    onBluetoothStateChange() {
        NativeAppEventEmitter.addListener('BleManagerDidUpdateState', (args) => {
            log("Bluetooth state is " + args.state);
            if (args.state !== "turning-off" && args.state !== "turning-on" && this.pressedScan) {
                this.updatePressedScan(false);
                BleManager.enableBluetooth()
                    .then(() => {
                        log("Bluetooth enabled");
                        permissions.requestLocationServices(this.startScan.bind(this));
                    })
                    .catch((error) => {
                        log("Enabling bluetooth failed: " + error);
                    });
            }
        });
    }

    updateScannedDevices(devices) {
        this.setState({
            scannedDevices: this.ds.cloneWithRows(devices)
        });
    }

    addConnectedDevice(connectedId) {
        let connectedUUIDs = this.state.connectedDevices.slice();
        connectedUUIDs.push(connectedId);
        this.setState({
            connectedDevices: connectedUUIDs
        });
    }

    removeConnectedDevices(connectedId) {
        let connectedUUIDs = this.state.connectedDevices.slice();
        connectedUUIDs.splice(connectedUUIDs.indexOf(connectedId));
        this.setState({
            connectedDevices: connectedUUIDs
        });
    }

    addDeviceTogglingConnection(deviceId) {
        let devicesTogglingConnection = this.state.devicesTogglingConnection.slice();
        devicesTogglingConnection.push(deviceId);
        this.setState({
            devicesTogglingConnection: devicesTogglingConnection
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

export default ConnectionScreen;