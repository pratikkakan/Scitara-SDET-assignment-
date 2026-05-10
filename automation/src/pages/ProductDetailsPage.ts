import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base/BasePage';
import { CartBadgeComponent } from './components/CartBadgeComponent';

export class ProductDetailsPage extends BasePage {
  readonly cartBadge: CartBadgeComponent;
  readonly productDetails: Locator;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productCategory: Locator;
  readonly productRating: Locator;
  readonly productImage: Locator;
  readonly stockStatus: Locator;
  readonly quantityInput: Locator;
  readonly increaseQtyBtn: Locator;
  readonly decreaseQtyBtn: Locator;
  readonly addToCartBtn: Locator;
  readonly backButton: Locator;
  readonly relatedProducts: Locator;

  constructor(page: Page) {
    super(page);
    this.cartBadge = new CartBadgeComponent(page);
    this.productDetails = page.getByTestId('product-details');
    this.productTitle = page.getByTestId('product-detail-name');
    this.productPrice = page.getByTestId('product-detail-price');
    this.productDescription = page.getByTestId('product-detail-description');
    this.productCategory = page.getByTestId('product-detail-category');
    this.productRating = page.getByTestId('product-detail-rating');
    this.productImage = page.getByTestId('product-detail-image');
    this.stockStatus = page.getByTestId('stock-status');
    this.quantityInput = page.getByTestId('quantity-input');
    this.increaseQtyBtn = page.getByTestId('increase-quantity');
    this.decreaseQtyBtn = page.getByTestId('decrease-quantity');
    this.addToCartBtn = page.getByTestId('add-to-cart-button');
    this.backButton = page.getByTestId('back-button');
    this.relatedProducts = page.getByTestId('related-products');
  }

  // Navigation
  async navigate(productId: string | number): Promise<void> {
    await super.navigate(`/product/${productId}`);
  }

  async navigateToProduct(productId: string | number): Promise<void> {
    await this.navigate(productId);
  }

  // Actions
  async addToCart(): Promise<void> {
    await this.addToCartBtn.click();
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.fill(String(quantity));
  }

  async increaseQuantity(): Promise<void> {
    await this.increaseQtyBtn.click();
  }

  async decreaseQuantity(): Promise<void> {
    await this.decreaseQtyBtn.click();
  }

  async increaseQuantityBy(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.increaseQuantity();
    }
  }

  async addToCartWithQuantity(quantity: number): Promise<void> {
    await this.setQuantity(quantity);
    await this.addToCart();
  }

  async goBack(): Promise<void> {
    await this.backButton.click();
  }

  async clickFirstRelatedProduct(): Promise<void> {
    await this.page.getByTestId('related-product-link').first().click();
  }

  // Queries
  async getTitle(): Promise<string | null> {
    return this.productTitle.textContent();
  }

  async getPrice(): Promise<string | null> {
    return this.productPrice.textContent();
  }

  async getDescription(): Promise<string | null> {
    return this.productDescription.textContent();
  }

  async getCategory(): Promise<string | null> {
    return this.productCategory.textContent();
  }

  async getRating(): Promise<string | null> {
    return this.productRating.textContent();
  }

  async getStockStatus(): Promise<string | null> {
    return this.stockStatus.textContent();
  }

  async getQuantity(): Promise<string> {
    return this.quantityInput.inputValue();
  }

  async getImageSrc(): Promise<string | null> {
    return this.productImage.getAttribute('src');
  }

  async getImageAlt(): Promise<string | null> {
    return this.productImage.getAttribute('alt');
  }

  async getProductId(): Promise<string | null> {
    const url = await this.getUrl();
    return url.match(/\/products\/(\d+)/)?.[1] ?? null;
  }

  // Waits
  async waitForPageToLoad(): Promise<void> {
    await this.productDetails.waitFor({ state: 'visible', timeout: 10_000 });
  }

  // Assertion helpers
  async assertPageVisible(): Promise<void> {
    await expect(this.productDetails).toBeVisible();
  }

  async assertTitle(expected: string): Promise<void> {
    await expect(this.productTitle).toHaveText(expected);
  }

  async assertStockStatus(expected: string): Promise<void> {
    await expect(this.stockStatus).toContainText(expected);
  }

  async assertImageVisible(): Promise<void> {
    await expect(this.productImage).toBeVisible();
  }

  async assertAddToCartEnabled(): Promise<void> {
    await expect(this.addToCartBtn).toBeEnabled();
  }

  async assertQuantity(expected: number): Promise<void> {
    await expect(this.quantityInput).toHaveValue(String(expected));
  }
}
