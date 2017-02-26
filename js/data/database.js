'use strict';
import log from "../helpers/util/logger";
import dateUtil from "../helpers/util/date";
const Realm = require('realm');

const key = new Int8Array(64);
let realm = new Realm({
    schema: [
        {name: 'BGLReading', properties: {value: 'string', date: 'date'}},
        {name: 'BGLSafeRange', properties: {minValue: 'string', maxValue: 'string'}},
        {name: 'BGLStandard', properties: {standard: 'string'}}
    ],
    schemaVersion: 2,
    migration: (oldRealm, newRealm) => {
        if (oldRealm.schemaVersion < 2) {
            let oldReadings = oldRealm.objects('BGLReading');
            let oldRanges = oldRealm.objects('BGLSafeRange');
            let newReadings = newRealm.objects('BGLReading');
            let newRanges = newRealm.objects('BGLSafeRange');

            for (let i = 0; i < oldRanges.length; i++) {
                newRanges[i].minValue = oldRanges[i].minValue + "";
                newRanges[i].maxValue = oldRanges[i].maxValue + "";
            }
            for (let i = 0; i < oldReadings.length; i++) {
                newReadings[i].value = oldReadings[i].value + "";
                newReadings[i].date = oldReadings[i].date;
            }
        }
    },
    encryptionKey: key
});

const database = {

    init() {
        log("Initiating database");
        const initBGLSafeRange = realm.objects('BGLSafeRange').length === 0;
        const initBGLStandard = realm.objects('BGLStandard').length === 0;
        realm.write(() => {
            initBGLStandard && realm.create('BGLStandard', {standard: 'mg/dL'});
            initBGLSafeRange && realm.create('BGLSafeRange', {minValue: 70, maxValue: 130});
            this.addMockData();
        });
    },

    addMockData() {
        realm.delete(realm.objects('BGLReading'));
        realm.create('BGLReading', {value: '155', date: (new Date(Date.now() - 65 * 6e4))});
        realm.create('BGLReading', {value: '70', date: (new Date(Date.now() - 62 * 6e4))});
        realm.create('BGLReading', {value: '50', date: (new Date(Date.now() - 55 * 6e4))});
        realm.create('BGLReading', {value: '120', date: (new Date(Date.now() - 20 * 6e4))});
        realm.create('BGLReading', {value: '90', date: (new Date(Date.now() - 15 * 6e4))});
        realm.create('BGLReading', {value: '65', date: (new Date(Date.now() - 13 * 6e4))});
        realm.create('BGLReading', {value: '80', date: (new Date(Date.now() - 9.66 * 6e4))});
        realm.create('BGLReading', {value: '200', date: (new Date(Date.now() - 8 * 6e4))});
        realm.create('BGLReading', {value: '50', date: (new Date(Date.now() - 3 * 864e5))});
    },

    /**
     * @param value
     * @param date
     */
    saveBGLReading(value, date) {
        log("Saving BGLReading: " + value + " " + date);
        realm.write(() => {
            realm.create('BGLReading', {value: value, date: date});
        });
    },

    /**
     * @param minValue
     */
    updateBGLSafeRangeMin(minValue) {
        log("Updating BGLSafeRange min: " + minValue);
        let savedBGLSafeRanges = realm.objects('BGLSafeRange');
        realm.write(() => {
            savedBGLSafeRanges[0].minValue = minValue;
        });
    },

    /**
     * @param maxValue
     */
    updateBGLSafeRangeMax(maxValue) {
        log("Updating BGLSafeRange max: " + maxValue);
        let savedBGLSafeRanges = realm.objects('BGLSafeRange');
        realm.write(() => {
            savedBGLSafeRanges[0].maxValue = maxValue;
        });
    },

    /**
     * @param standard
     */
    updateBGLStandard(standard) {
        log("Updating BGLStandard: " + standard);
        let savedBGLStandards = realm.objects('BGLStandard');
        realm.write(() => {
            savedBGLStandards[0].standard = standard;
        });
    },

    getBGLReadings() {
        log("Getting all BGLReadings");
        return realm.objects('BGLReading');
    },

    getBGLReadingsInDateRange(startDate, endDate) {
        log("Getting BGLReadings between " + startDate + " and " + endDate);
        return realm.objects('BGLReading').filtered('date < $0 AND date > $1',
            dateUtil.toDateFromString(endDate, 23, 59, 59, 999),
            dateUtil.toDateFromString(startDate, 0, 0, 0, 0));
    },

    get24hBGLReadings() {
        log("Getting BGLReadings for last 24h");
        let filteredReadings = [];
        realm.objects('BGLReading').forEach((reading) => {
            dateUtil.isWithin24Hours(reading.date) && filteredReadings.push(reading);
        });
        return filteredReadings;
    },

    get60mBGLReadings() {
        log("Getting BGLReadings for last 60m");
        let filteredReadings = [];
        realm.objects('BGLReading').forEach((reading) => {
            dateUtil.isWithin60Minutes(reading.date) && filteredReadings.push(reading);
        });
        return filteredReadings;
    },

    getBGLSafeRange() {
        log("Getting BGLSafeRange");
        return realm.objects('BGLSafeRange')[0];
    },

    getBGLStandard() {
        log("Getting BGLStandard");
        return realm.objects('BGLStandard')[0];
    },

    /**
     * @param callback
     */
    initBGLReadingListener(callback) {
        realm.objects('BGLReading').addListener((readings, changes) => {
            callback();
        });
    },

    /**
     * @param callback
     */
    initBGLSafeRangeListener(callback) {
        realm.objects('BGLSafeRange').addListener((readings, changes) => {
            callback();
        });
    },

    /**
     * @param callback
     */
    initBGLStandardListener(callback) {
        realm.objects('BGLStandard').addListener((readings, changes) => {
            callback();
        });
    },

    deleteReading(reading) {
        log("Deleting reading " + JSON.stringify(reading));
        realm.write(() => {
            realm.delete(reading);
        });
    }
};

export default database;