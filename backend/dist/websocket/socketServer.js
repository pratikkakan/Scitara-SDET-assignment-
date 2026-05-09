"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebSocketServer = exports.initializeWebSocketServer = void 0;
const socket_io_1 = require("socket.io");
const eventEmitter_1 = require("./eventEmitter");
let io = null;
const registerConnectionHandlers = (socket) => {
    console.warn(`Socket.IO client connected: ${socket.id}`);
    socket.on("disconnect", (reason) => {
        console.warn(`Socket.IO client disconnected: ${socket.id} (${reason})`);
    });
};
const initializeWebSocketServer = (httpServer) => {
    if (io) {
        return io;
    }
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", registerConnectionHandlers);
    eventEmitter_1.webSocketEventEmitter.bind(io);
    return io;
};
exports.initializeWebSocketServer = initializeWebSocketServer;
const getWebSocketServer = () => io;
exports.getWebSocketServer = getWebSocketServer;
//# sourceMappingURL=socketServer.js.map