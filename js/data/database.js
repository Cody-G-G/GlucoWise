'use strict';
import log from "../helpers/util/logger";
import dateUtil from "../helpers/util/date";
import processBGLValue from "../helpers/util/readingProcessor";
import {readingUnitStandards, defaultSafeRange, dbObjects} from "../helpers/util/constants";
const uuid = require('uuid/v1');
const Realm = require('realm');

const key = new Int8Array(64);
let realm = new Realm({
    schema: [
        {name: dbObjects.reading, properties: {id: 'string', value: 'string', date: 'date'}},
        {name: dbObjects.safeRange, properties: {minValue: 'string', maxValue: 'string'}},
        {name: dbObjects.standard, properties: {standard: 'string'}},
        {name: dbObjects.dataSync, properties: {syncEnabledGFit: 'bool'}},
        {
            name: dbObjects.bolusVars,
            properties: {targetBGL: 'string', carbohydrateInsulinRatio: 'string', insulinSensitivity: 'string'}
        },
        {
            name: dbObjects.foodItem,
            properties: {
                id: 'string',
                name: 'string',
                date: 'date',
                calories: 'string',
                carbohydrates: 'string',
                protein: 'string',
                fats: 'string',
                weight: 'string'
            }
        }
    ],
    schemaVersion: 1,
    encryptionKey: key
});

const database = {
    init() {
        log("Initiating database");
        const initBGLSafeRange = realm.objects('BGLSafeRange').length === 0;
        const initBGLStandard = realm.objects('BGLStandard').length === 0;
        const initDataSyncSettings = realm.objects('DataSyncSettings').length === 0;
        const initBolusVars = realm.objects(dbObjects.bolusVars).length === 0;
        realm.write(() => {
            initBGLStandard && realm.create('BGLStandard', {standard: readingUnitStandards.UK});
            initBGLSafeRange && realm.create('BGLSafeRange', {
                minValue: defaultSafeRange.min,
                maxValue: defaultSafeRange.max
            });
            initBolusVars && realm.create(dbObjects.bolusVars, {
                targetBGL: '',
                carbohydrateInsulinRatio: '',
                insulinSensitivity: ''
            });
            initDataSyncSettings && realm.create('DataSyncSettings', {syncEnabledGFit: false});

            if (global.DEBUG) {
                testFunctions.clearReadingsAndFoodData();
                testFunctions.addMockData();
                // testFunctions.addStressTestMockData();
                // testFunctions.benchmarkJoinObjectsInDateRange();
            }
        });
        this.initCache();
    },

    initCache() {
        this.standard = this.getBGLStandard();
        this.latestReadingValue = this.getLatestReadingValue();
        this.lastConsumedItem = this.getLastConsumedItem();
        this.safeRange = this.getBGLSafeRange();
    },

    /**
     * @param id
     * @param value
     * @param dateMillis
     */
    createBGLReading(id, value, dateMillis) {
        log("Creating BGLReading " + id + " " + value + " " + dateMillis);
        realm.create('BGLReading', {id: id, value: value, date: new Date(dateMillis)});
    },

    /**
     * @param id
     * @param name
     * @param date
     * @param calories
     * @param carbohydrates
     * @param protein
     * @param fats
     * @param weight
     */
    createConsumedFoodItem(id, name, date, calories, carbohydrates, protein, fats, weight) {
        log("Creating ConsumedFoodItem: " + name + " " + date + " " + weight + " " + calories + " " + carbohydrates + " " + protein + " " + fats);
        realm.create('ConsumedFoodItem', {
            id: id,
            name: name,
            date: typeof date === 'number' ? new Date(date) : date,
            calories: calories,
            carbohydrates: carbohydrates,
            protein: protein,
            fats: fats,
            weight: weight
        });
    },

    /**
     * @param value
     * @param date
     */
    saveBGLReading(value, date) {
        log("Saving BGLReading: " + value + " " + date);
        realm.write(() => this.createBGLReading(uuid(), value, date));
        this.latestReadingValue = this.getLatestReadingValue();
    },

    /**
     * @param name
     * @param date
     * @param calories
     * @param carbohydrates
     * @param protein
     * @param fats
     * @param weight
     */
    saveConsumedFoodItem(name, date, calories, carbohydrates, protein, fats, weight) {
        log("Saving ConsumedFoodItem: " + name + " " + date + " " + weight + " " + calories + " " + carbohydrates + " " + protein + " " + fats);
        realm.write(() => this.createConsumedFoodItem(uuid(), name, date, calories, carbohydrates, protein, fats, weight));
        this.lastConsumedItem = this.getLastConsumedItem();
    },

    /**
     * @param startDate
     * @param endDate
     * @returns {Array}
     */
    getConsumedFoodItemsInDateRange(startDate, endDate) {
        return this.getDbObjectsInDateRange(dbObjects.foodItem, startDate, endDate).map(obj => this.constructObjectFromResult(obj, dbObjects.foodItem));
    },


    /**
     * @param dbObjectName
     * @param startDate
     * @param endDate
     */
    getDbObjectsInDateRange(dbObjectName, startDate, endDate) {
        log("Getting " + dbObjectName + " between " + startDate + " and " + endDate);
        return realm.objects(dbObjectName)
            .filtered('date < $0 AND date > $1',
                dateUtil.toDateFromDateString(endDate, 23, 59, 59, 999),
                dateUtil.toDateFromDateString(startDate, 0, 0, 0, 0))
            .sorted('date', true);
    },

    /**
     * @param dbObjectName1
     * @param dbObjectName2
     * @param startDate
     * @param endDate
     * @returns {Array.<T>}
     */
    getJoinDbObjectsInDateRange(dbObjectName1, dbObjectName2, startDate, endDate) {
        return [
            ...this.getDbObjectsInDateRange(dbObjectName1, startDate, endDate).map(obj => this.constructObjectFromResult(obj, dbObjectName1)),
            ...this.getDbObjectsInDateRange(dbObjectName2, startDate, endDate).map(obj => this.constructObjectFromResult(obj, dbObjectName2))]
            .sort((a, b) => a.date - b.date);
    },

    getConsumedFoodItemsLast24h() {
        return this.getDbObjectsForCondition(dbObjects.foodItem, dateUtil.areWithin24Hours);
    },

    /**
     * @param resultObj
     * @param dbObjectName
     * @returns {*}
     */
    constructObjectFromResult(resultObj, dbObjectName) {
        let auxObj;
        switch (dbObjectName) {
            case(dbObjects.reading):
                const standard = this.standard;
                auxObj = {
                    objectName: dbObjectName,
                    id: resultObj.id,
                    value: processBGLValue(resultObj.value, standard),
                    date: resultObj.date
                };
                break;
            case(dbObjects.foodItem):
                auxObj = {
                    objectName: dbObjectName,
                    id: resultObj.id,
                    name: resultObj.name,
                    date: resultObj.date,
                    calories: resultObj.calories,
                    carbohydrates: resultObj.carbohydrates,
                    protein: resultObj.protein,
                    fats: resultObj.fats,
                    weight: resultObj.weight
                };
                break;
        }
        return auxObj;
    },

    /**
     * @param minValue
     */
    updateBGLSafeRangeMin(minValue) {
        log("Updating BGLSafeRange min: " + minValue);
        let savedBGLSafeRanges = realm.objects('BGLSafeRange');
        realm.write(() => {
            const newMinValue = String(processBGLValue(minValue, this.standard, true));
            savedBGLSafeRanges[0].minValue = newMinValue;
            this.safeRange = newMinValue;
        });
    },

    updateBGLSafeRangeMinToDefault() {
        log("Updating BGLSafeRange min to default");
        let savedBGLSafeRanges = realm.objects('BGLSafeRange');
        realm.write(() => {
            savedBGLSafeRanges[0].minValue = defaultSafeRange.min;
            this.safeRange = defaultSafeRange.min;
        });
    },

    /**
     * @param isf
     */
    saveInsulinSensitivityFactor(isf) {
        log("Saving insulin sensitivity factor");
        let savedBolusVars = realm.objects(dbObjects.bolusVars);
        realm.write(() => {
            savedBolusVars[0].insulinSensitivity = processBGLValue(isf, this.standard, true);
        })
    },

    /**
     * @param targetBGL
     */
    saveTargetBGL(targetBGL) {
        log("Saving targetBGL");
        let savedBolusVars = realm.objects(dbObjects.bolusVars);
        realm.write(() => {
            savedBolusVars[0].targetBGL = processBGLValue(targetBGL, this.standard, true);
        })
    },

    /**
     * @param carbInsulinRatio
     */
    saveCarbohydrateInsulinRatio(carbInsulinRatio) {
        log("Saving carbohydrate to insulin ratio");
        let savedBolusVars = realm.objects(dbObjects.bolusVars);
        realm.write(() => {
            savedBolusVars[0].carbohydrateInsulinRatio = carbInsulinRatio;
        })
    },

    /**
     * @param maxValue
     */
    updateBGLSafeRangeMax(maxValue) {
        log("Updating BGLSafeRange max: " + maxValue);
        let savedBGLSafeRanges = realm.objects('BGLSafeRange');
        realm.write(() => {
            const newMax = String(processBGLValue(maxValue, this.standard, true));
            savedBGLSafeRanges[0].maxValue = newMax;
            this.safeRange.maxValue = newMax;
        });
    },

    updateBGLSafeRangeMaxToDefault() {
        log("Updating BGLSafeRange max to default");
        let savedBGLSafeRanges = realm.objects('BGLSafeRange');
        realm.write(() => {
            savedBGLSafeRanges[0].maxValue = defaultSafeRange.max;
            this.safeRange.maxValue = defaultSafeRange.max;
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
            this.standard = standard;
        });
        this.latestReadingValue = this.getLatestReadingValue();
        this.safeRange = this.getBGLSafeRange();
    },

    getLatestReadingValue() {
        log("Getting latest BGLReading");
        const latestReadingArr = (realm.objects('BGLReading').sorted('date', true));
        return latestReadingArr.length > 0 ? processBGLValue(latestReadingArr[0].value, this.standard) : 0;
    },

    getLastConsumedItem() {
        log("Getting latest ConsumedFoodItem");
        const latestReadingArr = (realm.objects(dbObjects.foodItem).sorted('date', true));
        return latestReadingArr.length > 0 ? latestReadingArr[0] : {};
    },

    /**
     * @param startDate
     * @param endDate
     * @returns {Array}
     */
    getBGLReadingsInDateRange(startDate, endDate) {
        return this.getDbObjectsInDateRange(dbObjects.reading, startDate, endDate).map(obj => this.constructObjectFromResult(obj, dbObjects.reading));
    },

    get24hBGLReadings() {
        return this.getDbObjectsForCondition(dbObjects.reading, dateUtil.areWithin24Hours);
    },

    get60mBGLReadings() {
        return this.getDbObjectsForCondition(dbObjects.reading, dateUtil.areWithin60Minutes);
    },

    get24hCaloriesIngested() {
        return this.getCaloriesForDateConditionFunction(dateUtil.areWithin24Hours);
    },

    get7dCaloriesIngested() {
        return this.getCaloriesForDateConditionFunction(dateUtil.areWithin7Days);
    },

    /**
     * @param dateConditionFunc
     * @returns {Array}
     */
    getCaloriesForDateConditionFunction(dateConditionFunc) {
        return this.getDbObjectsForCondition(dbObjects.foodItem, dateConditionFunc).map(item => {
            return {
                value: Number(item.calories),
                date: item.date
            }
        });
    },

    /**
     * @param dbObjectName
     * @param dateConditionFunc
     * @returns {Array.<T>|boolean|*}
     */
    getDbObjectsForCondition(dbObjectName, dateConditionFunc) {
        log("Getting " + dbObjectName + " for " + dateConditionFunc.name);
        return realm.objects(dbObjectName).sorted('date', true)
            .map(obj => this.constructObjectFromResult(obj, dbObjectName))
            .filter(obj => dateConditionFunc(obj.date, Date.now()));
    },

    getBGLSafeRange() {
        log("Getting BGLSafeRange");
        const safeRange = realm.objects('BGLSafeRange')[0];
        const standard = this.standard;
        return {
            minValue: String(processBGLValue(safeRange.minValue, standard)),
            maxValue: String(processBGLValue(safeRange.maxValue, standard))
        };
    },

    getBGLStandard() {
        log("Getting BGLStandard");
        return realm.objects('BGLStandard')[0].standard;
    },

    getBolusVariables() {
        log("Getting BolusVars");
        const bolusVars = realm.objects(dbObjects.bolusVars)[0];
        const standard = this.standard;
        return {
            insulinSensitivity: String(processBGLValue(bolusVars.insulinSensitivity, standard)),
            targetBGL: String(processBGLValue(bolusVars.targetBGL, standard)),
            carbohydrateInsulinRatio: bolusVars.carbohydrateInsulinRatio
        };
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
    initConsumedFoodItemListener(callback) {
        realm.objects('ConsumedFoodItem').addListener((objects, changes) => {
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
     * @param object
     * @param objectName
     */
    delete(object, objectName) {
        log("Deleting " + objectName + " " + JSON.stringify(object));
        realm.write(() => {
            realm.delete(realm.objects(objectName).filtered('id = $0', object.id));
        });
    },

    /**
     * @param object
     */
    deleteReading(object) {
        this.delete(object, dbObjects.reading);
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

/**
 * @param changes
 * @returns {boolean}
 */
function existChanges(changes) {
    let isModification = changes.modifications.length > 0;
    let isDeletion = changes.deletions.length > 0;
    let isInsertion = changes.insertions.length > 0;

    return (isModification || isDeletion || isInsertion);
}

const testFunctions = {
    clearReadingsAndFoodData() {
        realm.delete(realm.objects('BGLReading'));
        realm.delete(realm.objects('ConsumedFoodItem'));
    },

    addMockData() {
        const now = Date.now();

        database.createBGLReading(uuid(), '50', dateUtil.hoursBeforeMillis(20, now));
        database.createBGLReading(uuid(), '210', dateUtil.hoursBeforeMillis(10, now));
        database.createBGLReading(uuid(), '90', dateUtil.hoursBeforeMillis(5, now));
        database.createBGLReading(uuid(), '140', dateUtil.minutesBeforeMillis(70, now));
        database.createBGLReading(uuid(), '155', dateUtil.minutesBeforeMillis(65, now));
        database.createBGLReading(uuid(), '70', dateUtil.minutesBeforeMillis(62, now));
        database.createBGLReading(uuid(), '90', dateUtil.minutesBeforeMillis(55, now));
        database.createBGLReading(uuid(), '150', dateUtil.minutesBeforeMillis(20, now));
        database.createBGLReading(uuid(), '170', dateUtil.minutesBeforeMillis(15, now));
        database.createBGLReading(uuid(), '180', dateUtil.minutesBeforeMillis(13, now));
        database.createBGLReading(uuid(), '180', dateUtil.minutesBeforeMillis(9.68, now));
        database.createBGLReading(uuid(), '200', dateUtil.minutesBeforeMillis(8, now));

        database.createConsumedFoodItem(uuid(), 'Roasted Peanuts', dateUtil.minutesBeforeMillis(10, now), '550', '55', '10', '23', '125');
        database.createConsumedFoodItem(uuid(), 'Cashews', dateUtil.minutesBeforeMillis(25, now), '400', '35', '10', '23', '80');
        database.createConsumedFoodItem(uuid(), 'Olives', dateUtil.minutesBeforeMillis(15, now), '150', '20', '', '', '');
        database.createConsumedFoodItem(uuid(), 'Cheese & Ham Sandwich', dateUtil.minutesBeforeMillis(14, now), '375', '20', '', '', '');
        database.createConsumedFoodItem(uuid(), 'Sweet & Sour Chicken', dateUtil.hoursBeforeMillis(5, now), '450', '20', '', '', '');
        database.createConsumedFoodItem(uuid(), 'Chicken Wrap', dateUtil.hoursBeforeMillis(9, now), '500', '20', '', '', '');
        database.createConsumedFoodItem(uuid(), 'Oreo Biscuits', dateUtil.hoursBeforeMillis(19, now), '200', '20', '', '', '');
        database.createConsumedFoodItem(uuid(), 'Cheese & Ham Sandwich', dateUtil.daysBeforeMillis(3, now), '375', '20', '', '', '');
        database.createConsumedFoodItem(uuid(), 'Cashews', dateUtil.daysBeforeMillis(3, now), '400', '35', '10', '23', '80');
        database.createConsumedFoodItem(uuid(), 'Sweet & Sour Chicken', dateUtil.daysBeforeMillis(5, now), '450', '20', '', '', '');
    },

    addStressTestMockData() {
        for (let i = 0; i < 7300; i++) {
            database.createBGLReading(uuid(), '200', dateUtil.hoursBeforeMillis(22, Date.now()));
            database.createConsumedFoodItem(uuid(), 'STRESS TEST ' + i, dateUtil.hoursBeforeMillis(22, Date.now()), '500', '50', '', '', '');
        }
        for (let i = 0; i < 18250; i++) {
            database.createBGLReading(uuid(), '200', dateUtil.hoursBeforeMillis(23, Date.now()));
        }
    },

    benchmarkJoinObjectsInDateRange() {
        const dbObjectName1 = dbObjects.reading;
        const dbObjectName2 = dbObjects.foodItem;
        const startDate = new Date(0);
        const endDate = new Date();

        const start = Date.now();
        [].concat.apply([], [
            Object.values(database.getDbObjectsInDateRange(dbObjectName1, startDate, endDate)),
            Object.values(database.getDbObjectsInDateRange(dbObjectName2, startDate, endDate))])
            .sort((a, b) => a.date - b.date);
        log("Got data with - concat / Object.values - method in: " + ((Date.now() - start) / 1000) + " seconds");

        const start2 = Date.now();
        [].concat.apply([], [
            database.getDbObjectsInDateRange(dbObjectName1, startDate, endDate).map(obj => database.constructObjectFromResult(obj, dbObjectName1)),
            database.getDbObjectsInDateRange(dbObjectName2, startDate, endDate).map(obj => database.constructObjectFromResult(obj, dbObjectName2))])
            .sort((a, b) => a.date - b.date);
        log("Got data with - concat / map - method in: " + ((Date.now() - start2) / 1000) + " seconds");

        const start3 = Date.now();
        const aux31 = [];
        const aux32 = [];
        database.getDbObjectsInDateRange(dbObjectName1, startDate, endDate).forEach(obj => aux31.push(database.constructObjectFromResult(obj, dbObjectName1)));
        database.getDbObjectsInDateRange(dbObjectName2, startDate, endDate).forEach(obj => aux32.push(database.constructObjectFromResult(obj, dbObjectName2)));
        [].concat.apply([], [aux31, aux32]).sort((a, b) => a.date - b.date);
        log("Got data with - concat / push - method in: " + ((Date.now() - start3) / 1000) + " seconds");

        const start4 = Date.now();
        const objects41 = database.getDbObjectsInDateRange(dbObjectName1, startDate, endDate);
        const objects42 = database.getDbObjectsInDateRange(dbObjectName2, startDate, endDate);
        const aux41 = [objects41.length];
        const aux42 = [objects42.length];
        objects41.forEach(obj => aux41.push(database.constructObjectFromResult(obj, dbObjectName1)));
        objects42.forEach(obj => aux42.push(database.constructObjectFromResult(obj, dbObjectName2)));
        [].concat.apply([], [aux41, aux42]).sort((a, b) => a.date - b.date);
        log("Got data with - concat / push (pre-allocated) - method in: " + ((Date.now() - start4) / 1000) + " seconds");

        log("--------------------------------------------------");

        const start5 = Date.now();
        [
            ...Object.values(database.getDbObjectsInDateRange(dbObjectName1, startDate, endDate)),
            ...Object.values(database.getDbObjectsInDateRange(dbObjectName2, startDate, endDate))]
            .sort((a, b) => a.date - b.date);
        log("Got data with - spread / Object.values - method in: " + ((Date.now() - start5) / 1000) + " seconds");

        const start6 = Date.now();
        [
            ...database.getDbObjectsInDateRange(dbObjectName1, startDate, endDate).map(obj => database.constructObjectFromResult(obj, dbObjectName1)),
            ...database.getDbObjectsInDateRange(dbObjectName2, startDate, endDate).map(obj => database.constructObjectFromResult(obj, dbObjectName2))
        ].sort((a, b) => a.date - b.date);
        log("Got data with - spread / map - method in: " + ((Date.now() - start6) / 1000) + " seconds");

        const start7 = Date.now();
        const aux71 = [];
        const aux72 = [];
        database.getDbObjectsInDateRange(dbObjectName1, startDate, endDate).forEach(obj => aux71.push(database.constructObjectFromResult(obj, dbObjectName1)));
        database.getDbObjectsInDateRange(dbObjectName2, startDate, endDate).forEach(obj => aux72.push(database.constructObjectFromResult(obj, dbObjectName2)));
        [...aux71, ...aux72].sort((a, b) => a.date - b.date);
        log("Got data with - spread / push - method in: " + ((Date.now() - start7) / 1000) + " seconds");

        const start8 = Date.now();
        const objects81 = database.getDbObjectsInDateRange(dbObjectName1, startDate, endDate);
        const objects82 = database.getDbObjectsInDateRange(dbObjectName2, startDate, endDate);
        const aux81 = [objects81.length];
        const aux82 = [objects82.length];
        objects81.forEach(obj => aux81.push(database.constructObjectFromResult(obj, dbObjectName1)));
        objects82.forEach(obj => aux82.push(database.constructObjectFromResult(obj, dbObjectName2)));
        [...aux81, ...aux82].sort((a, b) => a.date - b.date);
        log("Got data with - spread / push (pre-allocated) - method in: " + ((Date.now() - start8) / 1000) + " seconds");

    }
};

export default database;