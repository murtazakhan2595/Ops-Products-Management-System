import { z } from 'zod';

export const ownerSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  avatar: z.string().url().optional(),
});

export type Owner = z.infer<typeof ownerSchema>;
