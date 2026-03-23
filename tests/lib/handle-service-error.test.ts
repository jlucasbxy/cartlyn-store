import { NextResponse } from "next/server";

import { handleServiceError } from "@/lib/handle-service-error";
import {
  ProductNotFoundError,
  UnauthorizedError,
  CartItemsUnavailableError
} from "@/errors";

vi.mock("next/server", () => ({
  NextResponse: {
    json: vi.fn((body, init) => ({ body, status: init?.status ?? 200 }))
  }
}));

vi.mock("@/lib/logger", () => ({
  logger: { error: vi.fn() }
}));

describe("handleServiceError", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rethrows errors that have a digest string (Next.js redirects/notFound)", () => {
    const digestError = { digest: "NEXT_REDIRECT:push:/login:307" };
    expect(() => handleServiceError(digestError, "fallback")).toThrow();
  });

  it("does not rethrow when digest is not a string", () => {
    const obj = { digest: 123 };
    handleServiceError(obj, "fallback");
    expect(NextResponse.json).toHaveBeenCalled();
  });

  it("returns json with error message, code, and status for DomainError", () => {
    const error = new ProductNotFoundError();
    handleServiceError(error, "fallback");

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: error.message, code: "PRODUCT_NOT_FOUND" },
      { status: 404 }
    );
  });

  it("returns json with 403 status for UnauthorizedError", () => {
    const error = new UnauthorizedError();
    handleServiceError(error, "fallback");

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: error.message, code: "UNAUTHORIZED" },
      { status: 403 }
    );
  });

  it("includes details in body when DomainError has details", () => {
    const inactiveProducts = ["Product A", "Product B"];
    const error = new CartItemsUnavailableError({ inactiveProducts });
    handleServiceError(error, "fallback");

    expect(NextResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ details: { inactiveProducts } }),
      expect.objectContaining({ status: 400 })
    );
  });

  it("returns 500 with fallback message for generic errors", () => {
    handleServiceError(new Error("unexpected"), "something went wrong");

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: "something went wrong" },
      { status: 500 }
    );
  });
});
