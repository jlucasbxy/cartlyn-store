import type { ErrorCode } from "@/dtos";
import { DomainError } from "./domain-error";

export class UnauthorizedError extends DomainError {
  public readonly status = 403;

  constructor(code: ErrorCode, message = "Não autorizado") {
    super(code, message);
  }
}
