import { ApiResponse } from '@/types/api';
import {
  Branch,
  CreateBranchRequest,
  UpdateBranchRequest,
} from '@/types/branch';
import { apiClient } from './client';

export interface GetBranchesParams {
  page?: number;
  per_page?: number;
}

export function getBranches(
  params?: GetBranchesParams,
): Promise<ApiResponse<Branch[]>> {
  const searchParams = new URLSearchParams();

  if (params?.page !== undefined) {
    searchParams.set('page', String(params.page));
  }

  if (params?.per_page !== undefined) {
    searchParams.set('per_page', String(params.per_page));
  }

  const query = searchParams.toString();

  return apiClient<ApiResponse<Branch[]>>(
    `/branches${query ? `?${query}` : ''}`,
  );
}

export function getBranchById(branchId: string): Promise<ApiResponse<Branch>> {
  return apiClient<ApiResponse<Branch>>(`/branches/${branchId}`);
}

export function createBranch(
  data: CreateBranchRequest,
): Promise<ApiResponse<Branch>> {
  return apiClient<ApiResponse<Branch>>('/branches', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateBranch(
  branchId: string,
  data: UpdateBranchRequest,
): Promise<ApiResponse<Branch>> {
  return apiClient<ApiResponse<Branch>>(`/branches/${branchId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteBranch(branchId: string): Promise<ApiResponse<Branch>> {
  return apiClient<ApiResponse<Branch>>(`/branches/${branchId}`, {
    method: 'DELETE',
  });
}
