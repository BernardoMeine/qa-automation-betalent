import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { InventoryPage } from '../../../src/pages/InventoryPage';
import { CartPage } from '../../../src/pages/CartPage';
import { CheckoutPage } from '../../../src/pages/CheckoutPage';
import { users } from '../../../src/fixtures/users';

test.describe('Navigation - Sauce Demo', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectPageLoaded();
  });

  test.describe('Menu Navigation', () => {
    test('should navigate to All Items from menu', async () => {
      await inventoryPage.goToCart();
      await inventoryPage.clickAllItems();
      await inventoryPage.expectPageLoaded();
    });

    test('should navigate to About page', async ({ page }) => {
      await inventoryPage.clickAbout();
      await expect(page).toHaveURL(/saucelabs\.com/);
    });

    test('should reset app state via menu', async () => {
      await inventoryPage.addProductToCartByIndex(0);
      await inventoryPage.addProductToCartByIndex(1);
      expect(await inventoryPage.getCartBadgeCount()).toBe(2);

      await inventoryPage.resetAppState();

      expect(await inventoryPage.getCartBadgeCount()).toBe(0);
    });
  });

  test.describe('Footer Links', () => {
    test('Twitter link should have correct URL and target', async ({ page }) => {
      const link = page.locator('[data-test="social-twitter"] a, a[data-test="social-twitter"]').first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', /twitter\.com|x\.com/);
      await expect(link).toHaveAttribute('target', '_blank');
    });

    test('Facebook link should have correct URL and target', async ({ page }) => {
      const link = page.locator('[data-test="social-facebook"] a, a[data-test="social-facebook"]').first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', /facebook\.com/);
      await expect(link).toHaveAttribute('target', '_blank');
    });

    test('LinkedIn link should have correct URL and target', async ({ page }) => {
      const link = page.locator('[data-test="social-linkedin"] a, a[data-test="social-linkedin"]').first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', /linkedin\.com/);
      await expect(link).toHaveAttribute('target', '_blank');
    });
  });

  test.describe('Browser Navigation', () => {
    test('back button during checkout should return to cart', async ({ page }) => {
      await inventoryPage.addProductToCartByIndex(0);
      await inventoryPage.goToCart();

      const cartPage = new CartPage(page);
      await cartPage.checkout();

      const checkoutPage = new CheckoutPage(page);
      await checkoutPage.expectStepOneLoaded();

      await page.goBack();
      await cartPage.expectPageLoaded();
    });

    test('back button from cart should return to inventory', async ({ page }) => {
      await inventoryPage.goToCart();
      await page.goBack();
      await inventoryPage.expectPageLoaded();
    });
  });

  test.describe('Cart Navigation', () => {
    test('should navigate to cart from inventory', async ({ page }) => {
      await inventoryPage.goToCart();
      const cartPage = new CartPage(page);
      await cartPage.expectPageLoaded();
    });

    test('cart icon should be visible on all pages', async ({ page }) => {
      const cartLink = page.locator('[data-test="shopping-cart-link"]');
      await expect(cartLink).toBeVisible();

      await inventoryPage.goToCart();
      await expect(cartLink).toBeVisible();
    });
  });
});
