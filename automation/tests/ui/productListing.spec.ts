/**
 * Sample UI test template - Product Listing Page
 */

import { test, expect } from "@playwright/test";

test.describe("E-Commerce Product Listing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Should display product list", async ({ page }) => {
    const products = page.locator('[data-testid="product-item"]');
    await expect(products).toHaveCount(8);
  });

  test("Should add product to cart", async ({ page }) => {
    const addToCartBtn = page
      .locator('[data-testid="add-to-cart-btn"]')
      .first();
    await addToCartBtn.click();

    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toContainText("1");
  });

  test("Should navigate to product details", async ({ page }) => {
    const productLink = page.locator('[data-testid="product-link"]').first();
    await productLink.click();

    await expect(page).toHaveURL(/\/products\/\d+/);
  });

  test("Should filter products by category", async ({ page }) => {
    const categoryFilter = page.locator('[data-testid="category-filter"]');
    await categoryFilter.selectOption("Electronics");

    const products = page.locator('[data-testid="product-item"]');
    await expect(products).not.toHaveCount(0);
  });
});
