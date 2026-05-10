import { expect } from '@playwright/test';
import { BasePage } from './base/BasePage';
import { CartBadgeComponent } from './components/CartBadgeComponent';
import { waitForNetworkIdle, waitForHidden } from '@/utils/helpers/waitHelpers';

export class ProductListingPage extends BasePage {
  readonly cartBadge = new CartBadgeComponent(this.page);

  // Locators
  get productItems()   { return this.page.locator('[data-testid^="product-card-"]'); }
  get searchInput()    { return this.page.getByPlaceholder('Search products...'); }
  get categoryFilter() { return this.page.getByTestId('category-filter'); }
  get loadingSpinner() { return this.page.getByTestId('loading-spinner'); }
  get emptyState()     { return this.page.getByTestId('empty-state'); }
  get headerCartBtn()  { return this.page.getByTestId('header-cart-btn'); }

  productById(id: string) {
    return this.page.getByTestId(`product-card-${id}`);
  }

  // Navigation
  async navigate(): Promise<void> {
    await super.navigate('/');
  }

  // Actions
  async addProductToCart(index = 0): Promise<void> {
    await this.productItems.nth(index).locator('[data-testid^="quick-add-"]').click();
  }

  async addProductToCartById(productId: string): Promise<void> {
    const addButton = this.page.getByTestId(`quick-add-${productId}`);
    await addButton.click();
    await this.page.waitForTimeout(100);
  }

  async addMultipleProductsToCart(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.addProductToCart(i);
    }
  }

  async clickFirstProduct(): Promise<void> {
    await this.productItems.first().getByTestId('product-link').click();
  }

  async clickProductByName(name: string): Promise<void> {
    await this.productItems.filter({ hasText: name }).first().getByTestId('product-link').click();
  }

  async searchFor(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await waitForNetworkIdle(this.page);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await waitForNetworkIdle(this.page);
  }

  async filterByCategory(category: string): Promise<void> {
    await this.categoryFilter.selectOption(category);
    await waitForNetworkIdle(this.page);
  }

  async goToCart(): Promise<void> {
    await this.headerCartBtn.click();
  }

  // Queries
  async getProductCount(): Promise<number> {
    return this.productItems.count();
  }

  async getFirstProductName(): Promise<string | null> {
    return this.productItems.first().locator('[data-testid^="product-name-"]').textContent();
  }

  async getFirstProductPrice(): Promise<string | null> {
    return this.productItems.first().locator('[data-testid^="product-price-"]').textContent();
  }

  async getProductNameById(productId: string): Promise<string | null> {
    return this.productById(productId).locator(`[data-testid="product-name-${productId}"]`).textContent();
  }

  async getProductPriceById(productId: string): Promise<string | null> {
    return this.productById(productId).locator(`[data-testid="product-price-${productId}"]`).textContent();
  }

  async getSelectedCategory(): Promise<string | null> {
    return this.categoryFilter.inputValue().catch(() => null);
  }

  // Waits
  async waitForProductsToLoad(): Promise<void> {
    await this.productItems.first().waitFor({ state: 'visible', timeout: 10_000 });
  }

  async waitForLoadingToComplete(): Promise<void> {
    const spinner = this.loadingSpinner;
    if (await spinner.isVisible()) {
      await waitForHidden(spinner, 10_000);
    }
  }

  // Assertion helpers
  async assertProductsVisible(minCount = 1): Promise<void> {
    await expect(this.productItems).toHaveCount(minCount);
  }

  async assertCartBadgeCount(expected: number): Promise<void> {
    await this.cartBadge.assertCount(expected);
  }

  async assertEmptyState(): Promise<void> {
    await expect(this.emptyState).toBeVisible();
  }

  async assertPageVisible(): Promise<void> {
    await expect(this.page.getByTestId('product-listing')).toBeVisible();
  }
}
