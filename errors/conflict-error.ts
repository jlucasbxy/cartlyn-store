import { DomainError } from "./domain-error";

export class ConflictError extends DomainError {
  public readonly status = 409;
}
