'use server';

import { prisma } from '@/lib/prisma';
import {
  RegistrationInput,
  RegistrationSchemas
} from '@/schemas/registration-schema';
import { DateTime } from 'luxon';
import { handleError } from '@/lib/error-handler';
import sharp from 'sharp';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

const uploadNota = async (file: File): Promise<string> => {
  try {
    // Ambil ekstensi file dari nama asli
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['jpg', 'jpeg', 'png'].includes(ext)) {
      throw new Error('Format file tidak didukung');
    }

    // Tentukan format dan contentType sesuai dengan ekstensi
    const format = ext === 'png' ? 'png' : 'jpeg';
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
    const fileName = `mqkan-${Date.now()}.${ext}`;

    // Konversi file ke buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Proses gambar dengan Sharp
    let compressedBuffer;
    if (format === 'png') {
      compressedBuffer = await sharp(buffer)
        .resize({ width: 1024 }) // Resize jika lebih besar dari 1024px
        .png({ quality: 80 }) // Kompres PNG
        .toBuffer();
    } else {
      compressedBuffer = await sharp(buffer)
        .resize({ width: 1024 }) // Resize jika lebih besar dari 1024px
        .jpeg({ quality: 70 }) // Kompres JPG
        .toBuffer();
    }

    // Upload ke Supabase Storage
    const { data, error } = await supabase.storage
      .from('mqkan')
      .upload(fileName, compressedBuffer, { contentType });

    if (error) {
      console.error('Error meng-upload file:', error);
      throw new Error('Gagal meng-upload file ke Supabase');
    }

    // Ambil URL publik file
    const publicUrl = supabase.storage.from('mqkan').getPublicUrl(data.path)
      .data.publicUrl;
    console.log('Public URL:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Error meng-upload file:', error);
    throw new Error('Gagal meng-upload file');
  }
};

// Fungsi untuk generate nomor registrasi
function generateRegistrationNumber(
  data: RegistrationInput,
  sequenceNumber: number
): string {
  // Ambil tanggal saat ini dengan zona waktu Asia/Jakarta
  const dt = DateTime.now().setZone('Asia/Jakarta');

  // Format YYMMDD
  const datePart: string = dt.toFormat('yyMMdd');

  // Mapping gender
  const genderMap: { [key: string]: string } = {
    PUTRA: '01',
    PUTRI: '02'
  };

  // Mapping kategori
  const categoryMap: { [key: string]: string } = {
    '2': '01', // OLIMPIADE AMTSILATI
    '1': '02', // MQK
    '3': '03' // DAKWAH
  };

  // Mapping jenjang
  const subCategoryMap: { [key: string]: string } = {
    '4': '01', // ULA
    '5': '02', // WUSTHO
    '6': '03' // ULYA
  };

  // Ambil nilai dari data
  const genderCode: string = genderMap[data.gender] || '00';
  const categoryCode: string = categoryMap[data.categoryId] || '00';
  const subCategoryCode: string = subCategoryMap[data.subCategoryId] || '00';

  // Format nomor urut menjadi 4 digit
  const sequencePart: string = sequenceNumber.toString().padStart(4, '0');

  // Gabungkan semua bagian
  return `${datePart}${genderCode}${categoryCode}${subCategoryCode}${sequencePart}`;
}

export const createRegistration = async (data: RegistrationInput) => {
  const validated = RegistrationSchemas.safeParse(data);
  if (!validated.success) {
    return handleError('invalid fields', 'createParticipant');
  }

  const count = await prisma.participant.count({
    where: {
      gender: data.gender,
      subcategory: {
        categoryId: data.categoryId,
        subcategoryId: data.subCategoryId
      }
    }
  });

  const noRegistration = generateRegistrationNumber(validated.data, count + 1);

  let password: string | undefined;
  let kkPath: string | undefined;
  let ijazahPath: string | undefined;
  let photoPath: string | undefined;
  if (data.categoryId === 2) {
    const [year, month, day] = data.birthDate.split('-');
    password = `${day}${month}${year}${noRegistration.slice(-4)}`;
  }

  const categorySubcategory = await prisma.categoryToSubcategory.findFirst({
    where: {
      categoryId: data.categoryId,
      subcategoryId: data.subCategoryId
    }
  });

  if (!categorySubcategory) {
    return handleError('error', 'createParticipant');
    // throw new Error(`Category dan Subcategory tidak cocok! ${validated.data.categoryId} - ${validated.data.subCategoryId}`);
  }

  if (validated.data.kk) {
    kkPath = await uploadNota(validated.data.kk);
  }

  if (validated.data.ijazah) {
    ijazahPath = await uploadNota(validated.data.ijazah);
  }

  if (validated.data.photo) {
    photoPath = await uploadNota(validated.data.photo);
  }

  try {
    const data = await prisma.participant.create({
      data: {
        noRegistration: noRegistration,
        fullName: validated.data.fullName,
        nik: validated.data.nik,
        birthPlace: validated.data.birthPlace,
        birthDate: DateTime.fromISO(validated.data.birthDate, {
          zone: 'Asia/Jakarta'
        }).toJSDate(),
        gender: validated.data.gender,
        subcategory: { connect: { id: categorySubcategory.id } },
        institutionName: validated.data.institutionName,
        institutionAddress: validated.data.institutionAddress,
        region: {
          connect: {
            id: validated.data.regionId
          }
        },
        province: {
          connect: {
            id: validated.data.provinceId
          }
        },
        regency: {
          connect: {
            id: validated.data.regencyId
          }
        },
        district: {
          connect: {
            id: validated.data.districtId
          }
        },
        village: {
          connect: {
            id: validated.data.villageId
          }
        },
        postalCode: validated.data.postalCode,
        address: validated.data.address,
        fatherName: validated.data.fatherName,
        motherName: validated.data.motherName,
        parentPhone: validated.data.parentPhone,
        kkUrl: kkPath ?? '',
        ijazahUrl: ijazahPath ?? '',
        photoUrl: photoPath ?? '',
        ...(password && { password })
      },
      select: { id: true }
    });
    revalidatePath('/dashboard/participants');
    return { success: true, message: 'Pendaftaran berhasil', id: data.id };
  } catch (error) {
    return handleError(error, 'createParticipant');
  }
};
