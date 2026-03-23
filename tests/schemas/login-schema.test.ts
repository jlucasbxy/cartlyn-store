import { loginSchema } from "@/schemas/login-schema";

describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret"
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "secret"
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("email");
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: ""
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toContain("password");
  });

  it("rejects missing fields", () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBeGreaterThanOrEqual(2);
  });
});
