'use strict';
jest.mock('realm', () => {
    return require('./mocks/realm.mock').default;
});
jest.mock('uuid/v1');
jest.mock('../../helpers/util/readingProcessor');
import * as processReading from '../../helpers/util/readingProcessor';
import ResultsMock from './mocks/realmResults.mock';
const uuid = require('uuid/v1');
const Realm = require('realm');
import db from "../database";
import MockDate from 'mockdate';

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
    processReading.default.mockReset();
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
    const readingValue = '82.5';
    const readingDate = new Date();
    const readingUUID = 'UUID';
    uuid.mockImplementation(() => {
        return readingUUID
    });

    db.saveBGLReading(readingValue, readingDate);

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(Realm.prototype.create).toHaveBeenCalledWith(readingObjName, {
        id: readingUUID,
        value: readingValue,
        date: readingDate
    })
});

test('updateBGLSafeRangeMin(minValue)_withStandardUS - updates minValue of BGLSafeRange to given value in database', () => {
    const oldMinValue = '85';
    const newMinValue = '135';
    const safeRange = {minValue: oldMinValue};
    const standardObj = {standard: standardUS};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === safeRangeObjName ? [safeRange] : [standardObj]
    });
    processReading.default = jest.fn(() => {
        return newMinValue;
    });

    db.updateBGLSafeRangeMin(newMinValue);

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(processReading.default).toHaveBeenCalledWith(newMinValue, standardObj.standard, true);
    expect(safeRange.minValue).toEqual(newMinValue);
});

test('updateBGLSafeRangeMin(minValue)_withStandardUK - updates minValue of BGLSafeRange to given value in database', () => {
    const oldMinValue = '85';
    const newMinValue = '13.5';
    const expectedMinValue = '135';
    const safeRange = {minValue: oldMinValue};
    const standardObj = {standard: standardUK};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === safeRangeObjName ? [safeRange] : [standardObj]
    });
    processReading.default = jest.fn(() => {
        return expectedMinValue;
    });

    db.updateBGLSafeRangeMin(newMinValue);

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(processReading.default).toHaveBeenCalledWith(newMinValue, standardObj.standard, true);
    expect(safeRange.minValue).toEqual(expectedMinValue);
});

test('updateBGLSafeRangeMax(maxValue)_withStandardUS - updates maxValue of BGLSafeRange to given value in database', () => {
    const oldMaxValue = '85';
    const newMaxValue = '135';
    const safeRange = {minValue: oldMaxValue};
    const standardObj = {standard: standardUS};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === safeRangeObjName ? [safeRange] : [standardObj]
    });
    processReading.default = jest.fn(() => {
        return newMaxValue;
    });

    db.updateBGLSafeRangeMax(newMaxValue);

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(processReading.default).toHaveBeenCalledWith(newMaxValue, standardObj.standard, true);
    expect(safeRange.maxValue).toEqual(newMaxValue);
});

test('updateBGLSafeRangeMax(maxValue)_withStandardUK - updates maxValue of BGLSafeRange to given value in database', () => {
    const oldMaxValue = '85';
    const newMaxValue = '3.5';
    const expectedMaxValue = '35';
    const safeRange = {minValue: oldMaxValue};
    const standardObj = {standard: standardUK};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === safeRangeObjName ? [safeRange] : [standardObj]
    });
    processReading.default = jest.fn(() => {
        return expectedMaxValue;
    });

    db.updateBGLSafeRangeMax(newMaxValue);

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(processReading.default).toHaveBeenCalledWith(newMaxValue, standardObj.standard, true);
    expect(safeRange.maxValue).toEqual(expectedMaxValue);
});

test('updateBGLSafeRangeMinToDefault() - changes BGLSafeRange minValue to default (70)', () => {
    const safeRange = {minValue: '100'};
    Realm.prototype.objects = jest.fn(() => {
        return [safeRange];
    });

    db.updateBGLSafeRangeMinToDefault();

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(safeRange.minValue).toEqual(defaultSafeRangeMin);
});

test('updateBGLSafeRangeMaxToDefault() - changes BGLSafeRange maxValue to default (130)', () => {
    const safeRange = {maxValue: '100'};
    Realm.prototype.objects = jest.fn(() => {
        return [safeRange];
    });

    db.updateBGLSafeRangeMaxToDefault();

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(safeRange.maxValue).toEqual(defaultSafeRangeMax);
});

test('updateBGLStandard(standard) - updates the BGLStandard.standard value in database to given value', () => {
    const standardObj = {standard: standardUS};
    Realm.prototype.objects = jest.fn(() => {
        return [standardObj];
    });

    db.updateBGLStandard(standardUK);

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(standardObj.standard).toEqual(standardUK);
});

test('getLatestReading()_withStandardUS - returns reading with the most recent date', () => {
    const expectedReading = {id: '1', value: '82.5', date: new Date(2017, 3, 6, 22, 50, 55)};
    const readings = new ResultsMock(
        {id: '3', value: '120', date: new Date(2017, 3, 5, 22, 50, 55)},
        expectedReading,
        {id: '2', value: '50', date: new Date(2017, 3, 6, 22, 50, 54)}
    );
    const standardObj = {standard: standardUS};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [standardObj];
    });
    processReading.default = jest.fn((value) => {
        return value;
    });

    const actualReadingValue = db.getLatestReading();

    expect(processReading.default).toHaveBeenCalledWith(expectedReading.value, standardObj.standard);
    expect(actualReadingValue).toEqual(expectedReading.value)
});

test('getLatestReading()_withStandardUK - returns reading with the most recent date', () => {
    const reading1 = {id: '3', value: '120', date: new Date(2017, 3, 5, 22, 50, 55)};
    const reading2 = {id: '1', value: '82.5', date: new Date(2017, 3, 6, 22, 50, 55)};
    const reading3 = {id: '2', value: '50', date: new Date(2017, 3, 6, 22, 50, 54)};
    const readings = new ResultsMock(reading1, reading2, reading3);
    const expectedReading = Object.assign({}, reading1);
    expectedReading.value = '8.25';
    const standardObj = {standard: standardUS};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [standardObj];
    });
    processReading.default = jest.fn((value) => {
        return String(value / 10);
    });

    const actualReadingValue = db.getLatestReading();

    expect(processReading.default).toHaveBeenCalledWith(String(expectedReading.value * 10), standardObj.standard);
    expect(actualReadingValue).toEqual(expectedReading.value)
});

test('getBGLReadingsInDateRange(startDate, endDate)_withStandardUS - gets readings within specified date range, reverse sorted by date', () => {
    const startDate = new Date(2017, 2, 2);
    const endDate = new Date(2017, 2, 7);
    const reading1 = {id: '1', value: '20', date: new Date(2017, 2, 1)};
    const reading2 = {id: '2', value: '30', date: new Date(2017, 2, 2)};
    const reading3 = {id: '3', value: '40', date: new Date(2017, 2, 5)};
    const reading4 = {id: '4', value: '50', date: new Date(2017, 2, 7)};
    const reading5 = {id: '5', value: '60', date: new Date(2017, 2, 8)};
    const readings = new ResultsMock(reading1, reading2, reading3, reading4, reading5);
    const expectedReadings = [reading4, reading3, reading2];
    const standardObj = {standard: standardUS};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [standardObj]
    });
    processReading.default = jest.fn((value) => {
        return value;
    });

    const actualReadings = db.getBGLReadingsInDateRange(startDate, endDate);

    expect(actualReadings).toEqual(expectedReadings);
});

test('getBGLReadingsInDateRange(startDate, endDate)_withStandardUK - gets readings within specified date range, reverse sorted by date', () => {
    const startDate = new Date(2017, 2, 2);
    const endDate = new Date(2017, 2, 7);
    const reading1 = {id: '1', value: '20', date: new Date(2017, 2, 1)};
    const reading2 = {id: '2', value: '30', date: new Date(2017, 2, 2)};
    const reading3 = {id: '3', value: '40', date: new Date(2017, 2, 5)};
    const reading4 = {id: '4', value: '50', date: new Date(2017, 2, 7)};
    const reading5 = {id: '5', value: '60', date: new Date(2017, 2, 8)};
    const readings = new ResultsMock(reading1, reading2, reading3, reading4, reading5);
    const expectedReadings = [
        Object.assign({}, reading4),
        Object.assign({}, reading3),
        Object.assign({}, reading2)
    ];
    expectedReadings.forEach((reading) => reading.value = String(reading.value / 10));
    const standardObj = {standard: standardUK};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [standardObj]
    });
    processReading.default = jest.fn((value) => {
        return String(value / 10);
    });

    const actualReadings = db.getBGLReadingsInDateRange(startDate, endDate);

    expect(actualReadings).toEqual(expectedReadings);
});

test('get24hBGLReadings()_withStandardUS - returns readings with date within last 24hrs', () => {
    const standardObj = {standard: standardUS};
    const reading1 = {id: '1', value: '20', date: new Date(2017, 2, 1, 15, 29)};
    const reading2 = {id: '2', value: '30', date: new Date(2017, 2, 1, 15, 30)};
    const reading3 = {id: '3', value: '40', date: new Date(2017, 2, 2, 12)};
    const reading4 = {id: '4', value: '50', date: new Date(2017, 2, 2, 15, 30)};
    const readings = new ResultsMock(reading1, reading2, reading3, reading4);
    const expectedReadings = [reading4, reading3, reading2];
    MockDate.set(new Date(2017, 2, 2, 15, 30));
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [standardObj]
    });
    processReading.default = jest.fn((value) => {
        return value;
    });

    const actualReadings = db.get24hBGLReadings();

    expect(actualReadings).toEqual(expectedReadings);
});

test('get24hBGLReadings()_withStandardUK - returns readings with date within last 24hrs', () => {
    const standardObj = {standard: standardUK};
    const reading1 = {id: '1', value: '20', date: new Date(2017, 2, 1, 15, 29)};
    const reading2 = {id: '2', value: '30', date: new Date(2017, 2, 1, 15, 30)};
    const reading3 = {id: '3', value: '40', date: new Date(2017, 2, 2, 12)};
    const reading4 = {id: '4', value: '50', date: new Date(2017, 2, 2, 15, 30)};
    const readings = new ResultsMock(reading1, reading2, reading3, reading4);
    const expectedReadings = [
        Object.assign({}, reading4),
        Object.assign({}, reading3),
        Object.assign({}, reading2)
    ];
    expectedReadings.forEach(reading => reading.value = String(reading.value / 10));
    MockDate.set(new Date(2017, 2, 2, 15, 30));
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [standardObj]
    });
    processReading.default = jest.fn((value) => {
        return String(value / 10);
    });

    const actualReadings = db.get24hBGLReadings();

    expect(actualReadings).toEqual(expectedReadings);
});

test('get60mBGLReadings()_withStandardUS - returns readings with date within last 60 minutes', () => {
    const standardObj = {standard: standardUS};
    const reading1 = {id: '1', value: '20', date: new Date(2017, 2, 2, 14, 29)};
    const reading2 = {id: '2', value: '30', date: new Date(2017, 2, 2, 14, 30)};
    const reading3 = {id: '3', value: '40', date: new Date(2017, 2, 2, 14, 40)};
    const reading4 = {id: '4', value: '50', date: new Date(2017, 2, 2, 15, 30)};
    const readings = new ResultsMock(reading1, reading2, reading3, reading4);
    const expectedReadings = [reading4, reading3, reading2];
    MockDate.set(new Date(2017, 2, 2, 15, 30));
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [standardObj]
    });
    processReading.default = jest.fn((value) => {
        return value;
    });

    const actualReadings = db.get60mBGLReadings();

    expect(actualReadings).toEqual(expectedReadings);
});

test('get60mBGLReadings()_withStandardUK - returns readings with date within last 60 minutes', () => {
    const standardObj = {standard: standardUK};
    const reading1 = {id: '1', value: '20', date: new Date(2017, 2, 2, 14, 29)};
    const reading2 = {id: '2', value: '30', date: new Date(2017, 2, 2, 14, 30)};
    const reading3 = {id: '3', value: '40', date: new Date(2017, 2, 2, 14, 40)};
    const reading4 = {id: '4', value: '50', date: new Date(2017, 2, 2, 15, 30)};
    const readings = new ResultsMock(reading1, reading2, reading3, reading4);
    const expectedReadings = [
        Object.assign({}, readings[3]),
        Object.assign({}, readings[2]),
        Object.assign({}, readings[1])
    ];
    expectedReadings.forEach(reading => reading.value = String(reading.value / 10));
    MockDate.set(new Date(2017, 2, 2, 15, 30));
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [standardObj]
    });
    processReading.default = jest.fn((value) => {
        return String(value / 10);
    });

    const actualReadings = db.get60mBGLReadings();

    expect(actualReadings).toEqual(expectedReadings);
});

test('getBGLSafeRange()_withStandardUS - returns safe range object with current minValue and maxValue', () => {
    const standardUS = {standard: standardUS};
    const safeRange = {minValue: defaultSafeRangeMin, maxValue: defaultSafeRangeMax};
    const expectedSafeRange = safeRange;
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === standardObjName ? [standardUS] : [safeRange];
    });
    processReading.default = jest.fn((value) => {
        return value;
    });

    const actualSafeRange = db.getBGLSafeRange();

    expect(actualSafeRange).toEqual(expectedSafeRange);
});

test('getBGLSafeRange()_withStandardUK - returns safe range object with current minValue and maxValue', () => {
    const standardUK = {standard: standardUK};
    const expectedMinUK = '1.5';
    const expectedMaxUK = '3.5';
    const safeRange = {minValue: defaultSafeRangeMin, maxValue: defaultSafeRangeMax};
    const expectedSafeRange = {minValue: expectedMinUK, maxValue: expectedMaxUK};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === standardObjName ? [standardUK] : [safeRange];
    });
    processReading.default = jest.fn((value) => {
        return value === defaultSafeRangeMin ? expectedMinUK : expectedMaxUK;
    });

    const actualSafeRange = db.getBGLSafeRange();

    expect(actualSafeRange).toEqual(expectedSafeRange);
});

test('getBGLStandard() - returns string value of the current standard', () => {
    const expectedStandard = standardUK;
    Realm.prototype.objects = jest.fn(() => {
        return [{standard: expectedStandard}]
    });

    const actualStandard = db.getBGLStandard();

    expect(actualStandard).toEqual(expectedStandard)
});

test('initBGLReadingListener(callback) - initiates listener on BGLReading, and executes callback on changes', () => {
    const callback = jest.fn();
    const readings = new ResultsMock({value: '80', date: new Date(), id: '1'});
    Realm.prototype.objects = jest.fn(() => {
        return readings;
    });

    db.initBGLReadingListener(callback);

    expect(callback).toHaveBeenCalledTimes(0);
    readings.modified();
    expect(callback).toHaveBeenCalledTimes(1);
});

test('initBGLSafeRangeListener(callback) - initiates listener on BGLSafeRange, and executes callback on changes', () => {
    const callback = jest.fn();
    const safeRange = new ResultsMock({minValue: defaultSafeRangeMin, maxValue: defaultSafeRangeMax});
    Realm.prototype.objects = jest.fn(() => {
        return safeRange;
    });

    db.initBGLReadingListener(callback);

    expect(callback).toHaveBeenCalledTimes(0);
    safeRange.modified();
    expect(callback).toHaveBeenCalledTimes(1);
});

test('initBGLStandardListener(callback) - initiates listener on BGLStandard, and executes callback on changes', () => {
    const callback = jest.fn();
    const standard = new ResultsMock({standard: standardUK});
    Realm.prototype.objects = jest.fn(() => {
        return standard;
    });

    db.initBGLReadingListener(callback);

    expect(callback).toHaveBeenCalledTimes(0);
    standard.modified();
    expect(callback).toHaveBeenCalledTimes(1);
});

test('deleteReading(reading) - deletes given reading from database', () => {
    const readingToKeep = {id: '1', value: '50', date: new Date()};
    const readingToDelete = {id: '2', value: '60', date: new Date()};
    const readings = new ResultsMock(readingToKeep, readingToDelete);
    Realm.prototype.objects = jest.fn(() => {
        return readings;
    });

    db.deleteReading(readingToDelete);

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(Realm.prototype.delete).toHaveBeenCalledWith([readingToDelete]);
});