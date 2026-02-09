import type { Response } from 'express';

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200) {
  const response: SuccessResponse<T> = {
    success: true,
    data,
  };
  res.status(statusCode).json(response);
}

export function sendPaginatedSuccess<T>(
  res: Response,
  data: T[],
  meta: PaginationMeta,
  statusCode = 200
) {
  res.status(statusCode).json({
    success: true,
    data,
    meta,
  });
}
