"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOrderStatusChangedEventPayload = exports.buildUserCreatedEventPayload = exports.WebSocketEvent = void 0;
const uuid_1 = require("uuid");
exports.WebSocketEvent = {
    USER_CREATED: "USER_CREATED",
    ORDER_STATUS_CHANGED: "ORDER_STATUS_CHANGED",
};
const buildUserCreatedEventPayload = (user) => ({
    eventId: (0, uuid_1.v4)(),
    type: exports.WebSocketEvent.USER_CREATED,
    occurredAt: new Date().toISOString(),
    data: { user },
});
exports.buildUserCreatedEventPayload = buildUserCreatedEventPayload;
const buildOrderStatusChangedEventPayload = (order, previousStatus) => ({
    eventId: (0, uuid_1.v4)(),
    type: exports.WebSocketEvent.ORDER_STATUS_CHANGED,
    occurredAt: new Date().toISOString(),
    data: { order, previousStatus },
});
exports.buildOrderStatusChangedEventPayload = buildOrderStatusChangedEventPayload;
//# sourceMappingURL=events.js.map