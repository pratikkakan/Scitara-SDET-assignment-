"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrderById = exports.getOrders = exports.createOrder = void 0;
const order_service_1 = require("../services/order.service");
const responseHandlers_1 = require("../utils/responseHandlers");
const createOrder = async (req, res) => {
    const order = await order_service_1.orderService.createOrder(req.body);
    (0, responseHandlers_1.sendCreated)(res, order, `${req.baseUrl}/${order.id}`);
};
exports.createOrder = createOrder;
const getOrders = async (_req, res) => {
    const orders = await order_service_1.orderService.getOrders();
    (0, responseHandlers_1.sendOk)(res, orders);
};
exports.getOrders = getOrders;
const getOrderById = async (req, res) => {
    const { id } = req.params;
    const order = await order_service_1.orderService.getOrderById(id);
    (0, responseHandlers_1.sendOk)(res, order);
};
exports.getOrderById = getOrderById;
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const order = await order_service_1.orderService.updateOrderStatus(id, req.body);
    (0, responseHandlers_1.sendOk)(res, order);
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=order.controller.js.map