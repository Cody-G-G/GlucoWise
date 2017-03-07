'use strict';

export default class ResultsMock extends Array {
    sorted = (sortBy, reverse) => {
        if (sortBy === 'date') {
            return this.sort((a, b) => {
                return reverse ? b.date - a.date : a.date - b.date;
            });
        }
    };

    filtered = (string, startDate, endDate) => {
        return new ResultsMock(... this.filter((reading) => {
            return (reading.date <= startDate) && (reading.date >= endDate);
        }));
    }
}