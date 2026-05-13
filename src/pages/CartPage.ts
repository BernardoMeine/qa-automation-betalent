import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  protected readonly url = '/cart.html';

  private readonly cartItems = this.page.locator('[data-test="inventory-item"]');
  private readonly checkoutButton = this.page.locator('[data-test="checkout"]');
  private readonly continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');

  constructor(page: Page) {
    super(page);
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.page.locator('[data-test="title"]')).toHaveText('Your Cart');
  }

  async getCartItemNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async removeItemByName(name: string): Promise<void> {
    const item = this.cartItems.filter({ hasText: name });
    await item.locator('button:has-text("Remove")').click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async getItemPrice(name: string): Promise<number> {
    const item = this.cartItems.filter({ hasText: name });
    const priceText = await item.locator('[data-test="inventory-item-price"]').textContent();
    return parseFloat((priceText || '0').replace('$', ''));
  }
}
