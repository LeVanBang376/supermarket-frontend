export const PAYMENT_METHOD = {
  CASH: 'CASH',
  QR: 'QR',
  CARD: 'CARD',
} as const;

export type PaymentMethod =
  (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export interface CreatePaymentRequest {
  method: PaymentMethod;
  amount: number;
  transaction_ref?: string;
}

export interface PaymentResponse {
  payment_id: string;
  order_id: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  transaction_ref?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}
