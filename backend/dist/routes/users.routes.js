"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validateRequest_1 = require("../middleware/validateRequest");
const user_validator_1 = require("../validators/user.validator");
const router = (0, express_1.Router)();
router
    .route("/")
    .get((0, asyncHandler_1.asyncHandler)(user_controller_1.getUsers))
    .post((0, validateRequest_1.validateRequest)(user_validator_1.createUserSchema), (0, asyncHandler_1.asyncHandler)(user_controller_1.createUser));
router
    .route("/:id")
    .get((0, validateRequest_1.validateRequest)(user_validator_1.userIdParamSchema, "params"), (0, asyncHandler_1.asyncHandler)(user_controller_1.getUserById))
    .put((0, validateRequest_1.validateRequest)(user_validator_1.userIdParamSchema, "params"), (0, validateRequest_1.validateRequest)(user_validator_1.updateUserSchema), (0, asyncHandler_1.asyncHandler)(user_controller_1.updateUser))
    .delete((0, validateRequest_1.validateRequest)(user_validator_1.userIdParamSchema, "params"), (0, asyncHandler_1.asyncHandler)(user_controller_1.deleteUser));
exports.default = router;
//# sourceMappingURL=users.routes.js.map