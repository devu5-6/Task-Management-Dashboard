'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import type { TaskFilterStatus } from '@/types/task';

interface TaskFiltersProps {
  search: string;
  status: TaskFilterStatus;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TaskFilterStatus) => void;
}

export function TaskFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[1.75rem] border border-rose-100 bg-white/80 p-4 shadow-[0_20px_50px_-36px_rgba(15,23,42,0.18)] backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-1">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Workspace view
        </p>
        <p className="text-sm text-neutral-600">
          Search your task list or narrow it down by current status.
        </p>
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full min-w-0 lg:w-[24rem]">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title or description"
            className="h-11 rounded-2xl border-rose-100 bg-white pl-9 shadow-sm focus-visible:border-rose-100 focus-visible:ring-0"
          />
        </div>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as TaskFilterStatus)}
          className="h-11 rounded-2xl border border-rose-100 bg-white px-4 text-sm shadow-sm outline-none focus-visible:border-rose-100 focus-visible:ring-0"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
}
