import { z } from "@/schemas/zod-config";

export const checkoutSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Número de cartão inválido"),
  cardHolderName: z.string().min(2),
  expiryMonth: z.number().int().min(1).max(12),
  expiryYear: z.number().int().min(new Date().getFullYear()),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV inválido")
});
