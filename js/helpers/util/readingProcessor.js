import {readingUnitStandards} from "./constants";

/**
 * @param value
 * @param currentStandard
 * @param forPersistence
 * @returns {string}
 */
export default (value, currentStandard, forPersistence) => {
    return Number(currentStandard === readingUnitStandards.US ?
        value :
        parseFloat(forPersistence ? (value * 18) : (value / 18)).toFixed(1));
}