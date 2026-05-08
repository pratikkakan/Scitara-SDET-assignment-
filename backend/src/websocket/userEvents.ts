import type { User } from "../types/user.types";
import {
  buildUserCreatedEventPayload,
  WebSocketEvent,
} from "./events";
import { webSocketEventEmitter } from "./eventEmitter";

export const userWebSocketPublisher = {
  emitUserCreated(user: User): void {
    webSocketEventEmitter.emit(
      WebSocketEvent.USER_CREATED,
      buildUserCreatedEventPayload(user),
    );
  },
};
