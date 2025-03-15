import { test, expect } from '@playwright/test';

test('Redirect to /login if not authenticated', async ({ page }) => {
  // 1. Buka halaman dashboard tanpa login
  await page.goto('/dashboard');

  // 2. Pastikan diarahkan ke halaman login
  await expect(page).toHaveURL('/login');
});

test.describe('Login Page', () => {
  test('User can login and redirect to dashboard', async ({ page }) => {
    // 1️⃣ Buka halaman login
    await page.goto('/login');

    // 2️⃣ Isi input username
    await page.fill('input[name="username"]', 'admin');

    // 3️⃣ Isi input password
    await page.fill('input[name="password"]', 'admin');

    // 4️⃣ Klik tombol Login
    await page.click('button[type="submit"]');

    // 5️⃣ Tunggu hingga redirect ke dashboard
    await page.waitForURL('/dashboard');

    // 6️⃣ Pastikan berada di dashboard
    await expect(page).toHaveURL('/dashboard');

    // 7️⃣ Pastikan elemen di dashboard muncul (misalnya heading "Dashboard")
    await expect(page).toHaveTitle(/Dashboard MQKAN/);
    // username admin
    // await expect(page.getByText('admin')).toBeVisible()
  });

  test('Login gagal dengan kredensial salah', async ({ page }) => {
    // Buka halaman login
    await page.goto('/login');

    // Masukkan username & password yang salah
    await page.fill('input[name="username"]', 'wronguser');
    await page.fill('input[name="password"]', 'wrongpassword');

    // Klik tombol login
    await page.click('button[type="submit"]');

    // Tunggu sampai toast error muncul (dari Sooner)
    const toastError = page.locator('[data-sonner-toast][data-type="error"]');

    // Verifikasi toast muncul
    await expect(toastError).toBeVisible();

    // Verifikasi teks error di dalam toast
    await expect(toastError.locator('div[data-title]')).toHaveText(
      'Invalid Credentials'
    );
  });

  test('Show validation errors when inputs are empty', async ({ page }) => {
    // 1️⃣ Buka halaman login
    await page.goto('/login');

    // Kosongkan input jika memiliki nilai default
    await page.fill('input[name="username"]', '');
    await page.fill('input[name="password"]', '');

    // 2️⃣ Klik tombol Login tanpa mengisi form
    await page.click('button[type="submit"]');

    // 3️⃣ Pastikan field username dan password memiliki atribut aria-invalid=true
    await expect(page.locator('input[name="username"]')).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    await expect(page.locator('input[name="password"]')).toHaveAttribute(
      'aria-invalid',
      'true'
    );

    // 4️⃣ Pastikan pesan error muncul berdasarkan teks yang ada
    await expect(page.locator('p:text("Username is required")')).toBeVisible();
    await expect(page.locator('p:text("Password is required")')).toBeVisible();
  });
});
