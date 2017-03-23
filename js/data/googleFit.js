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

    steps(from, to, bucketDuration, bucketUnit) {
        return googleFit.steps(from, to, bucketDuration, bucketUnit);
    }

    caloriesExpended(from, to, bucketDuration, bucketUnit) {
        return googleFit.caloriesExpended(from, to, bucketDuration, bucketUnit);
    }

    weight(from, to, bucketDuration, bucketUnit) {
        return googleFit.weight(from, to, bucketDuration, bucketUnit);
    }

    weightLast30dInDayBuckets() {
        return googleFit.weight(dateUtil.daysAgoMillis(30), Date.now(), 1, 'days');
    }

    weightLast6MInWeekBuckets() {
        return googleFit.weight(dateUtil.monthsAgoMillis(6), Date.now(), 7, 'days');
    }

    weightLast1yInMonthBuckets() {
        return googleFit.weight(dateUtil.monthsAgoMillis(12), Date.now(), 30, 'days');
    }

    stepsToday() {
        return googleFit.steps(dateUtil.todayStartMillis(), dateUtil.todayEndMillis(), 1, 'days');
    }

    stepsTodayInHourBuckets() {
        return googleFit.steps(dateUtil.todayStartMillis(), dateUtil.todayEndMillis(), 1, 'hours');
    }

    stepsLast24hInHourBuckets() {
        return googleFit.steps(dateUtil.hoursAgoMillis(24), Date.now(), 1, 'hours');
    }

    stepsLast60mInMinuteBuckets() {
        return googleFit.steps(dateUtil.hoursAgoMillis(1), Date.now(), 1, 'minutes');
    }

    caloriesExpendedLast60mInMinuteBuckets() {
        return googleFit.caloriesExpended(dateUtil.hoursAgoMillis(1), Date.now(), 1, 'minutes');
    }

    caloriesExpendedLast24hInHourBuckets() {
        return googleFit.caloriesExpended(dateUtil.hoursAgoMillis(24) - dateUtil.millisFromHourStart(), Date.now(), 1, 'hours');
    }

    caloriesExpendedLast7dInDayBuckets() {
        return googleFit.caloriesExpended(dateUtil.daysAgoMillis(7) - dateUtil.millisFromMidnight(), Date.now(), 1, 'days');
    }

    disconnect() {
        googleFit.disconnect();
    }

    isConnected() {
        return googleFit.isConnected();
    }
}

export default new GoogleFit();

