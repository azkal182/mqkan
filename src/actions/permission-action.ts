'use server';
import { prisma } from '@/lib/prisma';

export const getPermissions = async () => {
  return await prisma.permission.findMany({
    select: { id: true, name: true, label: true }
  });
};
