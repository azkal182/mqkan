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
      participants: {
        select: {
          gender: true,
          subKelas: {
            select: {
              name: true,
              kelas: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      }
    }
  });

  // const formattedRegions = regions.map((region) => {
  //   const putraCount = region.participants.filter(
  //     (p) => p.gender === 'PUTRA'
  //   ).length;
  //   const putriCount = region.participants.filter(
  //     (p) => p.gender === 'PUTRI'
  //   ).length;

  //   return {
  //     id: region.id,
  //     name: region.name,
  //     total: putraCount + putriCount,
  //     putra: putraCount,
  //     putri: putriCount
  //   };
  // });
  const formattedRegions = regions.map((region) => {
    // Inisialisasi objek untuk menyimpan jumlah per kelas dan subKelas
    const kelasBreakdown: any = {};

    // Hitung jumlah peserta berdasarkan gender, kelas, dan subKelas
    region.participants.forEach((participant: any) => {
      const kelasName = participant.subKelas.kelas.name;
      const subKelasName = participant.subKelas.name;
      const gender = participant.gender;

      // Inisialisasi struktur jika belum ada
      if (!kelasBreakdown[kelasName]) {
        kelasBreakdown[kelasName] = {
          total: 0,
          putra: 0,
          putri: 0,
          subKelas: {}
        };
      }
      if (!kelasBreakdown[kelasName].subKelas[subKelasName]) {
        kelasBreakdown[kelasName].subKelas[subKelasName] = {
          total: 0,
          putra: 0,
          putri: 0
        };
      }

      // Tambahkan jumlah peserta
      kelasBreakdown[kelasName].total += 1;
      kelasBreakdown[kelasName].subKelas[subKelasName].total += 1;

      if (gender === 'PUTRA') {
        kelasBreakdown[kelasName].putra += 1;
        kelasBreakdown[kelasName].subKelas[subKelasName].putra += 1;
      } else if (gender === 'PUTRI') {
        kelasBreakdown[kelasName].putri += 1;
        kelasBreakdown[kelasName].subKelas[subKelasName].putri += 1;
      }
    });

    // Hitung total putra dan putri untuk region
    const putraCount = region.participants.filter(
      (p) => p.gender === 'PUTRA'
    ).length;
    const putriCount = region.participants.filter(
      (p) => p.gender === 'PUTRI'
    ).length;

    return {
      id: region.id,
      name: region.name,
      total: putraCount + putriCount,
      putra: putraCount,
      putri: putriCount,
      kelas: kelasBreakdown
    };
  });
  // console.log(JSON.stringify(formattedRegions, null, 2));

  // Urutkan berdasarkan total peserta terbanyak
  return formattedRegions.sort((a, b) => b.total - a.total);
};
