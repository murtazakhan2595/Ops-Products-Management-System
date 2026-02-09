import { useQuery } from '@tanstack/react-query';
import { ownersApi } from '../api/owners.api';

export const ownerKeys = {
  all: ['owners'] as const,
  list: () => [...ownerKeys.all, 'list'] as const,
  detail: (id: string) => [...ownerKeys.all, 'detail', id] as const,
};

export function useOwners() {
  return useQuery({
    queryKey: ownerKeys.list(),
    queryFn: () => ownersApi.getAll(),
  });
}

export function useOwner(id: string) {
  return useQuery({
    queryKey: ownerKeys.detail(id),
    queryFn: () => ownersApi.getById(id),
    enabled: !!id,
  });
}
