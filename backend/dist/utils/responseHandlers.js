"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNoContent = exports.sendCreated = exports.sendOk = void 0;
const sendOk = (res, data) => {
    return res.status(200).json(data);
};
exports.sendOk = sendOk;
const sendCreated = (res, data, location) => {
    if (location) {
        res.location(location);
    }
    return res.status(201).json(data);
};
exports.sendCreated = sendCreated;
const sendNoContent = (res) => {
    return res.status(204).send();
};
exports.sendNoContent = sendNoContent;
//# sourceMappingURL=responseHandlers.js.map