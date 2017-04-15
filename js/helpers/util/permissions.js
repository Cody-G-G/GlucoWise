'use strict';
import log from "./logger";
import {PermissionsAndroid} from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

export default {
    requestLocationServices: () => {
        log("Requesting Location Services");
        return new Promise((resolve, reject) => {
            LocationServicesDialogBox.checkLocationServicesIsEnabled({
                message: "<h2>Enable location settings ?</h2>In order to perform a bluetooth scan, you must enable <b>Location Services</b>. To proceed, press '<b>YES</b>'. A new screen will appear, where you can enable Location Services using the toggle button in the <b>top right corner</b>. Return by using the back button.<br/><br/>",
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