'use client';

import {
  BankOutlined,
  CreditCardOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';

import type { OrderResponse } from '@/types/order';

type PaymentMethod = 'CASH' | 'CARD' | 'QR';

interface PosPaymentProps {
  order: OrderResponse | undefined;
  onPayment: (method: PaymentMethod) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value);

export default function PosPayment({ order, onPayment }: PosPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');

  const subtotal = order?.subtotal ?? 0;
  const discount = order?.discount_amount ?? 0;
  const totalAmount = order?.total_amount ?? 0;

  const disabled = !order || totalAmount <= 0;

  const handlePayment = () => {
    if (disabled) return;

    onPayment(paymentMethod);
  };

  return (
    <aside className='flex w-[360px] shrink-0 flex-col border-l border-gray-200 bg-white xl:w-[380px]'>
      <div className='flex h-14 shrink-0 items-center border-b border-gray-200 px-5'>
        <div>
          <h2 className='text-base font-semibold text-gray-900'>Thanh toán</h2>
          <p className='text-xs text-gray-400'>Tổng tiền hóa đơn</p>
        </div>
      </div>

      <div className='flex flex-1 flex-col justify-end p-5'>
        <div className='rounded-xl border border-gray-200 bg-gray-50 p-4'>
          <div className='space-y-3 text-sm'>
            <div className='flex justify-between text-gray-500'>
              <span>Tạm tính</span>
              <span>{formatCurrency(subtotal)} ₫</span>
            </div>

            <div className='flex justify-between text-gray-500'>
              <span>Giảm giá</span>
              <span>{formatCurrency(discount)} ₫</span>
            </div>

            <div className='flex justify-between border-t border-gray-200 pt-3 text-lg font-semibold text-gray-900'>
              <span>Tổng tiền</span>
              <span>{formatCurrency(totalAmount)} ₫</span>
            </div>
          </div>
        </div>

        <div className='mt-5'>
          <div className='mb-3 text-sm font-medium text-gray-700'>
            Phương thức thanh toán
          </div>

          <div className='grid grid-cols-3 gap-2'>
            <button
              type='button'
              disabled={disabled}
              onClick={() => setPaymentMethod('CASH')}
              className={`flex h-20 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                paymentMethod === 'CASH'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <WalletOutlined className='text-lg' />
              Tiền mặt
            </button>

            <button
              type='button'
              disabled={disabled}
              onClick={() => setPaymentMethod('CARD')}
              className={`flex h-20 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                paymentMethod === 'CARD'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <CreditCardOutlined className='text-lg' />
              Thẻ
            </button>

            <button
              type='button'
              disabled={disabled}
              onClick={() => setPaymentMethod('QR')}
              className={`flex h-20 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                paymentMethod === 'QR'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <BankOutlined className='text-lg' />
              QR
            </button>
          </div>
        </div>

        <Button
          type='primary'
          size='large'
          block
          disabled={disabled}
          className='mt-4 h-12! flex items-center justify-center gap-2'
          onClick={handlePayment}
        >
          <CreditCardOutlined />
          <span>
            Thanh toán{' '}
            {totalAmount > 0 ? `${formatCurrency(totalAmount)} ₫` : ''}
          </span>
        </Button>
      </div>
    </aside>
  );
}
