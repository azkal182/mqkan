'use server';

import { prisma } from '@/lib/prisma';
import { OfficialFormData, officialSchema } from '@/schemas/official-schema';
import { revalidatePath } from 'next/cache';

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

export async function createOfficial(data: OfficialFormData) {
  try {
    const validatedData = officialSchema.parse(data);
    await prisma.official.create({
      data: {
        fullName: validatedData.fullName,
        address: validatedData.address,
        phone: validatedData.phone,
        aggree: validatedData.aggree,
        regionId: validatedData.regionId || null
      }
    });
    revalidatePath('/officials');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOfficial(id: string, data: OfficialFormData) {
  try {
    const validatedData = officialSchema.parse(data);
    await prisma.official.update({
      where: { id },
      data: {
        fullName: validatedData.fullName,
        address: validatedData.address,
        phone: validatedData.phone,
        aggree: validatedData.aggree,
        regionId: validatedData.regionId || null
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
