'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AppLogo } from '@/components/shared/app-logo';
import { useLogin, useRegister } from '@/hooks/use-auth';
import { ApiClientError } from '@/services/api-client';

interface AuthFormProps {
  mode: 'login' | 'register';
}

type FormErrors = Partial<Record<'name' | 'email' | 'password', string>>;

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const activeMutation = mode === 'login' ? loginMutation : registerMutation;
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');

  async function handleSubmit(formData: FormData) {
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
    };

    setErrors({});
    setFormError('');

    try {
      if (mode === 'login') {
        await loginMutation.mutateAsync({
          email: payload.email,
          password: payload.password,
        });
      } else {
        await registerMutation.mutateAsync(payload);
      }

      router.replace('/dashboard');
      router.refresh();
    } catch (error) {
      if (error instanceof ApiClientError) {
        const fieldErrors = error.fieldErrors ?? {};
        setErrors({
          name: fieldErrors.name?.[0],
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        });
        setFormError(error.message);
        return;
      }

      setFormError('Unable to continue right now. Please try again.');
    }
  }

  return (
    <div className="relative flex min-h-dvh overflow-hidden px-4 py-0 sm:px-6 sm:py-0">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-[130%] rounded-full bg-rose-200/45 blur-3xl" />
        <div className="absolute top-16 right-0 h-96 w-96 translate-x-1/3 rounded-full bg-pink-200/35 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-neutral-300/20 blur-3xl" />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-center">
        <Card className="grid w-full max-w-[71rem] overflow-hidden border border-black/8 bg-white/85 py-0 shadow-[0_32px_100px_-48px_rgba(15,23,42,0.45)] backdrop-blur-xl sm:grid-cols-[1.02fr_0.98fr]">
          <div className="relative hidden overflow-hidden bg-[linear-gradient(165deg,#111111,#1d1d1f_48%,#2f1f27)] px-7 py-5 text-white sm:flex sm:flex-col sm:justify-between lg:min-h-[0]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(244,114,182,0.2),transparent_32%)]" />
            <div className="relative z-10">
              <AppLogo inverted />
            </div>
            <div className="relative z-10 space-y-4 pt-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-white/70">
                Designed for focused work
              </div>
              <div className="space-y-3">
                <h1 className="max-w-md text-[2.2rem] font-semibold leading-[1.01] tracking-tight xl:text-[2.45rem]">
                  Organize your work with calm, clean momentum.
                </h1>
                <p className="max-w-lg text-sm leading-6 text-white/66 xl:text-[0.92rem]">
                  Plan what matters, track progress with intention, and move through your day with
                  less friction and less clutter.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-3 backdrop-blur-md">
                <div className="mx-auto max-w-md space-y-2">
                  <div className="flex items-center justify-between rounded-[1.2rem] border border-white/8 bg-white/6 px-4 py-2">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/40">Today</p>
                      <p className="mt-1 text-sm font-medium text-white/78">Product review deck</p>
                    </div>
                    <span className="rounded-full bg-pink-300/18 px-3 py-1 text-xs font-medium text-pink-100">
                      3 PM
                    </span>
                  </div>
                  <div className="rounded-[1.55rem] bg-[#fff7fb] p-3 text-slate-900 shadow-[0_24px_60px_-36px_rgba(255,255,255,0.5)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">Focus board</p>
                        <p className="mt-1 text-[0.9rem] font-semibold">Three priorities. One clear day.</p>
                      </div>
                      <span className="rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                        Active
                      </span>
                    </div>
                    <div className="mt-2.5 space-y-1.5">
                      <div className="rounded-2xl border border-rose-100 bg-white px-4 py-2">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">Finalize onboarding copy</p>
                            <p className="mt-1 text-xs text-slate-500">Writing sprint</p>
                          </div>
                          <span className="size-3 rounded-full bg-rose-300" />
                        </div>
                      </div>
                      <div className="rounded-2xl border border-black/8 bg-black px-4 py-2 text-white">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">Review release checklist</p>
                            <p className="mt-1 text-xs text-white/55">Operations</p>
                          </div>
                          <span className="size-3 rounded-full bg-pink-300" />
                        </div>
                      </div>
                      <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-2">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">Stakeholder sync notes</p>
                            <p className="mt-1 text-xs text-slate-500">Prep work</p>
                          </div>
                          <span className="size-3 rounded-full bg-black" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[linear-gradient(180deg,rgba(255,252,254,0.96),rgba(255,245,249,0.92))] p-4 sm:p-5 lg:p-5">
            <CardHeader className="px-0">
              <div className="mb-3 sm:hidden">
                <AppLogo />
              </div>
              <div className="mb-2 inline-flex w-fit rounded-full border border-rose-200 bg-rose-100/80 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-rose-700">
                {mode === 'login' ? 'Secure sign in' : 'New workspace access'}
              </div>
              <CardTitle className="text-[1.72rem] tracking-tight text-neutral-950 sm:text-[1.9rem]">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </CardTitle>
              <CardDescription className="max-w-md text-sm leading-6 text-neutral-600">
                {mode === 'login'
                  ? 'Sign in to manage your tasks and dashboard metrics.'
                  : 'Register once and start organizing your daily work.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <form action={handleSubmit} className="space-y-3">
                {mode === 'register' ? (
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-neutral-900">
                      Full name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Aarav Sharma"
                      aria-invalid={!!errors.name}
                      className="h-9 rounded-2xl border-rose-100 bg-white/90 px-4 shadow-[0_12px_30px_-22px_rgba(244,114,182,0.45)] focus-visible:border-rose-100 focus-visible:ring-0"
                    />
                    {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-neutral-900">
                    Email address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    aria-invalid={!!errors.email}
                    className="h-9 rounded-2xl border-rose-100 bg-white/90 px-4 shadow-[0_12px_30px_-22px_rgba(244,114,182,0.45)] focus-visible:border-rose-100 focus-visible:ring-0"
                  />
                  {errors.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-neutral-900">
                    Password
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={mode === 'login' ? 'Enter your password' : 'Minimum 8 characters'}
                    aria-invalid={!!errors.password}
                    className="h-9 rounded-2xl border-rose-100 bg-white/90 px-4 shadow-[0_12px_30px_-22px_rgba(244,114,182,0.45)] focus-visible:border-rose-100 focus-visible:ring-0"
                  />
                  {errors.password ? (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  ) : mode === 'register' ? (
                    <p className="text-sm text-muted-foreground">
                      Use at least 8 characters with letters and numbers.
                    </p>
                  ) : null}
                </div>

                {formError ? (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {formError}
                  </div>
                ) : null}

                <Button
                  className="h-10 w-full rounded-2xl bg-black text-white shadow-[0_24px_40px_-18px_rgba(15,23,42,0.55)] hover:bg-neutral-900"
                  disabled={activeMutation.isPending}
                  type="submit"
                >
                  {activeMutation.isPending
                    ? mode === 'login'
                      ? 'Signing in...'
                      : 'Creating account...'
                    : mode === 'login'
                      ? 'Sign in'
                      : 'Create account'}
                </Button>
              </form>

              <p className="mt-5 text-sm text-neutral-500">
                {mode === 'login' ? 'Need an account?' : 'Already have an account?'}{' '}
                <Link
                  href={mode === 'login' ? '/register' : '/login'}
                  className="font-semibold text-neutral-950 underline underline-offset-4"
                >
                  {mode === 'login' ? 'Register' : 'Sign in'}
                </Link>
              </p>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
