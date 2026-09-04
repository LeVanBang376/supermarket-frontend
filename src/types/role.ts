export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'HR' | 'SUPPLIER';

export type Role = {
  role_id: UserRole;
  role_name: string;
  created_at: string;
  updated_at: string;
};
