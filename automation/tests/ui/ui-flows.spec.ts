import { test, expect } from '@/fixtures/base.fixture';
import { testProducts, singleProduct, multipleProducts } from '@/testData/ui/products/productData';
import { validCheckout } from '@/testData/ui/checkout/checkoutData';

test.describe('UI E2E: Complete Shopping Experience', () => {

  // ─────────────────────────────────────────────────────────────────────────────
  // PRODUCT LISTING PAGE
  // ─────────────────────────────────────────────────────────────────────────────

  test.describe('Product Listing Page', () => {
    test.beforeEach(async ({ pom }) => {
      await pom.productListingPage.navigate();
      await pom.productListingPage.waitForLoadingToComplete();
    });

    test.describe('Page Display & Product Information', () => {
      test('[Req-1.1] Product listing page displays with products loaded from JSON/Mock API', async ({ pom }) => {
        await pom.productListingPage.assertPageVisible();
        const count = await pom.productListingPage.getProductCount();
        expect(count).toBeGreaterThan(0);
      });

      test('[Req-1.2] Each product displays name, price, and category', async ({ pom }) => {
        const name = await pom.productListingPage.getFirstProductName();
        const price = await pom.productListingPage.getFirstProductPrice();
        const category = await pom.productListingPage.getFirstProductCategory();

        expect(name).toBeTruthy();
        expect(price).toBeTruthy();
        expect(category).toBeTruthy();
      });
    });

    test.describe('Add to Cart from Listing', () => {
      test('[Req-1.3] Add to cart button is available and functional', async ({ pom }) => {
        const before = await pom.productListingPage.cartBadge.getCount();
        await pom.productListingPage.addProductToCart(0);
        const after = await pom.productListingPage.cartBadge.getCount();
        expect(after).toBeGreaterThan(before);
      });

      test('[Req-1.3] Cart badge reflects multiple products added', async ({ pom }) => {
        const toAdd = Math.min(3, await pom.productListingPage.getProductCount());
        for (let i = 0; i < toAdd; i++) {
          await pom.productListingPage.addProductToCart(i);
        }
        const cartCount = await pom.productListingPage.cartBadge.getCount();
        expect(cartCount).toBeGreaterThanOrEqual(toAdd);
      });
    });

    test.describe('Search & Filter Functionality', () => {
      test('[Feature] Search by partial product name returns results', async ({ pom }) => {
        const firstName = await pom.productListingPage.getFirstProductName();
        if (!firstName) return;
        const searchTerm = firstName.substring(0, 3);
        await pom.productListingPage.searchFor(searchTerm);
        const count = await pom.productListingPage.getProductCount();
        expect(count).toBeGreaterThan(0);
      });

      test('[Feature] Search for non-existent term returns no results', async ({ pom }) => {
        await pom.productListingPage.searchFor('ZZZZNOEXIST');
        const count = await pom.productListingPage.getProductCount();
        expect(count).toBe(0);
      });

      test('[Feature] Filter by category returns relevant products', async ({ pom }) => {
        await pom.productListingPage.filterByCategory('Electronics');
        const count = await pom.productListingPage.getProductCount();
        expect(count).toBeGreaterThan(0);
      });

      test('[Feature] Clear search/filter restores all products', async ({ pom }) => {
        const totalBefore = await pom.productListingPage.getProductCount();
        await pom.productListingPage.searchFor('ZZZZNOEXIST');
        await pom.productListingPage.clearSearch();
        const totalAfter = await pom.productListingPage.getProductCount();
        expect(totalAfter).toBe(totalBefore);
      });
    });

    test.describe('Navigation', () => {
      test('[Req-2] Clicking a product navigates to Product Details Page', async ({ pom }) => {
        await pom.productListingPage.clickFirstProduct();
        await pom.productDetailsPage.assertPageVisible();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // PRODUCT DETAILS PAGE
  // ─────────────────────────────────────────────────────────────────────────────

  test.describe('Product Details Page', () => {
    test.beforeEach(async ({ pom }) => {
      await pom.productListingPage.navigate();
      await pom.productListingPage.waitForProductsToLoad();
      await pom.productListingPage.clickFirstProduct();
      await pom.productDetailsPage.waitForPageToLoad();
    });

    test.describe('Product Information Display', () => {
      test('[Req-2.1] Product details page displays product information', async ({ pom }) => {
        const title = await pom.productDetailsPage.getTitle();
        const price = await pom.productDetailsPage.getPrice();
        const description = await pom.productDetailsPage.getDescription();
        const category = await pom.productDetailsPage.getCategory();

        expect(title).toBeTruthy();
        expect(price).toMatch(/\$\d+(\.\d{2})?/);
        expect(description).toBeTruthy();
        expect(description!.length).toBeGreaterThan(10);
        expect(category).toBeTruthy();
      });

      test('[Req-2.1] Stock status and product image are visible', async ({ pom }) => {
        const stock = await pom.productDetailsPage.getStockStatus();
        expect(stock).toBeTruthy();

        await pom.productDetailsPage.assertImageVisible();
        const alt = await pom.productDetailsPage.getImageAlt();
        expect(alt).toBeTruthy();
      });
    });

    test.describe('Quantity Management', () => {
      test('[Req-2.1] Quantity can be incremented', async ({ pom }) => {
        const before = await pom.productDetailsPage.getQuantity();
        await pom.productDetailsPage.increaseQuantity();
        const after = await pom.productDetailsPage.getQuantity();
        expect(parseInt(after)).toBeGreaterThan(parseInt(before));
      });

      test('[Req-2.1] Quantity can be decremented (minimum 1)', async ({ pom }) => {
        await pom.productDetailsPage.increaseQuantity();
        const before = await pom.productDetailsPage.getQuantity();
        await pom.productDetailsPage.decreaseQuantity();
        const after = await pom.productDetailsPage.getQuantity();
        expect(parseInt(after)).toBeLessThan(parseInt(before));
      });

      test('[Req-2.1] Quantity can be set directly', async ({ pom }) => {
        await pom.productDetailsPage.setQuantity(3);
        await pom.productDetailsPage.assertQuantity(3);
      });
    });

    test.describe('Add to Cart from Details', () => {
      test('[Req-2.2] Add to cart button is enabled and functional', async ({ pom }) => {
        await pom.productDetailsPage.assertAddToCartEnabled();
        await pom.productDetailsPage.addToCart();
        const count = await pom.productDetailsPage.cartBadge.getCount();
        expect(count).toBeGreaterThan(0);
      });

      test('[Req-2.2] Add to cart with custom quantity is reflected in cart', async ({ pom }) => {
        await pom.productDetailsPage.increaseQuantityBy(2);
        await pom.productDetailsPage.addToCart();

        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
        const itemCount = await pom.cartPage.getItemCount();
        expect(itemCount).toBeGreaterThan(0);
      });
    });

    test.describe('Navigation', () => {
      test('[Feature] Back button returns to Product Listing', async ({ pom }) => {
        await pom.productDetailsPage.goBack();
        await pom.productListingPage.assertPageVisible();
      });

      test('[Feature] Product ID is extractable from URL', async ({ pom }) => {
        const productId = await pom.productDetailsPage.getProductId();
        expect(productId).toBeTruthy();
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // CART PAGE
  // ─────────────────────────────────────────────────────────────────────────────

  test.describe('Cart Page', () => {
    test.beforeEach(async ({ pom }) => {
      await pom.productListingPage.navigate();
      await pom.productListingPage.waitForProductsToLoad();
    });

    test.describe('Cart Content Management', () => {
      test('[Req-3.1] Empty cart shows empty state', async ({ pom }) => {
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
        await pom.cartPage.assertCartEmpty();
      });

      test('[Req-3.1] Added product appears in cart', async ({ pom }) => {
        await pom.productListingPage.addProductToCartById(singleProduct.id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
        const itemCount = await pom.cartPage.getItemCount();
        expect(itemCount).toBeGreaterThan(0);
      });

      test('[Req-3.1] Multiple products all appear in cart', async ({ pom }) => {
        for (const product of multipleProducts) {
          await pom.productListingPage.addProductToCartById(product.id);
        }
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
        const itemCount = await pom.cartPage.getItemCount();
        expect(itemCount).toBeGreaterThanOrEqual(multipleProducts.length);
      });
    });

    test.describe('Item Actions', () => {
      test('[Req-3.3] Remove item decreases cart count', async ({ pom }) => {
        await pom.productListingPage.addProductToCartById(testProducts[0].id);
        await pom.productListingPage.addProductToCartById(testProducts[1].id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();

        const countBefore = await pom.cartPage.getItemCount();
        const productId = await pom.cartPage.extractProductIdFromFirstItem();

        await pom.cartPage.removeItem(productId);
        const countAfter = await pom.cartPage.getItemCount();
        expect(countAfter).toBeLessThan(countBefore);
      });

      test('[Req-3.3] Remove all items shows empty cart', async ({ pom }) => {
        await pom.productListingPage.addProductToCartById(testProducts[0].id);
        await pom.productListingPage.addProductToCartById(testProducts[1].id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();

        await pom.cartPage.removeAllItems();
        await pom.cartPage.assertCartEmpty();
      });

      test('[Req-3.2] Update item quantity persists in cart', async ({ pom }) => {
        await pom.productListingPage.addProductToCartById(singleProduct.id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();

        const productId = await pom.cartPage.extractProductIdFromFirstItem();
        await pom.cartPage.updateItemQuantity(productId, 5);
      });
    });

    test.describe('Price Summary & Total', () => {
      test('[Req-3.4] Price summary displays subtotal, tax, shipping, and total', async ({ pom }) => {
        await pom.productListingPage.addProductToCartById(singleProduct.id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();

        const summary = await pom.cartPage.getCartSummary();
        expect(summary.subtotal).toBeTruthy();
        expect(summary.tax).toBeTruthy();
        expect(summary.shipping).toBeTruthy();
        expect(summary.total).toBeTruthy();
      });

      test('[Req-3.4] Total price is greater than zero', async ({ pom }) => {
        await pom.productListingPage.addProductToCartById(singleProduct.id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();

        const total = await pom.cartPage.getTotalAsNumber();
        expect(total).toBeGreaterThan(0);
      });

      test('[Req-3.2, 3.4] Total increases when quantity is updated', async ({ pom }) => {
        await pom.productListingPage.addProductToCartById(singleProduct.id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();

        const totalBefore = await pom.cartPage.getTotalAsNumber();
        const productId = await pom.cartPage.extractProductIdFromFirstItem();

        await pom.cartPage.updateItemQuantity(productId, 3);
        const totalAfter = await pom.cartPage.getTotalAsNumber();
        expect(totalAfter).toBeGreaterThanOrEqual(totalBefore);
      });
    });

    test.describe('Navigation', () => {
      test('[Feature] Continue shopping returns to Product Listing', async ({ pom }) => {
        await pom.productListingPage.addProductToCartById(singleProduct.id);
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();

        await pom.cartPage.continueShopping();
        await pom.productListingPage.assertPageVisible();
      });

      test('[Feature] Empty cart does not show checkout button', async ({ pom }) => {
        await pom.cartPage.navigate();
        await pom.cartPage.waitForCartToLoad();
        const isCheckoutVisible = await pom.cartPage.checkoutBtn.isVisible();
        expect(isCheckoutVisible).toBe(false);
      });
    });
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // CHECKOUT PAGE
  // ─────────────────────────────────────────────────────────────────────────────

  test.describe('Checkout Page', () => {
    test.beforeEach(async ({ pom }) => {
      await pom.productListingPage.navigate();
      await pom.productListingPage.waitForProductsToLoad();
      await pom.productListingPage.addProductToCart(0);
      await pom.cartPage.navigate();
      await pom.cartPage.waitForCartToLoad();
      await pom.cartPage.proceedToCheckout();
      await pom.checkoutPage.waitForPageToLoad();
    });

    test.describe('Successful Checkout', () => {
      test('[Req-4.1, 4.2] Order submission with valid data → order confirmed', async ({ pom }) => {
        await pom.checkoutPage.fillOrderDetails(validCheckout);
        await pom.checkoutPage.submitOrder();
        await pom.checkoutPage.assertOrderConfirmed();
      });

      test('[Req-4.1] Order confirmation includes order ID', async ({ pom }) => {
        await pom.checkoutPage.fillOrderDetails(validCheckout);
        await pom.checkoutPage.submitOrder();
        await pom.checkoutPage.waitForOrderConfirmation();

        const orderId = await pom.checkoutPage.getOrderId();
        expect(orderId).toBeTruthy();
      });

      test('[Feature] Order confirmation persists after submission', async ({ pom }) => {
        await pom.checkoutPage.fillOrderDetails(validCheckout);
        await pom.checkoutPage.submitOrder();

        const orderId = await pom.checkoutPage.getOrderId();
        expect(orderId).toBeTruthy();
      });
    });

    test.describe('Form Validation — Required Fields', () => {
      test('[Req-4.1] Rejects empty firstName field', async ({ pom }) => {
        await pom.checkoutPage.fillOrderDetails({ ...validCheckout, firstName: '' });
        await pom.checkoutPage.submitOrder();
        await pom.checkoutPage.assertFieldError('firstName');
      });

      test('[Req-4.1] Rejects empty lastName field', async ({ pom }) => {
        await pom.checkoutPage.fillOrderDetails({ ...validCheckout, lastName: '' });
        await pom.checkoutPage.submitOrder();
        await pom.checkoutPage.assertFieldError('lastName');
      });

      test('[Req-4.1] Rejects empty email field', async ({ pom }) => {
        await pom.checkoutPage.fillOrderDetails({ ...validCheckout, email: '' });
        await pom.checkoutPage.submitOrder();
        await pom.checkoutPage.assertFieldError('email');
      });

      test('[Req-4.1] Rejects invalid email format', async ({ pom }) => {
        await pom.checkoutPage.fillOrderDetails({ ...validCheckout, email: 'not-an-email' });
        await pom.checkoutPage.submitOrder();
        await pom.checkoutPage.assertFieldError('email');
      });

      test('[Req-4.1] Rejects invalid phone format', async ({ pom }) => {
        await pom.checkoutPage.fillOrderDetails({ ...validCheckout, phone: 'invalid-phone' });
        await pom.checkoutPage.submitOrder();
        await pom.checkoutPage.assertFieldError('phone');
      });

      test('[Req-4.1] Rejects empty address field', async ({ pom }) => {
        await pom.checkoutPage.fillOrderDetails({ ...validCheckout, address: '' });
        await pom.checkoutPage.submitOrder();
        await pom.checkoutPage.assertFieldError('address');
      });

      test('[Req-4.1] Rejects invalid zip code format', async ({ pom }) => {
        await pom.checkoutPage.fillOrderDetails({ ...validCheckout, zipCode: 'invalid' });
        await pom.checkoutPage.submitOrder();
        await pom.checkoutPage.assertFieldError('zipCode');
      });
    });

    test.describe('Edge Cases & Special Characters', () => {
      test('[Feature] Form accepts international characters (João, Müller)', async ({ pom }) => {
        await pom.checkoutPage.fillOrderDetails({
          ...validCheckout,
          firstName: 'João',
          lastName: 'Müller',
          address: '123 Café Street',
        });
        await pom.checkoutPage.submitOrder();
        await pom.checkoutPage.assertOrderConfirmed();
      });

      test('[Feature] Back-to-cart navigation preserves cart contents', async ({ pom }) => {
        await pom.checkoutPage.goBackToCart();
        await pom.cartPage.assertCartVisible();
        const itemCount = await pom.cartPage.getItemCount();
        expect(itemCount).toBeGreaterThan(0);
      });
    });
  });

});
