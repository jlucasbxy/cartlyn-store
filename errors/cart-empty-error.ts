import { ErrorCode } from "@/dtos";
import { ValidationError } from "./validation-error";

export class CartEmptyError extends ValidationError {
  constructor() {
    super(ErrorCode.CART_EMPTY, "Carrinho vazio");
  }
}
