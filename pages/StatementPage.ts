import { type FrameLocator, type Locator, type Page } from '@playwright/test';

export class StatementPage {
  constructor(private readonly page: Page) {}

  get heading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  get marketFilter(): Locator {
    return this.page.getByLabel('Markets');
  }

  get holdings(): Locator {
    return this.page.getByTestId('statement-list').getByRole('listitem');
  }

  get termsFrame(): FrameLocator {
    return this.page.frameLocator('iframe[title="Statement terms"]');
  }

  async selectMarkets(markets: string[]) {
    await this.marketFilter.selectOption(markets);
  }
}