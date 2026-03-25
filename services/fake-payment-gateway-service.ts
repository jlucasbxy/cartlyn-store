import { randomUUID } from "node:crypto";
import type { CreditCardPayload, PaymentResult } from "@/dtos";
import type { PaymentGatewayService } from "./payment-gateway-service.interface";

type Options = {
  alwaysFail?: boolean;
  declinedCardNumbers?: Set<string>;
};

export function createFakePaymentGatewayService(
  options: Options = {}
): PaymentGatewayService {
  const { alwaysFail = false, declinedCardNumbers = new Set() } = options;

  async function charge(
    card: CreditCardPayload,
    _amountInCents: number
  ): Promise<PaymentResult> {
    const declined = alwaysFail || declinedCardNumbers.has(card.cardNumber);

    if (declined) {
      return {
        paymentId: randomUUID(),
        status: "FAILED",
        failureReason: "Cartão recusado"
      };
    }

    return {
      paymentId: randomUUID(),
      status: "PAID"
    };
  }

  return { charge };
}
