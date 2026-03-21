import type { ErrorCode } from "@/dtos";
import { DomainError } from "./domain-error";

export class ValidationError extends DomainError {
  public readonly status = 400;
  public readonly details?: unknown;

  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(code, message);
    this.details = details;
  }
}
