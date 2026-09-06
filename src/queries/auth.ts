'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { getMe, logout } from '@/lib/api/auth';

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    retry: false,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}
