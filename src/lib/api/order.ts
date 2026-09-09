import type { ApiResponse } from '@/types/api';
import type {
  CreateOrderRequest,
  OrderResponse,
  OrderStatus,
} from '@/types/order';

import { apiClient } from './client';

export interface GetOrdersParams {
  branch_id?: string;
  status?: OrderStatus;
  page?: number;
  per_page?: number;
}

export function getOrders(
  params?: GetOrdersParams,
): Promise<ApiResponse<OrderResponse[]>> {
  const searchParams = new URLSearchParams();

  if (params?.branch_id !== undefined) {
    searchParams.set('branch_id', params.branch_id);
  }

  if (params?.status !== undefined) {
    searchParams.set('status', params.status);
  }

  if (params?.page !== undefined) {
    searchParams.set('page', String(params.page));
  }

  if (params?.per_page !== undefined) {
    searchParams.set('per_page', String(params.per_page));
  }

  const query = searchParams.toString();

  return apiClient<ApiResponse<OrderResponse[]>>(
    `/orders${query ? `?${query}` : ''}`,
  );
}

export function getOrderById(
  orderId: string,
): Promise<ApiResponse<OrderResponse>> {
  return apiClient<ApiResponse<OrderResponse>>(`/orders/${orderId}`);
}

export function createOrder(
  data: CreateOrderRequest,
): Promise<ApiResponse<OrderResponse>> {
  return apiClient<ApiResponse<OrderResponse>>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function cancelOrder(orderId: string): Promise<ApiResponse<null>> {
  return apiClient<ApiResponse<null>>(`/orders/${orderId}/cancel`, {
    method: 'PATCH',
  });
}
