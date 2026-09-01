import { ApiResponse } from '@/types/api';
import { Brand, CreateBrandRequest, UpdateBrandRequest } from '@/types/brand';
import { apiClient } from './client';

export function getBrands(): Promise<ApiResponse<Brand[]>> {
  return apiClient<ApiResponse<Brand[]>>('/brands');
}

export function getBrandById(brandId: string): Promise<ApiResponse<Brand>> {
  return apiClient<ApiResponse<Brand>>(`/brands/${brandId}`);
}

export function createBrand(
  data: CreateBrandRequest,
): Promise<ApiResponse<Brand>> {
  return apiClient<ApiResponse<Brand>>('/brands', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateBrand(
  brandId: string,
  data: UpdateBrandRequest,
): Promise<ApiResponse<Brand>> {
  return apiClient<ApiResponse<Brand>>(`/brands/${brandId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteBrand(brandId: string): Promise<ApiResponse<Brand>> {
  return apiClient<ApiResponse<Brand>>(`/brands/${brandId}`, {
    method: 'DELETE',
  });
}
