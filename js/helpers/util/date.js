'use strict';

export default {
    padDate(datePortion) {
        return datePortion < 10 ? "0" + datePortion : datePortion;
    },

    getTodayString() {
        return this.toDateString(new Date());
    },

    toDateString(date) {
        return this.padDate(date.getDate()) + "/" + this.padDate(date.getMonth() + 1) + "/" + date.getFullYear();
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
        return Math.abs((Date.now()) - date) / 36e5;
    },

    minutesFromPresent(date) {
        return Math.floor((Date.now()) - date) / 6e4;
    }
};