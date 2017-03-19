'use strict';
import log from "../helpers/util/logger";
import dateUtil from "../helpers/util/date";
import processReading from "../helpers/util/readingProcessor";
const uuid = require('uuid/v1');
const Realm = require('realm');

const key = new Int8Array(64);
let realm = new Realm({
    schema: [
        {name: 'BGLReading', properties: {id: 'string', value: 'string', date: 'date'}},
        {name: 'BGLSafeRange', properties: {minValue: 'string', maxValue: 'string'}},
        {name: 'BGLStandard', properties: {standard: 'string'}},
        {name: 'DataSyncSettings', properties: {syncEnabledGFit: 'bool'}}
    ],
    schemaVersion: 1,
    // migration: (oldRealm, newRealm) => {
    //     if (oldRealm.schemaVersion < 2) {
    //         let oldReadings = oldRealm.objects('BGLReading');
    //         let oldRanges = oldRealm.objects('BGLSafeRange');
    //         let newReadings = newRealm.objects('BGLReading');
    //         let newRanges = newRealm.objects('BGLSafeRange');
    //
    //         for (let i = 0; i < oldRanges.length; i++) {
    //             newRanges[i].minValue = oldRanges[i].minValue + "";
    //             newRanges[i].maxValue = oldRanges[i].maxValue + "";
    //         }
    //         for (let i = 0; i < oldReadings.length; i++) {
    //             newReadings[i].value = oldReadings[i].value + "";
    //             newReadings[i].date = oldReadings[i].date;
    //         }
    //     }
    // },
    encryptionKey: key
});

const database = {

    init() {
        log("Initiating database");
        const initBGLSafeRange = realm.objects('BGLSafeRange').length === 0;
        const initBGLStandard = realm.objects('BGLStandard').length === 0;
        const initDataSyncSettings = realm.objects('DataSyncSettings').length === 0;
        realm.write(() => {
            initBGLStandard && realm.create('BGLStandard', {standard: 'mg/dL'});
            initBGLSafeRange && realm.create('BGLSafeRange', {minValue: '70', maxValue: '130'});
            initDataSyncSettings && realm.create('DataSyncSettings', {syncEnabledGFit: false});
            global.DEBUG && this.addMockData();
        });
    },

    addMockData() {
        realm.delete(realm.objects('BGLReading'));
        realm.create('BGLReading', {id: uuid(), value: '50', date: (new Date(Date.now() - 1200 * 6e4))});
        realm.create('BGLReading', {id: uuid(), value: '210', date: (new Date(Date.now() - 600 * 6e4))});
        realm.create('BGLReading', {id: uuid(), value: '90', date: (new Date(Date.now() - 300 * 6e4))});
        realm.create('BGLReading', {id: uuid(), value: '155', date: (new Date(Date.now() - 65 * 6e4))});
        realm.create('BGLReading', {id: uuid(), value: '70', date: (new Date(Date.now() - 62 * 6e4))});
        realm.create('BGLReading', {id: uuid(), value: '90', date: (new Date(Date.now() - 55 * 6e4))});
        realm.create('BGLReading', {id: uuid(), value: '150', date: (new Date(Date.now() - 20 * 6e4))});
        realm.create('BGLReading', {id: uuid(), value: '170', date: (new Date(Date.now() - 15 * 6e4))});
        realm.create('BGLReading', {id: uuid(), value: '180', date: (new Date(Date.now() - 13 * 6e4))});
        realm.create('BGLReading', {id: uuid(), value: '180', date: (new Date(Date.now() - 9.66 * 6e4))});
        realm.create('BGLReading', {id: uuid(), value: '200', date: (new Date(Date.now() - 8 * 6e4))});
    },

    /**
     * @param value
     * @param date
     */
    saveBGLReading(value, date) {
        log("Saving BGLReading: " + value + " " + date);
        realm.write(() => {
            realm.create('BGLReading', {
                id: uuid(),
                value: value,
                date: date
            });
        });
    },

    /**
     * @param minValue
     */
    updateBGLSafeRangeMin(minValue) {
        log("Updating BGLSafeRange min: " + minValue);
        let savedBGLSafeRanges = realm.objects('BGLSafeRange');
        realm.write(() => {
            savedBGLSafeRanges[0].minValue = String(processReading(minValue, this.getBGLStandard(), true));
        });
    },

    updateBGLSafeRangeMinToDefault() {
        log("Updating BGLSafeRange min to default");
        let savedBGLSafeRanges = realm.objects('BGLSafeRange');
        realm.write(() => {
            savedBGLSafeRanges[0].minValue = '70';
        });
    },

    /**
     * @param maxValue
     */
    updateBGLSafeRangeMax(maxValue) {
        log("Updating BGLSafeRange max: " + maxValue);
        let savedBGLSafeRanges = realm.objects('BGLSafeRange');
        realm.write(() => {
            savedBGLSafeRanges[0].maxValue = String(processReading(maxValue, this.getBGLStandard(), true));
        });
    },

    updateBGLSafeRangeMaxToDefault() {
        log("Updating BGLSafeRange max to default");
        let savedBGLSafeRanges = realm.objects('BGLSafeRange');
        realm.write(() => {
            savedBGLSafeRanges[0].maxValue = '130';
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

    getLatestReading() {
        log("Getting latest BGLReading");
        const latestReadingArr = (realm.objects('BGLReading').sorted('date', true));
        return latestReadingArr.length > 0 ? processReading(latestReadingArr[0].value, this.getBGLStandard()) : 0;
    },

    getBGLReadingsInDateRange(startDate, endDate) {
        log("Getting BGLReadings between " + startDate + " and " + endDate);
        let filteredReadings = [];
        const standard = this.getBGLStandard();
        realm.objects('BGLReading')
            .filtered('date < $0 AND date > $1',
                dateUtil.toDateFromDateString(endDate, 23, 59, 59, 999),
                dateUtil.toDateFromDateString(startDate, 0, 0, 0, 0))
            .sorted('date', true)
            .forEach((reading) => {
                filteredReadings.push({
                    id: reading.id,
                    value: processReading(reading.value, standard),
                    date: reading.date
                });
            });

        return filteredReadings;
    },

    get24hBGLReadings() {
        log("Getting BGLReadings for last 24h");
        let filteredReadings = [];
        const standard = this.getBGLStandard();
        realm.objects('BGLReading').sorted('date', true).forEach((reading) => {
            dateUtil.isWithin24Hours(reading.date) && filteredReadings.push({
                id: reading.id,
                value: processReading(reading.value, standard),
                date: reading.date
            });
        });
        return filteredReadings;
    },

    get60mBGLReadings() {
        log("Getting BGLReadings for last 60m");
        let filteredReadings = [];
        const standard = this.getBGLStandard();
        realm.objects('BGLReading').sorted('date', true).forEach((reading) => {
            dateUtil.isWithin60Minutes(reading.date) && filteredReadings.push({
                id: reading.id,
                value: processReading(reading.value, standard),
                date: reading.date
            });
        });
        return filteredReadings;
    },

    getBGLSafeRange() {
        log("Getting BGLSafeRange");
        const safeRange = realm.objects('BGLSafeRange')[0];
        const standard = this.getBGLStandard();
        return {
            minValue: String(processReading(safeRange.minValue, standard)),
            maxValue: String(processReading(safeRange.maxValue, standard))
        };
    },

    getBGLStandard() {
        log("Getting BGLStandard");
        return realm.objects('BGLStandard')[0].standard;
    },

    /**
     * @param callback
     */
    initBGLReadingListener(callback) {
        realm.objects('BGLReading').addListener((objects, changes) => {
            existChanges(changes) && callback();
        });
    },

    /**
     * @param callback
     */
    initBGLSafeRangeListener(callback) {
        realm.objects('BGLSafeRange').addListener((objects, changes) => {
            existChanges(changes) && callback();
        });
    },

    /**
     * @param callback
     */
    initBGLStandardListener(callback) {
        realm.objects('BGLStandard').addListener((objects, changes) => {
            existChanges(changes) && callback();
        });
    },

    /**
     * @param reading
     */
    deleteReading(reading) {
        log("Deleting reading " + JSON.stringify(reading));
        realm.write(() => {
            realm.delete(realm.objects('BGLReading').filtered('id = $0', reading.id));
        });
    },

    isGoogleFitSyncEnabled() {
        log("Getting data sync settings");
        return realm.objects('DataSyncSettings')[0].syncEnabledGFit;
    },

    enableGFitDataSync() {
        log("Enabling data sync with Google Fit");
        realm.write(() => {
            let dataSyncSettings = realm.objects('DataSyncSettings')[0];
            dataSyncSettings.syncEnabledGFit = true;
        });
    },

    disableGFitDataSync() {
        log("Disabling data sync with Google Fit");
        realm.write(() => {
            let dataSyncSettings = realm.objects('DataSyncSettings')[0];
            dataSyncSettings.syncEnabledGFit = false;
        });
    }
};

function existChanges(changes) {
    let isModification = changes.modifications.length > 0;
    let isDeletion = changes.deletions.length > 0;
    let isInsertion = changes.insertions.length > 0;

    return (isModification || isDeletion || isInsertion);
}

export default database;