import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  protected readonly url = '/checkout-step-one.html';

  private readonly firstNameInput = this.page.locator('[data-test="firstName"]');
  private readonly lastNameInput = this.page.locator('[data-test="lastName"]');
  private readonly postalCodeInput = this.page.locator('[data-test="postalCode"]');
  private readonly continueButton = this.page.locator('[data-test="continue"]');
  private readonly cancelButton = this.page.locator('[data-test="cancel"]');
  private readonly errorMessage = this.page.locator('[data-test="error"]');

  constructor(page: Page) {
    super(page);
  }

  async expectStepOneLoaded(): Promise<void> {
    await expect(this.page.locator('[data-test="title"]')).toHaveText('Checkout: Your Information');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async expectErrorMessage(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }

  // Step Two - Overview
  async expectStepTwoLoaded(): Promise<void> {
    await expect(this.page.locator('[data-test="title"]')).toHaveText('Checkout: Overview');
  }

  async getSubtotal(): Promise<number> {
    const text = await this.page.locator('[data-test="subtotal-label"]').textContent();
    return parseFloat((text || '0').replace('Item total: $', ''));
  }

  async getTax(): Promise<number> {
    const text = await this.page.locator('[data-test="tax-label"]').textContent();
    return parseFloat((text || '0').replace('Tax: $', ''));
  }

  async getTotal(): Promise<number> {
    const text = await this.page.locator('[data-test="total-label"]').textContent();
    return parseFloat((text || '0').replace('Total: $', ''));
  }

  async finish(): Promise<void> {
    await this.page.locator('[data-test="finish"]').click();
  }

  async getOverviewItemNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }
}
