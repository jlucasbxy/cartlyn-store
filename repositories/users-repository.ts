import type { PrismaInstance } from "@/prisma";
import type { UsersRepository } from "./users-repository.interface";

type Deps = {
  prisma: PrismaInstance;
};

export function createUsersRepository(deps: Deps): UsersRepository {
  async function checkEmailExists(email: string) {
    const user = await deps.prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });
    return user !== null;
  }

  function findActiveByEmail(email: string) {
    return deps.prisma.user.findUnique({
      where: { email, active: true }
    });
  }

  function createUser(data: {
    email: string;
    password: string;
    name: string;
    role: "CLIENT" | "SELLER";
  }) {
    return deps.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
  }

  function deactivateUser(userId: string) {
    return deps.prisma.user.update({
      where: { id: userId },
      data: { active: false }
    });
  }

  function updatePassword(userId: string, password: string) {
    return deps.prisma.user.update({
      where: { id: userId },
      data: { password }
    });
  }

  return {
    checkEmailExists,
    findActiveByEmail,
    createUser,
    updatePassword,
    deactivateUser
  };
}
