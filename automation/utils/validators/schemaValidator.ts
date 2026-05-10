import Ajv, { ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
  useDefaults: true,
  removeAdditional: 'all',
  coerceTypes: true,
});
addFormats(ajv);

const validatorCache = new Map<string, ValidateFunction>();

function getValidator(schema: Record<string, unknown>): ValidateFunction {
  const key = JSON.stringify(schema);
  if (!validatorCache.has(key)) {
    validatorCache.set(key, ajv.compile(schema));
  }
  return validatorCache.get(key)!;
}

export function validateSchema(data: unknown, schema: Record<string, unknown>): boolean {
  return getValidator(schema)(data) as boolean;
}

export function getSchemaErrors(data: unknown, schema: Record<string, unknown>) {
  const validate = getValidator(schema);
  const isValid = validate(data);
  return { isValid, errors: validate.errors ?? [] };
}

export function assertSchemaValid(
  data: unknown,
  schema: Record<string, unknown>,
  schemaName = 'Schema',
): void {
  const { isValid, errors } = getSchemaErrors(data, schema);
  if (!isValid) {
    const details = errors
      .map((e) => `${e.instancePath || 'root'} ${e.message}`)
      .join('; ');
    throw new Error(`${schemaName} validation failed: ${details}`);
  }
}

export function validateResponseContract(
  response: { status: number; body: unknown },
  contract: { status: number; bodySchema: Record<string, unknown> },
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (response.status !== contract.status) {
    errors.push(`Expected status ${contract.status}, got ${response.status}`);
  }

  const { isValid, errors: schemaErrors } = getSchemaErrors(response.body, contract.bodySchema);
  if (!isValid) {
    schemaErrors.forEach((e) =>
      errors.push(`Body validation at ${e.instancePath}: ${e.message}`),
    );
  }

  return { isValid: errors.length === 0, errors };
}

export function validateRequestPayload(
  payload: unknown,
  schema: Record<string, unknown>,
  endpointName = 'Endpoint',
): void {
  assertSchemaValid(payload, schema, `${endpointName} Request Payload`);
}

export function createValidator<T>(schema: Record<string, unknown>) {
  return {
    validate: (data: unknown): data is T => validateSchema(data, schema),
    getErrors: (data: unknown) => getSchemaErrors(data, schema),
    assert: (data: unknown, name = 'Data') => assertSchemaValid(data, schema, name),
  };
}
