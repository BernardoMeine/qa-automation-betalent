import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/LoginPage';
import { InventoryPage } from '../../../src/pages/InventoryPage';
import { CartPage } from '../../../src/pages/CartPage';
import { CheckoutPage } from '../../../src/pages/CheckoutPage';
import { CheckoutCompletePage } from '../../../src/pages/CheckoutCompletePage';
import { users } from '../../../src/fixtures/users';
import { generateCheckoutInfo } from '../../../src/utils/data-generator';

test.describe('Full Purchase Flow - Sauce Demo', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let completePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    completePage = new CheckoutCompletePage(page);

    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectPageLoaded();
  });

  test('should complete full purchase with multiple items', async () => {
    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
    await inventoryPage.addProductToCartByName('Sauce Labs Onesie');

    await inventoryPage.goToCart();
    await cartPage.expectPageLoaded();
    expect(await cartPage.getCartItemCount()).toBe(3);

    await cartPage.checkout();
    await checkoutPage.expectStepOneLoaded();

    const info = generateCheckoutInfo();
    await checkoutPage.fillInformation(info.firstName, info.lastName, info.postalCode);
    await checkoutPage.continue();

    await checkoutPage.expectStepTwoLoaded();

    const overviewItems = await checkoutPage.getOverviewItemNames();
    expect(overviewItems).toContain('Sauce Labs Backpack');
    expect(overviewItems).toContain('Sauce Labs Bike Light');
    expect(overviewItems).toContain('Sauce Labs Onesie');

    await checkoutPage.finish();
    await completePage.expectOrderComplete();
  });

  test('should validate subtotal + tax = total', async () => {
    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');

    await inventoryPage.goToCart();
    await cartPage.checkout();

    const info = generateCheckoutInfo();
    await checkoutPage.fillInformation(info.firstName, info.lastName, info.postalCode);
    await checkoutPage.continue();
    await checkoutPage.expectStepTwoLoaded();

    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('should complete purchase with single item', async () => {
    await inventoryPage.addProductToCartByName('Sauce Labs Onesie');
    await inventoryPage.goToCart();
    await cartPage.checkout();

    const info = generateCheckoutInfo();
    await checkoutPage.fillInformation(info.firstName, info.lastName, info.postalCode);
    await checkoutPage.continue();
    await checkoutPage.finish();

    await completePage.expectOrderComplete();
  });

  test.describe('Checkout Validation', () => {
    test.beforeEach(async () => {
      await inventoryPage.addProductToCartByIndex(0);
      await inventoryPage.goToCart();
      await cartPage.checkout();
    });

    test('should show error when first name is empty', async () => {
      await checkoutPage.fillInformation('', 'Doe', '12345');
      await checkoutPage.continue();
      await checkoutPage.expectErrorMessage('Error: First Name is required');
    });

    test('should show error when last name is empty', async () => {
      await checkoutPage.fillInformation('John', '', '12345');
      await checkoutPage.continue();
      await checkoutPage.expectErrorMessage('Error: Last Name is required');
    });

    test('should show error when postal code is empty', async () => {
      await checkoutPage.fillInformation('John', 'Doe', '');
      await checkoutPage.continue();
      await checkoutPage.expectErrorMessage('Error: Postal Code is required');
    });
  });

  test('should return to cart from checkout step one via cancel', async ({ page }) => {
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.checkout();
    await checkoutPage.cancel();

    await cartPage.expectPageLoaded();
    expect(await cartPage.getCartItemCount()).toBe(1);
  });

  test('should go back to products after completing order', async () => {
    await inventoryPage.addProductToCartByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.checkout();

    const info = generateCheckoutInfo();
    await checkoutPage.fillInformation(info.firstName, info.lastName, info.postalCode);
    await checkoutPage.continue();
    await checkoutPage.finish();

    await completePage.expectOrderComplete();
    await completePage.backToProducts();
    await inventoryPage.expectPageLoaded();
  });
});
