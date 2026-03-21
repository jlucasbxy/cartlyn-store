import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().min(1),
  REDIS_URL: z.string().optional(),
  LOG_LEVEL: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("production")
});

const parsed = envSchema
  .superRefine((data, ctx) => {
    if (
      data.NODE_ENV === "production" &&
      data.LOG_LEVEL &&
      data.LOG_LEVEL !== "warn"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["LOG_LEVEL"],
        message: "LOG_LEVEL must be 'warn' in production"
      });
    }
  })
  .parse(process.env);

export const env = {
  databaseUrl: parsed.DATABASE_URL,
  nextAuthSecret: parsed.NEXTAUTH_SECRET,
  nextAuthUrl: parsed.NEXTAUTH_URL,
  redisUrl: parsed.REDIS_URL,
  logLevel:
    parsed.NODE_ENV === "production" ? "warn" : (parsed.LOG_LEVEL ?? "info"),
  nodeEnv: parsed.NODE_ENV
};
