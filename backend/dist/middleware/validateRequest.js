"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const appError_1 = require("../utils/appError");
const validateRequest = (schema, property = "body") => {
    return (req, _res, next) => {
        const result = schema.safeParse(req[property]);
        if (!result.success) {
            const details = result.error.issues.map((issue) => ({
                field: issue.path.join(".") || property,
                message: issue.message,
            }));
            next(new appError_1.AppError("Validation failed", 400, "VALIDATION_ERROR", details));
            return;
        }
        req[property] = result.data;
        next();
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map