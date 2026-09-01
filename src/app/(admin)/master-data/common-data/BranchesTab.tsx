'use client';

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Input, Popconfirm, Table } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';

import { useBranches } from '@/queries/branch';
import type { GetBranchesParams } from '@/lib/api/branch';
import type { Branch } from '@/types/branch';

export default function BranchesTab() {
  const [params, setParams] = useState<GetBranchesParams>({
    page: 1,
    per_page: 10,
  });

  const { data, isLoading, isError } = useBranches(params);

  const columns: TableProps<Branch>['columns'] = [
    {
      title: 'Mã chi nhánh',
      dataIndex: 'branch_id',
      key: 'branch_id',
      width: 160,
    },
    {
      title: 'Tên chi nhánh',
      dataIndex: 'branch_name',
      key: 'branch_name',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <div className='flex items-center justify-center gap-1'>
          <Button
            type='text'
            icon={<EditOutlined />}
            onClick={() => {
              console.log('Edit branch:', record);
            }}
          />

          <Popconfirm
            title='Xóa chi nhánh'
            description={`Bạn có chắc muốn xóa "${record.branch_name}"?`}
            okText='Xóa'
            cancelText='Hủy'
            okButtonProps={{ danger: true }}
            onConfirm={() => {
              console.log('Delete branch:', record.branch_id);
            }}
          >
            <Button type='text' danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleTableChange: TableProps<Branch>['onChange'] = (pagination) => {
    setParams((prev) => ({
      ...prev,
      page: pagination.current ?? 1,
      per_page: pagination.pageSize ?? 10,
    }));
  };

  return (
    <div>
      <div className='mb-5 flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Chi nhánh</h1>

        <div className='flex items-center gap-2'>
          <Input
            placeholder='Tìm kiếm'
            prefix={<SearchOutlined className='text-gray-400' />}
            allowClear
            className='w-64'
          />

          <Button type='primary' icon={<PlusOutlined />}>
            Thêm chi nhánh
          </Button>
        </div>
      </div>

      {isError ? (
        <div className='py-10 text-center text-sm text-red-500'>
          Không thể tải danh sách chi nhánh.
        </div>
      ) : (
        <Table<Branch>
          rowKey='branch_id'
          columns={columns}
          dataSource={data?.data ?? []}
          loading={isLoading}
          pagination={{
            current: data?.pagination?.page ?? params.page,
            pageSize: data?.pagination?.per_page ?? params.per_page,
            total: data?.pagination?.total ?? 0,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} chi nhánh`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 700 }}
        />
      )}
    </div>
  );
}
