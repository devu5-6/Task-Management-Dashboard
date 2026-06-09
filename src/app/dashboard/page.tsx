import { DashboardShell } from '@/features/dashboard/components/dashboard-shell';
import { requireUser } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await requireUser();

  return <DashboardShell user={user} />;
}
