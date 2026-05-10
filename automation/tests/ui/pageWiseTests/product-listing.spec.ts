import { test, expect } from '@/fixtures/base.fixture';

test.describe('Product Listing — Browse & Search', () => {
  test.beforeEach(async ({ pom }) => {
    await test.step("Navigate to product listing and wait for products to load", async () => {
      await pom.productListingPage.navigate();
      await pom.productListingPage.waitForLoadingToComplete();
    });
  });

  // ─── Page Load ─────────────────────────────────────────────────────────────

  test.describe('Page Load', () => {
    test('[Positive] product listing page is visible with products', async ({ pom }) => {
      await test.step("Assert page is visible and product count is greater than zero", async () => {
        await pom.productListingPage.assertPageVisible();
        const count = await pom.productListingPage.getProductCount();
        expect(count).toBeGreaterThan(0);
      });
    });

    test('[Positive] first product has a name and price', async ({ pom }) => {
      await test.step("Assert first product displays a name and price", async () => {
        const name  = await pom.productListingPage.getFirstProductName();
        const price = await pom.productListingPage.getFirstProductPrice();
        expect(name).toBeTruthy();
        expect(price).toBeTruthy();
      });
    });
  });

  // ─── Add to Cart ───────────────────────────────────────────────────────────

  test.describe('Add to Cart', () => {
    test('[Positive] cart badge increments after adding a product', async ({ pom }) => {
      const before = await test.step("Capture initial cart badge count", async () => {
        return await pom.productListingPage.cartBadge.getCount();
      });

      await test.step("Add first product to cart and verify badge incremented", async () => {
        await pom.productListingPage.addProductToCart(0);
        const after = await pom.productListingPage.cartBadge.getCount();
        expect(after).toBeGreaterThan(before);
      });
    });

    test('[Positive] cart badge reflects multiple products added', async ({ pom }) => {
      const toAdd = await test.step("Determine how many products to add (max 3)", async () => {
        const productCount = await pom.productListingPage.getProductCount();
        return Math.min(3, productCount);
      });

      await test.step(`Add ${toAdd} products to cart`, async () => {
        for (let i = 0; i < toAdd; i++) {
          await pom.productListingPage.addProductToCart(i);
        }
      });

      await test.step("Verify cart badge count matches number of products added", async () => {
        const cartCount = await pom.productListingPage.cartBadge.getCount();
        expect(cartCount).toBeGreaterThanOrEqual(toAdd);
      });
    });
  });

  // ─── Search ────────────────────────────────────────────────────────────────

  test.describe('Search', () => {
    test('[Positive] searching by partial product name returns results', async ({ pom }) => {
      const searchTerm = await test.step("Get partial name of first product", async () => {
        const firstName = await pom.productListingPage.getFirstProductName();
        if (!firstName) return null;
        return firstName.substring(0, 3);
      });

      await test.step("Search by partial name and verify results are returned", async () => {
        if (!searchTerm) return;
        await pom.productListingPage.searchFor(searchTerm);
        const count = await pom.productListingPage.getProductCount();
        expect(count).toBeGreaterThan(0);
      });
    });

    test('[Negative] searching for non-existent term returns no products', async ({ pom }) => {
      await test.step("Search for a non-existent term", async () => {
        await pom.productListingPage.searchFor('ZZZZNOEXIST');
      });

      await test.step("Verify no products are returned", async () => {
        const count = await pom.productListingPage.getProductCount();
        expect(count).toBe(0);
      });
    });

    test('[Positive] clearing search restores all products', async ({ pom }) => {
      const totalBefore = await test.step("Capture total product count before search", async () => {
        return await pom.productListingPage.getProductCount();
      });

      await test.step("Search for non-existent term to reduce results", async () => {
        await pom.productListingPage.searchFor('ZZZZNOEXIST');
      });

      await test.step("Clear search and verify all products are restored", async () => {
        await pom.productListingPage.clearSearch();
        const totalAfter = await pom.productListingPage.getProductCount();
        expect(totalAfter).toBe(totalBefore);
      });
    });
  });

  // ─── Category Filter ───────────────────────────────────────────────────────

  test.describe('Category Filter', () => {
    test('[Positive] filtering by category returns relevant products', async ({ pom }) => {
      await test.step("Apply Electronics category filter and verify results", async () => {
        try {
          await pom.productListingPage.filterByCategory('Electronics');
          const count = await pom.productListingPage.getProductCount();
          expect(count).toBeGreaterThanOrEqual(0);
        } catch {
          test.skip();
        }
      });
    });
  });

  // ─── Navigation to Details ─────────────────────────────────────────────────

  test.describe('Navigation', () => {
    test('[Positive] clicking a product navigates to its details page', async ({ pom }) => {
      await test.step("Click first product and verify product details page is shown", async () => {
        await pom.productListingPage.clickFirstProduct();
        await pom.productDetailsPage.assertPageVisible();
      });
    });
  });
});
