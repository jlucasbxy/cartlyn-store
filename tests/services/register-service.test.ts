import { Prisma } from "@prisma/client";
import argon2 from "argon2";

import { EmailAlreadyExistsError } from "@/errors";
import { createRegisterService } from "@/services/register-service";

vi.mock("argon2");

const mockArgon2 = vi.mocked(argon2);

function makeUsersRepo(overrides = {}) {
  return {
    checkEmailExists: vi.fn(),
    createUser: vi.fn(),
    ...overrides
  };
}

describe("registerService.registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockArgon2.hash.mockResolvedValue("hashed-password");
  });

  it("throws EmailAlreadyExistsError when email is taken", async () => {
    const repo = makeUsersRepo({
      checkEmailExists: vi.fn().mockResolvedValue(true)
    });
    const service = createRegisterService({ usersRepository: repo as never });

    await expect(
      service.registerUser({
        email: "taken@example.com",
        password: "password",
        name: "Bob",
        role: "CLIENT"
      })
    ).rejects.toThrow(EmailAlreadyExistsError);
  });

  it("hashes the password and creates the user", async () => {
    const createdUser = {
      id: "user-1",
      email: "new@example.com",
      name: "Bob",
      role: "CLIENT"
    };
    const repo = makeUsersRepo({
      checkEmailExists: vi.fn().mockResolvedValue(false),
      createUser: vi.fn().mockResolvedValue(createdUser)
    });
    const service = createRegisterService({ usersRepository: repo as never });

    const result = await service.registerUser({
      email: "new@example.com",
      password: "password",
      name: "Bob",
      role: "CLIENT"
    });

    expect(mockArgon2.hash).toHaveBeenCalledWith(
      "password",
      expect.any(Object)
    );
    expect(repo.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "new@example.com",
        password: "hashed-password"
      })
    );
    expect(result).toEqual(createdUser);
  });

  it("throws EmailAlreadyExistsError on Prisma P2002 (race condition)", async () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      "unique constraint",
      {
        code: "P2002",
        clientVersion: "5.0.0"
      }
    );
    const repo = makeUsersRepo({
      checkEmailExists: vi.fn().mockResolvedValue(false),
      createUser: vi.fn().mockRejectedValue(prismaError)
    });
    const service = createRegisterService({ usersRepository: repo as never });

    await expect(
      service.registerUser({
        email: "new@example.com",
        password: "password",
        name: "Bob",
        role: "CLIENT"
      })
    ).rejects.toThrow(EmailAlreadyExistsError);
  });

  it("rethrows unknown errors", async () => {
    const repo = makeUsersRepo({
      checkEmailExists: vi.fn().mockResolvedValue(false),
      createUser: vi.fn().mockRejectedValue(new Error("db down"))
    });
    const service = createRegisterService({ usersRepository: repo as never });

    await expect(
      service.registerUser({
        email: "new@example.com",
        password: "password",
        name: "Bob",
        role: "CLIENT"
      })
    ).rejects.toThrow("db down");
  });
});
