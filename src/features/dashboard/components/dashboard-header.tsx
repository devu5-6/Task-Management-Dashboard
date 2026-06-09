'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

import { AppLogo } from '@/components/shared/app-logo';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/hooks/use-auth';
import type { AuthUser } from '@/types/auth';

export function DashboardHeader({ user }: { user: AuthUser }) {
  const router = useRouter();
  const logoutMutation = useLogout();
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    await logoutMutation.mutateAsync();
    router.replace('/login');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <AppLogo />
        <div className="flex items-center gap-3">
          <div className="hidden h-10 min-w-[12rem] items-center gap-2.5 rounded-[1.05rem] border border-rose-100 bg-white/90 px-3 shadow-[0_16px_36px_-26px_rgba(15,23,42,0.28)] sm:flex">
            <div className="flex size-8 items-center justify-center rounded-xl bg-[linear-gradient(145deg,#fff1f6,#fda4af_58%,#e11d48)] text-[0.7rem] font-semibold text-white shadow-[0_14px_24px_-18px_rgba(225,29,72,0.65)]">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[0.82rem] font-semibold text-neutral-950">{user.name}</p>
              <p className="truncate text-xs text-neutral-500">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="h-10 min-w-[12rem] cursor-pointer rounded-[1.05rem] border-white/8 bg-[linear-gradient(135deg,#171717,#2a1e24)] px-4 text-sm text-white shadow-[0_16px_36px_-26px_rgba(15,23,42,0.4)] transition-transform hover:-translate-y-0.5 hover:border-rose-300 hover:bg-[linear-gradient(135deg,#2b1d24,#412833)] hover:text-white"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="size-4" />
            {logoutMutation.isPending ? 'Signing out...' : 'Logout'}
          </Button>
        </div>
      </div>
    </header>
  );
}
