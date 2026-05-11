import { v4 as uuidv4 } from "uuid";
import type { User } from "../types/user.types";
import type { Order, OrderStatus } from "../types/order.types";

export const WebSocketEvent = {
  USER_CREATED: "USER_CREATED",
  ORDER_STATUS_CHANGED: "ORDER_STATUS_CHANGED",
} as const;

export type WebSocketEventName =
  (typeof WebSocketEvent)[keyof typeof WebSocketEvent];

export interface WebSocketEnvelope<TType extends WebSocketEventName, TData> {
  eventId: string;
  type: TType;
  occurredAt: string;
  data: TData;
}

export type UserCreatedEventPayload = WebSocketEnvelope<
  typeof WebSocketEvent.USER_CREATED,
  { user: User }
>;

export type OrderStatusChangedEventPayload = WebSocketEnvelope<
  typeof WebSocketEvent.ORDER_STATUS_CHANGED,
  { order: Order; previousStatus: OrderStatus }
>;

export interface WebSocketEventPayloadMap {
  USER_CREATED: UserCreatedEventPayload;
  ORDER_STATUS_CHANGED: OrderStatusChangedEventPayload;
}

export const buildUserCreatedEventPayload = (
  user: User,
): UserCreatedEventPayload => ({
  eventId: uuidv4(),
  type: WebSocketEvent.USER_CREATED,
  occurredAt: new Date().toISOString(),
  data: { user },
});

export const buildOrderStatusChangedEventPayload = (
  order: Order,
  previousStatus: OrderStatus,
): OrderStatusChangedEventPayload => ({
  eventId: uuidv4(),
  type: WebSocketEvent.ORDER_STATUS_CHANGED,
  occurredAt: new Date().toISOString(),
  data: { order, previousStatus },
});
