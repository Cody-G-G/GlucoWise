import {NativeModules, DeviceEventEmitter} from 'react-native';
import dateUtil from "../helpers/util/date";
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

    steps(from, to, timeUnit) {
        return googleFit.steps(from, to, timeUnit);
    }

    caloriesExpended(from, to, timeUnit) {
        return googleFit.caloriesExpended(from, to, timeUnit);
    }

    stepsToday() {
        return googleFit.steps(dateUtil.todayStartMillis(), dateUtil.todayEndMillis(), 'days');
    }

    stepsTodayInHourBuckets() {
        return googleFit.steps(dateUtil.todayStartMillis(), dateUtil.todayEndMillis(), 'hours');
    }

    stepsLast24hInHourBuckets() {
        return googleFit.steps(dateUtil.hoursAgoMillis(24), new Date().getTime(), 'hours');
    }

    stepsLast60mInMinuteBuckets() {
        return googleFit.steps(dateUtil.hoursAgoMillis(1), new Date().getTime(), 'minutes');
    }

    caloriesExpendedLast60mInMinuteBuckets() {
        return googleFit.caloriesExpended(dateUtil.hoursAgoMillis(1), new Date().getTime(), 'minutes');
    }

    caloriesExpendedLast24hInHourBuckets() {
        return googleFit.caloriesExpended(dateUtil.hoursAgoMillis(24), new Date().getTime(), 'hours');
    }

    caloriesExpendedLast7dInDayBuckets() {
        return googleFit.caloriesExpended(dateUtil.daysAgoMillis(7), new Date().getTime(), 'days');
    }

    disconnect() {
        googleFit.disconnect();
    }

    isConnected() {
        return googleFit.isConnected();
    }
}

export default new GoogleFit();

