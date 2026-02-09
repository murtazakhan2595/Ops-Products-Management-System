import { Link } from 'react-router-dom';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/shared/StatusBadge';
import type { Product } from '../api/products.api';
import { formatCurrency } from '@/lib/utils';

interface ProductTableProps {
  products: Product[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort: (field: string) => void;
  onDelete: (id: string) => void;
}

export function ProductTable({ products, sortBy, sortOrder, onSort, onDelete }: ProductTableProps) {
  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => onSort(field)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortBy === field ? 'text-foreground' : 'text-muted-foreground'}`} />
    </Button>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Image</TableHead>
          <TableHead>
            <SortableHeader field="name">Name</SortableHeader>
          </TableHead>
          <TableHead>
            <SortableHeader field="sku">SKU</SortableHeader>
          </TableHead>
          <TableHead>
            <SortableHeader field="price">Price</SortableHeader>
          </TableHead>
          <TableHead>
            <SortableHeader field="inventory">Inventory</SortableHeader>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Owner</TableHead>
          <TableHead className="w-[70px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-10 w-10 rounded object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">
                  N/A
                </div>
              )}
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="font-mono text-sm">{product.sku}</TableCell>
            <TableCell>{formatCurrency(parseFloat(product.price))}</TableCell>
            <TableCell>
              <span className={product.inventory < 10 ? 'text-red-600 font-medium' : ''}>
                {product.inventory}
              </span>
            </TableCell>
            <TableCell>
              <StatusBadge status={product.status} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {product.owner.avatar && (
                  <img
                    src={product.owner.avatar}
                    alt={product.owner.name}
                    className="h-6 w-6 rounded-full"
                  />
                )}
                <span className="text-sm">{product.owner.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/products/${product.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/products/${product.id}`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
