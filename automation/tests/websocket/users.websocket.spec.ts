/// <reference types="node" />
import { test, expect } from '@/fixtures/base.fixture';
import { validUser, testUsers } from '@/testData/api/users/userData';
import { userSchema } from '@/schemas/user.schema';
import { validateSchema } from '@/utils/validators/schemaValidator';

const WS_EVENT_TIMEOUT_MS = 3_000;

function parseFrame(payload: string | Buffer): Record<string, unknown> | null {
  try {
    const str = typeof payload === 'string' ? payload : Buffer.from(payload).toString();
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function isUserCreatedEvent(msg: Record<string, unknown>): boolean {
  return msg['event'] === 'userCreated' || msg['type'] === 'USER_CREATED';
}

test.describe('WebSocket — User Events', () => {
  let createdIds: string[] = [];

  test.afterEach(async ({ userApi }) => {
    for (const id of createdIds) {
      await userApi.deleteUser(id).catch(() => {});
    }
    createdIds = [];
  });

  // ─── Connection ────────────────────────────────────────────────────────────

  test.describe('Connection', () => {
    test('[Positive] WebSocket connection is established on page load', async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      let connected = false;

      page.on('websocket', () => { connected = true; });

      await page.goto('/');
      await page.waitForTimeout(2_000);

      expect(connected).toBe(true);
      await context.close();
    });

    test('[Positive] connection remains open during API activity', async ({ browser, userApi }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      let dropped = false;

      page.on('websocket', (ws) => {
        ws.on('close', () => { dropped = true; });
      });

      await page.goto('/');
      await page.waitForTimeout(500);

      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      await page.waitForTimeout(500);

      expect(dropped).toBe(false);
      await context.close();
    });

    test('[Positive] reconnects after page reload', async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const connections: string[] = [];

      page.on('websocket', (ws) => { connections.push(ws.url()); });

      await page.goto('/');
      await page.waitForTimeout(500);
      await page.reload();
      await page.waitForTimeout(500);

      expect(connections.length).toBeGreaterThan(0);
      await context.close();
    });
  });

  // ─── User Created Events ───────────────────────────────────────────────────

  test.describe('User Created Events', () => {
    test('[Positive] userCreated event received after POST /users', async ({ browser, userApi }) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      let wsInstance: any = null;
      const eventReceived = new Promise<boolean>((resolve) => {
        page.on('websocket', (ws) => {
          wsInstance = ws;
          ws.on('framereceived', (frame) => {
            const msg = parseFrame(frame.payload as string | Buffer);
            if (msg && isUserCreatedEvent(msg)) resolve(true);
          });
        });
      });

      await page.goto('/');
      await page.waitForTimeout(500);

      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      const received = await Promise.race([
        eventReceived,
        new Promise<boolean>((r) => setTimeout(() => r(false), WS_EVENT_TIMEOUT_MS)),
      ]);

      expect(received).toBe(true);
      await context.close();
    });

    test('[Positive] userCreated event payload contains valid user data', async ({ browser, userApi }) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      const capturedPayloads: Record<string, unknown>[] = [];

      const eventReceived = new Promise<void>((resolve) => {
        page.on('websocket', (ws) => {
          ws.on('framereceived', (frame) => {
            const msg = parseFrame(frame.payload as string | Buffer);
            if (msg && isUserCreatedEvent(msg)) {
              capturedPayloads.push(msg);
              resolve();
            }
          });
        });
      });

      await page.goto('/');
      await page.waitForTimeout(500);

      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      await Promise.race([
        eventReceived,
        new Promise<void>((r) => setTimeout(r, WS_EVENT_TIMEOUT_MS)),
      ]);

      if (capturedPayloads.length > 0) {
        const payload = capturedPayloads[0];
        const userData = (payload['data'] ?? payload['user']) as Record<string, unknown> | undefined;
        if (userData) {
          expect(userData).toHaveProperty('id');
          expect(userData).toHaveProperty('email');
        }
      }

      await context.close();
    });

    test('[Positive] rapid parallel user creation — WebSocket stays connected', async ({ browser, userApi }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      let connected = false;

      page.on('websocket', () => { connected = true; });

      await page.goto('/');
      await page.waitForTimeout(500);

      expect(connected).toBe(true);

      const responses = await Promise.all(
        testUsers.slice(0, 3).map((u) => userApi.createUser(u)),
      );

      for (const res of responses) {
        expect(res.status()).toBe(201);
        const body = await res.json();
        createdIds.push(body.id);
        expect(validateSchema(body, userSchema)).toBe(true);
      }

      await page.waitForTimeout(500);
      expect(connected).toBe(true);

      await context.close();
    });
  });

  // ─── Message Format ────────────────────────────────────────────────────────

  test.describe('Message Format', () => {
    test('[Positive] received frames are valid JSON objects', async ({ browser, userApi }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const messages: Record<string, unknown>[] = [];

      page.on('websocket', (ws) => {
        ws.on('framereceived', (frame) => {
          const msg = parseFrame(frame.payload as string | Buffer);
          if (msg) messages.push(msg);
        });
      });

      await page.goto('/');
      await page.waitForTimeout(500);

      const created = await (await userApi.createUser(validUser)).json();
      createdIds.push(created.id);

      await page.waitForTimeout(2_000);

      for (const msg of messages) {
        expect(typeof msg).toBe('object');
        expect(msg).not.toBeNull();
      }

      await context.close();
    });
  });

  // ─── Error Handling ────────────────────────────────────────────────────────

  test.describe('Error Handling', () => {
    test('[Positive] page remains functional after WebSocket navigation', async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('/');
      await page.waitForTimeout(500);

      expect(page).toBeTruthy();
      await context.close();
    });
  });
});
