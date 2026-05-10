import { Page } from '@playwright/test';

export class BasePage {
  constructor(readonly page: Page) {}

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
}
