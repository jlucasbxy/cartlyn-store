import { ErrorCode } from "@/dtos";
import { ValidationError } from "./validation-error";

export class CartItemsUnavailableError extends ValidationError {
  constructor(details?: unknown) {
    super(ErrorCode.CART_ITEMS_UNAVAILABLE, "Alguns produtos no carrinho não estão mais disponíveis", details);
  }
}
