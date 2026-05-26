import { EventEmitter } from 'events';

const emitter = global.eventEmitter || new EventEmitter();

if(!global.eventEmitter) {
    global.eventEmitter = emitter;
}

export default emitter;