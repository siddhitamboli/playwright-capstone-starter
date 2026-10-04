import { test, expect } from '../fixtures';
import { DashboardPage } from '../pages/DashboardPage';

// Selenium: DashboardTests.dashboardListsHoldings
//   Logs in as the shared demo account, then checks: 3 holdings, the first one is
//   "Bluechip Growth Fund", and its details start with "NSE".
test('04 Dashboard lists the holdings for the account', async ({
  loggedInPage,
}) => {
  const { page } = loggedInPage;
  const dashboard = new DashboardPage(page);
  const holdings = dashboard.holdings;

  await expect(holdings).toHaveCount(3);
  await expect(
    holdings.first().getByText('Bluechip Growth Fund', { exact: true })
  ).toBeVisible();
  await expect(
    holdings.first().getByText(/^NSE\b/)
  ).toBeVisible();
});

// Selenium: DashboardTests.emptyAccountShowsMessage
//   Logs in as the account "emptyholder" and expects the text "No holdings remaining."
//   and zero holdings. Playwright can create an account that has no holdings on demand.
test.describe('Account with no holdings', () => {
  test.use({ seedOptions: { holdings: [] } });

  test('05 An account with no holdings shows the empty message', async ({
    loggedInPage,
  }) => {
    const { page } = loggedInPage;
    const dashboard = new DashboardPage(page);

    await expect(dashboard.noHoldingsMessage).toBeVisible();
    await expect(dashboard.holdings).toHaveCount(0);
  });
});