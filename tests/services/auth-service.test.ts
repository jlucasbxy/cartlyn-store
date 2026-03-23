import argon2 from "argon2";

import { createAuthService } from "@/services/auth-service";

vi.mock("argon2");

const mockArgon2 = vi.mocked(argon2);

function makeUsersRepo(overrides = {}) {
  return {
    findActiveByEmail: vi.fn(),
    updatePassword: vi.fn(),
    ...overrides
  };
}

const fakeUser = {
  id: "user-1",
  email: "user@example.com",
  name: "Alice",
  password: "hashed-password",
  active: true,
  role: "CLIENT" as const
};

describe("authService.validateCredentials", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when user is not found", async () => {
    const repo = makeUsersRepo({
      findActiveByEmail: vi.fn().mockResolvedValue(null)
    });
    const service = createAuthService({ usersRepository: repo as never });

    const result = await service.validateCredentials(
      "user@example.com",
      "password"
    );
    expect(result).toBeNull();
  });

  it("returns null when user is inactive", async () => {
    const repo = makeUsersRepo({
      findActiveByEmail: vi
        .fn()
        .mockResolvedValue({ ...fakeUser, active: false })
    });
    const service = createAuthService({ usersRepository: repo as never });

    const result = await service.validateCredentials(
      "user@example.com",
      "password"
    );
    expect(result).toBeNull();
  });

  it("returns null when password is invalid", async () => {
    const repo = makeUsersRepo({
      findActiveByEmail: vi.fn().mockResolvedValue(fakeUser)
    });
    mockArgon2.verify.mockResolvedValue(false);
    const service = createAuthService({ usersRepository: repo as never });

    const result = await service.validateCredentials(
      "user@example.com",
      "wrong"
    );
    expect(result).toBeNull();
  });

  it("returns user data when credentials are valid", async () => {
    const repo = makeUsersRepo({
      findActiveByEmail: vi.fn().mockResolvedValue(fakeUser)
    });
    mockArgon2.verify.mockResolvedValue(true);
    mockArgon2.needsRehash.mockReturnValue(false);
    const service = createAuthService({ usersRepository: repo as never });

    const result = await service.validateCredentials(
      "user@example.com",
      "password"
    );
    expect(result).toEqual({
      id: fakeUser.id,
      email: fakeUser.email,
      name: fakeUser.name,
      role: fakeUser.role
    });
  });

  it("rehashes and updates password when needsRehash returns true", async () => {
    const repo = makeUsersRepo({
      findActiveByEmail: vi.fn().mockResolvedValue(fakeUser),
      updatePassword: vi.fn().mockResolvedValue(undefined)
    });
    mockArgon2.verify.mockResolvedValue(true);
    mockArgon2.needsRehash.mockReturnValue(true);
    mockArgon2.hash.mockResolvedValue("new-hash");
    const service = createAuthService({ usersRepository: repo as never });

    await service.validateCredentials("user@example.com", "password");

    expect(mockArgon2.hash).toHaveBeenCalledWith(
      "password",
      expect.any(Object)
    );
    expect(repo.updatePassword).toHaveBeenCalledWith(fakeUser.id, "new-hash");
  });
});
