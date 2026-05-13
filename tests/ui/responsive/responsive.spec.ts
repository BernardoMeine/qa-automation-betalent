import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { InventoryPage } from '../../../src/pages/InventoryPage';
import { users } from '../../../src/fixtures/users';

const viewports = [
  { name: 'Mobile (iPhone 13)', width: 390, height: 844 },
  { name: 'Tablet (iPad)', width: 810, height: 1080 },
  { name: 'Desktop', width: 1920, height: 1080 },
];

test.describe('Responsive Design - Sauce Demo', () => {
  for (const viewport of viewports) {
    test.describe(`${viewport.name} - ${viewport.width}x${viewport.height}`, () => {
      test.use({ viewport: { width: viewport.width, height: viewport.height } });

      test('login page should render correctly', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();

        await expect(page.locator('[data-test="login-button"]')).toBeVisible();
        await expect(page.locator('[data-test="username"]')).toBeVisible();
        await expect(page.locator('[data-test="password"]')).toBeVisible();

        const loginButton = page.locator('[data-test="login-button"]');
        const box = await loginButton.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThan(0);
      });

      test('inventory page should display products', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        await loginPage.navigate();
        await loginPage.login(users.standard.username, users.standard.password);
        await inventoryPage.expectPageLoaded();

        const count = await inventoryPage.getProductCount();
        expect(count).toBe(6);
      });

      test('menu should be accessible', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        await loginPage.navigate();
        await loginPage.login(users.standard.username, users.standard.password);
        await inventoryPage.expectPageLoaded();

        await inventoryPage.openMenu();
        const menu = page.locator('.bm-menu-wrap');
        await expect(menu).toBeVisible();
      });

      test('cart should be accessible and functional', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        await loginPage.navigate();
        await loginPage.login(users.standard.username, users.standard.password);
        await inventoryPage.expectPageLoaded();

        await inventoryPage.addProductToCartByIndex(0);
        const cartLink = page.locator('[data-test="shopping-cart-link"]');
        await expect(cartLink).toBeVisible();

        const badge = page.locator('[data-test="shopping-cart-badge"]');
        await expect(badge).toBeVisible();
        await expect(badge).toHaveText('1');
      });

      test('footer should be visible', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(users.standard.username, users.standard.password);

        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
      });
    });
  }
});
