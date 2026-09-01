'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/queries/auth';
import { useAuthStore } from '@/stores/auth-store';

export function AuthInitializer() {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  const { data, isLoading, isError } = useMe();

  useEffect(() => {
    if (data) {
      setUser(data.data);
    }

    if (isError) {
      setUser(null);
      router.push('/login');
    }

    if (!isLoading) {
      setLoading(false);
    }
  }, [data, isLoading, isError, setUser, setLoading, router]);

  return null;
}
