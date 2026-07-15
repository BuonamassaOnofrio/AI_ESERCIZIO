import { test, expect } from '@playwright/test';

test.describe('Language switching', () => {
  test.use({ locale: 'it-IT' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('defaults to Italian and marks IT as active when the browser locale is Italian', async ({
    page,
  }) => {
    await expect(page.locator('h1')).toHaveText('Radice Quadrata');
    await expect(page.locator('.lang-switch button', { hasText: 'IT' })).toHaveClass(/is-active/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'it');
  });

  test('switches to English and updates the title, labels and html[lang]', async ({ page }) => {
    await page.locator('.lang-switch button', { hasText: 'EN' }).click();

    await expect(page.locator('h1')).toHaveText('Square Root');
    await expect(page.locator('label')).toHaveText('Number');
    await expect(page.locator('button.calculate')).toHaveText('Calculate');
    await expect(page.locator('.result')).toHaveText('No calculation performed yet.');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.lang-switch button', { hasText: 'EN' })).toHaveClass(/is-active/);
  });

  test('persists the chosen language across a reload', async ({ page }) => {
    await page.locator('.lang-switch button', { hasText: 'EN' }).click();
    await expect(page.locator('h1')).toHaveText('Square Root');

    await page.reload();

    await expect(page.locator('h1')).toHaveText('Square Root');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    expect(await page.evaluate(() => localStorage.getItem('sqrt-microfrontend.lang'))).toBe('en');
  });
});

test.describe('Language resolution from browser locale', () => {
  test.use({ locale: 'en-US' });

  test('falls back to English when the browser locale is not Italian and nothing is stored', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toHaveText('Square Root');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
});
