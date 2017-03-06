'use strict';
import validateReadingValue from '../readingValueValidator';

test('validateReadingValue(input) - returns boolean representing whether input parameter is valid reading value', () => {
    expect(validateReadingValue('82')).toEqual(true);
    expect(validateReadingValue('82.5')).toEqual(true);
    expect(validateReadingValue('82.57')).toEqual(true);
    expect(validateReadingValue('82.565')).toEqual(true);
    expect(validateReadingValue('5')).toEqual(true);
    expect(validateReadingValue('5.8')).toEqual(true);
    expect(validateReadingValue('0.5')).toEqual(true);
    expect(validateReadingValue('.5')).toEqual(true);

    expect(validateReadingValue('82..')).toEqual(false);
    expect(validateReadingValue('82.')).toEqual(false);
    expect(validateReadingValue('82.5a5')).toEqual(false);
    expect(validateReadingValue('1abc')).toEqual(false);
    expect(validateReadingValue('')).toEqual(false);
    expect(validateReadingValue(' ')).toEqual(false);
});