import { type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  get welcomeHeading(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  get areaBadge(): Locator {
    return this.page.locator('.area-badge');
  }

  get holdings(): Locator {
    return this.page.locator('.holdings-list').getByRole('listitem');
  }

  get noHoldingsMessage(): Locator {
    return this.page.getByText('No holdings remaining.', { exact: true });
  }

  get balance(): Locator {
    return this.page.getByTestId('account-balance');
  }

  get logOutButton(): Locator {
    return this.page.getByRole('button', { name: 'Log Out', exact: true });
  }

  get statementLink(): Locator {
    return this.page.getByRole('link', { name: 'View statement', exact: true });
  }

  async logOut() {
    await this.logOutButton.click();
  }
}