import { createServer } from "http";
import { config } from "dotenv";
import app from "./app";
import { initializeWebSocketServer } from "./websocket/socketServer";

config();

const PORT = Number(process.env.PORT ?? 3000);
const httpServer = createServer(app);

initializeWebSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.warn(`User Management API running on http://localhost:${PORT}`);
});
