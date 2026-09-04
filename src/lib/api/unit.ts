import { ApiResponse } from '@/types/api';
import { Unit, CreateUnitRequest, UpdateUnitRequest } from '@/types/unit';
import { apiClient } from './client';

export function getUnits(): Promise<ApiResponse<Unit[]>> {
  return apiClient<ApiResponse<Unit[]>>('/units');
}

export function getUnitById(unitId: string): Promise<ApiResponse<Unit>> {
  return apiClient<ApiResponse<Unit>>(`/units/${unitId}`);
}

export function createUnit(
  data: CreateUnitRequest,
): Promise<ApiResponse<Unit>> {
  return apiClient<ApiResponse<Unit>>('/units', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateUnit(
  unitId: string,
  data: UpdateUnitRequest,
): Promise<ApiResponse<Unit>> {
  return apiClient<ApiResponse<Unit>>(`/units/${unitId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteUnit(unitId: string): Promise<ApiResponse<Unit>> {
  return apiClient<ApiResponse<Unit>>(`/units/${unitId}`, {
    method: 'DELETE',
  });
}
