import { z } from "zod";
import { ORDER_STATUSES } from "../types/order.types";

const orderItemSchema = z.object({
  productId: z.string().min(1, "productId is required"),
  quantity: z.number().int().positive("quantity must be a positive integer"),
  price: z.number().nonnegative("price must be non-negative"),
});

export const createOrderSchema = z
  .object({
    userId: z.string().optional(),
    items: z.array(orderItemSchema).min(1, "At least one item is required"),
    total: z.number().nonnegative("total must be non-negative"),
  })
  .strict();

export const updateOrderStatusSchema = z
  .object({
    status: z.enum(ORDER_STATUSES, {
      errorMap: () => ({
        message: `status must be one of: ${ORDER_STATUSES.join(", ")}`,
      }),
    }),
  })
  .strict();

export const orderIdParamSchema = z.object({
  id: z.string().uuid("Order id must be a valid UUID"),
});
