'use client';

import { useQuery } from '@tanstack/react-query';

import { getBranches, GetBranchesParams } from '@/lib/api/branch';

export function useBranches(params: GetBranchesParams) {
  return useQuery({
    queryKey: ['branches', params],
    queryFn: () => getBranches(params),
  });
}
