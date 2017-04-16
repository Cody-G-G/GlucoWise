'use strict';
import DevicesPanel from "../DevicesPanel";
import React from 'react'; // this is from a 3rd party dependency NPM module, "react"
import 'react-native'; // this is from a 3rd party dependency NPM module, "react-native"
import renderer from 'react-test-renderer'; // this is from a 3rd party dependency NPM module, "react-test-renderer"

test('DevicesPanel - renders correctly', () => {
    const device1 = '{"name": "DEVICE_NAME", "id": "DEVICE_ID"}';
    const device2 = '{"name": "DEVICE_NAME2", "id": "DEVICE_ID2"}';
    const device3 = '{"name": "DEVICE_NAME3", "id": "DEVICE_ID3"}';
    const scannedDevices = [device1, device2, device3];
    const connectedDeviceIDs = [device2.id, device3.id];

    const tree = renderer.create(
        <DevicesPanel scannedDevices={scannedDevices}
                      connectedDeviceIDs={connectedDeviceIDs}
                      devicesTogglingConnection={[]}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
});