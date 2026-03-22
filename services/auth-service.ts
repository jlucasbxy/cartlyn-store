import argon2 from "argon2";
import { usersRepository } from "@/repositories";

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1
} as const;

type Deps = {
  usersRepository: typeof usersRepository;
};

export function createAuthService(deps: Deps) {
  async function validateCredentials(email: string, password: string) {
    const user = await deps.usersRepository.findActiveByEmail(email);

    if (!user || !user.active) {
      return null;
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      return null;
    }

    if (argon2.needsRehash(user.password, ARGON2_OPTIONS)) {
      const newHash = await argon2.hash(password, ARGON2_OPTIONS);
      await deps.usersRepository.updatePassword(user.id, newHash);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  }

  return { validateCredentials };
}

export const authService = createAuthService({ usersRepository });
