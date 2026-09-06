import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';
import { apiClient } from './client';

export function login(data: { username: string; password: string }) {
  return apiClient<ApiResponse<User>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getMe(): Promise<ApiResponse<User>> {
  return apiClient<ApiResponse<User>>('/auth/me');
}

export function refresh() {
  return apiClient<ApiResponse<null>>('/auth/refresh', {
    method: 'POST',
  });
}

export function logout() {
  return apiClient<ApiResponse<null>>('/auth/logout', {
    method: 'POST',
  });
}
