import { z } from 'zod';

export const LoginSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(1, 'Username is required'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(4, 'Password must be more than 4 characters')
    .max(32, 'Password must be less than 32 characters')
});
export type LoginInput = z.infer<typeof LoginSchema>;
