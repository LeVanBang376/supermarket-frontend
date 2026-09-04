'use client';

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Table,
} from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';

import { useBrands } from '@/queries/brand';
import { useCreateSKU, useSKUs } from '@/queries/sku';
import { useUnits } from '@/queries/unit';

import type { GetSKUsParams } from '@/lib/api/sku';
import type { CreateSKURequest, SKU } from '@/types/sku';

export default function SKUsTab() {
  const [params, setParams] = useState<GetSKUsParams>({
    page: 1,
    per_page: 10,
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [form] = Form.useForm<CreateSKURequest>();

  const { data: brandsData, isLoading: isBrandsLoading } = useBrands();

  const { data: unitsData, isLoading: isUnitsLoading } = useUnits();

  const { data, isLoading, isError } = useSKUs(params);

  const createSKUMutation = useCreateSKU();

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    if (createSKUMutation.isPending) {
      return;
    }

    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const handleCreateSKU = async (values: CreateSKURequest) => {
    try {
      await createSKUMutation.mutateAsync(values);

      message.success('Thêm SKU thành công');

      setIsCreateModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error('Không thể thêm SKU');
    }
  };

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

          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={handleOpenCreateModal}
          >
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
          size='small'
        />
      )}

      <Modal
        title='Thêm SKU'
        open={isCreateModalOpen}
        onCancel={handleCloseCreateModal}
        okText='Thêm'
        cancelText='Hủy'
        confirmLoading={createSKUMutation.isPending}
        onOk={() => form.submit()}
        destroyOnHidden
      >
        <Form form={form} layout='vertical' onFinish={handleCreateSKU}>
          <Form.Item
            label='Mã SKU'
            name='sku_barcode'
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mã SKU',
              },
              {
                max: 30,
                message: 'Mã SKU không được vượt quá 30 ký tự',
              },
            ]}
          >
            <Input placeholder='Nhập mã SKU' maxLength={30} />
          </Form.Item>

          <Form.Item
            label='Tên sản phẩm'
            name='sku_name'
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên sản phẩm',
              },
              {
                max: 50,
                message: 'Tên sản phẩm không được vượt quá 50 ký tự',
              },
            ]}
          >
            <Input placeholder='Nhập tên sản phẩm' maxLength={50} />
          </Form.Item>

          <Form.Item
            label='Thương hiệu'
            name='brand_id'
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn thương hiệu',
              },
            ]}
          >
            <Select
              placeholder='Chọn thương hiệu'
              loading={isBrandsLoading}
              showSearch
              optionFilterProp='label'
              options={
                brandsData?.data.map((brand) => ({
                  label: brand.brand_name,
                  value: brand.brand_id,
                })) ?? []
              }
            />
          </Form.Item>

          <Form.Item
            label='Đơn vị tính'
            name='unit_id'
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn đơn vị tính',
              },
            ]}
          >
            <Select
              placeholder='Chọn đơn vị tính'
              loading={isUnitsLoading}
              showSearch
              optionFilterProp='label'
              options={
                unitsData?.data.map((unit) => ({
                  label: unit.unit_name,
                  value: unit.unit_id,
                })) ?? []
              }
            />
          </Form.Item>

          <Form.Item
            label='Hạn sử dụng'
            name='shelf_life_days'
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập hạn sử dụng',
              },
              {
                type: 'number',
                min: 0,
                message: 'Hạn sử dụng phải lớn hơn hoặc bằng 0',
              },
            ]}
          >
            <InputNumber
              className='w-full'
              placeholder='Nhập số ngày'
              min={0}
              precision={0}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
