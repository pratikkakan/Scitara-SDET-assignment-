"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const uuid_1 = require("uuid");
const orderStore_1 = require("../data/orderStore");
const appError_1 = require("../utils/appError");
const orderEvents_1 = require("../websocket/orderEvents");
class OrderService {
    async getOrders() {
        return orderStore_1.orderStore.getAll();
    }
    async getOrderById(id) {
        const order = orderStore_1.orderStore.getById(id);
        if (!order)
            throw new appError_1.AppError("Order not found", 404, "ORDER_NOT_FOUND");
        return order;
    }
    async createOrder(input) {
        const timestamp = new Date().toISOString();
        const order = {
            id: (0, uuid_1.v4)(),
            ...input,
            status: "pending",
            createdAt: timestamp,
            updatedAt: timestamp,
        };
        return orderStore_1.orderStore.create(order);
    }
    async updateOrderStatus(id, input) {
        const existing = await this.getOrderById(id);
        const previousStatus = existing.status;
        const updated = orderStore_1.orderStore.update(id, { status: input.status });
        if (!updated)
            throw new appError_1.AppError("Order not found", 404, "ORDER_NOT_FOUND");
        orderEvents_1.orderWebSocketPublisher.emitOrderStatusChanged(updated, previousStatus);
        return updated;
    }
}
exports.orderService = new OrderService();
//# sourceMappingURL=order.service.js.map