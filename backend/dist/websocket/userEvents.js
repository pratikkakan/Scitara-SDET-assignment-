"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userWebSocketPublisher = void 0;
const events_1 = require("./events");
const eventEmitter_1 = require("./eventEmitter");
exports.userWebSocketPublisher = {
    emitUserCreated(user) {
        eventEmitter_1.webSocketEventEmitter.emit(events_1.WebSocketEvent.USER_CREATED, (0, events_1.buildUserCreatedEventPayload)(user));
    },
};
//# sourceMappingURL=userEvents.js.map