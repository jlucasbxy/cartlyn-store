import { Prisma } from "@prisma/client";

import { toNumber } from "@/lib/price";

describe("toNumber", () => {
  it("returns 0 for null", () => {
    expect(toNumber(null)).toBe(0);
  });

  it("returns 0 for undefined", () => {
    expect(toNumber(undefined)).toBe(0);
  });

  it("returns the number as-is", () => {
    expect(toNumber(42)).toBe(42);
    expect(toNumber(0)).toBe(0);
    expect(toNumber(-5.5)).toBe(-5.5);
  });

  it("parses a valid numeric string", () => {
    expect(toNumber("19.99")).toBe(19.99);
    expect(toNumber("0")).toBe(0);
    expect(toNumber("-10")).toBe(-10);
  });

  it("returns 0 for an invalid string", () => {
    expect(toNumber("abc")).toBe(0);
    expect(toNumber("")).toBe(0);
    expect(toNumber("NaN")).toBe(0);
    expect(toNumber("Infinity")).toBe(0);
  });

  it("converts Prisma.Decimal to number", () => {
    expect(toNumber(new Prisma.Decimal("29.99"))).toBe(29.99);
    expect(toNumber(new Prisma.Decimal(0))).toBe(0);
    expect(toNumber(new Prisma.Decimal("100"))).toBe(100);
  });
});
