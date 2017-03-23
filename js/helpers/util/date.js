'use strict';
import moment from "moment";
const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default {
    /**
     * @param datePortion
     * @returns {string}
     */
    padDate(datePortion) {
        return datePortion < 10 ? "0" + datePortion : datePortion;
    },

    getTodayString() {
        return this.toDateString(new Date());
    },

    /**
     * @param date
     * @returns {string}
     */
    toDateString(date) {
        return this.padDate(date.getDate()) + "-" + this.padDate(date.getMonth() + 1) + "-" + date.getFullYear();
    },

    /**
     * @param date
     * @returns {string}
     */
    toDateTimeString(date) {
        return this.toDateString(date) + "  " + this.padDate(date.getHours()) + ":" + this.padDate(date.getMinutes());
    },

    /**
     * @param from
     * @param to
     * @returns {boolean}
     */
    isWithin24Hours(from, to) {
        return (Math.abs(from - to) / 36e5) <= 24;
    },

    /**
     * @returns {boolean}
     * @param from
     * @param to
     */
    areWithin60Minutes(from, to) {
        return (Math.abs(from - to) / 36e5) <= 1;
    },

    /**
     * @param date
     * @returns {string}
     */
    dayOfWeek(date){
        return dayOfWeek[new Date(date).getDay()];
    },

    /**
     * @param from
     * @param to
     * @returns {number}
     */
    hoursBetween(from, to) {
        return Math.abs(from - to) / 36e5;
    },

    /**
     * @param from
     * @param to
     * @returns {number}
     */
    daysBetween(from, to) {
        return Math.abs(from - to) / 864e5;
    },

    /**
     * @param from
     * @param to
     * @returns {number}
     */
    minutesBetween(from, to) {
        return Math.abs(from - to) / 6e4;
    },

    /**
     * @param from
     * @param to
     * @returns {number}
     */
    weeksBetween(from, to) {
        return Math.abs(from - to) / 6048e5;
    },

    /**
     * @param from
     * @param to
     * @returns {number}
     */
    monthsBetween(from, to) {
        return Math.abs(from - to) / 2628e6;
    },

    /**
     * @param dateString
     * @param hour
     * @param minute
     * @param second
     * @param millisecond
     * @returns {Date}
     */
    toDateFromDateString(dateString, hour, minute, second, millisecond) {
        return new Date(moment(dateString, "DD-MM-YYYY").hour(hour).minute(minute).second(second).millisecond(millisecond));
    },

    /**
     * @param dateTimeString
     * @returns {Date}
     */
    toDateFromDateTimeString(dateTimeString) {
        return new Date(moment(dateTimeString, "DD-MM-YYYY HH:mm"));
    },

    /**
     * @param hours
     * @param date
     * @returns {number}
     */
    hoursAgoMillis(hours, date) {
        return new Date(moment(date).subtract(hours, 'hours')).getTime();
    },

    /**
     * @param days
     * @param date
     * @returns {number}
     */
    daysBeforeMillis(days, date) {
        return new Date(moment(date).subtract(days, 'days')).getTime();
    },

    /**
     * @param months
     * @param date
     * @returns {number}
     */
    monthsAgoMillis(months, date) {
        return new Date(moment(date).subtract(months, 'months')).getTime();
    },

    dayStartMillis(date) {
        return new Date(moment(date).startOf('day')).getTime();
    },

    dayEndMillis(date) {
        return new Date(moment(date).endOf('day')).getTime();
    },

    hourStartMillis(date) {
        return new Date(moment(date).startOf('hour')).getTime();
    },

    minuteStartMillis(date) {
        return new Date(moment(date).startOf('minute')).getTime();
    },

    millisFromMidnight(date) {
        return date - this.dayStartMillis(date);
    },

    millisFromHourStart(date) {
        return date - this.hourStartMillis(date);
    },

    millisFromMinuteStart(date) {
        return date - this.minuteStartMillis(date);
    },

    /**
     * @param hoursAgo
     * @param date
     * @returns {number}
     */
    hourOfDayHoursAgo(hoursAgo, date) {
        return new Date(this.hoursAgoMillis(hoursAgo, date)).getHours();
    }
};