import type { ApiResponse } from '@/types/api';
import type {
  AddOrderItemRequest,
  OrderItemResponse,
  UpdateOrderItemRequest,
} from '@/types/order-item';
import { apiClient } from './client';

export function getOrderItems(
  orderId: string,
): Promise<ApiResponse<OrderItemResponse[]>> {
  return apiClient<ApiResponse<OrderItemResponse[]>>(
    `/orders/${orderId}/items`,
  );
}

export function getOrderItemById(
  orderId: string,
  skuBarcode: string,
): Promise<ApiResponse<OrderItemResponse>> {
  return apiClient<ApiResponse<OrderItemResponse>>(
    `/orders/${orderId}/items/${skuBarcode}`,
  );
}

export function addOrderItem(
  orderId: string,
  data: AddOrderItemRequest,
): Promise<ApiResponse<OrderItemResponse>> {
  return apiClient<ApiResponse<OrderItemResponse>>(`/orders/${orderId}/items`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateOrderItem(
  orderId: string,
  skuBarcode: string,
  data: UpdateOrderItemRequest,
): Promise<ApiResponse<OrderItemResponse>> {
  return apiClient<ApiResponse<OrderItemResponse>>(
    `/orders/${orderId}/items/${skuBarcode}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}

export function deleteOrderItem(
  orderId: string,
  skuBarcode: string,
): Promise<ApiResponse<null>> {
  return apiClient<ApiResponse<null>>(
    `/orders/${orderId}/items/${skuBarcode}`,
    {
      method: 'DELETE',
    },
  );
}
