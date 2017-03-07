'use strict';
const EventEmitter = require('events');
const resultsEmitter = new EventEmitter();


export default class ResultsMock extends Array {
    sorted = (sortBy, reverse) => {
        if (sortBy === 'date') {
            return this.sort((a, b) => {
                return reverse ? b.date - a.date : a.date - b.date;
            });
        }
    };

    filtered = function () {
        if (arguments.length === 3) { // for getBGLReadingInDateRange()
            const startDate = arguments[2];
            const endDate = arguments[1];
            return new ResultsMock(... this.filter((reading) => {
                return (reading.date >= startDate) && (reading.date <= endDate);
            }));
        } else { // for deleteReading()
            const id = arguments[1];
            return this.filter((reading) => {
                return reading.id === id;
            });
        }
    };

    addListener = (callback) => {
        resultsEmitter.on('modification', () => {
            callback(this, {modifications: [1], deletions: [], insertions: []})
        });
    };

    modified = () => {
        resultsEmitter.emit('modification');
    }
}