import { type Locator, type Page } from '@playwright/test';

export class ConfirmationPage {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByTestId('confirmation-heading');
  }

  get status(): Locator {
    return this.page.getByTestId('transaction-status');
  }

  get settlement(): Locator {
    return this.page.locator('dt:text-is("Settlement") + dd');
  }
}