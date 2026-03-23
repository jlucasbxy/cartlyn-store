import { registerSchema } from "@/schemas/register-schema";

describe("registerSchema", () => {
  const valid = {
    email: "user@example.com",
    password: "password123",
    name: "John Doe",
    role: "CLIENT" as const
  };

  it("accepts a valid CLIENT registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a valid SELLER registration", () => {
    expect(registerSchema.safeParse({ ...valid, role: "SELLER" }).success).toBe(
      true
    );
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({ ...valid, email: "bad" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("email");
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = registerSchema.safeParse({ ...valid, password: "short" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("password");
  });

  it("rejects a password longer than 64 characters", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "a".repeat(65)
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("password");
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = registerSchema.safeParse({ ...valid, name: "J" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("name");
  });

  it("rejects an invalid role", () => {
    const result = registerSchema.safeParse({ ...valid, role: "ADMIN" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("role");
  });
});
