"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const appError_1 = require("../utils/appError");
const buildErrorPayload = (message, code, path, details) => ({
    success: false,
    error: {
        message,
        code,
        ...(details ? { details } : {}),
    },
    timestamp: new Date().toISOString(),
    path,
});
const isJsonSyntaxError = (error) => error instanceof SyntaxError && "body" in error;
const errorHandler = (error, req, res, _next) => {
    if (isJsonSyntaxError(error)) {
        res.status(400).json(buildErrorPayload("Malformed JSON body", "INVALID_JSON", req.originalUrl));
        return;
    }
    if (error instanceof appError_1.AppError) {
        res.status(error.statusCode).json(buildErrorPayload(error.message, error.code, req.originalUrl, error.details));
        return;
    }
    console.error(error);
    res.status(500).json(buildErrorPayload("An unexpected error occurred", "INTERNAL_SERVER_ERROR", req.originalUrl));
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map