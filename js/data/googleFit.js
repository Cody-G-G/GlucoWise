import {NativeModules, DeviceEventEmitter} from 'react-native';
import dateUtil from "../helpers/util/date";
const googleFit = NativeModules.GoogleFit;

class GoogleFit {

    authorizeAndConnect() {
        googleFit.authorizeAndConnect();
    }

    /**
     * @param callback
     */
    onConnected(callback) {
        DeviceEventEmitter.addListener('GoogleFitConnected', (args) => {
            callback(args);
        });
    }

    /**
     * @param callback
     */
    onDisconnected(callback) {
        DeviceEventEmitter.addListener('GoogleFitDisconnected', (args) => {
            callback(args);
        });
    }

    /**
     * @param from
     * @param to
     * @param bucketDuration
     * @param bucketUnit
     * @returns {*}
     */
    steps(from, to, bucketDuration, bucketUnit) {
        return googleFit.steps(from, to, bucketDuration, bucketUnit);
    }

    /**
     * @param from
     * @param to
     * @param bucketDuration
     * @param bucketUnit
     * @returns {*}
     */
    caloriesExpended(from, to, bucketDuration, bucketUnit) {
        return googleFit.caloriesExpended(from, to, bucketDuration, bucketUnit);
    }

    /**
     * @param from
     * @param to
     * @param bucketDuration
     * @param bucketUnit
     * @returns {*}
     */
    weight(from, to, bucketDuration, bucketUnit) {
        return googleFit.weight(from, to, bucketDuration, bucketUnit);
    }

    /**
     * @param date
     * @returns {*}
     */
    weightLast30dInDayBuckets(date) {
        return googleFit.weight(dateUtil.daysBeforeMillis(30, date), date, 1, 'days');
    }

    /**
     * @param date
     * @returns {*}
     */
    weightLast6MInWeekBuckets(date) {
        return googleFit.weight(dateUtil.monthsBeforeMillis(6, date), date, 7, 'days');
    }

    /**
     * @param date
     * @returns {*}
     */
    weightLast1yInMonthBuckets(date) {
        return googleFit.weight(dateUtil.monthsBeforeMillis(12, date), date, 30, 'days');
    }

    /**
     * @param date
     * @returns {*}
     */
    stepsOnDay(date) {
        return googleFit.steps(dateUtil.dayStartMillis(date), dateUtil.dayEndMillis(date), 1, 'days');
    }

    /**
     *
     * @param date
     * @returns {*}
     */
    stepsOnDayInHourBuckets(date) {
        return googleFit.steps(dateUtil.dayStartMillis(date), dateUtil.dayEndMillis(date), 1, 'hours');
    }

    /**
     * @param date
     * @returns {*}
     */
    stepsLast24hInHourBuckets(date) {
        return googleFit.steps(dateUtil.hoursBeforeMillis(23, date) - dateUtil.millisFromHourStart(date), date, 1, 'hours');
    }

    /**
     * @param date
     * @returns {*}
     */
    stepsLast60mInMinuteBuckets(date) {
        return googleFit.steps(dateUtil.minutesBeforeMillis(59, date) - dateUtil.millisFromMinuteStart(date), date, 1, 'minutes');
    }

    /**
     * @param date
     * @returns {*}
     */
    caloriesExpendedPrevious24hInHourBuckets(date) {
        return googleFit.caloriesExpended(dateUtil.hoursBeforeMillis(23, date) - dateUtil.millisFromHourStart(date), date, 1, 'hours');
    }

    /**
     * @param date
     * @returns {*}
     */
    caloriesExpendedPrevious7dInDayBuckets(date) {
        return googleFit.caloriesExpended(dateUtil.daysBeforeMillis(6, date) - dateUtil.millisFromDayStart(date), date, 1, 'days');
    }

    disconnect() {
        googleFit.disconnect();
    }

    isConnected() {
        return googleFit.isConnected();
    }
}

export default new GoogleFit();

