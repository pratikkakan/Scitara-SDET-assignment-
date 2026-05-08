/**
 * Schema validation utilities using AJV
 */

import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

export function validateSchema(
  data: unknown,
  schema: Record<string, unknown>,
): boolean {
  const validate = ajv.compile(schema);
  return validate(data) as boolean;
}

export function getSchemaErrors(
  data: unknown,
  schema: Record<string, unknown>,
) {
  const validate = ajv.compile(schema);
  const isValid = validate(data);
  return {
    isValid,
    errors: validate.errors,
  };
}
