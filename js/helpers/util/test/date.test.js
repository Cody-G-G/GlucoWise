'use strict';
import dateUtil from "../date";
import MockDate from "mockdate";

test('padDate(datePortion) - pads date portion with 0 if portion < 10', () => {
    expect(dateUtil.padDate("2")).toEqual("02");
    expect(dateUtil.padDate("20")).toEqual("20");
});

test("getTodayString() - gets today's date as a string", () => {
    MockDate.set("03-02-2016");
    expect(dateUtil.getTodayString()).toEqual("02-03-2016");
    MockDate.reset();
});

test("toDateString(date) - returns date converted to string in format DD-MM-YYYY", () => {
    const stubDate = new Date(2016, 2, 2);
    expect(dateUtil.toDateString(stubDate)).toEqual("02-03-2016");
});

test("toDateTimeString(date) - returns dateTime converted to string in format DD-MM-YYYY HH:MM", () => {
    const stubDate = new Date(2016, 2, 2);
    expect(dateUtil.toDateString(stubDate)).toEqual("02-03-2016");
});

test("isWithin24Hours(date) - returns boolean indicating whether date is within last 24hrs", () => {
    const stubNowMillis = (new Date(2016, 3, 2, 15, 30, 30)).getTime();
    const stubDateWithin24Hrs = new Date(2016, 3, 1, 15, 30, 30);
    const stubDateNotWithin24Hrs = new Date(2016, 3, 1, 15, 30, 29, 999);
    Date.now = jest.genMockFunction().mockReturnValue(stubNowMillis);
    expect(dateUtil.isWithin24Hours(stubDateWithin24Hrs)).toEqual(true);
    expect(dateUtil.isWithin24Hours(stubDateNotWithin24Hrs)).toEqual(false);
});

test("isWithin60Minutes(date) - returns boolean indicating whether date is within last 60 minutes", () => {
    const stubNowMillis = (new Date(2016, 3, 2, 15, 30, 30)).getTime();
    const stubDateWithin60M = new Date(2016, 3, 2, 14, 30, 30);
    const stubDateNotWithin60M = new Date(2016, 3, 2, 14, 30, 29, 999);
    Date.now = jest.genMockFunction().mockReturnValue(stubNowMillis);
    expect(dateUtil.isWithin60Minutes(stubDateWithin60M)).toEqual(true);
    expect(dateUtil.isWithin60Minutes(stubDateNotWithin60M)).toEqual(false);
});

test("hoursFromPresent(date) - returns the number of hours the given date is in the past from present time", () => {
    const stubNowMillis = (new Date(2016, 3, 2, 17)).getTime();
    const stubDate = new Date(2016, 3, 2, 14, 30);
    Date.now = jest.genMockFunction().mockReturnValue(stubNowMillis);
    expect(dateUtil.hoursFromPresent(stubDate)).toEqual(2.5);
    expect(dateUtil.hoursFromPresent(new Date(stubNowMillis))).toEqual(0);
});

test("minutesFromPresent(date) - returns the number of minutes the given date is in the past from present time", () => {
    const stubNowMillis = (new Date(2016, 3, 2, 15, 2, 30)).getTime();
    const stubDate = new Date(2016, 3, 2, 14, 30);
    Date.now = jest.genMockFunction().mockReturnValue(stubNowMillis);
    expect(dateUtil.minutesFromPresent(stubDate)).toEqual(32.5);
    expect(dateUtil.minutesFromPresent(new Date(stubNowMillis))).toEqual(0);
});

test("toDateFromDateString(dateString, hour, minute, second, millisecond) - returns Date corresponding to given string in DD-MM-YYYY format, with time as specified with parameters", () => {
    expect(dateUtil.toDateFromDateString("02-03-2017", 3, 5, 30, 505)).toEqual(new Date(2017, 2, 2, 3, 5, 30, 505));
});

test("toDateFromDateTimeString(dateTimeString) - returns Date corresponding to given string in DD-MM-YYYY HH:mm format", () => {
    expect(dateUtil.toDateFromDateTimeString("02-03-2017 05:32")).toEqual(new Date(2017, 2, 2, 5, 32));
});