'use server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  UpdateUser,
  UpdateUserSchema,
  User,
  UserSchema
} from '@/schemas/user-schema';
import { hashSync } from 'bcryptjs';
import { handleError } from '@/lib/error-handler';
import { revalidatePath } from 'next/cache';

export type UserWithRolesAndRegions = Prisma.UserGetPayload<{
  include: {
    roles: {
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: {
                  select: { name: true };
                };
              };
            };
          };
        };
      };
    };
    regions: {
      include: {
        region: {
          select: { name: true };
        };
      };
    };
  };
}>;

export const getUsers = async (): Promise<UserWithRolesAndRegions[]> => {
  return await prisma.user.findMany({
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

export const createUser = async (data: User) => {
  try {
    const validated = UserSchema.safeParse(data);
    if (!validated.success) {
      return { error: 'Invalid user fields' };
    }

    const { username, password, roleId, regionId, name } = validated.data!;
    const userExist = await prisma.user.findUnique({ where: { username } });

    if (userExist) {
      return { error: 'Username already exists' };
    }

    const hashPassword = hashSync(password, 10);

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

export const updateUser = async (data: UpdateUser) => {
  try {
    const validated = UpdateUserSchema.safeParse(data);
    if (!validated.success) {
      return { error: 'Invalid user data' };
    }

    const { id, username, password, roleId, regionId, name } = validated.data!;

    const updatedData: Record<string, any> = {
      ...(username && { username }),
      ...(name && { name }),
      ...(password && { password: hashSync(password, 10) }),
      ...(roleId && { roles: { set: [{ id: roleId }] } }),
      ...(regionId && { regions: { set: [{ id: regionId }] } })
    };

    await prisma.user.update({
      where: { id },
      data: updatedData
    });

    return { success: true, message: 'User updated successfully' };
  } catch (error) {
    return handleError(error, 'updateUser');
  }
};

export const deleteUser = async (id: string) => {
  try {
    const userExist = await prisma.user.findUnique({ where: { id } });
    if (!userExist) {
      return { error: 'User not found' };
    }

    await prisma.user.delete({ where: { id } });

    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    return handleError(error, 'deleteUser');
  }
};
