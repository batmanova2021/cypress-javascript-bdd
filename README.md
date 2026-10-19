# Cypress JavaScript BDD Portfolio

A Sauce Demo automation portfolio using Cypress, JavaScript, and Cucumber/Gherkin. It contains 23 executable regression cases (including Scenario Outline examples), with three critical smoke cases.

## Get started

Install Node.js 24 and Chrome (Firefox is needed for Firefox runs), then:

```sh
npm ci
npm run cy:open
npm run test:smoke
npm run test:regression
npm run test:chrome
npm run test:firefox
npm run lint
npm run format:check
npm run format
```

`npm test` runs regression in Chrome. Choose any Cypress-supported installed browser with `node scripts/run-tests.js regression firefox`. The runner rejects unknown suites, fails on zero executed tests, and preserves failures through a nonzero exit code. Cypress downloads its binary during installation; CI/Linux also needs Cypress system dependencies (GitHub's Ubuntu runners provide these).

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

Browser jobs are independent, use two retries, and upload reports plus available screenshots/videos even after failures. Artifacts expire after 14 days. Download the browser-specific artifact from the workflow run and open its report. CI requires this repository to be pushed to GitHub with Actions enabled. Sauce Demo availability and runner connectivity can affect results. Scheduled workflows run from the default branch; 10:00 UTC is 06:00 EDT / 05:00 EST.

## Optional Cypress Cloud

Tests work without Cloud. Create or select your own Cloud project, then set GitHub repository variable `CYPRESS_PROJECT_ID` and secret `CYPRESS_RECORD_KEY`. Trusted non-PR runs record only when both exist. PR runs do not receive the key and run without recording, including forks.

To record locally, set `CYPRESS_PROJECT_ID`, `CYPRESS_RECORD_KEY`, and `CYPRESS_CLOUD_RECORD=true` in your shell and use the normal test scripts. Never commit your record key. `cypress.env.json` and `.env*` are ignored; dotenv files are not automatically loaded. GitHub Actions browser groups are named by suite/browser; Cloud parallelization is not enabled.

References: [Cypress Cloud setup](https://docs.cypress.io/cloud/get-started/setup), [Cypress GitHub Actions](https://docs.cypress.io/app/continuous-integration/github-actions), [Cucumber preprocessor](https://github.com/badeball/cypress-cucumber-preprocessor), [Mochawesome reporter](https://github.com/LironEr/cypress-mochawesome-reporter).

## Repository-local Git identity

The requested identity is configured in `.git/config` for this repository only. Verify without changing global settings:

```sh
git config --local --get user.name
git config --local --get user.email
```

## Verification on October 19, 2026

- ESLint and Prettier checks pass; npm reports no dependency vulnerabilities.
- Chrome smoke: 3/3 passed. Chrome regression: 23/23 passed.
- Gherkin parsing confirms all 23 cases inherit `@regression` and exactly three carry `@smoke`.
- A temporary intentional failure confirmed a nonzero exit status and screenshot embedding in HTML/JSON. Runner checks also confirmed empty suites and launch failures return a nonzero status.
- Firefox 157 was detected, but local runs could not connect to Cypress before tests started. Firefox regression remains unverified locally; the CI job is configured to run it on Ubuntu.
- Workflow YAML parses successfully and the npm lockfile passes an `npm ci` dry run. Hosted GitHub Actions and Cloud recording require the later GitHub/Cloud setup described above.
- HTML reports were generated with inline assets and validated structurally. Visual preview was unavailable because the browser tool blocked local `file:` URLs.
