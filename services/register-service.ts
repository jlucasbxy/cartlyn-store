import { Prisma } from "@prisma/client";
import argon2 from "argon2";
import type { RegisterDTO } from "@/dtos";
import { EmailAlreadyExistsError } from "@/errors";
import { createUsersRepository } from "@/repositories/users-repository";

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1
} as const;

type Deps = {
  usersRepository: ReturnType<typeof createUsersRepository>;
};

export function createRegisterService(deps: Deps) {
  async function registerUser(data: RegisterDTO) {
    const emailExists = await deps.usersRepository.checkEmailExists(data.email);

    if (emailExists) {
      throw new EmailAlreadyExistsError();
    }

    const hashedPassword = await argon2.hash(data.password, ARGON2_OPTIONS);

    try {
      return await deps.usersRepository.createUser({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new EmailAlreadyExistsError();
      }

      throw error;
    }
  }

  return { registerUser };
}
