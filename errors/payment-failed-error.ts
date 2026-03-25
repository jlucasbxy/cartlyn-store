import { ErrorCode } from "@/dtos";
import { ValidationError } from "./validation-error";

export class PaymentFailedError extends ValidationError {
  constructor() {
    super(ErrorCode.PAYMENT_FAILED, "Pagamento recusado");
  }
}
