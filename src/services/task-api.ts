import { apiClient } from '@/services/api-client';
import type { TaskFormValues, TaskItem } from '@/types/task';

interface TasksResponse {
  tasks: TaskItem[];
}

interface TaskResponse {
  task: TaskItem;
}

export function getTasks() {
  return apiClient<TasksResponse>('/api/tasks');
}

export function createTask(payload: TaskFormValues) {
  return apiClient<TaskResponse>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateTask(taskId: string, payload: Partial<TaskFormValues>) {
  return apiClient<TaskResponse>(`/api/tasks/${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteTask(taskId: string) {
  return apiClient<void>(`/api/tasks/${taskId}`, {
    method: 'DELETE',
  });
}
