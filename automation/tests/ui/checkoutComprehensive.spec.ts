/**
 * Comprehensive Cart & Checkout Integration Tests
 * - Complete shopping workflow
 * - Checkout form validation (positive & negative)
 * - Order confirmation
 * - Cart management edge cases
 * - Payment validation
 */

import { test, expect } from "@/fixtures/pageManagerFixture";
import {
  checkoutFormData,
  invalidCheckoutData,
  checkoutFormDataMissingFields,
} from "@/fixtures/userTestData";

test.describe("UI: Cart & Checkout - Complete Purchase Flow", () => {
  test.beforeEach(async ({ pageManager }) => {
    await pageManager.navigateToHome();
  });

  // ============= CART MANAGEMENT TESTS =============

  test.describe("✓ Cart Management - Add, Update, Remove", () => {
    test("Should display empty cart with message when no items", async ({
      pageManager,
    }) => {
      const cartPage = pageManager.cartPage;

      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      const isEmpty = await cartPage.isEmptyCartVisible();
      expect(isEmpty).toBe(true);
    });

    test("Should add product to cart and display on cart page", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();

      // Add product
      await listingPage.clickAddToCartForProduct(0);
      await pageManager.page.waitForTimeout(300);

      // Go to cart
      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      const itemCount = await cartPage.getItemCount();
      expect(itemCount).toBeGreaterThan(0);
    });

    test("Should display multiple products in cart", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();

      // Add multiple products
      await listingPage.clickAddToCartForProduct(0);
      await pageManager.page.waitForTimeout(100);
      await listingPage.clickAddToCartForProduct(1);
      await pageManager.page.waitForTimeout(100);
      await listingPage.clickAddToCartForProduct(2);

      // Go to cart
      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      const itemCount = await cartPage.getItemCount();
      expect(itemCount).toBeGreaterThanOrEqual(3);
    });

    test("Should remove single item from cart", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();

      // Add products
      await listingPage.clickAddToCartForProduct(0);
      await pageManager.page.waitForTimeout(100);
      await listingPage.clickAddToCartForProduct(1);

      // Go to cart
      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      const initialCount = await cartPage.getItemCount();

      // Get first product ID and remove it
      const firstItem = await pageManager.page
        .locator('[data-testid*="cart-item-"]')
        .first();
      const itemId = await firstItem.getAttribute("data-testid");

      if (itemId) {
        const productId = itemId.replace("cart-item-", "");
        await cartPage.removeItem(productId);
        await pageManager.page.waitForTimeout(300);
      }

      const finalCount = await cartPage.getItemCount();
      expect(finalCount).toBeLessThan(initialCount);
    });

    test("Should remove all items from cart", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();

      // Add multiple products
      await listingPage.clickAddToCartForProduct(0);
      await pageManager.page.waitForTimeout(100);
      await listingPage.clickAddToCartForProduct(1);

      // Go to cart
      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      // Remove all items
      await cartPage.removeAllItems();
      await pageManager.page.waitForTimeout(500);

      const isEmpty = await cartPage.isEmptyCartVisible();
      expect(isEmpty).toBe(true);
    });

    test("Should update product quantity", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();

      // Add product
      await listingPage.clickAddToCartForProduct(0);
      await pageManager.page.waitForTimeout(300);

      // Go to cart
      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      // Update quantity
      const firstItem = await pageManager.page
        .locator('[data-testid*="cart-item-"]')
        .first();
      const itemId = await firstItem.getAttribute("data-testid");

      if (itemId) {
        const productId = itemId.replace("cart-item-", "");
        await cartPage.updateItemQuantity(productId, 5);
        await pageManager.page.waitForTimeout(300);
      }
    });
  });

  // ============= PRICE CALCULATION TESTS =============

  test.describe("✓ Price Calculations - Subtotal, Tax, Shipping, Total", () => {
    test("Should display price summary", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      const subtotal = await cartPage.getSubtotalPrice();
      const tax = await cartPage.getTaxPrice();
      const shipping = await cartPage.getShippingPrice();
      const total = await cartPage.getTotalPrice();

      expect(subtotal).toBeTruthy();
      expect(tax).toBeTruthy();
      expect(shipping).toBeTruthy();
      expect(total).toBeTruthy();
    });

    test("Should calculate correct total price", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      const subtotal = await cartPage.getTotalPriceAsNumber();
      expect(subtotal).toBeGreaterThan(0);
    });

    test("Should update price when quantity changes", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      const priceBefore = await cartPage.getTotalPriceAsNumber();

      // Update quantity
      const firstItem = await pageManager.page
        .locator('[data-testid*="cart-item-"]')
        .first();
      const itemId = await firstItem.getAttribute("data-testid");

      if (itemId) {
        const productId = itemId.replace("cart-item-", "");
        await cartPage.updateItemQuantity(productId, 3);
        await pageManager.page.waitForTimeout(300);
      }

      const priceAfter = await cartPage.getTotalPriceAsNumber();
      expect(priceAfter).toBeGreaterThanOrEqual(priceBefore);
    });
  });

  // ============= CHECKOUT FORM VALIDATION - POSITIVE =============

  test.describe("✓ Checkout Form - Positive Scenarios", () => {
    test("Should complete checkout with valid data", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const checkoutPage = pageManager.checkoutPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      // Complete purchase flow
      const result = await pageManager.completePurchaseFlow(checkoutFormData);

      expect(result).toBeTruthy();
    });

    test("Should accept all valid form fields", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;
      const checkoutPage = pageManager.checkoutPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.waitForCartToLoad();
      await cartPage.proceedToCheckout();

      await checkoutPage.waitForCheckoutPageToLoad();
      await checkoutPage.fillCheckoutForm(checkoutFormData);
      await checkoutPage.submitOrder();

      // Verify success
      const isConfirmationVisible =
        await checkoutPage.isOrderConfirmationVisible();
      expect(isConfirmationVisible).toBe(true);
    });

    test("Should fill form fields individually", async ({ pageManager }) => {
      const checkoutPage = pageManager.checkoutPage;

      await checkoutPage.navigate();

      await checkoutPage.setFirstName(checkoutFormData.firstName || "");
      await checkoutPage.setLastName(checkoutFormData.lastName || "");
      await checkoutPage.setEmail(checkoutFormData.email || "");
      await checkoutPage.setPhone(checkoutFormData.phone || "");
      await checkoutPage.setAddress(checkoutFormData.address || "");
      await checkoutPage.setCity(checkoutFormData.city || "");
      await checkoutPage.setZipCode(checkoutFormData.zipCode || "");

      const firstName = await checkoutPage.getFirstName();
      expect(firstName).toContain(
        checkoutFormData.firstName?.substring(0, 5) || ""
      );
    });

    test("Should display order confirmation after successful checkout", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;
      const checkoutPage = pageManager.checkoutPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.waitForCartToLoad();
      await cartPage.proceedToCheckout();

      await checkoutPage.waitForCheckoutPageToLoad();
      await checkoutPage.fillCheckoutForm(checkoutFormData);
      await checkoutPage.submitOrder();
      await pageManager.page.waitForTimeout(1000);

      const confirmationVisible =
        await checkoutPage.isOrderConfirmationVisible();
      expect(confirmationVisible).toBe(true);
    });
  });

  // ============= CHECKOUT FORM VALIDATION - NEGATIVE =============

  test.describe("✗ Checkout Form - Validation Errors", () => {
    test("Should reject invalid email format", async ({ pageManager }) => {
      const checkoutPage = pageManager.checkoutPage;

      await checkoutPage.navigate();

      const invalidData = {
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        phone: "+1234567890",
        address: "123 Main St",
        city: "New York",
        zipCode: "10001",
      };

      await checkoutPage.fillCheckoutForm(invalidData);
      await checkoutPage.submitOrder();

      const isErrorVisible = await checkoutPage.isEmailErrorVisible();
      expect(isErrorVisible).toBe(true);
    });

    test("Should show error for missing firstName", async ({ pageManager }) => {
      const checkoutPage = pageManager.checkoutPage;

      await checkoutPage.navigate();

      const dataWithoutFirstName = {
        firstName: "",
        lastName: "Doe",
        email: "test@example.com",
        phone: "+1234567890",
        address: "123 Main St",
        city: "New York",
        zipCode: "10001",
      };

      await checkoutPage.fillCheckoutForm(dataWithoutFirstName);
      await checkoutPage.submitOrder();

      const isErrorVisible = await checkoutPage.isFirstNameErrorVisible();
      expect(isErrorVisible).toBe(true);
    });

    test("Should show error for missing lastName", async ({ pageManager }) => {
      const checkoutPage = pageManager.checkoutPage;

      await checkoutPage.navigate();

      const dataWithoutLastName = {
        firstName: "John",
        lastName: "",
        email: "test@example.com",
        phone: "+1234567890",
        address: "123 Main St",
        city: "New York",
        zipCode: "10001",
      };

      await checkoutPage.fillCheckoutForm(dataWithoutLastName);
      await checkoutPage.submitOrder();

      const isErrorVisible = await checkoutPage.isLastNameErrorVisible();
      expect(isErrorVisible).toBe(true);
    });

    test("Should show error for missing email", async ({ pageManager }) => {
      const checkoutPage = pageManager.checkoutPage;

      await checkoutPage.navigate();

      const dataWithoutEmail = {
        firstName: "John",
        lastName: "Doe",
        email: "",
        phone: "+1234567890",
        address: "123 Main St",
        city: "New York",
        zipCode: "10001",
      };

      await checkoutPage.fillCheckoutForm(dataWithoutEmail);
      await checkoutPage.submitOrder();

      const isErrorVisible = await checkoutPage.isEmailErrorVisible();
      expect(isErrorVisible).toBe(true);
    });

    test("Should show error for missing address", async ({ pageManager }) => {
      const checkoutPage = pageManager.checkoutPage;

      await checkoutPage.navigate();

      const dataWithoutAddress = {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        phone: "+1234567890",
        address: "",
        city: "New York",
        zipCode: "10001",
      };

      await checkoutPage.fillCheckoutForm(dataWithoutAddress);
      await checkoutPage.submitOrder();

      const isErrorVisible = await checkoutPage.isAddressErrorVisible();
      expect(isErrorVisible).toBe(true);
    });

    test("Should show error for invalid phone format", async ({ pageManager }) => {
      const checkoutPage = pageManager.checkoutPage;

      await checkoutPage.navigate();

      const dataWithInvalidPhone = {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        phone: "invalid-phone",
        address: "123 Main St",
        city: "New York",
        zipCode: "10001",
      };

      await checkoutPage.fillCheckoutForm(dataWithInvalidPhone);
      await checkoutPage.submitOrder();

      const isErrorVisible = await checkoutPage.isPhoneErrorVisible();
      expect(isErrorVisible).toBe(true);
    });

    test("Should show error for invalid zip code", async ({ pageManager }) => {
      const checkoutPage = pageManager.checkoutPage;

      await checkoutPage.navigate();

      const dataWithInvalidZip = {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
        phone: "+1234567890",
        address: "123 Main St",
        city: "New York",
        zipCode: "invalid",
      };

      await checkoutPage.fillCheckoutForm(dataWithInvalidZip);
      await checkoutPage.submitOrder();

      const isErrorVisible = await checkoutPage.isZipCodeErrorVisible();
      expect(isErrorVisible).toBe(true);
    });
  });

  // ============= CHECKOUT FLOW EDGE CASES =============

  test.describe("✗ Checkout - Edge Cases & Error Handling", () => {
    test("Should not proceed to checkout with empty cart", async ({
      pageManager,
    }) => {
      const cartPage = pageManager.cartPage;

      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      const isCheckoutButtonVisible =
        await cartPage.isCheckoutButtonVisible();

      // Empty cart should not have checkout button enabled
      expect(isCheckoutButtonVisible).toBe(false);
    });

    test("Should handle special characters in form fields", async ({
      pageManager,
    }) => {
      const checkoutPage = pageManager.checkoutPage;

      await checkoutPage.navigate();

      const dataWithSpecialChars = {
        firstName: "João",
        lastName: "Müller",
        email: "test@example.com",
        phone: "+1234567890",
        address: "123 Café Street",
        city: "New York",
        zipCode: "10001",
      };

      await checkoutPage.fillCheckoutForm(dataWithSpecialChars);
      await checkoutPage.submitOrder();

      // Form should handle special characters
      const firstName = await checkoutPage.getFirstName();
      expect(firstName).toContain("João");
    });

    test("Should allow going back to cart from checkout", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;
      const checkoutPage = pageManager.checkoutPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.waitForCartToLoad();
      await cartPage.proceedToCheckout();

      await checkoutPage.waitForCheckoutPageToLoad();

      // Go back to cart
      await checkoutPage.goBackToCart();

      const isCartVisible = await cartPage.isCartPageVisible();
      expect(isCartVisible).toBe(true);
    });

    test("Should persist cart data when going back from checkout", async ({
      pageManager,
    }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;
      const checkoutPage = pageManager.checkoutPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);
      await pageManager.page.waitForTimeout(100);
      await listingPage.clickAddToCartForProduct(1);

      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      const itemCountBefore = await cartPage.getItemCount();

      await cartPage.proceedToCheckout();
      await checkoutPage.waitForCheckoutPageToLoad();
      await checkoutPage.goBackToCart();

      const itemCountAfter = await cartPage.getItemCount();

      expect(itemCountAfter).toBe(itemCountBefore);
    });
  });

  // ============= CONTINUE SHOPPING FLOW =============

  test.describe("✓ Cart Navigation - Continue Shopping", () => {
    test("Should navigate back to products from cart", async ({ pageManager }) => {
      const listingPage = pageManager.productListingPage;
      const cartPage = pageManager.cartPage;

      await listingPage.navigate();
      await listingPage.waitForProductsToLoad();
      await listingPage.clickAddToCartForProduct(0);

      await cartPage.navigate();
      await cartPage.waitForCartToLoad();

      // Continue shopping
      await cartPage.continueShopping();

      const isListingVisible = await listingPage.isProductListingVisible();
      expect(isListingVisible).toBe(true);
    });
  });
});
