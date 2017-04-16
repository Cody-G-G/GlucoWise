'use strict';
const EventEmitter = require('events'); // this is a library part of Node.JS
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

    emitSettingsInfoEvent() {
        eventEmitter.emit('SettingsInfo');
    }

    addBolusHelpListener(callback) {
        eventEmitter.addListener('BolusHelp', callback);
    }

    addSettingsInfoListener(callback) {
        eventEmitter.addListener('SettingsInfo', callback);
    }
}

export default new Emitter();