"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const orders_routes_1 = __importDefault(require("./routes/orders.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const notFoundHandler_1 = require("./middleware/notFoundHandler");
const authMiddleware_1 = require("./middleware/authMiddleware");
const app = (0, express_1.default)();
app.disable("x-powered-by");
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
app.use("/users", authMiddleware_1.authMiddleware, users_routes_1.default);
app.use("/api/users", authMiddleware_1.authMiddleware, users_routes_1.default);
app.use("/orders", authMiddleware_1.authMiddleware, orders_routes_1.default);
app.use("/api/orders", authMiddleware_1.authMiddleware, orders_routes_1.default);
// Test-only endpoint to exercise the 500 error path in the global error handler
if (process.env.NODE_ENV !== "production") {
    app.get("/debug/trigger-error", (_req, _res, next) => {
        next(new Error("Intentional test error"));
    });
}
app.use(notFoundHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map