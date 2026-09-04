'use client';

import { useQuery } from '@tanstack/react-query';

import { getBrands } from '@/lib/api/brand';

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
  });
}
