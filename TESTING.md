# Testing — GitHub Profile Header Generator

## Stack

| Tool                                                                                 | Purpose                                      |
| ------------------------------------------------------------------------------------ | -------------------------------------------- |
| [Vitest](https://vitest.dev/) + [jsdom](https://github.com/jsdom/jsdom)             | Unit and integration tests                   |
| [@vitest/coverage-v8](https://vitest.dev/guide/coverage)                             | Code coverage                                |
| [@playwright/test](https://playwright.dev/)                                          | E2E tests (Chromium)                         |
| [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm)                    | Accessibility checks (E2E)                   |
| [ESLint](https://eslint.org/) + `eslint-plugin-security`                             | Static analysis                              |

## Structure

```
tests/
├── setup.js          # DOM fixture for Vitest + jsdom
├── unit/             # getPattern, presets, helpers
├── integration/      # updateBanner, applyTheme, localStorage
└── e2e/              # banner customization and accessibility (Playwright)
```

## Running the tests

```bash
npm install

npm test                # Unit and integration tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report (thresholds in vitest.config.js)

npx playwright install chromium   # First time only
npm run test:e2e        # Builds the app and runs E2E against `vite preview`
npm run test:e2e:ui     # Playwright UI mode

npm run lint            # ESLint with security rules
```

## CI

[`.github/workflows/test.yml`](.github/workflows/test.yml) runs lint, unit/integration
and E2E tests on every pull request and push to `main`.
