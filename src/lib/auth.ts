import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify, SignJWT, type JWTPayload } from 'jose';

import { SESSION_COOKIE_NAME } from '@/lib/auth-constants';
import { getAuthEnv } from '@/lib/env';
import { prisma } from '@/lib/prisma';
import type { AuthUser } from '@/types/auth';

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

interface SessionPayload extends JWTPayload {
  sub: string;
  email: string;
  name: string;
}

function getSessionSecret() {
  return new TextEncoder().encode(getAuthEnv().JWT_SECRET);
}

function mapUser(user: { id: string; name: string | null; email: string }): AuthUser {
  return {
    id: user.id,
    name: user.name ?? 'Task Manager User',
    email: user.email,
  };
}

export async function createSessionToken(user: AuthUser) {
  return new SignJWT({
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecret());
}

export async function verifySessionToken(token?: string) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify<SessionPayload>(token, getSessionSecret());
    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: getAuthEnv().NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export const getCurrentSession = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return verifySessionToken(token);
});

export const getCurrentUser = cache(async () => {
  const session = await getCurrentSession();

  if (!session?.sub) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return user ? mapUser(user) : null;
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}
