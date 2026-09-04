'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Table,
  message,
} from 'antd';
import type { TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

import type { ImportRequestTote } from '@/types/import-request-tote';

import {
  useCreateImportRequestTote,
  useDeleteImportRequestTote,
} from '@/queries/import-request-tote';
import { useAuthStore } from '@/stores/auth-store';
import { ImportRequest } from '@/types/import-request';

interface ImportRequestTotesProps {
  requestId: string;
  request: ImportRequest | undefined;
  totes: ImportRequestTote[];
  loadingToteBarcode: string | null;
  onLoadingToteChange: (toteBarcode: string | null) => void;
}

interface ToteFormValues {
  tote_barcode: string;
}

export default function ImportRequestTotes({
  requestId,
  request,
  totes,
  loadingToteBarcode,
  onLoadingToteChange,
}: ImportRequestTotesProps) {
  const role = useAuthStore((state) => state.user?.role);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm<ToteFormValues>();

  const createToteMutation = useCreateImportRequestTote();
  const deleteToteMutation = useDeleteImportRequestTote();

  const handleCreate = async (values: ToteFormValues) => {
    try {
      await createToteMutation.mutateAsync({
        requestId,
        toteBarcode: values.tote_barcode.trim(),
      });

      message.success('Tạo Tote thành công');

      form.resetFields();
      setIsCreateModalOpen(false);
    } catch {
      message.error('Tạo Tote thất bại');
    }
  };

  const handleDelete = async (toteBarcode: string) => {
    try {
      await deleteToteMutation.mutateAsync({
        requestId,
        toteBarcode,
      });

      message.success('Xóa Tote thành công');
    } catch {
      message.error('Xóa Tote thất bại');
    }
  };

  const columns: TableProps<ImportRequestTote>['columns'] = [
    {
      title: 'Mã Tote',
      dataIndex: 'tote_barcode',
      key: 'tote_barcode',
      width: 300,
      render: (value: string) => <span className='font-mono'>{value}</span>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 220,
      render: (_, record) => {
        const isLoading = loadingToteBarcode === record.tote_barcode;

        if (
          !(
            role?.role_id == 'SUPPLIER' &&
            request?.status == 'SUPPLIER_RECEIVED'
          )
        ) {
          return <></>;
        }

        return (
          <div className='flex gap-1'>
            <Button
              type={isLoading ? 'primary' : 'default'}
              onClick={() => {
                onLoadingToteChange(isLoading ? null : record.tote_barcode);
              }}
            >
              {isLoading ? 'Đang xếp hàng' : 'Xếp hàng'}
            </Button>

            <Button
              type='text'
              icon={<EditOutlined />}
              // TODO: xử lý edit Tote sau
            />

            <Popconfirm
              title='Xóa Tote?'
              description='Tote này sẽ bị xóa khỏi yêu cầu nhập hàng.'
              okText='Xóa'
              cancelText='Hủy'
              onConfirm={() => handleDelete(record.tote_barcode)}
              okButtonProps={{
                loading: deleteToteMutation.isPending,
              }}
            >
              <Button type='text' danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  if (!role) {
    return null;
  }

  return (
    <>
      <Card
        title='Tote'
        extra={
          role.role_id == 'SUPPLIER' &&
          request?.status == 'SUPPLIER_RECEIVED' ? (
            <Button
              type='dashed'
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Thêm Tote
            </Button>
          ) : null
        }
      >
        {totes.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description='Chưa có Tote'
          />
        ) : (
          <Table<ImportRequestTote>
            rowKey={(record) => `${requestId}-${record.tote_barcode}`}
            columns={columns}
            dataSource={totes}
            pagination={false}
            size='small'
          />
        )}
      </Card>

      <Modal
        title='Thêm Tote'
        open={isCreateModalOpen}
        centered
        onCancel={() => {
          form.resetFields();
          setIsCreateModalOpen(false);
        }}
        onOk={() => form.submit()}
        okText='Thêm'
        cancelText='Hủy'
        confirmLoading={createToteMutation.isPending}
      >
        <Form form={form} layout='vertical' onFinish={handleCreate}>
          <Form.Item
            label='Mã Tote'
            name='tote_barcode'
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mã Tote',
              },
            ]}
          >
            <Input placeholder='Nhập mã Tote' className='font-mono' autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
