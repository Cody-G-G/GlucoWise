'use strict';
import moment from "moment";
const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default {
    padDate(datePortion) {
        return datePortion < 10 ? "0" + datePortion : datePortion;
    },

    getTodayString() {
        return this.toDateString(new Date());
    },

    toDateString(date) {
        return this.padDate(date.getDate()) + "-" + this.padDate(date.getMonth() + 1) + "-" + date.getFullYear();
    },

    toDateTimeString(date) {
        return this.toDateString(date) + "  " + this.padDate(date.getHours()) + ":" + this.padDate(date.getMinutes());
    },

    isWithin24Hours(date) {
        return (Math.abs((Date.now()) - date) / 36e5) <= 24;
    },

    isWithin60Minutes(date) {
        return (Math.abs((Date.now()) - date) / 36e5) <= 1;
    },

    hoursFromPresent(date) {
        return Math.round(Math.abs((Date.now()) - date) / 36e5);
    },

    daysFromPresent(date) {
        return Math.round(Math.abs((Date.now()) - date) / 864e5);
    },

    dayOfWeek(date){
        return dayOfWeek[new Date(date).getDay()];
    },

    minutesFromPresent(date) {
        return Math.round(Math.floor((Date.now()) - date) / 6e4);
    },

    toDateFromDateString(dateString, hour, minute, second, millisecond) {
        return new Date(moment(dateString, "DD-MM-YYYY").hour(hour).minute(minute).second(second).millisecond(millisecond));
    },

    toDateFromDateTimeString(dateTimeString) {
        return new Date(moment(dateTimeString, "DD-MM-YYYY HH:mm"));
    },

    hoursAgoMillis(hours) {
        return new Date(moment().subtract(hours, 'hours')).getTime();
    },

    daysAgoMillis(days) {
        return new Date(moment().subtract(days, 'days')).getTime();
    },

    todayStartMillis() {
        return new Date(moment().startOf('day')).getTime();
    },

    todayEndMillis() {
        return new Date(moment().endOf('day')).getTime();
    },

    hourOfDayHoursAgo(hoursAgo) {
        return new Date(this.hoursAgoMillis(hoursAgo)).getHours();
    }
};