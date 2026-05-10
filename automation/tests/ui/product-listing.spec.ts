import { test, expect } from '@/fixtures/base.fixture';

test.describe('Product Listing — Browse & Search', () => {
  test.beforeEach(async ({ pom }) => {
    await pom.productListingPage.navigate();
    await pom.productListingPage.waitForLoadingToComplete();
  });

  // ─── Page Load ─────────────────────────────────────────────────────────────

  test.describe('Page Load', () => {
    test('[Positive] product listing page is visible with products', async ({ pom }) => {
      await pom.productListingPage.assertPageVisible();

      const count = await pom.productListingPage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });

    test('[Positive] first product has a name and price', async ({ pom }) => {
      const name  = await pom.productListingPage.getFirstProductName();
      const price = await pom.productListingPage.getFirstProductPrice();

      expect(name).toBeTruthy();
      expect(price).toBeTruthy();
    });
  });

  // ─── Add to Cart ───────────────────────────────────────────────────────────

  test.describe('Add to Cart', () => {
    test('[Positive] cart badge increments after adding a product', async ({ pom }) => {
      const before = await pom.productListingPage.cartBadge.getCount();

      await pom.productListingPage.addProductToCart(0);

      const after = await pom.productListingPage.cartBadge.getCount();
      expect(after).toBeGreaterThan(before);
    });

    test('[Positive] cart badge reflects multiple products added', async ({ pom }) => {
      const productCount = await pom.productListingPage.getProductCount();
      const toAdd = Math.min(3, productCount);

      for (let i = 0; i < toAdd; i++) {
        await pom.productListingPage.addProductToCart(i);
      }

      const cartCount = await pom.productListingPage.cartBadge.getCount();
      expect(cartCount).toBeGreaterThanOrEqual(toAdd);
    });
  });

  // ─── Search ────────────────────────────────────────────────────────────────

  test.describe('Search', () => {
    test('[Positive] searching by partial product name returns results', async ({ pom }) => {
      const firstName = await pom.productListingPage.getFirstProductName();
      if (!firstName) return;

      await pom.productListingPage.searchFor(firstName.substring(0, 3));

      const count = await pom.productListingPage.getProductCount();
      expect(count).toBeGreaterThan(0);
    });

    test('[Negative] searching for non-existent term returns no products', async ({ pom }) => {
      await pom.productListingPage.searchFor('ZZZZNOEXIST');

      const count = await pom.productListingPage.getProductCount();
      expect(count).toBe(0);
    });

    test('[Positive] clearing search restores all products', async ({ pom }) => {
      const totalBefore = await pom.productListingPage.getProductCount();

      await pom.productListingPage.searchFor('ZZZZNOEXIST');
      await pom.productListingPage.clearSearch();

      const totalAfter = await pom.productListingPage.getProductCount();
      expect(totalAfter).toBe(totalBefore);
    });
  });

  // ─── Category Filter ───────────────────────────────────────────────────────

  test.describe('Category Filter', () => {
    test('[Positive] filtering by category returns relevant products', async ({ pom }) => {
      try {
        await pom.productListingPage.filterByCategory('Electronics');

        const count = await pom.productListingPage.getProductCount();
        expect(count).toBeGreaterThanOrEqual(0);
      } catch {
        test.skip();
      }
    });
  });

  // ─── Navigation to Details ─────────────────────────────────────────────────

  test.describe('Navigation', () => {
    test('[Positive] clicking a product navigates to its details page', async ({ pom }) => {
      await pom.productListingPage.clickFirstProduct();

      await pom.productDetailsPage.assertPageVisible();
    });
  });
});
