'use client';

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, message, Modal, Popconfirm, Table } from 'antd';
import type { TableProps } from 'antd';
import { useState } from 'react';

import { useBranches, useCreateBranch } from '@/queries/branch';
import type { GetBranchesParams } from '@/lib/api/branch';
import type { Branch, CreateBranchRequest } from '@/types/branch';

export default function BranchesTab() {
  const [params, setParams] = useState<GetBranchesParams>({
    page: 1,
    per_page: 10,
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [form] = Form.useForm<CreateBranchRequest>();

  const { data, isLoading, isError } = useBranches(params);

  const createBranchMutation = useCreateBranch();

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    if (createBranchMutation.isPending) {
      return;
    }

    setIsCreateModalOpen(false);
  };

  const handleCreateBranch = async (values: CreateBranchRequest) => {
    try {
      await createBranchMutation.mutateAsync(values);

      message.success('Thêm chi nhánh thành công');

      setIsCreateModalOpen(false);
    } catch {
      message.error('Không thể thêm chi nhánh');
    }
  };

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

          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={handleOpenCreateModal}
          >
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
          size='small'
        />
      )}

      <Modal
        title='Thêm chi nhánh'
        open={isCreateModalOpen}
        onCancel={handleCloseCreateModal}
        okText='Thêm'
        cancelText='Hủy'
        confirmLoading={createBranchMutation.isPending}
        onOk={() => {
          form.submit();
        }}
        destroyOnHidden
      >
        <Form form={form} layout='vertical' onFinish={handleCreateBranch}>
          <Form.Item
            label='Tên chi nhánh'
            name='branch_name'
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên chi nhánh',
              },
              {
                max: 100,
                message: 'Tên chi nhánh không được vượt quá 100 ký tự',
              },
            ]}
          >
            <Input placeholder='Nhập tên chi nhánh' maxLength={100} />
          </Form.Item>

          <Form.Item
            label='Địa chỉ'
            name='address'
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập địa chỉ',
              },
              {
                max: 255,
                message: 'Địa chỉ không được vượt quá 255 ký tự',
              },
            ]}
          >
            <Input.TextArea
              placeholder='Nhập địa chỉ chi nhánh'
              rows={3}
              maxLength={255}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
