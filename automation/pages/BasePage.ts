/**
 * Page Object Model - Base Page class
 * All pages inherit from this base class with common utilities
 */

import { Page, Locator, expect } from "@playwright/test";

export class BasePage {
  readonly page: Page;
  protected defaultTimeout = 5000;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async goto(path: string) {
    await this.page.goto(path);
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }

  async goBack() {
    await this.page.goBack();
  }

  // Waits
  async waitForElement(
    selector: string,
    timeout: number = this.defaultTimeout,
  ) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async waitForNavigation() {
    await this.page.waitForNavigation();
  }

  async waitForURL(url: RegExp | string, timeout = this.defaultTimeout) {
    await this.page.waitForURL(url, { timeout });
  }

  // Click operations
  async click(selector: string) {
    await this.page.click(selector);
  }

  async clickByTestId(testId: string) {
    await this.page.click(`[data-testid="${testId}"]`);
  }

  async clickByText(text: string) {
    await this.page.click(`text=${text}`);
  }

  // Text input
  async fill(selector: string, text: string) {
    await this.page.fill(selector, text);
  }

  async fillByTestId(testId: string, text: string) {
    await this.page.fill(`[data-testid="${testId}"]`, text);
  }

  async type(selector: string, text: string, delay: number = 0) {
    await this.page.locator(selector).type(text, { delay });
  }

  // Text retrieval
  async getText(selector: string): Promise<string | null> {
    return await this.page.textContent(selector);
  }

  async getTextByTestId(testId: string): Promise<string | null> {
    return await this.page.textContent(`[data-testid="${testId}"]`);
  }

  // Element visibility and existence
  async isVisible(selector: string): Promise<boolean> {
    return await this.page.isVisible(selector);
  }

  async isVisibleByTestId(testId: string): Promise<boolean> {
    return await this.page.isVisible(`[data-testid="${testId}"]`);
  }

  async isEnabled(selector: string): Promise<boolean> {
    return await this.page.isEnabled(selector);
  }

  async getAttribute(
    selector: string,
    attribute: string,
  ): Promise<string | null> {
    return await this.page.getAttribute(selector, attribute);
  }

  // Element counting
  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  // Select operations
  async selectOption(selector: string, value: string) {
    await this.page.selectOption(selector, value);
  }

  async selectByTestId(testId: string, value: string) {
    await this.page.selectOption(`[data-testid="${testId}"]`, value);
  }

  // Assertions
  async expectText(selector: string, text: string) {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  async expectVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async expectHidden(selector: string) {
    await expect(this.page.locator(selector)).toBeHidden();
  }

  async expectUrl(url: RegExp | string) {
    await expect(this.page).toHaveURL(url);
  }

  // Get locator
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  getLocatorByTestId(testId: string): Locator {
    return this.page.locator(`[data-testid="${testId}"]`);
  }

  // Screenshots for debugging
  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `./test-results/screenshots/${name}.png`,
      fullPage: true,
    });
  }
}
