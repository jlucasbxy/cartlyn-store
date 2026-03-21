import { ErrorCode } from "@/dtos";
import { ValidationError } from "./validation-error";

export class InvalidUserTypeError extends ValidationError {
  constructor() {
    super(ErrorCode.INVALID_USER_TYPE, "Tipo de usuário inválido");
  }
}
