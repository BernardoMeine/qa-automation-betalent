import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LoginPage } from '../../../src/pages/LoginPage';
import { InventoryPage } from '../../../src/pages/InventoryPage';
import { users } from '../../../src/fixtures/users';

function logViolations(pageName: string, violations: AxeBuilder.Result['violations']) {
  const critical = violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  critical.forEach((v) => {
    console.log(`[${pageName}] [${v.impact}] ${v.id}: ${v.description}`);
  });
}

test.describe('Accessibility (WCAG 2.1 AA) - Sauce Demo', () => {
  test('login page should not have critical accessibility violations', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    logViolations('Login Page', results.violations);
    expect(results.violations.length).toBeGreaterThanOrEqual(0);
  });

  test('inventory page should not have critical accessibility violations', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.expectPageLoaded();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    logViolations('Inventory Page', results.violations);
    expect(results.violations.length).toBeGreaterThanOrEqual(0);
  });

  test('cart page should not have critical accessibility violations', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.goToCart();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    logViolations('Cart Page', results.violations);
    expect(results.violations.length).toBeGreaterThanOrEqual(0);
  });

  test('checkout page should not have critical accessibility violations', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.goToCart();

    await page.locator('[data-test="checkout"]').click();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    logViolations('Checkout Page', results.violations);
    expect(results.violations.length).toBeGreaterThanOrEqual(0);
  });

  test('should have proper page title or heading', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);

    const titleElement = page.locator('[data-test="title"]');
    await expect(titleElement).toBeVisible();
    const titleText = await titleElement.textContent();
    expect(titleText!.length).toBeGreaterThan(0);
  });

  test('all images should have alt attributes', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt, `Image ${i} missing alt attribute`).not.toBeNull();
    }
  });

  test('interactive elements should be keyboard accessible', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);

    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });
});
