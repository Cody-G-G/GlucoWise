import log from "./../helpers/util/logger";
import {NativeModules, DeviceEventEmitter} from 'react-native';
const googleFit = NativeModules.GoogleFit;

class GoogleFit {

    authorizeAndConnect() {
        googleFit.authorizeAndConnect();
    }

    onConnected(callback) {
        DeviceEventEmitter.addListener('GoogleFitConnected', (args) => {
            callback(args);
        });
    }

    onDisconnected(callback) {
        DeviceEventEmitter.addListener('GoogleFitDisconnected', (args) => {
            callback(args);
        });
    }

    stepsToday(callback) {
        googleFit.stepsToday(callback);
    }

    stepsTodayInHourBuckets(callback) {
        googleFit.stepsTodayInHourBuckets(callback);
    }

    stepsLast24hInHourBuckets(callback) {
        googleFit.stepsLast24hInHourBuckets(callback);
    }

    stepsLast60mInMinuteBuckets(callback) {
        googleFit.stepsLast60mInMinuteBuckets(callback);
    }

    caloriesExpendedLast60mInMinuteBuckets(callback) {
        googleFit.caloriesExpendedLast60mInMinuteBuckets(callback);
    }

    caloriesExpendedLast24hInHourBuckets(callback) {
        googleFit.caloriesExpendedLast24hInHourBuckets(callback);
    }

    disconnect() {
        googleFit.disconnect();
    }
}

export default new GoogleFit();

