'use strict';
import log from "./logger";
import {PermissionsAndroid} from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

export default {
    requestLocationServices: () => {
        log("Requesting Location Services");
        return new Promise((resolve, reject) => {
            LocationServicesDialogBox.checkLocationServicesIsEnabled({
                message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
                ok: "YES",
                cancel: "NO"
            })
                .then((success) => {
                    log("Location Service Request Success: " + success);
                    resolve();
                })
                .catch((error) => {
                    log("Location Service Request ERROR: " + error.message);
                })
        })
    },

    requestLocationCoarsePermission: () => {
        log("Requesting Location Coarse Permission");
        return new Promise((resolve, reject) => {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((alreadyGranted) => {
                alreadyGranted && resolve(true);
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION, {
                    'title': 'Location permission',
                    'message': 'In order to use bluetooth, the app needs Location permissions. To enable, tap the screen outside of this box, after which you will be prompted.'
                })
                    .then((result) => {
                        const granted = result === PermissionsAndroid.RESULTS.GRANTED;
                        log("Permission LOCATION_COARSE granted: " + granted);
                        resolve(granted);
                    })
                    .catch((error) => {
                        log("Location Coarse Permission ERROR: " + error);
                    });
            })
        })
    }
};