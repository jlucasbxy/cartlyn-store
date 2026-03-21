import type { ErrorCode } from "@/dtos";
import { DomainError } from "./domain-error";

export class NotFoundError extends DomainError {
  public readonly status = 404;

  constructor(code: ErrorCode, message: string) {
    super(code, message);
  }
}
