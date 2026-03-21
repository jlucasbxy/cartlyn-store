import { ErrorCode } from "@/dtos";
import { NotFoundError } from "./not-found-error";

export class CartItemNotFoundError extends NotFoundError {
  constructor() {
    super(ErrorCode.CART_ITEM_NOT_FOUND, "Item não encontrado no carrinho");
  }
}
