import { expect, Locator, Page } from '@playwright/test';

export class CartBadgeComponent {
  private readonly badge: Locator;

  constructor(page: Page) {
    this.badge = page.getByTestId('cart-count');
  }

  async getCount(): Promise<number> {
    const text = await this.badge.textContent();
    return parseInt(text ?? '0', 10);
  }

  async assertCount(expected: number): Promise<void> {
    await expect(this.badge).toHaveText(String(expected));
  }

  async isVisible(): Promise<boolean> {
    return this.badge.isVisible();
  }
}
