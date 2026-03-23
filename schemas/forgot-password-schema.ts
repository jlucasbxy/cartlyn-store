import { z } from "@/schemas/zod-config";

export const forgotPasswordSchema = z.object({
  email: z.email()
});
