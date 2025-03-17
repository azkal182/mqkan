import { logger } from './logger';
import { Prisma } from '@prisma/client';

export type ResponseType =
  | { success: true; message: string }
  | { success: false; error: { message: string } };

// export const handleError = (error: unknown, context: string): ResponseType => {
//   let message = 'Something went wrong, please try again.';
//
//   if (error instanceof Prisma.PrismaClientKnownRequestError) {
//     logger?.error(`[${context}] Prisma Error: ${error.message}`);
//     message = `Database error: ${error.message}`;
//   } else {
//     logger?.error(`[${context}] Unknown Error:`, error);
//   }
//
//   return { success: false, error: { message } };
// };

export const handleError = (error: unknown, context: string): ResponseType => {
  let message = 'Terjadi kesalahan, silakan coba lagi.'; // Pesan default dalam Bahasa Indonesia

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    logger?.error(`[${context}] Prisma Error: ${error.message}`);

    // Handle unique constraint violation
    if (error.code === 'P2002') {
      const target = error.meta?.target as string[] | undefined;
      const field = target ? target.join(', ') : 'field yang tidak diketahui';
      message = `Data ${field} sudah terdaftar.`; // Pesan error untuk constraint unique
    } else {
      message = `Kesalahan database: ${error.message}`; // Pesan error umum untuk Prisma
    }
  } else if (error instanceof Error) {
    logger?.error(`[${context}] Unknown Error:`, error);
    message = error.message; // Gunakan pesan error asli jika tersedia
  } else {
    logger?.error(`[${context}] Unknown Error:`, error);
  }

  return { success: false, error: { message } };
};
