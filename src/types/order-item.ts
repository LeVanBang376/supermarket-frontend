export interface AddOrderItemRequest {
  sku_barcode: string;
  quantity: number;
}

export interface UpdateOrderItemRequest {
  quantity?: number;
}

export interface OrderItemResponse {
  order_id: string;
  sku_barcode: string;
  sku_name: string;
  unit_id: string;
  unit_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  discount_amount: number;
  created_at: string;
  updated_at: string;
}
