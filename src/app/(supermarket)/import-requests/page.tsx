'use client';

import { useRouter } from 'next/navigation';
import { EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';

import type { GetImportRequestsParams } from '@/lib/api/import-request';
import { useImportRequests } from '@/queries/import-request';
import type {
  ImportRequest,
  ImportRequestStatus,
} from '@/types/import-request';
import CreateImportRequestModal from './CreateImportRequestModal';
import { useAuthStore } from '@/stores/auth-store';
import { Role, UserRole } from '@/types/role';

const statusConfig: Record<
  ImportRequestStatus,
  { label: string; color: string }
> = {
  DRAFT: {
    label: 'Nháp',
    color: 'default',
  },
  CANCELLED: {
    label: 'Đã hủy',
    color: 'red',
  },
  REQUIRED: {
    label: 'Đã yêu cầu',
    color: 'blue',
  },
  SUPPLIER_RECEIVED: {
    label: 'NCC đã nhận',
    color: 'cyan',
  },
  DELIVERING: {
    label: 'Đang giao',
    color: 'orange',
  },
  REJECTED: {
    label: 'Từ chối',
    color: 'red',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    color: 'green',
  },
};

const roleConfig: Record<
  UserRole,
  {
    allowedStatuses: ImportRequestStatus[];
    canCreate: boolean;
  }
> = {
  ADMIN: {
    allowedStatuses: [
      'DRAFT',
      'CANCELLED',
      'REQUIRED',
      'SUPPLIER_RECEIVED',
      'DELIVERING',
      'REJECTED',
      'COMPLETED',
    ],
    canCreate: true,
  },
  MANAGER: {
    allowedStatuses: [
      'DRAFT',
      'CANCELLED',
      'REQUIRED',
      'SUPPLIER_RECEIVED',
      'DELIVERING',
      'REJECTED',
      'COMPLETED',
    ],
    canCreate: true,
  },
  SUPPLIER: {
    allowedStatuses: [
      'REQUIRED',
      'SUPPLIER_RECEIVED',
      'DELIVERING',
      'REJECTED',
    ],
    canCreate: false,
  },
  EMPLOYEE: {
    allowedStatuses: ['DELIVERING'],
    canCreate: false,
  },
  HR: {
    allowedStatuses: [],
    canCreate: false,
  },
};

export default function ImportRequestsTab() {
  const router = useRouter();
  const role = useAuthStore((state) => state.user?.role);

  const [params, setParams] = useState<GetImportRequestsParams>({
    page: 1,
    per_page: 10,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data, isLoading, isError } = useImportRequests(params, !!role);

  if (!role) {
    return null;
  }

  const config = roleConfig[role.role_id];

  const columns: TableProps<ImportRequest>['columns'] = [
    {
      title: 'Mã phiếu',
      dataIndex: 'request_id',
      key: 'request_id',
      width: 120,
    },
    {
      title: 'Chi nhánh',
      key: 'branch',
      width: 180,
      render: (_, record) => (
        <div>
          <div className='font-medium'>{record.branch.branch_name}</div>
          <div className='text-xs text-gray-400'>{record.branch.branch_id}</div>
        </div>
      ),
    },
    {
      title: 'Người tạo',
      key: 'creator',
      width: 180,
      render: (_, record) => record.creator?.full_name ?? record.created_by,
    },
    {
      title: 'Ngày giao dự kiến',
      dataIndex: 'expected_delivery_at',
      key: 'expected_delivery_at',
      width: 180,
      render: (value: string) => new Date(value).toLocaleString('vi-VN'),
    },
    {
      title: 'Biển số xe',
      dataIndex: 'delivery_license_plate',
      key: 'delivery_license_plate',
      width: 140,
      render: (value: string) => value || '-',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: ImportRequestStatus) => {
        const config = statusConfig[status];

        return (
          <Tag color={config?.color ?? 'default'}>
            {config?.label ?? status}
          </Tag>
        );
      },
    },
    {
      title: 'Sản phẩm',
      key: 'products',
      width: 100,
      align: 'center',
      render: (_, record) => 0,
    },
    {
      title: 'Tote',
      key: 'totes',
      width: 80,
      align: 'center',
      render: (_, record) => 0,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Button
          type='text'
          icon={<EyeOutlined />}
          onClick={() => {
            router.push(`/import-requests/${record.request_id}`);
          }}
        />
      ),
    },
  ];

  const handleTableChange: TableProps<ImportRequest>['onChange'] = (
    pagination,
  ) => {
    setParams((prev) => ({
      ...prev,
      page: pagination.current ?? 1,
      per_page: pagination.pageSize ?? 10,
    }));
  };

  return (
    <div>
      <div className='mb-5 flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Yêu cầu nhập hàng</h1>

        <div className='flex items-center gap-2'>
          <Input
            placeholder='Tìm kiếm'
            prefix={<SearchOutlined className='text-gray-400' />}
            allowClear
            className='w-64'
          />

          {config?.canCreate && (
            <Button
              type='primary'
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Thêm yêu cầu
            </Button>
          )}
        </div>
      </div>

      {isError ? (
        <div className='py-10 text-center text-sm text-red-500'>
          Không thể tải danh sách yêu cầu nhập hàng.
        </div>
      ) : (
        <Table<ImportRequest>
          rowKey='request_id'
          columns={columns}
          dataSource={data?.data ?? []}
          loading={isLoading}
          size='small'
          pagination={{
            current: data?.pagination?.page ?? params.page,
            pageSize: data?.pagination?.per_page ?? params.per_page,
            total: data?.pagination?.total ?? 0,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} yêu cầu`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1250 }}
        />
      )}

      <CreateImportRequestModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
