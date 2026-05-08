# Automation Framework - Test Strategy & Implementation Guide

## Overview

Enterprise-grade test automation using Playwright TypeScript with API, UI, and WebSocket testing.

## Quick Start

```bash
cd automation
npm install

# Run all tests
npm run test

# Run specific test suites
npm run test:api
npm run test:ui
npm run test:websocket
```

## Directory Structure

```
automation/
├── tests/
│   ├── api/                    # REST API tests
│   │   ├── users.spec.ts       # User CRUD tests
│   │   └── validation.spec.ts  # Input validation tests
│   ├── ui/                     # UI E2E tests
│   │   ├── productListing.spec.ts
│   │   ├── productDetails.spec.ts
│   │   ├── cart.spec.ts
│   │   └── checkout.spec.ts
│   └── websocket/              # WebSocket tests
│       └── websocket.spec.ts
├── pages/                      # Page Object Model
│   ├── BasePage.ts             # Base class
│   ├── ProductListingPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── utils/                      # Test utilities
│   ├── config.ts               # Configuration
│   ├── testHelpers.ts          # Common functions
│   └── schemaValidator.ts      # JSON Schema validation
├── fixtures/                   # Test data
│   ├── userTestData.ts         # User fixtures
│   ├── productTestData.ts      # Product fixtures
│   └── cartTestData.ts
├── schemas/                    # Response schemas
│   ├── user.schema.ts
│   ├── product.schema.ts
│   └── api.response.schema.ts
├── playwright.config.ts        # Playwright config
└── tsconfig.json
```

## Test Architecture

### 1. API Testing

**Location**: `tests/api/`

Tests for REST endpoints with:

- ✅ Happy path tests
- ✅ Negative tests (invalid input)
- ✅ Schema validation
- ✅ Status code verification
- ✅ Data-driven tests

```typescript
test("POST /users - Create user successfully", async ({ request }) => {
  const response = await request.post(`${apiUrl}/users`, {
    data: validUser,
  });

  expect(response.status()).toBe(201);
  const json = await response.json();
  expect(validateSchema(json, userSchema)).toBe(true);
});
```

### 2. UI Testing

**Location**: `tests/ui/`

Page Object Model for UI tests:

```typescript
// Page class
export class ProductListingPage extends BasePage {
  async addToCart(productIndex: number) {
    const buttons = await this.page.$$('[data-testid="add-to-cart"]');
    await buttons[productIndex].click();
  }
}

// Test
test("Add product to cart", async ({ page }) => {
  const listingPage = new ProductListingPage(page);
  await listingPage.goto("/products");
  await listingPage.addToCart(0);
  // Verify cart updated
});
```

### 3. WebSocket Testing

**Location**: `tests/websocket/`

Tests for real-time communication:

```typescript
test("Should receive user created event", async ({ browser, request }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  const events: string[] = [];

  page.on("websocket", (ws) => {
    ws.on("framesent", (frame) => {
      events.push(frame.payload as string);
    });
  });

  // Create user via API
  await request.post("/api/users", { data: newUser });

  // Wait for WebSocket event
  await page.waitForTimeout(2000);
  expect(events.length).toBeGreaterThan(0);
});
```

## Page Object Model

### BasePage Class

```typescript
export class BasePage {
  constructor(readonly page: Page) {}

  async goto(path: string) {
    await this.page.goto(path);
  }

  async click(selector: string) {
    await this.page.click(selector);
  }

  async getText(selector: string) {
    return await this.page.textContent(selector);
  }
}
```

### Page-Specific Classes

```typescript
export class CartPage extends BasePage {
  // Selectors
  private readonly cartItems = '[data-testid="cart-item"]';
  private readonly totalPrice = '[data-testid="total-price"]';

  // Actions
  async getCartItemCount() {
    const items = await this.page.$$eval(
      this.cartItems,
      (elements) => elements.length,
    );
    return items;
  }

  async getTotalPrice() {
    const text = await this.getText(this.totalPrice);
    return parseFloat(text || "0");
  }

  async removeItem(index: number) {
    const buttons = await this.page.$$('[data-testid="remove-btn"]');
    await buttons[index].click();
  }
}
```

## Data Management

### Fixtures vs Schemas

**Fixtures** (`fixtures/`): Test data

```typescript
// fixtures/userTestData.ts
export const validUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
};
```

**Schemas** (`schemas/`): Validation rules

```typescript
// schemas/user.schema.ts
export const userSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    email: { type: "string", format: "email" },
  },
  required: ["id", "email"],
};
```

## Schema Validation

Using AJV for response validation:

```typescript
import { validateSchema } from "@/utils/schemaValidator";
import { userSchema } from "@/schemas/user.schema";

const response = await request.get("/api/users/1");
const json = await response.json();

expect(validateSchema(json, userSchema)).toBe(true);
```

## Playwright Configuration

Key settings in `playwright.config.ts`:

```typescript
{
  testDir: './tests',
  timeout: 30000,
  retries: 2,                    // Retry flaky tests
  workers: 1,                    // Serial in CI
  fullyParallel: true,           // Parallel in local
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',     // Collect traces
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  }
}
```

## Test Execution

### Run All Tests

```bash
npm run test
```

### Run Specific Suite

```bash
npm run test:api          # API tests only
npm run test:ui           # UI tests only
npm run test:websocket    # WebSocket tests only
```

### Different Modes

```bash
npm run test:headed       # See browser window
npm run test:debug        # Debug mode with step-through
npm run test:ui-mode      # Playwright UI mode
npm run test:report       # Show HTML report
```

### Run Single File

```bash
npx playwright test tests/api/users.spec.ts
```

### Run with Filter

```bash
npx playwright test -g "Create user"  # Tests matching pattern
```

## Best Practices

### 1. Test Organization

```typescript
test.describe("User API", () => {
  test.describe("CRUD Operations", () => {
    test("should create user", async () => {});
    test("should read user", async () => {});
    test("should update user", async () => {});
    test("should delete user", async () => {});
  });
});
```

### 2. Assertion Patterns

```typescript
// Good: Clear, specific assertions
expect(response.status()).toBe(201);
expect(json.email).toBe(validUser.email);

// Avoid: Vague assertions
expect(response.ok()).toBe(true);
```

### 3. Test Data

```typescript
// Good: Use fixtures
import { validUser } from '@/fixtures/userTestData'

// Avoid: Inline test data
const user = { firstName: 'John', ... }
```

### 4. Retry Logic

```typescript
import { retry } from "@/utils/testHelpers";

// For flaky operations
const result = await retry(
  () => request.get("/api/users"),
  3, // retries
  1000, // delay
);
```

## Debugging

### Enable Trace

```typescript
test("debug test", async ({ page }, testInfo) => {
  await page.context().tracing.start({ screenshots: true });

  // Test code

  await page.context().tracing.stop({
    path: `trace-${testInfo.title}.zip`,
  });
});
```

### Browser Console Logs

```typescript
page.on("console", (msg) => {
  console.log(`Browser log: ${msg.text()}`);
});
```

### Screenshots

```typescript
await page.screenshot({ path: "screenshot.png" });
```

## CI/CD Integration

Configure for GitHub Actions:

```yaml
- name: Run tests
  run: npm run test --workspace=automation

- name: Upload report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: automation/playwright-report/
```

## Environment Variables

See `.env.example`:

```
API_BASE_URL=http://localhost:3000
WS_URL=ws://localhost:3001
BROWSER=chromium
HEADLESS=true
```

## Test Coverage Goals

- **API**: 100% endpoint coverage
- **UI**: Happy path + critical flows
- **WebSocket**: Connection + event validation
- **Negative Tests**: Invalid inputs, edge cases
- **Schema Validation**: All responses validated

## Available Scripts

```bash
npm run test              # Run all tests
npm run test:api          # API tests
npm run test:ui           # UI tests
npm run test:websocket    # WebSocket tests
npm run test:headed       # Show browser
npm run test:debug        # Debug mode
npm run test:ui-mode      # Playwright UI
npm run test:report       # View report
npm run lint              # ESLint
npm run type-check        # TypeScript check
```

## Next Steps

1. Expand test cases
2. Add data-driven tests
3. Implement performance testing
4. Add accessibility tests
5. Configure visual regression
6. Set up parallel execution
7. Implement custom reporters
