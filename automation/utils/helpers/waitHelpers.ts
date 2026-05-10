import { Locator, Page } from '@playwright/test';

export async function waitForNetworkIdle(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
}

export async function waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
  await locator.waitFor({ state: 'visible', timeout });
}

export async function waitForHidden(locator: Locator, timeout = 10_000): Promise<void> {
  await locator.waitFor({ state: 'hidden', timeout });
}

export async function waitForPageLoad(page: Page): Promise<void> {
  await page.waitForLoadState('domcontentloaded');
}
