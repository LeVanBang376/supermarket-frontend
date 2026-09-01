export interface Brand {
  brand_id: string;
  brand_name: string;
}

export interface CreateBrandRequest {
  brand_name: string;
}

export interface UpdateBrandRequest {
  brand_name?: string;
}
