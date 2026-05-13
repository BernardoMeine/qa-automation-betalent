import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { InventoryPage } from '../../../src/pages/InventoryPage';
import { CartPage } from '../../../src/pages/CartPage';
import { users } from '../../../src/fixtures/users';

test.describe('Cart Management - Sauce Demo', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectPageLoaded();
  });

  test.describe('Adding Items', () => {
    test('should add a single product to cart', async () => {
      await inventoryPage.addProductToCartByIndex(0);
      const badgeCount = await inventoryPage.getCartBadgeCount();
      expect(badgeCount).toBe(1);
    });

    test('should add multiple products to cart', async () => {
      await inventoryPage.addProductToCartByIndex(0);
      await inventoryPage.addProductToCartByIndex(1);
      await inventoryPage.addProductToCartByIndex(2);
      const badgeCount = await inventoryPage.getCartBadgeCount();
      expect(badgeCount).toBe(3);
    });

    test('should show correct items in cart page', async () => {
      await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
      await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
      await inventoryPage.goToCart();

      await cartPage.expectPageLoaded();
      const items = await cartPage.getCartItemNames();
      expect(items).toContain('Sauce Labs Backpack');
      expect(items).toContain('Sauce Labs Bike Light');
      expect(items.length).toBe(2);
    });

    test('button should change from Add to Remove after adding', async ({ page }) => {
      await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
      const button = inventoryPage.getAddToCartButton('Sauce Labs Backpack');
      await expect(button).toHaveText('Remove');
    });
  });

  test.describe('Removing Items from Inventory Page', () => {
    test('should remove item from cart via inventory page', async () => {
      await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
      expect(await inventoryPage.getCartBadgeCount()).toBe(1);

      await inventoryPage.removeProductByName('Sauce Labs Backpack');
      expect(await inventoryPage.getCartBadgeCount()).toBe(0);
    });

    test('badge should disappear when cart is empty', async ({ page }) => {
      await inventoryPage.addProductToCartByIndex(0);
      expect(await inventoryPage.getCartBadgeCount()).toBe(1);

      await inventoryPage.removeProductByName(
        (await inventoryPage.getProductNames())[0],
      );
      const badge = page.locator('[data-test="shopping-cart-badge"]');
      await expect(badge).not.toBeVisible();
    });
  });

  test.describe('Removing Items from Cart Page', () => {
    test('should remove item from cart page', async () => {
      await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
      await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
      await inventoryPage.goToCart();

      await cartPage.removeItemByName('Sauce Labs Backpack');
      const items = await cartPage.getCartItemNames();
      expect(items).not.toContain('Sauce Labs Backpack');
      expect(items).toContain('Sauce Labs Bike Light');
    });

    test('should update badge after removing from cart page', async () => {
      await inventoryPage.addProductToCartByIndex(0);
      await inventoryPage.addProductToCartByIndex(1);
      await inventoryPage.goToCart();

      await cartPage.removeItemByName(
        (await cartPage.getCartItemNames())[0],
      );
      expect(await cartPage.getCartBadgeCount()).toBe(1);
    });

    test('should show empty cart after removing all items', async ({ page }) => {
      await inventoryPage.addProductToCartByIndex(0);
      await inventoryPage.goToCart();

      const items = await cartPage.getCartItemNames();
      await cartPage.removeItemByName(items[0]);

      expect(await cartPage.getCartItemCount()).toBe(0);
      const badge = page.locator('[data-test="shopping-cart-badge"]');
      await expect(badge).not.toBeVisible();
    });
  });

  test.describe('Cart Persistence', () => {
    test('should continue shopping and keep cart items', async () => {
      await inventoryPage.addProductToCartByIndex(0);
      await inventoryPage.goToCart();
      await cartPage.continueShopping();

      await inventoryPage.expectPageLoaded();
      expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    });
  });
});
