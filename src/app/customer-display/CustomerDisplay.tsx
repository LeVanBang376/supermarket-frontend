'use client';

import { ShoppingCartOutlined } from '@ant-design/icons';

import type { OrderResponse } from '@/types/order';
import type { OrderItemResponse } from '@/types/order-item';

interface CustomerDisplayProps {
  order?: OrderResponse;
  orderItems: OrderItemResponse[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value);

export default function CustomerDisplay({
  order,
  orderItems,
}: CustomerDisplayProps) {
  const totalAmount = order?.total_amount ?? 0;

  return (
    <main className='flex h-dvh flex-col bg-white'>
      {/* Header */}
      <header className='flex h-20 shrink-0 items-center border-b border-gray-200 px-8'>
        <div className='flex items-center gap-3'>
          <ShoppingCartOutlined className='text-2xl text-blue-600' />

          <div>
            <h1 className='text-xl font-semibold text-gray-900'>
              Hóa đơn của quý khách
            </h1>
          </div>
        </div>
      </header>

      {/* Products */}
      <section className='min-h-0 flex-1 overflow-y-auto'>
        {orderItems.length === 0 ? (
          <div className='flex h-full items-center justify-center'>
            <div className='text-center'>
              <ShoppingCartOutlined className='text-5xl text-gray-300' />

              <p className='mt-4 text-lg font-medium text-gray-500'>
                Chưa có sản phẩm
              </p>

              <p className='mt-1 text-sm text-gray-400'>
                Sản phẩm sẽ hiển thị tại đây
              </p>
            </div>
          </div>
        ) : (
          <div className='overflow-hidden'>
            <table className='w-full border-collapse'>
              <thead className='sticky top-0 bg-gray-50'>
                <tr className='border-b border-gray-200 text-left text-sm text-gray-500'>
                  <th className='px-8 py-4 font-medium'>Mã hàng</th>

                  <th className='px-4 py-4 font-medium'>Tên hàng hóa</th>

                  <th className='w-32 px-4 py-4 text-center font-medium'>
                    Đơn vị tính
                  </th>

                  <th className='w-40 px-4 py-4 text-right font-medium'>
                    Đơn giá
                  </th>

                  <th className='w-32 px-4 py-4 text-center font-medium'>
                    Số lượng
                  </th>

                  <th className='w-48 px-8 py-4 text-right font-medium'>
                    Thành tiền
                  </th>
                </tr>
              </thead>

              <tbody className='divide-y divide-gray-100'>
                {orderItems.map((item) => {
                  const subtotal = item.unit_price * item.quantity;

                  return (
                    <tr key={item.sku_barcode} className='text-gray-900'>
                      <td className='px-8 py-5 font-mono text-sm text-gray-500'>
                        {item.sku_barcode}
                      </td>

                      <td className='px-4 py-5'>
                        <div className='text-base font-medium'>
                          {item.sku_name}
                        </div>
                      </td>

                      <td className='w-32 px-4 py-5 text-center text-base text-gray-600'>
                        {item.unit_name}
                      </td>

                      <td className='w-40 px-4 py-5 text-right text-base font-medium'>
                        {formatCurrency(item.unit_price)} ₫
                      </td>

                      <td className='w-32 px-4 py-5 text-center text-base font-medium'>
                        {item.quantity}
                      </td>

                      <td className='w-48 px-8 py-5 text-right text-base font-semibold'>
                        {formatCurrency(subtotal)} ₫
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Total */}
      <footer className='shrink-0 border-t border-gray-200 bg-gray-50 px-8 py-6'>
        <div className='ml-auto flex max-w-md items-center justify-between'>
          <span className='text-xl font-medium text-gray-600'>Tổng tiền</span>

          <span className='text-3xl font-bold text-gray-900'>
            {formatCurrency(totalAmount)} ₫
          </span>
        </div>
      </footer>
    </main>
  );
}
