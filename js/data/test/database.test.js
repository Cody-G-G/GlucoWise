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

test('updateBGLSafeRangeMin(minValue)_withStandardUS - updates minValue of BGLSafeRange to given value in database', () => {
    const stubOldMinValue = '85';
    const stubNewMinValue = '135';
    const stubSafeRange = {minValue: stubOldMinValue};
    const stubStandard = {standard: standardUS};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === safeRangeObjName ? [stubSafeRange] : [stubStandard]
    });
    processReading.default = jest.fn(() => {
        return stubNewMinValue;
    });

    db.updateBGLSafeRangeMin(stubNewMinValue);

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(processReading.default).toHaveBeenCalledWith(stubNewMinValue, stubStandard.standard, true);
    expect(stubSafeRange.minValue).toEqual(stubNewMinValue);
});

test('updateBGLSafeRangeMin(minValue)_withStandardUK - updates minValue of BGLSafeRange to given value in database', () => {
    const stubOldMinValue = '85';
    const stubNewMinValue = '13.5';
    const expectedNewMinValue = '135';
    const stubSafeRange = {minValue: stubOldMinValue};
    const stubStandard = {standard: standardUK};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === safeRangeObjName ? [stubSafeRange] : [stubStandard]
    });
    processReading.default = jest.fn(() => {
        return expectedNewMinValue;
    });

    db.updateBGLSafeRangeMin(stubNewMinValue);

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(processReading.default).toHaveBeenCalledWith(stubNewMinValue, stubStandard.standard, true);
    expect(stubSafeRange.minValue).toEqual(expectedNewMinValue);
});

test('updateBGLSafeRangeMax(maxValue)_withStandardUS - updates maxValue of BGLSafeRange to given value in database', () => {
    const stubOldMaxValue = '85';
    const stubNewMaxValue = '135';
    const stubSafeRange = {minValue: stubOldMaxValue};
    const stubStandard = {standard: standardUS};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === safeRangeObjName ? [stubSafeRange] : [stubStandard]
    });
    processReading.default = jest.fn(() => {
        return stubNewMaxValue;
    });

    db.updateBGLSafeRangeMax(stubNewMaxValue);

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(processReading.default).toHaveBeenCalledWith(stubNewMaxValue, stubStandard.standard, true);
    expect(stubSafeRange.maxValue).toEqual(stubNewMaxValue);
});

test('updateBGLSafeRangeMax(maxValue)_withStandardUK - updates maxValue of BGLSafeRange to given value in database', () => {
    const stubOldMaxValue = '85';
    const stubNewMaxValue = '3.5';
    const expectedMaxValue = '35';
    const stubSafeRange = {minValue: stubOldMaxValue};
    const stubStandard = {standard: standardUK};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === safeRangeObjName ? [stubSafeRange] : [stubStandard]
    });
    processReading.default = jest.fn(() => {
        return expectedMaxValue;
    });

    db.updateBGLSafeRangeMax(stubNewMaxValue);

    expect(Realm.prototype.write).toHaveBeenCalled();
    expect(processReading.default).toHaveBeenCalledWith(stubNewMaxValue, stubStandard.standard, true);
    expect(stubSafeRange.maxValue).toEqual(expectedMaxValue);
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

test('getLatestReading()_withStandardUS - returns reading with the most recent date', () => {
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
    processReading.default = jest.fn((value) => {
        return value;
    });

    const actualReadingValue = db.getLatestReading();

    expect(processReading.default).toHaveBeenCalledWith(expectedReading.value, stubStandard.standard);
    expect(actualReadingValue).toEqual(expectedReading.value)
});

test('getLatestReading()_withStandardUK - returns reading with the most recent date', () => {
    const readings = new ResultsMock(
        {id: '3', value: '120', date: new Date(2017, 3, 5, 22, 50, 55)},
        {id: '1', value: '82.5', date: new Date(2017, 3, 6, 22, 50, 55)},
        {id: '2', value: '50', date: new Date(2017, 3, 6, 22, 50, 54)}
    );
    const expectedReading = Object.assign({}, readings[1]);
    expectedReading.value = '8.25';
    const stubStandard = {standard: standardUS};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [stubStandard];
    });
    processReading.default = jest.fn((value) => {
        return String(value / 10);
    });

    const actualReadingValue = db.getLatestReading();

    expect(processReading.default).toHaveBeenCalledWith(String(expectedReading.value * 10), stubStandard.standard);
    expect(actualReadingValue).toEqual(expectedReading.value)
});

test('getBGLReadingsInDateRange(startDate, endDate)_withStandardUS - gets readings within specified date range, reverse sorted by date', () => {
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
    processReading.default = jest.fn((value) => {
        return value;
    });

    const actualReadings = db.getBGLReadingsInDateRange(startDate, endDate);

    expect(actualReadings).toEqual(expectedReadings);
});

test('getBGLReadingsInDateRange(startDate, endDate)_withStandardUK - gets readings within specified date range, reverse sorted by date', () => {
    const startDate = new Date(2017, 2, 2);
    const endDate = new Date(2017, 2, 7);
    const stubReading_1 = {id: '1', value: '20', date: new Date(2017, 2, 1)};
    const stubReading_2 = {id: '2', value: '30', date: new Date(2017, 2, 2)};
    const stubReading_3 = {id: '3', value: '40', date: new Date(2017, 2, 5)};
    const stubReading_4 = {id: '4', value: '50', date: new Date(2017, 2, 7)};
    const stubReading_5 = {id: '5', value: '60', date: new Date(2017, 2, 8)};
    const readings = new ResultsMock(stubReading_1, stubReading_2, stubReading_3, stubReading_4, stubReading_5);
    const stubExpectedReadingUK_1 = Object.assign({}, stubReading_2);
    const stubExpectedReadingUK_2 = Object.assign({}, stubReading_3);
    const stubExpectedReadingUK_3 = Object.assign({}, stubReading_4);
    stubExpectedReadingUK_1.value = String(stubExpectedReadingUK_1.value / 10);
    stubExpectedReadingUK_2.value = String(stubExpectedReadingUK_2.value / 10);
    stubExpectedReadingUK_3.value = String(stubExpectedReadingUK_3.value / 10);
    const expectedReadings = [stubExpectedReadingUK_3, stubExpectedReadingUK_2, stubExpectedReadingUK_1];
    const standardStub = {standard: standardUK};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [standardStub]
    });
    processReading.default = jest.fn((value) => {
        return String(value / 10);
    });

    const actualReadings = db.getBGLReadingsInDateRange(startDate, endDate);

    expect(actualReadings).toEqual(expectedReadings);
});

test('get24hBGLReadings()_withStandardUS - returns readings with date within last 24hrs', () => {
    const standardStub = {standard: standardUS};
    const readings = new ResultsMock(
        {id: '1', value: '20', date: new Date(2017, 2, 1, 15, 29)},
        {id: '2', value: '30', date: new Date(2017, 2, 1, 15, 30)},
        {id: '3', value: '40', date: new Date(2017, 2, 2, 12)},
        {id: '4', value: '50', date: new Date(2017, 2, 2, 15, 30)}
    );
    const expectedReadings = [readings[3], readings[2], readings[1]];
    MockDate.set(new Date(2017, 2, 2, 15, 30));
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [standardStub]
    });
    processReading.default = jest.fn((value) => {
        return value;
    });

    const actualReadings = db.get24hBGLReadings();

    expect(actualReadings).toEqual(expectedReadings);
});

test('get24hBGLReadings()_withStandardUK - returns readings with date within last 24hrs', () => {
    const standardStub = {standard: standardUK};
    const readings = new ResultsMock(
        {id: '1', value: '20', date: new Date(2017, 2, 1, 15, 29)},
        {id: '2', value: '30', date: new Date(2017, 2, 1, 15, 30)},
        {id: '3', value: '40', date: new Date(2017, 2, 2, 12)},
        {id: '4', value: '50', date: new Date(2017, 2, 2, 15, 30)}
    );
    const expectedReading_1 = Object.assign({}, readings[3]);
    const expectedReading_2 = Object.assign({}, readings[2]);
    const expectedReading_3 = Object.assign({}, readings[1]);
    expectedReading_1.value = String(expectedReading_1.value / 10);
    expectedReading_2.value = String(expectedReading_2.value / 10);
    expectedReading_3.value = String(expectedReading_3.value / 10);
    const expectedReadings = [expectedReading_1, expectedReading_2, expectedReading_3];
    MockDate.set(new Date(2017, 2, 2, 15, 30));
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [standardStub]
    });
    processReading.default = jest.fn((value) => {
        return String(value / 10);
    });

    const actualReadings = db.get24hBGLReadings();

    expect(actualReadings).toEqual(expectedReadings);
});

test('get60mBGLReadings()_withStandardUS - returns readings with date within last 60 minutes', () => {
    const standardStub = {standard: standardUS};
    const readings = new ResultsMock(
        {id: '1', value: '20', date: new Date(2017, 2, 2, 14, 29)},
        {id: '2', value: '30', date: new Date(2017, 2, 2, 14, 30)},
        {id: '3', value: '40', date: new Date(2017, 2, 2, 14, 40)},
        {id: '4', value: '50', date: new Date(2017, 2, 2, 15, 30)}
    );
    const expectedReadings = [readings[3], readings[2], readings[1]];
    MockDate.set(new Date(2017, 2, 2, 15, 30));
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [standardStub]
    });
    processReading.default = jest.fn((value) => {
        return value;
    });

    const actualReadings = db.get60mBGLReadings();

    expect(actualReadings).toEqual(expectedReadings);
});

test('get60mBGLReadings()_withStandardUK - returns readings with date within last 60 minutes', () => {
    const standardStub = {standard: standardUK};
    const readings = new ResultsMock(
        {id: '1', value: '20', date: new Date(2017, 2, 2, 14, 29)},
        {id: '2', value: '30', date: new Date(2017, 2, 2, 14, 30)},
        {id: '3', value: '40', date: new Date(2017, 2, 2, 14, 40)},
        {id: '4', value: '50', date: new Date(2017, 2, 2, 15, 30)}
    );
    const expectedReading_1 = Object.assign({}, readings[3]);
    const expectedReading_2 = Object.assign({}, readings[2]);
    const expectedReading_3 = Object.assign({}, readings[1]);
    expectedReading_1.value = String(expectedReading_1.value / 10);
    expectedReading_2.value = String(expectedReading_2.value / 10);
    expectedReading_3.value = String(expectedReading_3.value / 10);
    const expectedReadings = [expectedReading_1, expectedReading_2, expectedReading_3];
    MockDate.set(new Date(2017, 2, 2, 15, 30));
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === readingObjName ? readings : [standardStub]
    });
    processReading.default = jest.fn((value) => {
        return String(value / 10);
    });

    const actualReadings = db.get60mBGLReadings();

    expect(actualReadings).toEqual(expectedReadings);
});

test('getBGLSafeRange()_withStandardUS - returns safe range object with current minValue and maxValue', () => {
    const standardStubUS = {standard: standardUS};
    const safeRangeStub = {minValue: defaultSafeRangeMin, maxValue: defaultSafeRangeMax};
    const expectedSafeRange = safeRangeStub;
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === standardObjName ? [standardStubUS] : [safeRangeStub];
    });
    processReading.default = jest.fn((value) => {
        return value;
    });

    const actualSafeRange = db.getBGLSafeRange();

    expect(actualSafeRange).toEqual(expectedSafeRange);
});

test('getBGLSafeRange()_withStandardUK - returns safe range object with current minValue and maxValue', () => {
    const standardStubUK = {standard: standardUK};
    const expectedMinUK = '1.5';
    const expectedMaxUK = '3.5';
    const safeRangeStub = {minValue: defaultSafeRangeMin, maxValue: defaultSafeRangeMax};
    const expectedSafeRange = {minValue: expectedMinUK, maxValue: expectedMaxUK};
    Realm.prototype.objects = jest.fn((objectName) => {
        return objectName === standardObjName ? [standardStubUK] : [safeRangeStub];
    });
    processReading.default = jest.fn((value) => {
        return value === defaultSafeRangeMin ? expectedMinUK : expectedMaxUK;
    });

    const actualSafeRange = db.getBGLSafeRange();

    expect(actualSafeRange).toEqual(expectedSafeRange);
});