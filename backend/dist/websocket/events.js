"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUserCreatedEventPayload = exports.WebSocketEvent = void 0;
const uuid_1 = require("uuid");
exports.WebSocketEvent = {
    USER_CREATED: "USER_CREATED",
};
const buildUserCreatedEventPayload = (user) => ({
    eventId: (0, uuid_1.v4)(),
    type: exports.WebSocketEvent.USER_CREATED,
    occurredAt: new Date().toISOString(),
    data: {
        user,
    },
});
exports.buildUserCreatedEventPayload = buildUserCreatedEventPayload;
//# sourceMappingURL=events.js.map