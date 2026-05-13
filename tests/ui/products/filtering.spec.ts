import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { InventoryPage } from '../../../src/pages/InventoryPage';
import { users } from '../../../src/fixtures/users';

test.describe('Product Filtering and Display - Sauce Demo', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectPageLoaded();
  });

  test('should display 6 products on inventory page', async () => {
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  test('all products should have names', async () => {
    const names = await inventoryPage.getProductNames();
    expect(names.length).toBe(6);
    names.forEach((name) => {
      expect(name.trim().length).toBeGreaterThan(0);
    });
  });

  test('all products should have valid prices', async () => {
    const prices = await inventoryPage.getProductPrices();
    expect(prices.length).toBe(6);
    prices.forEach((price) => {
      expect(price).toBeGreaterThan(0);
      expect(Number.isFinite(price)).toBeTruthy();
    });
  });

  test('sorting resets to default after navigating back from product detail', async ({ page }) => {
    // Known Sauce Demo behavior: sort resets to A-Z (default) after navigation
    await inventoryPage.sortBy('hilo');

    await inventoryPage.clickProduct((await inventoryPage.getProductNames())[0]);
    await page.goBack();

    const namesAfter = await inventoryPage.getProductNames();
    const sortedAZ = [...namesAfter].sort((a, b) => a.localeCompare(b));
    expect(namesAfter).toEqual(sortedAZ);
  });

  test('should toggle sort between ascending and descending', async () => {
    await inventoryPage.sortBy('az');
    const namesAZ = await inventoryPage.getProductNames();

    await inventoryPage.sortBy('za');
    const namesZA = await inventoryPage.getProductNames();

    expect(namesAZ).toEqual([...namesZA].reverse());
  });
});
