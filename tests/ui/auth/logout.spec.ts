import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { InventoryPage } from '../../../src/pages/InventoryPage';
import { users } from '../../../src/fixtures/users';

test.describe('Logout - Sauce Demo', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectPageLoaded();
  });

  test('should logout successfully via menu', async ({ page }) => {
    await inventoryPage.logout();
    await loginPage.expectLoginPage();
    await expect(page).toHaveURL(/.*saucedemo\.com\/$/);
  });

  test('should not be able to access inventory after logout', async ({ page }) => {
    await inventoryPage.logout();
    await loginPage.expectLoginPage();

    await page.goto('/inventory.html');
    await loginPage.expectErrorMessage(
      "Epic sadface: You can only access '/inventory.html' when you are logged in.",
    );
  });

  test('browser back button should not restore session after logout', async ({ page }) => {
    await inventoryPage.logout();
    await loginPage.expectLoginPage();

    await page.goBack();
    // After going back, should still be blocked or on login
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
