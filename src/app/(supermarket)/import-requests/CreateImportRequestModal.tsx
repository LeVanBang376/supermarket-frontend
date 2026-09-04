'use client';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
} from 'antd';
import type { Dayjs } from 'dayjs';

import { useBranches } from '@/queries/branch';
import { useSKUs } from '@/queries/sku';
import { useCreateImportRequest } from '@/queries/import-request';

export interface CreateImportRequestFormValues {
  branch_id: string;
  expected_delivery_at: Dayjs;
  products: {
    sku_barcode: string;
    quantity: number;
  }[];
}

interface CreateImportRequestModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateImportRequestModal({
  open,
  onClose,
}: CreateImportRequestModalProps) {
  const [form] = Form.useForm<CreateImportRequestFormValues>();

  const createMutation = useCreateImportRequest();

  const { data: branchesData, isLoading: isBranchesLoading } = useBranches({
    page: 1,
    per_page: 100,
  });

  const { data: skusData, isLoading: isSKUsLoading } = useSKUs({
    page: 1,
    per_page: 100,
  });

  const handleClose = () => {
    if (createMutation.isPending) {
      return;
    }

    form.resetFields();
    onClose();
  };

  const handleSubmit = async (values: CreateImportRequestFormValues) => {
    try {
      await createMutation.mutateAsync({
        branch_id: values.branch_id,
        expected_delivery_at: values.expected_delivery_at.toISOString(),
        products: values.products,
      });

      message.success('Thêm yêu cầu nhập hàng thành công');

      form.resetFields();
      onClose();
    } catch {
      message.error('Thêm yêu cầu nhập hàng thất bại');
    }
  };

  return (
    <Modal
      title='Thêm yêu cầu nhập hàng'
      open={open}
      onCancel={handleClose}
      okText='Thêm'
      cancelText='Hủy'
      confirmLoading={createMutation.isPending}
      onOk={() => form.submit()}
      width={700}
      destroyOnHidden
    >
      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Form.Item
          label='Chi nhánh'
          name='branch_id'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn chi nhánh',
            },
          ]}
        >
          <Select
            placeholder='Chọn chi nhánh'
            loading={isBranchesLoading}
            showSearch
            optionFilterProp='label'
            options={
              branchesData?.data.map((branch) => ({
                label: branch.branch_name,
                value: branch.branch_id,
              })) ?? []
            }
          />
        </Form.Item>

        <Form.Item
          label='Ngày giao dự kiến'
          name='expected_delivery_at'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn ngày giao dự kiến',
            },
          ]}
        >
          <DatePicker className='w-full' showTime format='DD/MM/YYYY HH:mm' />
        </Form.Item>

        <Form.List
          name='products'
          rules={[
            {
              validator: async (_, products) => {
                if (!products || products.length < 1) {
                  return Promise.reject(
                    new Error('Vui lòng thêm ít nhất một sản phẩm'),
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }) => (
            <div>
              <div className='mb-3 flex items-center justify-between'>
                <span className='font-medium'>Sản phẩm</span>

                <Button
                  type='dashed'
                  icon={<PlusOutlined />}
                  onClick={() =>
                    add({
                      quantity: 1,
                    })
                  }
                >
                  Thêm sản phẩm
                </Button>
              </div>

              <div className='space-y-3'>
                {fields.map((field) => (
                  <Space key={field.key} align='start' className='flex'>
                    <Form.Item
                      label={field.name === 0 ? 'SKU' : undefined}
                      name={[field.name, 'sku_barcode']}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng chọn SKU',
                        },
                      ]}
                      className='mb-0 flex-1'
                    >
                      <Select
                        placeholder='Chọn SKU'
                        loading={isSKUsLoading}
                        showSearch
                        optionFilterProp='label'
                        options={
                          skusData?.data.map((sku) => ({
                            label: `${sku.sku_barcode} - ${sku.sku_name}`,
                            value: sku.sku_barcode,
                          })) ?? []
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      label={field.name === 0 ? 'Số lượng' : undefined}
                      name={[field.name, 'quantity']}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập số lượng',
                        },
                        {
                          type: 'number',
                          min: 1,
                          message: 'Số lượng phải lớn hơn 0',
                        },
                      ]}
                      className='mb-0 w-32'
                    >
                      <InputNumber min={1} precision={0} className='w-full' />
                    </Form.Item>

                    <Button
                      type='text'
                      danger
                      icon={<DeleteOutlined />}
                      disabled={fields.length === 1}
                      onClick={() => remove(field.name)}
                      className={field.name === 0 ? 'mt-[30px]' : ''}
                    />
                  </Space>
                ))}
              </div>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
