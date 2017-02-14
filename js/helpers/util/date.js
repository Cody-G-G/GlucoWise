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
        return (Math.abs((Date.now()) - date) / (360000)) <= 24;
    }
};