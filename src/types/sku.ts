export interface SKU {
  sku_barcode: string;
  sku_name: string;
  brand_id: string;
  brand_name: string;
  unit_id: string;
  unit_name: string;
  unit_price: number;
  shelf_life_days: number;
}

export interface CreateSKURequest {
  sku_barcode: string;
  sku_name: string;
  brand_id: string;
  unit_id: string;
  shelf_life_days: number;
}

export interface UpdateSKURequest {
  sku_name?: string;
  brand_id?: string;
  unit_id?: string;
  shelf_life_days?: number;
}
