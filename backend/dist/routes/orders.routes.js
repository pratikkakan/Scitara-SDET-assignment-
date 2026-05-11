"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const asyncHandler_1 = require("../middleware/asyncHandler");
const validateRequest_1 = require("../middleware/validateRequest");
const order_validator_1 = require("../validators/order.validator");
const router = (0, express_1.Router)();
router
    .route("/")
    .get((0, asyncHandler_1.asyncHandler)(order_controller_1.getOrders))
    .post((0, validateRequest_1.validateRequest)(order_validator_1.createOrderSchema), (0, asyncHandler_1.asyncHandler)(order_controller_1.createOrder));
router
    .route("/:id")
    .get((0, validateRequest_1.validateRequest)(order_validator_1.orderIdParamSchema, "params"), (0, asyncHandler_1.asyncHandler)(order_controller_1.getOrderById));
router
    .route("/:id/status")
    .patch((0, validateRequest_1.validateRequest)(order_validator_1.orderIdParamSchema, "params"), (0, validateRequest_1.validateRequest)(order_validator_1.updateOrderStatusSchema), (0, asyncHandler_1.asyncHandler)(order_controller_1.updateOrderStatus));
exports.default = router;
//# sourceMappingURL=orders.routes.js.map