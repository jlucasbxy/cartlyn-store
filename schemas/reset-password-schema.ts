import { z } from "@/schemas/zod-config";

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8).max(64),
    confirmPassword: z.string().min(1)
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
  });

export const resetPasswordServerSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(64)
});
