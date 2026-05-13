import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  protected readonly url = '/checkout-complete.html';

  private readonly completeHeader = this.page.locator('[data-test="complete-header"]');
  private readonly completeText = this.page.locator('[data-test="complete-text"]');
  private readonly backHomeButton = this.page.locator('[data-test="back-to-products"]');

  constructor(page: Page) {
    super(page);
  }

  async expectOrderComplete(): Promise<void> {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
    await expect(this.completeText).toBeVisible();
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
