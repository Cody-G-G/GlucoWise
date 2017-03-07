'use strict';
jest.mock('realm', () => {
    return require('./mocks/realm.mock').default;
});
jest.mock('uuid/v1');
jest.mock('../../helpers/util/readingProcessor');
const processReading = require('../../helpers/util/readingProcessor');
import ResultsMock from './mocks/realmResults.mock';
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

    expect(Realm.prototype.write).toHaveBeenCalled();
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

    expect(Realm.prototype.write).toHaveBeenCalled();
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

    expect(Realm.prototype.write).toHaveBeenCalled();
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

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(processReading).toHaveBeenCalledWith(stubNewMaxValue, stubStandard.standard, true);
    expect(stubSafeRange.maxValue).toEqual(stubNewMaxValue);
});

test('updateBGLSafeRangeMinToDefault() - changes BGLSafeRange minValue to default (70)', () => {
    const stubSafeRange = {minValue: '100'};
    Realm.prototype.objects = jest.fn(() => {
        return [stubSafeRange];
    });

    db.updateBGLSafeRangeMinToDefault();

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(stubSafeRange.minValue).toEqual(defaultSafeRangeMin);
});

test('updateBGLSafeRangeMaxToDefault() - changes BGLSafeRange maxValue to default (130)', () => {
    const stubSafeRange = {maxValue: '100'};
    Realm.prototype.objects = jest.fn(() => {
        return [stubSafeRange];
    });

    db.updateBGLSafeRangeMaxToDefault();

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(stubSafeRange.maxValue).toEqual(defaultSafeRangeMax);
});

test('updateBGLStandard(standard) - updates the BGLStandard.standard value in database to given value', () => {
    const stubStandard = {standard: standardUS};
    Realm.prototype.objects = jest.fn(() => {
        return [stubStandard];
    });

    db.updateBGLStandard(standardUK);

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(stubStandard.standard).toEqual(standardUK);
});

test('getLatestReading() - returns reading with the most recent date', () => {
    const expectedReading = {id: '1', value: '82.5', date: new Date(2017, 3, 6, 22, 50, 55)};
    const readings = new ResultsMock(
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

    expect(processReading).toHaveBeenCalledWith(expectedReading.value, stubStandard.standard);
    expect(actualReadingValue).toEqual(expectedReading.value)
});

test('getBGLReadingsInDateRange(startDate, endDate) - gets readings within specified date range, reverse sorted by date', () => {
    const startDate = new Date(2017, 2, 2);
    const endDate = new Date(2017, 2, 7);
    const readings = new ResultsMock(
        {id: '1', value: '20', date: new Date(2017, 2, 1)},
        {id: '2', value: '30', date: new Date(2017, 2, 2)},
        {id: '3', value: '40', date: new Date(2017, 2, 5)},
        {id: '4', value: '50', date: new Date(2017, 2, 7)},
        {id: '5', value: '60', date: new Date(2017, 2, 8)}
    );
    const expectedReadings = [readings[3], readings[2], readings[1]];
    const standardStub = {standard: standardUS};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [standardStub]
    });
    processReading.mockImplementation = jest.fn((value) => {
        return value;
    });

    const actualReadings = db.getBGLReadingsInDateRange(startDate, endDate);

    expect(actualReadings).toEqual(expectedReadings);
});