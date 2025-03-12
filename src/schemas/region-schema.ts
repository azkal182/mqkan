import { z } from 'zod';

export const RegionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string()
});
export type Region = z.infer<typeof RegionSchema>;
