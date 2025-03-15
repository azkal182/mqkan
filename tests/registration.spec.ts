import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/registration');
});

test('should submit registration form successfully', async ({ page }) => {
  // Check page title
  await expect(page).toHaveTitle(/MQK Amtsilati Nasional/);

  // Verify auto-generated registration number
  const regNumber = page.getByLabel('Nomor Pendaftaran');
  await expect(regNumber).toBeDisabled();
  await expect(regNumber).not.toBeEmpty();

  // Fill personal information
  await page.getByLabel('Nama Lengkap').fill('John Doe');
  await page.getByLabel('NIK').fill('1234567890123456');
  await page.getByLabel('Tempat Lahir').fill('Jakarta');
  await page.getByLabel('Tanggal Lahir').fill('2000-01-01');

  // Select gender
  await page.getByLabel('Jenis Kelamin').click();
  await page.getByRole('option', { name: 'PUTRA' }).click();

  // Select category and class
  await page.getByLabel('Kategori').click();
  await page.getByRole('option', { name: 'MQK' }).click();
  await page.getByLabel('JENJANG').click();
  await page.getByRole('option', { name: 'WUSTHO' }).click();

  // Institution information
  await page.getByLabel('Nama Lembaga').fill('Sekolah ABC');
  await page.getByLabel('Di Bawah Naungan Korwil').click();
  await page.getByRole('option', { name: 'JATENG 1' }).click();
  await page
    .getByLabel('Alamat Lengkap Lembaga')
    .fill('Jl. Pendidikan No. 123');

  // Address selection
  await page.getByLabel('Provinsi').click();
  await page.getByRole('option', { name: 'Jawa Barat' }).click();
  await page.getByLabel('Kota/Kabupaten').click();
  await page.getByRole('option', { name: 'Bandung' }).click();
  await page.getByLabel('Kecamatan').click();
  await page.getByRole('option', { name: 'Cimahi' }).click();
  await page.getByLabel('Desa/Kelurahan').click();
  await page.getByRole('option', { name: 'Cimahi Utara' }).click();

  await page.getByLabel('Kode Pos').fill('12345');
  await page.getByLabel('Alamat Lengkap Pribadi').fill('Jl. Merdeka No. 45');

  // Parent information
  await page.getByLabel('Nama Ayah').fill('Robert Doe');
  await page.getByLabel('Nama Ibu').fill('Mary Doe');
  await page.getByLabel('Nomor Telepon Orang Tua').fill('08123456789');

  // File uploads
  //   await page.getByLabel('Upload Kartu Keluarga (KK)').setInputFiles('tests/fixtures/sample.jpg');
  //   await page.getByLabel('Upload Ijazah').setInputFiles('tests/fixtures/sample.jpg');
  //   await page.getByLabel('Upload Pas Foto 3x4').setInputFiles('tests/fixtures/sample.jpg');

  // Submit form
  await page.getByRole('button', { name: 'Submit' }).click();

  // Verify success notification
  // await expect(page.getByText('Pendaftaran berhasil dikirim!')).toBeVisible();
});

test('should show validation errors', async ({ page }) => {
  await page.getByRole('button', { name: 'Submit' }).click();

  // Check multiple validation errors
  await expect(page.getByText('Nama minimal 3 karakter')).toBeVisible();
  await expect(page.getByText('NIK harus 16 digit')).toBeVisible();
  await expect(page.getByText('Provinsi harus dipilih')).toBeVisible();
  // await expect(page.getByText('Input not instance of File')).toBeVisible();
});
