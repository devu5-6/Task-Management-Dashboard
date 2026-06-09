import { apiClient } from '@/services/api-client';
import type { AuthResponse } from '@/types/auth';

export interface AuthPayload {
  name?: string;
  email: string;
  password: string;
}

export function register(payload: AuthPayload) {
  return apiClient<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: AuthPayload) {
  return apiClient<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return apiClient<void>('/api/auth/logout', {
    method: 'POST',
  });
}

export function getCurrentUser() {
  return apiClient<AuthResponse>('/api/auth/me');
}
