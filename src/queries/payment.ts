'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPayment,
  getPaymentById,
  getPaymentsByOrderId,
} from '@/lib/api/payment';

import type { CreatePaymentRequest } from '@/types/payment';

export function usePaymentsByOrderId(orderId: string, enabled = true) {
  return useQuery({
    queryKey: ['payments', orderId],
    queryFn: () => getPaymentsByOrderId(orderId),
    enabled: enabled && !!orderId,
  });
}

export function usePayment(paymentId: string, enabled = true) {
  return useQuery({
    queryKey: ['payments', paymentId],
    queryFn: () => getPaymentById(paymentId),
    enabled: enabled && !!paymentId,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: CreatePaymentRequest;
    }) => createPayment(orderId, data),

    onSuccess: (_, variables) => {
      // Update order payments
      queryClient.invalidateQueries({
        queryKey: ['payments', variables.orderId],
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
