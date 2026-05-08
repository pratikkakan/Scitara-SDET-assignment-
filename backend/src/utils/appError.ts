import type { ApiErrorDetails } from "../types/api.types";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly code = "INTERNAL_SERVER_ERROR",
    public readonly details?: ApiErrorDetails,
  ) {
    super(message);
    this.name = "AppError";
  }
}
