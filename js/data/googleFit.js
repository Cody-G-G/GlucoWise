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

    weightLast30dInDayBuckets(date) {
        return googleFit.weight(dateUtil.daysBeforeMillis(30, date), date, 1, 'days');
    }

    weightLast6MInWeekBuckets(date) {
        return googleFit.weight(dateUtil.monthsAgoMillis(6, date), date, 7, 'days');
    }

    weightLast1yInMonthBuckets(date) {
        return googleFit.weight(dateUtil.monthsAgoMillis(12, date), date, 30, 'days');
    }

    stepsOnDay(date) {
        return googleFit.steps(dateUtil.dayStartMillis(date), dateUtil.dayEndMillis(date), 1, 'days');
    }

    stepsOnDayInHourBuckets(date) {
        return googleFit.steps(dateUtil.dayStartMillis(date), dateUtil.dayEndMillis(date), 1, 'hours');
    }

    /**
     * @param date
     * @returns {*}
     */
    stepsLast24hInHourBuckets(date) {
        return googleFit.steps(dateUtil.hoursAgoMillis(24, date) - dateUtil.millisFromHourStart(date), date, 1, 'hours');
    }

    /**
     * @param date
     * @returns {*}
     */
    stepsLast60mInMinuteBuckets(date) {
        return googleFit.steps(dateUtil.hoursAgoMillis(1, date) - dateUtil.millisFromMinuteStart(date), date, 1, 'minutes');
    }

    /**
     * @param date
     * @returns {*}
     */
    caloriesExpendedPrevious24hInHourBuckets(date) {
        return googleFit.caloriesExpended(dateUtil.hoursAgoMillis(24, date) - dateUtil.millisFromHourStart(date), date, 1, 'hours');
    }

    /**
     * @param date
     * @returns {*}
     */
    caloriesExpendedPrevious7dInDayBuckets(date) {
        return googleFit.caloriesExpended(dateUtil.daysBeforeMillis(7, date) - dateUtil.millisFromMidnight(date), date, 1, 'days');
    }

    disconnect() {
        googleFit.disconnect();
    }

    isConnected() {
        return googleFit.isConnected();
    }
}

export default new GoogleFit();

