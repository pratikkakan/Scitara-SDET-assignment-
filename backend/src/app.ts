import cors from "cors";
import express from "express";
import usersRouter from "./routes/users.routes";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { authMiddleware } from "./middleware/authMiddleware";

const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    name: "User Management API",
    version: "1.0.0",
    endpoints: {
      users: "/users",
      compatibleUsers: "/api/users",
      health: "/health",
      socketIo: "/socket.io",
    },
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.use("/users", authMiddleware, usersRouter);
app.use("/api/users", authMiddleware, usersRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
