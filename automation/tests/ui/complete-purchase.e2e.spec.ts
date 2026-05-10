import { test, expect } from '@/fixtures/base.fixture';
import { validCheckout } from '@/testData/ui/checkout/checkoutData';
import { testProducts, multipleProducts } from '@/testData/ui/products/productData';

test.describe('Complete Purchase Flow — E2E', () => {

  // ─── End-to-End Positive Flow ──────────────────────────────────────────────

  test('[Positive] complete purchase flow — add multiple products and complete checkout', async ({ pom }) => {
    // Act: Navigate to product listing and verify products are available
    await pom.productListingPage.navigate();
    await pom.productListingPage.waitForLoadingToComplete();

    const productCount = await pom.productListingPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    // Act: Add each test product via its detail page with the specified quantity
    for (const product of multipleProducts) {
      await pom.productDetailsPage.navigateToProduct(product.id);
      await pom.productDetailsPage.waitForPageToLoad();

      const title = await pom.productDetailsPage.getTitle();
      expect(title).toBeTruthy();

      // Increase quantity to the configured amount (already starts at 1, so increase by quantity - 1)
      if (product.quantity > 1) {
        await pom.productDetailsPage.increaseQuantityBy(product.quantity - 1);
      }

      await pom.productDetailsPage.assertQuantity(product.quantity);
      await pom.productDetailsPage.addToCart();
    }

    // Assert: Cart badge reflects total number of unique product lines added
    const cartBadgeCount = await pom.productDetailsPage.cartBadge.getCount();
    expect(cartBadgeCount).toBeGreaterThan(0);

    // Act: Navigate to cart
    await pom.cartPage.navigate();
    await pom.cartPage.waitForCartToLoad();

    // Assert: All products appear in the cart
    const cartItemCount = await pom.cartPage.getItemCount();
    expect(cartItemCount).toBe(multipleProducts.length);

    // Assert: Cart summary is populated with a valid total
    const cartSummary = await pom.cartPage.getCartSummary();
    expect(cartSummary.subtotal).toBeTruthy();
    expect(cartSummary.total).toBeTruthy();

    const totalAmount = await pom.cartPage.getTotalAsNumber();
    expect(totalAmount).toBeGreaterThan(0);

    // Act: Proceed to checkout and fill valid order details
    await pom.cartPage.proceedToCheckout();
    await pom.checkoutPage.waitForPageToLoad();

    await pom.checkoutPage.fillOrderDetails(validCheckout);
    await pom.checkoutPage.submitOrder();

    // Assert: Order is confirmed and an order ID is issued
    await pom.checkoutPage.assertOrderConfirmed();
    const orderId = await pom.checkoutPage.getOrderId();
    expect(orderId).toBeTruthy();
  });

  // ─── Per-Product Detail Page Validation ────────────────────────────────────

  for (const product of testProducts) {
    test(`[Positive] product detail page loads correctly — ${product.name}`, async ({ pom }) => {
      await pom.productDetailsPage.navigateToProduct(product.id);
      await pom.productDetailsPage.waitForPageToLoad();

      // Assert: Core product information is present
      const title = await pom.productDetailsPage.getTitle();
      expect(title).toBeTruthy();

      const price = await pom.productDetailsPage.getPrice();
      expect(price).toBeTruthy();

      const category = await pom.productDetailsPage.getCategory();
      expect(category).toBeTruthy();

      // Assert: Add-to-cart control is enabled
      await pom.productDetailsPage.assertAddToCartEnabled();
      await pom.productDetailsPage.assertImageVisible();

      // Act: Set quantity to the product's configured test quantity
      if (product.quantity > 1) {
        await pom.productDetailsPage.increaseQuantityBy(product.quantity - 1);
      }
      await pom.productDetailsPage.assertQuantity(product.quantity);
    });
  }

  // ─── End-to-End Negative Flow ──────────────────────────────────────────────

  test('[Negative] purchase flow fails with validation error on incomplete checkout form', async ({ pom }) => {
    // Act: Navigate directly to a product and add it to cart (avoids the listing-page quick-add alert)
    await pom.productDetailsPage.navigateToProduct('1');
    await pom.productDetailsPage.waitForPageToLoad();
    await pom.productDetailsPage.addToCart();

    // Act: Navigate to cart and proceed to checkout
    await pom.cartPage.navigate();
    await pom.cartPage.waitForCartToLoad();

    const cartItemCount = await pom.cartPage.getItemCount();
    expect(cartItemCount).toBeGreaterThan(0);

    await pom.cartPage.proceedToCheckout();
    await pom.checkoutPage.waitForPageToLoad();

    // Act: Submit the form with firstName intentionally blank
    await pom.checkoutPage.fillOrderDetails({
      ...validCheckout,
      firstName: '',
    });
    await pom.checkoutPage.submitOrder();

    // Assert: Validation error is shown for the required firstName field
    await pom.checkoutPage.assertFieldError('firstName');

    // Assert: User remains on the checkout page (order was not placed)
    await pom.checkoutPage.assertFormVisible();
  });
});
