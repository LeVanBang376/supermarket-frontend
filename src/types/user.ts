import { Branch } from './branch';
import { Position } from './position';
import { Role } from './role';

export type UserStatus = 'ACTIVE' | 'INACTIVE';

export type User = {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  phone_number: string;
  branch: Branch;
  role: Role;
  position: Position;
  status: UserStatus;
};
