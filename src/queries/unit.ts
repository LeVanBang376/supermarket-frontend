'use client';

import { useQuery } from '@tanstack/react-query';

import { getUnits } from '@/lib/api/unit';

export function useUnits() {
  return useQuery({
    queryKey: ['units'],
    queryFn: getUnits,
  });
}
