import { z } from "zod";

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const nameSchema = z
  .string()
  .trim()
  .min(1, "This field is required")
  .max(100, "This field must be 100 characters or fewer");

const emailSchema = z
  .string()
  .trim()
  .email("Email must be valid")
  .max(255, "Email must be 255 characters or fewer");

const phoneSchema = z
  .string()
  .trim()
  .regex(phoneRegex, "Phone must be a valid international number");

export const createUserSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema.optional(),
  })
  .strict();

export const updateUserSchema = z
  .object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
    email: emailSchema.optional(),
    phone: phoneSchema.optional(),
  })
  .strict()
  .refine((payload) => Object.keys(payload).length > 0, {
    message: "At least one field must be provided for update",
  });

export const userIdParamSchema = z.object({
  id: z.string().uuid("User id must be a valid UUID"),
});
