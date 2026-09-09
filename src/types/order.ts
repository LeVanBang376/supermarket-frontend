import type { PaymentResponse } from './payment';

export const ORDER_STATUS = {
  OPEN: 'OPEN',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export interface CreateOrderRequest {
  branch_id: string;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
}

export interface OrderResponse {
  order_id: string;
  branch_id: string;
  cashier_id: string;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
  payments: PaymentResponse[];
}
