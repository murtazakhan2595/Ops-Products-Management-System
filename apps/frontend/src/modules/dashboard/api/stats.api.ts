import apiClient from '@/lib/api-client';
import type { Product } from '@/modules/products/api/products.api';

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  archivedProducts: number;
  lowInventoryCount: number;
  ownerCount: number;
  productsByOwner: {
    id: string;
    name: string;
    productCount: number;
  }[];
  recentProducts: Product[];
}

export interface StatsResponse {
  success: true;
  data: DashboardStats;
}

export const statsApi = {
  getDashboardStats: async (): Promise<StatsResponse> => {
    const { data } = await apiClient.get('/stats');
    return data;
  },
};
