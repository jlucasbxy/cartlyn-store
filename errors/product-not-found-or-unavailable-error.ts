import { ErrorCode } from "@/dtos";
import { NotFoundError } from "./not-found-error";

export class ProductNotFoundOrUnavailableError extends NotFoundError {
  constructor() {
    super(
      ErrorCode.PRODUCT_NOT_FOUND_OR_UNAVAILABLE,
      "Produto não encontrado ou indisponível"
    );
  }
}
