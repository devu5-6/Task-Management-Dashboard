import 'server-only';

import { Prisma, type TaskStatus } from '@prisma/client';

import { AppError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/validations/task';
import type { TaskItem } from '@/types/task';

function serializeTask(task: {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}): TaskItem {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.dueDate.toISOString(),
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

function buildTaskWhereClause(
  userId: string,
  search?: string,
  status?: TaskItem['status']
): Prisma.TaskWhereInput {
  return {
    userId,
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
  };
}

export async function listTasks(
  userId: string,
  filters?: { search?: string; status?: TaskItem['status'] }
) {
  const tasks = await prisma.task.findMany({
    where: buildTaskWhereClause(userId, filters?.search, filters?.status),
    orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
  });

  return tasks.map(serializeTask);
}

export async function getTask(userId: string, taskId: string) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return serializeTask(task);
}

export async function createTask(userId: string, input: CreateTaskInput) {
  const task = await prisma.task.create({
    data: {
      userId,
      title: input.title,
      description: input.description,
      status: input.status,
      dueDate: input.dueDate,
    },
  });

  return serializeTask(task);
}

export async function updateTask(userId: string, taskId: string, input: UpdateTaskInput) {
  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!existingTask) {
    throw new AppError('Task not found', 404);
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(input.title !== undefined ? { title: input.title } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.dueDate !== undefined ? { dueDate: input.dueDate } : {}),
    },
  });

  return serializeTask(task);
}

export async function deleteTask(userId: string, taskId: string) {
  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
    select: {
      id: true,
    },
  });

  if (!existingTask) {
    throw new AppError('Task not found', 404);
  }

  await prisma.task.delete({
    where: { id: taskId },
  });
}
