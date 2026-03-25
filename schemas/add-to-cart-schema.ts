import { z } from "@/schemas/zod-config";

export const addToCartSchema = z.object({
  productId: z.uuid(),
  quantity: z.number().int().positive().default(1)
});
