import type { Request, Response } from "express";
import { orderService } from "../services/order.service";
import type { CreateOrderInput, UpdateOrderStatusInput } from "../types/order.types";
import { sendCreated, sendOk } from "../utils/responseHandlers";

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const order = await orderService.createOrder(req.body as CreateOrderInput);
  sendCreated(res, order, `${req.baseUrl}/${order.id}`);
};

export const getOrders = async (_req: Request, res: Response): Promise<void> => {
  const orders = await orderService.getOrders();
  sendOk(res, orders);
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const order = await orderService.getOrderById(id);
  sendOk(res, order);
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const order = await orderService.updateOrderStatus(id, req.body as UpdateOrderStatusInput);
  sendOk(res, order);
};
