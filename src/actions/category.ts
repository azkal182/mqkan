'use server';

import { prisma } from '@/lib/prisma';

export type KelasResponse = {
  id: string;
  name: string;
};

export const getKelas = async (): Promise<KelasResponse[]> => {
  return await prisma.kelas.findMany({
    select: {
      id: true,
      name: true
    }
  });
};

export const getSubKelasByKelasId = async (
  kelasId: string
): Promise<KelasResponse[]> => {
  return await prisma.subKelas.findMany({
    where: {
      kelasId
    },
    select: {
      id: true,
      name: true
    }
  });
};
