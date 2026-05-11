"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderStore = void 0;
class OrderStore {
    constructor() {
        this.orders = new Map();
    }
    getAll() {
        return Array.from(this.orders.values());
    }
    getById(id) {
        return this.orders.get(id);
    }
    create(order) {
        this.orders.set(order.id, order);
        return order;
    }
    update(id, patch) {
        const existing = this.orders.get(id);
        if (!existing)
            return undefined;
        const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
        this.orders.set(id, updated);
        return updated;
    }
}
exports.orderStore = new OrderStore();
//# sourceMappingURL=orderStore.js.map