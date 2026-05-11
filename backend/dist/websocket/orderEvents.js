"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderWebSocketPublisher = void 0;
const events_1 = require("./events");
const eventEmitter_1 = require("./eventEmitter");
exports.orderWebSocketPublisher = {
    emitOrderStatusChanged(order, previousStatus) {
        eventEmitter_1.webSocketEventEmitter.emit(events_1.WebSocketEvent.ORDER_STATUS_CHANGED, (0, events_1.buildOrderStatusChangedEventPayload)(order, previousStatus));
    },
};
//# sourceMappingURL=orderEvents.js.map