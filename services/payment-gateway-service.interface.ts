import type { CreditCardPayload, PaymentResult } from "@/dtos";

export interface PaymentGatewayService {
  charge(
    card: CreditCardPayload,
    amountInCents: number
  ): Promise<PaymentResult>;
}
