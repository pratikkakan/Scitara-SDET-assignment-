import { v4 as uuidv4 } from "uuid";
import type { User } from "../types/user.types";

export const WebSocketEvent = {
  USER_CREATED: "USER_CREATED",
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
  {
    user: User;
  }
>;

export interface WebSocketEventPayloadMap {
  USER_CREATED: UserCreatedEventPayload;
}

export const buildUserCreatedEventPayload = (
  user: User,
): UserCreatedEventPayload => ({
  eventId: uuidv4(),
  type: WebSocketEvent.USER_CREATED,
  occurredAt: new Date().toISOString(),
  data: {
    user,
  },
});
