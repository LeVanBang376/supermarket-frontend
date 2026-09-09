'use client';

import {
  CloseOutlined,
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';

import type { OrderItemResponse } from '@/types/order-item';

interface PosOrderProps {
  orderItems: OrderItemResponse[];
  onIncrease: (skuBarcode: string) => void;
  onDecrease: (skuBarcode: string) => void;
  onRemove: (skuBarcode: string) => void;
  onClear: () => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value);

export default function PosOrder({
  orderItems,
  onIncrease,
  onDecrease,
  onRemove,
  onClear,
}: PosOrderProps) {
  const totalQuantity = orderItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <section className='flex min-h-0 flex-1 flex-col'>
      <div className='flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5'>
        <div className='flex items-center gap-2'>
          <ShoppingCartOutlined className='text-gray-500' />
          <span className='text-sm font-semibold text-gray-900'>Hàng hóa</span>
          <span className='text-xs text-gray-400'>({totalQuantity})</span>
        </div>
        <Button
          type='text'
          danger
          size='small'
          icon={<DeleteOutlined />}
          disabled={orderItems.length === 0}
          onClick={onClear}
        >
          Xóa tất cả
        </Button>
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto'>
        {orderItems.length === 0 ? (
          <div className='flex h-full flex-col items-center justify-center bg-gray-50 px-6 text-center'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-gray-300 shadow-sm'>
              <ShoppingCartOutlined />
            </div>

            <p className='mt-4 text-sm font-medium text-gray-700'>
              Chưa có hàng hóa
            </p>

            <p className='mt-1 text-xs text-gray-400'>
              Quét mã vạch hoặc tìm kiếm SKU để thêm hàng hóa vào hóa đơn
            </p>
          </div>
        ) : (
          <div className='divide-y divide-gray-200'>
            {orderItems.map((item) => (
              <div key={item.sku_barcode} className='bg-white px-5 py-4'>
                <div className='flex items-center gap-4'>
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400'>
                    <ShoppingCartOutlined />
                  </div>

                  <div className='min-w-0 flex-1'>
                    <div className='truncate text-sm font-medium text-gray-900'>
                      {item.sku_name}
                    </div>

                    <div className='mt-1 flex items-center gap-2 text-xs text-gray-400'>
                      <span className='font-mono'>{item.sku_barcode}</span>

                      <span>•</span>

                      <span>{item.unit_name}</span>
                    </div>
                  </div>

                  <div className='w-28 shrink-0 text-right'>
                    <div className='text-xs text-gray-400'>Đơn giá</div>

                    <div className='mt-1 text-sm font-medium text-gray-900'>
                      {item.unit_price > 0
                        ? `${formatCurrency(item.unit_price)} ₫`
                        : '—'}
                    </div>
                  </div>

                  <div className='flex shrink-0 items-center rounded-lg border border-gray-200'>
                    <button
                      type='button'
                      onClick={() => onDecrease(item.sku_barcode)}
                      className='flex h-9 w-9 cursor-pointer items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700'
                    >
                      <MinusOutlined className='text-xs' />
                    </button>

                    <span className='w-9 text-center text-sm font-medium text-gray-900'>
                      {item.quantity}
                    </span>

                    <button
                      type='button'
                      onClick={() => onIncrease(item.sku_barcode)}
                      className='flex h-9 w-9 cursor-pointer items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700'
                    >
                      <PlusOutlined className='text-xs' />
                    </button>
                  </div>

                  <div className='w-32 shrink-0 text-right'>
                    <div className='text-xs text-gray-400'>Thành tiền</div>

                    <div className='mt-1 text-sm font-semibold text-gray-900'>
                      {item.unit_price > 0
                        ? `${formatCurrency(item.unit_price * item.quantity)} ₫`
                        : '—'}
                    </div>
                  </div>

                  <button
                    type='button'
                    onClick={() => onRemove(item.sku_barcode)}
                    className='flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500'
                  >
                    <CloseOutlined className='text-xs' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
