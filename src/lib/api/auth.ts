import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';
import { apiClient } from './client';

export function getMe(): Promise<ApiResponse<User>> {
  return apiClient<ApiResponse<User>>('/auth/me');
}

export function login(data: { username: string; password: string }) {
  return apiClient<ApiResponse<User>>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
