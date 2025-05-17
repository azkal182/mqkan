'use server';

import { handleError } from '@/lib/error-handler';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import {
  OfficialFormDataCreate,
  OfficialFormDataEdit,
  officialSchemaCreate,
  officialSchemaEdit
} from '@/schemas/official-schema';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';

// export interface Official {
//   id: string;
//   fullName: string;
//   address: string;
//   phone: string;
//   aggree: boolean;
//   regionId?: string;
//   region?: Region;
// }

export interface Region {
  id: string;
  name: string;
}

const uploadPhoto = async (file: File): Promise<string> => {
  try {
    // Ambil ekstensi file dari nama asli
    const ext = file.name.split('.').pop()?.toLowerCase();
    console.log({ file, ext });
    if (!ext || !['jpg', 'jpeg', 'png'].includes(ext)) {
      throw new Error('Format file tidak didukung');
    }

    // Tentukan format dan contentType sesuai dengan ekstensi
    const format = ext === 'png' ? 'png' : 'jpeg';
    const contentType = ext === 'png' ? 'image/png' : 'image/jpeg';
    const fileName = `official-mqkan-${Date.now()}.${ext}`;

    // Konversi file ke buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Proses gambar dengan Sharp
    let compressedBuffer;
    if (format === 'png') {
      compressedBuffer = await sharp(buffer)
        .rotate()
        .resize({ width: 1024 }) // Resize jika lebih besar dari 1024px
        .png({ quality: 80 }) // Kompres PNG
        .toBuffer();
    } else {
      compressedBuffer = await sharp(buffer)
        .rotate()
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
export async function createOfficial(data: OfficialFormDataCreate) {
  try {
    const validatedData = officialSchemaCreate.safeParse(data);
    if (!validatedData.success) {
      return handleError('invalid fields', 'createOfficial');
    }
    let photoPath: string | undefined;
    if (validatedData.data.photo) {
      photoPath = await uploadPhoto(validatedData.data.photo);
    }

    console.log('final', {
      fullName: validatedData.data.fullName,
      address: validatedData.data.address,
      phone: validatedData.data.phone,
      aggree: validatedData.data.aggree,
      regionId: validatedData.data.regionId || null,
      photo: photoPath || ''
    });
    const result = await prisma.official.create({
      data: {
        fullName: validatedData.data.fullName,
        address: validatedData.data.address,
        phone: validatedData.data.phone,
        aggree: validatedData.data.aggree,
        regionId: validatedData.data.regionId || null,
        photo: photoPath || ''
      }
    });

    revalidatePath('/officials');
    return { success: true, result };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

export async function updateOfficial(id: string, data: OfficialFormDataEdit) {
  try {
    const validated = officialSchemaEdit.safeParse(data);
    if (!validated.success) {
      return { error: 'field invalid' };
    }

    const validatedData = validated.data;

    let photoPath: string | undefined;
    if (validatedData.photo) {
      photoPath = await uploadPhoto(validatedData.photo);
    }

    await prisma.official.update({
      where: { id },
      data: {
        fullName: validatedData.fullName,
        address: validatedData.address,
        phone: validatedData.phone,
        aggree: validatedData.aggree,
        regionId: validatedData.regionId || null,
        ...(validatedData.photo && { photo: photoPath })
      }
    });
    revalidatePath('/officials');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteOfficial(id: string) {
  try {
    await prisma.official.delete({
      where: { id }
    });
    revalidatePath('/officials');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export type Official = {
  id: string;
  regionId: string | null;
  fullName: string;
  address: string;
  phone: string;
  aggree: boolean;
  photo: string | null | undefined;
  checkIn: boolean;
};

export async function getOfficials(
  regionIds: string[] = []
): Promise<Official[]> {
  return await prisma.official.findMany({
    where: {
      // Jika regionIds tidak kosong, filter berdasarkan array regionIds
      regionId: regionIds.length > 0 ? { in: regionIds } : undefined
    },
    include: { region: true },
    orderBy: { fullName: 'asc' }
  });
}

export const updateCheckinOfficial = async (officalId: string) => {
  try {
    const result = prisma.official.findUnique({
      where: { id: officalId }
    });

    if (!result) {
      throw new Error('Official tidak ditemukan');
    }

    const update = await prisma.official.update({
      where: { id: officalId },
      data: {
        checkIn: true
      }
    });

    return {
      message: `update berhasil`,
      update
    };
  } catch (error) {}
};

export type AllOfficials = Official & {
  region: Region;
};

export const getAllOfficial = async (): Promise<AllOfficials[]> => {
  const data = await prisma.official.findMany({
    include: {
      region: true
    }
  });

  return data as AllOfficials[];
};

export const checkInOfficial = async (id: string) => {
  try {
    const official = await prisma.official.findUnique({
      where: { id },
      include: {
        region: true
      }
    });
    // Validasi: Jika peserta tidak ditemukan
    if (!official) {
      throw new Error(`official tidak ditemukan`);
    }

    // Validasi: Jika peserta sudah check-in (opsional, tergantung kebutuhan)
    if (official.checkIn) {
      throw new Error(
        `Peserta ${official.fullName} sudah melakukan registrasi!`
      );
    }

    const updatedOfficial = await prisma.official.update({
      where: { id },
      data: {
        checkIn: true
      }
    });

    // Kembalikan data peserta yang sudah check-in
    return {
      success: true,
      message: `Check-in berhasil untuk ${updatedOfficial.fullName}`,
      data: updatedOfficial
    };
  } catch (error: any) {
    // return {
    //   success: false,
    //   message: error.message || 'Gagal melakukan check-in'
    // };
    throw new Error(error.message || 'Gagal melakukan check-in');
  }
};
