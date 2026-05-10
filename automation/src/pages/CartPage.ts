import { expect } from '@playwright/test';
import { BasePage } from './base/BasePage';
import { waitForHidden } from '@/utils/helpers/waitHelpers';

export class CartPage extends BasePage {
  // Locators
  get cartContainer()      { return this.page.getByTestId('cart-page'); }
  get cartItems()          { return this.page.locator('[data-testid^="cart-item-"]'); }
  get emptyState()         { return this.page.getByTestId('empty-state'); }
  get itemCount()          { return this.page.getByTestId('items-count'); }
  get subtotalPrice()      { return this.page.getByTestId('subtotal'); }
  get taxPrice()           { return this.page.getByTestId('tax'); }
  get shippingPrice()      { return this.page.getByTestId('shipping'); }
  get totalPrice()         { return this.page.getByTestId('total-price'); }
  get checkoutBtn()        { return this.page.getByTestId('checkout-button'); }
  get continueShoppingBtn(){ return this.page.getByTestId('continue-shopping-button'); }

  cartItemById(productId: string) {
    return this.page.getByTestId(`cart-item-${productId}`);
  }

  quantityInputById(productId: string) {
    return this.page.getByTestId(`quantity-${productId}`);
  }

  removeButtonById(productId: string) {
    return this.page.getByTestId(`remove-${productId}`);
  }

  // Helper to extract product ID from cart item test ID
  async extractProductIdFromFirstItem(): Promise<string> {
    const firstItem = this.page.locator('[data-testid*="cart-item-"]').first();
    const testId = await firstItem.getAttribute('data-testid');
    return testId?.replace('cart-item-', '') ?? '';
  }

  async extractProductIdFromIndex(index: number): Promise<string> {
    const item = this.page.locator('[data-testid*="cart-item-"]').nth(index);
    const testId = await item.getAttribute('data-testid');
    return testId?.replace('cart-item-', '') ?? '';
  }

  // Navigation
  async navigate(): Promise<void> {
    await super.navigate('/cart');
  }

  // Actions
  async proceedToCheckout(): Promise<void> {
    await this.checkoutBtn.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingBtn.click();
  }

  async updateItemQuantity(productId: string, quantity: number): Promise<void> {
    await this.quantityInputById(productId).fill(String(quantity));
    await this.page.waitForTimeout(200);
  }

  async removeItem(productId: string): Promise<void> {
    await this.removeButtonById(productId).click();
    await this.page.waitForTimeout(400);
  }

  async removeAllItems(): Promise<void> {
    const removeButtons = this.page.locator('[data-testid^="remove-"]');
    const count = await removeButtons.count();
    for (let i = count - 1; i >= 0; i--) {
      await removeButtons.nth(i).click();
      await this.page.waitForTimeout(100);
    }
  }

  // Queries
  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getSubtotal(): Promise<string | null>  { return this.subtotalPrice.textContent(); }
  async getTax(): Promise<string | null>        { return this.taxPrice.textContent(); }
  async getShipping(): Promise<string | null>   { return this.shippingPrice.textContent(); }
  async getTotal(): Promise<string | null>      { return this.totalPrice.textContent(); }

  async getTotalAsNumber(): Promise<number> {
    const text = await this.getTotal();
    const match = text?.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  async getCartSummary() {
    return {
      itemCount: await this.getItemCount(),
      subtotal:  await this.getSubtotal(),
      tax:       await this.getTax(),
      shipping:  await this.getShipping(),
      total:     await this.getTotal(),
    };
  }

  // Waits
  async waitForCartToLoad(): Promise<void> {
    await this.cartContainer.waitFor({ state: 'visible', timeout: 10_000 });
  }

  // Assertion helpers
  async assertCartVisible(): Promise<void> {
    await expect(this.cartContainer).toBeVisible();
  }

  async assertCartEmpty(): Promise<void> {
    await expect(this.emptyState).toBeVisible();
  }

  async assertCartHasItems(expected: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expected);
  }

  async assertTotalPrice(expected: string): Promise<void> {
    await expect(this.totalPrice).toContainText(expected);
  }

  async assertCheckoutButtonVisible(): Promise<void> {
    await expect(this.checkoutBtn).toBeVisible();
  }
}
