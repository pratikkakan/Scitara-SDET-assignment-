import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/user.controller";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateRequest } from "../middleware/validateRequest";
import {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
} from "../validators/user.validator";

const router = Router();

router
  .route("/")
  .get(asyncHandler(getUsers))
  .post(validateRequest(createUserSchema), asyncHandler(createUser));

router
  .route("/:id")
  .get(validateRequest(userIdParamSchema, "params"), asyncHandler(getUserById))
  .put(
    validateRequest(userIdParamSchema, "params"),
    validateRequest(updateUserSchema),
    asyncHandler(updateUser),
  )
  .delete(
    validateRequest(userIdParamSchema, "params"),
    asyncHandler(deleteUser),
  );

export default router;
