import type { Server as HttpServer } from "http";
import { Server as SocketIOServer, type Socket } from "socket.io";
import { webSocketEventEmitter } from "./eventEmitter";

let io: SocketIOServer | null = null;

const registerConnectionHandlers = (socket: Socket): void => {
  console.warn(`Socket.IO client connected: ${socket.id}`);

  socket.on("disconnect", (reason) => {
    console.warn(
      `Socket.IO client disconnected: ${socket.id} (${reason})`,
    );
  });
};

export const initializeWebSocketServer = (
  httpServer: HttpServer,
): SocketIOServer => {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", registerConnectionHandlers);
  webSocketEventEmitter.bind(io);

  return io;
};

export const getWebSocketServer = (): SocketIOServer | null => io;
