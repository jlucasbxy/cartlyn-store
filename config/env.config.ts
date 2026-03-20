import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	NEXTAUTH_SECRET: z.string().min(1),
	NEXTAUTH_URL: z.string().min(1),
});

const parsed = envSchema.parse(process.env);

export const env = {
	databaseUrl: parsed.DATABASE_URL,
	nextAuthSecret: parsed.NEXTAUTH_SECRET,
	nextAuthUrl: parsed.NEXTAUTH_URL,
};
