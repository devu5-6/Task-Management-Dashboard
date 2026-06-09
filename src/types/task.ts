export type TaskStatus = 'pending' | 'completed';

export type TaskFilterStatus = 'all' | TaskStatus;

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskMetrics {
  total: number;
  completed: number;
  pending: number;
  completionPercentage: number;
}

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
}
