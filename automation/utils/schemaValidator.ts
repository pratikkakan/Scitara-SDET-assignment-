/**
 * Schema validation utilities using AJV
 * Supports contract testing and response validation
 */

import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({
  useDefaults: true,
  removeAdditional: "all",
  coerceTypes: true,
});

addFormats(ajv);

// Cache compiled validators
const validatorCache = new Map<string, ValidateFunction>();

/**
 * Compile and cache validator
 */
function getValidator(schema: Record<string, unknown>): ValidateFunction {
  const schemaKey = JSON.stringify(schema);

  if (!validatorCache.has(schemaKey)) {
    validatorCache.set(schemaKey, ajv.compile(schema));
  }

  return validatorCache.get(schemaKey)!;
}

/**
 * Validate data against schema
 */
export function validateSchema(
  data: unknown,
  schema: Record<string, unknown>,
): boolean {
  const validate = getValidator(schema);
  return validate(data) as boolean;
}

/**
 * Validate and return detailed error information
 */
export function getSchemaErrors(
  data: unknown,
  schema: Record<string, unknown>,
) {
  const validate = getValidator(schema);
  const isValid = validate(data);
  return {
    isValid,
    errors: validate.errors || [],
    data,
  };
}

/**
 * Assert schema validation with detailed error messaging
 */
export function assertSchemaValid(
  data: unknown,
  schema: Record<string, unknown>,
  schemaName: string = "Schema",
): void {
  const result = getSchemaErrors(data, schema);

  if (!result.isValid) {
    const errorMessages = result.errors
      .map((err) => `${err.instancePath || "root"} ${err.message}`)
      .join("; ");

    throw new Error(`${schemaName} validation failed: ${errorMessages}`);
  }
}

/**
 * Validate HTTP response contract
 * Checks both status code and response body schema
 */
export function validateResponseContract(
  response: {
    status: number;
    body: unknown;
  },
  contract: {
    status: number;
    bodySchema: Record<string, unknown>;
  },
  contractName: string = "Response Contract",
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (response.status !== contract.status) {
    errors.push(`Expected status ${contract.status}, got ${response.status}`);
  }

  const schemaValidation = getSchemaErrors(response.body, contract.bodySchema);
  if (!schemaValidation.isValid) {
    schemaValidation.errors.forEach((err) => {
      errors.push(
        `Response body validation failed at ${err.instancePath}: ${err.message}`,
      );
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate request payload before sending
 */
export function validateRequestPayload(
  payload: unknown,
  schema: Record<string, unknown>,
  endpointName: string = "Endpoint",
): void {
  assertSchemaValid(payload, schema, `${endpointName} Request Payload`);
}

/**
 * Type-safe schema validation with TypeScript support
 */
export function createValidator<T>(schema: Record<string, unknown>) {
  return {
    validate: (data: unknown): data is T => {
      return validateSchema(data, schema);
    },
    getErrors: (data: unknown) => {
      return getSchemaErrors(data, schema);
    },
    assert: (data: unknown, name: string = "Data") => {
      assertSchemaValid(data, schema, name);
    },
  };
}
