import { Router } from 'express';
import { z } from 'zod';
import { productController } from './product.controller.js';
import { validate } from '../../core/middleware/validate.js';

const router = Router();

const createProductSchema = z.object({
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
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
  image: z.string().url().optional().or(z.literal('')),
  ownerId: z.string().min(1, 'Owner is required'),
});

const updateProductSchema = createProductSchema.partial();

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', validate(createProductSchema), productController.createProduct);
router.put('/:id', validate(updateProductSchema), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export { router as productRoutes };
