import type { Branch } from './branch';
import type { User } from './user';
import type {
  CreateImportRequestProductRequest,
  UpdateImportRequestProductRequest,
} from './import-request-product';

export type ImportRequestStatus =
  | 'DRAFT'
  | 'CANCELLED'
  | 'REQUIRED'
  | 'SUPPLIER_RECEIVED'
  | 'DELIVERING'
  | 'REJECTED'
  | 'COMPLETED';

export interface ImportRequest {
  request_id: string;
  branch: Branch;
  created_by: string;
  creator: User;
  expected_delivery_at: string;
  delivery_license_plate: string;
  status: ImportRequestStatus;
  received_by?: string;
  receiver?: User;
  complete_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateImportRequestRequest {
  branch_id: string;
  expected_delivery_at: string;
  products: CreateImportRequestProductRequest[];
}

export interface UpdateImportRequestRequest {
  branch_id?: string;
  expected_delivery_at?: string;
  delivery_license_plate?: string;
  received_by?: string;
  products?: UpdateImportRequestProductRequest[];
  products_to_delete?: string[];
}

export interface UpdateImportRequestStatusRequest {
  status: ImportRequestStatus;
}
