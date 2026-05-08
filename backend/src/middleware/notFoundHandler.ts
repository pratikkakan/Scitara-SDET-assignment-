import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(
    new AppError(
      `Route ${req.method} ${req.originalUrl} was not found`,
      404,
      "ROUTE_NOT_FOUND",
    ),
  );
};
