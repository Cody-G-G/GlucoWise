'use strict';
import dateUtil from "../date";
import MockDate from "mockdate";

test('padDate(datePortion) - pads date portion with 0 if portion < 10', () => {
    expect(dateUtil.padDate("2")).toEqual("02");
    expect(dateUtil.padDate("20")).toEqual("20");
});

test("getTodayString() - gets today's date as a string", () => {
    MockDate.set(new Date(2016, 2, 2));
    expect(dateUtil.getTodayString()).toEqual("02-03-2016");
    MockDate.reset();
});

test("toDateString(date) - returns date converted to string in format DD-MM-YYYY", () => {
    const date = new Date(2016, 2, 2);
    expect(dateUtil.toDateString(date)).toEqual("02-03-2016");
});

test("toDateTimeString(date) - returns dateTime converted to string in format DD-MM-YYYY HH:MM", () => {
    const date = new Date(2016, 2, 2);
    expect(dateUtil.toDateString(date)).toEqual("02-03-2016");
});

test("areWithin24Hours(from, to) - returns boolean indicating whether the dates are within 24 hours of each other", () => {
    const to = new Date(2016, 3, 2, 15, 30, 30);
    const dateWithin24Hrs = new Date(2016, 3, 1, 15, 30, 30);
    const dateNotWithin24Hrs = new Date(2016, 3, 1, 15, 30, 29, 999);

    expect(dateUtil.areWithin24Hours(dateWithin24Hrs, to)).toEqual(true);
    expect(dateUtil.areWithin24Hours(dateNotWithin24Hrs, to)).toEqual(false);
});

test("areWithin60Minutes(from, to) - returns boolean indicating whether the dates are 60 minutes of each other", () => {
    const to = new Date(2016, 3, 2, 15, 30, 30);
    const dateWithin60m = new Date(2016, 3, 2, 14, 30, 30);
    const dateNotWithin60m = new Date(2016, 3, 2, 14, 30, 29, 999);

    expect(dateUtil.areWithin60Minutes(dateWithin60m, to)).toEqual(true);
    expect(dateUtil.areWithin60Minutes(dateNotWithin60m, to)).toEqual(false);
});

test("dayOfWeek(date) - returns the day of the week as a string, corresponding to the given date", () => {
    const dateOnWednesday = new Date(2017, 2, 22);
    const dateOnSaturday = new Date(2017, 2, 25);

    expect(dateUtil.dayOfWeek(dateOnWednesday)).toEqual("Wednesday");
    expect(dateUtil.dayOfWeek(dateOnSaturday)).toEqual("Saturday");
});


test("hoursBetween(from, to) - returns the number of hours between the given dates", () => {
    const from = new Date(2016, 3, 2, 17);
    const to = new Date(2016, 3, 2, 14, 30);

    expect(dateUtil.hoursBetween(from, to)).toEqual(2.5);
    expect(dateUtil.hoursBetween(from, from)).toEqual(0);
});

test("daysBetween(from, to) - returns the number of days between the given dates", () => {
    const from = new Date(2016, 3, 2, 17);
    const to = new Date(2016, 3, 5, 5);

    expect(dateUtil.daysBetween(from, to)).toEqual(2.5);
    expect(dateUtil.daysBetween(to, to)).toEqual(0);
});

test("minutesBetween(from, to) - returns the number of minutes between the given dates", () => {
    const from = new Date(2016, 3, 2, 15, 2, 30);
    const to = new Date(2016, 3, 2, 14, 30);

    expect(dateUtil.minutesBetween(from, to)).toEqual(32.5);
    expect(dateUtil.minutesBetween(from, from)).toEqual(0);
});

test("weeksBetween(from, to) - returns the number of weeks between the given dates", () => {
    const from = new Date(2016, 3, 2);
    const to = new Date(2016, 3, 17);

    expect(dateUtil.weeksBetween(from, to)).toEqual(2 + 1 / 7);
    expect(dateUtil.weeksBetween(from, from)).toEqual(0);
});

test("monthsBetween(from, to) - returns the number of months between the given dates", () => {
    const from = new Date(2016, 3, 2);
    const to = new Date(2016, 6, 2);

    expect(dateUtil.monthsBetween(from, to)).toEqual(2.9917808219178084);
    expect(dateUtil.monthsBetween(from, from)).toEqual(0);
});

test("toDateFromDateString(dateString, hour, minute, second, millisecond) - returns Date corresponding to given string in DD-MM-YYYY format, with time as specified with parameters", () => {
    expect(dateUtil.toDateFromDateString("02-03-2017", 3, 5, 30, 505)).toEqual(new Date(2017, 2, 2, 3, 5, 30, 505));
});

test("toDateFromDateTimeString(dateTimeString) - returns Date corresponding to given string in DD-MM-YYYY HH:mm format", () => {
    expect(dateUtil.toDateFromDateTimeString("02-03-2017 05:32")).toEqual(new Date(2017, 2, 2, 5, 32));
});

test("hoursBeforeMillis(hours, date) - returns milliseconds corresponding to the date at given hours in the past from the given date", () => {
    const date = new Date(2017, 3, 2, 5);
    const hoursBefore = 2.5;
    const expected = new Date(2017, 3, 2, 2, 30).getTime();

    expect(dateUtil.hoursBeforeMillis(hoursBefore, date)).toEqual(expected);
    expect(dateUtil.hoursBeforeMillis(0, date)).toEqual(date.getTime());
});

test("minutesBeforeMillis(minutes, date) - returns milliseconds corresponding to the date at given minutes in the past from the given date", () => {
    const date = new Date(2017, 3, 2, 5);
    const minutesBefore = 25;
    const expected = new Date(2017, 3, 2, 4, 35).getTime();

    expect(dateUtil.minutesBeforeMillis(minutesBefore, date)).toEqual(expected);
    expect(dateUtil.minutesBeforeMillis(0, date)).toEqual(date.getTime());
});

test("daysBeforeMillis(days, date) - returns milliseconds corresponding to the date at given days in the past from the given date", () => {
    const date = new Date(2017, 3, 10, 10);
    const daysBefore = 9;
    const expected = new Date(2017, 3, 1, 10).getTime();

    expect(dateUtil.daysBeforeMillis(daysBefore, date)).toEqual(expected);
    expect(dateUtil.daysBeforeMillis(0, date)).toEqual(date.getTime());
});

test("monthsBeforeMillis(months, date) - returns milliseconds corresponding to the date at given months in the past from the given date", () => {
    const date = new Date(2017, 3, 3, 5);
    const monthsBefore = 2;
    const expected = new Date(2017, 1, 3, 5).getTime();

    expect(dateUtil.monthsBeforeMillis(monthsBefore, date)).toEqual(expected);
    expect(dateUtil.monthsBeforeMillis(0, date)).toEqual(date.getTime());
});

test("dayStartMillis(date) - returns milliseconds corresponding to the start of the day of the given date", () => {
    const date = new Date(2017, 3, 3, 5, 30, 45, 555, 999);
    const expected = new Date(2017, 3, 3).getTime();

    expect(dateUtil.dayStartMillis(date)).toEqual(expected);
});

test("dayEndMillis(date) - returns milliseconds corresponding to the end of the day of the given date", () => {
    const date = new Date(2017, 3, 3, 5, 30, 45, 555, 666);
    const expected = new Date(2017, 3, 3, 23, 59, 59, 999, 999).getTime();

    expect(dateUtil.dayEndMillis(date)).toEqual(expected);
});

test("hourStartMillis(date) - returns milliseconds corresponding to the start of the hour of the given date", () => {
    const date = new Date(2017, 3, 3, 5, 30, 45, 555, 666);
    const expected = new Date(2017, 3, 3, 5).getTime();

    expect(dateUtil.hourStartMillis(date)).toEqual(expected);
});

test("minuteStartMillis(date) - returns milliseconds corresponding to the start of the minute of the given date", () => {
    const date = new Date(2017, 3, 3, 5, 30, 45, 555, 666);
    const expected = new Date(2017, 3, 3, 5, 30).getTime();

    expect(dateUtil.minuteStartMillis(date)).toEqual(expected);
});

test("millisFromDayStart(date) - returns milliseconds corresponding to the difference between the given date, and the start of the day on the given date", () => {
    const date = new Date(2017, 3, 3, 10, 35, 21, 555);
    const expected = 3.6e7 + 2.1e+6 + 21000 + 555;

    expect(dateUtil.millisFromDayStart(date)).toEqual(expected);
});

test("millisFromHourStart(date) - returns milliseconds corresponding to the difference between the given date, and the start of the hour on the given date", () => {
    const date = new Date(2017, 3, 3, 10, 35, 21, 555);
    const expected = 2.1e+6 + 21000 + 555;

    expect(dateUtil.millisFromHourStart(date)).toEqual(expected);
});

test("millisFromMinuteStart(date) - returns milliseconds corresponding to the difference between the given date, and the start of the minute on the given date", () => {
    const date = new Date(2017, 3, 3, 10, 35, 21, 555);
    const expected = 21000 + 555;

    expect(dateUtil.millisFromMinuteStart(date)).toEqual(expected);
});

test("hourOfDayHoursAgo(hoursAgo, date) - returns the hour of the day in 24h system at the specified number of hours before the given date", () => {
    const hoursAgo = 6.5;
    const date = new Date(2017, 3, 3, 5, 30);
    const expected = 23;

    expect(dateUtil.hourOfDayHoursAgo(hoursAgo, date)).toEqual(expected);
});

test("monthOfYear(date) - returns the month of the year as a string, corresponding to the given date", () => {
    const date = new Date(2017, 5, 17, 21);
    const expected = "June";

    expect(dateUtil.monthOfYear(date)).toEqual(expected);
});

