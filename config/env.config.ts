import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
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
        code: "custom",
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
  smtpHost: parsed.SMTP_HOST,
  smtpPort: parsed.SMTP_PORT,
  smtpUser: parsed.SMTP_USER,
  smtpPass: parsed.SMTP_PASS,
  emailFrom: parsed.EMAIL_FROM,
  logLevel:
    parsed.NODE_ENV === "production" ? "warn" : (parsed.LOG_LEVEL ?? "info"),
  nodeEnv: parsed.NODE_ENV
};
