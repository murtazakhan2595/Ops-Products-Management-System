import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductForm } from '../components/ProductForm';
import { useProduct, useUpdateProduct } from '../hooks/useProducts';
import { useOwners } from '@/modules/owners/hooks/useOwners';

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: productData, isLoading: productLoading } = useProduct(id!);
  const { data: ownersData, isLoading: ownersLoading } = useOwners();
  const updateProduct = useUpdateProduct();

  const handleSubmit = async (data: Parameters<typeof updateProduct.mutateAsync>[0]['data']) => {
    await updateProduct.mutateAsync({ id: id!, data });
    navigate('/products');
  };

  const product = productData?.data;
  const owners = ownersData?.data || [];

  if (productLoading || ownersLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Product Not Found</h1>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
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
          <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-muted-foreground">{product.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm
            product={product}
            owners={owners}
            onSubmit={handleSubmit}
            isLoading={updateProduct.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
