# Testing — GitHub Profile Header Generator

Complete documentation of the test plan, coverage, and detected bugs for the
`github-profile-header-generator` v2.1.0 project.

---

## Table of Contents

1. [Testing Stack](#1-testing-stack)
2. [File Structure](#2-file-structure)
3. [How to Run the Tests](#3-how-to-run-the-tests)
4. [Coverage Results](#4-coverage-results)
5. [Found Bugs](#5-found-bugs)
6. [Test Data and Oracles](#6-test-data-and-oracles)
7. [E2E Tests (Playwright)](#7-e2e-tests-playwright)
8. [Static Analysis (ESLint)](#8-static-analysis-eslint)
9. [Mutation Testing (Stryker)](#9-mutation-testing-stryker)
10. [Known Environment Limitations](#10-known-environment-limitations)

---

## 1. Testing Stack

| Tool                                                                                 | Version | Purpose                                 |
| ------------------------------------------------------------------------------------ | ------- | --------------------------------------- |
| [Vitest](https://vitest.dev/)                                                        | ^3.2    | Unit and integration test runner        |
| [jsdom](https://github.com/jsdom/jsdom)                                              | ^26.1   | DOM simulation for Vitest               |
| [@vitest/coverage-v8](https://vitest.dev/guide/coverage)                             | ^3.2    | Code coverage (V8 provider)             |
| [@playwright/test](https://playwright.dev/)                                          | ^1.52   | E2E tests in real browsers              |
| [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm)                    | ^4.10   | Automated accessibility checks (E2E)    |
| [@stryker-mutator/core](https://stryker-mutator.io/)                                 | ^8.7    | Mutation testing                        |
| [ESLint](https://eslint.org/)                                                        | ^9.28   | Static analysis                         |
| [eslint-plugin-security](https://github.com/eslint-community/eslint-plugin-security) | —       | OWASP security rules                    |
| [@faker-js/faker](https://fakerjs.dev/)                                              | ^9.8    | Test data generation                    |
| [Zod](https://zod.dev/)                                                              | ^3.24   | Oracles / schema validation             |

---

## 2. File Structure

```
tests/
├── setup.js                        # Complete DOM fixture for Vitest+jsdom
├── utils/
│   ├── oracle.js                   # Zod oracles: PresetSchema, ThemeSchema, etc.
│   └── testData.js                 # Faker generators: colors, presets, patterns
├── unit/
│   ├── getPattern.test.js          # 70 tests — getPattern() function and variants
│   └── presets.test.js             # 21 tests — presets.json loading and validation
├── integration/
│   ├── banner.test.js              # 27 tests — updateBanner, applyTheme, updateUIOptions
│   └── localStorage.test.js        # 16 tests — saveTheme, getSavedThemeProp, cycles
└── e2e/
    ├── banner-customization.spec.ts  # Banner customization flows
    ├── accessibility.spec.ts         # Accessibility with axe-core
    └── performance.spec.ts           # Performance metrics (CLS, LCP, FCP)

.github/prompts/
└── playwright-qa-engineer.prompt.md  # Copilot skill for E2E testing

vitest.config.js        # Vitest + coverage configuration
playwright.config.ts    # Playwright configuration (4 browsers, production URL)
stryker.config.mjs      # Stryker configuration (runner: vitest)
eslint.config.js        # ESLint configuration with eslint-plugin-security
```

## 3. How to Run the Tests

```bash
# Install all dependencies (including test devDependencies)
npm install

# Unit and integration tests -------------------------------------------------
npm test                # Run once and see results
npm run test:watch      # Watch mode (reruns on save)
npm run test:coverage   # Run with HTML + text coverage report

# E2E tests (requires installed browsers) ------------------------------------
npx playwright install  # Install browsers (only the first time)
npm run test:e2e        # Run E2E in all configured browsers
npm run test:e2e:ui     # Open Playwright visual interface
npm run test:e2e:report # Open the latest E2E HTML report

# Static analysis -------------------------------------------------------------
npm run lint            # ESLint with security rules

# Mutation testing ------------------------------------------------------------
npm run test:mutation   # Stryker against js/presets.js and js/helpers/helpers.js
```

## 4. Coverage Results

Coverage for files with testable business logic
(pure UI modules —`main.js`, `toolbox-*.js`— are excluded because
they require real browser interaction and are covered with E2E tests).

| File                     | Statements | Branches | Functions | Lines    |
| ------------------------ | ---------- | -------- | --------- | -------- |
| `js/banner.js`           | 69%        | 70%      | **100%**  | 69%      |
| `js/presets.js`          | **100%**   | **100%** | **100%**  | **100%** |
| `js/helpers/helpers.js`  | **100%**   | 50%      | **100%**  | **100%** |
| `js/helpers/elements.js` | **100%**   | **100%** | **100%**  | **100%** |
| **Total**                | **74%**    | **72%**  | **100%**  | **74%**  |

**Configured thresholds** (in `vitest.config.js`): lines ≥ 70%, branches ≥ 60%, functions ≥ 80%.

Uncovered lines in `banner.js`: branches in `updateUIOptions` for `patternSize`,
`patternColor/patternOpacity`, and `titleFont/subtitleFont` (lines ~220–249).
These branches require toolbox DOM elements that are not present in the unit/integration test fixture.

## 5. Found Bugs

The tests in this suite **document and detect** the following bugs in the
source code. The tests that document them intentionally pass by verifying the
current incorrect behavior and are marked with `[BUG #N]`.

### BUG #1 — `TypeError` when applying a pattern without `patternColor` (CRITICAL)

| Field            | Detail                                   |
| ---------------- | ---------------------------------------- |
| **File**         | `js/banner.js` — `applyTheme()` function |
| **Approx. line** | 110                                      |
| **Severity**     | 🔴 CRITICAL                              |

**Description:**  
The condition `if (pattern || patternColor || patternOpacity || patternSize)` opens
the block when any of the four values is truthy. Inside the block,
`patternColor.replace('#', '')` is called unconditionally, which throws a `TypeError`
if `patternColor` is `undefined` (for example, when only `patternSize` is updated).

```js
// Bug reproduction:
updateBanner({ patternSize: 20 });
// → TypeError: Cannot read properties of undefined (reading 'replace')
```

**Suggested fix:**

```js
bannerImage.style.backgroundImage = getPattern(
  pattern,
  patternColor ? patternColor.replace("#", "") : "",
  patternOpacity,
);
```

### BUG #2 — `getSavedThemeProp` returns `'bubbles'` for any property (MEDIUM)

| Field            | Detail                                          |
| ---------------- | ----------------------------------------------- |
| **File**         | `js/banner.js` — `getSavedThemeProp()` function |
| **Approx. line** | 258                                             |
| **Severity**     | 🟡 MEDIUM                                       |

**Description:**  
When no theme is stored in localStorage, the function returns the hardcoded string
`'bubbles'` for **any** requested property, including `borderSize`, `titleColor`,
`borderRadius`, and others.

```js
// Current behavior (with empty localStorage):
getSavedThemeProp("borderSize"); // → 'bubbles'  ❌
getSavedThemeProp("titleColor"); // → 'bubbles'  ❌
getSavedThemeProp("background"); // → 'bubbles'  ❌ (expected: null or undefined)
```

**Suggested fix:**

```js
if (!theme) return null; // or return a map of defaults by property
```

### BUG #3 — `updateUIOptions` does not update `textAlign`, `decoration`, or `pattern` (LOW)

| Field            | Detail                                       |
| ---------------- | -------------------------------------------- |
| **File**         | `js/banner.js` — `updateUIOptions()` function |
| **Approx. line** | 187–205                                      |
| **Severity**     | 🟢 LOW                                       |

**Description:**  
The `if (textAlign)`, `if (decoration)`, and `if (pattern)` blocks are empty in
`updateUIOptions`. When a saved theme is restored, the toolbox controls for text
alignment, decoration, and pattern are not visually updated.

### BUG #3b — `borderRadius: 0` prevents the border from being applied (LOW)

| Field            | Detail                                  |
| ---------------- | --------------------------------------- |
| **File**         | `js/banner.js` — `applyTheme()` function |
| **Approx. line** | 96                                      |
| **Severity**     | 🟢 LOW                                  |

**Description:**  
The condition `if (borderColor && borderSize && borderRadius)` fails when
`borderRadius` is `0` (no rounded corners), because `0` is falsy in JavaScript.
As a result, a theme with `borderRadius: 0` (square corners) never applies the
full border.

```js
applyTheme({ borderColor: "#000", borderSize: 2, borderRadius: 0 });
// → bannerImage.style.border === ''  ❌  (border not applied)
```

**Suggested fix:**

```js
if (borderColor && borderSize && borderRadius !== undefined && borderRadius !== null) { ... }
```

### BUG #4 — Empty title/subtitle cannot be cleared (LOW)

| Field            | Detail                                  |
| ---------------- | --------------------------------------- |
| **File**         | `js/banner.js` — `applyTheme()` function |
| **Approx. line** | 129                                     |
| **Severity**     | 🟢 LOW                                  |

**Description:**  
The condition `if (title || subtitle)` prevents clearing the title or subtitle
by sending an empty string (`''`), because `''` is falsy.

```js
updateBanner({ title: "" });
// → bannerTitle.innerText unchanged  ❌
```

**Suggested fix:**

```js
if (title !== undefined || subtitle !== undefined) { ... }
```

### BUG #5 — Preset #22 has numeric fields stored as strings (DATA — MEDIUM)

| Field            | Detail                            |
| ---------------- | --------------------------------- |
| **File**         | `js/data/presets.json` — index 22 |
| **Approx. line** | ~230                              |
| **Severity**     | 🟡 MEDIUM                         |

**Description:**  
The preset at index 22 has the `decorationSize`, `titleFontSize`, and
`subtitleFontSize` fields stored as strings instead of numbers. This can cause
errors when using them in calculations or interpolations:

```json
// Incorrect (preset #22):
"decorationSize": "77",
"titleFontSize": "44",
"subtitleFontSize": "18"

// Correct (all other presets):
"decorationSize": 77,
"titleFontSize": 44,
"subtitleFontSize": 18
```

**Detected by:** `PresetSchema` oracle (Zod) in `tests/unit/presets.test.js`.

### BUG #6 — `getSavedThemeProp` lacks `try/catch` around `JSON.parse` (LOW)

| Field            | Detail                                          |
| ---------------- | ----------------------------------------------- |
| **File**         | `js/banner.js` — `getSavedThemeProp()` function |
| **Approx. line** | 257                                             |
| **Severity**     | 🟢 LOW                                          |

**Description:**  
`JSON.parse(localStorage.getItem('theme'))` runs without a `try/catch` block.
If localStorage contents are corrupted or modified by an external script,
the app will throw an uncaught `SyntaxError`.

**Suggested fix:**

```js
function getSavedThemeProp(prop) {
  if (!prop) return null;
  try {
    const theme = JSON.parse(localStorage.getItem("theme"));
    if (!theme) return null;
    return theme[prop];
  } catch {
    return null;
  }
}
```

## 6. Test Data and Oracles

### Data generators (`tests/utils/testData.js`)

They use **@faker-js/faker** to create realistic and reproducible data:

| Function                    | Description                         |
| -------------------------- | ----------------------------------- |
| `generateHexColor()`       | Random hex color                    |
| `generatePatternName()`    | Valid pattern name from the catalog  |
| `generatePreset()`         | Full preset with all fields         |
| `generatePresets(n)`       | List of `n` random presets          |
| `generatePatternTestCases()` | Test cases for `getPattern()`     |
| `generatePartialTheme()`   | Partial theme with random fields    |

### Oracles (`tests/utils/oracle.js`)

They use **Zod** to validate data contracts:

| Schema                       | Validates                                   |
| --------------------------- | ------------------------------------------- |
| `PresetSchema`               | Full preset structure (types, ranges)       |
| `ThemeSchema`                | Structure of a theme stored in localStorage |
| `PatternResultSchema`        | Result of `getPattern()` (string or 'none') |
| `validateAllPresets(presets)` | Validates all presets and returns errors    |

The oracle automatically detected **BUG #5** by validating all presets against
the expected schema.

## 7. E2E Tests (Playwright)

The E2E tests run against the production URL:  
**`https://leviarista.github.io/github-profile-header-generator/`**

### Configuration (`playwright.config.ts`)

- **Browsers**: Chromium, Firefox, WebKit (Safari), Mobile Chrome
- **Timeout**: 30,000 ms per test
- **Retries**: 2 in CI, 0 locally

### E2E suites

| File                           | Description                                                            |
| ------------------------------ | ---------------------------------------------------------------------- |
| `banner-customization.spec.ts` | App load, color changes, preset selection, image download              |
| `accessibility.spec.ts`        | Accessibility scan with axe-core across all sections                   |
| `performance.spec.ts`          | CLS, LCP, FCP using the native Performance Observer                    |

### Run E2E

```bash
npx playwright install          # Only the first time
npm run test:e2e                # All browsers
npm run test:e2e -- --project=chromium  # Chromium only
npm run test:e2e:ui             # Interactive visual interface
npm run test:e2e:report         # Open the latest HTML report
```

## 8. Static Analysis (ESLint)

```bash
npm run lint
```

Configuration in `eslint.config.js`:

- Base: `@eslint/js` recommended
- Plugin: `eslint-plugin-security` (OWASP rules for JS)
- Key rules: `security/detect-object-injection`, `security/detect-non-literal-regexp`

## 9. Mutation Testing (Stryker)

```bash
npm run test:mutation
```

Configuration in `stryker.config.mjs`:

- **Runner**: Vitest
- **Mutants in**: `js/presets.js`, `js/helpers/helpers.js`
- **Reporter**: HTML + text

Mutation tests verify that the unit tests are able to detect incorrect changes
in the logic (logical operators, return values, conditions).

## 10. Known Environment Limitations

### jsdom — `innerText` setter

jsdom does not fully implement the `element.innerText` setter in all contexts.
As a result:

- Tests that verify `innerText` changes use `Object.defineProperty` to intercept
  the setter and capture the assigned value.
- In a real browser, `bannerTitle.innerText = 'value'` works correctly.

### jsdom — `backgroundImage` with SVG data URLs

jsdom may reject complex SVG URLs assigned to `element.style.backgroundImage`
through its internal CSS parser. Related tests verify the type of the returned
value (`typeof string`) instead of the exact content.

### Pure UI modules (toolbox)

Files such as `js/main.js`, `js/toolbox-*.js`, and similar modules initialize
event listeners directly when the module loads. They are not testable in jsdom
without refactoring for dependency injection. They are covered exclusively by E2E tests.

## Executive Summary

| Metric                       | Result                                    |
| ---------------------------- | ----------------------------------------- |
| Unit + integration tests     | **145 / 145 passing** ✅                  |
| Line coverage                | **74%** (threshold: 70%) ✅              |
| Function coverage            | **100%** (threshold: 80%) ✅             |
| Bugs detected                | **7 bugs** (1 critical, 2 medium, 4 low) |
| Data bugs detected by oracle  | **1** (BUG #5, presets.json)             |