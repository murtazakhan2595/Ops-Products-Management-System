import apiClient from '@/lib/api-client';

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: string;
  inventory: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  image: string | null;
  ownerId: string;
  owner: Owner;
  createdAt: string;
  updatedAt: string;
}

export interface Owner {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
}

export interface ProductsResponse {
  success: true;
  data: Product[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sku?: string;
  ownerId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductInput {
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  image?: string;
  ownerId: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export const productsApi = {
  getAll: async (params: ProductQueryParams = {}): Promise<ProductsResponse> => {
    const { data } = await apiClient.get('/products', { params });
    return data;
  },

  getById: async (id: string): Promise<{ success: true; data: Product }> => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  },

  create: async (input: CreateProductInput): Promise<{ success: true; data: Product }> => {
    const { data } = await apiClient.post('/products', input);
    return data;
  },

  update: async (id: string, input: UpdateProductInput): Promise<{ success: true; data: Product }> => {
    const { data } = await apiClient.put(`/products/${id}`, input);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};
