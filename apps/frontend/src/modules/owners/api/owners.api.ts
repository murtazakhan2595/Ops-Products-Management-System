import apiClient from '@/lib/api-client';

export interface Owner {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface OwnersResponse {
  success: true;
  data: Owner[];
}

export const ownersApi = {
  getAll: async (): Promise<OwnersResponse> => {
    const { data } = await apiClient.get('/owners');
    return data;
  },

  getById: async (id: string): Promise<{ success: true; data: Owner }> => {
    const { data } = await apiClient.get(`/owners/${id}`);
    return data;
  },
};
