'use server';

import { prisma } from '@/lib/prisma';

export async function getProvinces() {
  return await prisma.province.findMany({
    select: {
      id: true,
      name: true,
      code: true
    },
    orderBy: { name: 'asc' }
  });
}
