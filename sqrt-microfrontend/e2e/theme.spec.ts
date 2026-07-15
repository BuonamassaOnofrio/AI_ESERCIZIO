import { test, expect } from '@playwright/test';

test.describe('Theme toggle', () => {
  test.use({ locale: 'it-IT' });

  test('defaults to dark mode when nothing is stored and the OS has no light preference', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('.theme-switch')).toHaveAttribute(
      'aria-label',
      'Passa alla modalità giorno',
    );
  });

  test('resolves to light mode when the OS prefers a light color scheme', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('.theme-switch')).toHaveAttribute(
      'aria-label',
      'Passa alla modalità notte',
    );
  });

  test('toggles between dark and light mode on click', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.locator('.theme-switch').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('.theme-switch')).toHaveAttribute(
      'aria-label',
      'Passa alla modalità notte',
    );

    await page.locator('.theme-switch').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('persists the chosen theme across a reload', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');

    await page.locator('.theme-switch').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.reload();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    expect(await page.evaluate(() => localStorage.getItem('sqrt-microfrontend.theme'))).toBe(
      'light',
    );
  });
});
