'use server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export const getPermissions = async () => {
  const permissions = await prisma.permission.findMany({
    select: { id: true, name: true, label: true }
  });

  logger.info('getPermissions', { permissions });

  return permissions;
};
