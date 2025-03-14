'use server';

import { prisma } from '@/lib/prisma';

export async function getRegencies(provinceId: number) {
  return await prisma.regency.findMany({
    where: { provinceId },
    select: {
      id: true,
      name: true,
      code: true,
      fullCode: true
    },
    orderBy: { name: 'asc' }
  });
}
