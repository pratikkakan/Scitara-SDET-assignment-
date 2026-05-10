/**
 * Playwright Fixtures - PageManager fixture
 * Extend Playwright test with pageManager property
 */

import { test as base, Page } from "@playwright/test";
import { PageManager } from "@/pages";

export type TestFixtures = {
  pageManager: PageManager;
};

export const test = base.extend<TestFixtures>({
  pageManager: async ({ page }, use) => {
    const pageManager = new PageManager(page);
    await use(pageManager);
    // Cleanup
    pageManager.resetBrowserState();
  },
});

export { expect } from "@playwright/test";
