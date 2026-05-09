"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSocketEventEmitter = void 0;
class WebSocketEventEmitter {
    constructor() {
        this.io = null;
    }
    bind(io) {
        this.io = io;
    }
    emit(eventName, payload) {
        if (!this.io) {
            console.warn(`Socket.IO server is not initialized. Skipping event ${eventName}.`);
            return;
        }
        this.io.emit(eventName, payload);
    }
}
exports.webSocketEventEmitter = new WebSocketEventEmitter();
//# sourceMappingURL=eventEmitter.js.map