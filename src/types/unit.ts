export interface Unit {
  unit_id: string;
  unit_name: string;
}

export interface CreateUnitRequest {
  unit_name: string;
}

export interface UpdateUnitRequest {
  unit_name?: string;
}
