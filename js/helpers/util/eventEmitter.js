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
}

export default new Emitter();
