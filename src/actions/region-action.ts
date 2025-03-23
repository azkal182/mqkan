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
    const validatedData = validated.data as Region;

    const { id, name, phone, coordinator } = validatedData;
    if (id) {
      const existing = await prisma.region.findUnique({ where: { id } });
      if (existing) {
        return { error: 'Duplicate ID detected' };
      }
    }

    await prisma.region.create({
      data: {
        ...(id && { id: id }),
        name: name,
        coordinator,
        phone
      }
    });
    revalidateTag('/region');
    return { message: 'region created successfully.' };
  } catch (error) {
    return handleError(error, 'createRegion');
  }
};

export const getRegions = async () => {
  return await prisma.region.findMany({
    select: {
      id: true,
      name: true,
      coverage: true,
      coordinator: true,
      phone: true
    }
  });
};

export const getRegionsWithoutPusat = async () => {
  return await prisma.region.findMany({
    where: {
      NOT: { name: 'Pusat' }
    },
    select: {
      id: true,
      name: true,
      coverage: true,
      coordinator: true,
      phone: true
    }
  });
};

export const getAllRegionsWithCount = async () => {
  const regions = await prisma.region.findMany({
    where: {
      NOT: { name: 'Pusat' }
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: { participants: true }
      }
    }
  });

  // Urutkan berdasarkan jumlah peserta terbanyak
  return regions.sort((a, b) => b._count.participants - a._count.participants);
};
