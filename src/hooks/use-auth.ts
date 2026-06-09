'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getCurrentUser, login, logout, register, type AuthPayload } from '@/services/auth-api';

export const currentUserQueryKey = ['current-user'] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: () => getCurrentUser(),
    retry: false,
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AuthPayload) => register(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(currentUserQueryKey, data);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AuthPayload) => login(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(currentUserQueryKey, data);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: currentUserQueryKey });
      queryClient.removeQueries({ queryKey: ['tasks'] });
    },
  });
}
