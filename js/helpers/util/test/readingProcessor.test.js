'use strict';
import processReading from "../readingProcessor";

test('processReading(value, currentStandard, forPersistence) - converts reading to mmol/L if currentStandard is UK, unless forPersistence is true, in which case converts to mg/dL', () => {
    const standardUK = 'mmol/L';
    const standardUS = 'mg/dL';

    // US value converted to UK when currentStandard = UK, and rounded up on 1 fractional digit
    const stubUsReadingValue_willRoundUp = 82.5;
    let expectedReadingValueUsFromUk_roundedUp = 4.6;
    expect(processReading(stubUsReadingValue_willRoundUp, standardUK)).toEqual(expectedReadingValueUsFromUk_roundedUp);

    // US  value converted to UK when currentStandard = UK, and rounded down on 1 fractional digit
    const stubUsReadingValue_willRoundDown = 81.8;
    let expectedReadingValueUsFromUk_roundedDown = 4.5;
    expect(processReading(stubUsReadingValue_willRoundDown, standardUK)).toEqual(expectedReadingValueUsFromUk_roundedDown);

    // UK value converted to US when currentStandard = UK and forPersistence = true, and rounded down on 1 fractional digit
    const stubUkReadingValue_willRoundDown = 4.63;
    expectedReadingValueUsFromUk_roundedDown = 83.3;
    expect(processReading(stubUkReadingValue_willRoundDown, standardUK, true)).toEqual(expectedReadingValueUsFromUk_roundedDown);

    // UK value converted to US when currentStandard = UK and forPersistence = true, and rounded up on 1 fractional digit
    const stubUkReadingValue_willRoundUp = 4.71;
    expectedReadingValueUsFromUk_roundedUp = 84.8;
    expect(processReading(stubUkReadingValue_willRoundUp, standardUK, true)).toEqual(expectedReadingValueUsFromUk_roundedUp);

    // US value not converted when currentStandard = US and also when forPersistence = true
    const stubUsReadingValue = 82.8;
    const expectedReadingValueUsFromUs = 82.8;
    expect(processReading(stubUsReadingValue, standardUS, true)).toEqual(expectedReadingValueUsFromUs);
    expect(processReading(stubUsReadingValue, standardUS)).toEqual(expectedReadingValueUsFromUs);
});