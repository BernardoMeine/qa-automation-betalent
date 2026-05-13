import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { InventoryPage } from '../../../src/pages/InventoryPage';
import { users, invalidCredentials } from '../../../src/fixtures/users';

test.describe('Login - Sauce Demo', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test.describe('Successful Login', () => {
    test('standard_user should login successfully', async ({ page }) => {
      await loginPage.login(users.standard.username, users.standard.password);
      const inventoryPage = new InventoryPage(page);
      await inventoryPage.expectPageLoaded();
      await expect(page).toHaveURL(/inventory/);
    });

    test('problem_user should login but have anomalous product images', async ({ page }) => {
      await loginPage.login(users.problem.username, users.problem.password);
      const inventoryPage = new InventoryPage(page);
      await inventoryPage.expectPageLoaded();

      const images = await inventoryPage.getAllProductImages();
      // problem_user shows the same image for all products (known bug)
      const uniqueImages = [...new Set(images)];
      // All 6 products should have different images; problem_user shows 1-2 unique
      expect(uniqueImages.length).toBeLessThan(images.length);
    });

    test('performance_glitch_user should login with noticeable delay', async ({ page }) => {
      const startTime = Date.now();
      await loginPage.login(users.performanceGlitch.username, users.performanceGlitch.password);

      const inventoryPage = new InventoryPage(page);
      await inventoryPage.expectPageLoaded();
      const loadTime = Date.now() - startTime;

      // Performance glitch user typically has >1s delay
      expect(loadTime).toBeGreaterThan(1000);
    });

    test('error_user should login successfully', async ({ page }) => {
      await loginPage.login(users.error.username, users.error.password);
      await expect(page).toHaveURL(/inventory/);
    });

    test('visual_user should login successfully', async ({ page }) => {
      await loginPage.login(users.visual.username, users.visual.password);
      await expect(page).toHaveURL(/inventory/);
    });
  });

  test.describe('Failed Login', () => {
    test('locked_out_user should see locked out error', async ({ page }) => {
      await loginPage.login(users.lockedOut.username, users.lockedOut.password);
      await expect(page.locator('[data-test="error"]')).toContainText(
        'Epic sadface: Sorry, this user has been locked out.',
      );
    });

    test('invalid username should show error', async ({ page }) => {
      await loginPage.login(
        invalidCredentials.wrongUsername.username,
        invalidCredentials.wrongUsername.password,
      );
      await expect(page.locator('[data-test="error"]')).toContainText(
        'Username and password do not match any user in this service',
      );
    });

    test('wrong password should show error', async ({ page }) => {
      await loginPage.login(
        invalidCredentials.wrongPassword.username,
        invalidCredentials.wrongPassword.password,
      );
      await expect(page.locator('[data-test="error"]')).toContainText(
        'Username and password do not match any user in this service',
      );
    });

    test('empty username should show required error', async ({ page }) => {
      await loginPage.login(
        invalidCredentials.emptyUsername.username,
        invalidCredentials.emptyUsername.password,
      );
      await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
    });

    test('empty password should show required error', async ({ page }) => {
      await loginPage.login(
        invalidCredentials.emptyPassword.username,
        invalidCredentials.emptyPassword.password,
      );
      await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
    });

    test('both fields empty should show username required error', async ({ page }) => {
      await loginPage.login(
        invalidCredentials.bothEmpty.username,
        invalidCredentials.bothEmpty.password,
      );
      await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
    });
  });
});
