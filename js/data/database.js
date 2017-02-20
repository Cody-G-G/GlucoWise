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
            initBGLStandard && realm.create('BGLStandard', {standard: 'mmol/L'});
            initBGLSafeRange && realm.create('BGLSafeRange', {minValue: 70, maxValue: 130});
            // realm.delete(realm.objects('BGLReading'));
        });
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
     * @param maxValue
     */
    updateBGLSafeRange(minValue, maxValue) {
        log("Updating BGLSafeRange: " + minValue + " " + maxValue);
        let savedBGLSafeRanges = realm.objects('BGLSafeRange');
        realm.write(() => {
            savedBGLSafeRanges[0].minValue = minValue;
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

    get24hBGLReadings() {
        log("Getting BGLReadings for last 24h");
        let filteredReadings = [];
        realm.objects('BGLReading').forEach((reading) => {
            dateUtil.isWithin24Hours(reading.date) && filteredReadings.push(reading);
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
    }
};

export default database;