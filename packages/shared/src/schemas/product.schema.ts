import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  sku: z
    .string()
    .min(1, 'SKU is required')
    .max(50)
    .regex(/^[A-Z0-9-]+$/, 'SKU must be uppercase alphanumeric with hyphens'),
  price: z.number().min(0, 'Price must be non-negative').max(999999.99, 'Price too high'),
  inventory: z
    .number()
    .int('Inventory must be a whole number')
    .min(0, 'Inventory must be non-negative')
    .max(999999, 'Inventory too high'),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional().default('DRAFT'),
  image: z.string().url().optional().or(z.literal('')),
  ownerId: z.string().min(1, 'Owner is required'),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sku: z.string().optional(),
  ownerId: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
  sortBy: z.enum(['name', 'sku', 'price', 'inventory', 'status', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryParams = z.infer<typeof productQuerySchema>;
