'use server';

import { prisma } from '@/lib/prisma';

export async function getRegencies(provinceId: number) {
  console.log(provinceId);

  return await prisma.regency.findMany({
    where: { provinceId },
    select: {
      id: true,
      name: true
    },
    orderBy: { name: 'asc' }
  });
}
