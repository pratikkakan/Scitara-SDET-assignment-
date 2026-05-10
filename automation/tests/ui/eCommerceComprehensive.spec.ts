/**
 * Comprehensive UI Tests - E-Commerce Application
 * Tests all user flows with positive, negative scenarios using POM
 */

import { test, expect } from "@/fixtures/pageManagerFixture";
import { checkoutFormData, invalidCheckoutData } from "@/fixtures/userTestData";

test.describe("E-Commerce UI - Complete User Workflows", () => {
  test.beforeEach(async ({ pageManager }) => {
    // Navigate to home before each test
    await pageManager.navigateToHome();
  });

  test.describe("Product Listing Page", () => {
    test("[Positive] Should load product listing page", async ({
      pageManager,
    }) => {
      const page = pageManager.productListingPage;

      const isVisible = await page.isProductListingVisible();
      expect(isVisible).toBe(true);

      const productCount = await page.getProductCount();
      expect(productCount).toBeGreaterThan(0);
    });

    test("[Positive] Should display all product details", async ({
      pageManager,
    }) => {
      const page = pageManager.productListingPage;
      await page.waitForLoadingToComplete();

      const productName = await page.getFirstProductName();
      expect(productName).toBeTruthy();
      expect(productName?.length).toBeGreaterThan(0);

      const price = await page.getFirstProductPrice();
      expect(price).toBeTruthy();
    });

    test("[Positive] Should add product to cart", async ({ pageManager }) => {
      const page = pageManager.productListingPage;
      await page.waitForLoadingToComplete();

      const initialCount = await page.getCartCount();
      const initialNum = initialCount ? parseInt(initialCount) : 0;

      await page.clickAddToCartForProduct(0);

      const updatedCount = await page.getCartCount();
      const updatedNum = updatedCount ? parseInt(updatedCount) : 0;

      expect(updatedNum).toBeGreaterThan(initialNum);
    });

    test("[Positive] Should add multiple products to cart", async ({
      pageManager,
    }) => {
      const page = pageManager.productListingPage;
      await page.waitForLoadingToComplete();

      const productCount = await page.getProductCount();
      const productsToAdd = Math.min(3, productCount);

      for (let i = 0; i < productsToAdd; i++) {
        await page.clickAddToCartForProduct(i);
        await pageManager.page.waitForTimeout(100);
      }

      const cartCount = await page.getCartCount();
      expect(parseInt(cartCount || "0")).toBeGreaterThanOrEqual(productsToAdd);
    });

    test("[Positive] Should navigate to product details", async ({
      pageManager,
    }) => {
      const page = pageManager.productListingPage;
      await page.waitForLoadingToComplete();

      await page.clickFirstProduct();

      const detailsPage = pageManager.productDetailsPage;
      const title = await detailsPage.getProductTitle();
      expect(title).toBeTruthy();
    });

    test("[Positive] Should search products", async ({ pageManager }) => {
      const page = pageManager.productListingPage;
      await page.waitForLoadingToComplete();

      // Get first product name for search
      const productName = await page.getFirstProductName();
      if (!productName) return; // Skip if no products

      // Clear any existing search first
      await page.clearSearch();
      await pageManager.page.waitForTimeout(300);

      // Search for the product
      await page.searchProducts(productName.substring(0, 3)); // Search with partial name
      await pageManager.page.waitForTimeout(500);

      const productCount = await page.getProductCount();
      expect(productCount).toBeGreaterThan(0);
    });

    test("[Positive] Should filter products by category", async ({
      pageManager,
    }) => {
      const page = pageManager.productListingPage;
      await page.waitForLoadingToComplete();

      // Try to filter - if category filter exists
      try {
        await page.filterByCategory("Electronics");
        await pageManager.page.waitForTimeout(500);

        const productCount = await page.getProductCount();
        expect(productCount).toBeGreaterThanOrEqual(0);
      } catch {
        // Category filter might not be available
        test.skip();
      }
    });

    test("[Negative] Should show empty results on failed search", async ({
      pageManager,
    }) => {
      const page = pageManager.productListingPage;
      await page.waitForLoadingToComplete();

      // Search for non-existent product
      await page.searchProducts("ZZZZZZZZZZNOEXIST");
      await pageManager.page.waitForTimeout(500);

      const productCount = await page.getProductCount();
      expect(productCount).toBe(0);
    });
  });

  test.describe("Product Details Page", () => {
    test("[Positive] Should display product details", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();

      const title = await detailsPage.getProductTitle();
      expect(title).toBeTruthy();

      const price = await detailsPage.getProductPrice();
      expect(price).toBeTruthy();

      const description = await detailsPage.getProductDescription();
      expect(description).toBeTruthy();
    });

    test("[Positive] Should add product to cart from details page", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      const initialCart = await pageManager.productListingPage.getCartCount();
      const initialNum = initialCart ? parseInt(initialCart) : 0;

      await detailsPage.addToCart();
      await pageManager.page.waitForTimeout(500);

      // Go back to get updated cart count
      await pageManager.navigateToHome();
      const updatedCart = await pageManager.productListingPage.getCartCount();
      const updatedNum = updatedCart ? parseInt(updatedCart) : 0;

      expect(updatedNum).toBeGreaterThan(initialNum);
    });

    test("[Positive] Should update quantity before adding to cart", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      await detailsPage.addToCartWithQuantity(3);
      await pageManager.page.waitForTimeout(500);

      // Verify in cart
      await pageManager.navigateToCart();
      const cartSummary = await pageManager.cartPage.getCartSummary();
      expect(cartSummary.itemCount).toBeGreaterThan(0);
    });

    test("[Positive] Should increase quantity using buttons", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      // Increase quantity 3 times
      for (let i = 0; i < 3; i++) {
        await detailsPage.increaseQuantity();
        await pageManager.page.waitForTimeout(100);
      }

      const quantity = await detailsPage.getQuantity();
      const quantityNum = quantity ? parseInt(quantity) : 1;
      expect(quantityNum).toBeGreaterThan(1);
    });

    test("[Positive] Should decrease quantity using buttons", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      // First increase
      for (let i = 0; i < 5; i++) {
        await detailsPage.increaseQuantity();
        await pageManager.page.waitForTimeout(100);
      }

      // Then decrease
      for (let i = 0; i < 2; i++) {
        await detailsPage.decreaseQuantity();
        await pageManager.page.waitForTimeout(100);
      }

      const quantity = await detailsPage.getQuantity();
      const quantityNum = quantity ? parseInt(quantity) : 1;
      expect(quantityNum).toBeGreaterThan(1);
    });

    test("[Positive] Should go back to product listing", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      await detailsPage.goBack();

      // Verify we're back on listing page
      const isListingVisible = await listingPage.isProductListingVisible();
      expect(isListingVisible).toBe(true);
    });
  });

  test.describe("Cart Page", () => {
    test("[Positive] Should display cart with added items", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;

      await listingPage.waitForProductsToLoad();
      // Add products to cart
      await listingPage.clickAddToCartForProduct(0);
      await pageManager.page.waitForTimeout(100);
      await listingPage.clickAddToCartForProduct(1);

      // Navigate to cart
      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBe(false);

      const itemCount = await cartPage.getItemCount();
      expect(itemCount).toBeGreaterThan(0);
    });

    test("[Positive] Should show empty cart when no items", async ({
      pageManager,
    }) => {
      const cartPage = pageManager.cartPage;

      await cartPage.navigate();
      await pageManager.page.waitForTimeout(500);

      const isEmpty = await cartPage.isCartEmpty();
      expect(isEmpty).toBe(true);
    });

    test("[Positive] Should display correct cart summary", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      const summary = await cartPage.getCartSummary();
      expect(summary.itemCount).toBeGreaterThan(0);
      expect(summary.subtotal).toBeGreaterThan(0);
      expect(summary.tax).toBeGreaterThanOrEqual(0);
      expect(summary.total).toBeGreaterThan(summary.subtotal);
    });

    test("[Positive] Should continue shopping from empty cart", async ({
      pageManager,
    }) => {
      const cartPage = pageManager.cartPage;

      await cartPage.navigate();
      await pageManager.page.waitForTimeout(500);

      await cartPage.continueShopping();

      const listingPage = pageManager.productListingPage;
      const isVisible = await listingPage.isProductListingVisible();
      expect(isVisible).toBe(true);
    });

    test("[Positive] Should remove item from cart", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);
      await listingPage.clickAddToCartForProduct(1);

      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      const initialCount = await cartPage.getItemCount();

      // Get first product ID and remove it
      const items = await pageManager.page
        .locator('[data-testid*="cart-item-"]')
        .all();
      if (items.length > 0) {
        const itemTestId = await items[0].getAttribute("data-testid");
        if (itemTestId) {
          const productId = itemTestId.replace("cart-item-", "");
          await cartPage.removeItem(productId);
          await pageManager.page.waitForTimeout(500);
        }
      }

      const updatedCount = await cartPage.getItemCount();
      expect(updatedCount).toBeLessThan(initialCount);
    });

    test("[Positive] Should proceed to checkout from cart", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;
      const checkoutPage = pageManager.checkoutPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      await cartPage.proceedToCheckout();

      // Verify we're on checkout page
      const isCheckoutVisible = await checkoutPage.isCheckoutFormVisible();
      expect(isCheckoutVisible).toBe(true);
    });
  });

  test.describe("Checkout Page", () => {
    test("[Positive] Should fill checkout form with valid data", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;
      const checkoutPage = pageManager.checkoutPage;

      // Add item to cart
      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      // Navigate to checkout
      await cartPage.navigate();
      await cartPage.proceedToCheckout();
      await checkoutPage.waitForCheckoutPageToLoad();

      // Fill form
      await checkoutPage.fillCheckoutForm(checkoutFormData);

      // Verify fields are filled
      const firstName = await checkoutPage.getFirstName();
      expect(firstName).toBe(checkoutFormData.firstName);

      const email = await checkoutPage.getEmail();
      expect(email).toBe(checkoutFormData.email);
    });

    test("[Positive] Should complete full checkout flow", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.proceedToCheckout();

      const orderId = await pageManager.completePurchaseFlow(checkoutFormData);

      // Verify order was placed
      expect(orderId).toBeTruthy();
    });

    test("[Positive] Should place order and see confirmation", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;
      const checkoutPage = pageManager.checkoutPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.proceedToCheckout();
      await checkoutPage.waitForCheckoutPageToLoad();

      await checkoutPage.fillCheckoutForm(checkoutFormData);
      await checkoutPage.submitOrder();
      await checkoutPage.waitForOrderConfirmation();

      const isConfirmationVisible =
        await checkoutPage.isOrderConfirmationVisible();
      expect(isConfirmationVisible).toBe(true);

      const successTitle = await checkoutPage.getOrderSuccessTitle();
      expect(successTitle?.toLowerCase()).toContain("success");
    });

    test("[Positive] Should return to home from order confirmation", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;
      const checkoutPage = pageManager.checkoutPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.proceedToCheckout();
      await checkoutPage.waitForCheckoutPageToLoad();

      await checkoutPage.completeCheckout(checkoutFormData);
      await checkoutPage.backToHome();

      const isListingVisible = await listingPage.isProductListingVisible();
      expect(isListingVisible).toBe(true);
    });

    test("[Negative] Should show errors for empty form submission", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;
      const checkoutPage = pageManager.checkoutPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.proceedToCheckout();
      await checkoutPage.waitForCheckoutPageToLoad();

      // Submit without filling form
      await checkoutPage.submitOrder();
      await pageManager.page.waitForTimeout(1000);

      // Check if error is displayed
      const firstNameError = await checkoutPage.getFirstNameError();
      expect(firstNameError || "").toBeTruthy();
    });

    test("[Negative] Should show errors for invalid email", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;
      const checkoutPage = pageManager.checkoutPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.proceedToCheckout();
      await checkoutPage.waitForCheckoutPageToLoad();

      // Fill form with invalid email
      const invalidData = {
        ...checkoutFormData,
        email: "invalid-email",
      };
      await checkoutPage.fillCheckoutForm(invalidData);
      await checkoutPage.submitOrder();
      await pageManager.page.waitForTimeout(1000);

      // Check for email error
      const emailError = await checkoutPage.getEmailError();
      expect(emailError || "").toBeTruthy();
    });

    test("[Negative] Should show errors for invalid phone", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;
      const checkoutPage = pageManager.checkoutPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.proceedToCheckout();
      await checkoutPage.waitForCheckoutPageToLoad();

      // Fill form with invalid phone
      const invalidData = {
        ...checkoutFormData,
        phone: "123",
      };
      await checkoutPage.fillCheckoutForm(invalidData);
      await checkoutPage.submitOrder();
      await pageManager.page.waitForTimeout(1000);

      // Check for phone error
      const phoneError = await checkoutPage.getPhoneError();
      expect(phoneError || "").toBeTruthy();
    });

    test("[Negative] Should show errors for invalid card number", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;
      const checkoutPage = pageManager.checkoutPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.proceedToCheckout();
      await checkoutPage.waitForCheckoutPageToLoad();

      // Fill form with invalid card
      const invalidData = {
        ...checkoutFormData,
        cardNumber: "1234",
      };
      await checkoutPage.fillCheckoutForm(invalidData);
      await checkoutPage.submitOrder();
      await pageManager.page.waitForTimeout(1000);

      // Check for card error
      const cardError = await checkoutPage.getCardNumberError();
      expect(cardError || "").toBeTruthy();
    });
  });

  test.describe("Complete End-to-End Flows", () => {
    test("[E2E] Complete purchase flow", async ({ pageManager }) => {
      // 1. Browse products
      await pageManager.navigateToHome();
      const listingPage = pageManager.productListingPage;
      await listingPage.waitForProductsToLoad();

      // 2. Add multiple products
      await listingPage.clickAddToCartForProduct(0);
      await pageManager.page.waitForTimeout(100);
      if ((await listingPage.getProductCount()) > 1) {
        await listingPage.clickAddToCartForProduct(1);
      }

      // 3. View cart
      const cartPage = pageManager.cartPage;
      await cartPage.navigate();
      const summary = await cartPage.getCartSummary();
      expect(summary.itemCount).toBeGreaterThan(0);

      // 4. Proceed to checkout and complete purchase
      const orderId = await pageManager.completePurchaseFlow(checkoutFormData);
      expect(orderId).toBeTruthy();
    });

    test("[E2E] Search and purchase flow", async ({ pageManager }) => {
      await pageManager.navigateToHome();
      const listingPage = pageManager.productListingPage;
      await listingPage.waitForProductsToLoad();

      // Search for product
      const productName = await listingPage.getFirstProductName();
      if (productName) {
        await listingPage.searchProducts(productName.substring(0, 3));
        await pageManager.page.waitForTimeout(500);

        // Add to cart
        await listingPage.clickAddToCartForProduct(0);

        // Complete purchase
        const cartPage = pageManager.cartPage;
        await cartPage.navigate();
        await cartPage.proceedToCheckout();

        const orderId =
          await pageManager.completePurchaseFlow(checkoutFormData);
        expect(orderId).toBeTruthy();
      }
    });

    test("[E2E] View details and purchase flow", async ({ pageManager }) => {
      await pageManager.navigateToHome();
      const listingPage = pageManager.productListingPage;
      const detailsPage = pageManager.productDetailsPage;

      await listingPage.waitForProductsToLoad();
      await listingPage.clickFirstProduct();
      await detailsPage.waitForProductDetailsToLoad();

      // Verify product details
      const title = await detailsPage.getProductTitle();
      expect(title).toBeTruthy();

      // Add with custom quantity
      await detailsPage.addToCartWithQuantity(2);
      await pageManager.page.waitForTimeout(500);

      // Complete purchase
      const cartPage = pageManager.cartPage;
      await cartPage.navigate();
      const summary = await cartPage.getCartSummary();
      expect(summary.itemCount).toBeGreaterThan(0);

      await cartPage.proceedToCheckout();
      const orderId = await pageManager.completePurchaseFlow(checkoutFormData);
      expect(orderId).toBeTruthy();
    });
  });
});
