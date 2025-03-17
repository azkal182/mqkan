'use server';

import { prisma } from '@/lib/prisma';

export interface CategoryResponse {
  id: number;
  name: string;
  subcategories: Subcategories[];
}

export interface Subcategories {
  id: number;
  name: string;
}

export const getCategories = async (): Promise<CategoryResponse[]> => {
  const categories = await prisma.category.findMany({
    where: {
      subcategories: {
        some: {} // Hanya ambil kategori yang memiliki subkategori
      }
    },
    include: {
      subcategories: {
        include: {
          subcategory: {
            // Ambil data dari relasi subcategory
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    subcategories: category.subcategories.map((sub) => ({
      id: sub.subcategory.id, // Ambil ID dari subcategory
      name: sub.subcategory.name // Ambil nama dari subcategory
    }))
  }));
};
