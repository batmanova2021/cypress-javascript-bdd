# Cypress JavaScript BDD Portfolio

A Sauce Demo automation portfolio using Cypress, JavaScript, and Cucumber/Gherkin. It contains 23 executable regression cases (including Scenario Outline examples), with three critical smoke cases.

## Get started

Install Node.js 24 and Chrome. Use Chrome for local development; Firefox regression runs in GitHub Actions, and local Firefox troubleshooting is deferred. To run Firefox locally, you must also have a working Firefox installation.

Run:

```sh
npm ci
npm run cy:open
npm run test:smoke
npm run test:regression
npm run test:chrome
npm run lint
npm run format:check
npm run format
```

`npm test` runs regression in Chrome. Choose any Cypress-supported installed browser with `node scripts/run-tests.js regression firefox`. The runner rejects unknown suites, fails on zero executed tests, and preserves failures through a nonzero exit code. Cypress downloads its binary during installation; CI/Linux also needs Cypress system dependencies (GitHub's Ubuntu runners provide these).

### Headless, headed, and interactive runs

The npm test scripts run headlessly by default. To watch automated Chrome runs:

```sh
# Smoke suite with a visible browser
npx cypress run --browser chrome --headed --expose tags=@smoke

# Full regression suite with a visible browser
npx cypress run --browser chrome --headed --expose tags=@regression
```

For interactive debugging, use `npm run cy:open`, choose E2E Testing and Chrome, then select a feature file. To run Firefox locally when available, use `npm run test:firefox`; local Firefox is not a prerequisite for working on this portfolio.

### VS Code extensions

Recommended extensions:

- [Cucumber](https://marketplace.visualstudio.com/items?itemName=CucumberOpen.cucumber-official): Gherkin highlighting, step completion, and navigation.
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): JavaScript diagnostics using the project configuration.
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): consistent formatting.
- [Cypress Helper](https://marketplace.visualstudio.com/items?itemName=Shelex.vscode-cy-helper) (optional): custom command and fixture navigation.

To connect the Cucumber extension to this project's folders, add these workspace settings in `.vscode/settings.json`:

```json
{
  "cucumber.features": ["cypress/e2e/**/*.feature"],
  "cucumber.glue": ["cypress/step_definitions/**/*.js"],
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

## Structure and conventions

- `cypress/e2e`: authentication, inventory, cart, and checkout feature files.
- `cypress/step_definitions`: reusable business steps.
- `cypress/pages`: shared selectors and product lookup.
- `cypress/fixtures`: public demo accounts, product names, and customer data.
- `cypress/support`: report registration and reusable `cy.login()` / `cy.addProductToCart(name)` commands.
- `scripts/run-tests.js`: suite/browser selection and optional Cloud recording.

Feature-level `@regression` tags apply to every scenario. `@smoke` selects successful login, a multi-product cart, and completed checkout. Scenario Outlines independently exercise rejected credentials, all four sort orders, and required checkout fields. The cart feature uses a real DataTable: each product row drives an add action and an independent cart assertion, plus an exact cart item count.

Scenarios run independently. Authenticated scenarios use `cy.session()` to cache a standard-user login, validate its session cookie, and explicitly visit inventory after restoration. The inventory visit uses Sauce Demo’s GitHub Pages SPA query redirect (`/?/inventory.html`), because a direct request to the deep route returns HTTP 404. Cypress test isolation clears browser state between cases; no scenario relies on an earlier case. Prefer `data-test` selectors and retryable assertions, never arbitrary sleeps. Demo credentials are public Sauce Demo accounts; do not put real secrets in fixtures.

## Reports and diagnostics

Each run generates Mochawesome HTML and JSON in `cypress/reports/` (open `index.html`). Failure screenshots are embedded in the standalone HTML report. Screenshots and videos also remain in `cypress/screenshots/` and `cypress/videos/`. These outputs are ignored by Git and overwritten by later runs; save/download any evidence you need before rerunning.

## GitHub Actions

The workflow first checks ESLint and Prettier, then runs:

| Trigger          | Suite      | Browsers        |
| ---------------- | ---------- | --------------- |
| Pull request     | Smoke      | Chrome          |
| Push to main     | Regression | Chrome, Firefox |
| Daily, 10:00 UTC | Regression | Chrome, Firefox |
| Manual dispatch  | Regression | Chrome, Firefox |

Browser jobs are independent, use two retries, and upload reports plus available screenshots/videos even after failures. Artifacts expire after 14 days. Download the browser-specific artifact from the workflow run and open its report. Sauce Demo availability and runner connectivity can affect results. Scheduled workflows run from the default branch; 10:00 UTC is 06:00 EDT / 05:00 EST.

### PR merge requirements

The active [main-branch ruleset](https://github.com/batmanova2021/cypress-javascript-bdd/rules/25563866) requires a pull request, an up-to-date branch, and these successful GitHub Actions checks:

| Required check | What it validates on a PR      |
| -------------- | ------------------------------ |
| `quality`      | ESLint and Prettier formatting |
| `e2e (chrome)` | The three Chrome smoke cases   |

Regression and Firefox checks are not required for PR merging. They run after changes reach `main`, on the daily schedule, or through manual dispatch. Reviewer approval is optional. Use a feature branch and PR for future changes; direct pushes to `main` are restricted by the ruleset.

[PR #1](https://github.com/batmanova2021/cypress-javascript-bdd/pull/1) passed the quality and smoke checks and was merged. The ruleset is managed in GitHub settings rather than in the workflow file. Workflow runs and downloadable artifacts are available on the [Actions page](https://github.com/batmanova2021/cypress-javascript-bdd/actions).

## Cypress Cloud

Cypress Cloud is configured for project `67tngp`, and recording has been confirmed working. The project ID defaults to `67tngp` in `cypress.config.js`; `CYPRESS_PROJECT_ID` overrides it.

The GitHub repository has the following configuration under Settings → Secrets and variables → Actions:

| Type             | Name                 | Value                    |
| ---------------- | -------------------- | ------------------------ |
| Actions variable | `CYPRESS_PROJECT_ID` | `67tngp`                 |
| Actions secret   | `CYPRESS_RECORD_KEY` | Private Cloud record key |

Trusted non-PR runs record when both settings exist. PR runs, including forks, do not receive the key and run without Cloud recording. Local tests also run without recording by default.

To record locally, set `CYPRESS_PROJECT_ID`, `CYPRESS_RECORD_KEY`, and `CYPRESS_CLOUD_RECORD=true` in your shell and use the normal test scripts. Never commit your record key. `cypress.env.json` and `.env*` are ignored; dotenv files are not automatically loaded. GitHub Actions browser groups are named by suite/browser; Cloud parallelization is not enabled.

References: [Cypress Cloud setup](https://docs.cypress.io/cloud/get-started/setup), [Cypress GitHub Actions](https://docs.cypress.io/app/continuous-integration/github-actions), [Cucumber preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor), [Mochawesome reporter](https://github.com/LironEr/cypress-mochawesome-reporter).

## Repository-local Git identity

The requested identity is configured in `.git/config` for this repository only. Verify without changing global settings:

```sh
git config --local --get user.name
git config --local --get user.email
```

## Verification status

As of October 21, 2026:

- Local Chrome smoke (3/3) and regression (23/23) passed during initial verification. ESLint and Prettier checks passed.
- GitHub Actions completed successful Chrome and Firefox regression jobs in the initial `main` run. PR #1 passed its required quality and Chrome smoke checks and was merged.
- Cypress Cloud configuration is complete, with working recording confirmed by the project owner. Check the Actions page for the latest post-merge run status.
- An intentional failure verified nonzero exit status and screenshot embedding in generated HTML/JSON. Runner checks also covered empty suites and launch failures.
- Local Firefox encountered a profile/automation connection issue. Troubleshooting it is deferred; Firefox coverage remains in CI.
- Report generation and inline assets were checked structurally; visual inspection of a downloaded HTML report remains pending.
- Scheduled regression is configured for 10:00 UTC daily; the first scheduled execution has not yet been confirmed.
