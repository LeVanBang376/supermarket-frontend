import { ApiResponse } from '@/types/api';
import { User } from '@/types/user';

export async function getMe(): Promise<ApiResponse<User>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
    {
      credentials: 'include',
    },
  );

  if (!response.ok) {
    throw new Error('Unauthenticated');
  }

  return response.json();
}
