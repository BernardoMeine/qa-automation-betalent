import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  protected readonly url = '/inventory.html';

  private readonly sortDropdown = this.page.locator('[data-test="product-sort-container"]');
  private readonly inventoryItems = this.page.locator('[data-test="inventory-item"]');
  private readonly inventoryItemNames = this.page.locator('[data-test="inventory-item-name"]');
  private readonly inventoryItemPrices = this.page.locator('[data-test="inventory-item-price"]');

  constructor(page: Page) {
    super(page);
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return this.inventoryItemNames.allTextContents();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryItemPrices.allTextContents();
    return priceTexts.map((text) => parseFloat(text.replace('$', '')));
  }

  async addProductToCartByIndex(index: number): Promise<void> {
    const item = this.inventoryItems.nth(index);
    await item.locator('button:has-text("Add to cart")').click();
  }

  async addProductToCartByName(name: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: name });
    await item.locator('button:has-text("Add to cart")').click();
  }

  async removeProductByName(name: string): Promise<void> {
    const item = this.inventoryItems.filter({ hasText: name });
    await item.locator('button:has-text("Remove")').click();
  }

  async getProductCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async getAllProductImages(): Promise<string[]> {
    const images = this.page.locator('[data-test="inventory-item"] img');
    const srcs: string[] = [];
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute('src');
      srcs.push(src || '');
    }
    return srcs;
  }

  async clickProduct(name: string): Promise<void> {
    await this.inventoryItemNames.filter({ hasText: name }).click();
  }

  getAddToCartButton(productName: string): Locator {
    const item = this.inventoryItems.filter({ hasText: productName });
    return item.locator('button');
  }
}
