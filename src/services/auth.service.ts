import 'server-only';

import bcrypt from 'bcryptjs';

import { clearSessionCookie, createSessionToken, setSessionCookie } from '@/lib/auth';
import { AppError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import type { LoginInput, RegisterInput } from '@/lib/validations/auth';
import type { AuthUser } from '@/types/auth';

function toAuthUser(user: { id: string; name: string | null; email: string }): AuthUser {
  return {
    id: user.id,
    name: user.name ?? 'Task Manager User',
    email: user.email,
  };
}

async function persistSession(user: AuthUser) {
  const token = await createSessionToken(user);
  await setSessionCookie(token);
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError('An account with this email already exists', 409, {
      email: ['An account with this email already exists'],
    });
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  const authUser = toAuthUser(user);
  await persistSession(authUser);

  return authUser;
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401, {
      email: ['Invalid email or password'],
    });
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);

  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401, {
      email: ['Invalid email or password'],
    });
  }

  const authUser = toAuthUser(user);
  await persistSession(authUser);

  return authUser;
}

export async function logoutUser() {
  await clearSessionCookie();
}
