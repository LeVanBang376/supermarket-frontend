import type { ApiResponse } from '@/types/api';
import type {
  CreateImportRequestRequest,
  ImportRequest,
  ImportRequestStatus,
  UpdateImportRequestRequest,
  UpdateImportRequestStatusRequest,
} from '@/types/import-request';
import { apiClient } from './client';

export interface GetImportRequestsParams {
  page?: number;
  per_page?: number;
  status?: ImportRequestStatus;
}

export function getImportRequests(
  params?: GetImportRequestsParams,
): Promise<ApiResponse<ImportRequest[]>> {
  const searchParams = new URLSearchParams();

  if (params?.page !== undefined) {
    searchParams.set('page', String(params.page));
  }

  if (params?.per_page !== undefined) {
    searchParams.set('per_page', String(params.per_page));
  }

  const query = searchParams.toString();

  return apiClient<ApiResponse<ImportRequest[]>>(
    `/import-requests${query ? `?${query}` : ''}`,
  );
}

export function getImportRequestById(
  requestId: string,
): Promise<ApiResponse<ImportRequest>> {
  return apiClient<ApiResponse<ImportRequest>>(`/import-requests/${requestId}`);
}

export function createImportRequest(
  data: CreateImportRequestRequest,
): Promise<ApiResponse<ImportRequest>> {
  return apiClient<ApiResponse<ImportRequest>>('/import-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateImportRequest(
  requestId: string,
  data: UpdateImportRequestRequest,
): Promise<ApiResponse<ImportRequest>> {
  return apiClient<ApiResponse<ImportRequest>>(
    `/import-requests/${requestId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}

export function updateImportRequestStatus(
  requestId: string,
  data: UpdateImportRequestStatusRequest,
): Promise<ApiResponse<ImportRequest>> {
  return apiClient<ApiResponse<ImportRequest>>(
    `/import-requests/${requestId}/status`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}

export function confirmImportRequest(
  requestId: string,
): Promise<ApiResponse<ImportRequest>> {
  return apiClient<ApiResponse<ImportRequest>>(
    `/import-requests/${requestId}/confirm`,
    {
      method: 'POST',
    },
  );
}
