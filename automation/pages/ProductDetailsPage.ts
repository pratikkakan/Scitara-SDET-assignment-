import { expect } from '@playwright/test';
import { BasePage } from './base/BasePage';
import { CartBadgeComponent } from './components/CartBadgeComponent';

export class ProductDetailsPage extends BasePage {
  readonly cartBadge = new CartBadgeComponent(this.page);

  // Locators
  get productDetails()    { return this.page.getByTestId('product-details'); }
  get productTitle()      { return this.page.getByTestId('product-title'); }
  get productPrice()      { return this.page.getByTestId('product-price'); }
  get productDescription(){ return this.page.getByTestId('product-description'); }
  get productCategory()   { return this.page.getByTestId('product-category'); }
  get productRating()     { return this.page.getByTestId('product-rating'); }
  get productImage()      { return this.page.getByTestId('product-image'); }
  get stockStatus()       { return this.page.getByTestId('stock-status'); }
  get quantityInput()     { return this.page.getByTestId('quantity-input'); }
  get increaseQtyBtn()    { return this.page.getByTestId('increase-qty-btn'); }
  get decreaseQtyBtn()    { return this.page.getByTestId('decrease-qty-btn'); }
  get addToCartBtn()      { return this.page.getByTestId('add-to-cart-btn'); }
  get backButton()        { return this.page.getByTestId('back-button'); }
  get relatedProducts()   { return this.page.getByTestId('related-products'); }

  // Navigation
  async navigateToProduct(productId: string | number): Promise<void> {
    await super.navigate(`/products/${productId}`);
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
  async getTitle(): Promise<string | null>       { return this.productTitle.textContent(); }
  async getPrice(): Promise<string | null>       { return this.productPrice.textContent(); }
  async getDescription(): Promise<string | null> { return this.productDescription.textContent(); }
  async getCategory(): Promise<string | null>    { return this.productCategory.textContent(); }
  async getRating(): Promise<string | null>      { return this.productRating.textContent(); }
  async getStockStatus(): Promise<string | null> { return this.stockStatus.textContent(); }
  async getQuantity(): Promise<string>           { return this.quantityInput.inputValue(); }
  async getImageSrc(): Promise<string | null>    { return this.productImage.getAttribute('src'); }
  async getImageAlt(): Promise<string | null>    { return this.productImage.getAttribute('alt'); }

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
