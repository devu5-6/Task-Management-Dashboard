import { z } from 'zod';

const dueDateSchema = z.coerce.date().refine((value) => !Number.isNaN(value.getTime()), {
  message: 'Enter a valid due date',
});

export const taskStatusSchema = z.enum(['pending', 'completed']);

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(120, 'Title must be 120 characters or fewer'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must be 500 characters or fewer')
    .optional()
    .transform((value) => value || ''),
  status: taskStatusSchema.default('pending'),
  dueDate: dueDateSchema,
});

export const updateTaskSchema = createTaskSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: 'At least one field is required to update a task',
  }
);

export const taskQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(['pending', 'completed']).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
