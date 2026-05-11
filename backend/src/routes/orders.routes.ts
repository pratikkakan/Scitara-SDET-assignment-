import { Router } from "express";
import { createOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/order.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateRequest } from "../middleware/validateRequest";
import { createOrderSchema, orderIdParamSchema, updateOrderStatusSchema } from "../validators/order.validator";

const router = Router();

router
  .route("/")
  .get(asyncHandler(getOrders))
  .post(validateRequest(createOrderSchema), asyncHandler(createOrder));

router
  .route("/:id")
  .get(validateRequest(orderIdParamSchema, "params"), asyncHandler(getOrderById));

router
  .route("/:id/status")
  .patch(
    validateRequest(orderIdParamSchema, "params"),
    validateRequest(updateOrderStatusSchema),
    asyncHandler(updateOrderStatus),
  );

export default router;
