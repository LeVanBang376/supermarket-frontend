'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrders,
  type GetOrdersParams,
} from '@/lib/api/order';

import type { CreateOrderRequest } from '@/types/order';

export function useOrders(params: GetOrdersParams = {}, enabled = true) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params),
    enabled,
  });
}

export function useOrder(orderId: string, enabled = true) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: enabled && !!orderId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => createOrder(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['orders'],
      });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),

    onSuccess: (_, orderId) => {
      // Update order detail
      queryClient.invalidateQueries({
        queryKey: ['orders', orderId],
      });

      // Update order list
      queryClient.invalidateQueries({
        queryKey: ['orders'],
      });
    },
  });
}
