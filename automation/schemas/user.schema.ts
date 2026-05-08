/**
 * User API schemas for validation
 */

export const userSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    firstName: { type: "string", minLength: 1, maxLength: 100 },
    lastName: { type: "string", minLength: 1, maxLength: 100 },
    email: { type: "string", format: "email" },
    phone: { type: "string", pattern: "^\\+?[1-9]\\d{1,14}$" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: ["id", "firstName", "lastName", "email", "createdAt", "updatedAt"],
};

export const usersListSchema = {
  type: "array",
  items: userSchema,
};

export const createUserPayloadSchema = {
  type: "object",
  properties: {
    firstName: { type: "string", minLength: 1, maxLength: 100 },
    lastName: { type: "string", minLength: 1, maxLength: 100 },
    email: { type: "string", format: "email" },
    phone: { type: "string", pattern: "^\\+?[1-9]\\d{1,14}$" },
  },
  required: ["firstName", "lastName", "email"],
  additionalProperties: false,
};
