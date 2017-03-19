'use strict';

const readingUnitStandards = {
    UK: 'mmol/L',
    US: 'mg/dL'
};

const graphModes = {
    glucose: "Glucose",
    steps: "Steps",
    calories: "Calories"
};

const timeRanges = {
    lastHour: "60m",
    lastDay: "24h"
};

const defaultSafeRange = {
    min: '70',
    max: '130'
};

export {readingUnitStandards, graphModes, timeRanges, defaultSafeRange};