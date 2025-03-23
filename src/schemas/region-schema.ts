import { z } from 'zod';

export const RegionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  coordinator: z.string(),
  phone: z.string()
});
export type Region = z.infer<typeof RegionSchema>;
