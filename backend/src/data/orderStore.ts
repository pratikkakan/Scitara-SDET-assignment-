import type { Order } from "../types/order.types";

class OrderStore {
  private readonly orders = new Map<string, Order>();

  getAll(): Order[] {
    return Array.from(this.orders.values());
  }

  getById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  create(order: Order): Order {
    this.orders.set(order.id, order);
    return order;
  }

  update(id: string, patch: Partial<Omit<Order, 'id' | 'createdAt'>>): Order | undefined {
    const existing = this.orders.get(id);
    if (!existing) return undefined;
    const updated: Order = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    this.orders.set(id, updated);
    return updated;
  }
}

export const orderStore = new OrderStore();
