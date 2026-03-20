import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	NEXTAUTH_SECRET: z.string().min(1),
	NEXTAUTH_URL: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
	process.exit(1);
}

export const env = {
	databaseUrl: parsed.data.DATABASE_URL,
	nextAuthSecret: parsed.data.NEXTAUTH_SECRET,
	nextAuthUrl: parsed.data.NEXTAUTH_URL,
};
