/**
 * Common test utilities
 */

import { test as base, expect, Page } from "@playwright/test";

/**
 * Custom test fixture with utilities
 */
export const test = base.extend({
  // Add custom fixtures here as needed
});

/**
 * Wait for network idle
 */
export async function waitForNetworkIdle(page: Page) {
  await page.waitForLoadState("networkidle");
}

/**
 * Retry logic for flaky operations
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000,
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error("Retry failed");
}

export { expect };
