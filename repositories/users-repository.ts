import type { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "@/prisma";

type Deps = {
  prisma: PrismaClient | Prisma.TransactionClient;
};

export function createUsersRepository(deps: Deps) {
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

  function deactivateClientAccount(userId: string) {
    const ops = [
      deps.prisma.user.update({
        where: { id: userId },
        data: { active: false }
      }),
      deps.prisma.cartItem.deleteMany({ where: { userId } }),
      deps.prisma.favorite.deleteMany({ where: { userId } })
    ] as const;

    if ("$transaction" in deps.prisma)
      return deps.prisma.$transaction([...ops]);
    return Promise.all(ops);
  }

  function deactivateSellerAccount(userId: string) {
    const ops = [
      deps.prisma.user.update({
        where: { id: userId },
        data: { active: false }
      }),
      deps.prisma.product.updateMany({
        where: { sellerId: userId },
        data: { active: false }
      })
    ] as const;

    if ("$transaction" in deps.prisma)
      return deps.prisma.$transaction([...ops]);
    return Promise.all(ops);
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
    deactivateClientAccount,
    deactivateSellerAccount
  };
}

export const usersRepository = createUsersRepository({ prisma });
