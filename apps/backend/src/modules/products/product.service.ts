import { Decimal } from '@prisma/client/runtime/library';
import { productRepository, type FindManyParams } from './product.repository.js';
import { AppError } from '../../core/errors/app-error.js';
import { ErrorCodes } from '../../core/errors/error-codes.js';
import { getPaginationMeta } from '../../core/utils/pagination.js';

export interface CreateProductDTO {
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  image?: string;
  ownerId: string;
}

export interface UpdateProductDTO {
  name?: string;
  sku?: string;
  price?: number;
  inventory?: number;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  image?: string;
  ownerId?: string;
}

class ProductService {
  async getProducts(params: FindManyParams) {
    const { products, total } = await productRepository.findMany(params);
    const meta = getPaginationMeta(total, params.page, params.limit);
    return { products, meta };
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw AppError.notFound(ErrorCodes.PRODUCT_NOT_FOUND, 'Product not found');
    }
    return product;
  }

  async createProduct(data: CreateProductDTO) {
    const existingSku = await productRepository.findBySku(data.sku);
    if (existingSku) {
      throw AppError.conflict(ErrorCodes.DUPLICATE_SKU, 'A product with this SKU already exists');
    }

    return productRepository.create({
      name: data.name,
      sku: data.sku,
      price: new Decimal(data.price),
      inventory: data.inventory,
      status: data.status || 'DRAFT',
      image: data.image,
      owner: { connect: { id: data.ownerId } },
    });
  }

  async updateProduct(id: string, data: UpdateProductDTO) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw AppError.notFound(ErrorCodes.PRODUCT_NOT_FOUND, 'Product not found');
    }

    if (data.sku && data.sku !== existing.sku) {
      const existingSku = await productRepository.findBySku(data.sku);
      if (existingSku) {
        throw AppError.conflict(ErrorCodes.DUPLICATE_SKU, 'A product with this SKU already exists');
      }
    }

    return productRepository.update(id, {
      ...(data.name && { name: data.name }),
      ...(data.sku && { sku: data.sku }),
      ...(data.price !== undefined && { price: new Decimal(data.price) }),
      ...(data.inventory !== undefined && { inventory: data.inventory }),
      ...(data.status && { status: data.status }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.ownerId && { owner: { connect: { id: data.ownerId } } }),
    });
  }

  async deleteProduct(id: string) {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw AppError.notFound(ErrorCodes.PRODUCT_NOT_FOUND, 'Product not found');
    }
    await productRepository.delete(id);
  }
}

export const productService = new ProductService();
