/**
 * Cart Page - Page Object Model
 */

import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  // Selectors
  readonly cartPage = '[data-testid="cart-page"]';
  readonly cartTitle = '[data-testid="cart-title"]';
  readonly itemsHeader = '[data-testid="items-header"]';
  readonly cartItems = '[data-testid="cart-items"]';
  readonly cartItem = '[data-testid="cart-item-"]';
  readonly itemName = '[data-testid="item-name-"]';
  readonly itemPrice = '[data-testid="item-unit-price-"]';
  readonly itemCategory = '[data-testid="item-category-"]';
  readonly itemImage = '[data-testid="item-image-"]';
  readonly quantityInput = '[data-testid="item-quantity-"]';
  readonly removeItemBtn = '[data-testid="remove-item-btn-"]';
  readonly updateQuantityBtn = '[data-testid="update-qty-btn"]';
  readonly subtotalPrice = '[data-testid="subtotal-price"]';
  readonly taxPrice = '[data-testid="tax-price"]';
  readonly shippingPrice = '[data-testid="shipping-price"]';
  readonly totalPrice = '[data-testid="total-price"]';
  readonly checkoutBtn = '[data-testid="checkout-btn"]';
  readonly continueShoppingBtn = '[data-testid="continue-shopping-btn"]';
  readonly emptyCartMessage = '[data-testid="empty-state"]';
  readonly cartItemCount = '[data-testid="items-count"]';

  // Navigation
  async navigate() {
    await this.goto("/cart");
  }

  // Cart item operations
  async getItemCount(): Promise<number> {
    return await this.getElementCount(this.cartItems);
  }

  async getItemCountFromHeader(): Promise<string | null> {
    return await this.getTextByTestId("items-count");
  }

  async getItemNameByIndex(index: number): Promise<string | null> {
    const items = await this.page.locator(this.cartItem).all();
    if (items.length > index) {
      return await items[index]
        .locator(`${this.itemName}${this.getProductIdFromSelector()}`)
        .textContent();
    }
    return null;
  }

  async getItemPriceByIndex(index: number): Promise<string | null> {
    const items = await this.page.locator(this.cartItem).all();
    if (items.length > index) {
      return await items[index].textContent();
    }
    return null;
  }

  private getProductIdFromSelector(): string {
    // This is a helper to dynamically get product ID
    return "";
  }

  async getItemByProductId(productId: string) {
    return this.page.locator(`[data-testid="cart-item-${productId}"]`);
  }

  async updateItemQuantity(productId: string, newQuantity: number) {
    const quantityInput = this.page.locator(
      `[data-testid="item-quantity-${productId}"]`,
    );
    await quantityInput.fill(String(newQuantity));
    await this.clickByTestId("update-qty-btn");
  }

  async removeItem(productId: string) {
    await this.clickByTestId(`remove-item-btn-${productId}`);
  }

  async removeAllItems() {
    const removeButtons = await this.page
      .locator('[data-testid*="remove-item-btn-"]')
      .all();

    // Remove items in reverse order to avoid index issues
    for (let i = removeButtons.length - 1; i >= 0; i--) {
      await removeButtons[i].click();
      await this.page.waitForTimeout(200);
    }
  }

  // Price information
  async getSubtotalPrice(): Promise<string | null> {
    return await this.getTextByTestId("subtotal-price");
  }

  async getTaxPrice(): Promise<string | null> {
    return await this.getTextByTestId("tax-price");
  }

  async getShippingPrice(): Promise<string | null> {
    return await this.getTextByTestId("shipping-price");
  }

  async getTotalPrice(): Promise<string | null> {
    return await this.getTextByTestId("total-price");
  }

  // Extract numeric value from price string (e.g., "$100.00" -> 100)
  private extractPrice(priceStr: string | null): number {
    if (!priceStr) return 0;
    const match = priceStr.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  async getTotalPriceAsNumber(): Promise<number> {
    const price = await this.getTotalPrice();
    return this.extractPrice(price);
  }

  // Checkout operations
  async proceedToCheckout() {
    await this.clickByTestId("checkout-btn");
  }

  async continueShopping() {
    await this.clickByTestId("continue-shopping-btn");
  }

  // Visibility checks
  async isCartPageVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("cart-page");
  }

  async isEmptyCartVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("empty-state");
  }

  async isCheckoutButtonVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("checkout-btn");
  }

  // Wait for page to load
  async waitForCartToLoad() {
    await this.waitForElement(this.cartPage, 10000);
  }

  // Check if cart is empty
  async isCartEmpty(): Promise<boolean> {
    return await this.isEmptyCartVisible();
  }

  // Get cart summary
  async getCartSummary() {
    const itemCount = await this.getItemCount();
    const subtotal = this.extractPrice(await this.getSubtotalPrice());
    const tax = this.extractPrice(await this.getTaxPrice());
    const shipping = this.extractPrice(await this.getShippingPrice());
    const total = this.extractPrice(await this.getTotalPrice());

    return {
      itemCount,
      subtotal,
      tax,
      shipping,
      total,
    };
  }
}
