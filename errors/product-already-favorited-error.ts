import { ErrorCode } from "@/dtos";
import { ConflictError } from "./conflict-error";

export class ProductAlreadyFavoritedError extends ConflictError {
  constructor() {
    super(ErrorCode.PRODUCT_ALREADY_FAVORITED, "Produto já está nos favoritos");
  }
}
