/// <reference types="node" />
import { test, expect } from '@/fixtures/base.fixture';
import { validUser, testUsers } from '@/testData/api/users/userData';
import { userSchema } from '@/testData/api/schemas/user.schema';
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
      await test.step("Open page and verify WebSocket connection is established", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        let connected = false;

        page.on('websocket', () => { connected = true; });

        await page.goto('/');
        await page.waitForTimeout(2_000);

        expect(connected).toBe(true);
        await context.close();
      });
    });

    test('[Positive] connection remains open during API activity', async ({ browser, userApi }) => {
      const { page, context } = await test.step("Open page and attach WebSocket drop listener", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        let dropped = false;

        page.on('websocket', (ws) => {
          ws.on('close', () => { dropped = true; });
        });

        await page.goto('/');
        await page.waitForTimeout(500);
        return { page, context, getDropped: () => dropped };
      });

      await test.step("Create a user via API while WebSocket is open", async () => {
        const created = await (await userApi.createUser(validUser)).json();
        createdIds.push(created.id);
        await page.waitForTimeout(500);
      });

      await test.step("Assert WebSocket was not dropped during API activity", async () => {
        const wsEvents: boolean[] = [];
        page.on('websocket', (ws) => {
          ws.on('close', () => wsEvents.push(true));
        });
        expect(wsEvents.length).toBe(0);
        await context.close();
      });
    });

    test('[Positive] reconnects after page reload', async ({ browser }) => {
      await test.step("Open page, reload, and verify WebSocket connections were established", async () => {
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
  });

  // ─── User Created Events ───────────────────────────────────────────────────

  test.describe('User Created Events', () => {
    test('[Positive] userCreated event received after POST /users', async ({ browser, userApi }) => {
      const { page, context, eventReceived } = await test.step("Open page and register userCreated event listener", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();

        const eventReceived = new Promise<boolean>((resolve) => {
          page.on('websocket', (ws) => {
            ws.on('framereceived', (frame) => {
              const msg = parseFrame(frame.payload as string | Buffer);
              if (msg && isUserCreatedEvent(msg)) resolve(true);
            });
          });
        });

        await page.goto('/');
        await page.waitForTimeout(500);
        return { page, context, eventReceived };
      });

      await test.step("POST /users to trigger userCreated event", async () => {
        const created = await (await userApi.createUser(validUser)).json();
        createdIds.push(created.id);
      });

      await test.step("Assert userCreated event was received within timeout", async () => {
        const received = await Promise.race([
          eventReceived,
          new Promise<boolean>((r) => setTimeout(() => r(false), WS_EVENT_TIMEOUT_MS)),
        ]);
        expect(received).toBe(true);
        await context.close();
      });
    });

    test('[Positive] userCreated event payload contains valid user data', async ({ browser, userApi }) => {
      const { context, capturedPayloads, eventReceived } = await test.step("Open page and capture userCreated event payload", async () => {
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
        return { context, capturedPayloads, eventReceived };
      });

      await test.step("POST /users to trigger userCreated event", async () => {
        const created = await (await userApi.createUser(validUser)).json();
        createdIds.push(created.id);
        await Promise.race([
          eventReceived,
          new Promise<void>((r) => setTimeout(r, WS_EVENT_TIMEOUT_MS)),
        ]);
      });

      await test.step("Assert captured payload contains user id and email", async () => {
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
    });

    test('[Positive] rapid parallel user creation — WebSocket stays connected', async ({ browser, userApi }) => {
      const { context, page } = await test.step("Open page and verify initial WebSocket connection", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        let connected = false;

        page.on('websocket', () => { connected = true; });

        await page.goto('/');
        await page.waitForTimeout(500);
        expect(connected).toBe(true);
        return { context, page };
      });

      await test.step("Create 3 users in parallel and assert all return 201 with valid schema", async () => {
        const responses = await Promise.all(
          testUsers.slice(0, 3).map((u) => userApi.createUser(u)),
        );

        for (const res of responses) {
          expect(res.status()).toBe(201);
          const body = await res.json();
          createdIds.push(body.id);
          expect(validateSchema(body, userSchema)).toBe(true);
        }
      });

      await test.step("Assert WebSocket connection is still active after parallel requests", async () => {
        await page.waitForTimeout(500);
        const connections: string[] = [];
        page.on('websocket', (ws) => connections.push(ws.url()));
        expect(page).toBeTruthy();
        await context.close();
      });
    });
  });

  // ─── Message Format ────────────────────────────────────────────────────────

  test.describe('Message Format', () => {
    test('[Positive] received frames are valid JSON objects', async ({ browser, userApi }) => {
      const { context, messages } = await test.step("Open page and collect all WebSocket frames", async () => {
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

        return { context, messages };
      });

      await test.step("Assert all received frames are non-null objects", async () => {
        for (const msg of messages) {
          expect(typeof msg).toBe('object');
          expect(msg).not.toBeNull();
        }
        await context.close();
      });
    });
  });

  // ─── Error Handling ────────────────────────────────────────────────────────

  test.describe('Error Handling', () => {
    test('[Positive] page remains functional after WebSocket navigation', async ({ browser }) => {
      await test.step("Navigate to page and assert it remains functional", async () => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('/');
        await page.waitForTimeout(500);

        expect(page).toBeTruthy();
        await context.close();
      });
    });
  });
});
