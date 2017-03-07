'use strict';
jest.mock('realm', () => {
    return require('./helpers/realm.mock').default;
});
jest.mock('uuid/v1');
jest.mock('../../helpers/util/readingProcessor');
const processReading = require('../../helpers/util/readingProcessor');
const uuid = require('uuid/v1');
const Realm = require('realm');
import db from "../database";
import Results from './helpers/realmResults.stub';

const safeRangeObjName = 'BGLSafeRange';
const standardObjName = 'BGLStandard';
const readingObjName = 'BGLReading';
const standardUS = 'mg/dL';
const standardUK = 'mmol/L';
const defaultSafeRangeMin = '70';
const defaultSafeRangeMax = '130';

beforeEach(() => {
    Realm.prototype.objects.mockClear();
    Realm.prototype.write.mockClear();
    Realm.prototype.create.mockClear();
    Realm.prototype.delete.mockClear();
    processReading.mockClear();
    uuid.mockClear();
});

test("init() - creates and saves initial BGLStandard and BGLSafeRange objects to database, if they haven't been created already", () => {
    Realm.prototype.objects = jest.fn((objectName) => {
        return (objectName === 'BGLSafeRange' || objectName === 'BGLStandard') && [];
    });

    db.init();

    expect(Realm.prototype.objects).toHaveBeenCalledTimes(2);
    expect(Realm.prototype.objects).toHaveBeenCalledWith(safeRangeObjName);
    expect(Realm.prototype.objects).toHaveBeenCalledWith(standardObjName);
    expect(Realm.prototype.write).toHaveBeenCalledTimes(1);
    expect(Realm.prototype.create).toHaveBeenCalledTimes(2);
    expect(Realm.prototype.create).toHaveBeenCalledWith(standardObjName, {standard: standardUS});
    expect(Realm.prototype.create).toHaveBeenCalledWith(safeRangeObjName, {
        minValue: defaultSafeRangeMin,
        maxValue: defaultSafeRangeMax
    });
});

test('saveBGLReading(value, date) - saves BGLReading to database with given value and date', () => {
    const stubValue = '82.5';
    const stubDate = new Date();
    const stubUUID = 'UUID';
    uuid.mockImplementation(() => {
        return stubUUID
    });

    db.saveBGLReading(stubValue, stubDate);

    expect(Realm.prototype.write).toHaveBeenCalledTimes(1);
    expect(uuid).toHaveBeenCalledTimes(1);
    expect(Realm.prototype.create).toHaveBeenCalledWith(readingObjName, {
        id: stubUUID,
        value: stubValue,
        date: stubDate
    })
});

test('updateBGLSafeRangeMin(minValue) - updates minValue of BGLSafeRange to given value in database', () => {
    const stubOldMinValue = '85';
    const stubNewMinValue = '135';
    const stubSafeRange = {minValue: stubOldMinValue};
    const stubStandard = {standard: standardUS};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === safeRangeObjName ? [stubSafeRange] : [stubStandard]
    });
    processReading.mockImplementation(() => {
        return stubNewMinValue;
    });

    db.updateBGLSafeRangeMin(stubNewMinValue);

    expect(Realm.prototype.objects).toHaveBeenCalledTimes(2);
    expect(Realm.prototype.objects).toHaveBeenCalledWith(safeRangeObjName);
    expect(Realm.prototype.objects).toHaveBeenCalledWith(standardObjName);
    expect(Realm.prototype.write).toHaveBeenCalledTimes(1);
    expect(processReading).toHaveBeenCalledTimes(1);
    expect(processReading).toHaveBeenCalledWith(stubNewMinValue, stubStandard.standard, true);
    expect(stubSafeRange.minValue).toEqual(stubNewMinValue);
});

test('updateBGLSafeRangeMax(maxValue) - updates maxValue of BGLSafeRange to given value in database', () => {
    const stubOldMaxValue = '85';
    const stubNewMaxValue = '135';
    const stubSafeRange = {minValue: stubOldMaxValue};
    const stubStandard = {standard: standardUS};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === safeRangeObjName ? [stubSafeRange] : [stubStandard]
    });
    processReading.mockImplementation(() => {
        return stubNewMaxValue;
    });

    db.updateBGLSafeRangeMax(stubNewMaxValue);

    expect(Realm.prototype.objects).toHaveBeenCalledTimes(2);
    expect(Realm.prototype.objects).toHaveBeenCalledWith(safeRangeObjName);
    expect(Realm.prototype.objects).toHaveBeenCalledWith(standardObjName);
    expect(Realm.prototype.write).toHaveBeenCalledTimes(1);
    expect(processReading).toHaveBeenCalledTimes(1);
    expect(processReading).toHaveBeenCalledWith(stubNewMaxValue, stubStandard.standard, true);
    expect(stubSafeRange.maxValue).toEqual(stubNewMaxValue);
});

test('updateBGLSafeRangeMinToDefault() - changes BGLSafeRange minValue to default (70)', () => {
    const stubSafeRange = {minValue: '100'};
    Realm.prototype.objects = jest.fn(() => {
        return [stubSafeRange];
    });

    db.updateBGLSafeRangeMinToDefault();

    expect(Realm.prototype.objects).toHaveBeenCalledTimes(1);
    expect(Realm.prototype.objects).toHaveBeenCalledWith(safeRangeObjName);
    expect(Realm.prototype.write).toHaveBeenCalledTimes(1);
    expect(stubSafeRange.minValue).toEqual(defaultSafeRangeMin);
});

test('updateBGLSafeRangeMaxToDefault() - changes BGLSafeRange maxValue to default (130)', () => {
    const stubSafeRange = {maxValue: '100'};
    Realm.prototype.objects = jest.fn(() => {
        return [stubSafeRange];
    });

    db.updateBGLSafeRangeMaxToDefault();

    expect(Realm.prototype.objects).toHaveBeenCalledTimes(1);
    expect(Realm.prototype.objects).toHaveBeenCalledWith(safeRangeObjName);
    expect(Realm.prototype.write).toHaveBeenCalledTimes(1);
    expect(stubSafeRange.maxValue).toEqual(defaultSafeRangeMax);
});

test('updateBGLStandard(standard) - updates the BGLStandard.standard value in database to given value', () => {
    const stubStandard = {standard: standardUS};
    Realm.prototype.objects = jest.fn(() => {
        return [stubStandard];
    });

    db.updateBGLStandard(standardUK);

    expect(Realm.prototype.objects).toHaveBeenCalledTimes(1);
    expect(Realm.prototype.write).toHaveBeenCalledTimes(1);
    expect(stubStandard.standard).toEqual(standardUK);
});

test('getLatestReading() - returns reading with the most recent date', () => {
    const expectedReading = {id: '1', value: '82.5', date: new Date(2017, 3, 6, 22, 50, 55)};
    const readings = new Results(
        {id: '3', value: '120', date: new Date(2017, 3, 5, 22, 50, 55)},
        expectedReading,
        {id: '2', value: '50', date: new Date(2017, 3, 6, 22, 50, 54)}
    );
    const stubStandard = {standard: standardUS};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [stubStandard];
    });
    processReading.mockImplementation((value) => {
        return value;
    });

    const actualReadingValue = db.getLatestReading();

    expect(processReading).toHaveBeenCalledTimes(1);
    expect(Realm.prototype.objects).toHaveBeenCalledTimes(2);
    expect(Realm.prototype.objects).toHaveBeenCalledWith(readingObjName);
    expect(Realm.prototype.objects).toHaveBeenCalledWith(standardObjName);
    expect(actualReadingValue).toEqual(expectedReading.value)
});