'use strict';
import DeviceListRow from "../DeviceListRow";
import React from 'react'; // this is from a 3rd party dependency NPM module, "react"
import 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import renderer from 'react-test-renderer'; // this is from a 3rd party dependency NPM module, "react-test-renderer"

test('DeviceListRow_withDeviceConnected - renders correctly', () => {
    const device = '{"name": "DEVICE_NAME", "id": "DEVICE_ID"}';
    const connectedDeviceIDs = [
        JSON.parse(device).id,
        "DEVICE_ID2",
        "DEVICE_ID3"
    ];

    const tree = renderer.create(
        <DeviceListRow device={device}
                       connectedDeviceIDs={connectedDeviceIDs}
                       devicesTogglingConnection={[]}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('DeviceListRow_withDeviceDisconnected - renders correctly', () => {
    const device = '{"name": "DEVICE_NAME", "id": "DEVICE_ID"}';
    const connectedDeviceIDs = [
        "DEVICE_ID2",
        "DEVICE_ID3"
    ];

    const tree = renderer.create(
        <DeviceListRow device={device}
                       connectedDeviceIDs={connectedDeviceIDs}
                       devicesTogglingConnection={[]}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});