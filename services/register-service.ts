import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { EmailAlreadyExistsError } from "@/errors";
import { usersRepository } from "@/repositories";
import type { RegisterDTO } from "@/dtos";

type Deps = {
  usersRepository: typeof usersRepository;
};

export function createRegisterService(deps: Deps) {
  async function registerUser(data: RegisterDTO) {
    const existingUser = await deps.usersRepository.findByEmail(data.email);

    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

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

export const registerService = createRegisterService({ usersRepository });
