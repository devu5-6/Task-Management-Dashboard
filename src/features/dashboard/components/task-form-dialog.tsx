'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTask, useUpdateTask } from '@/hooks/use-tasks';
import { ApiClientError } from '@/services/api-client';
import type { TaskFormValues, TaskItem } from '@/types/task';

interface TaskFormDialogProps {
  open: boolean;
  task?: TaskItem | null;
  onOpenChange: (open: boolean) => void;
}

type FormErrors = Partial<Record<keyof TaskFormValues, string>>;

const defaultValues: TaskFormValues = {
  title: '',
  description: '',
  status: 'pending',
  dueDate: '',
};

function toInputDate(date: string) {
  return date.slice(0, 10);
}

function getInitialValues(task?: TaskItem | null): TaskFormValues {
  if (!task) {
    return defaultValues;
  }

  return {
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: toInputDate(task.dueDate),
  };
}

export function TaskFormDialog({ open, task, onOpenChange }: TaskFormDialogProps) {
  const formKey = task ? `edit-${task.id}-${open}` : `create-${open}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <TaskFormDialogContent key={formKey} task={task} onOpenChange={onOpenChange} />
    </Dialog>
  );
}

function TaskFormDialogContent({
  task,
  onOpenChange,
}: Pick<TaskFormDialogProps, 'task' | 'onOpenChange'>) {
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const [values, setValues] = useState<TaskFormValues>(() => getInitialValues(task));
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');

  async function handleSubmit() {
    setErrors({});
    setFormError('');

    try {
      if (task) {
        await updateTaskMutation.mutateAsync({
          taskId: task.id,
          values,
        });
      } else {
        await createTaskMutation.mutateAsync(values);
      }

      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiClientError) {
        const fieldErrors = error.fieldErrors ?? {};
        setErrors({
          title: fieldErrors.title?.[0],
          description: fieldErrors.description?.[0],
          status: fieldErrors.status?.[0],
          dueDate: fieldErrors.dueDate?.[0],
        });
        setFormError(error.message);
        return;
      }

      setFormError('Unable to save the task right now. Please try again.');
    }
  }

  const isPending = createTaskMutation.isPending || updateTaskMutation.isPending;

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-xl">{task ? 'Edit task' : 'Create task'}</DialogTitle>
        <DialogDescription>
          {task
            ? 'Update the task details and keep your dashboard accurate.'
            : 'Add a new task with a clear title, due date, and status.'}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            value={values.title}
            onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
            aria-invalid={!!errors.title}
            placeholder="Prepare sprint planning notes"
            className="focus-visible:border-input focus-visible:ring-0"
          />
          {errors.title ? <p className="text-sm text-destructive">{errors.title}</p> : null}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            value={values.description}
            onChange={(event) =>
              setValues((current) => ({ ...current, description: event.target.value }))
            }
            aria-invalid={!!errors.description}
            placeholder="Add any context, blockers, or important follow-up details"
            className="focus-visible:border-input focus-visible:ring-0"
          />
          {errors.description ? (
            <p className="text-sm text-destructive">{errors.description}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              Due date
            </label>
            <Input
              id="dueDate"
              type="date"
              value={values.dueDate}
              onChange={(event) => setValues((current) => ({ ...current, dueDate: event.target.value }))}
              aria-invalid={!!errors.dueDate}
              className="focus-visible:border-input focus-visible:ring-0"
            />
            {errors.dueDate ? <p className="text-sm text-destructive">{errors.dueDate}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              value={values.status}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  status: event.target.value as TaskFormValues['status'],
                }))
              }
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-input focus-visible:ring-0 dark:bg-input/30"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status ? <p className="text-sm text-destructive">{errors.status}</p> : null}
          </div>
        </div>

        {formError ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {formError}
          </div>
        ) : null}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? 'Saving...' : task ? 'Save changes' : 'Create task'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
