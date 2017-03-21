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

    stepsToday() {
        return googleFit.stepsToday();
    }

    stepsTodayInHourBuckets() {
        return googleFit.stepsTodayInHourBuckets();
    }

    stepsLast24hInHourBuckets() {
        return googleFit.stepsLast24hInHourBuckets();
    }

    stepsLast60mInMinuteBuckets() {
        return googleFit.stepsLast60mInMinuteBuckets();
    }

    caloriesExpendedLast60mInMinuteBuckets() {
        return googleFit.caloriesExpendedLast60mInMinuteBuckets();
    }

    caloriesExpendedLast24hInHourBuckets() {
        return googleFit.caloriesExpendedLast24hInHourBuckets();
    }

    caloriesExpendedLast7dInDayBuckets() {
        return googleFit.caloriesExpendedLast7dInDayBuckets();
    }

    disconnect() {
        googleFit.disconnect();
    }

    isConnected() {
        return googleFit.isConnected();
    }
}

export default new GoogleFit();

