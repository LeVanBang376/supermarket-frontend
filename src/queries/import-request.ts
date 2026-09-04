'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  confirmImportRequest,
  createImportRequest,
  getImportRequestById,
  getImportRequests,
  updateImportRequest,
  updateImportRequestStatus,
  type GetImportRequestsParams,
} from '@/lib/api/import-request';

import type {
  CreateImportRequestRequest,
  UpdateImportRequestRequest,
  UpdateImportRequestStatusRequest,
} from '@/types/import-request';

export function useImportRequests(
  params: GetImportRequestsParams,
  enabled = true,
) {
  return useQuery({
    queryKey: ['import-requests', params],
    queryFn: () => getImportRequests(params),
    enabled,
  });
}

export function useImportRequest(requestId: string, enabled = true) {
  return useQuery({
    queryKey: ['import-requests', requestId],
    queryFn: () => getImportRequestById(requestId),
    enabled: enabled && !!requestId,
  });
}

export function useCreateImportRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateImportRequestRequest) => createImportRequest(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['import-requests'],
      });
    },
  });
}

export function useUpdateImportRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: string;
      data: UpdateImportRequestRequest;
    }) => updateImportRequest(requestId, data),

    onSuccess: (_, variables) => {
      // Update request detail
      queryClient.invalidateQueries({
        queryKey: ['import-requests', variables.requestId],
      });

      // Update request list
      queryClient.invalidateQueries({
        queryKey: ['import-requests'],
      });

      // Update products of this request
      queryClient.invalidateQueries({
        queryKey: ['import-request-products', variables.requestId],
      });
    },
  });
}

export function useUpdateImportRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: string;
      data: UpdateImportRequestStatusRequest;
    }) => updateImportRequestStatus(requestId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['import-requests', variables.requestId],
      });

      queryClient.invalidateQueries({
        queryKey: ['import-requests'],
      });
    },
  });
}

export function useConfirmImportRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) => confirmImportRequest(requestId),

    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({
        queryKey: ['import-requests', requestId],
      });

      queryClient.invalidateQueries({
        queryKey: ['import-requests'],
      });
    },
  });
}
