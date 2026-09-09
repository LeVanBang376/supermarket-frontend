'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addOrderItem,
  deleteOrderItem,
  getOrderItemById,
  getOrderItems,
  updateOrderItem,
} from '@/lib/api/order-item';

import type {
  AddOrderItemRequest,
  UpdateOrderItemRequest,
} from '@/types/order-item';

export function useOrderItems(orderId: string, enabled = true) {
  return useQuery({
    queryKey: ['order-items', orderId],
    queryFn: () => getOrderItems(orderId),
    enabled: enabled && !!orderId,
  });
}

export function useOrderItem(
  orderId: string,
  skuBarcode: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ['order-items', orderId, skuBarcode],
    queryFn: () => getOrderItemById(orderId, skuBarcode),
    enabled: enabled && !!orderId && !!skuBarcode,
  });
}

export function useAddOrderItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: AddOrderItemRequest;
    }) => addOrderItem(orderId, data),

    onSuccess: (_, variables) => {
      // Update order items
      queryClient.invalidateQueries({
        queryKey: ['order-items', variables.orderId],
      });

      // Update order detail
      queryClient.invalidateQueries({
        queryKey: ['orders', variables.orderId],
      });
    },
  });
}

export function useUpdateOrderItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      skuBarcode,
      data,
    }: {
      orderId: string;
      skuBarcode: string;
      data: UpdateOrderItemRequest;
    }) => updateOrderItem(orderId, skuBarcode, data),

    onSuccess: (_, variables) => {
      // Update item detail
      queryClient.invalidateQueries({
        queryKey: ['order-items', variables.orderId, variables.skuBarcode],
      });

      // Update order items
      queryClient.invalidateQueries({
        queryKey: ['order-items', variables.orderId],
      });

      // Update order detail
      queryClient.invalidateQueries({
        queryKey: ['orders', variables.orderId],
      });
    },
  });
}

export function useDeleteOrderItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      skuBarcode,
    }: {
      orderId: string;
      skuBarcode: string;
    }) => deleteOrderItem(orderId, skuBarcode),

    onSuccess: (_, variables) => {
      // Update order items
      queryClient.invalidateQueries({
        queryKey: ['order-items', variables.orderId],
      });

      // Update order detail
      queryClient.invalidateQueries({
        queryKey: ['orders', variables.orderId],
      });

      // Update order list
      queryClient.invalidateQueries({
        queryKey: ['orders'],
      });
    },
  });
}
