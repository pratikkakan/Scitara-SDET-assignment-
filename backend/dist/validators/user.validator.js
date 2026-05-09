"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdParamSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const nameSchema = zod_1.z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(100, "This field must be 100 characters or fewer");
const emailSchema = zod_1.z
    .string()
    .trim()
    .email("Email must be valid")
    .max(255, "Email must be 255 characters or fewer");
const phoneSchema = zod_1.z
    .string()
    .trim()
    .regex(phoneRegex, "Phone must be a valid international number");
exports.createUserSchema = zod_1.z
    .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema.optional(),
})
    .strict();
exports.updateUserSchema = zod_1.z
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
exports.userIdParamSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("User id must be a valid UUID"),
});
//# sourceMappingURL=user.validator.js.map