import type { Server as SocketIOServer } from "socket.io";
import type {
  WebSocketEventName,
  WebSocketEventPayloadMap,
} from "./events";

class WebSocketEventEmitter {
  private io: SocketIOServer | null = null;

  bind(io: SocketIOServer): void {
    this.io = io;
  }

  emit<EventName extends WebSocketEventName>(
    eventName: EventName,
    payload: WebSocketEventPayloadMap[EventName],
  ): void {
    if (!this.io) {
      console.warn(
        `Socket.IO server is not initialized. Skipping event ${eventName}.`,
      );
      return;
    }

    this.io.emit(eventName, payload);
  }
}

export const webSocketEventEmitter = new WebSocketEventEmitter();
