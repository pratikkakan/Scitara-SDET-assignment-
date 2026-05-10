import { Page } from '@playwright/test';
import { ProductListingPage } from '@/pages/ProductListingPage';
import { ProductDetailsPage } from '@/pages/ProductDetailsPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutPage } from '@/pages/CheckoutPage';

export class PageObjectManager {
  private _productListingPage?: ProductListingPage;
  private _productDetailsPage?: ProductDetailsPage;
  private _cartPage?: CartPage;
  private _checkoutPage?: CheckoutPage;

  constructor(readonly page: Page) {}

  get productListingPage(): ProductListingPage {
    return (this._productListingPage ??= new ProductListingPage(this.page));
  }

  get productDetailsPage(): ProductDetailsPage {
    return (this._productDetailsPage ??= new ProductDetailsPage(this.page));
  }

  get cartPage(): CartPage {
    return (this._cartPage ??= new CartPage(this.page));
  }

  get checkoutPage(): CheckoutPage {
    return (this._checkoutPage ??= new CheckoutPage(this.page));
  }
}
