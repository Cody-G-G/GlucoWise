/**
 * @param value
 * @param currentStandard
 * @param fractionalDigits
 * @param forPersistence
 * @returns {string}
 */
export default (value, currentStandard, fractionalDigits, forPersistence) => {
    return Number(currentStandard === 'mg/dL' ? value :
        parseFloat(forPersistence ? Math.round(value * 18) : (value / 18)).toFixed(fractionalDigits));
}