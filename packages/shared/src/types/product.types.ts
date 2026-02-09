import type { ProductStatus } from '../constants/status.js';

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status: ProductStatus;
  image: string | null;
  ownerId: string;
  owner?: Owner;
  createdAt: string;
  updatedAt: string;
}

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

export interface ProductWithOwner extends Product {
  owner: Owner;
}
