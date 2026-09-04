import type { ApiResponse } from '@/types/api';
import type { ImportRequestTote } from '@/types/import-request-tote';
import { apiClient } from './client';

export function createImportRequestTote(
  requestId: string,
  toteBarcode: string,
): Promise<ApiResponse<ImportRequestTote>> {
  return apiClient<ApiResponse<ImportRequestTote>>(
    `/import-requests/${requestId}/totes/${toteBarcode}`,
    {
      method: 'POST',
    },
  );
}

export function getImportRequestTotes(
  requestId: string,
): Promise<ApiResponse<ImportRequestTote[]>> {
  return apiClient<ApiResponse<ImportRequestTote[]>>(
    `/import-requests/${requestId}/totes`,
  );
}

export function getImportRequestTote(
  requestId: string,
  toteBarcode: string,
): Promise<ApiResponse<ImportRequestTote>> {
  return apiClient<ApiResponse<ImportRequestTote>>(
    `/import-requests/${requestId}/totes/${toteBarcode}`,
  );
}

export function deleteImportRequestTote(
  requestId: string,
  toteBarcode: string,
): Promise<ApiResponse<ImportRequestTote>> {
  return apiClient<ApiResponse<ImportRequestTote>>(
    `/import-requests/${requestId}/totes/${toteBarcode}`,
    {
      method: 'DELETE',
    },
  );
}
