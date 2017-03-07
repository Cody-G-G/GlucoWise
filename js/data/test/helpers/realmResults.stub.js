'use strict';

class Results extends Array {
    sorted = () => {
        return this.sort((a, b) => {
            return b.date - a.date;
        });
    }
}

module.exports = Results;