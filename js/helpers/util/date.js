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
     * @param date
     * @returns {boolean}
     */
    isWithin24Hours(date) {
        return (Math.abs((Date.now()) - date) / 36e5) <= 24;
    },

    /**
     * @param date
     * @returns {boolean}
     */
    isWithin60Minutes(date) {
        return (Math.abs((Date.now()) - date) / 36e5) <= 1;
    },

    /**
     * @param date
     * @returns {string}
     */
    dayOfWeek(date){
        return dayOfWeek[new Date(date).getDay()];
    },

    /**
     * @param date
     * @returns {number}
     */
    hoursFromPresent(date) {
        return Math.round(Math.abs((Date.now()) - date) / 36e5);
    },

    /**
     * @param date
     * @returns {number}
     */
    daysFromPresent(date) {
        return Math.round(Math.abs((Date.now()) - date) / 864e5);
    },

    /**
     * @param date
     * @returns {number}
     */
    minutesFromPresent(date) {
        return Math.round(Math.floor((Date.now()) - date) / 6e4);
    },

    /**
     * @param date
     * @returns {number}
     */
    weeksFromPresent(date) {
        return Math.round(Math.floor((Date.now()) - date) / 6048e5);
    },

    /**
     * @param date
     * @returns {number}
     */
    monthsFromPresent(date) {
        return Math.round(Math.floor((Date.now()) - date) / 2628e6);
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
     * @returns {number}
     */
    hoursAgoMillis(hours) {
        return new Date(moment().subtract(hours, 'hours')).getTime();
    },

    /**
     * @param days
     * @returns {number}
     */
    daysAgoMillis(days) {
        return new Date(moment().subtract(days, 'days')).getTime();
    },

    /**
     * @param months
     * @returns {number}
     */
    monthsAgoMillis(months) {
        return new Date(moment().subtract(months, 'months')).getTime();
    },

    todayStartMillis() {
        return new Date(moment().startOf('day')).getTime();
    },

    todayEndMillis() {
        return new Date(moment().endOf('day')).getTime();
    },

    millisFromMidnight() {
        return Date.now() - this.todayStartMillis();
    },

    /**
     * @param hoursAgo
     * @returns {number}
     */
    hourOfDayHoursAgo(hoursAgo) {
        return new Date(this.hoursAgoMillis(hoursAgo)).getHours();
    }
};