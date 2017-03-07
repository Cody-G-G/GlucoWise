'use strict';
jest.mock('ListView', () => {
    return require('react').createClass({
        statics: {
            DataSource: require.requireActual('ListView').DataSource,
        },
        render() {
            return require('react').createElement('ListView', this.props, this.props.children);
        }
    });
});
import DevicesPanel from "../DevicesPanel";
import React from 'react';
import 'react-native';
import {ListView} from 'react-native';
import renderer from 'react-test-renderer';

test('DevicesPanel - renders correctly', () => {
    const device1 = {name: "DEVICE_NAME", id: "DEVICE_ID"};
    const device2 = {name: "DEVICE_NAME2", id: "DEVICE_ID2"};
    const device3 = {name: "DEVICE_NAME3", id: "DEVICE_ID3"};
    const scannedDevices = (new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})).cloneWithRows([
        device1, device2, device3
    ]);

    const tree = renderer.create(
        <DevicesPanel scannedDevices={scannedDevices}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
