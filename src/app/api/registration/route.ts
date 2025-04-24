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
import { Prisma } from '@prisma/client';

export type SubKelasWithKelas = Prisma.SubKelasGetPayload<{
  include: { kelas: true };
}>;

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
  subKelas: SubKelasWithKelas,
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

  // Tentukan kode berdasarkan nama kelas
  let kelasCode = '00';
  if (subKelas.kelas.name.toLowerCase().includes('mqk')) {
    kelasCode = '02'; // MQK
  } else if (subKelas.kelas.name.toLowerCase().includes('olimpiade')) {
    kelasCode = '01'; // OLIMPIADE AMTSILATI
  } else if (subKelas.kelas.name.toLowerCase().includes('dakwah')) {
    kelasCode = '03'; // DAKWAH
  }

  // Tentukan kode berdasarkan nama subKelas
  let subKelasCode = '00';
  if (subKelas.name.toLowerCase().includes('ula')) {
    subKelasCode = '01'; // ULA
  } else if (subKelas.name.toLowerCase().includes('wustho')) {
    subKelasCode = '02'; // WUSTHO
  } else if (subKelas.name.toLowerCase().includes('ulya')) {
    subKelasCode = '03'; // ULYA
  }

  // Ambil nilai dari data
  const genderCode: string = genderMap[data.gender] || '00';

  // Format nomor urut menjadi 4 digit
  const sequencePart: string = sequenceNumber.toString().padStart(4, '0');

  // Gabungkan semua bagian
  return `${datePart}${genderCode}${kelasCode}${subKelasCode}${sequencePart}`;
}

export const createRegistration = async (data: RegistrationInput) => {
  console.log(data);

  const validated = RegistrationSchemas.safeParse(data);

  if (!validated.success) {
    return handleError('invalid fields', 'createParticipant');
  }

  const validatedData = validated.data as RegistrationInput;
  // const userExists = await prisma.participant.findUnique({ where: { nik: validatedData.nik } });
  // if (userExists) {
  //     return Response.json({ success: false, error: { message: 'NIK sudah terdaftar' } });
  // }

  const count = await prisma.participant.count({
    where: {
      gender: data.gender,
      subKelas: {
        id: data.subKelasId,
        kelasId: data.kelasId
      }
    }
  });

  const subKelas = await prisma.subKelas.findFirst({
    where: {
      id: data.subKelasId
    },
    include: {
      kelas: true
    }
  });

  // Pastikan subKelas tidak null sebelum digunakan
  if (!subKelas) {
    return handleError('SubKelas tidak ditemukans', 'createParticipant');
  }

  const noRegistration = generateRegistrationNumber(
    validated.data,
    subKelas,
    count + 1
  );

  let password: string | undefined;
  let kkPath: string | undefined;
  let ijazahPath: string | undefined;
  let photoPath: string | undefined;
  let skPath: string | undefined;

  if (subKelas?.name.toLocaleLowerCase().includes('Olimpiade')) {
    const [year, month, day] = data.birthDate.split('-');
    password = `${day}${month}${year}${noRegistration.slice(-4)}`;
  }

  if (validated.data.kk) {
    kkPath = await uploadNota(validatedData.kk);
  }

  if (validated.data.sk) {
    skPath = await uploadNota(validatedData.sk);
  }

  if (validated.data.ijazah) {
    ijazahPath = await uploadNota(validatedData.ijazah);
  }

  if (validated.data.photo) {
    photoPath = await uploadNota(validatedData.photo);
  }

  try {
    const data = await prisma.participant.create({
      data: {
        noRegistration: noRegistration,
        fullName: validatedData.fullName,
        nik: validatedData.nik,
        birthPlace: validatedData.birthPlace,
        birthDate: DateTime.fromISO(validated.data.birthDate, {
          zone: 'Asia/Jakarta'
        }).toJSDate(),
        gender: validatedData.gender,
        subKelasId: validatedData.subKelasId,
        institutionName: validatedData.institutionName,
        institutionAddress: validatedData.institutionAddress,
        regionId: validatedData.regionId,
        provinceId: validatedData.provinceId,
        regencyId: validatedData.regencyId,
        districtId: validatedData.districtId,
        villageId: validatedData.villageId,
        postalCode: validatedData.postalCode,
        address: validatedData.address,
        fatherName: validatedData.fatherName,
        motherName: validatedData.motherName,
        parentPhone: validatedData.parentPhone,
        skUrl: skPath ?? '',
        kkUrl: kkPath ?? '',
        ijazahUrl: ijazahPath ?? '',
        photoUrl: photoPath ?? '',
        ...(password && { password })
      },
      select: { id: true }
    });
    revalidatePath('/dashboard/participants');
    revalidatePath('/dashboard');
    return { success: true, message: 'Pendaftaran berhasil', id: data.id };
  } catch (error) {
    return handleError(error, 'createParticipant');
  }
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const getString = (key: string) => formData.get(key)?.toString() || '';
    const getRequiredFile = (key: string): File => {
      const file = formData.get(key);
      if (!file || !(file instanceof File)) {
        throw new Error(`File ${key} is required`);
      }
      return file;
    };

    const getNumber = (key: string) => {
      const value = formData.get(key);
      if (!value) throw new Error(`Field ${key} is required`);
      const number = Number(value);
      if (isNaN(number)) throw new Error(`Field ${key} must be a number`);
      return number;
    };

    const data: RegistrationInput = {
      fullName: getString('fullName'),
      nik: getString('nik'),
      birthPlace: getString('birthPlace'),
      birthDate: getString('birthDate'),
      gender: getString('gender') as 'PUTRA' | 'PUTRI',
      subKelasId: getString('subKelasId'),
      kelasId: getString('kelasId'),
      institutionName: getString('institutionName'),
      institutionAddress: getString('institutionAddress'),
      regionId: getString('regionId'),
      provinceId: getNumber('provinceId'),
      regencyId: getNumber('regencyId'),
      districtId: getNumber('districtId'),
      villageId: getNumber('villageId'),
      postalCode: getString('postalCode'),
      address: getString('address'),
      fatherName: getString('fatherName'),
      motherName: getString('motherName'),
      parentPhone: getString('parentPhone'),
      kk: getRequiredFile('kk'),
      sk: getRequiredFile('sk'),
      ijazah: getRequiredFile('ijazah'),
      photo: getRequiredFile('photo')
    };

    const result = await createRegistration(data);

    return Response.json(result);
  } catch (error) {
    // console.error(error);
    return Response.json(handleError(error, 'createParticipant'), {
      status: 400
    });
  }
}
