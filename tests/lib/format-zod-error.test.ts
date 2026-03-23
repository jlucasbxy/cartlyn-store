import { z } from "zod";

import { formatZodError } from "@/lib/format-zod-error";

describe("formatZodError", () => {
  it("maps zod issues to a path/message record", () => {
    const schema = z.object({
      email: z.string().email(),
      quantity: z.number().min(1)
    });

    const result = schema.safeParse({
      email: "invalid-email",
      quantity: 0
    });

    expect(result.success).toBe(false);

    if (result.success) {
      return;
    }

    expect(formatZodError(result.error)).toEqual({
      email: "Invalid email address",
      quantity: "Too small: expected number to be >=1"
    });
  });
});
