import { PrismaPg } from "@prisma/adapter-pg";
import { type Prisma, PrismaClient } from "@prisma/client";
import { env } from "@/config/env.config";

export type PrismaInstance = PrismaClient | Prisma.TransactionClient;

export async function runBatch(
  client: PrismaInstance,
  ops: readonly Prisma.PrismaPromise<unknown>[]
) {
  if ("$transaction" in client) return client.$transaction([...ops]);
  for (const op of ops) await op;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({ connectionString: env.databaseUrl });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
