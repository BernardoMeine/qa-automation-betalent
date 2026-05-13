import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected abstract readonly url: string;

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.page.locator('[data-test="shopping-cart-badge"]');
    if (await badge.isVisible()) {
      const text = await badge.textContent();
      return parseInt(text || '0', 10);
    }
    return 0;
  }

  async openMenu(): Promise<void> {
    await this.page.locator('#react-burger-menu-btn').click();
    await this.page.locator('.bm-menu-wrap').waitFor({ state: 'visible' });
  }

  async closeMenu(): Promise<void> {
    await this.page.locator('#react-burger-cross-btn').click();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.page.locator('[data-test="logout-sidebar-link"]').click();
  }

  async clickAllItems(): Promise<void> {
    await this.openMenu();
    await this.page.locator('[data-test="inventory-sidebar-link"]').click();
  }

  async clickAbout(): Promise<void> {
    await this.openMenu();
    await this.page.locator('[data-test="about-sidebar-link"]').click();
  }

  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.page.locator('[data-test="reset-sidebar-link"]').click();
  }

  async goToCart(): Promise<void> {
    await this.page.locator('[data-test="shopping-cart-link"]').click();
  }

  protected getFooterLink(name: string): Locator {
    return this.page.locator(`[data-test="social-${name}"]`);
  }
}
