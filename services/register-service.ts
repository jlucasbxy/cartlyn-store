import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { EmailAlreadyExistsError } from "@/errors";
import { usersRepository } from "@/repositories";
import type { RegisterInput } from "@/schemas";

async function registerUser(data: RegisterInput) {
  const existingUser = await usersRepository.findByEmail(data.email);

  if (existingUser) {
    throw new EmailAlreadyExistsError();
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  try {
    return await usersRepository.createUser({
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

export const registerService = {
  registerUser
};
