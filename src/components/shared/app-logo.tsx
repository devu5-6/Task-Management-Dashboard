import Link from 'next/link';
import { CheckSquare2 } from 'lucide-react';

export function AppLogo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/dashboard" className="inline-flex items-center gap-3">
      <span className="relative flex size-11 items-center justify-center overflow-hidden rounded-[1.35rem] bg-[linear-gradient(145deg,#fff8fb,#fda4af_58%,#e11d48)] text-white shadow-[0_18px_36px_-18px_rgba(225,29,72,0.5)]">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_46%)]" />
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,rgba(190,24,93,0.25))]" />
        <CheckSquare2 className="relative z-10 size-5" />
      </span>
      <span>
        <span
          className={
            inverted
              ? 'block text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-rose-100/70'
              : 'block text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-rose-500/75'
          }
        >
          TaskFlow
        </span>
        <span
          className={
            inverted
              ? 'block text-lg font-semibold tracking-tight text-white'
              : 'block text-lg font-semibold tracking-tight text-slate-950'
          }
        >
          Management Dashboard
        </span>
      </span>
    </Link>
  );
}
