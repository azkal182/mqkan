'use server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';
import { handleError, ResponseType } from '@/lib/error-handler';

// 🚀 Get semua role
export async function getRoles() {
  return prisma.role.findMany({
    include: { permissions: { include: { permission: true } } }
  });
}

// 🚀 Get role berdasarkan ID
export async function getRoleById(id: string) {
  const role = await prisma.role.findUnique({
    where: { id },
    include: { permissions: { include: { permission: true } } }
  });

  if (!role) return null;

  return {
    ...role,
    permissionIds: role.permissions.map((p) => p.permission.id) // Tambahkan array ID permission
  };
}

// 🚀 Create role baru
export async function createRole(
  name: string,
  permissionIds: string[]
): Promise<ResponseType> {
  try {
    await prisma.role.create({
      data: {
        name,
        permissions: {
          create: permissionIds.map((permissionId) => ({
            permission: { connect: { id: permissionId } }
          }))
        }
      }
    });

    revalidateTag('roles');
    return { success: true, message: 'Role Behasil dibuat!' };
  } catch (err) {
    return handleError(err, 'updateRole');
  }
}

// 🚀 Update role
export async function updateRole(
  id: string,
  name: string,
  permissionIds: string[]
): Promise<ResponseType> {
  try {
    await prisma.role.update({
      where: { id },
      data: {
        name,
        permissions: {
          deleteMany: {}, // Hapus semua permission yang lama
          create: permissionIds.map((permissionId) => ({
            permission: { connect: { id: permissionId } }
          }))
        }
      }
    });
    revalidateTag('roles');
    return { success: true, message: 'Role Behasil diupdate!' };
  } catch (err) {
    return handleError(err, 'updateRole');
  }
}

// 🚀 Hapus role
export async function deleteRole(id: string): Promise<ResponseType> {
  try {
    await prisma.role.delete({ where: { id } });
    revalidateTag('roles');
    return { success: true, message: 'Role Behasil dihapus!' };
  } catch (err) {
    return handleError(err, 'deleteRole');
  }
}
