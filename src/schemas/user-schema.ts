import { z } from 'zod';

export const UserSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string(),
  roleId: z.string().min(1, 'Role Harus diisi'),
  regionId: z.string().array()
});
export const UpdateUserSchema = UserSchema.partial().extend({
  id: z.string()
});

export type User = z.infer<typeof UserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
