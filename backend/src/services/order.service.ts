import { v4 as uuidv4 } from "uuid";
import { orderStore } from "../data/orderStore";
import type { CreateOrderInput, Order, UpdateOrderStatusInput } from "../types/order.types";
import { AppError } from "../utils/appError";
import { orderWebSocketPublisher } from "../websocket/orderEvents";

class OrderService {
  async getOrders(): Promise<Order[]> {
    return orderStore.getAll();
  }

  async getOrderById(id: string): Promise<Order> {
    const order = orderStore.getById(id);
    if (!order) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");
    return order;
  }

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const timestamp = new Date().toISOString();
    const order: Order = {
      id: uuidv4(),
      ...input,
      status: "pending",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    return orderStore.create(order);
  }

  async updateOrderStatus(id: string, input: UpdateOrderStatusInput): Promise<Order> {
    const existing = await this.getOrderById(id);
    const previousStatus = existing.status;

    const updated = orderStore.update(id, { status: input.status });
    if (!updated) throw new AppError("Order not found", 404, "ORDER_NOT_FOUND");

    orderWebSocketPublisher.emitOrderStatusChanged(updated, previousStatus);
    return updated;
  }
}

export const orderService = new OrderService();
