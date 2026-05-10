/**
 * Product Details Page - Page Object Model
 */

import { BasePage } from "./BasePage";

export class ProductDetailsPage extends BasePage {
  // Selectors
  readonly productDetails = '[data-testid="product-details"]';
  readonly productImage = '[data-testid="product-image"]';
  readonly productTitle = '[data-testid="product-title"]';
  readonly productPrice = '[data-testid="product-price"]';
  readonly productDescription = '[data-testid="product-description"]';
  readonly productCategory = '[data-testid="product-category"]';
  readonly productRating = '[data-testid="product-rating"]';
  readonly addToCartBtn = '[data-testid="add-to-cart-btn"]';
  readonly quantityInput = '[data-testid="quantity-input"]';
  readonly decreaseQtyBtn = '[data-testid="decrease-qty-btn"]';
  readonly increaseQtyBtn = '[data-testid="increase-qty-btn"]';
  readonly backButton = '[data-testid="back-button"]';
  readonly relatedProducts = '[data-testid="related-products"]';
  readonly stockStatus = '[data-testid="stock-status"]';

  // Navigation
  async navigateToProduct(productId: string | number) {
    await this.goto(`/products/${productId}`);
  }

  // Product information
  async getProductTitle(): Promise<string | null> {
    return await this.getTextByTestId("product-title");
  }

  // Aliases for convenience
  async getProductName(): Promise<string | null> {
    return await this.getProductTitle();
  }

  async getName(): Promise<string | null> {
    return await this.getProductTitle();
  }

  async getProductPrice(): Promise<string | null> {
    return await this.getTextByTestId("product-price");
  }

  async getPrice(): Promise<string | null> {
    return await this.getProductPrice();
  }

  async getProductDescription(): Promise<string | null> {
    return await this.getTextByTestId("product-description");
  }

  async getDescription(): Promise<string | null> {
    return await this.getProductDescription();
  }

  async getProductCategory(): Promise<string | null> {
    return await this.getTextByTestId("product-category");
  }

  async getCategory(): Promise<string | null> {
    return await this.getProductCategory();
  }

  async getProductRating(): Promise<string | null> {
    return await this.getTextByTestId("product-rating");
  }

  async getRating(): Promise<string | null> {
    return await this.getProductRating();
  }

  async getStockStatus(): Promise<string | null> {
    return await this.getTextByTestId("stock-status");
  }

  // Image operations
  async isImageVisible(): Promise<boolean> {
    return await this.isVisible(this.productImage);
  }

  async getImageSrc(): Promise<string | null> {
    return await this.getAttribute(this.productImage, "src");
  }

  async getImageAltText(): Promise<string | null> {
    return await this.getAttribute(this.productImage, "alt");
  }

  async getImageCount(): Promise<number> {
    return await this.getElementCount('[data-testid*="product-image"]');
  }

  async canZoomImage(): Promise<boolean> {
    try {
      const zoomButton = await this.page
        .locator('[data-testid="zoom-image-btn"]')
        .isVisible();
      return zoomButton;
    } catch {
      return false;
    }
  }

  async zoomImage() {
    try {
      await this.clickByTestId("zoom-image-btn");
    } catch {
      // Zoom might not be available
    }
  }

  // Quantity operations
  async getQuantity(): Promise<string | null> {
    return await this.page.locator(this.quantityInput).inputValue();
  }

  async isQuantitySelectorVisible(): Promise<boolean> {
    return await this.isVisible(this.quantityInput);
  }

  async setQuantity(quantity: number) {
    const input = this.page.locator(this.quantityInput);
    await input.fill(String(quantity));
  }

  async increaseQuantity() {
    await this.clickByTestId("increase-qty-btn");
  }

  async decreaseQuantity() {
    await this.clickByTestId("decrease-qty-btn");
  }

  async increaseQuantityByCount(count: number) {
    for (let i = 0; i < count; i++) {
      await this.increaseQuantity();
    }
  }

  // Add to cart
  async addToCart() {
    await this.clickByTestId("add-to-cart-btn");
  }

  async addToCartWithQuantity(quantity: number) {
    await this.setQuantity(quantity);
    await this.addToCart();
  }

  async getSuccessMessage(): Promise<string | null> {
    try {
      return await this.getTextByTestId("success-message");
    } catch {
      return null;
    }
  }

  // Navigation
  async goBack() {
    await this.clickByTestId("back-button");
  }

  // Visibility checks
  async isProductDetailsVisible(): Promise<boolean> {
    return await this.isVisibleByTestId("product-details");
  }

  async isAddToCartButtonEnabled(): Promise<boolean> {
    return await this.isEnabled(this.addToCartBtn);
  }

  // Wait for page to load
  async waitForProductDetailsToLoad() {
    await this.waitForElement(this.productDetails, 10000);
  }

  // Check if related products are visible
  async areRelatedProductsVisible(): Promise<boolean> {
    const count = await this.getElementCount(this.relatedProducts);
    return count > 0;
  }

  async hasRelatedProducts(): Promise<boolean> {
    return await this.areRelatedProductsVisible();
  }

  async clickFirstRelatedProduct() {
    const relatedProductLinks = await this.page
      .locator('[data-testid="related-product-link"]')
      .all();

    if (relatedProductLinks.length > 0) {
      await relatedProductLinks[0].click();
    }
  }

  // Get product URL
  async getProductId(): Promise<string | null> {
    const url = await this.getUrl();
    const match = url.match(/\/products\/(\d+)/);
    return match ? match[1] : null;
  }
}
