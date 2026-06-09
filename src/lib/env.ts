import 'server-only';

import { z } from 'zod';

const databaseEnvSchema = z.object({
  DATABASE_URL: z.url(),
});

const authEnvSchema = z.object({
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export function getDatabaseUrl() {
  return databaseEnvSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
  }).DATABASE_URL;
}

export function getAuthEnv() {
  return authEnvSchema.parse({
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
  });
}
