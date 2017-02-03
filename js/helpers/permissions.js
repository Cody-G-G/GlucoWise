'use strict';
import log from "./logger";
import {PermissionsAndroid} from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

const permissions = {
    requestLocationServices: function (callback) {
        log("Requesting Location Services");
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
            ok: "YES",
            cancel: "NO"
        })
            .then((success) => {
                log("Location Service Request Success: " + success);
                callback();
            })
            .catch((error) => {
                log("Location Service Request ERROR: " + error.message);
            });
    },

    requestLocationCoarsePermission: function () {
        try {
            const granted = PermissionsAndroid.requestPermission(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, {
                    'title': 'Location permission',
                    'message': 'In order to use bluetooth, the app needs Location permissions.'
                }
            );
            log("Permission LOCATION_COARSE granted: " + granted);
        } catch (err) {
            log("ERROR on requesting LOCATION_COARSE_LOCATION permission: " + err);
        }
    }
};

export default permissions;