'use strict';
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

class Emitter {

    emitGraphsHelpEvent() {
        eventEmitter.emit('GraphsHelp');
    }

    addGraphsHelpListener(callback) {
        eventEmitter.addListener('GraphsHelp', callback);
    }

    emitBolusHelpEvent() {
        eventEmitter.emit('BolusHelp');
    }

    addBolusHelpListener(callback) {
        eventEmitter.addListener('BolusHelp', callback);
    }
}

export default new Emitter();