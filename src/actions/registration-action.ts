'use server';

import { prisma } from '@/lib/prisma';
import {
  RegistrationInput,
  RegistrationSchemas
} from '@/schemas/registration-schema';
import { DateTime } from 'luxon';
import { handleError } from '@/lib/error-handler';

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
        kkUrl: '',
        ijazahUrl: '',
        photoUrl: '',
        ...(password && { password })
      },
      select: { id: true }
    });
    return { success: true, message: 'Pendaftaran berhasil', id: data.id };
  } catch (error) {
    return handleError(error, 'createParticipant');
  }
};
