'use strict';
import isNumberValid from '../inputValidator';

test('isNumberValid(input) - returns boolean representing whether input parameter is valid reading value', () => {
    expect(isNumberValid('82')).toEqual(true);
    expect(isNumberValid('82.5')).toEqual(true);
    expect(isNumberValid('82.57')).toEqual(true);
    expect(isNumberValid('82.565')).toEqual(true);
    expect(isNumberValid('5')).toEqual(true);
    expect(isNumberValid('5.8')).toEqual(true);
    expect(isNumberValid('0.5')).toEqual(true);
    expect(isNumberValid('.5')).toEqual(true);

    expect(isNumberValid('82..')).toEqual(false);
    expect(isNumberValid('82.')).toEqual(false);
    expect(isNumberValid('82.5a5')).toEqual(false);
    expect(isNumberValid('1abc')).toEqual(false);
    expect(isNumberValid('')).toEqual(false);
    expect(isNumberValid(' ')).toEqual(false);
    expect(isNumberValid('0')).toEqual(false);
});