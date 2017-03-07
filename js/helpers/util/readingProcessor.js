/**
 * @param value
 * @param currentStandard
 * @param forPersistence
 * @returns {string}
 *
 */
export default (value, currentStandard, forPersistence) => {
    return Number(currentStandard === 'mg/dL' ? value : parseFloat(forPersistence ? (value * 18) : (value / 18)).toFixed(1));
}