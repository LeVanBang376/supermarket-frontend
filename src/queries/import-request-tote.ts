'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createImportRequestTote,
  deleteImportRequestTote,
  getImportRequestTote,
  getImportRequestTotes,
} from '@/lib/api/import-request-tote';

export function useImportRequestTotes(requestId: string) {
  return useQuery({
    queryKey: ['import-request-totes', requestId],
    queryFn: () => getImportRequestTotes(requestId),
    enabled: !!requestId,
  });
}

export function useImportRequestTote(requestId: string, toteBarcode: string) {
  return useQuery({
    queryKey: ['import-request-totes', requestId, toteBarcode],
    queryFn: () => getImportRequestTote(requestId, toteBarcode),
    enabled: !!requestId && !!toteBarcode,
  });
}

export function useCreateImportRequestTote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      toteBarcode,
    }: {
      requestId: string;
      toteBarcode: string;
    }) => createImportRequestTote(requestId, toteBarcode),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['import-request-totes', variables.requestId],
      });
    },
  });
}

export function useDeleteImportRequestTote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      toteBarcode,
    }: {
      requestId: string;
      toteBarcode: string;
    }) => deleteImportRequestTote(requestId, toteBarcode),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['import-request-totes', variables.requestId],
      });
    },
  });
}
