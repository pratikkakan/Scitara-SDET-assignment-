import type { Request, Response } from "express";
import { userService } from "../services/user.service";
import type { CreateUserInput, UpdateUserInput } from "../types/user.types";
import {
  sendCreated,
  sendNoContent,
  sendOk,
} from "../utils/responseHandlers";

export const createUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user = await userService.createUser(req.body as CreateUserInput);
  sendCreated(res, user, `${req.baseUrl}/${user.id}`);
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  const users = await userService.getUsers();
  sendOk(res, users);
};

export const getUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  sendOk(res, user);
};

export const updateUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  const user = await userService.updateUser(id, req.body as UpdateUserInput);
  sendOk(res, user);
};

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  await userService.deleteUser(id);
  sendNoContent(res);
};
