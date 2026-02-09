export const ProductStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const;

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

export const ProductStatusLabels: Record<ProductStatus, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  ARCHIVED: 'Archived',
};

export const ProductStatusColors: Record<ProductStatus, string> = {
  DRAFT: 'gray',
  ACTIVE: 'green',
  ARCHIVED: 'red',
};
