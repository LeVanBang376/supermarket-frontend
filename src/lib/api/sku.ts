import { ApiResponse } from '@/types/api';
import { SKU, CreateSKURequest, UpdateSKURequest } from '@/types/sku';
import { apiClient } from './client';

export interface GetSKUsParams {
  page?: number;
  per_page?: number;
}

export function getSKUs(params?: GetSKUsParams): Promise<ApiResponse<SKU[]>> {
  const searchParams = new URLSearchParams();

  if (params?.page !== undefined) {
    searchParams.set('page', String(params.page));
  }

  if (params?.per_page !== undefined) {
    searchParams.set('per_page', String(params.per_page));
  }

  const query = searchParams.toString();

  return apiClient<ApiResponse<SKU[]>>(`/skus${query ? `?${query}` : ''}`);
}

export function getSKUByBarcode(skuBarcode: string): Promise<ApiResponse<SKU>> {
  return apiClient<ApiResponse<SKU>>(`/skus/${skuBarcode}`);
}

export function createSKU(data: CreateSKURequest): Promise<ApiResponse<SKU>> {
  return apiClient<ApiResponse<SKU>>('/skus', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateSKU(
  skuBarcode: string,
  data: UpdateSKURequest,
): Promise<ApiResponse<SKU>> {
  return apiClient<ApiResponse<SKU>>(`/skus/${skuBarcode}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteSKU(skuBarcode: string): Promise<ApiResponse<SKU>> {
  return apiClient<ApiResponse<SKU>>(`/skus/${skuBarcode}`, {
    method: 'DELETE',
  });
}
