import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().min(1),
  REDIS_URL: z.string().optional(),
  LOG_LEVEL: z.string().optional()
});

const parsed = envSchema.parse(process.env);

export const env = {
  databaseUrl: parsed.DATABASE_URL,
  nextAuthSecret: parsed.NEXTAUTH_SECRET,
  nextAuthUrl: parsed.NEXTAUTH_URL,
  redisUrl: parsed.REDIS_URL,
  logLevel: parsed.LOG_LEVEL
};
