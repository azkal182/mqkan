'use server';

import { prisma } from '@/lib/prisma';

export async function getRegencies(provinceId: number) {
  console.log(provinceId);

  const regencies = await prisma.regency.findMany({
    where: { provinceId },
    select: {
      id: true,
      label: true
    },
    orderBy: { name: 'asc' }
  });
  return regencies.map((regencie) => ({
    id: regencie.id,
    name: regencie.label
  }));
}
