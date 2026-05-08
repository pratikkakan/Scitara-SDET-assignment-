import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";
import { AppError } from "../utils/appError";

type RequestProperty = "body" | "params" | "query";

export const validateRequest = (
  schema: ZodTypeAny,
  property: RequestProperty = "body",
): RequestHandler => {
  return (req, _res, next) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || property,
        message: issue.message,
      }));

      next(
        new AppError(
          "Validation failed",
          400,
          "VALIDATION_ERROR",
          details,
        ),
      );
      return;
    }

    (req as Record<RequestProperty, unknown>)[property] = result.data;
    next();
  };
};
