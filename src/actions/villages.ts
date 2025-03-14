'use server';

import { prisma } from '@/lib/prisma';

export async function getVillages(districtId: number) {
  return await prisma.village.findMany({
    where: { districtId },
    select: {
      id: true,
      name: true,
      code: true,
      fullCode: true,
      postalCode: true
    },
    orderBy: { name: 'asc' }
  });
}
