"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const appError_1 = require("../utils/appError");
const notFoundHandler = (req, _res, next) => {
    next(new appError_1.AppError(`Route ${req.method} ${req.originalUrl} was not found`, 404, "ROUTE_NOT_FOUND"));
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=notFoundHandler.js.map