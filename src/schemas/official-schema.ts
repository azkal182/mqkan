import { z } from 'zod';

export const officialSchema = z.object({
  fullName: z.string().min(2, 'Nama harus minimal 2 karakter'),
  address: z.string().min(5, 'Alamat harus minimal 5 karakter'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Nomor telepon tidak valid'),
  aggree: z.boolean(),
  regionId: z.string().min(2, 'Region harus diisi')
});

export type OfficialFormData = z.infer<typeof officialSchema>;
