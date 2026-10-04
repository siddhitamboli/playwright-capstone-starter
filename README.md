# Holdings Sandbox: Playwright capstone starter

You are converting a Selenium + Java suite (the `selenium-holdings-suite` folder) to Playwright with TypeScript. The app is the same Holdings Sandbox you have used all week.

## Set up

```
npm install
npx playwright install chromium
```

Start the Sandbox (`npm run dev` in its folder), then:

```
npx playwright test          # runs what you have converted so far
npm run check                # shows progress and flags patterns a good conversion should not contain
```

## How this works

* Open the Selenium test named in each comment, read what it does, then write it the Playwright way. Do not translate line by line.
* Keep every test title exactly as it is (`01 ...`, `02 ...`). The progress check counts by title number.
* When a test is done, change `test.fixme(` to `test(`.
* 01 is finished. 02 is half done (finish it, then remove `.fixme`). `loggedInPage` in `fixtures/index.ts` is yours to build.

## The rules a good conversion follows

1. No `waitForTimeout` and no sleeps. Assertions wait for you.
2. No XPath. Use `getByRole`, `getByLabel`, `getByText` or `getByTestId`.
3. Tests that change data use their own account (a fixture), not the shared `demo` account.
4. Login setup lives in a fixture, not in every test.

`npm run check -- --strict` also fails while any of the 15 tests is still `fixme`.

## Progress tracker

| # | Test | Done |
|---|---|---|
| 01 | Valid login lands on the dashboard | yes (given) |
| 02 | Wrong password shows an error | yes |
| 03 | Every business area can log in | yes |
| 04 | Dashboard lists the holdings for the account | yes |
| 05 | An account with no holdings shows the empty message | yes |
| 06 | Logging out returns to login and blocks the dashboard | yes |
| 07 | Selling on NSE with cash settlement is confirmed | yes |
| 08 | Cheque settlement without a branch is rejected | yes |
| 09 | Cheque settlement with a branch is confirmed | yes |
| 10 | Selling more than is held is rejected | yes |
| 11 | A sale reduces the quantity held on the server | yes |
| 12 | A freshly seeded account starts with the default holdings and balance | yes |
| 13 | The statement opens in a new window | yes |
| 14 | The terms can be accepted inside the iframe | yes |
| 15 | The market filter accepts several selections | yes |
