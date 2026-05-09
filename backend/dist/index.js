"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const dotenv_1 = require("dotenv");
const app_1 = __importDefault(require("./app"));
const socketServer_1 = require("./websocket/socketServer");
(0, dotenv_1.config)();
const PORT = Number(process.env.PORT ?? 3000);
const httpServer = (0, http_1.createServer)(app_1.default);
(0, socketServer_1.initializeWebSocketServer)(httpServer);
httpServer.listen(PORT, () => {
    console.warn(`User Management API running on http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map