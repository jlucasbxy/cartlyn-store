import type { OutboxEvent, Prisma } from "@prisma/client";
import { OutboxEventStatus } from "@prisma/client";
import type { PrismaInstance } from "@/prisma";
import type { OutboxEventRepository } from "./outbox-event-repository.interface";

type Deps = {
  prisma: PrismaInstance;
};

export function createOutboxEventRepository(deps: Deps): OutboxEventRepository {
  async function create(data: Prisma.OutboxEventCreateInput): Promise<void> {
    await deps.prisma.outboxEvent.create({ data });
  }

  async function findPendingBatch(limit: number): Promise<OutboxEvent[]> {
    const now = new Date();
    return deps.prisma.$queryRaw<OutboxEvent[]>`
      SELECT id, type, payload, status, "retryCount", error,
             "createdAt", "scheduledFor", "processedAt", "resourceId"
      FROM "OutboxEvent"
      WHERE status = ${OutboxEventStatus.PENDING}
        AND ("scheduledFor" IS NULL OR "scheduledFor" <= ${now})
      ORDER BY id ASC
      LIMIT ${limit}
      FOR UPDATE SKIP LOCKED
    `;
  }

  async function update(
    id: string,
    data: Pick<OutboxEvent, "status" | "retryCount" | "error" | "processedAt">
  ): Promise<OutboxEvent | null> {
    try {
      return await deps.prisma.outboxEvent.update({ where: { id }, data });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "code" in error &&
        (error as { code: string }).code === "P2025"
      ) {
        return null;
      }
      throw error;
    }
  }

  async function deletePendingByResourceId(
    resourceId: string
  ): Promise<number> {
    const result = await deps.prisma.outboxEvent.deleteMany({
      where: { resourceId, status: OutboxEventStatus.PENDING }
    });
    return result.count;
  }

  return { create, findPendingBatch, update, deletePendingByResourceId };
}
