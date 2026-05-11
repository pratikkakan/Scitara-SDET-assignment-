"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const authMiddleware = (req, res, next) => {
    const apiToken = process.env.API_TOKEN;
    // If no token is configured on the server, auth is disabled
    if (!apiToken) {
        next();
        return;
    }
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            error: { message: "Missing or invalid Authorization header", code: "UNAUTHORIZED" },
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
        });
        return;
    }
    const token = authHeader.slice(7);
    if (token !== apiToken) {
        res.status(403).json({
            success: false,
            error: { message: "Invalid API token", code: "FORBIDDEN" },
            timestamp: new Date().toISOString(),
            path: req.originalUrl,
        });
        return;
    }
    next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map