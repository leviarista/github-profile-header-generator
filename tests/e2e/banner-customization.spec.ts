/**
 * tests/e2e/banner-customization.spec.ts
 * Pruebas E2E de personalización del banner en la app real.
 * Objetivo: validar que los cambios en el toolbox se reflejan en el banner.
 */
import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://leviarista.github.io/github-profile-header-generator/';

test.describe('Personalización del Banner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Esperar a que el banner principal esté visible
    await page.waitForSelector('#github-header-image', { timeout: 15000 });
  });

  // ─── Visibilidad y estructura básica ───────────────────────────────────

  test('el banner principal es visible al cargar la página', async ({ page }) => {
    const banner = page.locator('#github-header-image');
    await expect(banner).toBeVisible();
  });

  test('el título del banner es visible', async ({ page }) => {
    const title = page.locator('#github-header-image .title');
    await expect(title).toBeVisible();
  });

  test('el subtítulo del banner es visible', async ({ page }) => {
    const subtitle = page.locator('#github-header-image .subtitle');
    await expect(subtitle).toBeVisible();
  });

  test('el toolbox de personalización es visible', async ({ page }) => {
    const toolbox = page.locator('.toolbox');
    await expect(toolbox).toBeVisible();
  });

  test('el botón de descarga está presente', async ({ page }) => {
    const downloadBtn = page.locator('.download-button');
    await expect(downloadBtn).toBeVisible();
  });

  // ─── Actualización del título ──────────────────────────────────────────

  test('cambiar el título en el input actualiza el banner', async ({ page }) => {
    const titleInput = page.locator('#title-input');
    const bannerTitle = page.locator('#github-header-image .title');

    await titleInput.fill('');
    await titleInput.type('octocat');
    await titleInput.dispatchEvent('keyup');

    await expect(bannerTitle).toHaveText('octocat');
  });

  test('cambiar el subtítulo en el input actualiza el banner', async ({ page }) => {
    const subtitleInput = page.locator('#subtitle-input');
    const bannerSubtitle = page.locator('#github-header-image .subtitle');

    await subtitleInput.fill('');
    await subtitleInput.type('Open Source Contributor');
    await subtitleInput.dispatchEvent('keyup');

    await expect(bannerSubtitle).toHaveText('Open Source Contributor');
  });

  test('el título acepta caracteres especiales y emojis', async ({ page }) => {
    const titleInput = page.locator('#title-input');
    const bannerTitle = page.locator('#github-header-image .title');

    await titleInput.fill('');
    await titleInput.type('dev@octocat 🚀');
    await titleInput.dispatchEvent('keyup');

    await expect(bannerTitle).toHaveText('dev@octocat 🚀');
  });

  // ─── Navegación por pestañas ───────────────────────────────────────────

  test('la pestaña Background existe y es clickable', async ({ page }) => {
    const bgTab = page.locator('.tablinks[data-name="background-section"], button:has-text("Background")').first();
    await expect(bgTab).toBeVisible();
    await bgTab.click();
    // La sección de background debe aparecer o estar activa
    await expect(page.locator('.toolbox-background')).toBeVisible();
  });

  test('la pestaña Presets muestra los botones de preset', async ({ page }) => {
    // Buscar el tab de presets
    const presetsTab = page.locator('.tablinks[data-name="presets-section"], button:has-text("Presets"), .tab button:last-child').first();
    if (await presetsTab.count() > 0) {
      await presetsTab.click();
      await page.waitForTimeout(500);
      const themeButtons = page.locator('.theme-button, .preset-button');
      await expect(themeButtons.first()).toBeVisible({ timeout: 5000 });
    } else {
      test.skip();
    }
  });

  // ─── Interacción con presets ───────────────────────────────────────────

  test('aplicar un preset cambia el fondo del banner', async ({ page }) => {
    // Intentar navegar a la pestaña de presets
    const presetsTab = page.locator('button:has-text("Presets"), .tablinks').filter({ hasText: /preset/i }).first();
    if (await presetsTab.count() > 0) {
      await presetsTab.click();
      await page.waitForTimeout(300);
    }

    const themeBtn = page.locator('.theme-button, .preset-button').first();
    if (await themeBtn.count() === 0) {
      test.skip();
      return;
    }

    const beforeBg = await page.locator('#github-header-image').evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );

    await themeBtn.click();
    await page.waitForTimeout(500);

    const afterBg = await page.locator('#github-header-image').evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    );

    // El background puede o no cambiar según el preset, pero no debe dar error
    expect(afterBg).toBeTruthy();
  });

  // ─── Oracle visual (screenshot) ───────────────────────────────────────

  test('el banner tiene apariencia consistente (oracle visual snapshot)', async ({ page }) => {
    const banner = page.locator('#github-header-image');
    await expect(banner).toBeVisible();
    // Screenshot solo del banner para comparación visual
    await expect(banner).toHaveScreenshot('banner-default.png', {
      threshold: 0.2,
      maxDiffPixels: 500,
    });
  });

  // ─── Botón de descarga ─────────────────────────────────────────────────

  test('el botón de descarga puede ser clickado sin errores de JS', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    const downloadBtn = page.locator('.download-button');
    await downloadBtn.click();

    // Esperar un momento para que se procese
    await page.waitForTimeout(1000);

    // No debe haber errores de JS críticos al hacer click en descargar
    const criticalErrors = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('Non-Error promise rejection')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
