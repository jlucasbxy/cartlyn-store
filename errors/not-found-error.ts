import { DomainError } from "./domain-error";

export class NotFoundError extends DomainError {
  public readonly status = 404;
}
