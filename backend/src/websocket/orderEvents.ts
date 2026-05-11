import type { Order, OrderStatus } from "../types/order.types";
import { buildOrderStatusChangedEventPayload, WebSocketEvent } from "./events";
import { webSocketEventEmitter } from "./eventEmitter";

export const orderWebSocketPublisher = {
  emitOrderStatusChanged(order: Order, previousStatus: OrderStatus): void {
    webSocketEventEmitter.emit(
      WebSocketEvent.ORDER_STATUS_CHANGED,
      buildOrderStatusChangedEventPayload(order, previousStatus),
    );
  },
};
