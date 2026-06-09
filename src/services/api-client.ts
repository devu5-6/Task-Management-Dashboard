import type { ApiErrorResponse } from '@/types/api';

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors?: Record<string, string[] | undefined>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export async function apiClient<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = (await response.json().catch(() => null)) as T | ApiErrorResponse | null;

  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse | null;
    throw new ApiClientError(
      errorPayload?.message ?? 'Request failed',
      response.status,
      errorPayload?.fieldErrors
    );
  }

  return payload as T;
}
