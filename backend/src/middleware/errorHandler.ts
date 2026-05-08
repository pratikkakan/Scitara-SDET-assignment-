import type { ErrorRequestHandler } from "express";
import type { ApiErrorDetails } from "../types/api.types";
import { AppError } from "../utils/appError";

const buildErrorPayload = (
  message: string,
  code: string,
  path: string,
  details?: ApiErrorDetails,
) => ({
  success: false,
  error: {
    message,
    code,
    ...(details ? { details } : {}),
  },
  timestamp: new Date().toISOString(),
  path,
});

const isJsonSyntaxError = (
  error: unknown,
): error is SyntaxError & { body?: unknown } =>
  error instanceof SyntaxError && "body" in error;

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (isJsonSyntaxError(error)) {
    res.status(400).json(
      buildErrorPayload(
        "Malformed JSON body",
        "INVALID_JSON",
        req.originalUrl,
      ),
    );
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json(
      buildErrorPayload(
        error.message,
        error.code,
        req.originalUrl,
        error.details,
      ),
    );
    return;
  }

  console.error(error);
  res.status(500).json(
    buildErrorPayload(
      "An unexpected error occurred",
      "INTERNAL_SERVER_ERROR",
      req.originalUrl,
    ),
  );
};
