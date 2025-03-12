import { logger } from './logger';
import { Prisma } from '@prisma/client';

export const handleError = (error: unknown, context: string) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error(`[${context}] Prisma Error:`, error.message);
    return { error: `Database error: ${error.message}` };
  }

  logger.error(`[${context}] Unknown Error:`, error);
  return { error: 'Something went wrong, please try again.' };
};
