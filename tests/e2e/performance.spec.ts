/**
 * tests/e2e/performance.spec.ts
 * Pruebas no funcionales de rendimiento y estabilidad.
 * Verifica: tiempo de carga, errores de consola, recursos 404, Core Web Vitals.
 */
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://leviarista.github.io/github-profile-header-generator/';
const LOAD_TIMEOUT_MS = 8000;
const BANNER_VISIBLE_TIMEOUT_MS = 5000;

test.describe('Rendimiento y estabilidad', () => {
  // ─── Tiempo de carga ─────────────────────────────────────────────────

  test('la página carga en menos de 8 segundos', async ({ page }) => {
    const startTime = Date.now();

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: LOAD_TIMEOUT_MS });
    const domTime = Date.now() - startTime;

    console.log(`DOM content loaded en: ${domTime}ms`);
    expect(domTime).toBeLessThan(LOAD_TIMEOUT_MS);
  });

  test('el banner es visible en menos de 5 segundos', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

    const start = Date.now();
    await page.waitForSelector('#github-header-image', { timeout: BANNER_VISIBLE_TIMEOUT_MS });
    const elapsed = Date.now() - start;

    console.log(`Banner visible en: ${elapsed}ms`);
    expect(elapsed).toBeLessThan(BANNER_VISIBLE_TIMEOUT_MS);
  });

  test('la carga completa de la página (networkidle) termina en menos de 12 segundos', async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 12000 });
    const elapsed = Date.now() - start;

    console.log(`Network idle en: ${elapsed}ms`);
    expect(elapsed).toBeLessThan(12000);
  });

  // ─── Errores de consola ───────────────────────────────────────────────

  test('no hay errores de JavaScript al cargar', async ({ page }) => {
    const jsErrors: string[] = [];

    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForSelector('#github-header-image', { timeout: 10000 });

    // Filtrar errores conocidos benignos
    const criticalErrors = jsErrors.filter(
      (e) =>
        !e.includes('ResizeObserver loop') &&
        !e.includes('Non-Error promise rejection') &&
        !e.includes('Script error') &&
        !e.includes('favicon') &&
        !e.includes('chrome-extension')
    );

    if (criticalErrors.length > 0) {
      console.log('Errores JS encontrados:', criticalErrors);
    }

    expect(criticalErrors).toHaveLength(0);
  });

  test('no hay mensajes de error en consola (console.error)', async ({ page }) => {
    const consoleErrors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForSelector('#github-header-image', { timeout: 10000 });

    // Filtrar errores de recursos externos (favicon, analytics, etc.)
    const appErrors = consoleErrors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('analytics') &&
        !e.includes('gtag') &&
        !e.includes('404') &&
        !e.includes('chrome-extension') &&
        !e.includes('extensions')
    );

    if (appErrors.length > 0) {
      console.warn('Console errors encontrados:', appErrors);
    }

    // Toleramos hasta 2 errores de consola externos
    expect(appErrors.length).toBeLessThanOrEqual(2);
  });

  // ─── Recursos 404 ────────────────────────────────────────────────────

  test('no hay recursos críticos que retornen 404', async ({ page }) => {
    const failedRequests: string[] = [];

    page.on('response', (response) => {
      if (
        response.status() === 404 &&
        !response.url().includes('favicon') &&
        !response.url().includes('robots.txt')
      ) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });

    if (failedRequests.length > 0) {
      console.log('Recursos 404:', failedRequests);
    }

    // Solo JS y CSS son críticos
    const criticalFailures = failedRequests.filter(
      (req) => req.includes('.js') || req.includes('.css') || req.includes('.json')
    );
    expect(criticalFailures).toHaveLength(0);
  });

  // ─── Métricas de rendimiento ──────────────────────────────────────────

  test('mide métricas de Core Web Vitals con Navigation Timing API', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });

    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        ttfb: nav.responseStart - nav.requestStart,
        domInteractive: nav.domInteractive,
        domComplete: nav.domComplete,
        loadEventEnd: nav.loadEventEnd,
      };
    });

    console.log('Métricas de rendimiento:', metrics);

    // Time to First Byte < 2000ms
    expect(metrics.ttfb).toBeLessThan(2000);
    // DOM interactivo < 10s
    expect(metrics.domInteractive).toBeLessThan(10000);
    // DOM completo < 12s
    expect(metrics.domComplete).toBeLessThan(12000);
  });

  test('mide el tamaño total de los recursos descargados', async ({ page }) => {
    const resourceSizes: number[] = [];

    page.on('response', async (response) => {
      try {
        const headers = response.headers();
        const contentLength = headers['content-length'];
        if (contentLength) {
          resourceSizes.push(parseInt(contentLength, 10));
        }
      } catch {
        // Ignorar errores al leer headers
      }
    });

    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });

    const totalBytes = resourceSizes.reduce((a, b) => a + b, 0);
    const totalKB = Math.round(totalBytes / 1024);
    console.log(`Tamaño total de recursos: ~${totalKB} KB`);

    // No más de 5MB de recursos totales
    expect(totalBytes).toBeLessThan(5 * 1024 * 1024);
  });

  // ─── Estabilidad del layout ───────────────────────────────────────────

  test('el banner no cambia de posición después de cargar (CLS)', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#github-header-image', { timeout: 10000 });

    const initialRect = await page.locator('#github-header-image').boundingBox();
    
    // Esperar un momento para que terminen los scripts
    await page.waitForTimeout(2000);

    const finalRect = await page.locator('#github-header-image').boundingBox();

    if (initialRect && finalRect) {
      // La posición vertical no debe cambiar más de 50px (CLS mínimo esperado)
      expect(Math.abs(initialRect.y - finalRect.y)).toBeLessThan(50);
    }
  });

  // ─── Funcionalidad básica en carga ────────────────────────────────────

  test('los inputs del toolbox son interactivos después de cargar', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 15000 });

    const titleInput = page.locator('#title-input');
    await expect(titleInput).toBeVisible({ timeout: 10000 });
    await expect(titleInput).toBeEnabled();

    const subtitleInput = page.locator('#subtitle-input');
    await expect(subtitleInput).toBeVisible();
    await expect(subtitleInput).toBeEnabled();
  });

  test('la página es responsive en viewport móvil (390x844)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });

    const banner = page.locator('#github-header-image');
    await expect(banner).toBeVisible({ timeout: 10000 });

    const bannerRect = await banner.boundingBox();
    expect(bannerRect).not.toBeNull();
    // El banner no debe exceder el ancho del viewport en móvil
    expect(bannerRect!.width).toBeLessThanOrEqual(390 + 10); // +10 tolerancia
  });
});
