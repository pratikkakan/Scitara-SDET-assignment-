/**
 * Backend Error Handler Middleware Template
 */

import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  status?: number;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[${status}] ${message}`);

  res.status(status).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
  });
}
