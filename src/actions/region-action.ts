'use server';
import { prisma } from '@/lib/prisma';
import { Region, RegionSchema } from '@/schemas/region-schema';
import { handleError } from '@/lib/error-handler';
import { revalidateTag } from 'next/cache';

export const createRegion = async (data: Region) => {
  try {
    const validated = RegionSchema.safeParse(data);
    if (!validated.data) {
      return { error: 'invalid region field' };
    }

    const { id, name } = validated.data;
    if (id) {
      const existing = await prisma.region.findUnique({ where: { id } });
      if (existing) {
        return { error: 'Duplicate ID detected' };
      }
    }

    await prisma.region.create({
      data: {
        ...(id && { id: id }),
        name: name
      }
    });
    revalidateTag('/region');
    return { message: 'region created successfully.' };
  } catch (error) {
    return handleError(error, 'createRegion');
  }
};

export const getRegions = async () => {
  return await prisma.region.findMany();
};
