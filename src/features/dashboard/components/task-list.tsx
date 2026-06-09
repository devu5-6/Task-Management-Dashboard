'use client';

import { format, formatDistanceToNowStrict, isPast, isToday } from 'date-fns';
import { PencilLine, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDeleteTask, useUpdateTask } from '@/hooks/use-tasks';
import type { TaskItem } from '@/types/task';

interface TaskListProps {
  tasks: TaskItem[];
  onEdit: (task: TaskItem) => void;
}

function statusVariant(status: TaskItem['status']) {
  return status === 'completed' ? 'default' : 'secondary';
}

function dueDateLabel(date: string, status: TaskItem['status']) {
  if (status === 'completed') {
    return 'Completed';
  }

  const dueDate = new Date(date);

  if (isToday(dueDate)) {
    return 'Due today';
  }

  if (isPast(dueDate)) {
    return `Overdue by ${formatDistanceToNowStrict(dueDate)}`;
  }

  return `Due in ${formatDistanceToNowStrict(dueDate)}`;
}

export function TaskList({ tasks, onEdit }: TaskListProps) {
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  return (
    <>
      <div className="grid gap-4 lg:hidden">
        {tasks.map((task) => (
          <Card
            key={task.id}
            className="border-rose-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,245,249,0.92))] shadow-[0_24px_50px_-36px_rgba(15,23,42,0.2)]"
          >
            <CardContent className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold tracking-tight text-neutral-950">{task.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    {task.description || 'No description provided.'}
                  </p>
                </div>
                <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
              </div>
              <div className="rounded-2xl bg-rose-50/80 p-3 text-sm text-neutral-500">
                <p className="font-medium text-neutral-700">{dueDateLabel(task.dueDate, task.status)}</p>
                <p className="mt-1">{format(new Date(task.dueDate), 'PPP')}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="cursor-pointer rounded-xl border-rose-100 bg-white"
                  size="sm"
                  onClick={() =>
                    updateTaskMutation.mutate({
                      taskId: task.id,
                      values: {
                        status: task.status === 'completed' ? 'pending' : 'completed',
                      },
                    })
                  }
                >
                  {task.status === 'completed' ? 'Mark pending' : 'Mark completed'}
                </Button>
                <Button variant="outline" className="cursor-pointer rounded-xl border-rose-100 bg-white" size="sm" onClick={() => onEdit(task)}>
                  <PencilLine className="size-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="cursor-pointer rounded-xl"
                  size="sm"
                  onClick={() => deleteTaskMutation.mutate(task.id)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="hidden border-rose-100 bg-white/90 py-0 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.2)] lg:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[linear-gradient(135deg,#2b1d24,#332028_42%,#412833)] hover:bg-[linear-gradient(135deg,#2b1d24,#332028_42%,#412833)]">
                <TableHead className="py-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/65">Task</TableHead>
                <TableHead className="py-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/65">Status</TableHead>
                <TableHead className="py-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/65">Due date</TableHead>
                <TableHead className="py-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/65">Timeline</TableHead>
                <TableHead className="py-4 text-right text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/65">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-transparent">
                  <TableCell className="max-w-md py-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-neutral-950">{task.title}</p>
                      <p className="max-w-md whitespace-normal leading-6 text-neutral-500">
                        {task.description || 'No description provided.'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(task.dueDate), 'PPP')}</TableCell>
                  <TableCell>{dueDateLabel(task.dueDate, task.status)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        className="cursor-pointer rounded-xl border-rose-100 bg-white"
                        size="sm"
                        onClick={() =>
                          updateTaskMutation.mutate({
                            taskId: task.id,
                            values: {
                              status: task.status === 'completed' ? 'pending' : 'completed',
                            },
                          })
                        }
                      >
                        {task.status === 'completed' ? 'Mark pending' : 'Mark completed'}
                      </Button>
                      <Button variant="outline" className="cursor-pointer rounded-xl border-rose-100 bg-white" size="sm" onClick={() => onEdit(task)}>
                        <PencilLine className="size-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        className="cursor-pointer rounded-xl"
                        size="sm"
                        onClick={() => deleteTaskMutation.mutate(task.id)}
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
