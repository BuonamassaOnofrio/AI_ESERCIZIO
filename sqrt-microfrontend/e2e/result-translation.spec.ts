import { test, expect } from '@playwright/test';

test.use({ locale: 'it-IT' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Result re-translation on language switch', () => {
  test('re-translates a success result without recalculating', async ({ page }) => {
    await page.locator('#numberInput').fill('25');
    await page.locator('button.calculate').click();
    await expect(page.locator('.result')).toHaveText('La radice quadrata di 25 è 5.0000.');

    await page.locator('.lang-switch button', { hasText: 'EN' }).click();

    await expect(page.locator('.result')).toHaveText('The square root of 25 is 5.0000.');
  });

  test('re-translates the negative-number error', async ({ page }) => {
    await page.locator('#numberInput').fill('-9');
    await page.locator('button.calculate').click();
    await expect(page.locator('.result')).toHaveText(
      'Impossibile calcolare la radice di un numero negativo.',
    );

    await page.locator('.lang-switch button', { hasText: 'EN' }).click();

    await expect(page.locator('.result')).toHaveText(
      'Cannot calculate the square root of a negative number.',
    );
    await expect(page.locator('.result')).toHaveClass(/error/);
  });

  test('re-translates the invalid-input error', async ({ page }) => {
    await page.locator('button.calculate').click();
    await expect(page.locator('.result')).toHaveText('Inserisci un numero valido.');

    await page.locator('.lang-switch button', { hasText: 'EN' }).click();

    await expect(page.locator('.result')).toHaveText('Enter a valid number.');
  });
});
