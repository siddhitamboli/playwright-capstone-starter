import { test, expect } from '../fixtures';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { SellPage } from '../pages/SellPage';

// All five tests open the sell form for the first holding, "Bluechip Growth Fund".
// The sell form has two groups of radio buttons (Market and Settlement type), a quantity,
// a confirmation checkbox and a "Submit for Redemption" button.

// Selenium: SellTests.sellCashOnNse
//   Choose market NSE, settlement Cash, quantity 1, confirm, submit.
//   Expect the confirmation heading "Transaction submitted and under process",
//   the status "processing" and the settlement "cash".
test('07 Selling on NSE with cash settlement is confirmed', async ({
  loggedInPage,
}) => {
  const { page } = loggedInPage;
  const sell = new SellPage(page);

  await sell.open();
  await sell.chooseMarket('NSE');
  await sell.chooseSettlement('Cash');
  await sell.submit('1');

  const confirmation = new ConfirmationPage(page);
  await expect(confirmation.heading).toHaveText(
    'Transaction submitted and under process'
  );
  await expect(confirmation.status).toHaveText('processing');
  await expect(confirmation.settlement).toHaveText('cash');
});

// Selenium: SellTests.chequeNeedsBranch
//   Choose Cheque, quantity 1, confirm, submit, without filling in a branch.
//   Expect the alert "Cheque settlement requires a branch" and to stay on the sell page.
test('08 Cheque settlement without a branch is rejected', async ({
  loggedInPage,
}) => {
  const { page } = loggedInPage;
  const sell = new SellPage(page);

  await sell.open();
  await sell.chooseMarket('NSE');
  await sell.chooseSettlement('Cheque');
  await sell.submit('1');

  await expect(sell.errorMessage).toHaveText(
    'Cheque settlement requires a branch'
  );
  await expect(page).toHaveURL(/\/sell\//);
});

// Selenium: SellTests.chequeWithBranchConfirms
//   Choose NSE and Cheque, branch "Fort, Mumbai", quantity 1, confirm, submit.
//   Expect the settlement "cheque" and the status "processing".
test('09 Cheque settlement with a branch is confirmed', async ({
  loggedInPage,
}) => {
  const { page } = loggedInPage;
  const sell = new SellPage(page);

  await sell.open();
  await sell.chooseMarket('NSE');
  await sell.chooseSettlement('Cheque');
  await sell.enterChequeBranch('Fort, Mumbai');
  await sell.submit('1');

  const confirmation = new ConfirmationPage(page);
  await expect(confirmation.heading).toHaveText(
    'Transaction submitted and under process'
  );
  await expect(confirmation.status).toHaveText('processing');
  await expect(confirmation.settlement).toHaveText('cheque');
});

// Selenium: SellTests.oversellIsRejected
//   Quantity 9999, confirm, submit. Expect an alert like "Only 120 units available to sell".
//   The number depends on the account, so match the shape of the sentence.
test('10 Selling more than is held is rejected', async ({
  loggedInPage,
}) => {
  const { page } = loggedInPage;
  const sell = new SellPage(page);

  await sell.open();
  await sell.chooseMarket('NSE');
  await sell.chooseSettlement('Cash');
  await sell.submit('9999');

  await expect(sell.errorMessage).toHaveText(
    /^Only \d+ units available to sell$/
  );
  await expect(page).toHaveURL(/\/sell\//);
});

// Selenium: SellTests.saleReducesQuantityOnServer
//   Ask the API for the holding's quantity, sell 2 through the UI, ask the API again,
//   expect the quantity to be 2 lower. Playwright's request fixture replaces the Java HttpClient.
test('11 A sale reduces the quantity held on the server', async ({
  loggedInPage,
  api,
}) => {
  const { page, account } = loggedInPage;
  const sell = new SellPage(page);

  async function readQuantity(): Promise<number> {
    const response = await api.get(`account/${account.accountId}`);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    const holding = body.account.holdings.find(
      (item: { name: string; quantity: number }) =>
        item.name === 'Bluechip Growth Fund'
    );

    expect(holding).toBeDefined();
    return holding.quantity;
  }

  const before = await readQuantity();

  await sell.open();
  await sell.chooseMarket('NSE');
  await sell.chooseSettlement('Cash');
  await sell.submit('2');

  const confirmation = new ConfirmationPage(page);
  await expect(confirmation.heading).toHaveText(
    'Transaction submitted and under process'
  );

  const after = await readQuantity();

  expect(after).toBe(before - 2);
});