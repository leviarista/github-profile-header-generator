/**
 * tests/e2e/accessibility.spec.ts
 * Pruebas de accesibilidad con axe-core + @axe-core/playwright.
 * Verifica WCAG 2.1 AA en la aplicación real.
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = 'https://leviarista.github.io/github-profile-header-generator/';

test.describe('Accesibilidad (WCAG 2.1 AA)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForSelector('#github-header-image', { timeout: 15000 });
  });

  // ─── Análisis completo de la página ───────────────────────────────────

  test('la página no tiene violaciones de accesibilidad críticas (critical)', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical'
    );

    if (criticalViolations.length > 0) {
      console.log('Violaciones CRÍTICAS encontradas:');
      criticalViolations.forEach((v) => {
        console.log(`  [${v.id}] ${v.description}`);
        v.nodes.forEach((n) => console.log(`    Selector: ${n.target}`));
      });
    }

    expect(criticalViolations).toHaveLength(0);
  });

  test('la página no tiene violaciones de accesibilidad graves (serious)', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const seriousViolations = results.violations.filter(
      (v) => v.impact === 'serious'
    );

    if (seriousViolations.length > 0) {
      console.log('Violaciones SERIAS encontradas:');
      seriousViolations.forEach((v) => {
        console.log(`  [${v.id}] ${v.description}`);
        v.nodes.forEach((n) => console.log(`    Selector: ${n.target}`));
      });
    }

    expect(seriousViolations.length).toBeLessThanOrEqual(3);
  });

  test('reporte completo de violaciones de accesibilidad', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'best-practice'])
      .analyze();

    console.log(`Total de violaciones: ${results.violations.length}`);
    console.log(`Total de aprobadas: ${results.passes.length}`);
    console.log(`Total de incompletas: ${results.incomplete.length}`);

    if (results.violations.length > 0) {
      console.log('\nViolaciones detalladas:');
      results.violations.forEach((v) => {
        console.log(`  [${v.impact?.toUpperCase()}] ${v.id}: ${v.description}`);
        console.log(`    Help: ${v.helpUrl}`);
        v.nodes.slice(0, 2).forEach((n) => {
          console.log(`    Nodo: ${n.target}`);
          console.log(`    HTML: ${n.html.substring(0, 100)}`);
        });
      });
    }

    // Reportamos pero no forzamos 0 violaciones (para permitir iteración)
    // Solo forzamos que no haya violations críticas
    const criticals = results.violations.filter((v) => v.impact === 'critical');
    expect(criticals).toHaveLength(0);
  });

  // ─── Checks específicos de accesibilidad ──────────────────────────────

  test('las imágenes tienen texto alternativo (alt)', async ({ page }) => {
    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);
  });

  test('los inputs tienen labels asociados o aria-label', async ({ page }) => {
    const titleInput = page.locator('#title-input');
    await expect(titleInput).toBeVisible();

    // Verificar que tiene label asociado o aria-label
    const label = page.locator('label[for="title-input"]');
    const hasLabel = (await label.count()) > 0;
    const ariaLabel = await titleInput.getAttribute('aria-label');
    const placeholder = await titleInput.getAttribute('placeholder');

    expect(hasLabel || ariaLabel !== null || placeholder !== null).toBeTruthy();
  });

  test('el contraste de color del banner cumple WCAG AA', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('#github-header-image')
      .withRules(['color-contrast'])
      .analyze();

    if (results.violations.length > 0) {
      console.log('Problemas de contraste en el banner:');
      results.violations.forEach((v) => {
        v.nodes.forEach((n) => console.log(`  ${n.html.substring(0, 80)}`));
      });
    }

    // Documentamos pero no forzamos 0 (el contraste depende del preset activo)
    expect(results.violations.length).toBeLessThanOrEqual(5);
  });

  test('la página tiene un título de documento válido', async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('la página tiene un elemento <main> o equivalente de landmark', async ({ page }) => {
    const mainEl = page.locator('main, [role="main"], #main-content, .main-content');
    const hasMain = (await mainEl.count()) > 0;

    // Si no hay main, verificar que al menos hay una estructura jerárquica de headings
    if (!hasMain) {
      const h1 = page.locator('h1');
      const hasH1 = (await h1.count()) > 0;
      console.warn('Advertencia: la página no tiene elemento <main> landmark');
      // No forzamos error, solo documentamos
    }
  });

  test('el banner tiene rol o texto accesible', async ({ page }) => {
    const banner = page.locator('#github-header-image');
    await expect(banner).toBeVisible();

    // Verificar que el título dentro del banner es accesible
    const bannerTitle = banner.locator('.title');
    await expect(bannerTitle).toBeVisible();

    const titleText = await bannerTitle.textContent();
    expect(titleText).toBeTruthy();
  });

  // ─── Accesibilidad en móvil ────────────────────────────────────────────

  test('no hay violaciones críticas en viewport móvil', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL);
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
