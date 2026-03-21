import { ErrorCode } from "@/dtos";
import { DomainError } from "./domain-error";

export class UnauthorizedError extends DomainError {
  public readonly status = 403;

  constructor() {
    super(ErrorCode.UNAUTHORIZED, "Não autorizado");
  }
}
