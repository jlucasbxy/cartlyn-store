import { ErrorCode } from "@/dtos";
import { ConflictError } from "./conflict-error";

export class EmailAlreadyExistsError extends ConflictError {
  constructor() {
    super(ErrorCode.EMAIL_ALREADY_EXISTS, "Email já cadastrado");
  }
}
