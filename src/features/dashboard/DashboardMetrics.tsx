import { CheckCircle2, CircleDashed, ListTodo, TrendingUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TaskMetrics } from '@/types/task';

interface DashboardMetricsProps {
  metrics: TaskMetrics;
}

const metricConfig: Array<{
  key: keyof TaskMetrics;
  label: string;
  icon: typeof ListTodo;
  suffix?: string;
}> = [
  {
    key: 'total',
    label: 'Total Tasks',
    icon: ListTodo,
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
  },
  {
    key: 'pending',
    label: 'Pending',
    icon: CircleDashed,
  },
  {
    key: 'completionPercentage',
    label: 'Completion Rate',
    icon: TrendingUp,
    suffix: '%',
  },
];

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metricConfig.map((metric, index) => {
        const Icon = metric.icon;
        const value = metrics[metric.key];

        return (
          <Card
            key={metric.key}
            className="border-rose-100/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,245,249,0.9))] shadow-[0_20px_50px_-32px_rgba(15,23,42,0.24)]"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  {metric.label}
                </p>
                <CardTitle className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
                  {value}
                  {metric.suffix ?? ''}
                </CardTitle>
              </div>
              <span className="rounded-[1.15rem] bg-[linear-gradient(135deg,rgba(244,114,182,0.16),rgba(251,207,232,0.28))] p-3 text-rose-700">
                <Icon className="size-4" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-neutral-500">
                <span>Snapshot</span>
                <span className="font-medium text-neutral-700">
                  {index === 0 ? 'All tasks' : index === 1 ? 'Work completed' : index === 2 ? 'Still open' : 'Current rate'}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
