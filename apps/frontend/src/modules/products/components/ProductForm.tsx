import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Owner } from '@/modules/owners/api/owners.api';
import type { Product } from '../api/products.api';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  sku: z
    .string()
    .min(1, 'SKU is required')
    .max(50)
    .regex(/^[A-Z0-9-]+$/, 'SKU must be uppercase alphanumeric with hyphens'),
  price: z.coerce.number().min(0, 'Price must be non-negative').max(999999.99, 'Price too high'),
  inventory: z.coerce
    .number()
    .int('Inventory must be a whole number')
    .min(0, 'Inventory must be non-negative')
    .max(999999, 'Inventory too high'),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  ownerId: z.string().min(1, 'Owner is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  owners: Owner[];
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

export function ProductForm({ product, owners, onSubmit, isLoading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      price: product ? parseFloat(product.price) : 0,
      inventory: product?.inventory || 0,
      status: product?.status || 'DRAFT',
      image: product?.image || '',
      ownerId: product?.ownerId || '',
    },
  });

  const currentStatus = watch('status');
  const currentOwnerId = watch('ownerId');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input id="name" {...register('name')} placeholder="Enter product name" />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            {...register('sku')}
            placeholder="e.g., PROD-001"
            className="uppercase"
          />
          {errors.sku && <p className="text-sm text-red-500">{errors.sku.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register('price')}
            placeholder="0.00"
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="inventory">Inventory *</Label>
          <Input
            id="inventory"
            type="number"
            min="0"
            {...register('inventory')}
            placeholder="0"
          />
          {errors.inventory && <p className="text-sm text-red-500">{errors.inventory.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Status *</Label>
          <Select value={currentStatus} onValueChange={(v) => setValue('status', v as ProductFormData['status'], { shouldDirty: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Owner *</Label>
          <Select value={currentOwnerId} onValueChange={(v) => setValue('ownerId', v, { shouldDirty: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Select owner" />
            </SelectTrigger>
            <SelectContent>
              {owners.map((owner) => (
                <SelectItem key={owner.id} value={owner.id}>
                  <div className="flex items-center gap-2">
                    {owner.avatar && (
                      <img src={owner.avatar} alt={owner.name} className="h-5 w-5 rounded-full" />
                    )}
                    {owner.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.ownerId && <p className="text-sm text-red-500">{errors.ownerId.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            {...register('image')}
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && <p className="text-sm text-red-500">{errors.image.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isLoading || !isDirty}>
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
