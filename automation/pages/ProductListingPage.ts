/**
 * Product Listing Page - Page Object Model
 */

import { BasePage } from "./BasePage";

export class ProductListingPage extends BasePage {
  // Selectors
  readonly productListing = '[data-testid="product-listing"]';
  readonly productItem = '[data-testid="product-item"]';
  readonly productLink = '[data-testid="product-link"]';
  readonly addToCartBtn = '[data-testid="add-to-cart-btn"]';
  readonly cartBadge = '[data-testid="cart-badge"]';
  readonly searchBox = '[data-testid="search-box"]';
  readonly searchInput = 'input[placeholder="Search products..."]';
  readonly categoryFilter = '[data-testid="category-filter"]';
  readonly loadingSpinner = '[data-testid="loading-spinner"]';
  readonly emptyState = '[data-testid="empty-state"]';
  readonly headerCartBtn = '[data-testid="header-cart-btn"]';
  readonly productPrice = '[data-testid="product-price"]';
  readonly productName = '[data-testid="product-name"]';

  // Navigation
  async navigate() {
    await this.goto("/");
  }

  // Product operations
  async getProductCount(): Promise<number> {
    return await this.getElementCount(this.productItem);
  }

  async getFirstProductName(): Promise<string | null> {
    return await this.page
      .locator(this.productItem)
      .first()
      .locator(this.productName)
      .textContent();
  }

  async getFirstProductPrice(): Promise<string | null> {
    return await this.page
      .locator(this.productItem)
      .first()
      .locator(this.productPrice)
      .textContent();
  }

  async clickFirstProduct() {
    await this.page.locator(this.productLink).first().click();
  }

  async clickProductByName(productName: string) {
    await this.page
      .locator(this.productLink)
      .filter({ hasText: productName })
      .first()
      .click();
  }

  async clickAddToCartForProduct(productIndex: number = 0) {
    const buttons = await this.page.locator(this.addToCartBtn).all();
    if (buttons.length > productIndex) {
      await buttons[productIndex].click();
    }
  }

  async addAllProductsToCart(count?: number) {
    const productCount = count || (await this.getProductCount());
    for (let i = 0; i < productCount; i++) {
      await this.clickAddToCartForProduct(i);
      // Small delay to avoid race conditions
      await this.page.waitForTimeout(100);
    }
  }

  // Cart operations
  async getCartCount(): Promise<string | null> {
    return await this.getTextByTestId("cart-badge");
  }

  async goToCart() {
    await this.clickByTestId("header-cart-btn");
  }

  // Search operations
  async searchProducts(query: string) {
    const searchInput = this.page.locator(this.searchInput);
    await searchInput.fill("");
    await searchInput.type(query);
    await this.page.waitForTimeout(500); // Wait for search to complete
  }

  async clearSearch() {
    const searchInput = this.page.locator(this.searchInput);
    await searchInput.fill("");
    await this.page.waitForTimeout(500);
  }

  // Filter operations
  async filterByCategory(category: string) {
    await this.selectByTestId("category-filter", category);
    await this.page.waitForTimeout(500); // Wait for filter to apply
  }

  async getSelectedCategory(): Promise<string | null> {
    return await this.page
      .locator(this.categoryFilter)
      .inputValue()
      .catch(() => null);
  }

  // Visibility checks
  async isProductListingVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("product-listing");
  }

  async isLoadingVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("loading-spinner");
  }

  async isEmptyStateVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("empty-state");
  }

  // Wait for page to load
  async waitForProductsToLoad() {
    await this.waitForElement(this.productItem, 10000);
  }

  async waitForLoadingToComplete() {
    const loadingLocator = this.page.locator(this.loadingSpinner);
    const count = await loadingLocator.count();
    if (count > 0) {
      await loadingLocator.waitFor({ state: "hidden", timeout: 10000 });
    }
  }
}
