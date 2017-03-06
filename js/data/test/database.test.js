'use strict';
jest.mock('realm', () => {
    return require('./mocks/realm.mock').default;
});
jest.mock('uuid/v1');
jest.mock('../../helpers/util/readingProcessor');
const processReading = require('../../helpers/util/readingProcessor');
const uuid = require('uuid/v1');
const Realm = require('realm');
import db from "../database";

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