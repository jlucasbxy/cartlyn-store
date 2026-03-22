import { z } from "@/schemas/zod-config";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
});

