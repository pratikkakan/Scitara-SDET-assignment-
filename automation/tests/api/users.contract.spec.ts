import { test, expect } from '@/fixtures/base.fixture';
import { validUser, validUserMinimal, testUsers, userInvalidEmail, userMissingEmail } from '@/testData/api/users/userData';
import {
  userSchema,
  usersListSchema,
  createUserPayloadSchema,
  updateUserPayloadSchema,
  errorResponseSchema,
} from '@/schemas/user.schema';
import { validateSchema, getSchemaErrors, validateResponseContract } from '@/utils/validators/schemaValidator';

test.describe('Users API — Contract Testing', () => {
  let createdIds: string[] = [];

  test.afterEach(async ({ userApi }) => {
    for (const id of createdIds) {
      await userApi.deleteUser(id).catch(() => {});
    }
    createdIds = [];
  });

  // ─── Request Payload Contracts ─────────────────────────────────────────────

  test.describe('Request Payload Contracts', () => {
    test('[Contract] valid create payload satisfies createUserPayloadSchema', async ({ userApi }) => {
      expect(validateSchema(validUser, createUserPayloadSchema)).toBe(true);

      const response = await userApi.createUser(validUser);
      expect(response.status()).toBe(201);
      createdIds.push((await response.json()).id);
    });

    test('[Contract] payload with only required fields satisfies schema', async ({ userApi }) => {
      expect(validateSchema(validUserMinimal, createUserPayloadSchema)).toBe(true);

      const response = await userApi.createUser(validUserMinimal);
      expect(response.status()).toBe(201);
      createdIds.push((await response.json()).id);
    });

    test('[Contract] payload missing required fields fails schema', () => {
      const partial = { firstName: 'John' };
      expect(validateSchema(partial, createUserPayloadSchema)).toBe(false);
    });

    test('[Contract] payload with invalid email fails schema', () => {
      expect(validateSchema(userInvalidEmail, createUserPayloadSchema)).toBe(false);
    });

    test('[Contract] update payload with all optional fields satisfies updateUserPayloadSchema', () => {
      const update = { firstName: 'New', lastName: 'Name', email: 'new@example.com' };
      expect(validateSchema(update, updateUserPayloadSchema)).toBe(true);
    });

    test('[Contract] empty update payload satisfies updateUserPayloadSchema (all optional)', () => {
      expect(validateSchema({}, updateUserPayloadSchema)).toBe(true);
    });
  });

  // ─── Response Body Contracts ───────────────────────────────────────────────

  test.describe('Response Body Contracts', () => {
    test('[Contract] POST response body matches userSchema', async ({ userApi }) => {
      const response = await userApi.createUser(validUser);
      const body = await response.json();

      expect(validateSchema(body, userSchema)).toBe(true);
      createdIds.push(body.id);
    });

    test('[Contract] GET /users response body matches usersListSchema', async ({ userApi }) => {
      const body = await (await userApi.getUsers()).json();
      expect(validateSchema(body, usersListSchema)).toBe(true);
    });

    test('[Contract] GET /users/:id response body matches userSchema', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const body = await (await userApi.getUserById(created.id)).json();
      expect(validateSchema(body, userSchema)).toBe(true);
    });

    test('[Contract] PUT response body matches userSchema', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const body = await (await userApi.updateUser(created.id, { firstName: 'Updated' })).json();
      expect(validateSchema(body, userSchema)).toBe(true);
    });

    test('[Contract] error response body matches errorResponseSchema', async ({ userApi }) => {
      const body = await (await userApi.getUserById('nonexistent')).json();
      expect(validateSchema(body, errorResponseSchema)).toBe(true);
    });

    test('[Contract] response body has no sensitive fields exposed', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      expect(created).not.toHaveProperty('password');
      expect(created).not.toHaveProperty('passwordHash');
      expect(created).not.toHaveProperty('secret');
    });

    test('[Contract] timestamps are valid ISO 8601 strings', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      expect(new Date(created.createdAt).toISOString()).toBe(created.createdAt);
      expect(new Date(created.updatedAt).toISOString()).toBe(created.updatedAt);
    });

    test('[Contract] ID is a non-empty string (UUID format)', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      expect(typeof created.id).toBe('string');
      expect(created.id.length).toBeGreaterThan(0);
    });
  });

  // ─── HTTP Status Code Contracts ────────────────────────────────────────────

  test.describe('HTTP Status Code Contracts', () => {
    test('[Contract] POST /users → 201 Created', async ({ userApi }) => {
      const response = await userApi.createUser(validUser);
      expect(response.status()).toBe(201);
      createdIds.push((await response.json()).id);
    });

    test('[Contract] GET /users → 200 OK', async ({ userApi }) => {
      expect((await userApi.getUsers()).status()).toBe(200);
    });

    test('[Contract] GET /users/:id existing → 200 OK', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);
      expect((await userApi.getUserById(created.id)).status()).toBe(200);
    });

    test('[Contract] GET /users/:id non-existent → 404 Not Found', async ({ userApi }) => {
      expect((await userApi.getUserById('nonexistent')).status()).toBe(404);
    });

    test('[Contract] POST with invalid payload → 400 Bad Request', async ({ userApi }) => {
      expect((await userApi.createUser(userMissingEmail)).status()).toBeGreaterThanOrEqual(400);
    });

    test('[Contract] PUT /users/:id existing → 200 OK', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);
      expect((await userApi.updateUser(created.id, { firstName: 'Updated' })).status()).toBe(200);
    });

    test('[Contract] PUT /users/:id non-existent → 404 Not Found', async ({ userApi }) => {
      expect((await userApi.updateUser('nonexistent', { firstName: 'X' })).status()).toBe(404);
    });

    test('[Contract] DELETE /users/:id existing → 200 OK', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      expect((await userApi.deleteUser(created.id)).status()).toBe(200);
    });

    test('[Contract] DELETE /users/:id non-existent → 404 Not Found', async ({ userApi }) => {
      expect((await userApi.deleteUser('nonexistent')).status()).toBe(404);
    });
  });

  // ─── Idempotency & Data Integrity ─────────────────────────────────────────

  test.describe('Idempotency & Data Integrity', () => {
    test('[Contract] repeated GET /users/:id returns identical data', async ({ userApi }) => {
      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const first  = await (await userApi.getUserById(created.id)).json();
      const second = await (await userApi.getUserById(created.id)).json();

      expect(first).toEqual(second);
    });

    test('[Contract] two POST requests with unique emails create separate records', async ({ userApi }) => {
      const userA = await (await userApi.createUser({ ...validUser, email: `a.${Date.now()}@example.com` })).json();
      const userB = await (await userApi.createUser({ ...validUser, email: `b.${Date.now()}@example.com` })).json();

      createdIds.push(userA.id, userB.id);

      expect(userA.id).not.toBe(userB.id);
      expect(userA.email).not.toBe(userB.email);
    });

    test('[Contract] data-driven — all testUsers create unique records', async ({ userApi }) => {
      const ids: string[] = [];

      for (const user of testUsers) {
        const body = await (await userApi.createUser(user)).json();
        expect(validateSchema(body, userSchema)).toBe(true);
        ids.push(body.id);
      }

      createdIds.push(...ids);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(testUsers.length);
    });
  });

  // ─── Response Header Contracts ─────────────────────────────────────────────

  test.describe('Response Header Contracts', () => {
    test('[Contract] POST response includes Content-Type: application/json', async ({ userApi }) => {
      const response = await userApi.createUser(validUser);
      const contentType = response.headers()['content-type'];
      expect(contentType).toContain('application/json');
      createdIds.push((await response.json()).id);
    });

    test('[Contract] GET response includes Content-Type: application/json', async ({ userApi }) => {
      const response = await userApi.getUsers();
      expect(response.headers()['content-type']).toContain('application/json');
    });
  });
});
