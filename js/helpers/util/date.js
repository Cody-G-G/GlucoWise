'use strict';
import moment from "moment";
import {daysOfWeek, monthsOfYear} from "../../helpers/util/constants";

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
    areWithin24Hours(from, to) {
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
        return daysOfWeek[new Date(date).getDay()];
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
    hoursBeforeMillis(hours, date) {
        return new Date(moment(date).subtract(hours, 'hours')).getTime();
    },

    /**
     * @param minutes
     * @param date
     * @returns {number}
     */
    minutesBeforeMillis(minutes, date) {
        return new Date(moment(date).subtract(minutes, 'minutes')).getTime();
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
    monthsBeforeMillis(months, date) {
        return new Date(moment(date).subtract(months, 'months')).getTime();
    },

    /**
     * @param date
     * @returns {number}
     */
    dayStartMillis(date) {
        return new Date(moment(date).startOf('day')).getTime();
    },

    /**
     * @param date
     * @returns {number}
     */
    dayEndMillis(date) {
        return new Date(moment(date).endOf('day')).getTime();
    },

    /**
     * @param date
     * @returns {number}
     */
    hourStartMillis(date) {
        return new Date(moment(date).startOf('hour')).getTime();
    },

    /**
     * @param date
     * @returns {number}
     */
    minuteStartMillis(date) {
        return new Date(moment(date).startOf('minute')).getTime();
    },

    /**
     * @param date
     * @returns {number}
     */
    millisFromDayStart(date) {
        return date - this.dayStartMillis(date);
    },

    /**
     * @param date
     * @returns {number}
     */
    millisFromHourStart(date) {
        return date - this.hourStartMillis(date);
    },

    /**
     * @param date
     * @returns {number}
     */
    millisFromMinuteStart(date) {
        return date - this.minuteStartMillis(date);
    },

    /**
     * @param hoursAgo
     * @param date
     * @returns {number}
     */
    hourOfDayHoursAgo(hoursAgo, date) {
        return new Date(this.hoursBeforeMillis(hoursAgo, date)).getHours();
    },

    /**
     * @param date
     * @returns {number}
     */
    monthOfYear(date) {
        return monthsOfYear[new Date(date).getMonth()];
    }
};