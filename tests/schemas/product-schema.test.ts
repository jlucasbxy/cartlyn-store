import { productSchema } from "@/schemas/product-schema";

describe("productSchema", () => {
  const valid = {
    name: "Cool Product",
    price: 29.99,
    description: "A detailed description of the product",
    imageUrl: "https://example.com/image.jpg"
  };

  it("accepts a valid product", () => {
    expect(productSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = productSchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("name");
  });

  it("rejects a name over 200 characters", () => {
    const result = productSchema.safeParse({ ...valid, name: "a".repeat(201) });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("name");
  });

  it("rejects a non-positive price", () => {
    const result = productSchema.safeParse({ ...valid, price: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("price");
  });

  it("rejects a negative price", () => {
    const result = productSchema.safeParse({ ...valid, price: -1 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("price");
  });

  it("rejects a description shorter than 10 characters", () => {
    const result = productSchema.safeParse({ ...valid, description: "short" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("description");
  });

  it("rejects an invalid image URL", () => {
    const result = productSchema.safeParse({ ...valid, imageUrl: "not-a-url" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("imageUrl");
  });
});
