export interface ImportRequestProduct {
  sku_barcode: string;
  sku_name: string;
  quantity: number;
  tote_barcode?: string;
  loaded_quantity: number;
  received_quantity: number;
}

export interface CreateImportRequestProductRequest {
  sku_barcode: string;
  quantity: number;
}

export interface UpdateImportRequestProductRequest {
  sku_barcode: string;
  quantity?: number;
  tote_barcode?: string;
  loaded_quantity?: number;
  received_quantity?: number;
}
