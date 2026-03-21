import type { ErrorCode } from "@/dtos";
import { DomainError } from "./domain-error";

export class ConflictError extends DomainError {
  public readonly status = 409;

  constructor(code: ErrorCode, message: string) {
    super(code, message);
  }
}
