import type { ApiResponse } from '@/types/api';
import type { CreatePaymentRequest, PaymentResponse } from '@/types/payment';
import { apiClient } from './client';

export function createPayment(
  orderId: string,
  data: CreatePaymentRequest,
): Promise<ApiResponse<PaymentResponse>> {
  return apiClient<ApiResponse<PaymentResponse>>(
    `/orders/${orderId}/payments`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}

export function getPaymentsByOrderId(
  orderId: string,
): Promise<ApiResponse<PaymentResponse[]>> {
  return apiClient<ApiResponse<PaymentResponse[]>>(
    `/orders/${orderId}/payments`,
  );
}

export function getPaymentById(
  paymentId: string,
): Promise<ApiResponse<PaymentResponse>> {
  return apiClient<ApiResponse<PaymentResponse>>(`/payments/${paymentId}`);
}
