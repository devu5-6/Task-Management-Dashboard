'use client';

import { useDeferredValue, useState } from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTasks } from '@/hooks/use-tasks';
import type { AuthUser } from '@/types/auth';
import type { TaskFilterStatus, TaskItem, TaskMetrics } from '@/types/task';
import { DashboardMetrics } from '@/features/dashboard/DashboardMetrics';
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header';
import { TaskFilters } from '@/features/dashboard/components/task-filters';
import { TaskFormDialog } from '@/features/dashboard/components/task-form-dialog';
import { TaskList } from '@/features/dashboard/components/task-list';

function computeMetrics(tasks: TaskItem[]): TaskMetrics {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === 'completed').length;
  const pending = total - completed;

  return {
    total,
    completed,
    pending,
    completionPercentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function DashboardShell({ user }: { user: AuthUser }) {
  const { data: tasks = [], isLoading, isError, refetch } = useTasks();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskFilterStatus>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const deferredSearch = useDeferredValue(search);

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = status === 'all' ? true : task.status === status;
    const matchesSearch =
      deferredSearch.trim().length === 0
        ? true
        : `${task.title} ${task.description}`
            .toLowerCase()
            .includes(deferredSearch.trim().toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const metrics = computeMetrics(tasks);

  function openCreateDialog() {
    setSelectedTask(null);
    setDialogOpen(true);
  }

  function openEditDialog(task: TaskItem) {
    setSelectedTask(task);
    setDialogOpen(true);
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(255,250,252,0.98),rgba(255,243,248,0.96))]">
      <DashboardHeader user={user} />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-[linear-gradient(135deg,#111111,#1d1d1f_46%,#412833)] px-5 py-6 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.72)] sm:px-6 sm:py-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(244,114,182,0.16),transparent_30%)]" />
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white/65">
                Daily Overview
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                Welcome back, {user.name.split(' ')[0]}
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                Keep priorities visible, move tasks through completion, and stay ahead of upcoming
                deadlines from one place.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 backdrop-blur">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/50">Open</p>
                  <p className="mt-1 text-2xl font-semibold">{metrics.pending}</p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 backdrop-blur">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/50">Completed</p>
                  <p className="mt-1 text-2xl font-semibold">{metrics.completed}</p>
                </div>
                <div className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 backdrop-blur">
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/50">Momentum</p>
                  <p className="mt-1 text-2xl font-semibold">{metrics.completionPercentage}%</p>
                </div>
              </div>
            </div>
            <div className="relative grid gap-3 rounded-[1.75rem] border border-white/12 bg-white/8 p-4 backdrop-blur-md sm:max-w-sm">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-white/50">This week</p>
                <p className="mt-2 text-lg font-semibold">Aim for steady progress, not a packed list.</p>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#f9a8d4,#fbcfe8)]"
                  style={{ width: `${Math.max(metrics.completionPercentage, 10)}%` }}
                />
              </div>
              <Button
                className="h-11 rounded-2xl bg-white text-neutral-950 shadow-[0_18px_36px_-18px_rgba(255,255,255,0.35)] hover:bg-rose-50"
                onClick={openCreateDialog}
              >
                <Plus className="size-4" />
                Create task
              </Button>
            </div>
          </div>
        </section>

        <DashboardMetrics metrics={metrics} />

        <section className="space-y-4">
          <TaskFilters
            search={search}
            status={status}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
          />

          {isLoading ? (
            <Card className="border-dashed bg-white/70">
              <CardContent className="flex min-h-48 items-center justify-center p-6 text-muted-foreground">
                Loading your tasks...
              </CardContent>
            </Card>
          ) : isError ? (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="flex min-h-48 flex-col items-center justify-center gap-4 p-6 text-center">
                <div>
                  <p className="font-medium text-destructive">Unable to load tasks</p>
                  <p className="text-sm text-muted-foreground">
                    Please retry the request. If the problem persists, verify your backend setup.
                  </p>
                </div>
                <Button variant="outline" onClick={() => refetch()}>
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : filteredTasks.length === 0 ? (
            <Card className="border-dashed bg-white/70">
              <CardContent className="flex min-h-48 flex-col items-center justify-center gap-4 p-6 text-center">
                <div>
                  <p className="font-medium">No tasks match the current view</p>
                  <p className="text-sm text-muted-foreground">
                    Adjust your filters or add a new task to get started.
                  </p>
                </div>
                <Button onClick={openCreateDialog}>Create your first task</Button>
              </CardContent>
            </Card>
          ) : (
            <TaskList tasks={filteredTasks} onEdit={openEditDialog} />
          )}
        </section>
      </main>

      <TaskFormDialog
        open={dialogOpen}
        task={selectedTask}
        onOpenChange={(nextOpen) => {
          setDialogOpen(nextOpen);
          if (!nextOpen) {
            setSelectedTask(null);
          }
        }}
      />
    </div>
  );
}
