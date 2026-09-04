'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createBranch, getBranches, GetBranchesParams } from '@/lib/api/branch';
import type { CreateBranchRequest } from '@/types/branch';

export function useBranches(params: GetBranchesParams) {
  return useQuery({
    queryKey: ['branches', params],
    queryFn: () => getBranches(params),
  });
}

export function useCreateBranch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBranchRequest) => createBranch(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['branches'],
      });
    },
  });
}
