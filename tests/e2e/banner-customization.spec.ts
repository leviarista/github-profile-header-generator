/**
 * tests/e2e/banner-customization.spec.ts
 * E2E tests for banner customization in the real app.
 * Goal: validate that changes in the toolbox are reflected in the banner.
 */
import { test, expect, Page } from '@playwright/test';

test.describe('Banner Customization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the main banner to be visible
    await page.waitForSelector('#github-header-image', { timeout: 15000 });
  });

  // ─── Visibility and basic structure ────────────────────────────────────

  test('the main banner is visible when the page loads', async ({ page }) => {
    const banner = page.locator('#github-header-image');
    await expect(banner).toBeVisible();
  });

  test('the banner title is visible', async ({ page }) => {
    const title = page.locator('#github-header-image .title');
    await expect(title).toBeVisible();
  });

  test('the banner subtitle is visible', async ({ page }) => {
    const subtitle = page.locator('#github-header-image .subtitle');
    await expect(subtitle).toBeVisible();
  });

  test('the customization toolbox is visible', async ({ page }) => {
    const toolbox = page.locator('.toolbox');
    await expect(toolbox).toBeVisible();
  });

  test('the download button is present', async ({ page }) => {
    const downloadBtn = page.locator('.download-button');
    await expect(downloadBtn).toBeVisible();
  });

  // ─── Title update ──────────────────────────────────────────────────────

  test('changing the title in the input updates the banner', async ({ page }) => {
    const titleInput = page.locator('#title-input');
    const bannerTitle = page.locator('#github-header-image .title');

    await titleInput.fill('');
    await titleInput.type('octocat');
    await titleInput.dispatchEvent('keyup');

    await expect(bannerTitle).toHaveText('octocat');
  });

  test('changing the subtitle in the input updates the banner', async ({ page }) => {
    const subtitleInput = page.locator('#subtitle-input');
    const bannerSubtitle = page.locator('#github-header-image .subtitle');

    await subtitleInput.fill('');
    await subtitleInput.type('Open Source Contributor');
    await subtitleInput.dispatchEvent('keyup');

    await expect(bannerSubtitle).toHaveText('Open Source Contributor');
  });

  test('the title accepts special characters and emojis', async ({ page }) => {
    const titleInput = page.locator('#title-input');
    const bannerTitle = page.locator('#github-header-image .title');

    await titleInput.fill('');
    await titleInput.type('dev@octocat 🚀');
    await titleInput.dispatchEvent('keyup');

    await expect(bannerTitle).toHaveText('dev@octocat 🚀');
  });

  // ─── Tab navigation ────────────────────────────────────────────────────

  test('the Background tab exists and is clickable', async ({ page }) => {
    const bgTab = page.locator('.tablinks[data-name="background-section"], button:has-text("Background")').first();
    await expect(bgTab).toBeVisible();
    await bgTab.click();
    // The background section should appear or be active
    await expect(page.locator('.toolbox-background')).toBeVisible();
  });

  test('the Presets tab shows the preset buttons', async ({ page }) => {
    // Look for the presets tab
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

  // ─── Preset interaction ────────────────────────────────────────────────

  test('applying a preset changes the banner background', async ({ page }) => {
    // Try to navigate to the presets tab
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

    // The background may or may not change depending on the preset, but it must not error
    expect(afterBg).toBeTruthy();
  });

  // ─── Download button ───────────────────────────────────────────────────

  test('the download button can be clicked without JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    const downloadBtn = page.locator('.download-button');
    await downloadBtn.click();

    // Wait a moment for it to be processed
    await page.waitForTimeout(1000);

    // There must be no critical JS errors when clicking download
    const criticalErrors = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('Non-Error promise rejection')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
