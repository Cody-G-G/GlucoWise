'use strict';

const readingUnitStandards = {
    UK: 'mmol/L',
    US: 'mg/dL'
};

const graphModes = {
    glucose: "Glucose",
    steps: "Steps",
    calories: "Calories",
    weight: "Weight"
};

const timeRanges = {
    lastHour: "60m",
    lastDay: "24h",
    lastWeek: "7d",
    lastMonth: "30d",
    lastHalfYear: "6M",
    lastYear: "1y"
};

const defaultSafeRange = {
    min: '70',
    max: '130'
};

export {readingUnitStandards, graphModes, timeRanges, defaultSafeRange};