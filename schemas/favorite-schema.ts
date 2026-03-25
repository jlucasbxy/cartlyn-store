import { z } from "@/schemas/zod-config";

export const favoriteSchema = z.object({
  productId: z.uuid()
});
