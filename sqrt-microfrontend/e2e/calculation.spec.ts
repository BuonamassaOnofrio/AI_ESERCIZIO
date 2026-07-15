import { test, expect } from '@playwright/test';

test.use({ locale: 'it-IT' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Square root calculation', () => {
  test('shows the idle message before any calculation', async ({ page }) => {
    await expect(page.locator('.result')).toHaveText('Nessun calcolo eseguito ancora.');
    await expect(page.locator('.result')).not.toHaveClass(/error/);
  });

  test('computes the square root of a valid number via the Calculate button', async ({ page }) => {
    await page.locator('#numberInput').fill('25');
    await page.locator('button.calculate').click();

    await expect(page.locator('.result')).toHaveText('La radice quadrata di 25 è 5.0000.');
    await expect(page.locator('.result')).not.toHaveClass(/error/);
  });

  test('computes the square root when pressing Enter in the input', async ({ page }) => {
    await page.locator('#numberInput').fill('9');
    await page.locator('#numberInput').press('Enter');

    await expect(page.locator('.result')).toHaveText('La radice quadrata di 9 è 3.0000.');
  });

  test('handles non-perfect-square results with 4 decimal places', async ({ page }) => {
    await page.locator('#numberInput').fill('2');
    await page.locator('button.calculate').click();

    await expect(page.locator('.result')).toHaveText('La radice quadrata di 2 è 1.4142.');
  });

  test('treats zero as a valid input', async ({ page }) => {
    await page.locator('#numberInput').fill('0');
    await page.locator('button.calculate').click();

    await expect(page.locator('.result')).toHaveText('La radice quadrata di 0 è 0.0000.');
    await expect(page.locator('.result')).not.toHaveClass(/error/);
  });

  test('shows an error when submitting an empty input', async ({ page }) => {
    await page.locator('button.calculate').click();

    await expect(page.locator('.result')).toHaveText('Inserisci un numero valido.');
    await expect(page.locator('.result')).toHaveClass(/error/);
  });

  test('rejects non-numeric keystrokes at the input level', async ({ page }) => {
    const input = page.locator('#numberInput');
    await input.pressSequentially('abc');

    await expect(input).toHaveValue('');
  });

  test('shows an error for negative numbers', async ({ page }) => {
    await page.locator('#numberInput').fill('-4');
    await page.locator('button.calculate').click();

    await expect(page.locator('.result')).toHaveText(
      'Impossibile calcolare la radice di un numero negativo.',
    );
    await expect(page.locator('.result')).toHaveClass(/error/);
  });

  test('recovers from an error state once a valid number is submitted', async ({ page }) => {
    await page.locator('#numberInput').fill('-4');
    await page.locator('button.calculate').click();
    await expect(page.locator('.result')).toHaveClass(/error/);

    await page.locator('#numberInput').fill('16');
    await page.locator('button.calculate').click();

    await expect(page.locator('.result')).toHaveText('La radice quadrata di 16 è 4.0000.');
    await expect(page.locator('.result')).not.toHaveClass(/error/);
  });
});
