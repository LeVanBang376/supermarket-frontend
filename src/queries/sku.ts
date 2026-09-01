'use client';

import { useQuery } from '@tanstack/react-query';

import { getSKUs, GetSKUsParams } from '@/lib/api/sku';

export function useSKUs(params: GetSKUsParams) {
  return useQuery({
    queryKey: ['skus', params],
    queryFn: () => getSKUs(params),
  });
}
