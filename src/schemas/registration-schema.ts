import { z } from 'zod';
import { Gender } from '@prisma/client';
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 5MB
const MIN_DIMENSIONS = { width: 200, height: 200 };
const MAX_DIMENSIONS = { width: 4096, height: 4096 };
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const optionalValidatedFile = () =>
  z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Gambar terlalu besar. Maksimum ${formatBytes(MAX_FILE_SIZE)}.`
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Format gambar tidak valid (JPEG, PNG, WebP).'
    })
    .or(z.null())
    .optional();

export const RegistrationSchemas = z.object({
  id: z.string().optional().nullable(),
  noRegistration: z.string().optional().nullable(),
  fullName: z.string().min(3, 'Nama minimal 3 karakter'),
  nik: z.string().min(16, 'NIK harus 16 digit').max(16, 'NIK harus 16 digit'),
  birthPlace: z.string().min(3, 'Tempat lahir minimal 3 karakter'),
  birthDate: z.string().min(1, 'Tanggal lahir harus diisi'),
  gender: z.nativeEnum(Gender, { message: 'Jenis Kelamin belum diisi' }),
  kelasId: z.string().min(1, 'Kategori harus dipilih'),
  subKelasId: z.string().min(1, 'Kategori harus dipilih'),
  institutionName: z.string().min(3, 'Nama lembaga minimal 3 karakter'), // Nama Lembaga
  institutionAddress: z.string().min(10, 'Alamat lembaga minimal 10 karakter'), // Alamat Lembaga
  regionId: z.string().min(1, 'Korwil harus dipilih'), // Korwil
  provinceId: z.coerce.number().min(1, 'Provinsi harus dipilih'),
  regencyId: z.coerce.number().min(1, 'Kota/Kabupaten harus dipilih'),
  districtId: z.coerce.number().min(1, 'Kecamatan harus dipilih'),
  villageId: z.coerce.number().min(1, 'Desa/Kelurahan harus dipilih'),
  postalCode: z
    .string()
    .min(5, 'Kode pos harus 5 digit')
    .max(5, 'Kode pos harus 5 digit'),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
  fatherName: z.string().min(3, 'Nama ayah minimal 3 karakter'), // Nama Ayah
  motherName: z.string().min(3, 'Nama ibu minimal 3 karakter'), // Nama Ibu
  parentPhone: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .max(15, 'Nomor telepon maksimal 15 digit')
    .refine((val) => /^08\d{8,13}$/.test(val), {
      message: "Nomor telepon harus diawali dengan '08' dan hanya berisi angka"
    }),
  kk: z
    .instanceof(File, { message: 'harus menyertakan kk' })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Gambar terlalu besar. Harap pilih gambar yang lebih kecil dari ${formatBytes(MAX_FILE_SIZE)}.`
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Harap unggah berkas gambar yang valid (JPEG, PNG, atau WebP).'
    }),
  sk: z
    .instanceof(File, { message: 'harus menyertakan kk' })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Gambar terlalu besar. Harap pilih gambar yang lebih kecil dari ${formatBytes(MAX_FILE_SIZE)}.`
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Harap unggah berkas gambar yang valid (JPEG, PNG, atau WebP).'
    }),
  ijazah: z
    .instanceof(File, { message: 'harus menyertakan ijazah' })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Gambar terlalu besar. Harap pilih gambar yang lebih kecil dari ${formatBytes(MAX_FILE_SIZE)}.`
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Harap unggah berkas gambar yang valid (JPEG, PNG, atau WebP).'
    }),
  photo: z
    .instanceof(File, { message: 'harus menyertakan photo 3x4' })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Gambar terlalu besar. Harap pilih gambar yang lebih kecil dari ${formatBytes(MAX_FILE_SIZE)}.`
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Harap unggah berkas gambar yang valid (JPEG, PNG, atau WebP).'
    })
});

export const RegistrationUpdateSchema = z.object({
  id: z.string({ required_error: 'ID tidak ditemukan' }),

  noRegistration: z.string().optional().nullable(),
  fullName: z.string().min(3, 'Nama minimal 3 karakter'),
  nik: z.string().min(16, 'NIK harus 16 digit').max(16, 'NIK harus 16 digit'),
  birthPlace: z.string().min(3, 'Tempat lahir minimal 3 karakter'),
  birthDate: z.string().min(1, 'Tanggal lahir harus diisi'),
  gender: z.nativeEnum(Gender, { message: 'Jenis Kelamin belum diisi' }),
  kelasId: z.string().min(1, 'Kategori harus dipilih'),
  subKelasId: z.string().min(1, 'Kategori harus dipilih'),
  institutionName: z.string().min(3, 'Nama lembaga minimal 3 karakter'),
  institutionAddress: z.string().min(10, 'Alamat lembaga minimal 10 karakter'),
  regionId: z.string().min(1, 'Korwil harus dipilih'),
  provinceId: z.coerce.number().min(1, 'Provinsi harus dipilih'),
  regencyId: z.coerce.number().min(1, 'Kota/Kabupaten harus dipilih'),
  districtId: z.coerce.number().min(1, 'Kecamatan harus dipilih'),
  villageId: z.coerce.number().min(1, 'Desa/Kelurahan harus dipilih'),
  postalCode: z
    .string()
    .min(5, 'Kode pos harus 5 digit')
    .max(5, 'Kode pos harus 5 digit'),
  address: z.string().min(10, 'Alamat minimal 10 karakter'),
  fatherName: z.string().min(3, 'Nama ayah minimal 3 karakter'),
  motherName: z.string().min(3, 'Nama ibu minimal 3 karakter'),
  parentPhone: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .max(15, 'Nomor telepon maksimal 15 digit')
    .refine((val) => /^08\d{8,13}$/.test(val), {
      message: "Nomor telepon harus diawali dengan '08' dan hanya berisi angka"
    }),

  // File: opsional saat update
  kk: optionalValidatedFile(),
  sk: optionalValidatedFile(),
  ijazah: optionalValidatedFile(),
  photo: optionalValidatedFile()
});

export type RegistrationInput = z.infer<typeof RegistrationSchemas>;
export type RegistrationUpdateSchemaInput = z.infer<
  typeof RegistrationUpdateSchema
>;
