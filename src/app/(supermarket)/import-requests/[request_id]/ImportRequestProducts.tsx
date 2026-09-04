'use client';

import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { FormListFieldData, TableProps } from 'antd';

import type { ImportRequestStatus } from '@/types/import-request';
import type { ImportRequestProduct } from '@/types/import-request-product';

import SKUSelect from '@/components/sku-select/SkuSelect';
import { useAuthStore } from '@/stores/auth-store';

interface ImportRequestProductsProps {
  requestId: string;
  requestStatus: ImportRequestStatus;
  originalProducts: ImportRequestProduct[];
  activeToteBarcode: string | null;
}

interface ProductFormItem extends ImportRequestProduct {
  is_new?: boolean;
  is_modified?: boolean;
}

function getProductPermissions(status: ImportRequestStatus) {
  switch (status) {
    case 'DRAFT':
      return {
        canAdd: true,
        canDelete: true,
        canEditQuantity: true,
        canEditLoadedQuantity: false,
        canEditReceivedQuantity: false,
      };

    case 'REQUIRED':
      return {
        canAdd: false,
        canDelete: false,
        canEditQuantity: false,
        canEditLoadedQuantity: false,
        canEditReceivedQuantity: false,
      };

    case 'SUPPLIER_RECEIVED':
      return {
        canAdd: false,
        canDelete: false,
        canEditQuantity: false,
        canEditLoadedQuantity: true,
        canEditReceivedQuantity: false,
      };

    case 'DELIVERING':
      return {
        canAdd: false,
        canDelete: false,
        canEditQuantity: false,
        canEditLoadedQuantity: false,
        canEditReceivedQuantity: true,
      };

    case 'REJECTED':
    case 'COMPLETED':
    case 'CANCELLED':
    default:
      return {
        canAdd: false,
        canDelete: false,
        canEditQuantity: false,
        canEditLoadedQuantity: false,
        canEditReceivedQuantity: false,
      };
  }
}

export default function ImportRequestProducts({
  requestId,
  requestStatus,
  originalProducts,
  activeToteBarcode,
}: ImportRequestProductsProps) {
  const role = useAuthStore((state) => state.user?.role);
  const form = Form.useFormInstance<{
    products: ProductFormItem[];
  }>();

  const permissions = getProductPermissions(requestStatus);

  const markProductAsModified = (index: number) => {
    form.setFieldValue(['products', index, 'is_modified'], true);
  };

  return (
    <Card
      title='Hàng hóa'
      extra={
        permissions.canAdd ? (
          <Button
            type='dashed'
            icon={<PlusOutlined />}
            onClick={() => {
              const products = form.getFieldValue('products') ?? [];

              form.setFieldsValue({
                products: [
                  ...products,
                  {
                    sku_barcode: '',
                    sku_name: '',
                    quantity: 1,
                    loaded_quantity: 0,
                    received_quantity: 0,
                    tote_barcode: undefined,
                    is_new: true,
                    is_modified: false,
                  },
                ],
              });
            }}
          >
            Thêm sản phẩm
          </Button>
        ) : (
          <span className='text-sm text-gray-500'>
            {originalProducts.length} sản phẩm
          </span>
        )
      }
    >
      <Form.List name='products'>
        {(fields, { remove }) => {
          const columns: TableProps<FormListFieldData>['columns'] = [
            {
              title: 'SKU',
              dataIndex: 'sku_barcode',
              key: 'sku_barcode',
              width: 180,

              render: (_, field) => (
                <>
                  {/*
                   * Hidden Form.Item is important.
                   * It registers sku_barcode into AntD Form,
                   * even when the product is displayed as text.
                   */}
                  <Form.Item name={[field.name, 'sku_barcode']} hidden>
                    <Input />
                  </Form.Item>

                  <Form.Item name={[field.name, 'is_modified']} hidden>
                    <Input />
                  </Form.Item>

                  <Form.Item name={[field.name, 'is_new']} hidden>
                    <Input />
                  </Form.Item>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.products?.[field.name]?.sku_barcode !==
                      currentValues.products?.[field.name]?.sku_barcode
                    }
                  >
                    {({ getFieldValue }) => {
                      const skuBarcode = getFieldValue([
                        'products',
                        field.name,
                        'sku_barcode',
                      ]);

                      if (skuBarcode) {
                        return <span className='font-mono'>{skuBarcode}</span>;
                      }

                      return (
                        <Form.Item
                          name={[field.name, 'sku_barcode']}
                          rules={[
                            {
                              required: true,
                              message: 'Vui lòng chọn SKU',
                            },
                          ]}
                          className='mb-0'
                        >
                          <SKUSelect
                            placeholder='Chọn SKU'
                            onChange={(value, sku) => {
                              form.setFields([
                                {
                                  name: ['products', field.name, 'sku_barcode'],
                                  value,
                                },
                                {
                                  name: ['products', field.name, 'sku_name'],
                                  value: sku?.sku_name,
                                },
                                {
                                  name: ['products', field.name, 'is_modified'],
                                  value: true,
                                },
                              ]);
                            }}
                          />
                        </Form.Item>
                      );
                    }}
                  </Form.Item>
                </>
              ),
            },

            {
              title: 'Tên hàng',
              dataIndex: 'sku_name',
              key: 'sku_name',
              width: 280,

              render: (_, field) => (
                <>
                  <Form.Item name={[field.name, 'sku_name']} hidden>
                    <Input />
                  </Form.Item>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.products?.[field.name]?.sku_name !==
                      currentValues.products?.[field.name]?.sku_name
                    }
                  >
                    {({ getFieldValue }) => {
                      const skuName = getFieldValue([
                        'products',
                        field.name,
                        'sku_name',
                      ]);

                      return <span>{skuName || '-'}</span>;
                    }}
                  </Form.Item>
                </>
              ),
            },

            {
              title: 'Số lượng yêu cầu',
              dataIndex: 'quantity',
              key: 'quantity',
              width: 170,
              align: 'right',

              render: (_, field) => (
                <Form.Item
                  name={[field.name, 'quantity']}
                  rules={[
                    {
                      required: true,
                      message: 'Nhập số lượng',
                    },
                    {
                      type: 'number',
                      min: 1,
                      message: 'Số lượng phải lớn hơn 0',
                    },
                  ]}
                  className='mb-0'
                >
                  <InputNumber
                    min={1}
                    className='w-full'
                    disabled={!permissions.canEditQuantity}
                    onChange={() => markProductAsModified(field.name)}
                  />
                </Form.Item>
              ),
            },

            {
              title: 'Đã xếp',
              dataIndex: 'loaded_quantity',
              key: 'loaded_quantity',
              width: 130,
              align: 'right',

              render: (_, field) => (
                <Form.Item
                  name={[field.name, 'loaded_quantity']}
                  className='mb-0'
                >
                  <InputNumber
                    min={0}
                    className='w-full'
                    disabled={!permissions.canEditLoadedQuantity}
                    onChange={() => markProductAsModified(field.name)}
                  />
                </Form.Item>
              ),
            },

            {
              title: 'Đã nhận',
              dataIndex: 'received_quantity',
              key: 'received_quantity',
              width: 130,
              align: 'right',

              render: (_, field) => (
                <Form.Item
                  name={[field.name, 'received_quantity']}
                  className='mb-0'
                >
                  <InputNumber
                    min={0}
                    className='w-full'
                    disabled={
                      !permissions.canEditReceivedQuantity ||
                      !['ADMIN', 'MANAGER', 'EMPLOYEE'].includes(
                        role?.role_id || '',
                      )
                    }
                    onChange={() => markProductAsModified(field.name)}
                  />
                </Form.Item>
              ),
            },

            {
              title: 'Tote',
              dataIndex: 'tote_barcode',
              key: 'tote_barcode',
              width: 220,

              render: (_, field) => (
                <>
                  {/* Register tote_barcode vào Form */}
                  <Form.Item name={[field.name, 'tote_barcode']} hidden>
                    <Input />
                  </Form.Item>

                  {/* Hiển thị Tote + nút tự điền */}
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.products?.[field.name]?.tote_barcode !==
                      currentValues.products?.[field.name]?.tote_barcode
                    }
                  >
                    {({ getFieldValue }) => {
                      const toteBarcode = getFieldValue([
                        'products',
                        field.name,
                        'tote_barcode',
                      ]);

                      return (
                        <div className='flex items-center gap-2'>
                          <span className='font-mono'>
                            {toteBarcode || '-'}
                          </span>

                          {activeToteBarcode && (
                            <Button
                              type='link'
                              size='small'
                              onClick={() => {
                                form.setFields([
                                  {
                                    name: [
                                      'products',
                                      field.name,
                                      'tote_barcode',
                                    ],
                                    value: activeToteBarcode,
                                  },
                                  {
                                    name: [
                                      'products',
                                      field.name,
                                      'is_modified',
                                    ],
                                    value: true,
                                  },
                                ]);
                              }}
                            >
                              Tự điền
                            </Button>
                          )}
                        </div>
                      );
                    }}
                  </Form.Item>
                </>
              ),
            },

            ...(permissions.canDelete
              ? [
                  {
                    title: '',
                    key: 'action',
                    width: 60,
                    align: 'center' as const,

                    render: (_value: unknown, field: FormListFieldData) => (
                      <Popconfirm
                        title='Xóa sản phẩm?'
                        description='Sản phẩm này sẽ được xóa khi bạn nhấn Lưu.'
                        okText='Xóa'
                        cancelText='Hủy'
                        onConfirm={() => remove(field.name)}
                      >
                        <Button type='text' danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    ),
                  },
                ]
              : []),
          ];

          return (
            <Table<FormListFieldData>
              rowKey={(field) => `${requestId}-${field.key}`}
              columns={columns}
              dataSource={fields}
              pagination={false}
              size='small'
              scroll={{ x: 1100 }}
            />
          );
        }}
      </Form.List>

      {!permissions.canAdd && (
        <div className='mt-3 text-xs text-gray-500'>
          Sản phẩm không thể thêm hoặc xóa ở trạng thái hiện tại.
        </div>
      )}
    </Card>
  );
}
