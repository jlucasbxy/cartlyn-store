import { ErrorCode } from "@/dtos";
import { NotFoundError } from "./not-found-error";

export class ProductNotFoundError extends NotFoundError {
  constructor() {
    super(ErrorCode.PRODUCT_NOT_FOUND, "Produto não encontrado");
  }
}
