'use strict';
jest.mock('react-native-android-location-services-dialog-box', () => {
    return {}
});
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import permissions from '../permissions';

test('requestLocationServices() - prompts user to enable Location Services, returning a Promise that resolves when enabled successfully', () => {
    const stubPromiseEnabled = Promise.resolve('enabled');
    const stubPromiseDisabled = Promise.resolve('disabled');
    const expectedPromiseEnabled = stubPromiseEnabled.then(() => {
        Promise.resolve()
    });
    const expectedPromiseDisabled = stubPromiseDisabled.catch(() => {
    });

    LocationServicesDialogBox.checkLocationServicesIsEnabled = jest.genMockFunction().mockReturnValue(stubPromiseEnabled);
    expect(permissions.requestLocationServices()).toEqual(expectedPromiseEnabled);
    LocationServicesDialogBox.checkLocationServicesIsEnabled = jest.genMockFunction().mockReturnValue(stubPromiseDisabled);
    expect(permissions.requestLocationServices()).toEqual(expectedPromiseDisabled);
});