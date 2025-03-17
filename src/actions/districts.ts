'use server';

import { prisma } from '@/lib/prisma';

export async function getDistricts(regencyId: number) {
  return await prisma.district.findMany({
    where: { regencyId },
    select: {
      id: true,
      name: true
    },
    orderBy: { name: 'asc' }
  });
}
