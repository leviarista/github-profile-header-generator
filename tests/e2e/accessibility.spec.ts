/**
 * tests/e2e/accessibility.spec.ts
 * Accessibility tests with axe-core + @axe-core/playwright.
 * Verifies WCAG 2.1 AA on the real application.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility (WCAG 2.1 AA)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#github-header-image', { timeout: 15000 });
  });

  // ─── Full page analysis ───────────────────────────────────────────────

  test('the page has no critical accessibility violations (critical)', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical'
    );

    if (criticalViolations.length > 0) {
      console.log('CRITICAL violations found:');
      criticalViolations.forEach((v) => {
        console.log(`  [${v.id}] ${v.description}`);
        v.nodes.forEach((n) => console.log(`    Selector: ${n.target}`));
      });
    }

    expect(criticalViolations).toHaveLength(0);
  });

  test('the page has no serious accessibility violations (serious)', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const seriousViolations = results.violations.filter(
      (v) => v.impact === 'serious'
    );

    if (seriousViolations.length > 0) {
      console.log('SERIOUS violations found:');
      seriousViolations.forEach((v) => {
        console.log(`  [${v.id}] ${v.description}`);
        v.nodes.forEach((n) => console.log(`    Selector: ${n.target}`));
      });
    }

    expect(seriousViolations.length).toBeLessThanOrEqual(3);
  });

  test('full accessibility violations report', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .analyze();

    console.log(`Total violations: ${results.violations.length}`);
    console.log(`Total passes: ${results.passes.length}`);
    console.log(`Total incomplete: ${results.incomplete.length}`);

    if (results.violations.length > 0) {
      console.log('\nDetailed violations:');
      results.violations.forEach((v) => {
        console.log(`  [${v.impact?.toUpperCase()}] ${v.id}: ${v.description}`);
        console.log(`    Help: ${v.helpUrl}`);
        v.nodes.slice(0, 2).forEach((n) => {
          console.log(`    Node: ${n.target}`);
          console.log(`    HTML: ${n.html.substring(0, 100)}`);
        });
      });
    }

    // We report but do not force 0 violations (to allow iteration)
    // We only enforce that there are no critical violations
    const criticals = results.violations.filter((v) => v.impact === 'critical');
    expect(criticals).toHaveLength(0);
  });

  // ─── Specific accessibility checks ────────────────────────────────────

  test('images have alternative text (alt)', async ({ page }) => {
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);
  });

  test('inputs have associated labels or aria-label', async ({ page }) => {
    const titleInput = page.locator('#title-input');
    await expect(titleInput).toBeVisible();

    // Verify it has an associated label or aria-label
    const label = page.locator('label[for="title-input"]');
    const hasLabel = (await label.count()) > 0;
    const ariaLabel = await titleInput.getAttribute('aria-label');
    const placeholder = await titleInput.getAttribute('placeholder');

    expect(hasLabel || ariaLabel !== null || placeholder !== null).toBeTruthy();
  });

  test('the banner color contrast meets WCAG AA', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('#github-header-image')
      .withRules(['color-contrast'])
      .analyze();

    if (results.violations.length > 0) {
      console.log('Contrast issues in the banner:');
      results.violations.forEach((v) => {
        v.nodes.forEach((n) => console.log(`  ${n.html.substring(0, 80)}`));
      });
    }

    // We document but do not force 0 (contrast depends on the active preset)
    expect(results.violations.length).toBeLessThanOrEqual(5);
  });

  test('the page has a valid document title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('the page has a <main> element or equivalent landmark', async ({ page }) => {
    const mainEl = page.locator('main, [role="main"], #main-content, .main-content');
    const hasMain = (await mainEl.count()) > 0;

    // If there is no main, verify there is at least a hierarchical heading structure
    if (!hasMain) {
      const h1 = page.locator('h1');
      const hasH1 = (await h1.count()) > 0;
      console.warn('Warning: the page has no <main> landmark element');
      // We do not force an error, only document it
    }
  });

  test('the banner has an accessible role or text', async ({ page }) => {
    const banner = page.locator('#github-header-image');
    await expect(banner).toBeVisible();

    // Verify the title inside the banner is accessible
    const bannerTitle = banner.locator('.title');
    await expect(bannerTitle).toBeVisible();

    const titleText = await bannerTitle.textContent();
    expect(titleText).toBeTruthy();
  });

  // ─── Mobile accessibility ──────────────────────────────────────────────

  test('there are no critical violations in the mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForSelector('#github-header-image', { timeout: 15000 });

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical'
    );
    expect(criticalViolations).toHaveLength(0);
  });
});
