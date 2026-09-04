'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { createSKU, getSKUs, GetSKUsParams } from '@/lib/api/sku';

import type { CreateSKURequest } from '@/types/sku';

export function useSKUs(params: GetSKUsParams) {
  return useQuery({
    queryKey: ['skus', params],
    queryFn: () => getSKUs(params),
  });
}

export function useInfiniteSKUs(search: string) {
  return useInfiniteQuery({
    queryKey: ['skus', 'infinite', search],

    queryFn: ({ pageParam }) =>
      getSKUs({
        page: pageParam,
        per_page: 20,
        search,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce(
        (total, page) => total + page.data.length,
        0,
      );

      const total = lastPage.pagination?.total ?? 0;

      if (loaded >= total) {
        return undefined;
      }

      return allPages.length + 1;
    },
  });
}

export function useCreateSKU() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSKURequest) => createSKU(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['skus'],
      });
    },
  });
}
