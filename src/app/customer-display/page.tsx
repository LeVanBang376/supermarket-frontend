'use client';

import { Spin } from 'antd';
import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useOrderWebSocket } from '@/hooks/useOrderWebSocket';
import { useOrder } from '@/queries/order';
import { useOrderItems } from '@/queries/order-item';

import CustomerDisplay from './CustomerDisplay';

export default function CustomerDisplayPage() {
  const [orderId, setOrderId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const handleOrderUpdated = useCallback(
    (updatedOrderId: string) => {
      setOrderId((currentOrderId) => {
        if (currentOrderId === updatedOrderId) {
          queryClient.invalidateQueries({
            queryKey: ['orders', updatedOrderId],
          });

          queryClient.invalidateQueries({
            queryKey: ['order-items', updatedOrderId],
          });
        }

        return updatedOrderId;
      });
    },
    [queryClient],
  );

  const { status: websocketStatus } = useOrderWebSocket({
    onOrderUpdated: handleOrderUpdated,
  });

  const {
    data: orderResponse,
    isLoading: isLoadingOrder,
    isError: isOrderError,
  } = useOrder(orderId ?? '', !!orderId);

  const {
    data: orderItemsResponse,
    isLoading: isLoadingOrderItems,
    isError: isOrderItemsError,
  } = useOrderItems(orderId ?? '', !!orderId);

  const order = orderResponse?.data;
  const orderItems = orderItemsResponse?.data ?? [];

  const isLoading = isLoadingOrder || isLoadingOrderItems;
  const isError = isOrderError || isOrderItemsError;

  const websocketStatusConfig = {
    connected: {
      label: 'Connected',
      dotClass: 'bg-green-500',
    },
    connecting: {
      label: 'Connecting...',
      dotClass: 'bg-yellow-500',
    },
    disconnected: {
      label: 'Disconnected',
      dotClass: 'bg-red-500',
    },
  };

  const currentStatus = websocketStatusConfig[websocketStatus];

  // Chưa nhận được order từ WebSocket
  if (!orderId) {
    return (
      <main className='relative flex h-dvh items-center justify-center bg-white'>
        <div className='fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm shadow-sm'>
          <span className={`h-2 w-2 rounded-full ${currentStatus.dotClass}`} />

          <span className='text-gray-600'>{currentStatus.label}</span>
        </div>

        <div className='text-center'>
          <h1 className='text-xl font-semibold text-gray-900'>
            Chưa có hóa đơn
          </h1>

          <p className='mt-2 text-sm text-gray-400'>
            Đang chờ thông tin hóa đơn...
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className='relative flex h-dvh items-center justify-center bg-white'>
        <div className='fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm shadow-sm'>
          <span className={`h-2 w-2 rounded-full ${currentStatus.dotClass}`} />

          <span className='text-gray-600'>{currentStatus.label}</span>
        </div>

        <Spin size='large' />
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className='relative flex h-dvh items-center justify-center bg-white'>
        <div className='fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm shadow-sm'>
          <span className={`h-2 w-2 rounded-full ${currentStatus.dotClass}`} />

          <span className='text-gray-600'>{currentStatus.label}</span>
        </div>

        <div className='text-center'>
          <h1 className='text-xl font-semibold text-gray-900'>
            Không thể tải hóa đơn
          </h1>

          <p className='mt-2 text-sm text-gray-400'>Vui lòng thử lại sau.</p>
        </div>
      </main>
    );
  }

  return (
    <main className='relative'>
      <div className='fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-sm shadow-sm'>
        <span className={`h-2 w-2 rounded-full ${currentStatus.dotClass}`} />

        <span className='text-gray-600'>{currentStatus.label}</span>
      </div>

      <CustomerDisplay order={order} orderItems={orderItems} />
    </main>
  );
}
