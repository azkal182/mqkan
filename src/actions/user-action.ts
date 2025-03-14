'use server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  UpdateUser,
  UpdateUserSchema,
  User,
  UserSchema
} from '@/schemas/user-schema';
import { hash } from 'bcryptjs';
import { handleError, ResponseType } from '@/lib/error-handler';
import { revalidatePath } from 'next/cache';
import { logger } from '@/lib/logger';

export type UserWithRolesAndRegions = Prisma.UserGetPayload<{
  include: {
    roles: {
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: { select: { name: true } };
              };
            };
          };
        };
      };
    };
    regions: {
      include: {
        region: { select: { name: true } };
      };
    };
  };
}>;

export interface GetUsersResponse {
  totalUsers: number;
  users: UserWithRolesAndRegions[];
}

export const getUsers = async (filters: {
  roleId?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<GetUsersResponse> => {
  const { roleId, search, page = 1, limit = 10 } = filters;
  logger.info('getUsers', filters);

  // Jika ada roleId, pisahkan berdasarkan titik '.'
  const roleIds = roleId ? roleId.split('.') : [];

  // 1. Total user sebelum filter
  const totalUsers = await prisma.user.count({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { username: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {},
        roleIds.length > 0
          ? { roles: { some: { roleId: { in: roleIds } } } }
          : {}
      ]
    }
  });

  // 2. Query dengan filter, search, dan pagination
  const users = await prisma.user.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { username: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {},
        roleIds.length > 0
          ? { roles: { some: { roleId: { in: roleIds } } } }
          : {}
      ]
    },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: { select: { name: true } }
                }
              }
            }
          }
        }
      },
      regions: {
        include: {
          region: { select: { name: true } }
        }
      }
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: 'desc'
    }
  });

  return { totalUsers, users };
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      roles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: { select: { name: true } }
                }
              }
            }
          }
        }
      },
      regions: {
        include: {
          region: { select: { name: true } }
        }
      }
    }
  });
};

export const createUser = async (data: User): Promise<ResponseType> => {
  try {
    const validated = UserSchema.safeParse(data);
    if (!validated.success) {
      return handleError('Invalid user fields', 'createUser');
    }

    const { username, password, roleId, regionId, name } = validated.data!;
    const userExist = await prisma.user.findUnique({ where: { username } });

    if (userExist) {
      return handleError('Username sudah terpakai', 'createUser');
    }

    const hashPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        name,
        password: hashPassword,
        roles: {
          create: { roleId }
        },
        ...(regionId.length && {
          regions: {
            create: regionId.map((id) => ({ regionId: id }))
          }
        })
      }
    });
    revalidatePath('/dashboard/users');
    return { success: true, message: 'User created successfully' };
  } catch (error) {
    return handleError(error, 'createUser');
  }
};

export const updateUser = async (data: UpdateUser): Promise<ResponseType> => {
  try {
    const validated = UpdateUserSchema.safeParse(data);
    if (!validated.success) {
      return handleError('Invalid user data', 'updateUser');
    }

    const { id, username, roleId, regionId, name } = validated.data!;

    const updatedData: Prisma.UserUpdateInput = {
      ...(username && { username }),
      ...(name && { name }),
      // ...(password && { password: await hash(password, 10) }),
      ...(roleId && {
        roles: {
          deleteMany: {}, // Hapus semua role lama
          create: roleId ? { roleId } : undefined // Tambahkan role baru jika ada
        }
      }),

      ...(regionId && {
        regions: {
          deleteMany: {}, // Hapus semua region lama
          create: regionId.map((id) => ({ regionId: id })) || undefined // Tambahkan region baru jika ada
        }
      })
    };

    await prisma.user.update({
      where: { id },
      data: updatedData
    });

    return { success: true, message: 'User berhasil dibuat!' };
  } catch (error) {
    return handleError(error, 'updateUser');
  }
};

export const deleteUser = async (id: string): Promise<ResponseType> => {
  try {
    const userExist = await prisma.user.findUnique({ where: { id } });
    if (!userExist) {
      return handleError('tidak ada user yang terdaftar', 'deleteUser');
    }

    await prisma.user.delete({ where: { id } });
    revalidatePath('/dashboard/users');
    return { success: true, message: 'User berhasil dihapus!' };
  } catch (error) {
    return handleError(error, 'deleteUser');
  }
};

export const changePassword = async (
  id: string,
  password: string
): Promise<ResponseType> => {
  try {
    const userExist = await prisma.user.findUnique({ where: { id } });
    if (!userExist) {
      return handleError('tidak ada user yang terdaftar', 'deleteUser');
    }

    const hashPassword = await hash(password, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashPassword }
    });
    revalidatePath('/dashboard/users');
    return { success: true, message: 'Ganti Password Berhasil!' };
  } catch (error) {
    return handleError(error, 'deleteUser');
  }
};
