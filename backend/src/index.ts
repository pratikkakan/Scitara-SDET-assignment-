/**
 * Backend server entry point
 */

import express from "express";
import cors from "cors";
import WebSocket from "ws";
import { config } from "dotenv";

config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// API routes placeholder
app.get("/api", (req, res) => {
  res.json({
    message: "User Management API",
    version: "v1",
    endpoints: {
      users: "/api/users",
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// WebSocket server
const WS_PORT = process.env.WS_PORT || 3001;
const wss = new WebSocket.Server({ port: Number(WS_PORT) });

wss.on("connection", (ws) => {
  console.log("✅ WebSocket client connected");

  ws.on("message", (message) => {
    console.log("📨 Received message:", message);
  });

  ws.on("close", () => {
    console.log("❌ WebSocket client disconnected");
  });
});

console.log(`✅ WebSocket server running on ws://localhost:${WS_PORT}`);
