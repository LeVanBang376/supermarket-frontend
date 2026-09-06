const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  status: number;
  code?: number;

  constructor(status: number, message: string, code?: number) {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Shared refresh promise.
 *
 * Nếu nhiều request cùng lúc bị 401,
 * chỉ request đầu tiên thực hiện refresh.
 * Các request còn lại sẽ chờ promise này.
 */
let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message || `Refresh failed: ${response.status}`,
      data?.code,
    );
  }
}

async function requestRefresh(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json().catch(() => null);

  // Access token hết hạn
  if (response.status === 401 && endpoint !== '/auth/refresh') {
    try {
      // Chỉ một request thực hiện refresh.
      // Những request 401 khác sẽ chờ request này.
      await requestRefresh();

      // Refresh thành công → retry request ban đầu.
      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const retryData = await retryResponse.json().catch(() => null);

      if (!retryResponse.ok) {
        throw new ApiError(
          retryResponse.status,
          retryData?.message || `API error: ${retryResponse.status}`,
          retryData?.code,
        );
      }

      return retryData as T;
    } catch (error) {
      // Refresh thất bại → session không còn hợp lệ.
      throw error;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message || `API error: ${response.status}`,
      data?.code,
    );
  }

  return data as T;
}
