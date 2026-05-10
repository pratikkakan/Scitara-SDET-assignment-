# Automation - Playwright Test Suite

## Overview
The automation suite is a comprehensive testing framework built with Playwright and TypeScript. It includes UI tests for the e-commerce application, API contract tests for the backend, and WebSocket integration tests. The suite uses the Page Object Model (POM) pattern for maintainable test code.

## Technology Stack
- **Framework:** Playwright 1.40.0
- **Language:** TypeScript 5.3.3
- **Test Runner:** Playwright Test
- **Validation:** AJV with formats for JSON schema validation
- **Reporting:** Playwright HTML and JUnit reports

## Project Structure
```
automation/
├── tests/
│   ├── ui/                              # UI automation tests
│   │   ├── product-listing.spec.ts      # Product list page tests
│   │   ├── product-details.spec.ts      # Product details page tests
│   │   ├── cart.spec.ts                 # Shopping cart tests
│   │   └── checkout.spec.ts             # Checkout flow tests
│   ├── api/                             # API integration tests
│   │   ├── users.crud.spec.ts           # User CRUD operations
│   │   └── users.contract.spec.ts       # API contract validation
│   └── websocket/                       # WebSocket event tests
│       └── users.websocket.spec.ts      # Real-time event testing
├── src/
│   └── pom/                             # Page Object Model
│       └── PageObjectManager.ts         # POM utility for page management
├── test-results/                        # Test execution reports
│   ├── results.json                     # Detailed test results
│   ├── junit.xml                        # JUnit format report
│   └── [test-name]/                     # Individual test artifacts
│       ├── video.webm                   # Test recording
│       ├── error-context.md             # Failure context
│       └── screenshot.png               # Screenshots
├── playwright.config.ts                 # Playwright configuration
├── package.json                         # Dependencies and scripts
├── tsconfig.json                        # TypeScript configuration
├── Dockerfile                           # Docker configuration
├── TEST_COVERAGE_SUMMARY.md             # Test coverage documentation
└── .env.example                         # Environment variables template
```

## Test Categories

### UI Tests (`tests/ui/`)
End-to-end tests for the e-commerce application frontend.

#### Product Listing (`product-listing.spec.ts`)
- Navigate to product listing page
- Display all products with correct information
- Filter products by category
- Search products
- Sort products by price/name
- Pagination functionality
- Add product to cart
- Empty state handling

#### Product Details (`product-details.spec.ts`)
- Navigate to product details page
- Display complete product information
- View product images/gallery
- View product specifications
- Add product with quantity selection
- View related products
- Navigate back to listing
- Out of stock handling

#### Cart (`cart.spec.ts`)
- Add items to cart
- View cart items
- Update item quantities
- Remove items from cart
- Calculate cart totals
- Apply discount codes
- Clear cart
- Empty cart message

#### Checkout (`checkout.spec.ts`)
- Navigate to checkout
- Enter shipping information
- Enter billing address
- Select payment method
- Review order summary
- Place order
- Order confirmation
- Payment validation

### API Tests (`tests/api/`)
Contract and integration tests for the REST API.

#### CRUD Operations (`users.crud.spec.ts`)
- Create user (POST /users)
- Read user (GET /users/:id)
- Read all users (GET /users)
- Update user (PATCH /users/:id)
- Delete user (DELETE /users/:id)
- Error handling (400, 404, 500)
- Data validation

#### Contract Testing (`users.contract.spec.ts`)
- Response schema validation using AJV
- Field type validation
- Required fields presence
- Data format compliance
- HTTP status code verification
- Header validation
- Error response format validation

### WebSocket Tests (`tests/websocket/`)
Real-time communication testing.

#### WebSocket Events (`users.websocket.spec.ts`)
- Connect to WebSocket server
- Subscribe to user events
- Receive real-time updates
- Handle connection errors
- Disconnect cleanly
- Message format validation
- Event broadcasting

## Getting Started

### Installation
```bash
cd automation
npm install
npx playwright install    # Install browser binaries
```

### Running Tests

#### All Tests
```bash
npm run test              # Run all tests
npm run test:headed       # Run with UI visible
npm run test:debug        # Debug mode with inspector
npm run test:ui-mode      # Interactive UI mode
```

#### Specific Test Suites
```bash
npm run test:ui           # Run only UI tests
npm run test:api          # Run only API tests
npm run test:websocket    # Run only WebSocket tests
```

#### Additional Commands
```bash
npm run test:report       # Show HTML test report
npm run lint              # Check code quality
npm run lint:fix          # Fix linting errors
npm run type-check        # TypeScript type checking
```

## Configuration

### playwright.config.ts
Key configurations:
- **Browsers:** Chromium, Firefox, WebKit
- **Baseurl:** Frontend application URL
- **Timeout:** Test and action timeouts
- **Retries:** Flaky test retry policy
- **Reports:** HTML, JUnit, JSON formats
- **Screenshots:** On failure
- **Video:** Recording for failed tests

### Environment Setup
Copy `.env.example` to `.env`:
```
API_BASE_URL=http://localhost:3000
WEB_BASE_URL=http://localhost:5173
WEBSOCKET_URL=ws://localhost:3000
HEADLESS=true
```

## Page Object Model (POM)

### PageObjectManager
Centralized management of page objects providing:
- Reusable page objects for each page
- Element selectors
- Common interactions (click, fill, navigate)
- Wait conditions
- Screenshot capture

### Benefits
- Maintainable test code
- Reusable components
- Abstraction of UI changes
- Easy test updates
- Better readability

## Test Reporting

### HTML Report
```bash
npm run test:report
```
Includes:
- Test execution timeline
- Pass/fail status
- Test duration
- Screenshots
- Video recordings
- Error logs

### JUnit Report
Generated at `test-results/junit.xml`
- CI/CD integration compatible
- Test metrics and statistics
- Failure details

### JSON Report
Generated at `test-results/results.json`
- Detailed test metadata
- Execution logs
- Performance metrics

## Development Scripts
- `npm run test` - Run all tests in headless mode
- `npm run test:api` - Run API tests only
- `npm run test:ui` - Run UI tests only
- `npm run test:websocket` - Run WebSocket tests
- `npm run test:headed` - Run tests with browser visible
- `npm run test:debug` - Debug tests with inspector
- `npm run test:ui-mode` - Interactive test runner UI
- `npm run test:report` - View HTML test report
- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Fix linting errors
- `npm run type-check` - TypeScript validation

## Best Practices

### Test Structure
- One test file per page/feature
- Descriptive test names
- Setup and teardown in beforeEach/afterEach
- Isolated and independent tests
- No test dependencies

### Selectors
- Use data-testid attributes when possible
- Fall back to semantic HTML selectors
- Avoid brittle CSS selectors
- Use role queries for accessibility

### Assertions
- Clear and specific assertions
- Multiple assertions per test when logical
- Use Playwright's built-in matchers
- Validate both presence and content

### Performance
- Use test parallelization
- Implement appropriate waits (avoid arbitrary sleeps)
- Use test retries for flaky tests
- Monitor test execution time

## Docker
A Dockerfile is included for containerization:
```bash
docker build -t automation .
docker run --network host automation npm run test
```

## Dependencies
- **@playwright/test** ^1.40.0 - Test framework
- **ajv** ^8.12.0 - JSON schema validation
- **ajv-formats** ^2.1.1 - Additional AJV formats
- **typescript** ^5.3.3 - Type support
- **dotenv** ^16.3.1 - Environment variables
- **eslint** ^8.54.0 - Code linting

## CI/CD Integration

### GitHub Actions / Jenkins
Test results are generated in standard formats:
- JUnit XML for CI integration
- JSON for parsing and analysis
- HTML for manual review

## Test Coverage
See [TEST_COVERAGE_SUMMARY.md](./automation/TEST_COVERAGE_SUMMARY.md) for detailed test coverage information including:
- Feature coverage matrix
- Critical paths tested
- Known gaps
- Coverage metrics

## Debugging

### Debug Mode
```bash
npm run test:debug
```

### Inspect Selector
```bash
npx playwright codegen http://localhost:5173
```

### View Videos
Failed tests automatically save videos in `test-results/`

### Screenshot Inspection
Manual and automatic screenshots available in test result artifacts

## Troubleshooting

### Tests Timing Out
- Increase timeout in playwright.config.ts
- Check application responsiveness
- Verify network connectivity

### Flaky Tests
- Add appropriate waits for dynamic content
- Use stable selectors
- Enable test retries
- Review test conditions

### Browser Issues
- Run `npx playwright install` to update browsers
- Check system dependencies
- Verify browser launch settings
