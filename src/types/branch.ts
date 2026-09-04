export interface Branch {
  branch_id: string;
  branch_name: string;
  address: string;
}

export interface CreateBranchRequest {
  branch_name: string;
  address: string;
}

export interface UpdateBranchRequest {
  branch_name?: string;
  address?: string;
}
