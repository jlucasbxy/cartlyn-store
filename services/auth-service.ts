import bcrypt from "bcryptjs";
import { usersRepository } from "@/repositories";

async function validateCredentials(email: string, password: string) {
  const user = await usersRepository.findActiveByEmail(email);

  if (!user || !user.active) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
}

export const authService = {
  validateCredentials
};
