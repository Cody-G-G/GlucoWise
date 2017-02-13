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
    saveBGLReading(value, date){
        log("Saving BGLReading: " + value + " " + date);
        realm.write(() => {
            realm.create('BGLReading', {value: value, date: date});
        });
    },

    updateBGLSafeRange(minValue, maxValue) {
        log("Updating BGLSafeRange: " + minValue + " " + maxValue);
        realm.write(() => {
            realm.create('BGLSafeRange', {minValue: minValue, maxValue: maxValue});
        });
    },

    updateBGLStandard(standard) {
        log("Updating BGLStandard: " + standard);
        realm.write(() => {
            realm.create('BGLStandard', {standard: standard});
        });
    },

    getBGLReadings() {
        log("Getting all BGLReadings");
        return realm.objects('BGLReading');
    }
};

export default database;