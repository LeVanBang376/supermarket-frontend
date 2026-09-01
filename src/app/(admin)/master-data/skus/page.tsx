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

import { useSKUs } from '@/queries/sku';
import type { GetSKUsParams } from '@/lib/api/sku';
import type { SKU } from '@/types/sku';

export default function SKUsTab() {
  const [params, setParams] = useState<GetSKUsParams>({
    page: 1,
    per_page: 10,
  });

  const { data, isLoading, isError } = useSKUs(params);

  const columns: TableProps<SKU>['columns'] = [
    {
      title: 'Mã SKU',
      dataIndex: 'sku_barcode',
      key: 'sku_barcode',
      width: 180,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'sku_name',
      key: 'sku_name',
      width: 240,
    },
    {
      title: 'Hãng',
      dataIndex: 'brand_name',
      key: 'brand_name',
      width: 140,
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'unit_name',
      key: 'unit_name',
      width: 120,
    },
    {
      title: 'Hạn sử dụng',
      dataIndex: 'shelf_life_days',
      key: 'shelf_life_days',
      width: 140,
      render: (value: number) => `${value} ngày`,
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
              console.log('Edit SKU:', record);
            }}
          />

          <Popconfirm
            title='Xóa SKU'
            description={`Bạn có chắc muốn xóa "${record.sku_name}"?`}
            okText='Xóa'
            cancelText='Hủy'
            okButtonProps={{ danger: true }}
            onConfirm={() => {
              console.log('Delete SKU:', record.sku_barcode);
            }}
          >
            <Button type='text' danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleTableChange: TableProps<SKU>['onChange'] = (pagination) => {
    setParams((prev) => ({
      ...prev,
      page: pagination.current ?? 1,
      per_page: pagination.pageSize ?? 10,
    }));
  };

  return (
    <div>
      <div className='mb-5 flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>SKU</h1>

        <div className='flex items-center gap-2'>
          <Input
            placeholder='Tìm kiếm'
            prefix={<SearchOutlined className='text-gray-400' />}
            allowClear
            className='w-64'
          />

          <Button type='primary' icon={<PlusOutlined />}>
            Thêm SKU
          </Button>
        </div>
      </div>

      {isError ? (
        <div className='py-10 text-center text-sm text-red-500'>
          Không thể tải danh sách SKU.
        </div>
      ) : (
        <Table<SKU>
          rowKey='sku_barcode'
          columns={columns}
          dataSource={data?.data ?? []}
          loading={isLoading}
          pagination={{
            current: data?.pagination?.page ?? params.page,
            pageSize: data?.pagination?.per_page ?? params.per_page,
            total: data?.pagination?.total ?? 0,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} SKU`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 950 }}
        />
      )}
    </div>
  );
}
