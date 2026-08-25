'use client';

import { useEffect } from 'react';
import { getMe } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

export function AuthInitializer() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getMe();

        setUser(response.data);
      } catch {
        setUser(null);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, setLoading, router]);

  return null;
}
