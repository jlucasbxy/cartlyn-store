import type { OutboxEvent, Prisma } from "@prisma/client";

export interface OutboxEventRepository {
  create(data: Prisma.OutboxEventCreateInput): Promise<void>;
  findPendingBatch(limit: number): Promise<OutboxEvent[]>;
  update(
    id: string,
    data: Pick<OutboxEvent, "status" | "retryCount" | "error" | "processedAt">
  ): Promise<OutboxEvent | null>;
  deletePendingByResourceId(resourceId: string): Promise<number>;
}
