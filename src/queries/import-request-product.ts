'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getImportRequestProducts,
  getImportRequestToteProducts,
} from '@/lib/api/import-request-product';

export function useImportRequestProducts(requestId: string) {
  return useQuery({
    queryKey: ['import-request-products', requestId],
    queryFn: () => getImportRequestProducts(requestId),
    enabled: !!requestId,
  });
}

export function useImportRequestToteProducts(
  requestId: string,
  toteBarcode: string,
) {
  return useQuery({
    queryKey: ['import-request-tote-products', requestId, toteBarcode],
    queryFn: () => getImportRequestToteProducts(requestId, toteBarcode),
    enabled: !!requestId && !!toteBarcode,
  });
}
