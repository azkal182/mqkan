// import { z } from 'zod';

// const MAX_FILE_SIZE = 2 * 1024 * 1024; // 5MB
// const ACCEPTED_IMAGE_TYPES = [
//   'image/jpeg',
//   'image/jpg',
//   'image/png',
//   'image/webp'
// ];

// const formatBytes = (bytes: number, decimals = 2) => {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const dm = decimals < 0 ? 0 : decimals;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
// };

// export const officialSchema = z.object({
//   fullName: z.string().min(2, 'Nama harus minimal 2 karakter'),
//   address: z.string().min(5, 'Alamat harus minimal 5 karakter'),
//   phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Nomor telepon tidak valid'),
//   aggree: z.boolean(),
//   regionId: z.string().min(2, 'Region harus diisi'),
//   photo: z
//     .instanceof(File, { message: 'harus menyertakan Foto 3x4' })
//     .refine((file) => file.size <= MAX_FILE_SIZE, {
//       message: `Gambar terlalu besar. Harap pilih gambar yang lebih kecil dari ${formatBytes(MAX_FILE_SIZE)}.`
//     })
//     .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
//       message: 'Harap unggah berkas gambar yang valid (JPEG, PNG, atau WebP).'
//     })
// });

// export type OfficialFormData = z.infer<typeof officialSchema>;

import { z } from 'zod';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
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
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const officialSchemaBase = {
  fullName: z.string().min(2, 'Nama harus minimal 2 karakter'),
  address: z.string().min(5, 'Alamat harus minimal 5 karakter'),
  phone: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .max(15, 'Nomor telepon maksimal 15 digit')
    .refine((val) => /^08\d{8,13}$/.test(val), {
      message: "Nomor telepon harus diawali dengan '08' dan hanya berisi angka"
    }),
  aggree: z.boolean(),
  regionId: z.string().min(2, 'Region harus diisi'),
  photo: z
    .instanceof(File, { message: 'Harus menyertakan foto 3x4' })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Gambar terlalu besar. Maksimal ${formatBytes(MAX_FILE_SIZE)}.`
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Format gambar tidak valid (JPEG, PNG, WebP)'
    })
};

export const officialSchemaCreate = z.object(officialSchemaBase);
export const officialSchemaEdit = z.object({
  id: z.string().uuid(),
  fullName: z.string().min(2, 'Nama harus minimal 2 karakter'),
  address: z.string().min(5, 'Alamat harus minimal 5 karakter'),
  phone: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .max(15, 'Nomor telepon maksimal 15 digit')
    .refine((val) => /^08\d{8,13}$/.test(val), {
      message: "Nomor telepon harus diawali dengan '08' dan hanya berisi angka"
    }),
  aggree: z.boolean(),
  regionId: z.string().min(2, 'Region harus diisi'),
  photo: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `Gambar terlalu besar. Maksimum ${formatBytes(MAX_FILE_SIZE)}.`
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: 'Format gambar tidak valid (JPEG, PNG, WebP).'
    })
    .or(z.null())
    .nullable()
    .optional()
});

export type OfficialFormDataCreate = z.infer<typeof officialSchemaCreate>;
export type OfficialFormDataEdit = z.infer<typeof officialSchemaEdit>;
