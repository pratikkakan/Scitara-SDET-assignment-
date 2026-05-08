/**
 * Input validation schemas using Joi
 */

import Joi from "joi";

export const createUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).required().messages({
    "string.empty": "First name is required",
    "string.max": "First name must be less than 100 characters",
  }),
  lastName: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Last name is required",
    "string.max": "Last name must be less than 100 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Valid email is required",
    "any.required": "Email is required",
  }),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone must be a valid international number",
    }),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(1).max(100).optional(),
  lastName: Joi.string().min(1).max(100).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });
