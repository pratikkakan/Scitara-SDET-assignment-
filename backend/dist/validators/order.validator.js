"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderIdParamSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const order_types_1 = require("../types/order.types");
const orderItemSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, "productId is required"),
    quantity: zod_1.z.number().int().positive("quantity must be a positive integer"),
    price: zod_1.z.number().nonnegative("price must be non-negative"),
});
exports.createOrderSchema = zod_1.z
    .object({
    userId: zod_1.z.string().optional(),
    items: zod_1.z.array(orderItemSchema).min(1, "At least one item is required"),
    total: zod_1.z.number().nonnegative("total must be non-negative"),
})
    .strict();
exports.updateOrderStatusSchema = zod_1.z
    .object({
    status: zod_1.z.enum(order_types_1.ORDER_STATUSES, {
        errorMap: () => ({
            message: `status must be one of: ${order_types_1.ORDER_STATUSES.join(", ")}`,
        }),
    }),
})
    .strict();
exports.orderIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("Order id must be a valid UUID"),
});
//# sourceMappingURL=order.validator.js.map