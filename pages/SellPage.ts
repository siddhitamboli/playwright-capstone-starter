import { type Locator, type Page } from '@playwright/test';

export class SellPage {
  constructor(private readonly page: Page) {}

  get errorMessage(): Locator {
    return this.page.getByRole('alert');
  }

  async open() {
    const holding = this.page
      .locator('.holdings-list')
      .getByRole('listitem')
      .filter({
        has: this.page.getByText('Bluechip Growth Fund', { exact: true }),
      });
    await holding.getByRole('button').click();
  }

  async chooseMarket(market: 'NSE' | 'BSE') {
    await this.page.getByRole('radio', { name: market, exact: true }).check();
  }

  async chooseSettlement(settlement: 'Cash' | 'Cheque') {
    await this.page.getByRole('radio', { name: settlement, exact: true }).check();
  }
  async enterChequeBranch(branch: string) {
    await this.page.locator('#chequeBranch').fill(branch);
  }

  async submit(quantity: string) {
    await this.page.locator('#quantity').fill(quantity);
    await this.page.getByRole('checkbox').check();
    await this.page.getByRole('button', {
      name: 'Submit for Redemption',
      exact: true,
    }).click();
  }
}