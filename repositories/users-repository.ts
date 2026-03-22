import type { PrismaClient } from "@prisma/client";
import type { RegisterDTO } from "@/dtos";
import { prisma } from "@/prisma";

type Deps = {
  prisma: PrismaClient;
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

  function createUser(
    data: Omit<RegisterDTO, "password"> & { password: string }
  ) {
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
    return deps.prisma.$transaction([
      deps.prisma.user.update({
        where: { id: userId },
        data: { active: false }
      }),
      deps.prisma.cartItem.deleteMany({
        where: { userId }
      }),
      deps.prisma.favorite.deleteMany({
        where: { userId }
      })
    ]);
  }

  function deactivateSellerAccount(userId: string) {
    return deps.prisma.$transaction([
      deps.prisma.user.update({
        where: { id: userId },
        data: { active: false }
      }),
      deps.prisma.product.updateMany({
        where: { sellerId: userId },
        data: { active: false }
      })
    ]);
  }

  return {
    checkEmailExists,
    findActiveByEmail,
    createUser,
    deactivateClientAccount,
    deactivateSellerAccount
  };
}

export const usersRepository = createUsersRepository({ prisma });
