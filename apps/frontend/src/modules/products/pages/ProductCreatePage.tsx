import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductForm } from '../components/ProductForm';
import { useCreateProduct } from '../hooks/useProducts';
import { useOwners } from '@/modules/owners/hooks/useOwners';

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { data: ownersData, isLoading: ownersLoading } = useOwners();
  const createProduct = useCreateProduct();

  const handleSubmit = async (data: Parameters<typeof createProduct.mutateAsync>[0]) => {
    await createProduct.mutateAsync(data);
    navigate('/products');
  };

  const owners = ownersData?.data || [];

  if (ownersLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Product</h1>
          <p className="text-muted-foreground">Add a new product to your inventory</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            owners={owners}
            onSubmit={handleSubmit}
            isLoading={createProduct.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
