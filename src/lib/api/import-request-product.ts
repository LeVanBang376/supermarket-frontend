import type { ApiResponse } from '@/types/api';
import type { ImportRequestProduct } from '@/types/import-request-product';
import { apiClient } from './client';

export function getImportRequestProducts(
  requestId: string,
): Promise<ApiResponse<ImportRequestProduct[]>> {
  return apiClient<ApiResponse<ImportRequestProduct[]>>(
    `/import-requests/${requestId}/products`,
  );
}

export function getImportRequestToteProducts(
  requestId: string,
  toteBarcode: string,
): Promise<ApiResponse<ImportRequestProduct[]>> {
  return apiClient<ApiResponse<ImportRequestProduct[]>>(
    `/import-requests/${requestId}/totes/${toteBarcode}/products`,
  );
}
