import type { Response } from "express";

export const sendOk = <T>(res: Response, data: T): Response => {
  return res.status(200).json(data);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  location?: string,
): Response => {
  if (location) {
    res.location(location);
  }

  return res.status(201).json(data);
};

export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};
