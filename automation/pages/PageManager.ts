/**
 * PageManager - Fixture for managing all page objects
 * This centralizes page instance management and provides a clean API for tests
 */

import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { ProductListingPage } from "./ProductListingPage";
import { ProductDetailsPage } from "./ProductDetailsPage";
import { CartPage } from "./CartPage";
import { CheckoutPage } from "./CheckoutPage";

export class PageManager {
  readonly page: Page;
  private _basePage: BasePage | null = null;
  private _productListingPage: ProductListingPage | null = null;
  private _productDetailsPage: ProductDetailsPage | null = null;
  private _cartPage: CartPage | null = null;
  private _checkoutPage: CheckoutPage | null = null;

  constructor(page: Page) {
    this.page = page;
  }

  // Lazy-load page objects
  get basePage(): BasePage {
    if (!this._basePage) {
      this._basePage = new BasePage(this.page);
    }
    return this._basePage;
  }

  get productListingPage(): ProductListingPage {
    if (!this._productListingPage) {
      this._productListingPage = new ProductListingPage(this.page);
    }
    return this._productListingPage;
  }

  get productDetailsPage(): ProductDetailsPage {
    if (!this._productDetailsPage) {
      this._productDetailsPage = new ProductDetailsPage(this.page);
    }
    return this._productDetailsPage;
  }

  get cartPage(): CartPage {
    if (!this._cartPage) {
      this._cartPage = new CartPage(this.page);
    }
    return this._cartPage;
  }

  get checkoutPage(): CheckoutPage {
    if (!this._checkoutPage) {
      this._checkoutPage = new CheckoutPage(this.page);
    }
    return this._checkoutPage;
  }

  // Navigation helpers
  async navigateToHome() {
    await this.basePage.goto("/");
  }

  async navigateToCart() {
    await this.cartPage.navigate();
  }

  async navigateToCheckout() {
    await this.checkoutPage.navigate();
  }

  async navigateToProduct(productId: string | number) {
    await this.productDetailsPage.navigateToProduct(String(productId));
  }

  // Common workflows
  /**
   * Complete shopping flow: browse products -> add to cart -> checkout
   */
  async completePurchaseFlow(formData: any) {
    // Go to product listing
    await this.productListingPage.navigate();
    await this.productListingPage.waitForLoadingToComplete();

    // Add first product to cart
    await this.productListingPage.clickAddToCartForProduct(0);

    // Go to cart
    await this.cartPage.navigate();
    await this.cartPage.waitForCartToLoad();

    // Proceed to checkout
    await this.cartPage.proceedToCheckout();

    // Complete checkout
    await this.checkoutPage.waitForCheckoutPageToLoad();
    return await this.checkoutPage.completeCheckout(formData);
  }

  /**
   * Add multiple products to cart flow
   */
  async addMultipleProductsToCart(productCount: number = 3) {
    await this.productListingPage.navigate();
    await this.productListingPage.waitForLoadingToComplete();
    await this.productListingPage.addAllProductsToCart(productCount);
    const cartCount = await this.productListingPage.getCartCount();
    return cartCount;
  }

  /**
   * Search and add product flow
   */
  async searchAndAddProduct(searchQuery: string) {
    await this.productListingPage.navigate();
    await this.productListingPage.waitForLoadingToComplete();
    await this.productListingPage.searchProducts(searchQuery);
    await this.productListingPage.clickAddToCartForProduct(0);
  }

  /**
   * Filter and add product flow
   */
  async filterAndAddProduct(category: string) {
    await this.productListingPage.navigate();
    await this.productListingPage.waitForLoadingToComplete();
    await this.productListingPage.filterByCategory(category);
    await this.productListingPage.clickAddToCartForProduct(0);
  }

  /**
   * View product details flow
   */
  async viewProductDetails(productIndex: number = 0) {
    await this.productListingPage.navigate();
    await this.productListingPage.waitForLoadingToComplete();
    await this.productListingPage.clickAddToCartForProduct(productIndex);
    return await this.productDetailsPage.getProductTitle();
  }

  // Reset state
  async resetBrowserState() {
    this._basePage = null;
    this._productListingPage = null;
    this._productDetailsPage = null;
    this._cartPage = null;
    this._checkoutPage = null;
  }
}
