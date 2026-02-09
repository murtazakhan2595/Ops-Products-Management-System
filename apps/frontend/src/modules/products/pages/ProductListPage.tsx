import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductTable } from '../components/ProductTable';
import { ProductFilters } from '../components/ProductFilters';
import { ProductTableSkeleton } from '../components/ProductSkeleton';
import { Pagination } from '@/components/shared/Pagination';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { useOwners } from '@/modules/owners/hooks/useOwners';
import { useDebounce } from '@/hooks/useDebounce';

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const ownerIdParam = searchParams.get('ownerId');
    if (ownerIdParam) {
      setOwnerId(ownerIdParam);
    }
  }, [searchParams]);

  const debouncedSearch = useDebounce(search, 300);

  const { data: productsData, isLoading } = useProducts({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: status && status !== 'all' ? status : undefined,
    ownerId: ownerId && ownerId !== 'all' ? ownerId : undefined,
    sortBy,
    sortOrder,
  });

  const { data: ownersData } = useOwners();
  const deleteProduct = useDeleteProduct();

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setOwnerId('');
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProduct.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const products = productsData?.data || [];
  const meta = productsData?.meta;
  const owners = ownersData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button asChild>
          <Link to="/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            ownerId={ownerId}
            onOwnerChange={setOwnerId}
            owners={owners}
            onClearFilters={handleClearFilters}
          />

          {isLoading ? (
            <ProductTableSkeleton />
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No products found. {search || status || ownerId ? 'Try adjusting your filters.' : 'Create your first product to get started.'}
            </div>
          ) : (
            <>
              <ProductTable
                products={products}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                onDelete={setDeleteId}
              />
              {meta && (
                <Pagination
                  page={meta.page}
                  totalPages={meta.totalPages}
                  total={meta.total}
                  limit={meta.limit}
                  onPageChange={setPage}
                  onLimitChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        loading={deleteProduct.isPending}
      />
    </div>
  );
}
