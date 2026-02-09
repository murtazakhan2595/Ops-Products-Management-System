import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOwners } from '../hooks/useOwners';
import { Package, Mail, ExternalLink } from 'lucide-react';

function OwnerCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 rounded bg-gray-200" />
            <div className="h-4 w-48 rounded bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OwnersListPage() {
  const { data, isLoading, error } = useOwners();

  const owners = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Product Owners</h1>
        <p className="text-muted-foreground">View and manage product ownership</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Owners ({owners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <OwnerCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Failed to load owners. Please try again.
            </div>
          ) : owners.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No owners found.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {owners.map((owner) => (
                <Card key={owner.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {owner.avatar ? (
                        <img
                          src={owner.avatar}
                          alt={owner.name}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xl font-semibold text-primary">
                            {owner.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{owner.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{owner.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Package className="h-3 w-3" />
                          <span>{owner._count?.products ?? 0} products</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link to={`/products?ownerId=${owner.id}`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Products
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
