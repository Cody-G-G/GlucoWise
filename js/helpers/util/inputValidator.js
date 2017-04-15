'use strict';

const isNumberValid = (input) => {
    let numbers = '0123456789.';
    let decimalPoints = 0;
    let valid = true;
    let digits = String(input).trim().split('');

    let isInputEmpty = digits.length === 0;
    let isLastCharDecimalPoint = digits[digits.length - 1] === '.';
    let isZero = input === 0;

    digits.forEach((digit) => {
        let isValidDigit = (numbers.indexOf(digit) !== -1);
        digit === '.' && decimalPoints++;

        if (!isValidDigit || decimalPoints > 1) {
            valid = false;
        }
    });

    (isInputEmpty || isLastCharDecimalPoint || isZero) && (valid = false);

    return valid;
};

export default isNumberValid;