import { logger } from './logger';
import { Prisma } from '@prisma/client';

export type ResponseType =
  | { success: true; message: string }
  | { success: false; error: { message: string } };

export const handleError = (error: unknown, context: string): ResponseType => {
  let message = 'Something went wrong, please try again.';

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger?.error(`[${context}] Prisma Error: ${error.message}`);
    message = `Database error: ${error.message}`;
  } else {
    logger?.error(`[${context}] Unknown Error:`, error);
  }

  return { success: false, error: { message } };
};
