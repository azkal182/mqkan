import { test, expect } from '@playwright/test';

test('has title landing page', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/MQK Amtsilati Nasional/);
});

test('has heading hero section', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toContainText(
    "Menghidupkan Kembali Tradisi Keilmuan Islam Melalui Qira'atul Kutub"
  );
});

test('has formulir in registration', async ({ page }) => {
  await page.goto('/registration');

  await expect(page.locator('h2').first()).toContainText(
    'Formulir Pendaftaran'
  );
});

// test('get started link', async ({ page }) => {
//     await page.goto('https://playwright.dev/');

//     // Click the get started link.
//     await page.getByRole('link', { name: 'Get started' }).click();

//     // Expects page to have a heading with the name of Installation.
//     await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
