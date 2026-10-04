import { test, expect } from '../fixtures';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';

// Selenium: IsolationTests.seededAccountStartsClean
//   Creates an account through the API, logs in as it through the login page, and checks:
//   the welcome text, 3 holdings and the balance "₹1,25,000.50".

test('12 A freshly seeded account starts with the default holdings and balance', async ({
  page,
  createAccount,
}) => {
  const account = await createAccount();
  const login = new LoginPage(page);

  await login.open();
  await login.login('Retail Banking', account.username, account.password);
  await expect(page).toHaveURL(/\/dashboard/);

  const dashboard = new DashboardPage(page);
  await expect(dashboard.welcomeHeading).toHaveText(`Welcome, ${account.username}`);
  await expect(dashboard.holdings).toHaveCount(3);
  await expect(dashboard.balance).toHaveText('₹1,25,000.50');
});
