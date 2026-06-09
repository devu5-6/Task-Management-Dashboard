'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTasks,
  updateTask as updateTaskRequest,
} from '@/services/task-api';
import type { TaskFormValues, TaskItem } from '@/types/task';

export const tasksQueryKey = ['tasks'] as const;

function createOptimisticTask(values: TaskFormValues) {
  const now = new Date().toISOString();

  return {
    id: `optimistic-${crypto.randomUUID()}`,
    title: values.title,
    description: values.description,
    status: values.status,
    dueDate: new Date(values.dueDate).toISOString(),
    createdAt: now,
    updatedAt: now,
  } satisfies TaskItem;
}

export function useTasks() {
  return useQuery({
    queryKey: tasksQueryKey,
    queryFn: async () => {
      const data = await getTasks();
      return data.tasks;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskRequest,
    onMutate: async (values) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey });
      const previousTasks = queryClient.getQueryData<TaskItem[]>(tasksQueryKey) ?? [];
      const optimisticTask = createOptimisticTask(values);

      queryClient.setQueryData<TaskItem[]>(tasksQueryKey, [optimisticTask, ...previousTasks]);

      return { previousTasks };
    },
    onError: (_error, _values, context) => {
      queryClient.setQueryData(tasksQueryKey, context?.previousTasks ?? []);
    },
    onSuccess: (data) => {
      queryClient.setQueryData<TaskItem[]>(tasksQueryKey, (current = []) => [
        data.task,
        ...current.filter((task) => !task.id.startsWith('optimistic-')),
      ]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksQueryKey });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, values }: { taskId: string; values: Partial<TaskFormValues> }) =>
      updateTaskRequest(taskId, values),
    onMutate: async ({ taskId, values }) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey });
      const previousTasks = queryClient.getQueryData<TaskItem[]>(tasksQueryKey) ?? [];

      queryClient.setQueryData<TaskItem[]>(tasksQueryKey, (current = []) =>
        current.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...values,
                description: values.description !== undefined ? values.description : task.description,
                dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : task.dueDate,
                updatedAt: new Date().toISOString(),
              }
            : task
        )
      );

      return { previousTasks };
    },
    onError: (_error, _values, context) => {
      queryClient.setQueryData(tasksQueryKey, context?.previousTasks ?? []);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksQueryKey });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaskRequest,
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey });
      const previousTasks = queryClient.getQueryData<TaskItem[]>(tasksQueryKey) ?? [];

      queryClient.setQueryData<TaskItem[]>(tasksQueryKey, (current = []) =>
        current.filter((task) => task.id !== taskId)
      );

      return { previousTasks };
    },
    onError: (_error, _taskId, context) => {
      queryClient.setQueryData(tasksQueryKey, context?.previousTasks ?? []);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tasksQueryKey });
    },
  });
}
