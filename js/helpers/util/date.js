'use strict';
import moment from "moment";

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

    minutesFromPresent(date) {
        return Math.round(Math.floor((Date.now()) - date) / 6e4);
    },

    toDateFromDateString(dateString, hour, minute, second, millisecond) {
        return new Date(moment(dateString, "DD-MM-YYYY").hour(hour).minute(minute).second(second).millisecond(millisecond));
    },

    toDateFromDateTimeString(dateTimeString) {
        return new Date(moment(dateTimeString, "DD-MM-YYYY HH:mm"));
    }
};