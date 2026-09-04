import type { ImportRequestStatus } from '@/types/import-request';
import { UserRole } from '@/types/role';

export const importRequestStatusConfig: Record<
  ImportRequestStatus,
  { label: string; color: string }
> = {
  DRAFT: { label: 'Nháp', color: 'default' },
  CANCELLED: { label: 'Đã hủy', color: 'red' },
  REQUIRED: { label: 'Đã yêu cầu', color: 'blue' },
  SUPPLIER_RECEIVED: { label: 'NCC đã nhận', color: 'cyan' },
  DELIVERING: { label: 'Đang giao', color: 'orange' },
  REJECTED: { label: 'Từ chối', color: 'red' },
  COMPLETED: { label: 'Hoàn thành', color: 'green' },
};

const deliveryLicensePlateStatuses: ImportRequestStatus[] = [
  'DELIVERING',
  'REJECTED',
  'COMPLETED',
];

export const isDeliveryLicensePlateVisible = (
  status: ImportRequestStatus,
): boolean => {
  return deliveryLicensePlateStatuses.includes(status);
};

export const isReceivingInfoVisible = (
  status: ImportRequestStatus,
): boolean => {
  return status === 'COMPLETED';
};

export const canSubmitImportRequest = (
  role: UserRole,
  status: ImportRequestStatus,
) => {
  return (role == 'ADMIN' || role == 'MANAGER') && status == 'DRAFT';
};

export const canAcceptImportRequest = (
  role: UserRole,
  status: ImportRequestStatus,
) => {
  return role === 'SUPPLIER' && status == 'REQUIRED';
};

export const canStartDelivering = (
  role: UserRole,
  status: ImportRequestStatus,
) => {
  return role === 'SUPPLIER' && status == 'SUPPLIER_RECEIVED';
};

export const canCompleteImportRequest = (
  role: UserRole,
  status: ImportRequestStatus,
) => {
  return (
    (role == 'ADMIN' || role == 'MANAGER' || role == 'EMPLOYEE') &&
    status == 'DELIVERING'
  );
};

export const canSaveChanges = (role: UserRole, status: ImportRequestStatus) => {
  switch (role) {
    case 'ADMIN':
    case 'MANAGER':
      return status === 'DRAFT' || status === 'DELIVERING';

    case 'EMPLOYEE':
      return status === 'DELIVERING';

    case 'SUPPLIER':
      return status === 'SUPPLIER_RECEIVED';

    case 'HR':
      return false;

    default:
      return false;
  }
};
