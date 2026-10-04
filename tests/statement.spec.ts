import { test, expect } from '../fixtures';
import { DashboardPage } from '../pages/DashboardPage';
import { StatementPage } from '../pages/StatementPage';

// The dashboard has a "View statement" link that opens the statement in a NEW WINDOW.
// Selenium handled that with getWindowHandles() and switchTo().window().

// Selenium: StatementTests.statementOpensInNewWindow
//   Click the link, wait until there are two windows, switch to the new one, expect the
//   heading "Account Statement", close it, and return to the dashboard.
test('13 The statement opens in a new window', async ({
  loggedInPage,
  context,
}) => {
  const { page, account } = loggedInPage;
  const dashboard = new DashboardPage(page);

  const [statement] = await Promise.all([
    context.waitForEvent('page'),
    dashboard.statementLink.click(),
  ]);

  expect(context.pages()).toHaveLength(2);
  const statementPage = new StatementPage(statement);

  await expect(statementPage.heading).toHaveText('Account Statement');

  await statement.close();

  await expect(dashboard.welcomeHeading).toHaveText(
    `Welcome, ${account.username}`
  );
});

// Selenium: StatementTests.termsCanBeAcceptedInIframe
//   In the statement window there is an iframe titled "Statement terms" with an
//   "Accept terms" button. Click it and expect the text "Terms accepted" inside the frame.
//   Selenium used switchTo().frame() and switchTo().defaultContent().
test('14 The terms can be accepted inside the iframe', async ({
  loggedInPage,
  context,
}) => {
  const { page } = loggedInPage;
  const dashboard = new DashboardPage(page);

  const [statement] = await Promise.all([
    context.waitForEvent('page'),
    dashboard.statementLink.click(),
  ]);

  const statementPage = new StatementPage(statement);
  const terms = statementPage.termsFrame;

  await terms.getByRole('button', {
    name: 'Accept terms',
    exact: true,
  }).click();

  await expect(
    terms.getByText('Terms accepted', { exact: true })
  ).toBeVisible();

  await expect(statementPage.heading).toHaveText('Account Statement');
});

// Selenium: StatementTests.marketFilterMultiSelect
//   The statement has a "Markets" multi-select. Choose BSE (1 holding, "National Infra Bond"),
//   then NSE and BSE together (3 holdings), then clear it (3 holdings again).
//   Selenium used the Select class: selectByValue, getAllSelectedOptions, deselectAll.
test('15 The market filter accepts several selections', async ({
  loggedInPage,
  context,
}) => {
  const { page } = loggedInPage;
  const dashboard = new DashboardPage(page);

  const [statement] = await Promise.all([
    context.waitForEvent('page'),
    dashboard.statementLink.click(),
  ]);

  const statementPage = new StatementPage(statement);
  const markets = statementPage.marketFilter;
  const holdings = statementPage.holdings;

  await expect(holdings).toHaveCount(3);

  await statementPage.selectMarkets(['BSE']);
  await expect(markets).toHaveValues(['BSE']);
  await expect(holdings).toHaveCount(1);
  await expect(holdings).toContainText(['National Infra Bond']);

  await statementPage.selectMarkets(['NSE', 'BSE']);
  await expect(markets).toHaveValues(['NSE', 'BSE']);
  await expect(holdings).toHaveCount(3);

  await statementPage.selectMarkets([]);
  await expect(markets).toHaveValues([]);
  await expect(holdings).toHaveCount(3);
});
