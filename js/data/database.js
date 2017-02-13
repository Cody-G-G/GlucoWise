'use strict';
import log from "../helpers/util/logger";
const Realm = require('realm');

const key = new Int8Array(64);
let realm = new Realm({
    schema: [
        {name: 'BGLReading', properties: {value: 'double', date: 'date'}},
        {name: 'BGLSafeRange', properties: {minValue: 'double', maxValue: 'double'}},
        {name: 'BGLStandard', properties: {standard: 'string'}}
    ], encryptionKey: key
});

const database = {

    init() {
        const initBGLSafeRange = realm.objects('BGLSafeRange').length === 0;
        const initBGLStandard = realm.objects('BGLStandard').length === 0;
        realm.write(() => {
            initBGLStandard && realm.create('BGLStandard', {standard: 'mmol/L'});
            initBGLSafeRange && realm.create('BGLSafeRange', {minValue: 70, maxValue: 130});
        });
    },

    saveBGLReading(value, date){
        log("Saving BGLReading: " + value + " " + date);
        realm.write(() => {
            realm.create('BGLReading', {value: value, date: date});
        });
    },

    updateBGLSafeRange(minValue, maxValue) {
        log("Updating BGLSafeRange: " + minValue + " " + maxValue);
        let savedBGLSafeRanges = realm.objects('BGLSafeRange');
        realm.write(() => {
            savedBGLSafeRanges[0].minValue = minValue;
            savedBGLSafeRanges[0].maxValue = maxValue;
        });
    },

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

    getBGLSafeRange() {
        log("Getting BGLSafeRange");
        return realm.objects('BGLSafeRange')[0];
    },

    getBGLStandard() {
        log("Getting BGLStandard");
        return realm.objects('BGLStandard')[0];
    }
};

export default database;